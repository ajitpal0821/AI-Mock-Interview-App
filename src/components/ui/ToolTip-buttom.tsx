import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

// assuming the button variants types are something like following
type ButtonVariant =
  | "ghost"
  | "link"
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | null
  | undefined;

interface TooltipButtonProps {
  content: string;
  icon: React.ReactNode;
  onClick: () => void;
  buttonVariant?: ButtonVariant;
  buttonClassName?: string;
  delay?: number;
  disabled?: boolean;
  disbaled?: boolean;
  loading?: boolean;
}

export const TooltipButton = ({
  content,
  icon,
  onClick,
  buttonVariant = "ghost",
  buttonClassName = "",
  delay = 0,
  disabled = false,
  disbaled = false,
  loading = false,
}: TooltipButtonProps) => {
  const isDisabled = disabled || disbaled || loading;

  return (
    <TooltipProvider delayDuration={delay}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            disabled={isDisabled}
            variant={buttonVariant}
            className={cn(
              "rounded-full transition-all duration-200",
              isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
              buttonClassName
            )}
            onClick={onClick}
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin text-[#86868b]" />
            ) : (
              icon
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="rounded-full px-3 py-1 bg-[#1d1d1f] text-white text-[11px] font-medium border-0 shadow-lg">
          <p>{loading ? "Processing..." : content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};