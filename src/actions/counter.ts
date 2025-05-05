"use server";

import { db } from "@/db";
import { counters } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const COUNTER_ID = "global";
const TWENTY_MINUTES = 20 * 60 * 1000;

async function checkAndResetCounter() {
  const now = new Date();
  const result = await db
    .select()
    .from(counters)
    .where(eq(counters.id, COUNTER_ID));

  if (result.length === 0) {
    await db.insert(counters).values({
      id: COUNTER_ID,
      value: 0,
      createdAt: now,
      lastUpdated: now,
    });
    revalidatePath("/");
    return { value: 0, createdAt: now, lastUpdated: now };
  }

  const { value, createdAt, lastUpdated } = result[0];
  const createdDate = createdAt ? new Date(createdAt) : now;
  const timeSinceCreation = now.getTime() - createdDate.getTime();

  if (timeSinceCreation >= TWENTY_MINUTES) {
    await db
      .update(counters)
      .set({
        value: 0,
        lastUpdated: now,
        createdAt: now,
      })
      .where(eq(counters.id, COUNTER_ID));
    revalidatePath("/");
    return { value: 0, createdAt: now, lastUpdated: now };
  }

  return { value, createdAt, lastUpdated };
}

export async function getCounter() {
  const { value, createdAt, lastUpdated } = await checkAndResetCounter();
  return { value, createdAt, lastUpdated };
}

export async function incrementCounter() {
  const { value, createdAt } = await checkAndResetCounter();
  const now = new Date();
  const createdDate = createdAt ? new Date(createdAt) : now;
  const timeSinceCreation = now.getTime() - createdDate.getTime();

  if (timeSinceCreation >= TWENTY_MINUTES) {
    await db
      .update(counters)
      .set({
        value: 0,
        lastUpdated: now,
        createdAt: now,
      })
      .where(eq(counters.id, COUNTER_ID));
    revalidatePath("/");
    return { value: 0, createdAt: now, lastUpdated: now };
  }

  const newValue = value + 1;
  await db
    .update(counters)
    .set({ value: newValue, lastUpdated: now })
    .where(eq(counters.id, COUNTER_ID));
  revalidatePath("/");
  return { value: newValue, createdAt, lastUpdated: now };
}

export async function decrementCounter() {
  const { value, createdAt } = await checkAndResetCounter();
  const now = new Date();
  const createdDate = createdAt ? new Date(createdAt) : now;
  const timeSinceCreation = now.getTime() - createdDate.getTime();

  if (timeSinceCreation >= TWENTY_MINUTES) {
    await db
      .update(counters)
      .set({
        value: 0,
        lastUpdated: now,
        createdAt: now,
      })
      .where(eq(counters.id, COUNTER_ID));
    revalidatePath("/");
    return { value: 0, createdAt: now, lastUpdated: now };
  }

  const newValue = value - 1;
  await db
    .update(counters)
    .set({ value: newValue, lastUpdated: now })
    .where(eq(counters.id, COUNTER_ID));
  revalidatePath("/");
  return { value: newValue, createdAt, lastUpdated: now };
}
