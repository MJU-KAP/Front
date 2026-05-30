import axios from 'axios';

const gemini = axios.create({
  baseURL: 'https://generativelanguage.googleapis.com/v1beta',
  headers: { 'Content-Type': 'application/json' },
});

export interface ScheduleItem {
  scheduleId: number;
  date: string;
  topic: string;
  description: string;
  links: { type: 'youtube' | 'blog'; url: string; title: string }[];
}

const fmt = (dt: Date) => {
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const SYSTEM = `You are a study-schedule generator for a coding/algorithm study group.

INPUT (JSON):
- members: learners with skill levels, e.g. { "kotlin": 90, "algorithm": 30 }
- activity: the activity the organizer wants to run
- domain: the skill area to grow (Korean, e.g. "알고리즘")
- schedule: a PRE-COMPUTED array of { scheduleId, date }. These dates are FIXED.

TASK: For EACH item in "schedule", fill in topic, description, and links.

CURRICULUM RULES:
- Derive topics and their ORDER from the roadmap.sh learning path for "domain".
  For data structures & algorithms the order is: complexity/Big-O -> sorting ->
  searching -> trees -> graphs -> problem-solving techniques (recursion,
  divide & conquer, greedy, DP, two pointers, sliding window) -> practice.
- Spread topics across the given dates in increasing difficulty.
- Calibrate difficulty/pace to "members": skip what they already know, focus on "domain".

OUTPUT RULES:
- Keep scheduleId and date EXACTLY as given. Never add, remove, or reorder dates.
- Write topic and description in KOREAN. description: 2-3 concrete sentences
  (what they learn + one small hands-on task).
- links: 1-3 per day. type MUST be "youtube" or "blog" only.
  Use real, well-known resources (e.g. GeeksforGeeks, MDN, Fireship). NEVER output roadmap.sh links.
- Return ONLY JSON. No markdown, no commentary.`;

const responseSchema = {
  type: 'object',
  properties: {
    count: { type: 'integer' },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          scheduleId: { type: 'integer' },
          date: { type: 'string' },
          topic: { type: 'string' },
          description: { type: 'string' },
          links: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['youtube', 'blog'] },
                url: { type: 'string' },
                title: { type: 'string' },
              },
              required: ['type', 'url', 'title'],
            },
          },
        },
        required: ['scheduleId', 'date', 'topic', 'description', 'links'],
      },
    },
  },
  required: ['count', 'items'],
};

export async function generateStudySchedule(p: {
  members: unknown;
  activity: string;
  domain: string;
  endDate: string;
}): Promise<ScheduleItem[]> {
  const apiKey = import.meta.env.VITE_GEMINI;
  if (!apiKey) {
    throw new Error('VITE_GEMINI 환경변수가 비어 있습니다. .env 확인 후 dev 서버 재시작 필요');
  }

  const schedule: { scheduleId: number; date: string }[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0); 
  const end = new Date(p.endDate);
  end.setHours(0, 0, 0, 0);
  let id = 1;
  while (d <= end) {
    schedule.push({ scheduleId: id++, date: fmt(d) });
    d.setDate(d.getDate() + 1);
  }
  if (schedule.length === 0) {
    throw new Error('endDate가 오늘보다 이전입니다. 날짜를 확인하세요.');
  }

  const res = await gemini.post(
    '/models/gemini-2.5-flash:generateContent',
    {
      system_instruction: { parts: [{ text: SYSTEM }] },
      contents: [{ role: 'user', parts: [{ text: JSON.stringify({ ...p, schedule }) }] }],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: 'application/json',
        responseSchema,
      },
    },
    { headers: { 'x-goog-api-key': apiKey } },
  );

  // 응답 구조 방어: 차단(safety)·빈 응답이면 candidates가 비어 있을 수 있음
  const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    console.error('[Gemini] 예상치 못한 응답:', JSON.stringify(res.data, null, 2));
    throw new Error('Gemini 응답에서 텍스트를 찾지 못했습니다.');
  }

  const parsed = JSON.parse(text) as { count: number; items: ScheduleItem[] };
  return parsed.items;
}