/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useTransition, useEffect } from "react";
import {
  incrementCounter,
  decrementCounter,
  getCounter,
} from "@/actions/counter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Minus, RefreshCw } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export default function Counter() {
  const [value, setValue] = useState<number | null>(null);
  const [createdAt, setCreatedAt] = useState<Date | null>(null);
  const [isPending, startTransition] = useTransition();
  const [animateValue, setAnimateValue] = useState(false);

  useEffect(() => {
    const fetchValue = async () => {
      try {
        const result = await getCounter();
        setValue(result.value);
        setCreatedAt(result.createdAt ? new Date(result.createdAt) : null);
      } catch (error) {
        toast.error("No se pudo obtener el valor del contador");
      }
    };
    fetchValue();

    const interval = setInterval(fetchValue, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleIncrement = () => {
    setAnimateValue(true);
    startTransition(async () => {
      try {
        const updated = await incrementCounter();
        setValue(updated.value);
        setCreatedAt(updated.createdAt ? new Date(updated.createdAt) : null);
      } catch (error) {
        toast.error("Error al incrementar el contador");
      } finally {
        setTimeout(() => setAnimateValue(false), 300);
      }
    });
  };

  const handleDecrement = () => {
    setAnimateValue(true);
    startTransition(async () => {
      try {
        const updated = await decrementCounter();
        setValue(updated.value);
        setCreatedAt(updated.createdAt ? new Date(updated.createdAt) : null);
      } catch (error) {
        toast.error("Error al disminuir el contador");
      } finally {
        setTimeout(() => setAnimateValue(false), 300);
      }
    });
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md px-4">
      <AnimatePresence mode="wait">
        {value === null ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <Card className="w-full p-8 bg-background/60 backdrop-blur-md border-primary/5 animate-pulse">
              <div className="h-24 flex items-center justify-center">
                <RefreshCw className="h-8 w-8 text-muted-foreground animate-spin" />
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="loaded"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <Card className="w-full overflow-hidden border-primary/5 bg-background/80 backdrop-blur-md">
              <div className="relative p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-30" />

                <div className="relative">
                  <motion.div
                    key={value}
                    initial={{ scale: animateValue ? 1.2 : 1 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    className="text-7xl font-bold text-center mb-8 font-mono text-primary"
                  >
                    {value}
                  </motion.div>

                  <div className="flex gap-6 justify-center">
                    <Button
                      onClick={handleDecrement}
                      disabled={isPending}
                      variant="outline"
                      size="lg"
                      className="w-20 h-20 rounded-full bg-destructive/5 hover:bg-destructive/10 border-destructive/20 hover:border-destructive/30 transition-all duration-200 relative"
                    >
                      <span className="absolute inset-0 rounded-full bg-destructive/5 opacity-0 hover:opacity-100 transition-opacity" />
                      <Minus className="h-8 w-8" />
                    </Button>

                    <Button
                      onClick={handleIncrement}
                      disabled={isPending}
                      variant="outline"
                      size="lg"
                      className="w-20 h-20 rounded-full bg-primary/5 hover:bg-primary/10 border-primary/20 hover:border-primary/30 transition-all duration-200 relative"
                    >
                      <span className="absolute inset-0 rounded-full bg-primary/5 opacity-0 hover:opacity-100 transition-opacity" />
                      <Plus className="h-8 w-8" />
                    </Button>
                  </div>

                  {isPending && (
                    <div className="text-sm text-muted-foreground text-center mt-6 flex items-center justify-center gap-2">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      <span>Actualizando...</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <CountdownTimer createdAt={createdAt} className="w-full" />
    </div>
  );
}
