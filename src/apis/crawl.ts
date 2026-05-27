import { api } from './api';
import type { BoardItem } from '../components/board/BoardCard';
import type { BoardDetailData } from '../components/board/BoardDetailTemplate';

export interface RawCrawlItem {
  extId: number | string;
  category: string;
  title: string;
  companyType?: string;
  recruitEndDate?: string;
  recruitStartDate?: string;
  imageUri?: string;
  activityStartDate?: string;
  activityEndDate?: string;
  requiredSkills?: string[];
  result?: string;
  description?: string;
  originUrl?: string;
  homepageUrl?: string;
  activityRegion?: string;
  recruitCount?: string | number;
}

export interface PaginatedResponse {
  count: number;
  items: RawCrawlItem[];
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
}

export interface FetchBoardItemsResult {
  items: BoardItem[];
  hasNext: boolean;
  totalCount: number;
}

const calculateDday = (endDateStr?: string) => {
  if (!endDateStr) return 'D-?';
  try {
    const endDate = new Date(endDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return '마감됨';
    if (diffDays === 0) return 'D-Day';
    return `D-${diffDays}`;
  } catch {
    return 'D-?';
  }
};

export const fetchBoardItems = async (
  targetCategory: string,
  page: number = 1,
  size: number = 30,
  sort: string = 'deadline'
): Promise<FetchBoardItemsResult> => {
  const response = await api.get<PaginatedResponse>('/api/crawl', {
    params: {
      category: targetCategory,
      page: page,
      size: size,
      sort: sort
    }
  });

  const data = response.data;
  const rawItems = data.items || [];

  const items = rawItems.map((item) => ({
    id: item.extId,
    title: item.title || '제목 없음',
    host: item.companyType || '주최자 정보 없음',
    dDay: calculateDday(item.recruitEndDate),
    thumbnailUrl: item.imageUri,
    mainTags: item.requiredSkills && item.requiredSkills.length > 0 
      ? item.requiredSkills.slice(0, 2) 
      : undefined,
  }));

  return {
    items,
    hasNext: data.hasNext,
    totalCount: data.totalCount
  };
};

export const fetchBoardDetail = async (id: string, targetCategory: string): Promise<BoardDetailData | null> => {
  try {
    const response = await api.get<PaginatedResponse>('/api/crawl', {
      params: {
        category: targetCategory,
        page: 1,
        size: 1000, 
      }
    });
    
    const rawItems = response.data?.items || [];
    const foundItem = rawItems.find((item) => String(item.extId) === id);
    
    if (!foundItem) return null;

    return {
      id: foundItem.extId,
      title: foundItem.title || '제목 없음',
      host: foundItem.companyType || '주최자 정보 없음',
      dDay: calculateDday(foundItem.recruitEndDate),
      thumbnailUrl: foundItem.imageUri,
      period: `${foundItem.activityStartDate || ''} ~ ${foundItem.activityEndDate || ''}`,
      recruitPeriod: `${foundItem.recruitStartDate || ''} ~ ${foundItem.recruitEndDate || ''}`,
      tags: foundItem.requiredSkills || [],
      description: foundItem.result || foundItem.description || '상세 정보가 없습니다.',
      originUrl: foundItem.originUrl || foundItem.homepageUrl || '',
      region: foundItem.activityRegion || '정보 없음',
      recruitCount: foundItem.recruitCount || '제한없음',
    };
  } catch (error) {
    console.error('상세 정보 조회 실패:', error);
    return null;
  }
};