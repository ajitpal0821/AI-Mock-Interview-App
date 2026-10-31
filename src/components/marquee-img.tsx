export const MarqueImg = ({ img }: { img: string }) => {
  return (
    <div className="flex items-center justify-center px-8 sm:px-12 h-12">
      <img
        src={img}
        className="h-7 w-auto max-w-[120px] object-contain grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-200"
        alt="Tech ecosystem partner"
      />
    </div>
  );
};