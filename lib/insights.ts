import { SelectSalary } from "@/types/model.type";

export const getMonthName = (monthNum: number) => {
  const months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
  return months[monthNum - 1] || "نامشخص";
};

export const analyzeStability = (data: SelectSalary[]) => {
  if (data.length < 2) return { label: "دیتای ناکافی", color: "text-zinc-500" };

  const days = data.map((d) => d.jalaliDay);
  const mean = days.reduce((a, b) => a + b) / days.length;
  const variance = days.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / days.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev < 1.5) return { label: "فوق‌العاده منظم", color: "text-emerald-400" };
  if (stdDev < 4) return { label: "پایدار و خوب", color: "text-cyan-400" };
  return { label: "متغیر و نامنظم", color: "text-orange-400" };
};

export const getAverageTime = (data: SelectSalary[]) => {
  if (data.length === 0) return "--:--";
  const totalMinutes = data.reduce((acc, item) => {
    const [h, m] = item.paidTime.split(":").map(Number);
    return acc + (h * 60 + m);
  }, 0);
  const avgMinutes = totalMinutes / data.length;
  const h = Math.floor(avgMinutes / 60);
  const m = Math.floor(avgMinutes % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};
