import { api } from './api';
import { generateStudySchedule, type ScheduleItem } from './gemini';

export type PurposeType = 'CERTIFICATION' | 'CONTEST' | 'INTERNSHIP' | 'ACTIVITY' | 'ETC';

export interface PurposeLike {
  purposeId: number;
  name: string;
  goal: string;
  date: string;
  type?: PurposeType;
}
export interface UserSkill { name: string; score: number; level?: string }
export interface StudyQuiz { question: string; answer: string }

interface CalendarItem {
  calendarId: number;
  purposeId: number;
  eventDate: string;
  title: string;
  description: string;
  link: string;
}

export function encodeExtra(checklist: string[], quiz?: StudyQuiz): string {
  return JSON.stringify({ c: checklist ?? [], q: quiz ?? null });
}
export function decodeExtra(raw: string | undefined): { checklist: string[]; quiz?: StudyQuiz } {
  if (!raw) return { checklist: [] };
  try {
    const o = JSON.parse(raw);
    if (o && typeof o === 'object' && 'c' in o) {
      return { checklist: Array.isArray(o.c) ? o.c : [], quiz: o.q ?? undefined };
    }
    return { checklist: [] };
  } catch {
    return { checklist: [] };
  }
}

const KNOWN_DOMAINS = [
  '알고리즘', '자료구조', 'Android SDK', 'Android', 'Git', 'REST API 설계', 'REST API',
  'Kotlin', 'Java', 'Coroutine', 'MVVM', 'React', 'JavaScript', 'TypeScript',
  'Spring', 'CS', '네트워크', '데이터베이스', 'SQL', 'Figma', 'Python', 'C++',
  'Docker', '운영체제', 'Vue', 'Node',
];

export function pickDomain(...candidates: (string | undefined)[]): string | undefined {
  for (const c of candidates) {
    if (!c) continue;
    const hit = KNOWN_DOMAINS.find((d) => c.includes(d));
    if (hit) return hit;
  }
  return undefined;
}

export function resolveDomain(
  type: PurposeType | undefined,
  ...candidates: (string | undefined)[]
): string | undefined {
  if (type && type !== 'ETC') return undefined;
  return pickDomain(...candidates);
}

export function buildMembers(userSkills?: UserSkill[]): unknown {
  if (!userSkills?.length) return [];
  const skills: Record<string, number> = {};
  userSkills.forEach((s) => { if (s?.name) skills[s.name] = s.score; });
  return [{ name: '나', skills }];
}

const fmt = (dt: Date) =>
  `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;

const normalizeDate = (raw: string) => {
  const m = raw?.match(/\d{4}-\d{2}-\d{2}/g);
  if (m?.length) return m[m.length - 1];
  const d = new Date(); d.setDate(d.getDate() + 30);
  return fmt(d);
};

export async function deletePurpose(purposeId: number): Promise<void> {
  await api.delete(`/api/purposes/${purposeId}`);
}

export async function ensureSchedule(
  purpose: PurposeLike,
  members: unknown = [],
  domain?: string,
): Promise<ScheduleItem[]> {
  try {
    const res = await api.get<{ items: CalendarItem[] }>('/api/calendar');
    const existing = res.data.items.filter((c) => c.purposeId === purpose.purposeId);
    if (existing.length) {
      return existing.map((c, i) => {
        const extra = decodeExtra(c.link);
        return {
          scheduleId: i + 1,
          date: c.eventDate,
          topic: c.title,
          description: c.description,
          checklist: extra.checklist,
          quiz: extra.quiz,
        };
      });
    }
  } catch (e) {
    console.error('[Schedule] GET /api/calendar 실패:', e);
  }

  const finalDomain = domain?.trim() || resolveDomain(purpose.type, purpose.goal, purpose.name);
  const withLinks = !!finalDomain;

  const items = await generateStudySchedule({
    members,
    activity: purpose.name,
    domain: finalDomain ?? '',
    endDate: normalizeDate(purpose.date),
    withLinks,
  });

  const results = await Promise.allSettled(
    items.map((it) =>
      api.post('/api/calendar', {
        purposeId: purpose.purposeId,
        eventDate: it.date,
        title: it.topic,
        description: it.description?.trim() || it.topic,
        link: encodeExtra(it.checklist, it.quiz),
      }),
    ),
  );
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      const e = r.reason as { response?: { status?: number; data?: unknown } };
      console.error(`[Schedule] 저장 실패 #${i}:`, e?.response?.status, e?.response?.data);
    }
  });

  return items;
}