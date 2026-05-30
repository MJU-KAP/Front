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

// ── 링크 인코딩/디코딩 ─────────────────────────────
const LINK_SEP = ' ;; ';
const PART_SEP = '|';

export function encodeLinks(links: ScheduleLink[]): string {
  return (links ?? [])
    .filter((l) => l?.url)
    .map((l) => `${l.type}${PART_SEP}${encodeURIComponent(l.url)}`)
    .join(LINK_SEP);
}

export function decodeLinks(raw: string | undefined): ScheduleLink[] {
  if (!raw) return [];
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

// ── 링크 정제: 잘린/형식 이상 링크 제거 + title 보정 ─────────
function sanitizeLinks(links: ScheduleLink[] = []): ScheduleLink[] {
  return links
    .filter((l) =>
      l?.url &&
      /^https?:\/\/\S+$/.test(l.url) &&  // http(s):// 로 시작하는 완전한 형태
      !l.url.includes('…') &&            // 잘린 url 제거
      !l.url.includes('...'),
    )
    .map((l) => ({
      type: (l.type === 'youtube' ? 'youtube' : 'blog') as LinkType,
      url: l.url,
      title: l.title?.trim() || (l.type === 'youtube' ? '영상 자료' : '관련 자료'),
    }));
}

// ── 도메인 추출 ──────────────────────────────────
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
  const m = raw?.match(/\d{4}-\d{2}-\d{2}/g);
  if (m?.length) return m[m.length - 1]; // 범위면 마지막(마감일)
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

  // 1) 이미 생성된 일정이 있으면 디코딩해 반환
  try {
    const res = await api.get<{ items: CalendarItem[] }>('/api/calendar');
    const existing = res.data.items.filter((c) => c.title?.startsWith(tag));
    if (existing.length) {
      return existing.map((c, i) => ({
        scheduleId: i + 1,
        date: c.eventDate,
        topic: c.title.replace(tag, '').trim(),
        description: c.description,
        links: decodeLinks(c.link),
      }));
    }
  } catch (e) {
    console.error('[Schedule] GET /api/calendar 실패:', e);
  }

  // 2) Gemini로 생성 (검색 기반 링크) + 링크 정제
  const finalDomain = domain?.trim() || extractDomain(purpose.goal);
  const generated = await generateStudySchedule({
    members,
    activity: purpose.name,
    domain: finalDomain,
    endDate: normalizeDate(purpose.date),
  });
  const items: ScheduleItem[] = generated.map((it) => ({
    ...it,
    links: sanitizeLinks(it.links),
  }));

  // 3) 캘린더 저장 (링크 인코딩)
  const results = await Promise.allSettled(
    items.map((it) =>
      api.post('/api/calendar', {
        eventDate: it.date,
        title: `${tag} ${it.topic}`,
        description: it.description?.trim() || it.topic,
        link: encodeLinks(it.links),
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