import { SelectSalary } from "@/types/model.type";

type ReturnType = {
  text: string;
  frequentlyCount: number;
  startHour: number;
  endHour: number;
};

export const peakTime = (data: SelectSalary[]): ReturnType => {
  if (data.length === 0) return { text: "داده‌ای برای تحلیل وجود ندارد", frequentlyCount: 0, endHour: 0, startHour: 0 };

  const counts = new Array(12).fill(0);

  data.forEach((item) => {
    const hour = parseInt(item.paidTime.split(":")[0]);
    counts[Math.floor(hour / 2)]++;
  });

  const maxCount = Math.max(...counts);
  const maxIndex = counts.indexOf(maxCount);

  const startHour = maxIndex * 2;
  const endHour = (maxIndex * 2 + 2) % 24;

  let timeDescription = "";
  if (startHour >= 5 && startHour < 12) timeDescription = "صبح";
  else if (startHour >= 12 && startHour < 16) timeDescription = "ظهر";
  else if (startHour >= 16 && startHour < 20) timeDescription = "عصر";
  else timeDescription = "آخر شب یا بامداد";

  return {
    text: `بیشترین حقوق‌های شما در بازه ${timeDescription} (ساعت ${startHour} الی ${endHour}) واریز شده است`,
    frequentlyCount: maxCount,
    startHour,
    endHour,
  };
};
