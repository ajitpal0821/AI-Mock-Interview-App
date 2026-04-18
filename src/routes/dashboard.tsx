import { Button } from '@/components/ui/button'
import { Headings } from '@/components/ui/headings'
import { InterviewPin } from '@/components/ui/InterviewPin'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { db } from '@/config/firebase.config'
import type { Interview } from '@/types'
import { useAuth } from '@clerk/react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

export const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const { userId } = useAuth();
    const [interviews, setInterviews] = useState<Interview[]>([]);

    useEffect(() => {
        const fetchInterviews = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, "interviews"), where("userId", "==", userId));
                const querySnapshot = await getDocs(q);
                const fetchedInterviews: Interview[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedInterviews.push({ ...(doc.data() as Interview), id: doc.id });
                });
                setInterviews(fetchedInterviews);
            } catch (error) {
                toast.error("Failed to fetch interviews",{description:"Please try again later"});
                console.log("Error fetching interviews:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchInterviews();
    }, [userId]);
    return (
        <>
            <div className="flex w-full items-center justify-between">
                <Headings title='DashBoard' description='Create and start you AI Mock interview'></Headings>
                <Link to={"/generate/create"}>
                    <Button size={"sm"}>
                        <Plus />Add New
                    </Button>
                </Link>
            </div>
            <Separator className="my-8" />
            <div className="md:grid md:grid-cols-3 gap-3 py-4">
                {loading ?Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="w-full h-32 rounded-md bg-muted animate-pulse" />
                )): interviews.length > 0 ? interviews.map((interview) => (
                    <InterviewPin key={interview.id} interview={interview} 
                    // <Link to={`/generate/${interview.id}`} key={interview.id} className="w-full p-4 rounded-md border border-muted hover:bg-muted transition">
                    //     <h3 className="text-lg font-semibold">{interview.position}</h3>
                    //     <p className="text-sm text-muted-foreground mt-1">{interview.description}</p>           
                    // </Link>
                    />
                )) : <p className="text-center text-muted-foreground col-span-3">No interviews found. Create your first interview!</p>}
            </div>
        </>
    )
}
