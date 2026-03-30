import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      {/* 카드 컨테이너 */}
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.01]">
        
        {/* 상단 장식 바 */}
        <div className="h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500" />
        
        <div className="p-8 text-center">
          <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">
            Tailwind <span className="text-blue-600">Success!</span>
          </h1>
          
          <p className="text-slate-500 mb-8 leading-relaxed">
            테스트
          </p>

          {/* 인터랙티브 섹션 */}
          <div className="space-y-4">
            <div className="inline-block px-6 py-2 bg-slate-100 rounded-full text-slate-700 font-mono text-lg border border-slate-200">
              Counter: <span className="text-blue-600 font-bold">{count}</span>
            </div>

            <button
              onClick={() => setCount((prev) => prev + 1)}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <span>숫자 올리기</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 group-hover:translate-y-[-2px] transition-transform" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="Refactor: 5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* 하단 푸터 */}
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-medium">
          <span className="uppercase tracking-widest">Vite + React</span>
          <span className="uppercase tracking-widest">TypeScript</span>
        </div>
      </div>

      {/* 안내 메시지 */}
      <p className="mt-8 text-slate-400 text-sm italic">
        Tip: tailwind.config.js 파일을 수정 필요
      </p>
    </div>
  );
}

export default App;