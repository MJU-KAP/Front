import { motion } from 'framer-motion';
import type { Purpose, PurposeType } from '../../types/calendar';

const TYPE_OPTIONS: { value: PurposeType; label: string }[] = [
  { value: 'CERTIFICATION', label: '자격증' },
  { value: 'CONTEST', label: '공모전' },
  { value: 'INTERNSHIP', label: '인턴십' },
  { value: 'ACTIVITY', label: '대외활동' },
  { value: 'ETC', label: '기타' },
];

const TYPE_COLOR: Record<PurposeType, string> = {
  CERTIFICATION: 'bg-orange-100 text-orange-600',
  CONTEST: 'bg-purple-100 text-purple-600',
  INTERNSHIP: 'bg-blue-100 text-blue-600',
  ACTIVITY: 'bg-emerald-100 text-emerald-600',
  ETC: 'bg-zinc-100 text-zinc-500',
};

// 컴포넌트 외부 상수 — 모듈 로드 시 한 번만 실행
const TODAY_MS = new Date().setHours(0, 0, 0, 0);

function calcDDay(dateStr: string): number {
  const target = new Date(dateStr).setHours(0, 0, 0, 0);
  return Math.ceil((target - TODAY_MS) / (1000 * 60 * 60 * 24));
}

interface Props {
  purposes: Purpose[];
}

export default function PurposePanel({ purposes }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 flex flex-col gap-4">
      <div>
        <h2 className="text-base font-bold text-zinc-900">목표 활동</h2>
        <p className="text-xs text-zinc-400 mt-0.5">설정된 목표까지 D-Day를 확인하세요</p>
      </div>

      <div className="flex flex-col gap-3">
        {purposes.length === 0 ? (
          <div className="text-center py-8 text-zinc-300 text-sm">
            아직 등록된 목표가 없어요
          </div>
        ) : (
          purposes.map((p) => {
            const dDay = calcDDay(p.date);
            const dDayLabel = dDay < 0
              ? `D+${Math.abs(dDay)}`
              : dDay === 0 ? 'D-Day' : `D-${dDay}`;
            const dDayColor = dDay < 0
              ? 'text-zinc-300'
              : dDay <= 7 ? 'text-rose-500' : 'text-zinc-700';

            return (
              <motion.div
                key={p.purposeId}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-zinc-100 p-4 hover:border-zinc-200 transition-colors bg-zinc-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLOR[p.type]}`}>
                    {TYPE_OPTIONS.find((t) => t.value === p.type)?.label ?? p.type}
                  </span>
                  <span className={`text-sm font-black ${dDayColor}`}>
                    {dDayLabel}
                  </span>
                </div>

                <p className="text-sm font-bold text-zinc-800 mb-2 truncate">{p.name}</p>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {p.goal.split(/[,/+]/).map((kw, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white border border-zinc-200 text-zinc-500"
                    >
                      {kw.trim()}
                    </span>
                  ))}
                </div>

                <p className="text-[10px] text-zinc-400 mt-2">{p.date}</p>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}