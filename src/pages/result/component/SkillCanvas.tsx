import { useMemo } from "react";
import type { SkillCanvasProps, SkillChunk } from "../type";

export default function SkillCanvas({ skills = [], hoveredSkill, setHoveredSkill, hoveredPlanData }: SkillCanvasProps) {
  
  const chunks = useMemo(() => {
    const result: SkillChunk[] = [];
    let currentWidth = 0;

    skills?.forEach((skill, index) => {
      const isBonus = hoveredPlanData?.skill === skill.name;
      const bonusAmount = isBonus ? hoveredPlanData.amount : 0;

      const displayScore = skill.isLacking 
        ? (isBonus ? bonusAmount : skill.gap)
        : Math.min(100, skill.score + bonusAmount);

      if (displayScore <= 0) return;

      const isHovered = hoveredSkill === skill.name || isBonus;
      const isDimmed = (hoveredSkill !== null && hoveredSkill !== skill.name) || 
                       (hoveredPlanData !== null && !isBonus);
                       
      const baseColor = index % 2 === 0 ? "bg-emerald-500" : "bg-orange-500";

      let remaining = displayScore;
      let partIndex = 0;

      while (remaining > 0) {
        const available = 100 - currentWidth;
        const take = Math.min(remaining, available);

        result.push({
          id: `${skill.name}-${skill.isLacking ? 'lack' : 'own'}-${partIndex}`,
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
          isLongestPart: false,
          isLacking: skill.isLacking 
        });

        remaining -= take;
        currentWidth += take;
        
        if (currentWidth >= 100) currentWidth = 0;
        partIndex++;
      }
    });

    skills?.forEach(skill => {
      const skillChunks = result.filter(c => c.originalSkill === skill.name && c.isLacking === skill.isLacking);
      if (skillChunks.length > 0) {
        let maxChunk = skillChunks[0];
        for (let i = 1; i < skillChunks.length; i++) {
          if (skillChunks[i].take > maxChunk.take) maxChunk = skillChunks[i];
        }
        maxChunk.isLongestPart = true;
      }
    });

    if (currentWidth > 0 && currentWidth < 100) {
      result.push({ id: 'dummy', isDummy: true, take: 100 - currentWidth });
    }

    return result;
  }, [skills, hoveredSkill, hoveredPlanData]);

  if (!skills || skills.length === 0) {
    return <div className="bg-zinc-900 rounded-3xl p-6 shadow-lg border border-zinc-800 w-full h-32 flex items-center justify-center text-zinc-500">결과를 불러오는 중입니다...</div>;
  }

  return (
    <div className="bg-zinc-900 rounded-3xl p-6 shadow-lg border border-zinc-800 w-full overflow-hidden">
      <div className="flex flex-wrap w-full -mx-1 -my-1">
        {chunks?.map((chunk) => {
          if (chunk.isDummy) {
            return (
              <div 
                key={chunk.id}
                style={{ width: `${chunk.take}%` }}
                className="px-1 py-1 box-border flex-shrink-0"
              />
            );
          }

          let roundedClass = "rounded-xl";
          if (!chunk.isFirstPart && !chunk.isLastPart) roundedClass = "rounded-sm";
          else if (!chunk.isFirstPart) roundedClass = "rounded-l-sm rounded-r-xl";
          else if (!chunk.isLastPart) roundedClass = "rounded-l-xl rounded-r-sm";

          const boxStyle = chunk.isLacking && !chunk.isBonus
            ? "border-2 border-dashed border-zinc-600 bg-transparent text-zinc-400"
            : `${chunk.baseColor} text-white`;

          return (
            <div
              key={chunk.id}
              style={{ width: `${chunk.take}%` }}
              className="px-1 py-1 box-border flex-shrink-0"
              onMouseEnter={() => setHoveredSkill(chunk.originalSkill || null)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <div
                className={`h-20 flex items-center justify-center font-bold cursor-pointer shadow-sm overflow-hidden px-2 transition duration-150 relative
                  ${boxStyle}
                  ${roundedClass}
                  ${chunk.isHovered ? "ring-2 ring-white z-10 scale-[1.02]" : "z-0 scale-100"}
                  ${chunk.isDimmed ? "grayscale opacity-30" : "opacity-100"}
                `}
              >
                {chunk.isLongestPart && (
                  <div className="truncate flex items-center gap-1">
                    <span>{chunk.name}</span>
                    {chunk.isBonus && (
                      <span className="text-xs font-black opacity-90">(+{chunk.bonusAmount}%)</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}