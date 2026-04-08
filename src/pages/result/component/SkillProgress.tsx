import { motion } from 'framer-motion';
import type { Skill } from '../type';

interface Props {
  skills: Skill[];
  hoveredSkill: string | null;
}

export default function SkillProgress({ skills, hoveredSkill }: Props) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm">
      <div className="flex flex-col gap-5">
        {skills.map((skill, index) => {
          // ✅ 강조 여부 계산
          const isHovered = hoveredSkill === skill.name;
          const isDimmed = hoveredSkill !== null && hoveredSkill !== skill.name;

          return (
            <div 
              key={skill.name} 
              className={`flex items-center text-sm transition-all duration-300 ${isDimmed ? "opacity-30" : "opacity-100"} ${isHovered ? "scale-[1.02]" : ""}`}
            >
              <div className={`w-28 font-medium ${isHovered ? "text-orange-500 font-bold" : "text-zinc-700"}`}>
                {skill.name}
              </div>
              
              <div className="flex-1 h-2.5 bg-zinc-100 rounded-full overflow-hidden mx-4 relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.score}%` }}
                  transition={{ duration: 1, delay: 0.5 + (index * 0.1), ease: "easeOut" }}
                  className={`absolute top-0 left-0 h-full rounded-full transition-colors ${isHovered ? skill.color : (skill.isLacking ? 'bg-red-300' : 'bg-zinc-300')}`}
                />
              </div>
              
              <div className={`w-12 text-right font-bold ${skill.isLacking ? 'text-red-400' : 'text-orange-500'}`}>
                {skill.score}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}