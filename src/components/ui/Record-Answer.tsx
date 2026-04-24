import useSpeechToText, { type ResultType } from "react-hook-speech-to-text"
import { useAuth } from "@clerk/react";
import { CircleStop, Loader, Mic, RefreshCcw, Save, Video, VideoOff, WebcamIcon } from "lucide-react";
import { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import WebCam from "react-webcam";
import { TooltipButton } from "./ToolTip-buttom";
import { toast } from "sonner";
import { set } from "zod";
import { aiConfig, genAI, model } from "@/scripts";
import SaveModal from "./save-modal";
import { db } from "@/config/firebase.config";
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
interface RecordAnswerProps {
    question: { question: string, answer: string },
    isWebcamOn: boolean,
    setWebcamOn: (state: boolean) => void
}
interface AIResponse {
    ratings: number,
    feedback: string
}
export const RecordAnswer = ({ question, isWebcamOn, setWebcamOn }: RecordAnswerProps) => {
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });
    const [userAnswer, setUserAnswer] = useState("")
    const [isAiGeneratingResponse, setIsAiGeneratingResponse] = useState(false)
    const [aiResponse, setAiResponse] = useState<AIResponse | null>(null)
    const [open, setOpen] = useState(false)
    const [isloading, setLoading] = useState(false)
    const { userId } = useAuth()
    const { interviewId } = useParams()

    const recordAnswer = async () => {
        if (isRecording) {
            stopSpeechToText();

            if (userAnswer?.length < 30) {
                toast.error("Error", { description: "Answer is too short, please provide a more detailed answer." });
                return;
            }
            const aiResult = await generateResult(question.question, question.answer, userAnswer)
            setAiResponse(aiResult || null);
        }
        else {
            startSpeechToText();

        }
    }
    const cleanAIResponse = (response: string): AIResponse | undefined => {
        try {
            let cleaned = response.trim();

            // remove markdown
            cleaned = cleaned.replace(/```json|```/g, "");

            // extract JSON object {}
            const match = cleaned.match(/\{[\s\S]*\}/);

            if (!match) return undefined;

            return JSON.parse(match[0]);
        } catch (error) {
            console.error("Parsing error:", error);
            return undefined;
        }
    };
    const generateResult = async (question: string, idealAnswwer: string, userAns: string): Promise<AIResponse | undefined> => {
        setIsAiGeneratingResponse(true);
        const prompt = `Question: "${question}"
        User Answer: "${userAns}"
        Correct Answer: "${idealAnswwer}"
        Please compare the user's answer to the correct answer, and provide a rating (from 1 to 10) based on answer quality, and offer feedback for improvement.
        Return the result in JSON format with the fields "ratings"(number) and "feedback"(string).
        `
        try {
            const response = await genAI.models.generateContent({
                model,
                contents: prompt,
                config: aiConfig
            });
            console.log("AI Result:", response.text);

            const parsedResult: AIResponse = cleanAIResponse(
                response.text ? response.text : ""
            );
            return parsedResult;
        }
        catch (error) {
            console.log(error)
            toast.error("Error", { description: "An error occurred while generating feedback, please try again." })
            return { ratings: 0, feedback: "Unable to generate feedback at the moment" }
        } finally {
            setIsAiGeneratingResponse(false);
        }
    }

    const RecordNewAnswer = () => {
        setUserAnswer("");
        stopSpeechToText();
        startSpeechToText();
    }
    useEffect(() => {
        const combinetranscripts = results.filter((result): result is ResultType => typeof result !== "string")
            .map((result) => result.transcript).join("");
        setUserAnswer(combinetranscripts);
    }, [results])
    // }

    const saveUserAnswer = async () => {
        setLoading(true);
        if (!aiResponse) {
            return;
        }
        try {
            //is answer existing in db
            const currrentQuestion = question.question;
            const userAnswerQuery = query(
                collection(db, "answers"),
                where("mockIdRef", "==", interviewId),
                where("question", "==", question.question)
            );
            const querySnapshot = await getDocs(userAnswerQuery);
            if (!querySnapshot.empty) {
                console.log("Query Snap Size", querySnapshot.size);
                toast.info(" Already Answered", { description: "Your have already answered this question." });
                return;
            }
            else {
                const questionAnswerRef = await collection(db, "answers");
                await addDoc(questionAnswerRef, {
                    userId,
                    mockIdRef: interviewId,
                    question: question.question,
                    useranswer: userAnswer,
                    correctanswer: question.answer,
                    aiFeedback: aiResponse.feedback,
                    aiRating: aiResponse.ratings,
                    createdAt: serverTimestamp()
                })
                toast.success("Answer Saved Successfully", { description: "Your answer and feedback have been saved successfully." });
            }
            setUserAnswer("");
            stopSpeechToText();

        } catch (error) {
            toast.error("Error", { description: "An error occurred while saving your answer, please try again." })
        } finally {
            setLoading(false);
            setOpen(!open);
        }
    }
    return (
        <div className="w-full flex flex-col items-center gap-8 mt-4">
            <SaveModal isOpen={open} onClose={() => setOpen(false)} onConfirm={saveUserAnswer} loading={isloading} />
            <div className="w-full h-[400px] md:w-96 flex flex-col items-center  justify-center border p-4 bg-gray-50 rounded-md">
                {isWebcamOn ? (
                    <WebCam onUserMedia={() => setWebcamOn(true)}
                        onUserMediaError={() => setWebcamOn(false)}
                        className="w-full h-full object-cover rounded-md" />
                ) : (
                    <WebcamIcon className='min-w-24 min-h-24 text-muted-foreground' />
                )}
            </div>

            <div className="flex itece justify-center gap-3">
                <TooltipButton content={isWebcamOn ? "Turn Off" : "Turn On"} icon={isWebcamOn ? (<VideoOff className="min-w-5 min-h-5 text-muted-foreground" />) : (<Video className="min-w-5 min-h-5 text-muted-foreground" />)}
                    onClick={() => setWebcamOn(!isWebcamOn)}>

                </TooltipButton>
                <TooltipButton content={isRecording ? "Stop Recording" : "Start Recording"} icon={isRecording ? (<CircleStop className="min-w-5 min-h-5 text-muted-foreground" />) : (<Mic className="min-w-5 min-h-5 text-muted-foreground" />)}
                    onClick={recordAnswer}>

                </TooltipButton>

                <TooltipButton content=" Record Again" icon={<RefreshCcw className="min-w-5 min-h-5" />}
                    onClick={RecordNewAnswer}>

                </TooltipButton>
                <TooltipButton content="Save Result" icon={isAiGeneratingResponse ? <Loader className="min-w-5 min-h-5" /> : (<Save className="min-w-5 min-h-5" />)}
                    onClick={() => setOpen(!open)} disbaled={isAiGeneratingResponse} >

                </TooltipButton>

            </div>
            <div className="w-full mt-4 p-4 border rounded-md bg-gray-50">
                <h2 className="text-lg font-semibold">Your Answer:</h2>
                <p className="text-gray-700 mt-2">{userAnswer || "Start recording to see your answer here"}"</p>
                {interimResult && (<p className="text-sm text-gray-500 mt-2">
                    <strong>Current Speech: </strong>
                    {interimResult}
                </p>)}
            </div>
        </div>
    )
}
