import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StudySchedule, CalendarEvent } from '../../types/calendar';

interface Props {
  selectedDate: string | null;
  studySchedule: StudySchedule | null;
  events: CalendarEvent[];
  onClose: () => void;
}

export default function StudyDetailPanel({ selectedDate, studySchedule, events, onClose }: Props) {
  const [showAnswer, setShowAnswer] = useState(false);

  if (!selectedDate) return null;

  const dateEvents = events.filter((e) => e.eventDate.slice(0, 10) === selectedDate.slice(0, 10));
  const checklist = studySchedule?.checklist ?? [];
  const quiz = studySchedule?.quiz;
  const hasContent = studySchedule !== null || dateEvents.length > 0;

  return (
    <AnimatePresence>
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col"
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
            <div>
              <p className="text-xs text-zinc-400 font-medium">{formatDateKo(selectedDate)}</p>
              <h3 className="text-base font-black text-zinc-900 mt-0.5">
                {studySchedule ? studySchedule.topic : '등록된 학습 없음'}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors text-sm"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">

            {/* 학습 일정 상세 */}
            {studySchedule ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-600">
                    AI 학습 플랜
                  </span>
                </div>
                <p className="text-sm text-zinc-600 leading-relaxed">{studySchedule.description}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mb-3">
                  <span className="text-xl">📅</span>
                </div>
                <p className="text-sm font-bold text-zinc-400">이 날의 학습 일정이 없어요</p>
              </div>
            )}

            {/* AI 체크리스트 */}
            {studySchedule && (
              checklist.length > 0 ? (
                <div>
                  <p className="text-xs font-bold text-zinc-400 mb-3">오늘의 학습 체크리스트</p>
                  <div className="rounded-2xl bg-orange-50/60 border border-orange-100 p-4">
                    <ul className="flex flex-col gap-2.5">
                      {checklist.map((c, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-zinc-700">
                          <span className="text-orange-400 mt-0.5 shrink-0">✓</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-zinc-300 text-center py-2">학습 내용이 없어요</p>
              )
            )}

            {/* 오늘의 퀴즈 — 정답 보기/숨기기 토글 */}
            {studySchedule && quiz?.question && (
              <div>
                <p className="text-xs font-bold text-zinc-400 mb-3">오늘의 퀴즈</p>
                <div className="rounded-2xl border border-zinc-100 p-4">
                  <p className="text-sm text-zinc-800 mb-3 leading-relaxed">Q. {quiz.question}</p>

                  <AnimatePresence initial={false}>
                    {showAnswer && (
                      <motion.p
                        key="answer"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.15 }}
                        className="text-sm text-orange-600 bg-orange-50 rounded-lg px-3 py-2 leading-relaxed mb-3 overflow-hidden"
                      >
                        A. {quiz.answer}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button
                    type="button"
                    onClick={() => setShowAnswer((v) => !v)}
                    className="text-xs font-bold text-orange-500 border border-orange-200 rounded-lg px-3 py-1.5 hover:bg-orange-50 transition-colors"
                  >
                    {showAnswer ? '정답 숨기기' : '정답 보기'}
                  </button>
                </div>
              </div>
            )}

            {/* 일반 이벤트 */}
            {dateEvents.length > 0 && (
              <div>
                <p className="text-xs font-bold text-zinc-400 mb-3">등록된 일정</p>
                <div className="flex flex-col gap-2">
                  {dateEvents.map((ev) => (
                    <div key={ev.calendarId} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-zinc-800">{ev.title}</p>
                        {ev.description && (
                          <p className="text-[10px] text-zinc-400 mt-0.5">{ev.description}</p>
                        )}
                        {ev.link && (
                          <button
                            type="button"
                            onClick={() => window.open(ev.link, '_blank', 'noopener,noreferrer')}
                            className="text-[10px] text-emerald-500 font-bold underline mt-1 hover:text-emerald-700"
                          >
                            링크 열기
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!hasContent && (
              <p className="text-xs text-zinc-300 text-center py-4">날짜를 클릭해 일정을 추가해보세요</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function formatDateKo(dateStr: string): string {
  const d = new Date(dateStr);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
}