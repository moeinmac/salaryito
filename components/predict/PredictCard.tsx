import { toPersianNumbers } from "@/lib/utils";
import { motion } from "framer-motion";
import { FC, ReactNode } from "react";

interface PredictCardProps {
  icon: ReactNode;
  title: string;
  value: number;
  desc: string;
  delay: number;
}

const PredictCard: FC<PredictCardProps> = ({ icon, title, value, desc, delay }) => {
  const percentage = Math.round(value * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + 1, duration: 0.5 }}
      className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5 hover:border-emerald-500/30 transition-colors group"
    >
      <div className="flex items-center justify-between mb-4" dir="rtl">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="p-2 bg-zinc-700 rounded-lg group-hover:bg-emerald-500/20 group-hover:text-emerald-500 transition-colors text-zinc-400">
            {icon}
          </div>
          <h3 className="font-semibold text-slate-200 mr-3">{title}</h3>
        </div>
        <span className="text-lg font-bold" style={{ color: "rgb(16 185 129)" }}>
          {toPersianNumbers(percentage)}%
        </span>
      </div>

      <div className="w-full bg-zinc-700 rounded-full h-1.5 mb-3">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: "rgb(16 185 129)" }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: delay + 1.2, ease: "easeOut" }}
        />
      </div>
      <p className="text-sm text-zinc-500">{desc}</p>
    </motion.div>
  );
};

export default PredictCard;
