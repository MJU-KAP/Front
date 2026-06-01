import { useMemo } from "react";
import { motion } from "framer-motion";
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
    return (
      <div className="bg-zinc-900 rounded-3xl p-6 shadow-lg border border-zinc-800 w-full h-32 flex items-center justify-center text-zinc-500">
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
          결과를 불러오는 중입니다...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-3xl p-6 shadow-lg border border-zinc-800 w-full overflow-hidden">
      <motion.div
        className="flex flex-wrap w-full items-stretch gap-y-3"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
      >
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

          const joinLeftBorder = chunk.isLacking && !chunk.isFirstPart ? "border-l-0" : "";
          // 새 스킬 시작만 왼쪽 간격. 폭을 건드리는 음수 마진은 일절 사용 안 함(밀림 원인 제거)
          const startGap = chunk.isSkillStart ? "pl-3" : "";
          // 이어지는 조각은 그림자 없음(이음매 음영 방지)
          const shadowClass = chunk.isHovered
            ? "shadow-xl shadow-black/50 z-10"
            : chunk.isSkillStart
              ? "shadow-sm z-0"
              : "z-0";

          return (
            <motion.div
              key={chunk.id}
              layout
              variants={chunk.isLacking ? undefined : {
                hidden: { opacity: 0, y: 12, scale: 0.96 },
                show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
              }}
              initial={chunk.isLacking ? false : undefined}
              style={{ width: `${chunk.take}%` }}
              className={`box-border flex-shrink-0 ${startGap}`}
              onMouseEnter={() => setHoveredSkill(chunk.originalSkill || null)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <motion.div
                layout
                animate={{ opacity: chunk.isDimmed ? 0.3 : 1 }}
                transition={{ opacity: { duration: 0.2 }, layout: { duration: 0.3, ease: "easeInOut" } }}
                className={`h-20 flex items-center justify-center font-bold cursor-pointer overflow-hidden px-2 relative
                  ${boxStyle}
                  ${roundedClass}
                  ${joinLeftBorder}
                  ${shadowClass}
                `}
              >
                {chunk.isLongestPart && (
                  <motion.div className="truncate flex items-center gap-1 relative z-10">
                    <span>{chunk.name}</span>
                    {chunk.isBonus && (chunk.bonusAmount ?? 0) > 0 && (
                      <motion.span
                        key={chunk.bonusAmount}
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        className="text-xs font-black"
                      >
                        (+{chunk.bonusAmount}%)
                      </motion.span>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}