import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useJobTrends } from '../../../hooks/useJobTrends';

interface LoadingScreenProps {
  isDataReady: boolean;
  onComplete: () => void;
}

export default function LoadingScreen({ isDataReady, onComplete }: LoadingScreenProps) {
  const { trendingRoles, isFetching } = useJobTrends();
  
  const [progress, setProgress] = useState(0);

  useEffect(() => {

    if (isDataReady) {
      return;
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return 90; 
        
        const isPause = Math.random() < 0.4; 
        if (isPause) return prev;

        const jump = Math.floor(Math.random() * 5) + 1; 
        return Math.min(prev + jump, 90);
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isDataReady]);

  const isDone = isDataReady;
  const displayProgress = isDataReady ? 100 : progress;

  return (
    <div className="w-full h-full min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center pt-24 pb-20 px-4 font-sans relative">
      
      <div className="absolute top-10 text-xl font-bold tracking-wider">
        Next<span className="text-orange-500">Plan</span>
      </div>

      <div className="flex flex-col items-center max-w-4xl w-full flex-1 justify-center mt-10">
        
        <div className="relative w-24 h-24 flex items-center justify-center mb-8">
          {!isDone ? (
            <>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-zinc-800 border-t-orange-500 rounded-full"
              />
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

        <h1 className="text-2xl font-bold mb-3">
          {isDone ? '분석이 완료되었어요!' : 'AI가 당신의 역량을 분석하고 있어요'}
        </h1>
        <p className="text-zinc-400 text-sm mb-10">
          {isDone 
            ? '당신만의 역량 매트릭스가 준비되었어요. 결과를 확인해보세요.' 
            : '잠시만 기다려주세요. 당신만의 역량 매트릭스를 만들고 있어요.'}
        </p>

        <div className="w-full max-w-md h-1.5 bg-zinc-800 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-orange-500 transition-all duration-300 ease-out"
            style={{ width: `${displayProgress}%` }} 
          />
        </div>

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
        <div className="px-3 py-1 bg-[#1a1511] text-orange-500 border border-orange-500/30 rounded-full text-xs font-bold tracking-wide mb-4 flex items-center gap-1.5">
          🔥 TRENDING NOW
        </div>
        
        <h2 className="text-lg font-bold mb-1">
          요즘 채용이 많은 관련 직군 TOP 5
        </h2>
        <p className="text-zinc-500 text-sm mb-8">
          기다리는 동안 채용 시장 동향을 확인해보세요
        </p>

        {isFetching ? (
          <div className="flex gap-4 w-full overflow-x-auto pb-4 justify-center">
            {[1, 2, 3, 4, 5].map((item) => (
              <div 
                key={item}
                className={`min-w-[160px] h-[150px] bg-[#18181b] rounded-2xl p-5 flex flex-col transition-colors border ${
                  item === 1 ? 'border-orange-500/50' : 'border-zinc-800/50'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-sm font-bold ${item === 1 ? 'text-orange-500' : 'text-zinc-400'}`}>
                    #{item}
                  </span>
                  {item === 1 && (
                    <span className="text-[10px] font-bold text-orange-500">BEST</span>
                  )}
                </div>
                
                <div className="w-7 h-7 mb-3 bg-zinc-800 rounded-md animate-pulse" />
                <div className="w-20 h-4 bg-zinc-800 rounded animate-pulse mb-1 mt-1" />
                <div className="w-14 h-3 bg-zinc-800 rounded mt-auto animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 w-full overflow-x-auto pb-4 justify-center">
            {trendingRoles.map((role) => (
              <div 
                key={role.id}
                className={`min-w-[160px] h-[150px] bg-[#18181b] rounded-2xl p-5 flex flex-col transition-colors border ${
                  role.active ? 'border-orange-500' : 'border-zinc-800'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-sm font-bold ${role.active ? 'text-orange-500' : 'text-zinc-400'}`}>
                    {role.rank}
                  </span>
                  {role.badge && (
                    <span className="text-[10px] font-bold text-orange-500">{role.badge}</span>
                  )}
                </div>
                
                <div className={`w-7 h-7 mb-3 ${role.active ? 'text-orange-500' : 'text-zinc-500'}`}>
                  <svg fill="currentColor" viewBox="0 0 24 24">{role.icon}</svg>
                </div>

                <h3 className="font-bold text-white text-base mb-1 leading-tight break-keep">{role.title}</h3>
                
                <p className="text-zinc-500 text-[10px] mt-auto">{role.countStr}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
}