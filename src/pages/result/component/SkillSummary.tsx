export default function SkillSummary({ owned, lacking, score }: { owned: number, lacking: number, score: number }) {
    return (
      <div className="grid grid-cols-3 gap-4 my-2">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-center">
          <span className="text-zinc-500 text-sm mb-1">보유 역량</span>
          <span className="text-orange-500 text-2xl font-bold">{owned}개</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-center">
          <span className="text-zinc-500 text-sm mb-1">부족 역량</span>
          <span className="text-red-400 text-2xl font-bold">{lacking}개</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-center">
          <span className="text-zinc-500 text-sm mb-1">역량 점수</span>
          <span className="text-emerald-500 text-2xl font-bold">{score}/100</span>
        </div>
      </div>
    );
  }