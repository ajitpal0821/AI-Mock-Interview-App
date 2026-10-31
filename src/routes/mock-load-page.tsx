import { db } from "@/config/firebase.config";
import type { Interview } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LoaderPage } from "./loader-page";
import { CustomBreadCrumb } from "@/components/ui/custom-breadcrumb";
import { Button } from "@/components/ui/button";
import { Play, ShieldCheck, Video, VideoOff, WebcamIcon, CheckCircle2, Mic } from "lucide-react";
import { InterviewPin } from "@/components/ui/InterviewPin";
import WebCam from "react-webcam";
import { toast } from "sonner";

export const MockLoadPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWebCamEnabled, setWebCamEnabled] = useState(false);

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
          console.error("Error fetching interview:", error);
          toast.error("Error loading interview readiness");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchInterview();
  }, [interviewId, navigate]);

  if (loading) {
    return <LoaderPage className="w-full h-[60vh]" title="Loading Session..." description="Fetching your customized scenario details" />;
  }

  if (!interview || !interviewId) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 py-2">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <CustomBreadCrumb
          breadCrumbPage="Readiness Check"
          breadCrumbItems={[
            { label: "Interview Studio", link: "/generate" },
            { label: interview.position, link: `/generate/${interviewId}` },
          ]}
        />

        <Link to={`/generate/interview/${interviewId}/start`}>
          <Button className="rounded-full bg-[#1d1d1f] hover:bg-black dark:bg-white dark:hover:bg-[#f5f5f7] dark:text-[#1d1d1f] text-white text-xs px-5 py-2.5 h-auto shadow-none font-medium flex items-center gap-1.5 transition-all">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Session</span>
          </Button>
        </Link>
      </div>

      {/* Scenario Overview Card */}
      <InterviewPin interview={interview} ontMockPage />

      {/* Main Readiness Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Camera & Microphone Test Viewport */}
        <div className="md:col-span-7 flex flex-col justify-between rounded-3xl border border-[#d2d2d7]/70 dark:border-neutral-800 bg-[#121215] text-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] min-h-[380px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isWebCamEnabled ? "bg-emerald-500 animate-pulse" : "bg-neutral-600"}`} />
              <span className="text-xs font-medium text-neutral-300">
                {isWebCamEnabled ? "Camera Active (On-Device Stream)" : "Camera Offline"}
              </span>
            </div>
            <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
              Preview
            </span>
          </div>

          {/* Video or Placeholder */}
          <div className="flex-1 w-full rounded-2xl overflow-hidden bg-black/40 flex items-center justify-center relative min-h-[240px]">
            {isWebCamEnabled ? (
              <WebCam
                onUserMedia={() => setWebCamEnabled(true)}
                onUserMediaError={() => setWebCamEnabled(false)}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-neutral-500 text-center p-6">
                <WebcamIcon className="w-12 h-12 text-neutral-600" />
                <p className="text-xs max-w-xs">
                  Enable your camera to simulate an authentic video interview environment.
                </p>
              </div>
            )}
          </div>

          {/* Toggle Control */}
          <div className="pt-4 flex justify-center">
            <Button
              onClick={() => setWebCamEnabled(!isWebCamEnabled)}
              variant="outline"
              size="sm"
              className="rounded-full text-xs font-medium border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800 h-8 px-4 flex items-center gap-1.5"
            >
              {isWebCamEnabled ? (
                <>
                  <VideoOff className="w-3.5 h-3.5" />
                  <span>Disable Camera</span>
                </>
              ) : (
                <>
                  <Video className="w-3.5 h-3.5" />
                  <span>Enable Camera</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right: Briefing & Guidelines */}
        <div className="md:col-span-5 rounded-3xl border border-[#d2d2d7]/70 dark:border-neutral-800 bg-[#fbfbfd] dark:bg-[#121215] p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-base font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
              Session Briefing
            </h3>

            <ul className="space-y-3 text-xs text-[#86868b] leading-relaxed">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>5 Questions:</strong> Role-calibrated technical and situational scenarios.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mic className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Voice Evaluation:</strong> Speak clearly; your answers are transcribed and analyzed in real time.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Zero Recording:</strong> Your camera video is strictly local in-browser and is never recorded, uploaded, or stored.
                </span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-[#d2d2d7]/40 dark:border-neutral-800">
            <Link to={`/generate/interview/${interviewId}/start`} className="w-full block">
              <Button className="w-full rounded-full bg-[#1d1d1f] hover:bg-black dark:bg-white dark:hover:bg-[#f5f5f7] dark:text-[#1d1d1f] text-white text-xs font-medium py-3 h-auto shadow-none flex items-center justify-center gap-2">
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Begin Interview Round</span>
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
