import type { Interview } from "@/types";
import { Card, CardDescription, CardFooter, CardTitle } from "./card";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Play, Newspaper, Pencil, Clock, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { deleteDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { toast } from "sonner";
import ConfirmModal from "./confirm-modal";

interface InterviewPinProps {
  interview: Interview;
  ontMockPage?: boolean;
  onDelete?: (id: string) => void;
}

export const InterviewPin = ({ interview, ontMockPage = false, onDelete }: InterviewPinProps) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const executeDelete = async () => {
    if (!interview?.id) return;

    try {
      setIsDeleting(true);
      await deleteDoc(doc(db, "interviews", interview.id));

      // Cascade delete orphaned answers
      const answersQuery = query(
        collection(db, "answers"),
        where("mockIdRef", "==", interview.id)
      );
      const answersSnap = await getDocs(answersQuery);
      const deletePromises = answersSnap.docs.map((d) => deleteDoc(d.ref));
      await Promise.all(deletePromises);

      toast.success("Scenario removed", {
        description: `"${interview.position}" has been deleted.`,
      });

      setIsConfirmOpen(false);

      if (onDelete) {
        onDelete(interview.id);
      }
    } catch (error) {
      console.error("Error deleting scenario:", error);
      toast.error("Failed to delete scenario");
    } finally {
      setIsDeleting(false);
    }
  };

  const formattedDate = interview?.createdAt
    ? new Date(interview.createdAt.toDate()).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recent";

  return (
    <Card className="rounded-2xl border border-[#d2d2d7]/70 dark:border-neutral-800 bg-white dark:bg-[#121215] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_12px_36px_rgba(0,0,0,0.3)] hover:border-[#86868b]/50 dark:hover:border-neutral-700 transition-all duration-200 flex flex-col justify-between space-y-4">
      
      {/* Top Header & Experience Pill */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] leading-snug">
            {interview?.position}
          </CardTitle>
          <span className="shrink-0 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#f5f5f7] dark:bg-neutral-800 text-[#86868b] dark:text-neutral-400 border border-[#d2d2d7]/40 dark:border-neutral-700/50">
            {interview?.experience ? `${interview.experience}y exp` : "All levels"}
          </span>
        </div>

        <CardDescription className="text-xs text-[#86868b] line-clamp-2 leading-relaxed">
          {interview?.description}
        </CardDescription>
      </div>

      {/* Tech Stack Pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {interview?.techStack?.split(",").map((tech, index) => (
          <span
            key={index}
            className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#fbfbfd] dark:bg-neutral-900 text-[#1d1d1f] dark:text-[#f5f5f7] border border-[#d2d2d7]/50 dark:border-neutral-800"
          >
            {tech.trim()}
          </span>
        ))}
      </div>

      {/* Card Footer: Metadata & Actions */}
      <CardFooter className={cn("p-0 pt-2 border-t border-[#f5f5f7] dark:border-neutral-800/80 flex items-center w-full", ontMockPage ? "justify-end" : "justify-between")}>
        <div className="flex items-center gap-1.5 text-[11px] text-[#86868b]">
          <Clock className="w-3 h-3 text-[#86868b]" />
          <span>{formattedDate}</span>
        </div>

        {!ontMockPage && (
          <div className="flex items-center gap-1.5">
            {/* Direct Delete */}
            <Button
              size="icon"
              variant="ghost"
              disabled={isDeleting}
              className="w-7 h-7 rounded-full text-[#86868b] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
              title="Delete Scenario"
              onClick={(e) => {
                e.stopPropagation();
                setIsConfirmOpen(true);
              }}
            >
              {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            </Button>

            {/* Edit Scenario */}
            <Button
              size="icon"
              variant="ghost"
              className="w-7 h-7 rounded-full text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
              title="Edit Scenario"
              onClick={() => navigate(`/generate/${interview.id}`, { replace: true })}
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>

            {/* View Feedback */}
            <Button
              size="sm"
              variant="outline"
              className="rounded-full text-[11px] h-7 px-3 border-[#d2d2d7] text-[#1d1d1f] dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 shadow-none font-medium"
              onClick={() => navigate(`/generate/feedback/${interview.id}`, { replace: true })}
            >
              <Newspaper className="w-3 h-3 mr-1 text-[#86868b]" />
              Report
            </Button>

            {/* Launch Mock Interview */}
            <Button
              size="sm"
              className="rounded-full text-[11px] h-7 px-3 bg-[#1d1d1f] hover:bg-black dark:bg-white dark:hover:bg-[#f5f5f7] dark:text-[#1d1d1f] text-white shadow-none font-medium flex items-center gap-1"
              onClick={() => navigate(`/generate/interview/${interview.id}`, { replace: true })}
            >
              <Play className="w-3 h-3 fill-current" />
              Start
            </Button>
          </div>
        )}
      </CardFooter>

      {/* Custom Apple Confirmation Dialog */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={executeDelete}
        loading={isDeleting}
        title="Delete Scenario?"
        description={`Are you sure you want to delete "${interview?.position || "this scenario"}"? All associated rehearsal answers and report data will be permanently deleted.`}
        confirmText="Delete Scenario"
        cancelText="Cancel"
        variant="destructive"
      />
    </Card>
  );
};

export default InterviewPin;

