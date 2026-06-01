import axios from 'axios';

const gemini = axios.create({
  baseURL: 'https://generativelanguage.googleapis.com/v1beta',
  headers: { 'Content-Type': 'application/json' },
});

// 무료 한도가 더 넉넉한 lite 사용 (flash: 250 RPD / lite: 1000 RPD)
const MODEL = 'gemini-2.5-flash-lite';

export interface ScheduleItem {
  scheduleId: number;
  date: string;
  topic: string;
  description: string;
  checklist: string[];
  quiz?: { question: string; answer: string };
}

// ── 학습 도메인용: 토픽 + 체크리스트 + 퀴즈 (링크 없음) ──────────
const SYSTEM_STUDY = `You are a study-schedule generator for a coding/learning study group.

INPUT (JSON):
- members: learners with skill levels, e.g. { "kotlin": 90, "algorithm": 30 }
- activity: the activity the organizer wants to run
- domain: the skill area to grow (Korean, e.g. "알고리즘")
- schedule: a PRE-COMPUTED array of { scheduleId, date }. These dates are FIXED.

TASK: For EACH item in "schedule", fill in topic, description, checklist, and quiz.

CURRICULUM RULES:
- Derive topics and their ORDER from the roadmap.sh learning path for "domain".
  For data structures & algorithms the order is: complexity/Big-O -> sorting ->
  searching -> trees -> graphs -> problem-solving techniques (recursion,
  divide & conquer, greedy, DP, two pointers, sliding window) -> practice.
- Spread topics across the given dates in increasing difficulty.
- Calibrate difficulty/pace to "members": skip what they already know, focus on "domain".

CONTENT RULES (NO LINKS — never output any URL or external resource):
- checklist: 2-3 short bullet points of the KEY things learned that day (Korean, each one concise line).
- quiz: ONE short question reviewing that day's topic, with a concise answer (Korean).
- Do NOT include any links, URLs, or resource references anywhere in the output.

OUTPUT RULES:
- Keep scheduleId and date EXACTLY as given. Never add, remove, or reorder dates.
- Write topic and description in KOREAN. description: 2-3 concrete sentences
  (what they learn + one small hands-on task).
- Return ONLY JSON in EXACTLY this shape. The top-level array MUST be named "items"
  (the INPUT array is "schedule", but your OUTPUT array is "items"):
  {"items":[{"scheduleId":1,"date":"YYYY-MM-DD","topic":"...","description":"...","checklist":["...","..."],"quiz":{"question":"...","answer":"..."}}]}
- No markdown, no commentary.`;

// ── 비학습 활동용: 준비 일정 + 체크리스트 + 퀴즈 (링크 없음) ──────────
const SYSTEM_PREP = `You are an activity-preparation schedule generator.

INPUT (JSON):
- activity: the activity the user is preparing for (Korean; 공모전/대외활동/지원 프로그램 등)
- schedule: a PRE-COMPUTED array of { scheduleId, date }. These dates are FIXED.

TASK: For EACH item in "schedule", fill in topic, description, checklist, and quiz.

RULES:
- Build a realistic step-by-step PREPARATION plan for the given "activity"
  (요구사항/공고 분석 -> 필요 서류 정리 -> 초안 작성 -> 피드백/보완 -> 최종 검토 -> 제출).
- Spread the steps across the given dates in a sensible order, ending near the deadline.
- checklist: 2-3 short action points for that day (Korean, each one concise line).
- quiz: ONE short self-check question for that day, with a concise answer (Korean).
- Do NOT include any links or URLs anywhere.
- Keep scheduleId and date EXACTLY as given. Never add, remove, or reorder dates.
- Write topic and description in KOREAN. description: 2-3 concrete sentences
  (what to do that day + one small actionable task).
- Return ONLY JSON in EXACTLY this shape. The top-level array MUST be named "items"
  (the INPUT array is "schedule", but your OUTPUT array is "items"):
  {"items":[{"scheduleId":1,"date":"YYYY-MM-DD","topic":"...","description":"...","checklist":["..."],"quiz":{"question":"...","answer":"..."}}]}
- No markdown, no commentary.`;

// 로컬(KST) 기준 YYYY-MM-DD
const fmt = (dt: Date) =>
  `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;

// JSON만 안전 추출 (items/schedule/최상위 배열 모두 허용)
function extractJson(text: string): { items: ScheduleItem[] } {
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '');
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('응답에서 JSON을 찾지 못했습니다.');
  const obj = JSON.parse(cleaned.slice(start, end + 1));
  const items = obj.items ?? obj.schedule ?? (Array.isArray(obj) ? obj : null);
  if (!Array.isArray(items)) throw new Error('응답에서 일정 배열을 찾지 못했습니다.');
  return { items };
}

// 429(한도 초과) 시 잠깐 기다렸다 재시도
async function postWithRetry(
  body: unknown,
  apiKey: string,
  retries = 2,
): Promise<{ data: unknown }> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await gemini.post(`/models/${MODEL}:generateContent`, body, {
        headers: { 'x-goog-api-key': apiKey },
      });
    } catch (e: unknown) {
      const status =
        e && typeof e === 'object' && 'response' in e
          ? (e as { response?: { status?: number } }).response?.status
          : undefined;
      if (status === 429 && attempt < retries) {
        const wait = 3000 * (attempt + 1); // 3s, 6s
        console.warn(`[Gemini] 429 한도 초과 — ${wait}ms 후 재시도 (${attempt + 1}/${retries})`);
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }
      throw e;
    }
  }
  throw new Error('요청 재시도 실패');
}

export async function generateStudySchedule(p: {
  members: unknown;
  activity: string;
  domain: string;
  endDate: string;
  withLinks: boolean;  // 학습 도메인이면 true(STUDY), 비학습이면 false(PREP)
}): Promise<ScheduleItem[]> {
  const apiKey = import.meta.env.VITE_GEMINI;
  if (!apiKey) {
    throw new Error('VITE_GEMINI 환경변수가 비어 있습니다. .env 확인 후 dev 서버 재시작 필요');
  }

  // 금일 ~ endDate 날짜 배열 (로컬 기준)
  const schedule: { scheduleId: number; date: string }[] = [];
  const d = new Date(); d.setHours(0, 0, 0, 0);
  const end = new Date(p.endDate); end.setHours(0, 0, 0, 0);
  let id = 1;
  while (d <= end) {
    schedule.push({ scheduleId: id++, date: fmt(d) });
    d.setDate(d.getDate() + 1);
  }
  if (schedule.length === 0) {
    throw new Error('endDate가 오늘보다 이전입니다. 날짜를 확인하세요.');
  }

  const body = {
    system_instruction: { parts: [{ text: p.withLinks ? SYSTEM_STUDY : SYSTEM_PREP }] },
    contents: [{
      role: 'user',
      parts: [{ text: JSON.stringify(
        p.withLinks
          ? { members: p.members, activity: p.activity, domain: p.domain, schedule }
          : { activity: p.activity, schedule },
      ) }],
    }],
    generationConfig: { temperature: 0.3 },
  };

  const res = await postWithRetry(body, apiKey);

  const parts = (res.data as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  })?.candidates?.[0]?.content?.parts;
  const text = parts?.map((pt) => pt.text ?? '').join('') ?? '';

  if (!text) {
    console.error('[Gemini] 빈 응답:', JSON.stringify(res.data, null, 2));
    throw new Error('Gemini 응답에서 텍스트를 찾지 못했습니다.');
  }

  return extractJson(text).items.map((it) => ({
    ...it,
    checklist: Array.isArray(it.checklist) ? it.checklist.slice(0, 3) : [],
  }));
}