import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../apis/api';
import { ensureSchedule, decodeLinks } from '../../apis/studySchedule';
import CalendarGrid from '../../components/calendar/CalendarGrid';
import StudyDetailPanel from '../../components/calendar/StudyDetailPanel';
import PurposePanel from '../../components/calendar/PurposePanel';
import type {
  CalendarEvent, CalendarEventListResponse,
  Purpose, PurposeListResponse,
  StudySchedule,
} from '../../types/calendar';

const TAG_RE = /^\[(.+?)\]\s*(.+)$/;

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const [purposes, setPurposes] = useState<Purpose[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const triedFor = useRef<Set<number>>(new Set());

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [purposeRes, calendarRes] = await Promise.all([
        api.get<PurposeListResponse>('/api/purposes'),
        api.get<CalendarEventListResponse>('/api/calendar'),
      ]);
      setPurposes(purposeRes.data.items);
      setEvents(calendarRes.data.items);
    } catch (e) {
      console.error('[Calendar] fetchData 에러:', e);
      setError('데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 목표는 있는데 그 목표의 일정이 없는 경우에만 생성
  useEffect(() => {
    if (loading || generating) return;
    if (!purposes.length) return;

    const hasSchedule = (p: Purpose) =>
      events.some((ev) => ev.title?.startsWith(`[${p.name}]`));

    const target = purposes.find(
      (p) => !hasSchedule(p) && !triedFor.current.has(p.purposeId),
    );
    if (!target) return;

    triedFor.current.add(target.purposeId);
    setGenerating(true);

    ensureSchedule({
      purposeId: target.purposeId,
      name: target.name,
      goal: target.goal,
      date: target.date,
    })
      .then(() => fetchData())
      .catch((e) => console.error('[Calendar] 일정 생성 실패:', e))
      .finally(() => setGenerating(false));
  }, [loading, generating, purposes, events, fetchData]);

  // /api/calendar 이벤트에서 학습 일정 복원 (링크는 decodeLinks로 분리)
  const studySchedules = useMemo<StudySchedule[]>(() => {
    return events
      .filter((ev) => TAG_RE.test(ev.title))
      .map((ev) => {
        const m = ev.title.match(TAG_RE);
        const topic = m ? m[2].trim() : ev.title;
        return {
          scheduleId: ev.calendarId,
          date: ev.eventDate.slice(0, 10),
          topic,
          description: ev.description ?? '',
          links: decodeLinks(ev.link),   // ★ 유튜브+블로그 모두 복원
        };
      });
  }, [events]);

  const plainEvents = useMemo(
    () => events.filter((ev) => !TAG_RE.test(ev.title)),
    [events],
  );

  const handleDateClick = (date: string) => {
    setSelectedDate((prev) => (prev === date ? null : date));
  };

  const prevMonth = () => {
    if (month === 1) { setYear((y) => y - 1); setMonth(12); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setYear((y) => y + 1); setMonth(1); }
    else setMonth((m) => m + 1);
  };

  const selectedStudy = selectedDate
    ? (studySchedules.find((s) => s.date.slice(0, 10) === selectedDate) ?? null)
    : null;

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-black text-zinc-900">학습 캘린더</h1>
          <p className="text-sm text-zinc-400 mt-1">날짜를 클릭해 AI 학습 일정과 자료를 확인하세요</p>
        </motion.div>

        {generating && (
          <div className="mb-6 flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-2xl px-5 py-3">
            <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-orange-600 font-medium">목표에 맞는 학습 일정을 생성하는 중입니다...</p>
          </div>
        )}

        {error !== null && (
          <div className="mb-6 flex items-center justify-between bg-rose-50 border border-rose-200 rounded-2xl px-5 py-3">
            <p className="text-sm text-rose-600 font-medium">{error}</p>
            <button type="button" onClick={fetchData} className="text-xs font-bold text-rose-600 underline">
              다시 시도
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

          <div className="flex flex-col gap-3">

            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-zinc-900">{year}년 {month}월</h2>
              <button
                type="button"
                onClick={prevMonth}
                className="w-7 h-7 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 transition-colors text-sm"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="w-7 h-7 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 transition-colors text-sm"
              >
                ›
              </button>
              <button
                type="button"
                onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth() + 1); }}
                className="px-3 py-1 rounded-lg border border-zinc-200 text-xs font-bold text-zinc-400 hover:bg-zinc-100 transition-colors"
              >
                오늘
              </button>
            </div>

            {loading ? (
              <div className="bg-white rounded-3xl border border-zinc-200 flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-zinc-400">불러오는 중...</p>
                </div>
              </div>
            ) : (
              <CalendarGrid
                year={year}
                month={month}
                events={plainEvents}
                purposes={purposes}
                studySchedules={studySchedules}
                selectedDate={selectedDate}
                onDateClick={handleDateClick}
                onEventClick={(ev) => setSelectedDate(ev.eventDate.slice(0, 10))}
              />
            )}

            <div className="flex items-center gap-4 px-1">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-orange-200" />
                <span className="text-[11px] text-zinc-400">목표</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-200" />
                <span className="text-[11px] text-zinc-400">일정</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <AnimatePresence mode="wait">
              {selectedDate !== null ? (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                >
                  <StudyDetailPanel
                    selectedDate={selectedDate}
                    studySchedule={selectedStudy}
                    events={plainEvents}
                    onClose={() => setSelectedDate(null)}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="bg-white rounded-3xl border border-zinc-100 flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mb-3">
                    <span className="text-xl">👆</span>
                  </div>
                  <p className="text-sm font-bold text-zinc-400">날짜를 클릭하면</p>
                  <p className="text-xs text-zinc-300 mt-1">AI 학습 일정과 자료가 표시됩니다</p>
                </motion.div>
              )}
            </AnimatePresence>

            <PurposePanel purposes={purposes} />
          </div>
        </div>
      </div>
    </div>
  );
}