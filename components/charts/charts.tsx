"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectSalary } from "@/types/model.type";
import { motion } from "framer-motion";
import { Calendar, Clock, Wallet, Zap } from "lucide-react";
import { FC, useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import Insights from "./insights";
import { toPersianNumbers } from "@/lib/utils";

const chartConfig = {
  count: {
    label: "تعداد واریزی",
    theme: {
      light: "hsl(var(--primary))",
      dark: "#10b981",
    },
  },
  time: { label: "بازه زمانی", color: "#06b6d4" },
} satisfies ChartConfig;

interface SalaryDashboardProps {
  data: SelectSalary[];
}

const SalaryDashboard: FC<SalaryDashboardProps> = ({ data }) => {
  const [selectedYear, setSelectedYear] = useState("all");

  const filteredData = useMemo(() => {
    if (selectedYear === "all") return data;
    return data.filter((d) => d.jalaliYear.toString() === selectedYear);
  }, [data, selectedYear]);

  const dayData = useMemo(() => {
    const days = Array.from({ length: 31 }, (_, i) => ({ day: (i + 1).toString(), count: 0 }));
    filteredData.forEach((item) => {
      days[item.jalaliDay - 1].count++;
    });
    return days;
  }, [filteredData]);

  const timeData = useMemo(() => {
    return ["00-02", "04-06", "08-10", "12-14", "16-18", "20-22"].map((label) => {
      const startHour = parseInt(label.split("-")[0]);
      const count = filteredData.filter((item) => {
        const h = parseInt(item.paidTime.split(":")[0]);
        return h >= startHour && h < startHour + 4;
      }).length;
      return { label, count };
    });
  }, [filteredData]);

  const peakTimeAnalysis = useMemo(() => {
    if (filteredData.length === 0) return { text: "داده‌ای برای تحلیل وجود ندارد", count: 0 };

    const counts = new Array(12).fill(0);

    filteredData.forEach((item) => {
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
      count: maxCount,
    };
  }, [filteredData]);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-8 space-y-8 overflow-hidden relative">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full -z-10" />

      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-45 bg-zinc-900/50 border-zinc-800 rounded-xl">
              <SelectValue placeholder="انتخاب سال" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="all">همه سال‌ها</SelectItem>
              <SelectItem value="1403">۱۴۰۳</SelectItem>
              <SelectItem value="1404">۱۴۰۴</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl text-right font-black tracking-tighter">
              سالاریـ<span className="text-emerald-500">تو</span>
            </h1>
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Zap className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
            </div>
          </div>
          <p className="text-zinc-500 font-medium">پس این حقوق ما چی شد؟</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8 bg-zinc-900/40 border-zinc-800/50 backdrop-blur-xl relative overflow-hidden group">
          <CardHeader>
            <CardTitle className="text-xl text-right font-bold">توزیع ماهانه</CardTitle>
            <CardDescription className="text-right flex m-0 gap-2 ml-auto">
              <p> چه روز هایی بیشترین واریزی رو داشتیم؟</p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-75 w-full">
              <BarChart data={dayData} margin={{ top: 20 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} tickFormatter={(value) => toPersianNumbers(value)} />
                <ChartTooltip content={<ChartTooltipContent hideLabel labelFormatter={(value) => `${toPersianNumbers(value)}`} />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={6} activeBar={<rect fill="white" />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 bg-zinc-900/40 border-zinc-800/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-right">ساعت های واریز</CardTitle>
            <CardDescription>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} key={peakTimeAnalysis.text}>
                <p className="text-sm text-emerald-400 leading-relaxed relative z-10 text-right font-medium">{peakTimeAnalysis.text}</p>
                {filteredData.length > 0 && (
                  <p className="text-[12px] text-emerald-500/60 text-right mt-2 uppercase tracking-widest">
                    تعداد تکرار در این بازه: {peakTimeAnalysis.count} بار
                  </p>
                )}
              </motion.div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-75 w-full">
              <AreaChart data={timeData}>
                <defs>
                  <linearGradient id="fillTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="stepAfter" dataKey="count" stroke="var(--color-count)" fill="url(#fillTime)" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <Insights data={filteredData} />
    </div>
  );
};

export default SalaryDashboard;
