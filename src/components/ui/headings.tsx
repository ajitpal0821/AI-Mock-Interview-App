interface HeadingsProps {
  title: string;
  description?: string;
  isSubHeading?: boolean;
}
import { cn } from "@/lib/utils";

export const Headings = ({
  title,
  description,
  isSubHeading = false,
}: HeadingsProps) => {
  return (
    <div className="space-y-1">
      <h2
        className={cn(
          "font-semibold tracking-[-0.025em] text-[#1d1d1f] dark:text-[#f5f5f7]",
          isSubHeading ? "text-lg md:text-xl" : "text-2xl md:text-3xl"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="text-xs md:text-sm text-[#86868b] dark:text-neutral-400 font-normal leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};
