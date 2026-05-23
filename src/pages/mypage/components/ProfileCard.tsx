import type { MyPageResponse } from '../../../types/mypage';
import { formatKoreanDate } from '../formatDate';

type ProfileCardProps = {
  data: Pick<MyPageResponse, 'nickname' | 'email' | 'joinedAt' | 'analysisCount'>;
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
    <section className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm shadow-zinc-900/5 sm:p-8">
      <div className="flex flex-col items-center text-center">
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-500 text-3xl font-bold text-white"
          aria-hidden
        >
          {initial}
        </div>
        <h1 className="mt-5 text-xl font-bold text-zinc-900">{data.nickname}</h1>
        <p className="mt-1 text-sm text-zinc-500">{data.email}</p>
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
      </dl>
    </section>
  );
}
