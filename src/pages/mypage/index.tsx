import { isAxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import {
  deleteAnalysisResult,
  fetchMyPage,
} from '../../apis/userApi';
import { Button } from '../../components/ui/Button';
import Toast from '../../components/Toast';
import type { MyPageResponse } from '../../types/mypage';
import AnalysisHistoryCard from './components/AnalysisHistoryCard';
import ProfileCard from './components/ProfileCard';
import { MOCK_MY_PAGE } from './mockMyPageData';

export default function MyPage() {
  const [data, setData] = useState<MyPageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingRecordId, setDeletingRecordId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    show: boolean;
    title: string;
    description?: string;
    type?: 'warning' | 'success' | 'info';
    icon?: string;
  }>({
    show: false,
    title: '',
  });

  const closeToast = () => setToast((prev) => ({ ...prev, show: false }));

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

  const getDeleteErrorMessage = (error: unknown) => {
    if (!isAxiosError(error)) {
      return '삭제 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    }

    const status = error.response?.status;
    if (status === 401) {
      return '로그인이 만료되었습니다. 다시 로그인해 주세요.';
    }
    if (status === 403) {
      return '본인 분석 기록만 삭제할 수 있습니다.';
    }
    if (status === 404) {
      return '이미 삭제되었거나 존재하지 않는 분석 기록입니다.';
    }
    return '분석 기록 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.';
  };

  const handleDeleteRecord = useCallback(
    async (recordId: string) => {
      if (deletingRecordId) return;

      const confirmed = window.confirm(
        '분석 기록을 삭제하시겠어요?\n삭제한 기록은 복구할 수 없습니다.'
      );
      if (!confirmed) return;

      setDeletingRecordId(recordId);
      try {
        await deleteAnalysisResult(recordId);
        setData((prev) => {
          if (!prev) return prev;
          const nextRecords = prev.analysisRecords.filter(
            (record) => record.recordId !== recordId
          );
          return {
            ...prev,
            analysisRecords: nextRecords,
            analysisCount: nextRecords.length,
          };
        });
        setToast({
          show: true,
          title: '분석 기록이 삭제되었습니다.',
          type: 'success',
          icon: '✅',
        });
      } catch (deleteError) {
        setToast({
          show: true,
          title: '삭제에 실패했습니다.',
          description: getDeleteErrorMessage(deleteError),
          type: 'warning',
          icon: '⚠️',
        });
      } finally {
        setDeletingRecordId(null);
      }
    },
    [deletingRecordId]
  );

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
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

              {!data.analysisRecords || data.analysisRecords.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-zinc-200 bg-white px-6 py-12 text-center text-sm text-zinc-500">
                  아직 AI 분석 기록이 없습니다.
                </p>
              ) : (
                <ul className="space-y-4">
                  {data.analysisRecords.map((record) => (
                    <li key={record.recordId}>
                      <AnalysisHistoryCard
                        record={record}
                        onDelete={handleDeleteRecord}
                        isDeleting={deletingRecordId === record.recordId}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </main>
      <Toast
        show={toast.show}
        onClose={closeToast}
        title={toast.title}
        description={toast.description}
        type={toast.type}
        icon={toast.icon}
      />
    </div>
  );
}