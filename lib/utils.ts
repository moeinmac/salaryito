import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const toPersianNumbers = (n: number | string) => n.toString().replace(/\d/g, (x) => "۰۱۲۳۴۵۶۷۸۹"[x]);
