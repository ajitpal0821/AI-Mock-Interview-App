import { cn } from "@/lib/utils";

interface LoaderPageProps {
  className?: string;
  title?: string;
  description?: string;
}

export const LoaderPage = ({
  className,
  title = "Loading...",
  description = "Please wait while we prepare everything for you",
}: LoaderPageProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full min-h-[60vh] p-6 text-center transition-all duration-300",
        className
      )}
    >
      {/* Apple Frosted Card Chassis */}
      <div className="rounded-3xl border border-black/[0.06] dark:border-white/[0.08] bg-white/80 dark:bg-[#161618]/80 backdrop-blur-2xl p-8 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.04)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] flex flex-col items-center max-w-sm w-full mx-auto">
        
        {/* Apple Precision Activity Indicator */}
        <div className="relative w-10 h-10 mb-5">
          <svg
            className="w-full h-full animate-spin text-[#1d1d1f] dark:text-white"
            viewBox="0 0 36 36"
            style={{ animationDuration: "1s" }}
          >
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="opacity-15"
            />
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray="60"
              strokeDashoffset="40"
              strokeLinecap="round"
              className="opacity-90"
            />
          </svg>
        </div>

        {/* Clean Apple Typography */}
        <div className="space-y-1.5 text-center">
          <h3 className="text-sm sm:text-base font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-[#86868b] font-normal leading-relaxed max-w-xs">
              {description}
            </p>
          )}
        </div>

        {/* Apple Hairline Indeterminate Progress Track */}
        <div className="w-28 h-[2px] bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden mt-6 relative">
          <div className="h-full w-1/3 bg-[#1d1d1f] dark:bg-white rounded-full animate-apple-indeterminate" />
        </div>
      </div>
    </div>
  );
};

export default LoaderPage;
