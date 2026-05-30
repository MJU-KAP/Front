import { useEffect, useRef, useState } from 'react';
import { ensureSchedule, type PurposeLike } from '../apis/studySchedule';
import type { ScheduleItem } from '../apis/gemini';

export function useStudySchedule(purpose: PurposeLike | null, members: unknown = []) {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const ranFor = useRef<number | null>(null);

  useEffect(() => {
    if (!purpose) return;
    if (ranFor.current === purpose.purposeId) return;
    ranFor.current = purpose.purposeId;

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      try {
        const result = await ensureSchedule(purpose, members);
        if (!cancelled) setItems(result);
      } catch (e) {
        console.error('[Schedule] 로드 실패:', e);
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [purpose, members]);

  return { items, loading };
}