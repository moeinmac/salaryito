import { analyzeStability, getMonthName } from "@/lib/insights";
import { SelectSalary } from "@/types/model.type";
import { Calendar, Clock, Wallet, Zap } from "lucide-react";
import { FC, useMemo } from "react";
import { motion } from "framer-motion";
import { toPersianNumbers } from "@/lib/utils";
import { peakDay } from "@/lib/peakDay";

interface InsightProps {
  data: SelectSalary[];
}

const Insights: FC<InsightProps> = ({ data }) => {
  const insights = useMemo(() => {
    if (data.length === 0) return [];

    const monthCounts: any = {};
    data.forEach((d) => (monthCounts[d.jalaliMonth] = (monthCounts[d.jalaliMonth] || 0) + 1));
    const topMonthNum = Object.keys(monthCounts).reduce((a, b) => (monthCounts[a] > monthCounts[b] ? a : b));

    const peakDayOutPut = peakDay(data);

    const stability = analyzeStability(data);

    return [
      {
        label: "مجموع تراکنش‌ها",
        val: `${toPersianNumbers(data.length)} مورد`,
        icon: Wallet,
        color: "text-blue-400",
        desc: "در بازه زمانی انتخاب شده",
      },
      {
        label: "ماه پر تراکنش",
        val: getMonthName(parseInt(topMonthNum)),
        icon: Calendar,
        color: "text-purple-400",
        desc: "بیشترین تعداد واریزی",
      },
      {
        label: "روز واریز غالب",
        val: ` ${toPersianNumbers(peakDayOutPut.day)} ام ماه`,
        icon: Clock,
        color: "text-orange-400",
        desc: `تکرار در ${toPersianNumbers(peakDayOutPut.frequentlyCount)} ماه`,
      },
      {
        label: "وضعیت پایداری",
        val: stability.label,
        icon: Zap,
        color: stability.color,
        desc: "بر اساس انحراف معیار روزها",
      },
    ];
  }, [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {insights.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="p-5 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl backdrop-blur-sm relative overflow-hidden group"
        >
          <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity ${item.color}`}>
            <item.icon size={100} />
          </div>

          <div className="flex items-start justify-between relative z-10">
            <div className={`p-2.5 rounded-xl bg-zinc-800/80 ${item.color}`}>
              <item.icon size={22} />
            </div>
            <div className="text-right" dir="rtl">
              <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-tighter mb-1">{item.label}</p>
              <p className={`text-xl font-bold  tracking-tight ${item.color === "text-zinc-500" ? "text-zinc-100" : ""}`}>{item.val}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1 relative z-10">
            <div className="w-1 h-1 rounded-full bg-zinc-700" />
            <p className="text-[10px] text-zinc-500 font-medium">{item.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Insights;
