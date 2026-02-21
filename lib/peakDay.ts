import { SelectSalary } from "@/types/model.type";

export const peakDay = (data: SelectSalary[]) => {
  const dayCounts: any = {};
  data.forEach((d) => (dayCounts[d.jalaliDay] = (dayCounts[d.jalaliDay] || 0) + 1));
  const topDay = Object.keys(dayCounts).reduce((a, b) => (dayCounts[a] > dayCounts[b] ? a : b));
  return { day: +topDay, frequentlyCount: dayCounts[topDay] };
};
