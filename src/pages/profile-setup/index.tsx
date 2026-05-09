import { useEffect, useMemo, useRef, useState } from 'react';
import NextPlanLogo from '../../components/brand/NextPlanLogo';

const JOB_OPTIONS = [
  'Frontend',
  'Backend',
  'Full Stack',
  'DevOps',
  'DevSecOps',
  'Data Analyst',
  'AI Engineer',
  'AI and Data Scientist',
  'Data Engineer',
  'Android Developer',
  'Machine Learning Engineer',
  'PostgreSQL / DBA',
  'iOS Developer',
  'Blockchain Developer',
  'QA Engineer',
  'Software Architect',
  'Cyber Security',
  'UX Designer',
  'Technical Writer',
  'Game Developer',
  'Server Side Game Developer',
  'MLOps',
  'Product Manager',
  'Engineering Manager',
  'Developer Relations',
  'BI Analyst',
] as const;

type TechCatalogItem = {
  name: string;
  category: string;
};

/** 검색·결과 목록용 (이름 + 카테고리 — Skill-based Roadmaps 기준) */
const TECH_CATALOG: TechCatalogItem[] = [
  // 언어
  { name: 'JavaScript', category: '언어' },
  { name: 'TypeScript', category: '언어' },
  { name: 'Python', category: '언어' },
  { name: 'Java', category: '언어' },
  { name: 'C++', category: '언어' },
  { name: 'Rust', category: '언어' },
  { name: 'Go', category: '언어' },
  { name: 'PHP', category: '언어' },
  { name: 'Ruby', category: '언어' },
  { name: 'Kotlin', category: '언어' },
  { name: 'Swift / SwiftUI', category: '언어' },
  { name: 'Scala', category: '언어' },
  { name: 'HTML', category: '언어' },
  { name: 'CSS', category: '언어' },
  { name: 'Shell / Bash', category: '언어' },
  { name: 'SQL', category: '언어' },
  // 프레임워크 / 라이브러리
  { name: 'React', category: '프레임워크 / 라이브러리' },
  { name: 'Vue', category: '프레임워크 / 라이브러리' },
  { name: 'Angular', category: '프레임워크 / 라이브러리' },
  { name: 'Next.js', category: '프레임워크 / 라이브러리' },
  { name: 'React Native', category: '프레임워크 / 라이브러리' },
  { name: 'Flutter', category: '프레임워크 / 라이브러리' },
  { name: 'Node.js', category: '프레임워크 / 라이브러리' },
  { name: 'ASP.NET Core', category: '프레임워크 / 라이브러리' },
  { name: 'Spring Boot', category: '프레임워크 / 라이브러리' },
  { name: 'Django', category: '프레임워크 / 라이브러리' },
  { name: 'Laravel', category: '프레임워크 / 라이브러리' },
  { name: 'Ruby on Rails', category: '프레임워크 / 라이브러리' },
  // 인프라 / 클라우드 / DevOps
  { name: 'Docker', category: '인프라 / 클라우드 / DevOps' },
  { name: 'Kubernetes', category: '인프라 / 클라우드 / DevOps' },
  { name: 'AWS', category: '인프라 / 클라우드 / DevOps' },
  { name: 'Terraform', category: '인프라 / 클라우드 / DevOps' },
  { name: 'Linux', category: '인프라 / 클라우드 / DevOps' },
  { name: 'Cloudflare', category: '인프라 / 클라우드 / DevOps' },
  { name: 'Git / GitHub', category: '인프라 / 클라우드 / DevOps' },
  // 데이터베이스
  { name: 'PostgreSQL', category: '데이터베이스' },
  { name: 'MongoDB', category: '데이터베이스' },
  { name: 'Redis', category: '데이터베이스' },
  { name: 'Elasticsearch', category: '데이터베이스' },
  // AI / ML
  { name: 'Prompt Engineering', category: 'AI / ML' },
  { name: 'AI Agents', category: 'AI / ML' },
  { name: 'AI Red Teaming', category: 'AI / ML' },
  // 기타
  { name: 'GraphQL', category: '기타' },
  { name: 'API Design', category: '기타' },
  { name: 'System Design', category: '기타' },
  { name: 'Software Design & Architecture', category: '기타' },
  { name: 'Design System', category: '기타' },
  { name: 'Computer Science', category: '기타' },
  { name: 'Data Structures & Algorithms', category: '기타' },
  { name: 'Code Review', category: '기타' },
  { name: 'WordPress', category: '기타' },
  { name: 'Claude Code', category: '기타' },
  { name: 'Vibe Coding', category: '기타' },
  { name: 'OpenClaw', category: '기타' },
];

const MAX_STACK = 15;

function ChevronDownIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProfileSetupPage() {
  const [jobRole, setJobRole] = useState<string>(JOB_OPTIONS[0]);
  const [jobDropdownOpen, setJobDropdownOpen] = useState(false);
  const jobSelectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!jobDropdownOpen) return;
    const close = (e: MouseEvent) => {
      if (jobSelectRef.current && !jobSelectRef.current.contains(e.target as Node)) {
        setJobDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [jobDropdownOpen]);

  const [selectedStacks, setSelectedStacks] = useState<string[]>([
    'React',
    'TypeScript',
    'Next.js',
    'Python',
  ]);
  const [stackQuery, setStackQuery] = useState('');

  const selectedSet = useMemo(() => new Set(selectedStacks), [selectedStacks]);

  const filteredCatalog = useMemo(() => {
    const q = stackQuery.trim().toLowerCase();
    if (!q) return [];
    return TECH_CATALOG.filter(
      (item) =>
        item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    );
  }, [stackQuery]);

  const addStack = (name: string) => {
    setSelectedStacks((prev) => {
      if (prev.includes(name)) return prev;
      if (prev.length >= MAX_STACK) return prev;
      return [...prev, name];
    });
  };

  const removeStack = (name: string) => {
    setSelectedStacks((prev) => prev.filter((s) => s !== name));
  };

  return (
    <div className="min-h-screen bg-zinc-100 px-4 py-10 text-zinc-900">
      <div className="mx-auto flex w-full max-w-lg flex-col items-center">
        <div className="mb-8 flex justify-center">
          <NextPlanLogo className="text-2xl" />
        </div>

        <div className="w-full rounded-3xl border border-zinc-200/80 bg-white px-6 py-10 shadow-sm sm:px-10">
          <h1 className="text-center text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl">
            프로필 설정
          </h1>
          <p className="mt-2 text-center text-sm text-zinc-500 sm:text-base">
            더 정확한 AI 분석을 위해 기본 정보를 입력해주세요
          </p>

          {/* 스테퍼 */}
          <div className="mt-10 flex items-center justify-center gap-2 sm:gap-4">
            <div className="flex flex-col items-center gap-1.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-sm font-bold text-zinc-400">
                1
              </span>
              <span className="text-xs font-medium text-zinc-400 sm:text-sm">카카오 인증</span>
            </div>
            <div className="mx-1 h-px w-8 bg-zinc-200 sm:w-12" aria-hidden />
            <div className="flex flex-col items-center gap-1.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white shadow-md shadow-orange-500/25">
                2
              </span>
              <span className="text-xs font-semibold text-orange-500 sm:text-sm">프로필 설정</span>
            </div>
          </div>

          {/* 희망 직군 — 커스텀 단일 선택 (화살표 + 목록 내 체크) */}
          <div className="mt-10" ref={jobSelectRef}>
            <div className="mb-2 flex items-center gap-1.5">
              <span id="job-role-label" className="text-sm font-bold text-zinc-900">
                희망 직군
              </span>
              <ChevronDownIcon className="h-4 w-4 shrink-0 text-zinc-400" />
            </div>
            <div className="relative">
              <button
                type="button"
                id="job-role-trigger"
                aria-labelledby="job-role-label"
                aria-haspopup="listbox"
                aria-expanded={jobDropdownOpen}
                onClick={() => setJobDropdownOpen((o) => !o)}
                className="flex w-full items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-left text-sm font-medium text-zinc-900 outline-none transition-colors hover:border-zinc-300 focus-visible:border-orange-400 focus-visible:ring-2 focus-visible:ring-orange-500/20"
              >
                <span className="min-w-0 truncate">{jobRole}</span>
                <ChevronDownIcon
                  className={`shrink-0 text-zinc-400 transition-transform ${jobDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {jobDropdownOpen && (
                <ul
                  role="listbox"
                  aria-labelledby="job-role-label"
                  className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-auto rounded-2xl border border-zinc-200 bg-white py-1 shadow-lg shadow-zinc-900/10"
                >
                  {JOB_OPTIONS.map((job) => {
                    const selected = job === jobRole;
                    return (
                      <li key={job} role="presentation">
                        <button
                          type="button"
                          role="option"
                          aria-selected={selected}
                          onClick={() => {
                            setJobRole(job);
                            setJobDropdownOpen(false);
                          }}
                          className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors ${
                            selected
                              ? 'bg-orange-50 font-semibold text-orange-600'
                              : 'text-zinc-900 hover:bg-zinc-50'
                          }`}
                        >
                          <span className="truncate">{job}</span>
                          {selected ? (
                            <span className="shrink-0 text-orange-500" aria-hidden>
                              ✓
                            </span>
                          ) : (
                            <span className="w-5 shrink-0" aria-hidden />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* 기술 스택 */}
          <div className="mt-8">
            <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-sm font-bold text-zinc-900">기술 스택</span>
              <span className="text-xs text-zinc-500">
                {selectedStacks.length} / {MAX_STACK}개 선택됨
              </span>
            </div>
            <p className="mb-3 text-xs text-zinc-500 sm:text-sm">
              기술을 입력하면 연관 검색어가 표시됩니다 (최대 {MAX_STACK}개)
            </p>

            {/* 선택된 태그: flex-wrap */}
            <div
              className="mb-3 flex min-h-[2.75rem] flex-wrap gap-2 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/80 p-3"
              aria-label="선택된 기술 스택"
            >
              {selectedStacks.length === 0 ? (
                <span className="text-sm text-zinc-400">선택된 기술이 없습니다</span>
              ) : (
                selectedStacks.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1.5 text-sm font-semibold text-orange-800"
                  >
                    {name}
                    <button
                      type="button"
                      onClick={() => removeStack(name)}
                      className="ml-0.5 rounded-full p-0.5 text-orange-700 hover:bg-orange-200/80"
                      aria-label={`${name} 제거`}
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* 검색 입력 */}
            <div className="relative">
              <span
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                aria-hidden
              >
                🔍
              </span>
              <input
                type="search"
                value={stackQuery}
                onChange={(e) => setStackQuery(e.target.value)}
                placeholder="기술 이름을 검색하세요"
                autoComplete="off"
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                aria-label="기술 스택 검색"
              />
            </div>

            {/* 검색 결과 */}
            {stackQuery.trim().length > 0 && (
              <div
                className="mt-2 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
                role="listbox"
                aria-label="검색 결과"
              >
                {filteredCatalog.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-zinc-500">검색 결과가 없습니다</p>
                ) : (
                  <ul className="max-h-64 divide-y divide-zinc-100 overflow-y-auto">
                    {filteredCatalog.map((item) => {
                      const added = selectedSet.has(item.name);
                      const atLimit = selectedStacks.length >= MAX_STACK;
                      return (
                        <li key={item.name}>
                          <div
                            className={`flex items-center justify-between gap-3 px-3 py-2.5 sm:px-4 ${
                              added ? 'bg-orange-50/90' : 'bg-white'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-bold text-zinc-900">{item.name}</p>
                              <p className="truncate text-xs text-zinc-500">{item.category}</p>
                            </div>
                            <div className="shrink-0">
                              {added ? (
                                <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-700">
                                  추가됨
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  disabled={atLimit}
                                  onClick={() => addStack(item.name)}
                                  className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-lg font-medium text-zinc-600 transition-colors hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
                                  aria-label={`${item.name} 추가`}
                                >
                                  +
                                </button>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <div className="flex justify-end border-t border-zinc-100 bg-zinc-50/80 px-3 py-2 text-xs text-zinc-500">
                  {selectedStacks.length} / {MAX_STACK}개 선택됨
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            className="mt-10 w-full rounded-full bg-orange-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-colors hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          >
            완료
          </button>
          <button
            type="button"
            className="mt-4 w-full text-center text-sm font-medium text-zinc-500 underline-offset-2 hover:text-zinc-700 hover:underline"
          >
            나중에 설정하기
          </button>
        </div>
      </div>
    </div>
  );
}
