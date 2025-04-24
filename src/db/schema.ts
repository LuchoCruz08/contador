import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const counters = pgTable("counters", {
  id: text("id").primaryKey(),
  value: integer("value").notNull().default(0),
  lastUpdated: timestamp("last_updated", { withTimezone: true })
    .notNull()
    .defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
