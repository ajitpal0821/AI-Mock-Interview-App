import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Volume2, VolumeX, Check } from "lucide-react";
import { RecordAnswer } from "./Record-Answer";
import { Button } from "./button";
import { useAuth } from "@clerk/react";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/firebase.config";

interface QuestionSectionProps {
  questions: { question: string; answer: string }[];
}

export const Questionsection = ({ questions }: QuestionSectionProps) => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [isPlaying, setPlaying] = useState(false);
  const [isWebcamOn, setWebcamOn] = useState(true);
  const [currentSpeech, setCurrentSpeech] = useState<SpeechSynthesisUtterance | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);

  const { userId } = useAuth();
  const { interviewId } = useParams();

  // Fetch already answered questions in this session
  useEffect(() => {
    const fetchAnsweredQuestions = async () => {
      if (!interviewId || !userId) return;
      try {
        const q = query(
          collection(db, "answers"),
          where("userId", "==", userId),
          where("mockIdRef", "==", interviewId)
        );
        const snap = await getDocs(q);
        const answeredTexts = snap.docs.map((d) => d.data().question as string);
        setAnsweredQuestions(answeredTexts);
      } catch (err) {
        console.error("Error fetching answered questions:", err);
      }
    };

    fetchAnsweredQuestions();
  }, [interviewId, userId]);

  const handleAnswerSaved = (questionText: string) => {
    setAnsweredQuestions((prev) => {
      if (!prev.includes(questionText)) {
        return [...prev, questionText];
      }
      return prev;
    });
  };

  function handlePlayQuestion(question: string): void {
    if (isPlaying && currentSpeech) {
      window.speechSynthesis?.cancel();
      setPlaying(false);
      setCurrentSpeech(null);
    } else {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance(question);
        window.speechSynthesis.speak(speech);
        setPlaying(true);
        setCurrentSpeech(speech);
        speech.onend = () => {
          setPlaying(false);
          setCurrentSpeech(null);
        };
      }
    }
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-[#86868b]">
        No questions available for this scenario.
      </div>
    );
  }

  const activeQuestion = questions[activeQuestionIndex] || questions[0];

  return (
    <div className="w-full rounded-3xl border border-[#d2d2d7]/70 dark:border-neutral-800 bg-white dark:bg-[#121215] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-6">
      <Tabs
        value={String(activeQuestionIndex)}
        onValueChange={(val) => {
          window.speechSynthesis?.cancel();
          setPlaying(false);
          setCurrentSpeech(null);
          setActiveQuestionIndex(Number(val));
        }}
        className="w-full space-y-6"
      >
        {/* Apple Segmented Pills */}
        <div className="w-full overflow-x-auto pb-1">
          <TabsList className="bg-[#f5f5f7] dark:bg-neutral-800/80 p-1 rounded-full inline-flex gap-1 h-auto border border-[#d2d2d7]/30 dark:border-neutral-700/40">
            {questions.map((q, index) => {
              const isAnswered = answeredQuestions.includes(q.question);
              return (
                <TabsTrigger
                  key={index}
                  value={String(index)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 text-[#86868b] flex items-center gap-1.5",
                    "data-[state=active]:bg-[#1d1d1f] data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-[#1d1d1f] data-[state=active]:shadow-xs"
                  )}
                >
                  <span>{`Question ${index + 1}`}</span>
                  {isAnswered && (
                    <Check className="w-3 h-3 text-emerald-500" />
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Active Question Header & TTS Button */}
        <div className="p-5 rounded-2xl bg-[#fbfbfd] dark:bg-neutral-900/60 border border-[#d2d2d7]/50 dark:border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">
              Question {activeQuestionIndex + 1} of {questions.length}
            </span>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePlayQuestion(activeQuestion.question)}
              className="rounded-full h-7 px-3 text-xs font-medium border-[#d2d2d7] text-[#1d1d1f] dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 shadow-none flex items-center gap-1.5"
            >
              {isPlaying ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Read Aloud</span>
                </>
              )}
            </Button>
          </div>

          <h3 className="text-base sm:text-lg font-semibold tracking-tight text-[#1d1d1f] dark:text-white leading-relaxed">
            {activeQuestion.question}
          </h3>
        </div>

        {/* Single Dedicated Answer Recording Component */}
        <RecordAnswer
          key={activeQuestionIndex}
          question={activeQuestion}
          isWebcamOn={isWebcamOn}
          setWebcamOn={setWebcamOn}
          onAnswerSaved={handleAnswerSaved}
        />
      </Tabs>
    </div>
  );
};