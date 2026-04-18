import type { Interview } from "@/types";
import { Card, CardDescription, CardFooter, CardTitle } from "./card";
import { useState } from "react";
import { replace, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";
import { TooltipButton } from "./ToolTip-buttom";
import { Eye, Newspaper, Pencil, Sparkle, Sparkles } from "lucide-react";


interface InterviewPinProps {
    interview: Interview;
    ontMockPage?: boolean
}

export const InterviewPin = ({ interview, ontMockPage = false }: InterviewPinProps) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { userId } = useAuth();
    return <Card className="p-4 rounded-md shadow-none hover:shadow-md shadow-gray-100 cursor-pointer transition-all space-y-4">
        <CardTitle className="text-lg">{interview?.position}</CardTitle>
        <CardDescription className="tw-full flex items-center gap-2 flex-wrap">{interview?.description}</CardDescription>
        <div className="w-full flex items-center gap-2 flex-wrap">
            {
                interview?.techStack.split(',').map((tech, index) => (
                    <Badge key={index} variant={"outline"} className="text-xs text-muted-foreground hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-900">{tech}</Badge>
                ))
            }
        </div>
        <CardFooter className={cn("w-full flex items-center p-0", ontMockPage ? "justify-end" : "justify-between")}>
            <p className="text-[12px] text-muted-foreground truncate whitespace-nowrap">
                {`${new Date(interview.createdAt.toDate()).toLocaleDateString("en-US", {
                    dateStyle: "long",
                })} - ${new Date(interview.createdAt.toDate()).toLocaleTimeString("en-US", {
                    timeStyle: "short",
                })}`}
            </p>
            {!ontMockPage && (
                <div className="flex items-center justify-center">
                    <TooltipButton content="Edit"
                        icon={<Pencil />}
                        onClick={() => {
                            navigate(`/generate/${interview.id}`, { replace: true })
                        }}
                        disabled={false}
                        buttonVariant="ghost"
                        buttonClassName="hover:text-emerald-400"
                        loading={false}
                    />


                    <TooltipButton content="View"
                        icon={<Eye />}
                        onClick={() => {
                            navigate(`/generate/${interview.id}`, { replace: true })
                        }}
                        disabled={false}
                        buttonVariant="ghost"
                        buttonClassName="hover:text-sky-400"
                        loading={false}
                    />


                    <TooltipButton content="Feedback"
                        icon={<Newspaper />}
                        onClick={() => {
                            navigate(`/generate/feedback/${interview.id}`, { replace: true })
                        }}
                        disabled={false}
                        buttonVariant="ghost"
                        buttonClassName="hover:text-emerald-400"
                        loading={false}
                    />
                    <TooltipButton content="Start Mock Interview"
                        icon={<Sparkles />}
                        onClick={() => {
                            navigate(`/generate/${interview.id}`, { replace: true })
                        }}
                        disabled={false}
                        buttonVariant="ghost"
                        buttonClassName="hover:text-emerald-400"
                        loading={false}
                    />
                </div>
            )}
        </CardFooter>
    </Card>
}

