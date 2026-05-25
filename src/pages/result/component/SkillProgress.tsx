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
    <div className={`flex items-center text-sm transition-all duration-150 ${isDimmed ? "opacity-30" : "opacity-100"}`}>
      <div className={`w-28 shrink-0 font-bold transition-colors ${isHovered ? "text-zinc-900" : "text-zinc-500"}`}>
        {skill.name}
      </div>
      
      <div className={`flex-1 h-3 rounded-md mx-4 relative overflow-hidden ${
        skill.isLacking 
          ? "border-2 border-dashed border-zinc-300 bg-transparent" 
          : "bg-zinc-100"
      }`}>
        <motion.div 
          initial={{ width: `${skill.score}%` }}
          animate={{ width: `${displayScore}%` }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`absolute top-0 left-0 h-full transition-colors ${baseColor}`}
        />
      </div>

      <div className={`w-20 shrink-0 flex items-center justify-end font-bold transition-colors ${isHovered ? textColor : 'text-zinc-500'}`}>
        <span className="w-12 inline-block text-right tabular-nums">{displayScore}%</span>
        <span className="w-4 inline-block text-center ml-1 text-xs text-orange-400 font-black">
          {isBonus ? '↑' : ''}
        </span>
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
  if (!skills || skills.length === 0) return null;

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
              key={`${skill.name}-${index}`}
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