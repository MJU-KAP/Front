import { motion } from 'framer-motion';
import type { ActionPlan } from '../type';

interface Props {
  plans: ActionPlan[];
  insight: string;
  hoveredSkill: string | null;
}

export default function ActionPlanSidebar({ plans, insight, hoveredSkill }: Props) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm sticky top-8 transition-all">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-zinc-900 mb-1">맞춤형 액션 플랜</h2>
        <p className="text-zinc-500 text-sm">부족한 역량을 채울 수 있는 활동을 추천합니다</p>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        {plans.map((plan, i) => {
          // ✅ 현재 마우스가 올라간 스킬 이름이 액션 플랜의 '목표 스킬(skillTarget)'이나 '제목', '내용'에 포함되어 있는지 검사
          const isRelated = hoveredSkill && (
            plan.skillTarget.includes(hoveredSkill) || 
            plan.title.includes(hoveredSkill) || 
            plan.desc.includes(hoveredSkill)
          );
          const isDimmed = hoveredSkill !== null && !isRelated;

          return (
            <motion.div 
              key={plan.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + (i * 0.1) }}
              className={`p-5 rounded-2xl border transition-all duration-300
                ${isRelated ? "bg-orange-50 border-orange-400 shadow-md scale-[1.02]" : "bg-zinc-50 border-zinc-100 hover:border-orange-200"}
                ${isDimmed ? "opacity-40" : "opacity-100"}
              `}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md text-orange-500 bg-white shadow-sm">
                  {plan.category}
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${isRelated ? "text-white bg-orange-500" : "text-emerald-500 bg-emerald-50"}`}>
                  {plan.skillTarget}
                </span>
              </div>
              <h3 className="font-bold text-zinc-800 text-sm mb-1.5">{plan.title}</h3>
              <p className="text-xs text-zinc-500 mb-4 leading-relaxed">{plan.desc}</p>
              <p className="text-xs text-zinc-400 font-medium">{plan.deadline}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="pt-6 border-t border-zinc-100">
        <h3 className="text-sm font-bold flex items-center gap-2 mb-3 text-orange-500">✨ AI 인사이트</h3>
        <p className="text-sm text-zinc-600 leading-relaxed mb-6">{insight}</p>
        <button className="w-full py-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20">
          분석 결과 저장하기
        </button>
      </div>
    </div>
  );
}