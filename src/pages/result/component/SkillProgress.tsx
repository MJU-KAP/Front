"use client";
import { motion } from "framer-motion";
import type { Skill } from "../type";

export default function SkillProgress({ skills }: { skills: Skill[] }) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm">
      <div className="flex flex-col gap-5">
        {skills.map((skill, index) => (
          <div key={skill.name} className="flex items-center text-sm">
            <div className="w-28 font-medium text-zinc-700">{skill.name}</div>
            
            <div className="flex-1 h-2.5 bg-zinc-100 rounded-full overflow-hidden mx-4 relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${skill.score}%` }}
                transition={{ duration: 1, delay: 0.5 + (index * 0.1), ease: "easeOut" }}
                className={`absolute top-0 left-0 h-full rounded-full ${skill.color}`}
              />
            </div>
            
            <div className={`w-12 text-right font-bold ${skill.isLacking ? 'text-red-400' : 'text-orange-500'}`}>
              {skill.score}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}