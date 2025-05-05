import { getCounter } from "@/actions/counter";
import CountdownTimer from "@/components/CountdownTimer";
import CounterButtons from "@/components/CounterButtons";
import { Card } from "@/components/ui/card";

export const revalidate = 1;

export default async function Home() {
  const { value } = await getCounter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 gap-8">
      <Card className="p-8">
        <h1 className="text-6xl font-bold text-center">{value}</h1>
      </Card>
      <CounterButtons />
      <CountdownTimer />
    </main>
  );
}
