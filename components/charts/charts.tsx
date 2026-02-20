"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectSalary } from "@/types/model.type";
import { motion } from "framer-motion";
import { Calendar, Clock, Wallet, Zap } from "lucide-react";
import { FC, useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  count: {
    label: "تعداد واریزی",
    theme: {
      light: "hsl(var(--primary))",
      dark: "#10b981",
    },
  },
  time: {
    label: "بازه زمانی",
    color: "#06b6d4",
  },
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
            <CardDescription className="text-right">چه روز هایی بیشترین واریزی رو داشتیم؟</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-75 w-full">
              <BarChart data={dayData} margin={{ top: 20 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} tickFormatter={(val) => `${val}`} />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={6} activeBar={<rect fill="white" />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 bg-zinc-900/40 border-zinc-800/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-right">ساعت های واریز</CardTitle>
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
            <div className="mt-4 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <p className="text-xs text-emerald-400 leading-relaxed text-center">بیشتر حقوق‌های شما در بازه عصر (۱۶-۲۰) واریز شده است.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid of Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "مجموع دفعات", val: filteredData.length, icon: Wallet, color: "text-blue-400" },
          { label: "منظم‌ترین ماه", val: "شهریور", icon: Calendar, color: "text-purple-400" },
          { label: "میانگین روز", val: "۲۹ ام", icon: Clock, color: "text-orange-400" },
          { label: "وضعیت پایداری", val: "عالی", icon: Zap, color: "text-emerald-400" },
        ].map((item, i) => (
          <motion.div key={i} whileHover={{ y: -5 }} className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-zinc-800 ${item.color}`}>
              <item.icon size={20} />
            </div>
            <div>
              <p className="text-xs text-zinc-500">{item.label}</p>
              <p className="text-lg font-bold">{item.val}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SalaryDashboard;
