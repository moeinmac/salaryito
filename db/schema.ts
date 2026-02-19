import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const log = pgTable("log", {
  id: integer("id").primaryKey(),
  date: timestamp("date").defaultNow().notNull(),
  description: text("description"),
});
