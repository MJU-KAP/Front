import { useMemo } from "react";
import type { SkillCanvasProps, SkillChunk } from "../type";

export default function SkillCanvas({ skills = [], hoveredSkill, setHoveredSkill, hoveredPlanData }: SkillCanvasProps) {

  const chunks = useMemo(() => {
    const result: (SkillChunk & { isSkillStart?: boolean })[] = [];
    let currentWidth = 0;

    const pushSegment = (
      skill: typeof skills[number],
      amount: number,
      filled: boolean,
      meta: { isHovered: boolean; isDimmed: boolean; isBonus: boolean; bonusAmount: number; baseColor: string },
      tagSuffix: string,
      joinLeft: boolean,
      joinRight: boolean,
      isSkillStart: boolean,
    ) => {
      let remaining = amount;
      let partIndex = 0;
      while (remaining > 0) {
        const available = 100 - currentWidth;
        const take = Math.min(remaining, available);
        const isFirst = partIndex === 0;
        const isLast = remaining === take;
        result.push({
          id: `${skill.name}-${tagSuffix}-${partIndex}`,
          name: skill.name,
          take,
          baseColor: meta.baseColor,
          isHovered: meta.isHovered,
          isDimmed: meta.isDimmed,
          isBonus: meta.isBonus,
          bonusAmount: meta.bonusAmount,
          isFirstPart: isFirst && !joinLeft,
          isLastPart: isLast && !joinRight,
          originalSkill: skill.name,
          isLongestPart: false,
          isLacking: !filled,
          isSkillStart: isSkillStart && isFirst,
        });
        remaining -= take;
        currentWidth += take;
        if (currentWidth >= 100) currentWidth = 0;
        partIndex++;
      }
    };

    skills?.forEach((skill, index) => {
      const isBonus = hoveredPlanData?.skill === skill.name;
      const bonusAmount = isBonus ? hoveredPlanData.amount : 0;

      const isHovered = hoveredSkill === skill.name || isBonus;
      const isDimmed = (hoveredSkill !== null && hoveredSkill !== skill.name) ||
                       (hoveredPlanData !== null && !isBonus);
      const baseColor = index % 2 === 0 ? "bg-emerald-500" : "bg-orange-500";
      const meta = { isHovered, isDimmed, isBonus, bonusAmount, baseColor };

      if (skill.isLacking) {
        const owned = Math.max(0, skill.score);
        const filledByBonus = Math.min(bonusAmount, skill.gap);
        const colored = owned + filledByBonus;
        const remainingGap = Math.max(0, skill.gap - filledByBonus);

        if (colored > 0) {
          pushSegment(skill, colored, true, meta, 'fill', false, remainingGap > 0, true);
          if (remainingGap > 0) pushSegment(skill, remainingGap, false, meta, 'lack', true, false, false);
        } else if (remainingGap > 0) {
          pushSegment(skill, remainingGap, false, meta, 'lack', false, false, true);
        }
      } else {
        const total = Math.min(100, skill.score + bonusAmount);
        if (total > 0) pushSegment(skill, total, true, meta, 'own', false, false, true);
      }
    });

    // 라벨: 스킬당 1개 (색 있으면 색, 없으면 점선)
    skills?.forEach(skill => {
      const colored = result.filter(c => c.originalSkill === skill.name && !c.isLacking);
      const group = colored.length > 0
        ? colored
        : result.filter(c => c.originalSkill === skill.name && c.isLacking);
      if (group.length > 0) {
        let maxChunk = group[0];
        for (let i = 1; i < group.length; i++) {
          if (group[i].take > maxChunk.take) maxChunk = group[i];
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
      <div className="flex flex-wrap w-full items-stretch gap-y-3">
        {chunks?.map((chunk) => {
          if (chunk.isDummy) {
            return <div key={chunk.id} style={{ width: `${chunk.take}%` }} className="flex-shrink-0" />;
          }

          let roundedClass = "rounded-xl";
          if (!chunk.isFirstPart && !chunk.isLastPart) roundedClass = "rounded-none";
          else if (!chunk.isFirstPart) roundedClass = "rounded-l-none rounded-r-xl";
          else if (!chunk.isLastPart) roundedClass = "rounded-l-xl rounded-r-none";

          const boxStyle = chunk.isLacking
            ? `border-2 border-dashed bg-transparent text-zinc-400 ${chunk.isHovered ? 'border-zinc-300' : 'border-zinc-600'}`
            : `${chunk.baseColor} text-white`;

          // 점선이 색과 붙는 면: 왼쪽 테두리 제거
          const joinLeftBorder = chunk.isLacking && !chunk.isFirstPart ? "border-l-0" : "";
          // 새 스킬 시작이면 왼쪽 간격
          const startGap = chunk.isSkillStart ? "pl-3" : "";

          return (
            <div
              key={chunk.id}
              style={{ width: `${chunk.take}%` }}
              className={`box-border flex-shrink-0 ${startGap}`}
              onMouseEnter={() => setHoveredSkill(chunk.originalSkill || null)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <div
                className={`h-20 flex items-center justify-center font-bold cursor-pointer overflow-hidden px-2 transition duration-150 relative
                  ${boxStyle}
                  ${roundedClass}
                  ${joinLeftBorder}
                  ${chunk.isHovered ? "brightness-125 shadow-lg shadow-black/40 z-10" : "shadow-sm z-0"}
                  ${chunk.isDimmed ? "grayscale opacity-30" : "opacity-100"}
                `}
              >
                {chunk.isLongestPart && (
                  <div className="truncate flex items-center gap-1">
                    <span>{chunk.name}</span>
                    {chunk.isBonus && (chunk.bonusAmount ?? 0) > 0 && (
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