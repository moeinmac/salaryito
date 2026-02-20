"use server";

import { db } from "@/db/db";
import { salaries } from "@/db/schema";
import { format } from "date-fns-jalali";

export async function addSalaryRecord(formData: FormData) {
  try {
    const isoDate = formData.get("paidAt") as string;
    const dateObj = new Date(isoDate);

    const iranTimeStr = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Tehran",
    }).format(dateObj);

    await db.insert(salaries).values({
      paidAt: dateObj,
      jalaliYear: parseInt(format(dateObj, "yyyy"), 10),
      jalaliMonth: parseInt(format(dateObj, "MM"), 10),
      jalaliDay: parseInt(format(dateObj, "dd"), 10),
      paidTime: iranTimeStr,
    });

    return { success: true, message: "با موفقیت ثبت شد" };
  } catch (e) {
    console.log(e);

    return { success: false, message: "خطایی رخ داد" };
  }
}
