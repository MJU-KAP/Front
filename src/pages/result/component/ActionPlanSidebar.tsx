import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { ActionPlan, AiInsightData } from '../type';
import InsightModal from './InsightModal';
import { api } from '../../../apis/api';
import Toast from '../../../components/Toast';
import type { PurposeListResponse } from '../../../types/calendar';
import { ensureSchedule, buildMembers, pickDomain, type UserSkill } from '../../../apis/studySchedule';

interface ToastState {
  title: string;
  description?: string;
  icon?: string;
  type?: 'warning' | 'success' | 'info';
}

function ActionPlanCard({
  plan, i, isRelated, isDimmed, setHoveredPlan, onSetGoal, isGoalSet
}: {
  plan: ActionPlan;
  i: number;
  isRelated: boolean;
  isDimmed: boolean;
  setHoveredPlan: (id: number | null) => void;
  onSetGoal: (plan: ActionPlan) => void;
  isGoalSet: boolean;
}) {
  const handleCardClick = () => {
    if (plan.url) {
      window.open(plan.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: i * 0.05 }}
      onMouseEnter={() => setHoveredPlan(plan.id)}
      onMouseLeave={() => setHoveredPlan(null)}
      className={`rounded-2xl border transition-all duration-150
        ${isRelated ? 'bg-orange-50 border-orange-400 shadow-md scale-[1.02]' : 'bg-zinc-50 border-zinc-100 hover:border-orange-200'}
        ${isDimmed ? 'opacity-30' : 'opacity-100'}
      `}
    >
      <div
        onClick={handleCardClick}
        className={`p-5 ${plan.url ? 'cursor-pointer' : ''}`}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded-md text-orange-500 bg-white shadow-sm">
            {plan.category || '활동'}
          </span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${isRelated ? 'text-white bg-orange-500' : 'text-emerald-500 bg-emerald-50'}`}>
            {plan.skillTarget}
          </span>
        </div>
        <h3 className="font-bold text-zinc-800 text-sm mb-1.5">{plan.title}</h3>
        <p className="text-xs text-zinc-500 mb-4 leading-relaxed line-clamp-2">{plan.desc}</p>
        <p className="text-xs text-zinc-400 font-medium">{plan.deadline}</p>
      </div>

      <div className="px-5 pb-4">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onSetGoal(plan); }}
          className={[
            'w-full py-2 rounded-xl text-xs font-bold transition-all',
            isGoalSet
              ? 'bg-orange-100 text-orange-500 cursor-default'
              : 'bg-white border border-orange-200 text-orange-500 hover:bg-orange-500 hover:text-white hover:border-orange-500',
          ].join(' ')}
        >
          {isGoalSet ? '✓ 목표로 설정됨' : '🎯 목표로 설정하기'}
        </button>
      </div>
    </motion.div>
  );
}

interface Props {
  plans: ActionPlan[];
  insight: AiInsightData & { user_skills?: UserSkill[] };
  hoveredSkill: string | null;
  hoveredPlan: number | null;
  setHoveredPlan: (id: number | null) => void;
}

export default function ActionPlanSidebar({ plans, insight, hoveredSkill, hoveredPlan, setHoveredPlan }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalPlanId, setGoalPlanId] = useState<number | null>(null);
  const [toastShow, setToastShow] = useState(false);
  const [toastState, setToastState] = useState<ToastState>({ title: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (!plans?.length) return;
    api.get<PurposeListResponse>('/api/purposes')
      .then((res) => {
        const existingNames = res.data.items.map((p) => p.name);
        const matched = plans.find((plan) => existingNames.includes(plan.title));
        if (matched) setGoalPlanId(matched.id);
      })
      .catch((e) => console.error('[Goal] GET /api/purposes 실패:', e));
  }, [plans]);

  const showToast = (
    title: string,
    type: 'warning' | 'success' | 'info',
    description?: string,
    icon?: string,
  ) => {
    setToastState({ title, type, description, icon });
    setToastShow(true);
  };

  const handleSetGoal = async (plan: ActionPlan) => {
    if (goalPlanId !== null) {
      showToast('다른 목표가 이미 설정되어 있습니다', 'warning', '하나의 목표만 설정할 수 있어요', '⚠️');
      return;
    }

    const dateMatch = plan.deadline?.match(/\d{4}-\d{2}-\d{2}/);
    const date = dateMatch
      ? dateMatch[0]
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const body = {
      name: plan.title,
      date,
      link: plan.url ?? '',
      type: 'ETC',
      goal: plan.skillTarget ?? '역량 강화',
    };

    try {
      const res = await api.post('/api/purposes', body);
      setGoalPlanId(plan.id);
      showToast('목표로 설정했습니다', 'success', plan.title, '🎯');

      // 도메인: plan.skillsCovered(있으면) → skillTarget 순으로 후보 검사
      const domain = pickDomain(plan.skillsCovered?.[0], plan.skillTarget);

      // 일정 생성은 백그라운드 — 숙련도 전달 + 도메인 명시
      ensureSchedule(
        {
          purposeId: res.data.purposeId,
          name: res.data.name,
          goal: res.data.goal,
          date: res.data.date,
        },
        buildMembers(insight?.user_skills),
        domain,
      ).catch((e) => console.error('[Schedule] 백그라운드 생성 실패:', e));
    } catch (e: unknown) {
      console.error('[Goal] POST /api/purposes 실패:', e);
      if (e && typeof e === 'object' && 'response' in e) {
        const err = e as { response?: { status: number; data: unknown } };
        console.error('[Goal] status:', err.response?.status);
        console.error('[Goal] data:', err.response?.data);
      }
      showToast('목표 설정에 실패했습니다', 'warning', '잠시 후 다시 시도해주세요', '❌');
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm sticky top-8 transition-all">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-zinc-900 mb-1">맞춤형 액션 플랜</h2>
          <p className="text-zinc-500 text-sm">부족한 역량을 채울 수 있는 활동을 추천합니다</p>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          {plans?.map((plan, i) => {
            const target = plan.skillTarget || '';
            const title = plan.title || '';
            const desc = plan.desc || '';

            const isRelated = hoveredSkill
              ? (target.includes(hoveredSkill) || title.includes(hoveredSkill) || desc.includes(hoveredSkill))
              : hoveredPlan === plan.id;

            const isDimmed =
              (hoveredSkill !== null && !isRelated) ||
              (hoveredPlan !== null && !isRelated);

            return (
              <ActionPlanCard
                key={plan.id}
                plan={plan}
                i={i}
                isRelated={isRelated}
                isDimmed={isDimmed}
                setHoveredPlan={setHoveredPlan}
                onSetGoal={handleSetGoal}
                isGoalSet={goalPlanId === plan.id}
              />
            );
          })}
        </div>

        <div className="pt-6 border-t border-zinc-100">
          <h3 className="text-sm font-bold flex items-center gap-2 mb-3 text-orange-500">✨ AI 인사이트</h3>
          <div className="mb-6">
            <p className="text-sm text-zinc-600 leading-relaxed line-clamp-3">
              {insight?.summary || '분석된 인사이트가 없습니다.'}
            </p>
            <div className="mt-2 text-left">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-500 text-xs font-bold rounded-full transition-colors"
              >
                + 더보기
              </button>
            </div>
          </div>

          <button
            onClick={() => navigate('/mypage')}
            className="w-full py-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20"
          >
            분석 결과 저장하기
          </button>
        </div>
      </div>

      <InsightModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        insight={insight}
      />

      <Toast
        show={toastShow}
        onClose={() => setToastShow(false)}
        title={toastState.title}
        description={toastState.description}
        icon={toastState.icon}
        type={toastState.type}
      />
    </>
  );
}