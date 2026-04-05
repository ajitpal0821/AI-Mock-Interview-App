import { db } from "@/config/firebase.config";
import { LoaderPage } from "@/routes/loader-page";
import type { User } from "@/types";
import { useAuth, useUser } from "@clerk/react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthHandler = () => {

    const { isSignedIn } = useAuth();
    const { user } = useUser();

    const pathname = useLocation().pathname;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    // console.log("key",import.meta.env.VITE_FIREBASE_API_KEY);
    useEffect(() => {
        const storeUserData = async () => {
            if (isSignedIn && user) {
                setLoading(true)
                try {
                    const userSnap = await getDoc(doc(db, "users", user.id));

                    if (!userSnap.exists()) {
                        const userData:User = {
                            id: user.id,
                            name: user.fullName || user.firstName || "Anonymous",
                            email: user.primaryEmailAddress?.emailAddress || 'N/A',
                            imageUrl: user.imageUrl,
                            createdAt: serverTimestamp(),
                             updateAt: serverTimestamp(),
                        }
                        await setDoc(doc(db, "users", user.id), userData)
                        console.log("entry saved successfully")
                    }

                } catch (error) {
                    console.log("error on storing user data", error)
                }finally{
                    setLoading(false)
                }
            }
        };

        storeUserData();

    }, [isSignedIn, user, navigate, pathname])
    if (loading) {
        return <LoaderPage />
    }

    return null
};


export default AuthHandler;


