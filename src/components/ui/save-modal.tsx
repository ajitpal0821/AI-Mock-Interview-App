import Modal from "./modal";
import { Button } from "./button";
import { Loader2 } from "lucide-react";

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const SaveModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: SaveModalProps) => {
  return (
    <Modal
      title="Save Evaluation"
      description="Your spoken answer and feedback will be recorded permanently in your interview performance report."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-4 flex items-center justify-end w-full gap-2">
        <Button
          disabled={loading}
          variant="outline"
          onClick={onClose}
          className="rounded-full h-9 px-4 text-xs font-medium border-[#d2d2d7] dark:border-neutral-700 text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-neutral-100 dark:hover:bg-neutral-800 shadow-none"
        >
          Cancel
        </Button>
        <Button
          disabled={loading}
          onClick={onConfirm}
          className="rounded-full h-9 px-4 text-xs font-medium bg-[#1d1d1f] hover:bg-black dark:bg-white dark:hover:bg-[#f5f5f7] text-white dark:text-[#1d1d1f] shadow-none flex items-center gap-1.5"
        >
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {loading ? "Saving..." : "Save to Report"}
        </Button>
      </div>
    </Modal>
  );
};

export default SaveModal;