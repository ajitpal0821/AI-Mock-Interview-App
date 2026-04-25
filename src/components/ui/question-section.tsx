import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { TooltipButton } from "./ToolTip-buttom";
import { Volume2, VolumeX } from "lucide-react";
import { RecordAnswer } from "./Record-Answer";

interface QuestionSectionProps {
  questions: { question: string, answer: string }[]
}

export const Questionsection = ({ questions }: QuestionSectionProps) => {

  const [isPlaying, setPlaying] = useState(false);
  const [isWebcamOn, setWebcamOn] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState<SpeechSynthesisUtterance | null>(null);


  function handlePlayQuestion(question: string): void {
    if (isPlaying && currentSpeech) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      setCurrentSpeech(null);
    }
    else {
      if ("speechSynthesis" in window) {
        const speech = new SpeechSynthesisUtterance(question);
        window.speechSynthesis.speak(speech);
        setPlaying(true);
        setCurrentSpeech(speech);
        speech.onend = () => {
          setPlaying(false);
          setCurrentSpeech(null);
        }
      }
    }
  }

    return (
      <div className="w-full min-h-96 border rounded-md p-4">
        <Tabs defaultValue={questions[0]?.question} className="w-full space-y-12" >
          <TabsList className="bg-transparent w-full flex flex-wrap items-center justify-start gap-4">
            {questions?.map((tab, index) => (
              <TabsTrigger className={cn("data-[state=active]:bg-emerald-200 data-[state=active]:shadow-md text-xs px-2")} value={tab?.question} >
                {`Question #${index + 1}`}
              </TabsTrigger>
            ))}
          </TabsList>
          {
            questions?.map((tab, index) => (
              <TabsContent key={index} value={tab?.question}>
                <p className="text-base text-left tracking-wide text-neutral-500">
                  {tab.question}
                </p>
                <div className="w-full flex items-center justify-end">

                  <TooltipButton  content ={isPlaying?"Stop":"Start"} icon={isPlaying ? (<VolumeX className="min-w-5 min-h-5 text-muted-foreground" />) : (<Volume2 className="min-w-5 min-h-5 text-muted-foreground" />)}
                    onClick={() => handlePlayQuestion(tab.question)}>

                  </TooltipButton>
                </div>

              <RecordAnswer question={tab} isWebcamOn={isWebcamOn} setWebcamOn={setWebcamOn} />
              </TabsContent>
            ))
          }

        </Tabs>
      </div>
    )
  }
