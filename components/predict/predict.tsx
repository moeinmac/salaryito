"use client";
import { SelectSalary } from "@/types/model.type";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import Link from "next/link";

import { FC } from "react";

interface PredictProps {
  data: SelectSalary[];
}

const Predict: FC<PredictProps> = ({ data }) => {
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
    </div>
  );
};

export default Predict;
