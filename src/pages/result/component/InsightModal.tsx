import { motion, AnimatePresence } from 'framer-motion';
import type { AiInsightData } from '../type'; 

interface InsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  insight?: AiInsightData; 
}

export default function InsightModal({ isOpen, onClose, insight }: InsightModalProps) {
  if (!isOpen || !insight) return null; 

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
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">상세 분석 리포트</h2>
            <p className="text-sm text-zinc-500">이력서를 기반으로 AI가 분석한 종합 인사이트입니다</p>
          </div>

          {/* 본문 */}
          <div className="p-6 overflow-y-auto flex flex-col gap-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            
            <div className="p-5 rounded-xl border border-orange-100 bg-[#FFF9F5]">
              <h3 className="flex items-center gap-2 text-orange-600 font-bold mb-2">
                <span className="text-lg">👍</span> 강점 분석
              </h3>
              <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                {insight.strength}
              </p>
            </div>

            <div className="p-5 rounded-xl border border-indigo-100 bg-[#F8F9FF]">
              <h3 className="flex items-center gap-2 text-indigo-600 font-bold mb-2">
                <span className="text-lg">🎯</span> 보완이 필요한 영역
              </h3>
              <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                {insight.improvement}
              </p>
            </div>

            <div className="p-5 rounded-xl border border-emerald-100 bg-[#F4FCF7]">
              <h3 className="flex items-center gap-2 text-emerald-600 font-bold mb-2">
                <span className="text-lg">📈</span> 추천 성장 방향
              </h3>
              <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                {insight.growth_direction}
              </p>
            </div>

            <div className="p-5 rounded-xl border border-blue-100 bg-[#F0F6FF]">
              <h3 className="flex items-center gap-2 text-blue-600 font-bold mb-2">
                <span className="text-lg">💼</span> 시장 적합도 분석
              </h3>
              <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                {insight.market_fit}
              </p>
            </div>

            <div className="p-5 rounded-xl border border-purple-100 bg-[#FAF5FF]">
              <h3 className="flex items-center gap-2 text-purple-600 font-bold mb-2">
                <span className="text-lg">💡</span> 종합 평가
              </h3>
              <p className="text-sm text-zinc-700 leading-relaxed font-medium whitespace-pre-wrap">
                {insight.summary}
              </p>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}