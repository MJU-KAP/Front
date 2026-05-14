import { Link } from 'react-router-dom';

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
}

interface BoardDetailTemplateProps {
  category: string;
  data?: BoardDetailData;
}

export default function BoardDetailTemplate({ category, data }: BoardDetailTemplateProps) {
  const basePath = `/board/${category}`;
  const categoryName = 
    category === 'activities' ? '대외활동' : 
    category === 'competitions' ? '공모전' : '동아리';

  if (!data) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-[#f4f5f7] min-h-screen font-sans animate-pulse">
        <div className="w-40 h-4 bg-gray-200 rounded mb-6"></div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 mb-6">
          <div className="w-full md:w-72 h-48 bg-gray-200 rounded-xl flex-shrink-0"></div>
          <div className="flex flex-col justify-center flex-1 py-2">
            <div className="w-32 h-6 bg-gray-200 rounded-full mb-3"></div>
            <div className="w-3/4 h-8 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  // 데이터 가공 로직
  const displayRecruitCount = 
    data.recruitCount === '제한없음' || data.recruitCount === '0' || !data.recruitCount
      ? '제한없음' 
      : `${data.recruitCount}명`;

  const formatDday = (dday: string) => {
    if (dday === 'D-Day') return '오늘 마감';
    if (dday === '마감됨') return '모집 종료';
    return dday.replace('D-', '') + '일';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#f4f5f7] min-h-screen font-sans">
      
      {/* 네비게이션 경로 */}
      <div className="text-sm text-gray-500 mb-6 flex items-center gap-2.5">
        <Link to={basePath} className="hover:text-gray-800 hover:underline transition-colors">
          {categoryName}
        </Link>
        <span className="text-gray-300 text-xs">&gt;</span>
        <span className="font-semibold text-gray-800 line-clamp-1">{data.title}</span>
      </div>

      {/* 상단 헤더 박스 */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 mb-6">
        <div className="w-full md:w-72 h-48 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden border border-gray-50">
          {data.thumbnailUrl ? (
            <img src={data.thumbnailUrl} alt={data.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">이미지 없음</div>
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
            <span className="flex items-center gap-1.5"><span className="w-12 text-gray-400">주최</span> {data.host}</span>
            <span className="flex items-center gap-1.5"><span className="w-12 text-gray-400">활동</span> {data.period}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 좌측 콘텐츠 영역 */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4 text-gray-900">상세 소개</h2>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{data.description}</div>
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
                <p className="font-medium text-gray-800">{data.region || "상세 공고 참조"}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">카테고리</p>
                <p className="font-medium text-gray-800">{categoryName}</p>
              </div>
            </div>
          </div>

          {/* 지원 자격 및 요구사항 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-6 text-gray-900">지원 자격 및 요구사항</h2>
            
            <div className="mb-8">
              <p className="text-xs text-gray-400 mb-3">우대 기술 스택</p>
              <div className="flex flex-wrap gap-2">
                {data.tags?.map(tag => (
                  <span key={tag} className="px-4 py-1.5 bg-orange-50 text-orange-600 text-xs font-medium rounded-full border border-orange-100/50">{tag}</span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-4">지원 조건</p>
              <ul className="space-y-4">
                {/* 지역 */}
                <li className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="text-orange-500 text-xs mt-0.5">○</span>
                  <span>{data.region && data.region !== "정보 없음" ? `${data.region} 지역 오프라인 활동 가능자` : "활동 지역 상세 공고 참조"}</span>
                </li>
                {/* 대상 */}
                <li className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="text-orange-500 text-xs mt-0.5">○</span>
                  <span>{data.targetAudience || '모집 대상 상세 공고 참조'}</span>
                </li>
                {/* 우대 기술 */}
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
              
              {/* 정보 영역: 형식 통일 */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-sm text-gray-500 font-medium">모집인원</span>
                  <span className="text-xl font-bold text-orange-500">{displayRecruitCount}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-sm text-gray-500 font-medium">남은기간</span>
                  <span className="text-xl font-bold text-orange-500">{formatDday(data.dDay)}</span>
                </div>
              </div>
              
              <a 
                href={data.originUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block w-full py-4 bg-orange-500 text-white text-center font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
              >
                공식 홈페이지 지원하기
              </a>
            </div>

            {/* 주최 기관 정보 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold mb-4 text-gray-900">주최 기관</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-500 font-bold">{data.host.substring(0, 1)}</div>
                <div>
                  <p className="font-bold text-sm text-gray-800">{data.host}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">정식 등록 주최기관</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}