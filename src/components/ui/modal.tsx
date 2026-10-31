import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface ModalProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const Modal = ({
  title,
  description,
  isOpen,
  onClose,
  children,
}: ModalProps) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#1c1c1e] shadow-[0_20px_60px_rgba(0,0,0,0.18)] p-6 sm:max-w-md">
        <DialogHeader className="space-y-1.5 text-left">
          <DialogTitle className="text-lg font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;


