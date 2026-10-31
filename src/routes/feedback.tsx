import { db } from "@/config/firebase.config";
import type { Interview, UserAnswer } from "@/types";
import { useAuth } from "@clerk/react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { LoaderPage } from "./loader-page";
import { CustomBreadCrumb } from "@/components/ui/custom-breadcrumb";
import { Headings } from "@/components/ui/headings";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Sparkles,
  Mic,
  RotateCcw,
  LayoutDashboard,
  Award,
  BookOpen,
  Printer,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/ui/confirm-modal";

const Feedback = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isloading, setLoading] = useState(false);
  const [isResetting, setResetting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState<UserAnswer[]>([]);
  const [activeFeed, setActiveFeed] = useState("");

  const { userId } = useAuth();
  const navigate = useNavigate();

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
        // Fetch interview scenario
        const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
        if (interviewDoc.exists()) {
          setInterview({ id: interviewId, ...interviewDoc.data() } as Interview);
        } else {
          toast.error("Scenario not found", {
            description: "The requested interview scenario does not exist or has been deleted.",
          });
          navigate("/generate", { replace: true });
          return;
        }

        // Fetch user's recorded answers
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

        setFeedbacks(interviewData);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        toast.error("Error", {
          description: "Something went wrong while loading your report. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [interviewId, userId, navigate]);

  const handleResetResponses = async () => {
    if (!interviewId || !userId) return;

    try {
      setResetting(true);
      const feedQueryResult = query(
        collection(db, "answers"),
        where("userId", "==", userId),
        where("mockIdRef", "==", interviewId)
      );
      const querySnap = await getDocs(feedQueryResult);
      const deletePromises = querySnap.docs.map((d) => deleteDoc(d.ref));
      await Promise.all(deletePromises);

      setFeedbacks([]);
      setIsConfirmOpen(false);
      toast.success("Responses cleared", {
        description: "Your answers have been reset. Redirecting to rehearsal studio...",
      });
      navigate(`/generate/interview/${interviewId}/start`);
    } catch (error) {
      console.error("Error resetting answers:", error);
      toast.error("Failed to reset responses");
    } finally {
      setResetting(false);
    }
  };

  // Overall rating calculation
  const overAllRating = useMemo(() => {
    if (feedbacks.length === 0) return "0.0";

    const totalRatings = feedbacks.reduce(
      (acc, feedback) => acc + (feedback.aiRating || 0),
      0
    );

    return (totalRatings / feedbacks.length).toFixed(1);
  }, [feedbacks]);

  // Auto open first accordion item
  useEffect(() => {
    if (feedbacks.length > 0 && !activeFeed) {
      setActiveFeed(feedbacks[0].id);
    }
  }, [feedbacks, activeFeed]);

  const ratingNumeric = Number(overAllRating);

  const performanceTier = useMemo(() => {
    if (feedbacks.length === 0) return { label: "Pending", color: "text-[#86868b] bg-neutral-100" };
    if (ratingNumeric >= 8.5) return { label: "Exceptional Candidate", color: "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800" };
    if (ratingNumeric >= 7.0) return { label: "Strong Candidate", color: "text-blue-700 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800" };
    if (ratingNumeric >= 5.0) return { label: "Developing Proficiency", color: "text-amber-700 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800" };
    return { label: "Needs Targeted Practice", color: "text-red-700 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800" };
  }, [ratingNumeric, feedbacks.length]);

  if (isloading) {
    return (
      <LoaderPage
        className="w-full h-[60vh]"
        title="Analyzing Performance..."
        description="Compiling your question evaluations and feedback summary"
      />
    );
  }

  if (!interview) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 py-2">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <CustomBreadCrumb
          breadCrumbPage="Performance Report"
          breadCrumbItems={[
            { label: "Interview Studio", link: "/generate" },
            { label: interview?.position || "Session", link: `/generate/interview/${interviewId}` },
          ]}
        />

        <div className="flex items-center gap-2 flex-wrap">
          {/* Export PDF Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.print()}
            className="rounded-full text-xs h-8 px-3 border-[#d2d2d7] dark:border-neutral-700 text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-neutral-100 dark:hover:bg-neutral-800 shadow-none flex items-center gap-1"
            title="Print or save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-[#86868b]" />
            <span>Export PDF</span>
          </Button>

          {/* Reset Answers Button */}
          {feedbacks.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              disabled={isResetting}
              onClick={() => setIsConfirmOpen(true)}
              className="rounded-full text-xs h-8 px-3 border-red-200 text-red-600 dark:border-red-900/50 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 shadow-none flex items-center gap-1"
              title="Clear all responses and retake"
            >
              {isResetting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              <span>Clear & Retake</span>
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            asChild
            className="rounded-full text-xs h-8 px-3 border-[#d2d2d7] dark:border-neutral-700 text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-neutral-100 dark:hover:bg-neutral-800 shadow-none"
          >
            <Link to="/generate">
              <LayoutDashboard className="w-3.5 h-3.5 mr-1 text-[#86868b]" />
              Studio Dashboard
            </Link>
          </Button>

          <Button
            size="sm"
            asChild
            className="rounded-full text-xs h-8 px-3 bg-[#1d1d1f] hover:bg-black dark:bg-white dark:hover:bg-[#f5f5f7] text-white dark:text-[#1d1d1f] shadow-none flex items-center gap-1"
          >
            <Link to={`/generate/interview/${interviewId}`}>
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Interview
            </Link>
          </Button>
        </div>
      </div>

      {/* Apple Performance Scorecard Hero */}
      <div className="rounded-3xl border border-[#d2d2d7]/70 dark:border-neutral-800 bg-white dark:bg-[#121215] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Scenario Info */}
          <div className="space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">
              Interview Assessment Report
            </span>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
              {interview?.position || "Mock Interview"}
            </h1>
            <p className="text-xs sm:text-sm text-[#86868b] max-w-lg leading-relaxed">
              Objective, question-by-question evaluation evaluating response accuracy, communication structure, and technical depth.
            </p>

            {/* Tech Stack Pills */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {interview?.techStack?.split(",").map((tech, i) => (
                <span
                  key={i}
                  className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#f5f5f7] dark:bg-neutral-800 text-[#1d1d1f] dark:text-[#f5f5f7] border border-[#d2d2d7]/40 dark:border-neutral-700/50"
                >
                  {tech.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Rating Display Badge */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#fbfbfd] dark:bg-neutral-900/60 border border-[#d2d2d7]/60 dark:border-neutral-800 text-center min-w-[200px]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b] mb-1">
              Overall Score
            </span>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">
                {overAllRating}
              </span>
              <span className="text-sm font-medium text-[#86868b]">/ 10</span>
            </div>
            <span
              className={cn(
                "text-[11px] font-medium px-3 py-1 rounded-full border mt-2",
                performanceTier.color
              )}
            >
              {performanceTier.label}
            </span>
          </div>
        </div>

        {/* Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-[#f5f5f7] dark:border-neutral-800/80">
          <div className="p-3.5 rounded-xl bg-[#fbfbfd] dark:bg-neutral-900/40 border border-[#d2d2d7]/40 dark:border-neutral-800">
            <span className="text-[11px] text-[#86868b] block">Questions Evaluated</span>
            <span className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
              {feedbacks.length} of {interview?.questions?.length || feedbacks.length}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#fbfbfd] dark:bg-neutral-900/40 border border-[#d2d2d7]/40 dark:border-neutral-800">
            <span className="text-[11px] text-[#86868b] block">Completion Rate</span>
            <span className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
              {interview?.questions?.length
                ? `${Math.round((feedbacks.length / interview.questions.length) * 100)}%`
                : "100%"}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#fbfbfd] dark:bg-neutral-900/40 border border-[#d2d2d7]/40 dark:border-neutral-800 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-[#86868b] block">Target Standard</span>
            <span className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
              {ratingNumeric >= 7 ? "Achieved" : "In Progress"}
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown Section */}
      <div className="space-y-4">
        <Headings
          title="Question Breakdown"
          description="Examine each question's expected answer alongside your spoken response and actionable feedback."
          isSubHeading
        />

        {/* Empty State */}
        {feedbacks.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-[#d2d2d7] dark:border-neutral-800 bg-white dark:bg-[#121215] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] dark:bg-neutral-800 flex items-center justify-center mx-auto text-[#86868b]">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-[#1d1d1f] dark:text-white">
                No Evaluated Answers Yet
              </h3>
              <p className="text-xs text-[#86868b] max-w-sm mx-auto">
                You haven&apos;t recorded or saved any answers for this session. Launch the interview studio to start speaking.
              </p>
            </div>
            <Button
              asChild
              className="rounded-full text-xs h-8 px-4 bg-[#1d1d1f] hover:bg-black dark:bg-white dark:hover:bg-[#f5f5f7] text-white dark:text-[#1d1d1f] shadow-none"
            >
              <Link to={`/generate/interview/${interviewId}`}>
                Launch Interview Studio
              </Link>
            </Button>
          </div>
        ) : (
          <Accordion
            type="single"
            collapsible
            value={activeFeed}
            onValueChange={setActiveFeed}
            className="w-full space-y-3"
          >
            {feedbacks.map((feed, index) => (
              <AccordionItem
                key={feed.id}
                value={feed.id}
                className="rounded-2xl border border-[#d2d2d7]/70 dark:border-neutral-800 bg-white dark:bg-[#121215] overflow-hidden shadow-xs hover:border-[#86868b]/40 transition-all duration-200"
              >
                <AccordionTrigger className="px-5 py-4 hover:no-underline flex items-center justify-between text-left group">
                  <div className="flex items-center gap-3 pr-4">
                    <span className="w-6 h-6 rounded-full bg-[#f5f5f7] dark:bg-neutral-800 text-[11px] font-semibold text-[#86868b] flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7] line-clamp-2">
                      {feed.question}
                    </span>
                  </div>

                  <span className="shrink-0 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#f5f5f7] dark:bg-neutral-800 text-[#1d1d1f] dark:text-white border border-[#d2d2d7]/40 dark:border-neutral-700/50 mr-2">
                    {feed.aiRating} / 10
                  </span>
                </AccordionTrigger>

                <AccordionContent className="px-5 pb-6 pt-2 space-y-4">
                  {/* Expected Answer */}
                  <div className="p-4 rounded-xl bg-[#fbfbfd] dark:bg-neutral-900/60 border border-[#d2d2d7]/50 dark:border-neutral-800 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Benchmark Answer</span>
                    </div>
                    <p className="text-xs text-[#86868b] leading-relaxed">
                      {feed.correctanswer}
                    </p>
                  </div>

                  {/* User Answer */}
                  <div className="p-4 rounded-xl bg-[#fbfbfd] dark:bg-neutral-900/60 border border-[#d2d2d7]/50 dark:border-neutral-800 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1d1d1f] dark:text-white">
                      <Mic className="w-3.5 h-3.5 text-[#86868b]" />
                      <span>Your Spoken Answer</span>
                    </div>
                    <p className="text-xs text-[#86868b] leading-relaxed italic">
                      &quot;{feed.useranswer}&quot;
                    </p>
                  </div>

                  {/* Feedback */}
                  <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Feedback & Suggestions</span>
                    </div>
                    <p className="text-xs text-[#86868b] leading-relaxed">
                      {feed.aiFeedback}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      {/* Custom Confirmation Dialog */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleResetResponses}
        loading={isResetting}
        title="Clear All Responses?"
        description="Are you sure you want to reset all your recorded responses and evaluations for this scenario? You will start fresh from Question 1."
        confirmText="Clear & Retake"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
};

export default Feedback;