import { getCounter } from "@/actions/counter";
import { CountdownTimer } from "@/components/CountdownTimer";
import CounterButtons from "@/components/CounterButtons";
import { Card } from "@/components/ui/card";

export default async function Home() {
  const { value, createdAt } = await getCounter();

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-6 w-full max-w-md px-4">
        <Card className="w-full overflow-hidden border-primary/5 bg-background/80 backdrop-blur-md p-8">
          <div className="text-7xl font-bold text-center mb-8 font-mono text-primary">
            {value}
          </div>
          <CounterButtons />
        </Card>
        <CountdownTimer createdAt={createdAt} className="w-full" />
      </div>
    </main>
  );
}
