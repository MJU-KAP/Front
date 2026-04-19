import { motion } from 'framer-motion';
import type { ActionPlan } from '../type';

function ActionPlanCard({ 
  plan, i, isRelated, isDimmed, setHoveredPlan 
}: { 
  plan: ActionPlan, i: number, isRelated: boolean, isDimmed: boolean, setHoveredPlan: (id: number | null) => void 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: i * 0.05 }}
      onMouseEnter={() => setHoveredPlan(plan.id)}
      onMouseLeave={() => setHoveredPlan(null)}
      className={`p-5 rounded-2xl border transition-all duration-150 cursor-pointer
        ${isRelated ? "bg-orange-50 border-orange-400 shadow-md scale-[1.02]" : "bg-zinc-50 border-zinc-100 hover:border-orange-200"}
        ${isDimmed ? "opacity-30" : "opacity-100"}
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
}

interface Props {
  plans: ActionPlan[];
  insight: string;
  hoveredSkill: string | null;
  hoveredPlan: number | null;
  setHoveredPlan: (id: number | null) => void;
}

export default function ActionPlanSidebar({ plans, insight, hoveredSkill, hoveredPlan, setHoveredPlan }: Props) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm sticky top-8 transition-all">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-zinc-900 mb-1">맞춤형 액션 플랜</h2>
        <p className="text-zinc-500 text-sm">부족한 역량을 채울 수 있는 활동을 추천합니다</p>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        {plans.map((plan, i) => {
          const isRelated = hoveredSkill 
            ? (plan.skillTarget.includes(hoveredSkill) || plan.title.includes(hoveredSkill) || plan.desc.includes(hoveredSkill))
            : hoveredPlan === plan.id;
            
          const isDimmed = (hoveredSkill !== null && !isRelated) || (hoveredPlan !== null && !isRelated);

          return (
            <ActionPlanCard 
              key={plan.id} 
              plan={plan} 
              i={i}
              isRelated={isRelated} 
              isDimmed={isDimmed} 
              setHoveredPlan={setHoveredPlan} 
            />
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