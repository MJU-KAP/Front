import { api } from './api';
import { generateStudySchedule, type ScheduleItem } from './gemini';

export interface PurposeLike {
  purposeId: number;
  name: string;
  goal: string;
  date: string;
}

export interface UserSkill { name: string; score: number; level?: string }

interface CalendarItem {
  calendarId: number;
  eventDate: string;
  title: string;
  description: string;
  link: string;
}

type LinkType = 'youtube' | 'blog';
export interface ScheduleLink { type: LinkType; url: string; title: string }

// ── 링크 인코딩/디코딩 (저장·복원 양쪽이 공유) ─────────────────
const LINK_SEP = ' ;; ';   // 링크 사이 구분자
const PART_SEP = '|';       // type 과 url 구분자

/** 링크 배열 → "youtube|url ;; blog|url" 문자열 */
export function encodeLinks(links: ScheduleLink[]): string {
  return (links ?? [])
    .filter((l) => l?.url)
    .map((l) => `${l.type}${PART_SEP}${encodeURIComponent(l.url)}`)
    .join(LINK_SEP);
}

/** "youtube|url ;; blog|url" 문자열 → 링크 배열 */
export function decodeLinks(raw: string | undefined): ScheduleLink[] {
  if (!raw) return [];
  // 구분자가 없으면 옛 데이터(단일 URL)로 간주
  if (!raw.includes(PART_SEP)) {
    return [{ type: 'blog', url: raw, title: '관련 자료' }];
  }
  return raw.split(LINK_SEP).map((s) => {
    const idx = s.indexOf(PART_SEP);
    const type = (s.slice(0, idx) === 'youtube' ? 'youtube' : 'blog') as LinkType;
    const url = decodeURIComponent(s.slice(idx + 1));
    return { type, url, title: type === 'youtube' ? '영상 자료' : '관련 자료' };
  });
}
// ──────────────────────────────────────────────────────────────

// 학습 도메인 화이트리스트
const KNOWN_DOMAINS = [
  '알고리즘', '자료구조', 'Android SDK', 'Android', 'Git', 'REST API 설계', 'REST API',
  'Kotlin', 'Java', 'Coroutine', 'MVVM', 'React', 'JavaScript', 'TypeScript',
  'Spring', 'CS', '네트워크', '데이터베이스', 'SQL', 'Figma',
];

export function pickDomain(...candidates: (string | undefined)[]): string | undefined {
  for (const c of candidates) {
    if (!c) continue;
    const hit = KNOWN_DOMAINS.find((d) => c.includes(d));
    if (hit) return hit;
  }
  return undefined;
}

export function buildMembers(userSkills?: UserSkill[]): unknown {
  if (!userSkills?.length) return [];
  const skills: Record<string, number> = {};
  userSkills.forEach((s) => { if (s?.name) skills[s.name] = s.score; });
  return [{ name: '나', skills }];
}

const extractDomain = (goal: string) =>
  (goal ?? '').replace(/\s*\+?\d+\s*%?$/, '').trim() || '학습';

const fmt = (dt: Date) =>
  `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;

const normalizeDate = (raw: string) => {
  const m = raw?.match(/\d{4}-\d{2}-\d{2}/);
  if (m) return m[0];
  const d = new Date(); d.setDate(d.getDate() + 30);
  return fmt(d);
};

const tagFor = (p: PurposeLike) => `[${p.name}]`;

/**
 * 목표에 일정이 없으면 생성+캘린더 저장, 있으면 기존 것을 반환 (멱등).
 */
export async function ensureSchedule(
  purpose: PurposeLike,
  members: unknown = [],
  domain?: string,
): Promise<ScheduleItem[]> {
  const tag = tagFor(purpose);

  // 1) 이미 이 목표로 생성된 일정이 있는지 확인 → 있으면 디코딩해 반환
  try {
    const res = await api.get<{ items: CalendarItem[] }>('/api/calendar');
    const existing = res.data.items.filter((c) => c.title?.startsWith(tag));
    if (existing.length) {
      return existing.map((c, i) => ({
        scheduleId: i + 1,
        date: c.eventDate,
        topic: c.title.replace(tag, '').trim(),
        description: c.description,
        links: decodeLinks(c.link),   // ★ 여러 링크 복원
      }));
    }
  } catch (e) {
    console.error('[Schedule] GET /api/calendar 실패:', e);
  }

  // 2) 없을 때만 Gemini로 생성
  const finalDomain = domain?.trim() || extractDomain(purpose.goal);
  const items = await generateStudySchedule({
    members,
    activity: purpose.name,
    domain: finalDomain,
    endDate: normalizeDate(purpose.date),
  });

  // 3) 캘린더에 저장 — 링크들을 인코딩해 link 필드 하나에 담음
  const results = await Promise.allSettled(
    items.map((it) =>
      api.post('/api/calendar', {
        eventDate: it.date,
        title: `${tag} ${it.topic}`,
        description: it.description?.trim() || it.topic,
        link: encodeLinks(it.links),   // ★ 여러 링크 인코딩 저장
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