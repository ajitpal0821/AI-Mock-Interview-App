import { db } from '@/config/firebase.config';
import type { Interview, UserAnswer } from '@/types';
import { useAuth } from '@clerk/react';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner';
import { LoaderPage } from './loader-page';
import { CustomBreadCrumb } from '@/components/ui/custom-breadcrumb';
import { Headings } from '@/components/ui/headings';
import { InterviewPin } from '@/components/ui/InterviewPin';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { CircleCheck } from 'lucide-react';

const feedback = () => {

    const { interviewId } = useParams<{ interviewId: string }>();
    const [interview, setInterview] = useState<Interview | null>(null);
    const [isloading, setLoading] = useState(false);
    const [feedbacks, setFeedbacks] = useState<UserAnswer[]>([]);

    const [activeFeed, setActiveFeed] = useState("");
    const { userId } = useAuth();
    const navigate = useNavigate();

    if (!interviewId) {
        navigate("/generate", { replace: true })
    }
    useEffect(() => {
        const fetchInterview = async () => {
            if (interviewId) {
                try {
                    const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
                    if (interviewDoc.exists()) {
                        setInterview({ id: interviewId, ...interviewDoc.data() } as Interview)
                    }
                } catch (error) {
                    console.log(error);
                    toast.error("Error", {
                        description: "Something weng wroing.Please try again later"
                    })
                }
            }
        }
        const fetchFeedback = async () => {
            setLoading(true);

            try {
                const feedQueryResult = query(collection(db, "userAnswers"), where("userId", "==", userId), where("mockIdRef", "==", interviewId));
                const querySnap = await getDocs(feedQueryResult);
                const interviewData: UserAnswer[] = querySnap.docs.map((doc) => {
                    return { id: doc.id, ...doc.data() } as UserAnswer
                })
                setFeedbacks(interviewData)
            } catch (error) {
                console.log(error);
                toast("Error", {
                    description: "Something went wrong,Please try again later.."
                })
            } finally {
                setLoading(false)
            }
        }
        fetchInterview();
        fetchFeedback();
    }, [interviewId, navigate, userId]);

    // calculate rating

    const overAllRating = useMemo(() => {
        if (feedbacks.length == 0)
            return "0.0";

        const totalRatings = feedbacks.reduce((acc, feedback) =>
            acc + feedback.aiRating, 0);

        return (totalRatings / feedbacks.length).toFixed(1)
    }, [feedbacks])

    if (isloading) {
        return <LoaderPage className="w-full h-[70vh]"></LoaderPage>
    }

    return (
        <div className="flex flex-col w-full gap-8 py-5">
            <div className="flex items-center justify-between w-full gap-2">
                <CustomBreadCrumb
                    breadCrumbPage={"Feedback"}
                    breadCrumbItems={[{ label: "Mock Interviews", link: "/generate" }]}
                />
            </div>
            <Headings title="Congratulations!" description='Ypur Personalized feedback is now available.Dive in to see your strengths,areas for improvement, and tips to help you ace your next interview' />
            <p className='text-base text-muted-foreground'>
                Your Overall Interview rating:{""}
                <span className='text-emperald-500 font-semibold text-xl'>
                    {overAllRating}/10
                </span>
            </p>
            {interview && <InterviewPin interview={interview} ontMockPage />}

            <Headings title='Interview Feedback' isSubHeading />
            {feedbacks && feedbacks.map((feed) => (
                <AccordionItem
                    key={feed.id}
                    value={feed.id}
                    className="border rounded-lg shadow-md"
                >
                    <AccordionTrigger
                        onClick={() => setActiveFeed(feed.id)}
                        className={cn(
                            "px-5 py-3 flex items-center justify-between text-base rounded-t-lg transition-colors hover:no-underline",
                            activeFeed === feed.id
                                ? "bg-gradient-to-r from-purple-50 to-blue-50"
                                : "hover:bg-gray-50"
                        )}
                    >
                        <span>{feed.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className='px-5 py-6 bg-white rounded-b-lg space-y-5 shadow-inner'>
                        <div className="text-lg font-semibold to-gray-700">
                            <div className="inline mr-2 text-yellow-400">
                                Rating:{feed.aiRating}
                            </div>

                        </div>
                        <Card className="border-none space-y-3 p-4 bg-green-50 rounded-lg shadow-md">
                  <CardTitle className="flex items-center text-lg">
                    <CircleCheck className="mr-2 text-green-600" />
                    Expected Answer
                  </CardTitle>

                  <CardDescription className="font-medium text-gray-700">
                    {feed.correctanswer}
                  </CardDescription>
                </Card>

                <Card className="border-none space-y-3 p-4 bg-yellow-50 rounded-lg shadow-md">
                  <CardTitle className="flex items-center text-lg">
                    <CircleCheck className="mr-2 text-yellow-600" />
                    Your Answer
                  </CardTitle>

                  <CardDescription className="font-medium text-gray-700">
                    {feed.useranswer}
                  </CardDescription>
                </Card>

                <Card className="border-none space-y-3 p-4 bg-red-50 rounded-lg shadow-md">
                  <CardTitle className="flex items-center text-lg">
                    <CircleCheck className="mr-2 text-red-600" />
                    Feedback
                  </CardTitle>

                  <CardDescription className="font-medium text-gray-700">
                    {feed.aiFeedback}
                  </CardDescription>
                </Card>
                    </AccordionContent>
                    
                </AccordionItem>
            ))}

        </div>

    )
}

export default feedback
