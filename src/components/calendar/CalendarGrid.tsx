import { motion } from 'framer-motion';
import type { CalendarEvent, Purpose, StudySchedule } from '../../types/calendar';

interface Props {
  year: number;
  month: number;
  events: CalendarEvent[];
  purposes: Purpose[];
  studySchedules: StudySchedule[];
  selectedDate: string | null;
  onDateClick: (date: string) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export default function CalendarGrid({
  year, month, events, purposes, studySchedules, selectedDate, onDateClick, onEventClick
}: Props) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();
  const today = new Date();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: lastDate }, (_, i) => i + 1),
  ];

  const totalCells = cells.length;
  const lastRowStart = Math.floor((totalCells - 1) / 7) * 7;

  const eventsByDate = events.reduce<Record<string, CalendarEvent[]>>((acc, e) => {
    const d = e.eventDate.slice(0, 10);
    if (!acc[d]) acc[d] = [];
    acc[d].push(e);
    return acc;
  }, {});

  const purposesByDate = purposes.reduce<Record<string, Purpose[]>>((acc, p) => {
    const d = p.date.slice(0, 10);
    if (!acc[d]) acc[d] = [];
    acc[d].push(p);
    return acc;
  }, {});

  const studyByDate = studySchedules.reduce<Record<string, StudySchedule>>((acc, s) => {
    acc[s.date.slice(0, 10)] = s;
    return acc;
  }, {});

  const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 border-b border-zinc-100">
        {DAY_LABELS.map((d, i) => (
          <div
            key={d}
            className={`py-3 text-center text-xs font-bold tracking-wide
              ${i === 0 ? 'text-rose-400' : i === 6 ? 'text-blue-400' : 'text-zinc-400'}`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 셀 */}
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          const isLastRowFirst = idx === lastRowStart;
          const isLastRowLast = idx === totalCells - 1;

          if (day === null) {
            return (
              <div
                key={`empty-${idx}`}
                className={[
                  'min-h-[96px] border-b border-r border-zinc-100 last:border-r-0',
                  isLastRowFirst ? 'rounded-bl-3xl' : '',
                  isLastRowLast ? 'rounded-br-3xl' : '',
                ].join(' ')}
              />
            );
          }

          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayEvents = eventsByDate[dateStr] ?? [];
          const dayPurposes = purposesByDate[dateStr] ?? [];
          const dayStudy = studyByDate[dateStr] ?? null;

          const isToday =
            today.getFullYear() === year &&
            today.getMonth() + 1 === month &&
            today.getDate() === day;
          const isSelected = selectedDate === dateStr;
          const colIdx = idx % 7;

          return (
            <motion.div
              key={dateStr}
              whileHover={{ backgroundColor: 'rgba(244,244,245,0.8)' }}
              onClick={() => onDateClick(dateStr)}
              className={[
                'min-h-[96px] border-b border-r border-zinc-100 last:border-r-0 p-1.5 cursor-pointer relative group transition-colors',
                isSelected ? 'bg-emerald-50 ring-2 ring-inset ring-emerald-400' : '',
                isLastRowFirst ? 'rounded-bl-3xl' : '',
                isLastRowLast ? 'rounded-br-3xl' : '',
              ].join(' ')}
            >
              {/* 날짜 숫자 */}
              <div className="flex justify-end mb-1">
                <span
                  className={[
                    'w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold transition-colors',
                    isToday
                      ? 'bg-emerald-500 text-white'
                      : colIdx === 0 ? 'text-rose-400'
                      : colIdx === 6 ? 'text-blue-400'
                      : 'text-zinc-600 group-hover:text-zinc-900',
                  ].join(' ')}
                >
                  {day}
                </span>
              </div>

              <div className="flex flex-col gap-0.5">
                {/* 학습 일정 */}
                {dayStudy !== null && (
                  <div className="w-full text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500 text-white truncate">
                    📚 {dayStudy.topic}
                  </div>
                )}

                {/* 목표 */}
                {dayPurposes.slice(0, 1).map((p) => (
                  <div
                    key={`p-${p.purposeId}`}
                    className="w-full text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 truncate"
                  >
                    🎯 {p.name}
                  </div>
                ))}

                {/* 일반 이벤트 */}
                {dayEvents.slice(0, 1).map((ev) => (
                  <button
                    key={`e-${ev.calendarId}`}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onEventClick(ev); }}
                    className="w-full text-left text-[10px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 truncate hover:bg-zinc-200 transition-colors"
                  >
                    {ev.title}
                  </button>
                ))}

                {(dayEvents.length + dayPurposes.length + (dayStudy !== null ? 1 : 0)) > 3 && (
                  <span className="text-[9px] text-zinc-400 px-1">
                    +{dayEvents.length + dayPurposes.length + (dayStudy !== null ? 1 : 0) - 2}개 더
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}