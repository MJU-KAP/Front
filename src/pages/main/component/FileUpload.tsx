import { useState, useRef } from 'react';

export default function FileUpload() {
  const [isDrag, setIsDrag] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (files: FileList | null) => {
    if (files?.[0]) setFile(files[0]);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDrag(true); }}
      onDragLeave={() => setIsDrag(false)}
      onDrop={(e) => { e.preventDefault(); setIsDrag(false); onFileChange(e.dataTransfer.files); }}
      className={`w-full max-w-4xl border-2 border-dashed rounded-[40px] p-20 transition-all ${
        isDrag ? 'border-orange-500 bg-orange-500/5' : 'border-zinc-700 bg-zinc-900/30'
      }`}
    >
      <input type="file" ref={inputRef} onChange={(e) => onFileChange(e.target.files)} className="hidden" accept=".pdf,.docx,.pptx" />
      
      <div className="flex flex-col items-center gap-6">

        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 text-2xl">☁️</div>

        <div className="text-center">
          <p className="text-xl font-semibold text-white">{file ? file.name : "파일을 드래그하여 업로드하세요"}</p>
          <p className="text-zinc-500 text-sm">PDF, DOCX, PPTX (최대 50MB)</p>
        </div>

        <div className="w-full h-px bg-zinc-800 my-4 relative">
          <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-950 px-4 text-xs text-zinc-600">OR</span>
        </div>

        <button onClick={() => inputRef.current?.click()} className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full transition-transform active:scale-95 shadow-lg shadow-orange-500/20">
          파일 선택하기
        </button>
        
      </div>
    </div>
  );
}