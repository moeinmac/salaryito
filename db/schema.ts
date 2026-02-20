import { pgTable, serial, timestamp, integer, time } from "drizzle-orm/pg-core";

export const salaries = pgTable("salaries", {
  id: serial("id").primaryKey(),
  paidAt: timestamp("paid_at", { withTimezone: true, mode: "date" }).notNull(),
  jalaliYear: integer("jalali_year").notNull(),
  jalaliMonth: integer("jalali_month").notNull(),
  jalaliDay: integer("jalali_day").notNull(),
  paidTime: time("paid_time").notNull(),
});
