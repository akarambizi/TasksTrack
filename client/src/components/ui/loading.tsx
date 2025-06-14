import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: number;
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

export const Loading = ({
  size = 24,
  className = "",
  text = "Loading...",
  fullScreen = false
}: LoadingProps) => {
  const containerClass = cn(
    "flex flex-col items-center justify-center gap-2",
    fullScreen && "fixed inset-0 bg-background/80 backdrop-blur-sm z-50",
    className
  );

  return (
    <div className={containerClass}>
      <Loader2
        className="animate-spin text-primary"
        size={size}
        aria-hidden="true"
      />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};
