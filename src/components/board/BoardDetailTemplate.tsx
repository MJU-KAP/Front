import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../apis/api';
import Toast from '../Toast';
import type { PurposeListResponse } from '../../types/calendar';
import { ensureSchedule, pickDomain } from '../../apis/studySchedule';

export interface BoardDetailData {
  id: string | number;
  title: string;
  host: string;
  dDay: string;
  thumbnailUrl?: string;
  period: string;
  recruitPeriod: string;
  tags: string[];
  description: string;
  originUrl: string;
  region: string;
  recruitCount: string | number;
  targetAudience?: string;
  deadlineDate?: string;
}

interface BoardDetailTemplateProps {
  category: string;
  data?: BoardDetailData;
}

type PurposeType = 'CERTIFICATION' | 'CONTEST' | 'INTERNSHIP' | 'ACTIVITY' | 'ETC';

interface ToastState {
  title: string;
  description?: string;
  icon?: string;
  type?: 'warning' | 'success' | 'info';
}

function getCategoryInfo(cat: string): { name: string; path: string; type: PurposeType } {
  switch (cat.toLowerCase()) {
    case 'activity':
    case 'activities':
      return { name: '대외활동', path: '/board/activities', type: 'ACTIVITY' };
    case 'contest':
    case 'competitions':
      return { name: '공모전', path: '/board/competitions', type: 'CONTEST' };
    case 'club':
    case 'clubs':
      return { name: '동아리', path: '/board/clubs', type: 'ACTIVITY' };
    default:
      return { name: '게시판', path: `/board/${cat}`, type: 'ETC' };
  }
}

// 오늘 자정 기준 D-Day (당일=0, 지남<0)
function calcDDay(dateStr: string): number {
  const target = new Date(dateStr).setHours(0, 0, 0, 0);
  const today = new Date().setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / 86400000);
}

export default function BoardDetailTemplate({ category, data }: BoardDetailTemplateProps) {
  const [goalSet, setGoalSet] = useState(false);        // 이 게시물이 목표인지
  const [hasAnyGoal, setHasAnyGoal] = useState(false);  // 다른 목표가 이미 있는지
  const [toastShow, setToastShow] = useState(false);
  const [toastState, setToastState] = useState<ToastState>({ title: '' });

  const { name: categoryName, path: basePath, type: purposeType } = getCategoryInfo(category);

  useEffect(() => {
    if (!data) return;
    api.get<PurposeListResponse>('/api/purposes')
      .then((res) => {
        setHasAnyGoal(res.data.items.length > 0);
        setGoalSet(res.data.items.some((p) => p.name === data.title));
      })
      .catch((e) => console.error('[Goal] GET /api/purposes 실패:', e));
  }, [data]);

  const showToast = (
    title: string,
    type: 'warning' | 'success' | 'info',
    description?: string,
    icon?: string,
  ) => {
    setToastState({ title, type, description, icon });
    setToastShow(true);
  };

  const handleSetGoal = async () => {
    if (!data) return;

    // 1) 이 게시물이 이미 목표
    if (goalSet) {
      showToast('이미 목표로 설정되어 있습니다', 'warning', '캘린더에서 확인해보세요', '⚠️');
      return;
    }
    // 2) 다른 목표가 이미 있음 — 하나만 허용
    if (hasAnyGoal) {
      showToast('다른 목표가 이미 설정되어 있습니다', 'warning', '하나의 목표만 설정할 수 있어요', '⚠️');
      return;
    }

    const raw = data.deadlineDate ?? data.recruitPeriod ?? '';
    const dateMatch = raw.match(/\d{4}-\d{2}-\d{2}/);
    const date = dateMatch
      ? dateMatch[0]
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    // 3) 오늘까지 마감(당일 포함)인 활동은 토스트로 차단
    if (calcDDay(date) <= 0) {
      showToast('목표로 설정할 수 없어요', 'warning', '마감일이 지난 활동이에요', '⏰');
      return;
    }

    const body = {
      name: data.title,
      date,
      link: data.originUrl ?? '',
      type: purposeType,
      goal: `${categoryName} 지원`,
    };

    try {
      const res = await api.post('/api/purposes', body);
      setGoalSet(true);
      setHasAnyGoal(true);
      showToast('목표로 설정했습니다', 'success', data.title, '🎯');

      const domain = pickDomain(...(data.tags ?? []));

      ensureSchedule(
        {
          purposeId: res.data.purposeId,
          name: res.data.name,
          goal: res.data.goal,
          date: res.data.date,
        },
        [],
        domain,
      ).catch((e) => console.error('[Schedule] 백그라운드 생성 실패:', e));
    } catch (e: unknown) {
      console.error('[Goal] POST /api/purposes 실패:', e);
      if (e && typeof e === 'object' && 'response' in e) {
        const err = e as { response?: { status: number; data: unknown } };
        console.error('[Goal] status:', err.response?.status);
        console.error('[Goal] data:', err.response?.data);
      }
      showToast('목표 설정에 실패했습니다', 'warning', '잠시 후 다시 시도해주세요', '❌');
    }
  };

  if (!data) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-[#f4f5f7] min-h-screen font-sans animate-pulse">
        <div className="w-40 h-4 bg-gray-200 rounded mb-6" />
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 mb-6">
          <div className="w-full md:w-72 h-48 bg-gray-200 rounded-xl flex-shrink-0" />
          <div className="flex flex-col justify-center flex-1 py-2">
            <div className="w-32 h-6 bg-gray-200 rounded-full mb-3" />
            <div className="w-3/4 h-8 bg-gray-200 rounded mb-4" />
          </div>
        </div>
      </div>
    );
  }

  const displayRecruitCount =
    data.recruitCount === '제한없음' || data.recruitCount === '0' || !data.recruitCount
      ? '제한없음'
      : `${data.recruitCount}명`;

  const formatDday = (dday: string) => {
    if (dday === 'D-Day') return '오늘 마감';
    if (dday === '마감됨') return '모집 종료';
    return `${dday.replace('D-', '')}일`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#f4f5f7] min-h-screen font-sans">

      {/* 브레드크럼 */}
      <div className="text-sm text-gray-500 mb-6 flex items-center gap-2.5">
        <Link to={basePath} className="hover:text-gray-800 hover:underline transition-colors">
          {categoryName}
        </Link>
        <span className="text-gray-300 text-xs">{'>'}</span>
        <span className="font-semibold text-gray-800 line-clamp-1">{data.title}</span>
      </div>

      {/* 헤더 */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 mb-6">
        <div className="w-full md:w-72 h-48 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden border border-gray-50">
          {data.thumbnailUrl ? (
            <img src={data.thumbnailUrl} alt={data.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              이미지 없음
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap gap-2 mb-3">
            {data.tags?.map(tag => (
              <span key={tag} className="px-3 py-1 bg-orange-50 text-orange-500 text-xs font-bold rounded-full border border-orange-100">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-3 text-gray-900">{data.title}</h1>
          <div className="flex flex-col gap-2 text-sm text-gray-500 mt-2">
            <span className="flex items-center gap-1.5">
              <span className="w-12 text-gray-400">주최</span>
              {data.host}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-12 text-gray-400">활동</span>
              {data.period}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* 좌측 본문 */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4 text-gray-900">상세 소개</h2>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{data.description}</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-6 text-gray-900">상세 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 text-sm">
              <div>
                <p className="text-gray-400 mb-1">모집 기간</p>
                <p className="font-medium text-gray-800">{data.recruitPeriod}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">모집 인원</p>
                <p className="font-medium text-gray-800">{displayRecruitCount}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">진행 장소</p>
                <p className="font-medium text-gray-800">{data.region || '상세 공고 참조'}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">카테고리</p>
                <p className="font-medium text-gray-800">{categoryName}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-6 text-gray-900">지원 자격 및 요구사항</h2>
            <div className="mb-8">
              <p className="text-xs text-gray-400 mb-3">우대 기술 스택</p>
              <div className="flex flex-wrap gap-2">
                {data.tags?.map(tag => (
                  <span key={tag} className="px-4 py-1.5 bg-orange-50 text-orange-600 text-xs font-medium rounded-full border border-orange-100/50">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-4">지원 조건</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="text-orange-500 text-xs mt-0.5">○</span>
                  <span>
                    {data.region && data.region !== '정보 없음'
                      ? `${data.region} 지역 오프라인 활동 가능자`
                      : '활동 지역 상세 공고 참조'}
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="text-orange-500 text-xs mt-0.5">○</span>
                  <span>{data.targetAudience || '모집 대상 상세 공고 참조'}</span>
                </li>
                {data.tags && data.tags.length > 0 && (
                  <li className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="text-orange-500 text-xs mt-0.5">○</span>
                    <span>{data.tags.join(', ')} 관련 지식 및 프로젝트 경험 우대</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* 우측 사이드바 */}
        <div className="w-full lg:w-[320px] flex-shrink-0">
          <div className="sticky top-6 flex flex-col gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-sm text-gray-500 font-medium">모집인원</span>
                  <span className="text-xl font-bold text-orange-500">{displayRecruitCount}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-sm text-gray-500 font-medium">남은기간</span>
                  <span className="text-xl font-bold text-orange-500">{formatDday(data.dDay)}</span>
                </div>
              </div>

              {/* 목표 설정 버튼 — goalSet일 때만 비활성, 나머지는 눌러서 토스트로 안내 */}
              <button
                type="button"
                onClick={handleSetGoal}
                disabled={goalSet}
                className={[
                  'w-full py-3 rounded-xl text-sm font-bold transition-all mb-3',
                  goalSet
                    ? 'bg-orange-100 text-orange-500 cursor-default'
                    : 'bg-white border border-orange-300 text-orange-500 hover:bg-orange-500 hover:text-white hover:border-orange-500',
                ].join(' ')}
              >
                {goalSet ? '✓ 목표로 설정됨' : '🎯 목표로 설정하기'}
              </button>

              <button
                type="button"
                onClick={() => window.open(data.originUrl, '_blank', 'noopener,noreferrer')}
                className="block w-full py-4 bg-orange-500 text-white text-center font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
              >
                공식 홈페이지 지원하기
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold mb-4 text-gray-900">주최 기관</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-500 font-bold">
                  {data.host.substring(0, 1)}
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-800">{data.host}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">정식 등록 주최기관</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toast
        show={toastShow}
        onClose={() => setToastShow(false)}
        title={toastState.title}
        description={toastState.description}
        icon={toastState.icon}
        type={toastState.type}
      />
    </div>
  );
}