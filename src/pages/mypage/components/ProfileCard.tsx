import { Link } from 'react-router-dom';
import type { MyPageResponse } from '../../../types/mypage';
import { formatKoreanDate } from '../formatDate';

type ProfileCardProps = {
  // desiredJobRole과 techStacks를 Pick에 추가합니다.
  data: Pick<
    MyPageResponse,
    'nickname' | 'email' | 'joinedAt' | 'analysisCount' | 'desiredJobRole' | 'techStacks'
  >;
};

function KakaoBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-800">
      <span
        className="flex h-5 w-5 items-center justify-center rounded-md bg-[#FEE500] text-[10px] font-black text-[#3C1E1E]"
        aria-hidden
      >
        K
      </span>
      카카오톡
    </span>
  );
}

export default function ProfileCard({ data }: ProfileCardProps) {
  const initial = data.nickname.trim().charAt(0) || '?';

  return (
    <section className="relative rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm shadow-zinc-900/5 sm:p-8">
      {/* 수정하기 버튼 추가 (ProfileSetupPage로 이동) */}
      <div className="absolute right-6 top-6">
        <Link
          to="/profile-setup"
          className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
        >
          수정
        </Link>
      </div>

      <div className="flex flex-col items-center text-center">
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-500 text-3xl font-bold text-white"
          aria-hidden
        >
          {initial}
        </div>
        <h1 className="mt-5 text-xl font-bold text-zinc-900">{data.nickname}</h1>
        <p className="mt-1 text-sm text-zinc-500">{data.email || '이메일 없음'}</p>
      </div>

      <dl className="mt-8 space-y-4 border-t border-zinc-100 pt-6">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-sm text-zinc-500">로그인 방법</dt>
          <dd>
            <KakaoBadge />
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-sm text-zinc-500">가입일</dt>
          <dd className="text-sm font-semibold text-zinc-900">{formatKoreanDate(data.joinedAt)}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-sm text-zinc-500">분석 횟수</dt>
          <dd className="text-sm font-semibold text-zinc-900">
            <span className="text-orange-500">{data.analysisCount}</span>회
          </dd>
        </div>

        {/* 희망 직군 표시 구역 */}
        <div className="flex flex-col gap-1 border-t border-zinc-50 pt-4">
          <dt className="text-sm text-zinc-500">희망 직군</dt>
          <dd className="text-sm font-semibold text-zinc-900">
            {data.desiredJobRole || '미설정'}
          </dd>
        </div>

        {/* 기술 스택 표시 구역 */}
        <div className="flex flex-col gap-2 border-t border-zinc-50 pt-4">
          <dt className="text-sm text-zinc-500">기술 스택</dt>
          <dd className="flex flex-wrap gap-1.5">
            {!data.techStacks || data.techStacks.length === 0 ? (
              <span className="text-sm text-zinc-400">등록된 기술 스택이 없습니다.</span>
            ) : (
              data.techStacks.map((stack) => (
                <span
                  key={stack}
                  className="inline-flex items-center rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700"
                >
                  {stack}
                </span>
              ))
            )}
          </dd>
        </div>
      </dl>
    </section>
  );
}