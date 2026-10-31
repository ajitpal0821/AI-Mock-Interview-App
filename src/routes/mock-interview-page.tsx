import type { Interview } from "@/types";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { LoaderPage } from "./loader-page";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { CustomBreadCrumb } from "@/components/ui/custom-breadcrumb";
import { Questionsection } from "@/components/ui/question-section";
import { Headings } from "@/components/ui/headings";
import { ArrowRight, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MockInterviewPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isloading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterview = async () => {
      if (interviewId) {
        try {
          const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
          if (interviewDoc.exists()) {
            setInterview({ id: interviewId, ...interviewDoc.data() } as Interview);
          } else {
            toast.error("Scenario not found", {
              description: "The requested interview scenario does not exist or has been deleted.",
            });
            navigate("/generate", { replace: true });
          }
        } catch (error) {
          console.error("Error loading interview questions:", error);
          toast.error("Error loading interview session");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchInterview();
  }, [interviewId, navigate]);

  if (isloading) {
    return (
      <LoaderPage 
        className="w-full h-[60vh]" 
        title="Preparing Studio..." 
        description="Loading questions and speech recognition models" 
      />
    );
  }

  if (!interview) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 py-2">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <CustomBreadCrumb
          breadCrumbPage="Interview Session"
          breadCrumbItems={[
            { label: "Interview Studio", link: "/generate" },
            { label: interview?.position || "Readiness", link: `/generate/interview/${interviewId}` },
          ]}
        />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#86868b]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Session</span>
          </div>

          <Link
            to={`/generate/feedback/${interviewId}`}
            className="rounded-full h-8 px-3.5 text-xs font-medium border border-[#d2d2d7] dark:border-neutral-700 text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all flex items-center gap-1.5"
          >
            <Newspaper className="w-3.5 h-3.5 text-[#86868b]" />
            <span>View Report</span>
          </Link>
        </div>
      </div>

      <div className="pt-2">
        <Headings 
          title={interview?.position || "Mock Interview"} 
          description="Answer each question naturally using your microphone. Your answer will be evaluated objectively with instant feedback."
        />
      </div>

      {/* Main Question & Recording Section */}
      {interview?.questions && interview.questions.length > 0 && (
        <div className="w-full pt-2">
          <Questionsection questions={interview.questions} />
        </div>
      )}

      {/* Session Completion Action Bar */}
      <div className="pt-6 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#d2d2d7]/50 dark:border-neutral-800">
        <div className="text-xs text-[#86868b] text-center sm:text-left">
          Done answering questions? View your detailed AI score breakdown and performance recommendations.
        </div>
        <Link
          to={`/generate/feedback/${interviewId}`}
          className="rounded-full px-5 py-2.5 text-xs font-medium bg-[#1d1d1f] hover:bg-black dark:bg-white dark:hover:bg-[#f5f5f7] text-white dark:text-[#1d1d1f] transition-all shadow-xs flex items-center gap-1.5 shrink-0"
        >
          <span>Complete Session & View Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default MockInterviewPage;