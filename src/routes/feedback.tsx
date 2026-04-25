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

const Feedback = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isloading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<UserAnswer[]>([]);
  const [activeFeed, setActiveFeed] = useState("");

  const { userId } = useAuth();
  const navigate = useNavigate();

  // ✅ FIX: navigation inside useEffect
  useEffect(() => {
    if (!interviewId) {
      navigate("/generate", { replace: true });
    }
  }, [interviewId, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!interviewId || !userId) return;

      setLoading(true);

      try {
        // fetch interview
        const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
        if (interviewDoc.exists()) {
          setInterview({ id: interviewId, ...interviewDoc.data() } as Interview);
        }

        // fetch feedback
        const feedQueryResult = query(
          collection(db, "answers"),
          where("userId", "==", userId),
          where("mockIdRef", "==", interviewId)
        );

        const querySnap = await getDocs(feedQueryResult);

        const interviewData: UserAnswer[] = querySnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as UserAnswer[];

        if (interviewData.length === 0) {
          toast("No Answers Found");
        } else {
          setFeedbacks(interviewData);
        }

      } catch (error) {
        console.log(error);
        toast.error("Error", {
          description: "Something went wrong. Please try again later",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [interviewId, userId]);

  // ✅ safer rating
  const overAllRating = useMemo(() => {
    if (feedbacks.length === 0) return "0.0";

    const totalRatings = feedbacks.reduce(
      (acc, feedback) => acc + (feedback.aiRating || 0),
      0
    );

    return (totalRatings / feedbacks.length).toFixed(1);
  }, [feedbacks]);

  // ✅ auto open first
  useEffect(() => {
    if (feedbacks.length > 0) {
      setActiveFeed(feedbacks[0].id);
    }
  }, [feedbacks]);

  if (isloading) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }

  return (
    <div className="flex flex-col w-full gap-8 py-5">
      <CustomBreadCrumb
        breadCrumbPage="Feedback"
        breadCrumbItems={[{ label: "Mock Interviews", link: "/generate" }]}
      />

      <Headings
        title="Congratulations!"
        description="Your personalized feedback is now available. Dive in to see your strengths, areas for improvement, and tips to improve."
      />

      <p className="text-base text-muted-foreground">
        Your Overall Interview rating:{" "}
        <span className="text-emerald-500 font-semibold text-xl">
          {overAllRating}/10
        </span>
      </p>

      {interview && <InterviewPin interview={interview} ontMockPage />}

      <Headings title="Interview Feedback" isSubHeading />

      {/* ✅ FIX: Accordion wrapper */}
      <Accordion type="single" collapsible className="w-full space-y-4">
        {feedbacks.map((feed) => (
          <AccordionItem
            key={feed.id}
            value={feed.id}
            className="border rounded-lg shadow-md"
          >
            <AccordionTrigger
              onClick={() => setActiveFeed(feed.id)}
              className={cn(
                "px-5 py-3 flex items-center justify-between text-base rounded-t-lg",
                activeFeed === feed.id
                  ? "bg-gradient-to-r from-purple-50 to-blue-50"
                  : "hover:bg-gray-50"
              )}
            >
              <span>{feed.question}</span>
            </AccordionTrigger>

            <AccordionContent className="px-5 py-6 bg-white rounded-b-lg space-y-5">
              <div className="text-lg font-semibold text-gray-700">
                <span className="text-yellow-500">
                  Rating: {feed.aiRating}
                </span>
              </div>

              <Card className="p-4 bg-green-50">
                <CardTitle className="flex items-center text-lg">
                  <CircleCheck className="mr-2 text-green-600" />
                  Expected Answer
                </CardTitle>
                <CardDescription>{feed.correctanswer}</CardDescription>
              </Card>

              <Card className="p-4 bg-yellow-50">
                <CardTitle className="flex items-center text-lg">
                  <CircleCheck className="mr-2 text-yellow-600" />
                  Your Answer
                </CardTitle>
                <CardDescription>{feed.useranswer}</CardDescription>
              </Card>

              <Card className="p-4 bg-red-50">
                <CardTitle className="flex items-center text-lg">
                  <CircleCheck className="mr-2 text-red-600" />
                  Feedback
                </CardTitle>
                <CardDescription>{feed.aiFeedback}</CardDescription>
              </Card>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Feedback;