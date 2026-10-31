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
                toast.error("Unable to load scenarios", { description: "Please refresh or try again later." });
                console.error("Error fetching interviews:", error);
            } finally {
                setLoading(false);
            }
        };
        if (userId) {
            fetchInterviews();
        }
    }, [userId]);

    return (
        <div className="w-full space-y-8">
            {/* Top Studio Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Headings 
                    title="Interview Studio" 
                    description="Configure, rehearse, and review targeted technical and behavioral interview scenarios."
                />
                <Link to="/generate/create">
                    <Button className="rounded-full bg-[#1d1d1f] hover:bg-black dark:bg-white dark:hover:bg-[#f5f5f7] dark:text-[#1d1d1f] text-white text-xs px-4 py-2 font-medium shadow-none flex items-center gap-1.5 transition-all">
                        <Plus className="w-3.5 h-3.5" />
                        <span>New Scenario</span>
                    </Button>
                </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#fbfbfd] dark:bg-[#121215] border border-[#d2d2d7]/60 dark:border-neutral-800 text-xs">
                <div className="space-y-0.5">
                    <p className="text-[#86868b]">Configured Scenarios</p>
                    <p className="text-xl font-semibold tracking-tight text-[#1d1d1f] dark:text-white">
                        {loading ? "—" : interviews.length}
                    </p>
                </div>
                <div className="space-y-0.5">
                    <p className="text-[#86868b]">Questions Per Session</p>
                    <p className="text-xl font-semibold tracking-tight text-[#1d1d1f] dark:text-white">
                        5
                    </p>
                </div>
                <div className="col-span-2 sm:col-span-1 space-y-0.5">
                    <p className="text-[#86868b]">Camera Stream</p>
                    <p className="text-sm font-semibold tracking-tight text-emerald-600 flex items-center gap-1.5 pt-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Private & On-Device
                    </p>
                </div>
            </div>

            {/* Scenarios Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="rounded-2xl border border-[#d2d2d7]/50 p-6 space-y-4 animate-pulse">
                            <Skeleton className="h-5 w-3/4 rounded-md" />
                            <Skeleton className="h-4 w-full rounded-md" />
                            <Skeleton className="h-4 w-2/3 rounded-md" />
                            <div className="pt-4 flex gap-2">
                                <Skeleton className="h-7 w-16 rounded-full" />
                                <Skeleton className="h-7 w-16 rounded-full" />
                            </div>
                        </div>
                    ))
                ) : interviews.length > 0 ? (
                    interviews.map((interview) => (
                        <InterviewPin 
                            key={interview.id} 
                            interview={interview} 
                            onDelete={(deletedId) => setInterviews((prev) => prev.filter((i) => i.id !== deletedId))}
                        />
                    ))
                ) : (
                    /* Clean Apple-style Empty State */
                    <div className="col-span-full py-16 px-6 rounded-3xl border border-dashed border-[#d2d2d7] dark:border-neutral-800 bg-[#fbfbfd] dark:bg-[#121215] flex flex-col items-center text-center space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-neutral-800 border border-[#d2d2d7]/60 dark:border-neutral-700 flex items-center justify-center">
                            <img src="/assets/svg/logo.svg" alt="MockAI" className="w-6 h-6 object-contain opacity-60" />
                        </div>
                        <div className="space-y-1.5 max-w-sm">
                            <h3 className="text-base font-semibold text-[#1d1d1f] dark:text-white tracking-tight">
                                No interview scenarios yet
                            </h3>
                            <p className="text-xs text-[#86868b] leading-relaxed">
                                Create your first customized scenario specifying job role, experience level, 
                                and technical stack to begin practicing.
                            </p>
                        </div>
                        <Link to="/generate/create" className="pt-2">
                            <Button className="rounded-full bg-[#1d1d1f] hover:bg-black dark:bg-white dark:hover:bg-[#f5f5f7] dark:text-[#1d1d1f] text-white text-xs px-5 py-2 font-medium shadow-none">
                                Create First Scenario
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
