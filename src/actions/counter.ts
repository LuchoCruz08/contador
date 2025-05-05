"use server";

import { db } from "@/db";
import { counters } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const COUNTER_ID = "global";
const TWENTY_MINUTES = 20 * 60 * 1000;

async function checkAndResetCounter() {
  try {
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
      return { value: 0, createdAt: now, lastUpdated: now };
    }

    return { value, createdAt, lastUpdated };
  } catch (error) {
    console.error("Error en la base de datos:", error);
    const now = new Date();
    return { value: 0, createdAt: now, lastUpdated: now };
  }
}

export async function getCounter() {
  try {
    const { value, createdAt, lastUpdated } = await checkAndResetCounter();
    return { value, createdAt, lastUpdated };
  } catch (error) {
    console.error("Error al obtener el contador de la base de datos:", error);
    const now = new Date();
    return { value: 0, createdAt: now, lastUpdated: now };
  }
}

export async function incrementCounter() {
  try {
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
      revalidatePath("/", "page");
      return { value: 0, createdAt: now, lastUpdated: now };
    }

    const newValue = value + 1;
    await db
      .update(counters)
      .set({ value: newValue, lastUpdated: now })
      .where(eq(counters.id, COUNTER_ID));
    revalidatePath("/", "page");
    return { value: newValue, createdAt, lastUpdated: now };
  } catch (error) {
    console.error(
      "Error de la base de datos al incrementar el contador:",
      error
    );
    const now = new Date();
    return { value: 0, createdAt: now, lastUpdated: now };
  }
}

export async function decrementCounter() {
  try {
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
      revalidatePath("/", "page");
      return { value: 0, createdAt: now, lastUpdated: now };
    }

    const newValue = value - 1;
    await db
      .update(counters)
      .set({ value: newValue, lastUpdated: now })
      .where(eq(counters.id, COUNTER_ID));
    revalidatePath("/", "page");
    return { value: newValue, createdAt, lastUpdated: now };
  } catch (error) {
    console.error("Error en la base de datos al disminuir el contador:", error);
    const now = new Date();
    return { value: 0, createdAt: now, lastUpdated: now };
  }
}
