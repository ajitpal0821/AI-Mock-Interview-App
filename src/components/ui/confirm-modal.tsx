import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./button";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "default";
  loading?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "destructive",
  loading = false,
}: ConfirmModalProps) => {
  const onChange = (open: boolean) => {
    if (!open && !loading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="rounded-3xl border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#161618] shadow-[0_24px_70px_rgba(0,0,0,0.18)] p-6 sm:max-w-md space-y-4">
        
        {/* Top Warning Icon Chassis */}
        <div className="flex items-start gap-3.5">
          <div
            className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border",
              variant === "destructive"
                ? "bg-red-50 dark:bg-red-950/40 border-red-200/60 dark:border-red-900/40 text-red-600 dark:text-red-400"
                : "bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-[#1d1d1f] dark:text-white"
            )}
          >
            {variant === "destructive" ? (
              <Trash2 className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>

          <DialogHeader className="space-y-1.5 text-left">
            <DialogTitle className="text-base sm:text-lg font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
              {title}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex items-center justify-end w-full gap-2 border-t border-[#f5f5f7] dark:border-neutral-800/80">
          <Button
            type="button"
            disabled={loading}
            variant="outline"
            onClick={onClose}
            className="rounded-full h-8 px-4 text-xs font-medium border-[#d2d2d7] dark:border-neutral-700 text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-neutral-100 dark:hover:bg-neutral-800 shadow-none transition-all"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={cn(
              "rounded-full h-8 px-4 text-xs font-medium text-white shadow-none transition-all flex items-center gap-1.5",
              variant === "destructive"
                ? "bg-red-600 hover:bg-red-700 active:bg-red-800"
                : "bg-[#1d1d1f] hover:bg-black dark:bg-white dark:hover:bg-[#f5f5f7] dark:text-[#1d1d1f]"
            )}
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{loading ? "Processing..." : confirmText}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmModal;
