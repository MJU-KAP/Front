import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyPage } from '../../apis/userApi';
import NextPlanLogo from '../../components/brand/NextPlanLogo';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import type { MyPageResponse } from '../../types/mypage';
import AnalysisHistoryCard from './components/AnalysisHistoryCard';
import ProfileCard from './components/ProfileCard';
import { MOCK_MY_PAGE } from './mockMyPageData';

export default function MyPage() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [data, setData] = useState<MyPageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchMyPage();
      setData(response);
    } catch {
      if (import.meta.env.DEV) {
        setData(MOCK_MY_PAGE);
      } else {
        setError('마이페이지 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <NextPlanLogo />
          <Button variant="primary" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {loading && (
          <p className="py-20 text-center text-sm text-zinc-500" role="status">
            마이페이지를 불러오는 중…
          </p>
        )}

        {!loading && error && (
          <div className="py-20 text-center">
            <p className="text-sm text-zinc-600">{error}</p>
            <Button variant="primary" className="mt-4" onClick={() => void load()}>
              다시 시도
            </Button>
          </div>
        )}

        {!loading && data && (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-10">
            <ProfileCard data={data} />

            <section aria-labelledby="analysis-history-heading">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                <h2 id="analysis-history-heading" className="text-lg font-bold text-zinc-900 sm:text-xl">
                  AI 분석 기록
                </h2>
                <p className="text-sm text-zinc-500">총 {data.analysisCount}건</p>
              </div>

              {data.analysisRecords.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-zinc-200 bg-white px-6 py-12 text-center text-sm text-zinc-500">
                  아직 AI 분석 기록이 없습니다.
                </p>
              ) : (
                <ul className="space-y-4">
                  {data.analysisRecords.map((record) => (
                    <li key={record.recordId}>
                      <AnalysisHistoryCard record={record} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
