import { salaries } from "@/db/schema";

export type SelectSalary = typeof salaries.$inferSelect;
export type InsertSalary = typeof salaries.$inferInsert;
