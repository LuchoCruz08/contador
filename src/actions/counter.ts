"use server";

import { db } from "@/db";
import { counters } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const COUNTER_ID = "global";

export async function getCounter() {
  const result = await db
    .select()
    .from(counters)
    .where(eq(counters.id, COUNTER_ID));

  const now = new Date();
  if (result.length === 0) {
    await db.insert(counters).values({
      id: COUNTER_ID,
      value: 0,
      createdAt: now,
      lastUpdated: now,
    });

    return { value: 0, createdAt: now };
  }
  const { value, createdAt } = result[0];
  const created_at = createdAt ? new Date(createdAt) : now;
  const diff = now.getTime() - created_at.getTime();

  const twentyMinutes = 20 * 60 * 1000;

  if (diff >= twentyMinutes) {
    await db
      .update(counters)
      .set({ value: 0, createdAt: now, lastUpdated: now })
      .where(eq(counters.id, COUNTER_ID));

    return { value: 0, createdAt: now };
  }

  return { value, createdAt };
}

export async function incrementCounter() {
  const { value, createdAt } = await getCounter();
  const newValue = value + 1;
  await db
    .update(counters)
    .set({ value: newValue, lastUpdated: new Date() })
    .where(eq(counters.id, COUNTER_ID));
  revalidatePath("/");
  return { value: newValue, createdAt };
}

export async function decrementCounter() {
  const { value, createdAt } = await getCounter();
  const newValue = value - 1;
  await db
    .update(counters)
    .set({ value: newValue, lastUpdated: new Date() })
    .where(eq(counters.id, COUNTER_ID));
  revalidatePath("/");
  return { value: newValue, createdAt };
}
