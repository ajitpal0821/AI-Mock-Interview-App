import { useAuth } from "@clerk/react";
import {
  CircleStop,
  Mic,
  RefreshCcw,
  Save,
  Video,
  VideoOff,
  WebcamIcon,
  Loader2,
  Sparkles,
  Volume2,
  Edit3,
  Check,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import WebCam from "react-webcam";
import { toast } from "sonner";
import { generateAIContent } from "@/scripts";
import SaveModal from "./save-modal";
import { db } from "@/config/firebase.config";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { cn } from "@/lib/utils";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";

interface RecordAnswerProps {
  question: { question: string; answer: string };
  isWebcamOn: boolean;
  setWebcamOn: (state: boolean) => void;
  onAnswerSaved?: (questionText: string) => void;
}

interface AIResponse {
  ratings: number;
  feedback: string;
}

export const RecordAnswer = ({
  question,
  isWebcamOn,
  setWebcamOn,
  onAnswerSaved,
}: RecordAnswerProps) => {
  const {
    isRecording,
    transcript,
    setTranscript,
    interimTranscript,
    isSupported,
    startRecording,
    stopRecording,
    resetTranscript,
  } = useSpeechRecognition({ continuous: true, lang: "en-US" });

  const [isManualEditing, setIsManualEditing] = useState(false);
  const [isAiGeneratingResponse, setIsAiGeneratingResponse] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [open, setOpen] = useState(false);
  const [isloading, setLoading] = useState(false);
  const { userId } = useAuth();
  const { interviewId } = useParams();

  // Pre-load existing answer and evaluation if previously recorded
  useEffect(() => {
    let isMounted = true;
    const fetchExistingAnswer = async () => {
      if (!interviewId || !userId || !question?.question) return;
      try {
        const userAnswerQuery = query(
          collection(db, "answers"),
          where("userId", "==", userId),
          where("mockIdRef", "==", interviewId),
          where("question", "==", question.question)
        );
        const querySnapshot = await getDocs(userAnswerQuery);
        if (!querySnapshot.empty && isMounted) {
          const docData = querySnapshot.docs[0].data();
          if (docData.useranswer) {
            setTranscript(docData.useranswer);
          }
          if (docData.aiRating && docData.aiFeedback) {
            setAiResponse({
              ratings: docData.aiRating,
              feedback: docData.aiFeedback,
            });
          }
        }
      } catch (err) {
        console.error("Error loading previous answer:", err);
      }
    };
    fetchExistingAnswer();
    return () => {
      isMounted = false;
    };
  }, [interviewId, userId, question.question, setTranscript]);

  const currentAnswer = (transcript + (interimTranscript ? " " + interimTranscript : "")).trim();

  const handleToggleRecording = async () => {
    if (isRecording) {
      stopRecording();

      if (currentAnswer.length < 30) {
        toast.error("Answer too brief", {
          description:
            "Please provide a bit more detail (minimum 30 characters) for accurate evaluation.",
        });
        return;
      }

      const aiResult = await generateResult(
        question.question,
        question.answer,
        currentAnswer
      );
      setAiResponse(aiResult || null);
    } else {
      if (isManualEditing) {
        setIsManualEditing(false);
      }
      await startRecording();
    }
  };

  const cleanAIResponse = (response: string): AIResponse | undefined => {
    try {
      let cleaned = response.trim();
      cleaned = cleaned.replace(/```json|```/g, "");
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (!match) return undefined;
      return JSON.parse(match[0]);
    } catch (error) {
      console.error("Parsing error:", error);
      return undefined;
    }
  };

  const generateResult = async (
    q: string,
    idealAnswer: string,
    userAns: string
  ): Promise<AIResponse | undefined> => {
    setIsAiGeneratingResponse(true);
    const prompt = `
Evaluate the user's answer.

Return ONLY valid JSON. No explanation, no markdown.

Format:
{
  "ratings": number,
  "feedback": "string"
}

Rules:
- ratings must be between 1 and 10
- feedback must be concise, constructive and helpful
- do NOT include backslashes (\\), regex, or special escape characters
- do NOT include extra text

Question: ${q}
User Answer: ${userAns}
Correct Answer: ${idealAnswer}
`;
    try {
      const rawText = await generateAIContent(prompt);
      const parsedResult: AIResponse | undefined = cleanAIResponse(rawText || "");
      return parsedResult;
    } catch (error) {
      console.error("AI Generation Error:", error);
      toast.error("Evaluation Error", {
        description: "An error occurred while generating feedback, please try again.",
      });
      return { ratings: 5, feedback: "Unable to generate detailed feedback at this moment." };
    } finally {
      setIsAiGeneratingResponse(false);
    }
  };

  const handleRetake = () => {
    resetTranscript();
    setAiResponse(null);
    stopRecording();
  };

  const handleEvaluateTypedAnswer = async () => {
    if (currentAnswer.length < 30) {
      toast.error("Answer too brief", {
        description: "Please enter at least 30 characters before requesting evaluation.",
      });
      return;
    }
    const aiResult = await generateResult(
      question.question,
      question.answer,
      currentAnswer
    );
    setAiResponse(aiResult || null);
    setIsManualEditing(false);
  };

  const saveUserAnswer = async () => {
    setLoading(true);
    if (!aiResponse) {
      return;
    }
    try {
      const userAnswerQuery = query(
        collection(db, "answers"),
        where("userId", "==", userId),
        where("mockIdRef", "==", interviewId),
        where("question", "==", question.question)
      );
      const querySnapshot = await getDocs(userAnswerQuery);
      if (!querySnapshot.empty) {
        // Update existing answer document
        const existingDocId = querySnapshot.docs[0].id;
        await updateDoc(doc(db, "answers", existingDocId), {
          useranswer: currentAnswer,
          aiFeedback: aiResponse.feedback,
          aiRating: aiResponse.ratings,
          updateAt: serverTimestamp(),
        });
        toast.success("Answer Updated", {
          description: "Your revised response and score have been saved to your report.",
        });
      } else {
        const questionAnswerRef = collection(db, "answers");
        await addDoc(questionAnswerRef, {
          userId,
          mockIdRef: interviewId,
          question: question.question,
          useranswer: currentAnswer,
          correctanswer: question.answer,
          aiFeedback: aiResponse.feedback,
          aiRating: aiResponse.ratings,
          createdAt: serverTimestamp(),
          updateAt: serverTimestamp(),
        });
        toast.success("Saved to Report", {
          description: "Your answer and feedback have been added to your session report.",
        });
      }

      if (onAnswerSaved) {
        onAnswerSaved(question.question);
      }
      stopRecording();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Save Failed", {
        description: "An error occurred while saving your answer. Please try again.",
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <SaveModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={saveUserAnswer}
        loading={isloading}
      />

      {/* Apple Studio Camera Preview Chassis */}
      <div className="w-full max-w-xl aspect-video rounded-3xl overflow-hidden bg-[#0a0a0c] border border-black/[0.08] dark:border-white/[0.1] shadow-[0_12px_40px_rgba(0,0,0,0.06)] relative flex items-center justify-center group">
        {isWebcamOn ? (
          <>
            <WebCam
              onUserMedia={() => setWebcamOn(true)}
              onUserMediaError={() => setWebcamOn(false)}
              className="w-full h-full object-cover"
              mirrored={true}
            />
            {/* Live Camera On-Device Pill */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-medium text-white/90 flex items-center gap-1.5 border border-white/10 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Camera Active</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-neutral-400">
              <WebcamIcon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-300">Camera Inactive</p>
              <p className="text-[11px] text-neutral-500 max-w-xs mt-0.5">
                Enable webcam to simulate in-person eye contact and presence. Stream stays entirely on your local device.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setWebcamOn(true)}
              className="rounded-full text-xs h-7 px-3 bg-white/10 hover:bg-white/20 text-white border-white/10 shadow-none"
            >
              Enable Camera
            </Button>
          </div>
        )}

        {/* Live Speech Recording Status Pill */}
        {isRecording && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-red-500/90 backdrop-blur-md text-[11px] font-semibold text-white flex items-center gap-1.5 shadow-md animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>Recording Audio...</span>
          </div>
        )}
      </div>

      {/* Apple Studio Control Dock */}
      <div className="bg-white/90 dark:bg-[#1a1a1e]/90 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-full px-3 py-2 flex items-center gap-2">
        {/* Webcam Toggle */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setWebcamOn(!isWebcamOn)}
          className={cn(
            "rounded-full h-8 px-3 text-xs font-medium transition-all gap-1.5",
            isWebcamOn
              ? "text-[#1d1d1f] dark:text-white bg-neutral-100 dark:bg-neutral-800"
              : "text-[#86868b] hover:text-[#1d1d1f]"
          )}
          title={isWebcamOn ? "Turn Camera Off" : "Turn Camera On"}
        >
          {isWebcamOn ? (
            <>
              <Video className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Camera On</span>
            </>
          ) : (
            <>
              <VideoOff className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Camera Off</span>
            </>
          )}
        </Button>

        <div className="w-[1px] h-4 bg-neutral-200 dark:bg-neutral-700 mx-1" />

        {/* Record / Stop Audio Button */}
        <Button
          size="sm"
          onClick={handleToggleRecording}
          className={cn(
            "rounded-full h-8 px-4 text-xs font-medium shadow-none transition-all flex items-center gap-1.5 cursor-pointer",
            isRecording
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-[#1d1d1f] hover:bg-black dark:bg-white dark:hover:bg-[#f5f5f7] text-white dark:text-[#1d1d1f]"
          )}
        >
          {isRecording ? (
            <>
              <CircleStop className="w-3.5 h-3.5" />
              <span>Stop & Evaluate</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5" />
              <span>{currentAnswer ? "Resume Voice Recording" : "Start Recording"}</span>
            </>
          )}
        </Button>

        {/* Reset / Retake Button */}
        <Button
          size="sm"
          variant="ghost"
          onClick={handleRetake}
          disabled={!currentAnswer && !isRecording}
          className="rounded-full h-8 px-3 text-xs font-medium text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white gap-1.5"
          title="Clear answer and retake"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Retake</span>
        </Button>

        {/* Save Result Button */}
        <Button
          size="sm"
          variant="outline"
          disabled={!aiResponse || isAiGeneratingResponse}
          onClick={() => setOpen(true)}
          className={cn(
            "rounded-full h-8 px-3.5 text-xs font-medium transition-all gap-1.5 border-[#d2d2d7] dark:border-neutral-700 shadow-none",
            aiResponse && !isAiGeneratingResponse
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
              : "text-[#86868b]"
          )}
        >
          {isAiGeneratingResponse ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Evaluating...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save Result</span>
            </>
          )}
        </Button>
      </div>

      {/* Browser Speech API Fallback Alert (if unsupported) */}
      {!isSupported && (
        <div className="w-full max-w-xl p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-800 dark:text-amber-300">
          Speech recognition is not natively supported in this browser. Please use Google Chrome or Microsoft Edge, or type your answer below.
        </div>
      )}

      {/* Instant Feedback Preview (if generated) */}
      {aiResponse && (
        <div className="w-full max-w-xl p-5 rounded-2xl bg-white dark:bg-[#151518] border border-black/[0.08] dark:border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                Instant AI Evaluation
              </h4>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
              Score: {aiResponse.ratings} / 10
            </span>
          </div>

          <p className="text-xs text-[#86868b] leading-relaxed">
            {aiResponse.feedback}
          </p>

          <div className="pt-1 flex items-center justify-between text-[11px] text-[#86868b] border-t border-[#f5f5f7] dark:border-neutral-800">
            <span>Ready to lock this in?</span>
            <Button
              size="sm"
              onClick={() => setOpen(true)}
              className="rounded-full text-[11px] h-6 px-3 bg-[#1d1d1f] hover:bg-black dark:bg-white dark:hover:bg-[#f5f5f7] text-white dark:text-[#1d1d1f] shadow-none"
            >
              Save to Report
            </Button>
          </div>
        </div>
      )}

      {/* Live Speech Recognition Transcript Card */}
      <div className="w-full max-w-xl p-5 rounded-2xl border border-[#d2d2d7]/60 dark:border-neutral-800 bg-[#fbfbfd] dark:bg-neutral-900/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#86868b]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
              Spoken Transcript
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-medium text-[#86868b]">
              {currentAnswer ? `${currentAnswer.trim().split(/\s+/).length} words` : "Waiting for speech"}
            </span>

            {/* Toggle Manual Type / Edit button */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsManualEditing(!isManualEditing)}
              className="h-6 px-2 rounded-full text-[11px] text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
            >
              {isManualEditing ? (
                <>
                  <Check className="w-3 h-3 mr-1" /> Done Editing
                </>
              ) : (
                <>
                  <Edit3 className="w-3 h-3 mr-1" /> Type / Edit
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Textarea if manual editing, otherwise live speech display */}
        {isManualEditing ? (
          <div className="space-y-2">
            <Textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Type or edit your response here..."
              rows={4}
              className="text-xs sm:text-sm bg-white dark:bg-neutral-900 border-[#d2d2d7]/70 dark:border-neutral-800 rounded-xl"
            />
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                onClick={handleEvaluateTypedAnswer}
                disabled={isAiGeneratingResponse || currentAnswer.length < 10}
                className="rounded-full text-xs h-7 px-3 bg-[#1d1d1f] hover:bg-black text-white dark:bg-white dark:text-[#1d1d1f]"
              >
                {isAiGeneratingResponse ? "Evaluating..." : "Evaluate Response"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="min-h-[72px] text-xs sm:text-sm text-[#1d1d1f] dark:text-[#f5f5f7] leading-relaxed">
            {currentAnswer ? (
              <p className="whitespace-pre-wrap">{transcript}</p>
            ) : (
              <p className="text-[#86868b] italic">
                Click &quot;Start Recording&quot; and articulate your response clearly into your microphone. Your spoken words will stream here in real time.
              </p>
            )}

            {interimTranscript && (
              <p className="mt-2 text-xs text-[#86868b] italic flex items-center gap-1">
                <span>{interimTranscript}</span>
                <span className="inline-block w-1 h-3 bg-emerald-500 animate-pulse ml-0.5" />
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


