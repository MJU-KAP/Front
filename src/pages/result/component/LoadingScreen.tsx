import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  isDataReady: boolean;
  onComplete: () => void;
}

// 로딩 중 보여줄 더미 데이터 (추후 API 연동)
const TRENDING_ROLES = [
  { id: 1, rank: '#1', badge: 'BEST', title: 'AI Engineer', trend: '+24%', count: '1,347건 채용 중', active: true, icon: <path d="M12 2a5 5 0 00-5 5v1H6a2 2 0 00-2 2v2a2 2 0 002 2h1v1a5 5 0 0010 0v-1h1a2 2 0 002-2v-2a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 5a3 3 0 016 0v1H9V7zM6 10h12v2H6v-2zm3 5a3 3 0 006 0v-1H9v1z"/> },
  { id: 2, rank: '#2', badge: '', title: 'Full Stack', trend: '+32%', count: '1,293건 채용 중', active: false, icon: <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z"/> },
  { id: 3, rank: '#3', badge: '', title: 'Frontend', trend: '+42%', count: '982건 채용 중', active: false, icon: <path d="M3 4h18v12H3V4zm2 2v8h14V6H5zm5 12h4v2h-4v-2z"/> },
  { id: 4, rank: '#4', badge: '', title: 'Backend', trend: '+37%', count: '876건 채용 중', active: false, icon: <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm0 10a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM6 6h12v2H6V6zm0 10h12v2H6v-2z"/> },
  { id: 5, rank: '#5', badge: '', title: 'DevOps', trend: '+21%', count: '724건 채용 중', active: false, icon: <path d="M19 11a5.002 5.002 0 00-9.67-.89A4.004 4.004 0 006 18h13a4 4 0 000-8h-1l.001-.001C19 11 19 11 19 11z"/> },
];

// 분석 완료 시 보여줄 결과 더미 데이터 (추후 API 연동)
const MATCHED_ROLES = [
  { id: 1, rank: '98%', badge: 'BEST', title: 'AI Engineer', trend: '매우 높은 적합도', count: 'AI Engineer - 1,347건 채용 중', active: true, icon: <path d="M12 2a5 5 0 00-5 5v1H6a2 2 0 00-2 2v2a2 2 0 002 2h1v1a5 5 0 0010 0v-1h1a2 2 0 002-2v-2a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 5a3 3 0 016 0v1H9V7zM6 10h12v2H6v-2zm3 5a3 3 0 006 0v-1H9v1z"/> },
  { id: 2, rank: '92%', badge: '', title: 'Full Stack', trend: '높은 적합도', count: 'Full Stack - 1,293건 채용 중', active: false, icon: <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z"/> },
  { id: 3, rank: '87%', badge: '', title: 'Frontend', trend: '높은 적합도', count: 'Frontend - 982건 채용 중', active: false, icon: <path d="M3 4h18v12H3V4zm2 2v8h14V6H5zm5 12h4v2h-4v-2z"/> },
  { id: 4, rank: '81%', badge: '', title: 'Backend', trend: '적합', count: 'Backend - 876건 채용 중', active: false, icon: <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm0 10a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM6 6h12v2H6V6zm0 10h12v2H6v-2z"/> },
  { id: 5, rank: '76%', badge: '', title: 'DevOps', trend: '적합', count: 'DevOps - 724건 채용 중', active: false, icon: <path d="M19 11a5.002 5.002 0 00-9.67-.89A4.004 4.004 0 006 18h13a4 4 0 000-8h-1l.001-.001C19 11 19 11 19 11z"/> },
];

export default function LoadingScreen({ isDataReady, onComplete }: LoadingScreenProps) {
  const [internalProgress, setInternalProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;
      setElapsedTime(elapsed);

      setInternalProgress(prev => {
        if (prev >= 98) return 93; // 93%에서 백엔드 대기
        
        const isPause = Math.random() < 0.4; // 40% 확률로 게이지 멈춤
        if (isPause) return prev;

        const jump = Math.floor(Math.random() * 5) + 1; // 1~5% 랜덤 점프
        return Math.min(prev + jump, 98);
      });
    }, 600);

    return () => clearInterval(interval);
  }, []);

  const isDone = elapsedTime >= 15000 && isDataReady;
  const progress = isDone ? 100 : internalProgress;
  const displayRoles = isDone ? MATCHED_ROLES : TRENDING_ROLES;

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center pt-16 pb-10 px-4 font-sans">
      
      {/* 상단 로고 */}
      <div className="absolute top-10 text-xl font-bold tracking-wider">
        Next<span className="text-orange-500">Plan</span>
      </div>

      <div className="flex flex-col items-center max-w-4xl w-full flex-1 justify-center mt-10">
        
        {/* 스피너 & 완료 아이콘 영역 */}
        <div className="relative w-24 h-24 flex items-center justify-center mb-8">
          {!isDone ? (
            <>
              {/* 회전하는 주황색 보더 */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-zinc-800 border-t-orange-500 rounded-full"
              />
              {/* 내부 아이콘 */}
              <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </>
          ) : (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.4)]"
            >
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}
        </div>

        {/* 텍스트 영역 */}
        <h1 className="text-2xl font-bold mb-3">
          {isDone ? '분석이 완료되었어요!' : 'AI가 당신의 역량을 분석하고 있어요'}
        </h1>
        <p className="text-zinc-400 text-sm mb-10">
          {isDone 
            ? '당신만의 역량 매트릭스가 준비되었어요. 결과를 확인해보세요.' 
            : '잠시만 기다려주세요. 당신만의 역량 매트릭스를 만들고 있어요.'}
        </p>

        {/* 프로그레스 바 */}
        <div className="w-full max-w-md h-1.5 bg-zinc-800 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-orange-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 결과 보기 버튼 영역 */}
        <div className="h-24 mt-8 flex flex-col items-center justify-center">
          {isDone && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              <p className="text-xs text-zinc-500 mb-4">전체 26개 직군 분석 결과와 맞춤 학습 로드맵을 확인해보세요</p>
              <button 
                onClick={onComplete}
                className="flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors"
              >
                결과 보기
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </motion.div>
          )}
        </div>

      </div>

      <div className="w-full max-w-5xl mt-12 flex flex-col items-center">
        {/* 뱃지 */}
        <div className="px-3 py-1 bg-[#1a1511] text-orange-500 border border-orange-500/30 rounded-full text-xs font-bold tracking-wide mb-4 flex items-center gap-1.5">
          {isDone ? '✨ YOUR RESULTS' : '🔥 TRENDING NOW'}
        </div>
        
        <h2 className="text-lg font-bold mb-1">
          {isDone ? '당신에게 맞는 직군 TOP 5' : '요즘 채용 많은 직군 TOP 5'}
        </h2>
        <p className="text-zinc-500 text-sm mb-8">
          {isDone ? 'AI가 분석한 당신만의 추천 직군이에요' : '기다리는 동안 채용 시장 동향을 확인해보세요'}
        </p>

        {/* 직군 카드 목록 */}
        <div className="flex gap-4 w-full overflow-x-auto pb-4 justify-center">
          {displayRoles.map((role) => (
            <div 
              key={role.id}
              className={`min-w-[160px] h-[180px] bg-[#18181b] rounded-2xl p-5 flex flex-col transition-colors border ${
                role.active ? 'border-orange-500' : 'border-zinc-800'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`text-sm font-bold ${role.active ? 'text-orange-500' : 'text-zinc-400'}`}>
                  {role.rank}
                </span>
                {role.badge && (
                  <span className="text-[10px] font-bold text-orange-500">{role.badge}</span>
                )}
              </div>
              
              <div className={`w-8 h-8 mb-4 ${role.active ? 'text-orange-500' : 'text-zinc-500'}`}>
                <svg fill="currentColor" viewBox="0 0 24 24">{role.icon}</svg>
              </div>

              <h3 className="font-bold text-white text-base mb-1">{role.title}</h3>
              <p className="text-emerald-400 text-xs font-semibold mb-1">{role.trend}</p>
              <p className="text-zinc-500 text-[10px] mt-auto">{role.count}</p>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}