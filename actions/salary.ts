"use server";

import { format } from "date-fns-jalali";
import { salaries } from "@/db/schema";
import { db } from "@/db/db";

export async function addSalaryRecord(formData: FormData) {
  try {
    const rawDateString = formData.get("paidAt") as string;
    const paidAtDate = new Date(rawDateString);

    const iranTimeStr = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Tehran",
    }).format(paidAtDate);

    await db.insert(salaries).values({
      paidAt: paidAtDate,
      jalaliYear: parseInt(format(paidAtDate, "yyyy"), 10),
      jalaliMonth: parseInt(format(paidAtDate, "MM"), 10),
      jalaliDay: parseInt(format(paidAtDate, "dd"), 10),
      paidTime: iranTimeStr,
    });

    return { success: true, message: "حقوق با موفقیت ثبت شد!" };
  } catch (error) {
    console.error("خطا در ثبت حقوق:", error);
    return { success: false, message: "مشکلی در ثبت اطلاعات پیش آمد." };
  }
}
