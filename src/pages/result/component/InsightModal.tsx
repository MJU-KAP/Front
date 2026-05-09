import { motion, AnimatePresence } from 'framer-motion';

const insightData = {
  strength: "React(85%)와 TypeScript(78%)를 활용한 프론트엔드 개발 역량이 탄탄하며, 특히 Git(98%) 숙련도가 매우 높아 안정적인 버전 관리와 원활한 팀 협업 능력을 갖추고 있습니다.",
  weakness: "Next.js(45%)를 활용한 서버 사이드 렌더링(SSR) 및 최적화 경험과 Testing(38%) 역량이 다소 부족합니다. 프론트엔드 테스트 자동화에 대한 실무 경험 보완이 필요합니다.",
  growth: "안정적인 React 기반 위에 Next.js를 깊이 있게 학습하여 렌더링 최적화 역량을 키우고, TDD(테스트 주도 개발)를 도입하여 코드 신뢰성을 높이는 방향으로 성장하는 것을 추천합니다.",
  summary: "React와 TypeScript 기반의 탄탄한 기본기와 뛰어난 형상 관리 능력을 보유하고 있습니다. 향후 Next.js와 테스트 자동화 역량을 보완한다면 프론트엔드 생태계 전반을 아우르는 완성도 높은 개발자로 도약할 수 있습니다."
};

interface InsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

export default function InsightModal({ isOpen, onClose, userName = '홍길동' }: InsightModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* 헤더 영역 */}
          <div className="p-6 pb-4 border-b border-zinc-100 relative shrink-0">
            <button onClick={onClose} className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 text-xs font-bold mb-4">
              ✨ AI 인사이트
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">{userName}님을 위한 상세 분석 리포트</h2>
            <p className="text-sm text-zinc-500">이력서를 기반으로 AI가 분석한 종합 인사이트입니다</p>
          </div>

          {/* 본문 */}
          <div className="p-6 overflow-y-auto flex flex-col gap-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            
            {/* 강점 분석 */}
            <div className="p-5 rounded-xl border border-orange-100 bg-[#FFF9F5]">
              <h3 className="flex items-center gap-2 text-orange-600 font-bold mb-2">
                <span className="text-lg">👍</span> 강점 분석
              </h3>
              <p className="text-sm text-zinc-700 leading-relaxed">
                {insightData.strength}
              </p>
            </div>

            {/* 보완이 필요한 영역 */}
            <div className="p-5 rounded-xl border border-indigo-100 bg-[#F8F9FF]">
              <h3 className="flex items-center gap-2 text-indigo-600 font-bold mb-2">
                <span className="text-lg">🎯</span> 보완이 필요한 영역
              </h3>
              <p className="text-sm text-zinc-700 leading-relaxed">
                {insightData.weakness}
              </p>
            </div>

            {/* 추천 성장 방향 */}
            <div className="p-5 rounded-xl border border-emerald-100 bg-[#F4FCF7]">
              <h3 className="flex items-center gap-2 text-emerald-600 font-bold mb-2">
                <span className="text-lg">📈</span> 추천 성장 방향
              </h3>
              <p className="text-sm text-zinc-700 leading-relaxed">
                {insightData.growth}
              </p>
            </div>

            {/* 종합 평가 (총평) */}
            <div className="p-5 rounded-xl border border-purple-100 bg-[#FAF5FF]">
              <h3 className="flex items-center gap-2 text-purple-600 font-bold mb-2">
                <span className="text-lg">💡</span> 종합 평가
              </h3>
              <p className="text-sm text-zinc-700 leading-relaxed font-medium">
                {insightData.summary}
              </p>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}