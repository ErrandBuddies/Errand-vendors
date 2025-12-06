import { cn } from "@/lib/utils";

const Logo = ({ className }) => {
  return (
    <div className={cn("flex justify-end items-center gap-2", className)}>
      <div className="w-20 h-20 rounded-lg flex flex-col items-center justify-center">
        <span className="text-white font-bold text-xl">
          <img
            src="https://res.cloudinary.com/dlxu4ej5u/image/upload/v1745801275/android-chrome-192x192_koafw9.png"
            alt="logo"
          />
        </span>
        <span className="text-xs text-secondary font-medium">Vendor</span>
      </div>
      {/* <div className="flex flex-col">
        <span className="font-bold text-primary text-lg leading-none">
          ErrandBuddies
        </span>
      </div> */}
    </div>
  );
};

export { Logo };
