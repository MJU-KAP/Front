import { useState, useEffect, type JSX } from 'react';
import { fetchJobTrends, type JobTrendData } from '../apis/jobs';

export interface ProcessedJobRole extends JobTrendData {
  rank: string;
  badge: string;
  active: boolean;
  countStr: string; 
  icon: JSX.Element;
}

// 명시된 26개 직군 중 대표적인 것들에 대한 아이콘 매핑
const ROLE_ICONS: Record<string, JSX.Element> = {
  'Frontend': <path d="M3 4h18v12H3V4zm2 2v8h14V6H5zm5 12h4v2h-4v-2z"/>,
  'Backend': <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm0 10a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM6 6h12v2H6V6zm0 10h12v2H6v-2z"/>,
  'Full Stack': <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z"/>,
  'DevOps': <path d="M19 11a5.002 5.002 0 00-9.67-.89A4.004 4.004 0 006 18h13a4 4 0 000-8h-1l.001-.001C19 11 19 11 19 11z"/>,
  'AI Engineer': <path d="M12 2a5 5 0 00-5 5v1H6a2 2 0 00-2 2v2a2 2 0 002 2h1v1a5 5 0 0010 0v-1h1a2 2 0 002-2v-2a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 5a3 3 0 016 0v1H9V7zM6 10h12v2H6v-2zm3 5a3 3 0 006 0v-1H9v1z"/>,
  'Data Engineer': <path d="M12 3c-4.97 0-9 1.79-9 4s4.03 4 9 4 9-1.79 9-4-4.03-4-9-4zm0 6c-3.87 0-7.22-1.06-8.56-2.69.83-.9 3.01-1.81 5.4-2.18l1.32 2.65L12 8.5l1.84-2.28 1.32-2.65c2.39.37 4.57 1.28 5.4 2.18C19.22 7.94 15.87 9 12 9zm0 5c-4.97 0-9-1.79-9-4v2c0 2.21 4.03 4 9 4s9-1.79 9-4v-2c0 2.21-4.03 4-9 4z"/>,
  'Android Developer': <path d="M17.6 9.48l1.84-3.18c.16-.28.06-.63-.22-.79-.28-.16-.63-.06-.79.22L16.55 9A10.84 10.84 0 0012 8c-1.63 0-3.18.36-4.55.99L5.57 5.73c-.16-.28-.51-.38-.79-.22-.28.16-.38.51-.22.79l1.84 3.18A10.84 10.84 0 002 18h20c0-3.66-1.75-6.9-4.4-8.52zM7 15.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm10 0c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z"/>,
  'iOS Developer': <path d="M15.5 2.5c.8-1 2.1-1.6 3.5-1.5-.1 1.4-.7 2.8-1.7 3.8-.8.9-2.1 1.5-3.4 1.5.1-1.4.7-2.7 1.6-3.8zM12.5 21.5c-1.5 0-2.8-.8-4.3-.8-1.4 0-2.8.8-4 1.2-1.7.5-3.5 0-4.8-1.5-1.5-1.8-2.5-4.5-2.5-7 0-3 1.8-5.5 4.5-6.5 1.4-.5 2.8 0 4 .5 1 .5 2 1 3.2 1 1.4 0 2.8-.5 4.5-1.5 2.5-1.2 5 0 6.2 2 .5.8 1 2 1 3.5 0 3-1.8 5.5-4.5 6.5-1.2.5-2.5 1-3.3 2.5z"/>,
  'Game Developer': <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3c-.83 0-1.5-.67-1.5-1.5S17.67 6 18.5 6s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
};

const DEFAULT_ICON = <path d="M12 2L2 22h20L12 2z"/>;

// 더미 데이터
const FALLBACK_DUMMY_DATA: JobTrendData[] = [
  { id: 1, title: 'Frontend', count: 4230 },
  { id: 2, title: 'Backend', count: 3850 },
  { id: 3, title: 'AI and Data Scientist', count: 2100 },
  { id: 4, title: 'Data Analyst', count: 1800 },
  { id: 5, title: 'DevSecOps', count: 1540 },
];

// 직군 이름을 기반으로 상위 카테고리 아이콘을 찾아주는 헬퍼 함수
const getIconForRole = (title: string): JSX.Element => {
  // 정확히 일치하는 키가 있으면 바로 반환
  if (ROLE_ICONS[title]) return ROLE_ICONS[title];

  // 없으면 소문자로 변환하여 키워드 포함 여부로 대표 아이콘 매핑
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('ai') || lowerTitle.includes('machine learning') || lowerTitle.includes('mlops')) {
    return ROLE_ICONS['AI Engineer'];
  }
  if (lowerTitle.includes('data') || lowerTitle.includes('bi analyst')) {
    return ROLE_ICONS['Data Engineer'];
  }
  if (lowerTitle.includes('game')) {
    return ROLE_ICONS['Game Developer'];
  }
  if (lowerTitle.includes('security') || lowerTitle.includes('secops')) {
    return ROLE_ICONS['DevOps']; 
  }
  if (lowerTitle.includes('android')) {
    return ROLE_ICONS['Android Developer'];
  }
  if (lowerTitle.includes('ios')) {
    return ROLE_ICONS['iOS Developer'];
  }

  // 매핑되는 것이 전혀 없으면 기본 아이콘 반환
  return DEFAULT_ICON;
};

export const useJobTrends = () => {
  const [trendingRoles, setTrendingRoles] = useState<ProcessedJobRole[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsFetching(true);
        let rawData: JobTrendData[] = [];

        try {
          // API 호출 시도
          const apiData = await fetchJobTrends();
          
          // API에서 정상적으로 데이터를 받아오면 상위 5개를 사용
          if (apiData && apiData.length > 0) {
            rawData = apiData.slice(0, 5);
          } else {
            // 빈 배열이 오면 더미 데이터 폴백
            rawData = FALLBACK_DUMMY_DATA;
          }
        } catch (apiError) {
          // 서버 통신 에러 발생 시 더미 데이터 폴백
          console.warn('API 연동 실패, 더미 데이터를 표시합니다.', apiError);
          rawData = FALLBACK_DUMMY_DATA;
        }
        
        // 데이터 가공 및 아이콘 매핑 적용
        const processedData: ProcessedJobRole[] = rawData.map((item, index) => {
          return {
            ...item,
            rank: `#${index + 1}`,
            badge: index === 0 ? 'BEST' : '',
            active: index === 0,
            countStr: `${item.count.toLocaleString()}건 채용 중`,
            icon: getIconForRole(item.title),
          };
        });

        setTrendingRoles(processedData);
      } catch (error) {
        console.error('화면 데이터를 구성하는데 실패했습니다.', error);
      } finally {
        setIsFetching(false);
      }
    };

    loadData();
  }, []);

  return { trendingRoles, isFetching };
};