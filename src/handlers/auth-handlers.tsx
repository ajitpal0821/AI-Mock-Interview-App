import { db } from "@/config/firebase.config";
import type { User } from "@/types";
import { useAuth, useUser } from "@clerk/react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useRef } from "react";

const AuthHandler = () => {
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const syncedUserId = useRef<string | null>(null);

    useEffect(() => {
        const storeUserData = async () => {
            if (isSignedIn && user && syncedUserId.current !== user.id) {
                try {
                    const userRef = doc(db, "users", user.id);
                    const userSnap = await getDoc(userRef);

                    if (!userSnap.exists()) {
                        const userData: User = {
                            id: user.id,
                            name: user.fullName || user.firstName || "Anonymous",
                            email: user.primaryEmailAddress?.emailAddress || 'N/A',
                            imageUrl: user.imageUrl,
                            createdAt: serverTimestamp(),
                            updateAt: serverTimestamp(),
                        };
                        await setDoc(userRef, userData);
                    }
                    syncedUserId.current = user.id;
                } catch (error) {
                    console.error("Error storing user data in Firestore:", error);
                }
            }
        };

        storeUserData();
    }, [isSignedIn, user]);

    return null;
};

export default AuthHandler;


