import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CreateCalendarEventBody } from '../../types/calendar';

interface Props {
  isOpen: boolean;
  selectedDate: string;
  onClose: () => void;
  onSubmit: (body: CreateCalendarEventBody) => Promise<void>;
}

export default function EventModal({ isOpen, selectedDate, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<CreateCalendarEventBody>({
    eventDate: selectedDate,
    title: '',
    description: '',
    link: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // selectedDate 바뀌면 eventDate 동기화
  const handleSubmit = async () => {
    if (!form.title.trim()) { setError('제목을 입력해주세요.'); return; }
    setLoading(true);
    setError('');
    try {
      await onSubmit({ ...form, eventDate: selectedDate });
      setForm({ eventDate: selectedDate, title: '', description: '', link: '' });
      onClose();
    } catch {
      setError('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40"
          />

          {/* 모달 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                       bg-white rounded-3xl shadow-xl border border-zinc-200 w-full max-w-md p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-zinc-400 font-medium mb-0.5">{selectedDate}</p>
                <h2 className="text-lg font-bold text-zinc-900">일정 추가</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-500 mb-1.5 block">제목 *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="예: 정보처리기사 필기시험"
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-zinc-400 placeholder:text-zinc-300"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-500 mb-1.5 block">설명</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="간단한 메모"
                  rows={3}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-zinc-400 placeholder:text-zinc-300 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-500 mb-1.5 block">링크</label>
                <input
                  type="url"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-zinc-400 placeholder:text-zinc-300"
                />
              </div>

              {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

              <div className="flex gap-2 mt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-sm font-bold text-zinc-500 hover:bg-zinc-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? '저장 중...' : '저장'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}