import { motion } from 'framer-motion';
import type { Skill } from '../type';

function ProgressRow({ 
  skill, index, isHovered, isDimmed, isBonus, displayScore 
}: { 
  skill: Skill, index: number, isHovered: boolean, isDimmed: boolean, isBonus: boolean, displayScore: number 
}) {
  const baseColor = index % 2 === 0 ? "bg-emerald-500" : "bg-orange-500";
  const textColor = index % 2 === 0 ? "text-emerald-500" : "text-orange-500";

  return (
    <div className={`flex items-center text-sm transition-all duration-150 ${isDimmed ? "opacity-30" : "opacity-100"} ${isHovered ? "scale-[1.02]" : ""}`}>
      <div className={`w-28 font-medium transition-colors ${isHovered ? "text-zinc-900 font-bold" : "text-zinc-700"}`}>
        {skill.name}
      </div>
      
      <div className="flex-1 h-2.5 bg-zinc-100 rounded-full overflow-hidden mx-4 relative">
        <motion.div 
          initial={{ width: `${skill.score}%` }}
          animate={{ width: `${displayScore}%` }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`absolute top-0 left-0 h-full rounded-full transition-colors ${baseColor}`}
        />
      </div>
      
      <div className={`w-16 text-right font-bold transition-colors ${isHovered ? textColor : 'text-zinc-500'}`}>
        {displayScore}%
        {isBonus && <span className="text-xs ml-1 text-orange-400 font-black">↑</span>}
      </div>
    </div>
  );
}

interface Props {
  skills: Skill[];
  hoveredSkill: string | null;
  hoveredPlanData: { skill: string, amount: number } | null;
}

export default function SkillProgress({ skills, hoveredSkill, hoveredPlanData }: Props) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm">
      <div className="flex flex-col gap-5">
        {skills.map((skill, index) => {
          const isBonus = hoveredPlanData?.skill === skill.name;
          const bonusAmount = isBonus ? hoveredPlanData.amount : 0; 
          const displayScore = Math.min(100, skill.score + bonusAmount);
          
          const isHovered = hoveredSkill === skill.name || isBonus;
          const isDimmed = (hoveredSkill !== null && hoveredSkill !== skill.name) || 
                           (hoveredPlanData !== null && !isBonus);

          return (
            <ProgressRow 
              key={skill.name}
              skill={skill}
              index={index}
              isHovered={isHovered}
              isDimmed={isDimmed}
              isBonus={isBonus}
              displayScore={displayScore}
            />
          );
        })}
      </div>
    </div>
  );
}