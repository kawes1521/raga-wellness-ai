
import { Mic } from "lucide-react";

const AppIcon = () => {
  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse-subtle"></div>
      <div className="z-10">
        <Mic className="h-5 w-5 text-primary" />
      </div>
      <div className="absolute inset-0 border-2 border-primary/30 rounded-full animate-ripple"></div>
    </div>
  );
};

export default AppIcon;
