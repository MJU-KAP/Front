import { motion } from "framer-motion";
import type { Skill } from "../type";

interface SkillCanvasProps {
  skills: Skill[];
  hoveredSkill: string | null;
  setHoveredSkill: (skill: string | null) => void;
}

export default function SkillCanvas({ skills, hoveredSkill, setHoveredSkill }: SkillCanvasProps) {
  return (
    <div className="bg-zinc-900 rounded-3xl p-6 shadow-lg border border-zinc-800 w-full overflow-hidden">
      <div className="flex flex-wrap gap-3">
        {skills.map((skill, index) => {
          const flexBasis = 
            skill.score >= 80 ? "calc(45% - 12px)" : 
            skill.score >= 60 ? "calc(30% - 12px)" : 
            "calc(20% - 12px)";

          // ✅ 현재 마우스가 올라간 스킬인지, 아니면 다른 스킬이 선택되어 흐려져야 하는지 계산
          const isHovered = hoveredSkill === skill.name;
          const isDimmed = hoveredSkill !== null && hoveredSkill !== skill.name;

          return (
            <motion.div
              key={skill.name}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredSkill(skill.name)} // 마우스 올릴 때
              onMouseLeave={() => setHoveredSkill(null)}       // 마우스 뗄 때
              style={{ flexBasis, flexGrow: 1 }}
              className={`h-20 rounded-xl flex items-center justify-center font-bold transition-all duration-300 cursor-pointer
                ${
                  skill.isLacking
                    ? "bg-zinc-800 text-zinc-500 border-2 border-dashed border-zinc-700" 
                    : `${skill.color} text-zinc-900`
                }
                ${isHovered ? "ring-4 ring-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-[1.02]" : ""}
                ${isDimmed ? "opacity-30 grayscale-50" : "opacity-100"}
              `}
            >
              {skill.name}
            </motion.div>
          );
        })}

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: skills.length * 0.1 }}
          className="flex-1 h-20 border-2 border-dashed border-zinc-800 rounded-xl min-w-[100px]"
        />
      </div>
    </div>
  );
}