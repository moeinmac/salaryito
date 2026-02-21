"use client";
import { SelectSalary } from "@/types/model.type";
import { Zap } from "lucide-react";
import Link from "next/link";
import { Calculator, Calendar, Clock, Sun, TrendingDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { FC, useState } from "react";
import { SalaryPredictor } from "@/lib/algorithm";
import { toPersianNumbers } from "@/lib/utils";
import PredictCard from "./PredictCard";

interface PredictProps {
  data: SelectSalary[];
}

const loadingSteps = [
  "در حال دریافت تاریخچه تراکنش‌ها...",
  "محاسبه وزن‌دهی زمانی (Exponential Decay)...",
  "تشخیص روزهای پرت با توزیع نرمال...",
  "تطبیق ساعات واریزی با بازه‌های زمانی...",
  "تولید پیش‌بینی نهایی...",
];

const Predict: FC<PredictProps> = ({ data }) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const startCalculation = () => {
    setIsCalculating(true);
    setShowResult(false);
    setLoadingStep(0);

    loadingSteps.forEach((_, index) => {
      setTimeout(() => {
        setLoadingStep(index);
      }, index * 800);
    });

    setTimeout(
      () => {
        setIsCalculating(false);
        setShowResult(true);
      },
      loadingSteps.length * 800 + 500,
    );
  };

  const predictor = new SalaryPredictor(data);

  const result = predictor.predict(new Date());

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-8 space-y-8 overflow-hidden relative">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full -z-10" />

      <div className="flex flex-col-reverse md:flex-row justify-between items-end gap-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}></motion.div>
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <Link href={"/"}>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl text-right font-black tracking-tighter">
                سالاریـ<span className="text-emerald-500">تو</span>
              </h1>
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Zap className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
              </div>
            </div>
          </Link>
          <p className="text-zinc-500 font-medium">پس این حقوق ما چی شد؟</p>
        </motion.div>
      </div>
      <div className="text-zinc-100 flex flex-col items-center justify-center p-6">
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center space-y-2">
            <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold tracking-tight">
              پیش‌بینی هوشمند <span style={{ color: "rgb(16 185 129)" }}>واریز حقوق</span>
            </motion.h1>
            <p className="text-zinc-400">مبتنی بر تحلیل الگوهای زمانی و توزیع گاوسی</p>
          </div>

          <AnimatePresence mode="wait">
            {!isCalculating && !showResult && (
              <motion.div
                key="start-btn"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex justify-center mt-12"
              >
                <button
                  onClick={startCalculation}
                  style={{ backgroundColor: "rgb(16 185 129)" }}
                  className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]"
                >
                  <Calculator className="mr-2 h-5 w-5" />
                  <span>تحلیل و پیش‌بینی برای هم‌اکنون</span>
                  <div className="absolute inset-0 h-full w-full rounded-full border-2 border-white/20 group-hover:border-white/50 animate-pulse"></div>
                </button>
              </motion.div>
            )}

            {isCalculating && (
              <motion.div
                key="loading-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 max-w-md mx-auto mt-12"
              >
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative h-24 w-24">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-t-4 border-b-4 border-transparent"
                      style={{ borderTopColor: "rgb(16 185 129)" }}
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                      className="absolute inset-2 rounded-full border-l-4 border-r-4 border-transparent opacity-50"
                      style={{ borderLeftColor: "rgb(16 185 129)" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">🧠</div>
                  </div>

                  <div className="h-8 flex items-center justify-center overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={loadingStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-zinc-300 font-medium text-center"
                      >
                        {loadingSteps[loadingStep]}
                      </motion.p>
                    </AnimatePresence>
                  </div>

                  <div className="w-full bg-zinc-800 rounded-full h-2 mt-4 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: "rgb(16 185 129)" }}
                      initial={{ width: "0%" }}
                      animate={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {showResult && (
              <motion.div
                key="result-state"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
                className="space-y-8"
              >
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: "rgb(16 185 129)" }}></div>
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>

                  <h2 className="text-xl text-zinc-400 mb-6 z-10">احتمال واریز در این لحظه</h2>

                  <div className="relative flex items-center justify-center z-10">
                    <svg className="w-48 h-48 transform -rotate-90">
                      <circle cx="96" cy="96" r="88" className="stroke-zinc-800" strokeWidth="12" fill="none" />
                      <motion.circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="rgb(16 185 129)"
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: 553, strokeDashoffset: 553 }}
                        animate={{ strokeDashoffset: 553 - (553 * result.probabilityPercent) / 100 }}
                        transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                      />
                    </svg>
                    <div className="absolute text-4xl font-black flex items-center" style={{ color: "rgb(16 185 129)" }}>
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                        {toPersianNumbers(result.probabilityPercent)} <span className="text-2xl ml-1">%</span>
                      </motion.span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PredictCard
                    icon={<Calendar />}
                    title="تطابق روز واریز"
                    value={result.details.baseDayChance}
                    desc="نزدیکی به پیک واریزی‌های ماهانه"
                    delay={0.2}
                  />
                  <PredictCard
                    icon={<Sun />}
                    title="تاثیر روز هفته"
                    value={result.details.dayOfWeekModifier}
                    desc="اثر روز کاری و تعطیلات آخر هفته"
                    delay={0.4}
                  />
                  <PredictCard
                    icon={<Clock />}
                    title="شانس بازه زمانی"
                    value={result.details.timeWindowModifier}
                    desc="تطابق ساعت فعلی با ساعت پیک واریزی  "
                    delay={0.6}
                  />
                  <PredictCard
                    icon={<TrendingDown />}
                    title="امید درون‌روزی"
                    value={result.details.intraDayDecay}
                    desc="نا امید شدن بعد از رد شدن از ساعت پیک واریز"
                    delay={0.8}
                  />
                </div>

                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setShowResult(false)}
                    className="text-zinc-400 hover:text-white transition-colors underline underline-offset-4"
                  >
                    محاسبه مجدد
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Predict;
