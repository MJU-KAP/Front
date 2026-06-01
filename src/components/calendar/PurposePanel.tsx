import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Purpose, PurposeType } from '../../types/calendar';
import { deletePurpose } from '../../apis/studySchedule';
import Toast from '../Toast';

const TYPE_OPTIONS: { value: PurposeType; label: string }[] = [
  { value: 'CERTIFICATION', label: '자격증' },
  { value: 'CONTEST', label: '공모전' },
  { value: 'INTERNSHIP', label: '인턴십' },
  { value: 'ACTIVITY', label: '대외활동' },
  { value: 'ETC', label: '기타' },
];

const TYPE_BADGE = 'bg-orange-50 text-orange-500 border border-orange-100';
const TODAY_MS = new Date().setHours(0, 0, 0, 0);

function calcDDay(dateStr: string): number {
  const target = new Date(dateStr).setHours(0, 0, 0, 0);
  return Math.ceil((target - TODAY_MS) / (1000 * 60 * 60 * 24));
}

interface Props {
  purposes: Purpose[];
  onChanged?: () => void;
}

interface ToastState {
  title: string;
  description?: string;
  icon?: string;
  type?: 'warning' | 'success' | 'info';
}

export default function PurposePanel({ purposes, onChanged }: Props) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toastShow, setToastShow] = useState(false);
  const [toastState, setToastState] = useState<ToastState>({ title: '' });

  const showToast = (title: string, type: ToastState['type'], description?: string, icon?: string) => {
    setToastState({ title, type, description, icon });
    setToastShow(true);
  };

  const handleDelete = async (p: Purpose) => {
    const ok = window.confirm(`'${p.name}' 목표를 삭제할까요?\n관련 학습 일정도 함께 삭제됩니다.`);
    if (!ok) return;

    setDeletingId(p.purposeId);
    try {
      await deletePurpose(p.purposeId);
      showToast('목표를 삭제했습니다', 'success', '관련 일정도 함께 삭제되었어요', '🗑️');
      onChanged?.();
    } catch (e) {
      console.error('[Purpose] 삭제 실패:', e);
      showToast('삭제에 실패했습니다', 'warning', '잠시 후 다시 시도해주세요', '❌');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 flex flex-col gap-4">
        <div>
          <h2 className="text-base font-bold text-zinc-900">목표 활동</h2>
          <p className="text-xs text-zinc-400 mt-0.5">설정된 목표까지 D-Day를 확인하세요</p>
        </div>

        <div className="flex flex-col gap-3">
          {purposes.length === 0 ? (
            <div className="text-center py-8 text-zinc-300 text-sm">아직 등록된 목표가 없어요</div>
          ) : (
            purposes.map((p) => {
              const dDay = calcDDay(p.date);
              const dDayLabel = dDay < 0 ? `D+${Math.abs(dDay)}` : dDay === 0 ? 'D-Day' : `D-${dDay}`;
              const dDayColor = dDay < 0 ? 'text-zinc-300' : dDay <= 7 ? 'text-orange-500' : 'text-zinc-700';
              const hasLink = !!p.link;

              return (
                <motion.div
                  key={p.purposeId}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-zinc-100 p-4 bg-zinc-50 hover:border-orange-200 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${TYPE_BADGE}`}>
                      {TYPE_OPTIONS.find((t) => t.value === p.type)?.label ?? p.type}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-black ${dDayColor}`}>{dDayLabel}</span>
                      <button
                        type="button"
                        onClick={() => handleDelete(p)}
                        disabled={deletingId === p.purposeId}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-zinc-300 hover:bg-rose-50 hover:text-rose-500 transition-colors text-xs disabled:opacity-40"
                        title="목표 삭제"
                      >
                        {deletingId === p.purposeId ? '…' : '✕'}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mb-2">
                    {hasLink ? (
                      <button
                        type="button"
                        onClick={() => window.open(p.link, '_blank', 'noopener,noreferrer')}
                        className="text-sm font-bold text-zinc-800 truncate hover:text-orange-500 transition-colors text-left"
                      >
                        {p.name}
                      </button>
                    ) : (
                      <p className="text-sm font-bold text-zinc-800 truncate">{p.name}</p>
                    )}
                    {hasLink && <span className="text-orange-400 text-xs flex-shrink-0">↗</span>}
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {p.goal.split(/[,/+]/).map((kw, i) => {
                      const label = kw.trim();
                      if (!label) return null;
                      return (
                        <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-500 border border-orange-100/60">
                          {label}
                        </span>
                      );
                    })}
                  </div>

                  <p className="text-[10px] text-zinc-400 mt-2">{p.date}</p>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

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