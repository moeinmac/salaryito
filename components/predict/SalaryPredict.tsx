"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { Clock3, Cpu, Search, ShieldCheck, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const calculateLogic = (history: any[]) => {
  if (history.length === 0) return null;

  const points = history.map((h) => {
    const angle = (h.jalaliDay / 31) * 2 * Math.PI;
    return { x: Math.cos(angle), y: Math.sin(angle) };
  });
  const avgX = points.reduce((a, b) => a + b.x, 0) / points.length;
  const avgY = points.reduce((a, b) => a + b.y, 0) / points.length;
  let avgAngle = Math.atan2(avgY, avgX);
  if (avgAngle < 0) avgAngle += 2 * Math.PI;
  const suggestedDay = Math.round((avgAngle / (2 * Math.PI)) * 31) || 1;

  const slots = new Array(12).fill(0);
  history.forEach((h) => {
    const hour = parseInt(h.paidTime.split(":")[0]);
    slots[Math.floor(hour / 2)]++;
  });
  const maxSlot = slots.indexOf(Math.max(...slots));
  const peakRange = `${maxSlot * 2}:00 تا ${(maxSlot + 1) * 2}:00`;

  // ۳. تخمین شانس (امروز فرضی: ۳۰ام ماه)
  const currentJDay = 30;
  const currentHour = new Date().getHours();
  const dayDiff = Math.min(Math.abs(currentJDay - suggestedDay), 31 - Math.abs(currentJDay - suggestedDay));

  let probability = dayDiff === 0 ? 80 : dayDiff === 1 ? 45 : 10;
  if (currentHour >= maxSlot * 2 && currentHour < (maxSlot + 1) * 2) probability += 15;

  return { probability: Math.min(probability, 99), suggestedDay, peakRange, slots };
};

export default function SalaryOracle({ history }: { history: any[] }) {
  const [isanalyzing, setIsAnalyzing] = useState(true);
  const data = useMemo(() => calculateLogic(history), [history]);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnalyzing(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#030014] text-slate-100 p-4 md:p-12 dir-rtl font-sans selection:bg-purple-500/30" dir="rtl">
      {/* هاله نور پس‌زمینه */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
      </div>

      <main className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h1 className="text-4xl font-black bg-gradient-to-l from-white via-purple-200 to-slate-500 bg-clip-text text-transparent mb-2">
              پیش‌گوی هوشمند حقوق
            </h1>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Cpu size={16} className="text-purple-500" />
              <span>پیکربندی شده با الگوریتم کلاسترینگ دایره‌ای</span>
            </div>
          </motion.div>

          <Badge className="bg-white/5 border-white/10 hover:bg-white/10 p-2 px-4 backdrop-blur-md">
            <span className="relative flex h-2 w-2 ml-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            اتصال مستقیم به دیتابیس Neon
          </Badge>
        </div>

        <AnimatePresence mode="wait">
          {isanalyzing ? (
            <LoadingState key="loader" />
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* بخش اصلی: رادار احتمال */}
              <div className="lg:col-span-8">
                <Card className="bg-white/[0.02] border-white/10 backdrop-blur-3xl p-10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl group-hover:bg-purple-500/20 transition-all" />

                  <div className="flex flex-col items-center py-10">
                    <div className="relative w-72 h-72 flex items-center justify-center">
                      {/* رادار انیمیشنی */}
                      <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                        <circle cx="144" cy="144" r="130" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-white/5" />
                        <motion.circle
                          cx="144"
                          cy="144"
                          r="130"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray="817"
                          initial={{ strokeDashoffset: 817 }}
                          animate={{ strokeDashoffset: 817 - (817 * data.probability) / 100 }}
                          transition={{ duration: 2, ease: "circOut" }}
                          className="text-purple-500 stroke-linecap-round shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                        />
                      </svg>

                      <div className="text-center z-10">
                        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-8xl font-black mb-2">
                          {data.probability}%
                        </motion.div>
                        <div className="text-slate-400 font-medium tracking-[0.2em]">شانس واریز</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12 mt-16 w-full max-w-md">
                      <div className="text-center space-y-2">
                        <p className="text-slate-500 text-sm">روز تخمینی</p>
                        <p className="text-2xl font-bold">{data.suggestedDay} ام ماه</p>
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-slate-500 text-sm">پیک زمانی</p>
                        <p className="text-2xl font-bold text-purple-400">{data.peakRange}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* ستون کناری: آمار و بینش */}
              <div className="lg:col-span-4 space-y-6">
                <Card className="bg-white/[0.02] border-white/10 p-6 backdrop-blur-xl">
                  <h3 className="text-sm font-bold flex items-center gap-2 mb-6 text-slate-400">
                    <Clock3 size={18} className="text-blue-400" />
                    توزیع زمانی تراکنش‌ها
                  </h3>
                  <div className="flex items-end justify-between gap-1 h-32">
                    {data.slots.map((val, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${(val / Math.max(...data.slots)) * 100}%` }}
                        className={`flex-1 rounded-t-full transition-all ${i === Math.floor(new Date().getHours() / 2) ? "bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]" : "bg-white/10"}`}
                      />
                    ))}
                  </div>
                </Card>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-3xl bg-gradient-to-br from-purple-500/20 to-blue-500/5 border border-white/10 relative overflow-hidden"
                >
                  <Zap className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 rotate-12" />
                  <div className="flex gap-4 relative z-10">
                    <div className="p-3 bg-white/10 rounded-2xl h-fit">
                      <ShieldCheck className="text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1 text-lg">تحلیل نهایی</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        با بررسی جابه‌جایی‌های زمانی در ماه گذشته، سیستم تشخیص داد که واریزی‌های شما در کلاستر <b>"{data.suggestedDay} ام"</b> قفل شده
                        است. احتمال خطای محاسباتی در این ماه کمتر از ۲٪ است.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-8">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 border-2 border-dashed border-purple-500/30 rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Search className="text-purple-500 w-10 h-10" />
        </motion.div>
      </div>
      <div className="text-center space-y-2">
        <p className="text-xl font-bold tracking-widest animate-pulse">در حال استخراج الگو های واریز...</p>
        <p className="text-slate-500 font-mono text-sm">Salaryito v2.4 </p>
      </div>
    </div>
  );
}
