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
  eventDate: string;
  title: string;
  description: string;
  link: string;
}

// ── checklist+quiz를 link 필드에 JSON으로 저장/복원 ─────────
export function encodeExtra(checklist: string[], quiz?: StudyQuiz): string {
  return JSON.stringify({ c: checklist ?? [], q: quiz ?? null });
}
// 옛 데이터(URL 등 JSON 아님)는 파싱 실패 → 빈 체크리스트로 안전 처리
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

// ── 도메인 판별 ──────────────────────────────────
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

const tagFor = (p: PurposeLike) => `[${p.name}]`;

export async function ensureSchedule(
  purpose: PurposeLike,
  members: unknown = [],
  domain?: string,
): Promise<ScheduleItem[]> {
  const tag = tagFor(purpose);

  // 1) 이미 생성된 일정 복원 (옛 데이터는 decodeExtra가 빈 체크리스트로 처리)
  try {
    const res = await api.get<{ items: CalendarItem[] }>('/api/calendar');
    const existing = res.data.items.filter((c) => c.title?.startsWith(tag));
    if (existing.length) {
      return existing.map((c, i) => {
        const extra = decodeExtra(c.link);
        return {
          scheduleId: i + 1,
          date: c.eventDate,
          topic: c.title.replace(tag, '').trim(),
          description: c.description,
          checklist: extra.checklist,
          quiz: extra.quiz,
        };
      });
    }
  } catch (e) {
    console.error('[Schedule] GET /api/calendar 실패:', e);
  }

  // 2) 도메인 결정 후 생성
  const finalDomain = domain?.trim() || resolveDomain(purpose.type, purpose.goal, purpose.name);
  const withLinks = !!finalDomain;

  const items = await generateStudySchedule({
    members,
    activity: purpose.name,
    domain: finalDomain ?? '',
    endDate: normalizeDate(purpose.date),
    withLinks,
  });

  // 3) 캘린더 저장 (checklist+quiz를 link 필드에 JSON으로)
  const results = await Promise.allSettled(
    items.map((it) =>
      api.post('/api/calendar', {
        eventDate: it.date,
        title: `${tag} ${it.topic}`,
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