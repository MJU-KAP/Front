import { useState, useRef, useCallback } from 'react';
import Toast from '../../../components/Toast';
import { useAuthStore } from '../../../store/authStore';

// 파일 업로드 최대 크기 100mb
const MAX_FILE_SIZE = 100 * 1024 * 1024;

export default function FileUpload() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  
  const [isDrag, setIsDrag] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const [toast, setToast] = useState({
    show: false,
    title: '',
    description: '',
    icon: '🔔',
    type: 'warning' as 'warning' | 'success' | 'info'
  });

  const triggerToast = useCallback((title: string, description: string, icon = '🔔', type: 'warning' | 'success' | 'info' = 'warning') => {
    setToast({ show: true, title, description, icon, type });
  }, []);

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  const onFileChange = useCallback((newFiles: FileList | null) => {
    if (!isLoggedIn) {
      triggerToast('로그인이 필요합니다', '파일 분석을 위해 먼저 로그인을 해주세요.', '🔒');
      return;
    }
    if (!newFiles) return;

    const validFiles: File[] = [];
    Array.from(newFiles).forEach((file) => {
      if (file.size <= MAX_FILE_SIZE) {
        validFiles.push(file);
      } else {
        triggerToast('용량 초과', `${file.name}이 100MB를 넘습니다.`, '⚠️');
      }
    });

    setFiles((prev) => [...prev, ...validFiles]);
  }, [isLoggedIn, triggerToast]);

  const handleRemoveFile = useCallback((indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  const handleAnalyze = useCallback(() => {
    if (!isLoggedIn) {
      triggerToast('로그인 필요', '로그인 후 분석 기능을 이용할 수 있습니다.', '🔒');
      return;
    }
  }, [isLoggedIn, triggerToast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDrag(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDrag(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDrag(false);
    if (e.dataTransfer.files) {
      onFileChange(e.dataTransfer.files);
    }
  }, [onFileChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(e.target.files);
    if (e.target) {
      e.target.value = ''; 
    }
  }, [onFileChange]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative w-full border-2 border-dashed rounded-[40px] transition-all cursor-pointer overflow-hidden ${
          isDrag ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-700 bg-zinc-900/30'
        } ${files.length > 0 ? 'p-8' : 'p-20'}`}
      >
        <input 
          type="file" 
          ref={inputRef} 
          onChange={handleInputChange} 
          className="hidden" 
          multiple 
        />
        
        {files.length === 0 ? (
          <div className="flex flex-col items-center gap-6 pointer-events-none text-center">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 text-2xl">📄</div>
            <div>
              <p className="text-xl font-semibold text-white">분석할 파일을 드래그하여 업로드하세요</p>
              <p className="text-zinc-500 text-sm mt-2">최대 100MB (여러 파일 선택 가능)</p>
            </div>
            <button className="mt-4 px-8 py-3 bg-orange-500 text-white font-bold rounded-full transition-transform active:scale-95">
              파일 선택하기
            </button>
          </div>
        ) : (
          <div className="w-full space-y-4">
            <div className="flex justify-between items-center mb-4 px-2">
              <h3 className="text-white font-medium">선택된 파일 ({files.length})</h3>
              <p className="text-orange-500 text-sm font-bold">파일 추가하기</p>
            </div>
            
            <div className="grid grid-cols-1 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {files.map((file, index) => (
                <div key={`${file.name}-${index}`} onClick={(e) => e.stopPropagation()} className="flex items-center justify-between bg-zinc-800/80 border border-zinc-700 p-4 rounded-2xl group">
                  <div className="flex items-center gap-4 overflow-hidden text-white">
                    <div className="w-10 h-12 bg-zinc-700 rounded-md flex items-center justify-center text-[10px] text-zinc-400 font-bold uppercase">{file.name.split('.').pop()}</div>
                    <div className="flex flex-col overflow-hidden text-left">
                      <span className="text-sm truncate">{file.name}</span>
                      <span className="text-zinc-500 text-xs">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemoveFile(index)} 
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900/50 text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <button 
          onClick={handleAnalyze}
          className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold rounded-[25px] transition-all shadow-xl shadow-orange-500/20 active:scale-[0.99]"
        >
          {files.length}개의 파일 분석 시작하기
        </button>
      )}

      <Toast 
        show={toast.show} 
        onClose={closeToast}
        title={toast.title}
        description={toast.description}
        icon={toast.icon}
        type={toast.type}
      />
    </div>
  );
}