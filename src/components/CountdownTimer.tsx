import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Timer } from "lucide-react";
import { getCounter } from "@/actions/counter";

interface CountdownTimerProps {
  className?: string;
}

export default async function CountdownTimer({
  className,
}: CountdownTimerProps) {
  const { createdAt } = await getCounter();
  const now = new Date();
  const created = new Date(createdAt ?? new Date());
  const totalDuration = 20 * 60 * 1000;
  const elapsed = now.getTime() - created.getTime();
  const remaining = totalDuration - elapsed;

  const expired = remaining <= 0;
  const progress = expired
    ? 0
    : Math.max(0, Math.min(100, (remaining / totalDuration) * 100));

  const minutes = Math.floor(Math.max(0, remaining) / 1000 / 60);
  const seconds = Math.floor((Math.max(0, remaining) / 1000) % 60);

  const timeLeft = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

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
            {expired
              ? "El contador se reinició"
              : "Tiempo hasta que se reinicie"}
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
