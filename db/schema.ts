import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const log = pgTable("log", {
  id: uuid("id").defaultRandom().primaryKey(),
  date: timestamp("date").defaultNow().notNull(),
  description: text("description"),
});
