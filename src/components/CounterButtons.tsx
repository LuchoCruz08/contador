"use client";

import { useTransition } from "react";
import { incrementCounter, decrementCounter } from "@/actions/counter";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { toast } from "sonner";

export default function CounterButtons() {
  const [isPending, startTransition] = useTransition();

  const handleModify = (value: "increment" | "decrement") => {
    startTransition(async () => {
      try {
        if (value === "increment") {
          await incrementCounter();
        } else {
          await decrementCounter();
        }
      } catch (error) {
        toast.error(
          `Error: ${
            error instanceof Error ? error.message : "Error"
          }`
        );
      }
    });
  };

  return (
    <div className="flex gap-6 justify-center">
      <Button
        onClick={() => handleModify("decrement")}
        disabled={isPending}
        variant="outline"
        size="lg"
        className="w-20 h-20 rounded-full bg-destructive/5 hover:bg-destructive/10 border-destructive/20 hover:border-destructive/30 transition-all duration-200"
      >
        <Minus className="h-8 w-8" />
      </Button>
      <Button
        onClick={() => handleModify("increment")}
        disabled={isPending}
        variant="outline"
        size="lg"
        className="w-20 h-20 rounded-full bg-primary/5 hover:bg-primary/10 border-primary/20 hover:border-primary/30 transition-all duration-200"
      >
        <Plus className="h-8 w-8" />
      </Button>
    </div>
  );
}
