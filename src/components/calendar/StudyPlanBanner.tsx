import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StudyItem {
  week: number;
  topic: string;
  detail: string;
}

interface Props {
  purposeName?: string;
  purposeGoal?: string;
  studyPlan?: StudyItem[];
}

// 더미 플랜 (추후 AI API 연동)
const DUMMY_PLAN: StudyItem[] = [
  { week: 1, topic: '소프트웨어 설계', detail: '요구사항 분석, UML 다이어그램' },
  { week: 2, topic: '소프트웨어 개발', detail: '자료구조, 알고리즘 기초' },
  { week: 3, topic: '데이터베이스', detail: 'SQL, 정규화, 트랜잭션' },
  { week: 4, topic: '프로그래밍 언어', detail: 'C언어, Java 기초 문법' },
  { week: 5, topic: '정보시스템 구축', detail: '네트워크, 보안, 운영체제' },
  { week: 6, topic: '실전 모의고사', detail: '기출 5개년 풀이 + 오답노트' },
];

export default function StudyPlanBanner({
  purposeName = '정보처리기사 준비',
  purposeGoal = '필기 합격',
  studyPlan = DUMMY_PLAN,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-zinc-900 rounded-3xl p-6 text-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">
              AI 학습 플랜
            </span>
          </div>
          <h2 className="text-base font-bold text-white">{purposeName}</h2>
          <p className="text-xs text-zinc-400 mt-0.5">목표: {purposeGoal}</p>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="shrink-0 px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-colors"
        >
          {expanded ? '접기' : '플랜 보기'}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-5 flex flex-col gap-2">
              {studyPlan.map((item, idx) => (
                <motion.div
                  key={item.week}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <span className="text-orange-400 text-xs font-black">{item.week}주</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{item.topic}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{item.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}