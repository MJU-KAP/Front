import { motion } from "framer-motion";
import type { Skill } from "../type";

interface SkillCanvasProps {
  skills: Skill[];
  hoveredSkill: string | null;
  setHoveredSkill: (skill: string | null) => void;
  hoveredPlanData: { skill: string, amount: number } | null;
}

export default function SkillCanvas({ skills, hoveredSkill, setHoveredSkill, hoveredPlanData }: SkillCanvasProps) {
  
  const chunks: any[] = [];
  let currentWidth = 0;

  // 1. 블록 쪼개기
  skills.forEach((skill, index) => {
    const isBonus = hoveredPlanData?.skill === skill.name;
    const bonusAmount = isBonus ? hoveredPlanData.amount : 0;
    const displayScore = Math.min(100, skill.score + bonusAmount);

    const isHovered = hoveredSkill === skill.name || isBonus;
    const isDimmed = (hoveredSkill !== null && hoveredSkill !== skill.name) || 
                     (hoveredPlanData !== null && !isBonus);
                     
    // 번갈아가며 색상 지정
    const baseColor = index % 2 === 0 ? "bg-emerald-500" : "bg-orange-500";

    let remaining = displayScore;
    let partIndex = 0;

    while (remaining > 0) {
      const available = 100 - currentWidth;
      const take = Math.min(remaining, available);

      chunks.push({
        id: `${skill.name}-${partIndex}`,
        name: skill.name,
        take,
        baseColor,
        isHovered,
        isDimmed,
        isBonus,
        bonusAmount,
        isFirstPart: partIndex === 0,
        isLastPart: remaining === take,
        originalSkill: skill.name,
        isLongestPart: false // 아래에서 계산
      });

      remaining -= take;
      currentWidth += take;
      
      if (currentWidth >= 100) currentWidth = 0;
      partIndex++;
    }
  });

  skills.forEach(skill => {
    const skillChunks = chunks.filter(c => c.originalSkill === skill.name);
    if (skillChunks.length > 0) {
      let maxChunk = skillChunks[0];
      for (let i = 1; i < skillChunks.length; i++) {
        if (skillChunks[i].take > maxChunk.take) {
          maxChunk = skillChunks[i];
        }
      }
      maxChunk.isLongestPart = true;
    }
  });

  // 마지막 줄 남은 빈 공간 더미
  if (currentWidth > 0 && currentWidth < 100) {
    chunks.push({
      id: 'dummy',
      isDummy: true,
      take: 100 - currentWidth
    });
  }

  return (
    <div className="bg-zinc-900 rounded-3xl p-6 shadow-lg border border-zinc-800 w-full overflow-hidden">
      <div className="flex flex-wrap w-full -mx-1 -my-1">
        {chunks.map((chunk) => {
          if (chunk.isDummy) {
            return (
              <motion.div 
                key="dummy"
                initial={false}
                animate={{ width: `${chunk.take}%` }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="px-1 py-1 box-border flex-shrink-0"
              />
            );
          }

          let roundedClass = "rounded-xl";
          if (!chunk.isFirstPart && !chunk.isLastPart) roundedClass = "rounded-sm";
          else if (!chunk.isFirstPart) roundedClass = "rounded-l-sm rounded-r-xl";
          else if (!chunk.isLastPart) roundedClass = "rounded-l-xl rounded-r-sm";

          return (
            <motion.div
              key={chunk.id}
              initial={false}
              animate={{ width: `${chunk.take}%` }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="px-1 py-1 box-border flex-shrink-0"
              onMouseEnter={() => setHoveredSkill(chunk.originalSkill)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <div
                className={`h-20 flex items-center justify-center font-bold text-white cursor-pointer shadow-sm overflow-hidden px-2 transition-all duration-150 relative
                  ${chunk.baseColor}
                  ${roundedClass}
                  ${chunk.isHovered ? "ring-2 ring-white z-10 scale-[1.02]" : "z-0 scale-100"}
                  ${chunk.isDimmed ? "grayscale-50 opacity-30" : "opacity-100"}
                `}
              >
                {/* 텍스트 표시 */}
                {chunk.isLongestPart && (
                  <div className="truncate flex items-center gap-1">
                    <span>{chunk.name}</span>
                    {chunk.isBonus && (
                      <span className="text-xs font-black opacity-90">(+{chunk.bonusAmount}%)</span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}