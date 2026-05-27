import { motion } from 'framer-motion';
import type { Skill } from '../type';

function ProgressRow({ 
  skill, isHovered, isDimmed, isBonus, bonusAmount, displayScore, setHoveredSkill
}: { 
  skill: Skill, isHovered: boolean, isDimmed: boolean, isBonus: boolean, bonusAmount: number, displayScore: number, setHoveredSkill: (name: string | null) => void 
}) {
  const isMet = skill.score >= skill.required_score;
  const baseColor = isMet ? "bg-emerald-500" : "bg-orange-500";
  const textColor = isMet ? "text-emerald-500" : "text-orange-500";
  return (
    <div 
      className={`flex items-center text-sm transition-all duration-150 ${isDimmed ? "opacity-30" : "opacity-100"}`}
      onMouseEnter={() => setHoveredSkill(skill.name)}
      onMouseLeave={() => setHoveredSkill(null)}
    >
      <div className={`w-28 shrink-0 font-bold transition-colors cursor-pointer ${isHovered ? "text-zinc-900" : "text-zinc-500"}`}>
        {skill.name}
      </div>

      <div className="flex-1 h-4 rounded-md mx-4 relative bg-zinc-100 border border-zinc-200 overflow-hidden cursor-pointer">

        {skill.required_score > skill.score && (
          <div 
            style={{ left: `${skill.score}%`, width: `${skill.required_score - skill.score}%` }}
            className="absolute top-0 h-full bg-zinc-300 z-0"
          />
        )}

        <motion.div 
          initial={{ width: `0%` }}
          animate={{ width: `${skill.score}%` }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`absolute top-0 left-0 h-full ${baseColor} z-10`}
        />

        {isBonus && bonusAmount > 0 && (
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${bonusAmount}%` }}
            style={{ left: `${skill.score}%` }}
            className="absolute top-0 h-full bg-orange-400/80 z-20"
          />
        )}

        {skill.score > 0 && skill.required_score > 0 && (
          <div 
            style={{ left: 0, width: `${skill.required_score}%` }}
            className="absolute top-0 h-full border-r-2 border-dashed border-zinc-600/70 z-30 pointer-events-none"
          />
        )}
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
  setHoveredSkill: (name: string | null) => void;
  hoveredPlanData: { skill: string, amount: number } | null;
}

export default function SkillProgress({ skills, hoveredSkill, setHoveredSkill, hoveredPlanData }: Props) {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm">
      <div className="flex flex-col gap-5">
        {skills.map((skill) => {
          const isBonus = hoveredPlanData?.skill === skill.name;
          const bonusAmount = isBonus ? hoveredPlanData.amount : 0; 
          
          const displayScore = Math.min(100, skill.score + bonusAmount);
          
          const isHovered = hoveredSkill === skill.name || isBonus;
          const isDimmed = (hoveredSkill !== null && hoveredSkill !== skill.name) || 
                           (hoveredPlanData !== null && !isBonus);

          return (
            <ProgressRow 
              key={`${skill.name}-${skill.isLacking ? 'lack' : 'own'}`}
              skill={skill}
              isHovered={isHovered}
              isDimmed={isDimmed}
              isBonus={isBonus}
              bonusAmount={bonusAmount}
              displayScore={displayScore}
              setHoveredSkill={setHoveredSkill}
            />
          );
        })}
      </div>
    </div>
  );
}