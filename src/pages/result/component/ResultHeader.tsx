export default function ResultHeader({ fileName }: { fileName: string }) {
    return (
      <header className="w-full bg-zinc-100 px-8 py-4 flex justify-between items-center border-b border-zinc-200">
        <div className="flex items-center gap-2 text-zinc-700 font-medium">
          <span className="text-orange-500">📄</span>
          {fileName}
        </div>
        <div className="flex items-center gap-2 text-emerald-500 text-sm font-semibold">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          분석 완료
        </div>
      </header>
    );
  }