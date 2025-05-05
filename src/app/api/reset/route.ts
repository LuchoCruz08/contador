/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "@/db";
import { counters } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const COUNTER_ID = "global";

export async function GET() {
  try {
    const result = await db
      .select()
      .from(counters)
      .where(eq(counters.id, COUNTER_ID));

    const now = new Date();
    if (result.length === 0) {
      return NextResponse.json(
        { message: "No se encontró un contador" },
        { status: 404 }
      );
    }

    const { createdAt } = result[0];
    const created = createdAt ? new Date(createdAt) : now;
    const diff = now.getTime() - created.getTime();
    const twentyMinutes = 20 * 60 * 1000;

    if (diff >= twentyMinutes) {
      await db
        .update(counters)
        .set({ value: 0, createdAt: now, lastUpdated: now })
        .where(eq(counters.id, COUNTER_ID));

      return NextResponse.json({ message: "Contador reiniciado" });
    }

    return NextResponse.json({ message: "Contador no reiniciado" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al reiniciar el contador" },
      { status: 500 }
    );
  }
}
