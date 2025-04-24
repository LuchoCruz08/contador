import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Timer } from "lucide-react";

interface CountdownTimerProps {
  createdAt: Date | null;
  className?: string;
}

export function CountdownTimer({ createdAt, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState("--:--");
  const [expired, setExpired] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!createdAt) return;

    const interval = setInterval(() => {
      const now = new Date();
      const created = new Date(createdAt);
      const totalDuration = 20 * 60 * 1000; 
      const elapsed = now.getTime() - created.getTime();
      const remaining = totalDuration - elapsed;

      if (remaining <= 0) {
        setTimeLeft("00:00");
        setProgress(0);
        setExpired(true);
        clearInterval(interval);
        return;
      }

      const minutes = Math.floor(remaining / 1000 / 60);
      const seconds = Math.floor((remaining / 1000) % 60);
      const percentage = Math.max(
        0,
        Math.min(100, (remaining / totalDuration) * 100)
      );

      setTimeLeft(
        `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
      setProgress(percentage);
      setExpired(false);
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt]);

  return (
    <Card
      className={cn(
        "relative p-5 overflow-hidden border-primary/5 bg-background/80 backdrop-blur-md transition-all",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex items-center justify-center h-10 w-10 rounded-full transition-all",
            expired
              ? "bg-destructive/10 text-destructive"
              : "bg-primary/10 text-primary"
          )}
        >
          <Timer className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {expired ? "El contador se reinició" : "Tiempo hasta que se reinicie"}
          </p>
          <p
            className={cn(
              "text-2xl font-mono font-bold transition-all",
              expired ? "text-destructive" : "text-primary"
            )}
          >
            {timeLeft}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className={cn(
          "absolute bottom-0 left-0 h-1 transition-all duration-1000 ease-in-out",
          expired ? "bg-destructive" : "bg-primary"
        )}
        style={{ width: `${progress}%` }}
      />
    </Card>
  );
}
