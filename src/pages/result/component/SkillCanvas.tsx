"use client";
import { motion } from "framer-motion";

export default function SkillCanvas() {
  return (
    <div className="bg-zinc-900 rounded-3xl p-6 shadow-lg border border-zinc-800 w-full overflow-hidden">
      <div className="flex flex-col gap-3">
        {/* 1번째 줄 */}
        <div className="flex gap-3 h-20">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex-grow bg-orange-500 rounded-xl flex items-center justify-center font-bold text-zinc-900">React</motion.div>
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="w-32 bg-emerald-400 rounded-xl flex items-center justify-center font-bold text-zinc-900">CSS</motion.div>
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="w-16 bg-zinc-100 rounded-xl"></motion.div>
        </div>
        
        {/* 2번째 줄 */}
        <div className="flex gap-3 h-20">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="w-40 bg-orange-500 rounded-xl flex items-center justify-center font-bold text-zinc-900">TypeScript</motion.div>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }} className="flex-grow bg-emerald-400 rounded-xl flex items-center justify-center font-bold text-zinc-900">Next.js</motion.div>
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="w-24 bg-orange-500 rounded-xl flex items-center justify-center font-bold text-zinc-900">Git</motion.div>
        </div>

        {/* 3번째 줄 */}
        <div className="flex gap-3 h-20">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="flex-1 bg-emerald-400 rounded-xl flex items-center justify-center font-bold text-zinc-900">Node.js</motion.div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }} className="flex-1 bg-orange-500 rounded-xl flex items-center justify-center font-bold text-zinc-900">REST API</motion.div>
          <motion.div className="w-24 bg-zinc-800 rounded-xl"></motion.div>
        </div>

        {/* 4번째 줄 (비어있는/부족한 블록) */}
        <div className="flex gap-3 h-20">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="w-24 bg-zinc-200 text-zinc-400 rounded-xl flex items-center justify-center font-bold">Testing</motion.div>
          <motion.div className="flex-1 border-2 border-dashed border-zinc-700 rounded-xl"></motion.div>
          <motion.div className="flex-1 border-2 border-dashed border-zinc-700 rounded-xl"></motion.div>
        </div>
      </div>
    </div>
  );
}