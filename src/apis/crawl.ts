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

// D-Day 계산
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

export const fetchBoardItems = async (targetCategory: string): Promise<BoardItem[]> => {
  const response = await api.get('/api/crawl');
  const rawItems: RawCrawlItem[] = response.data?.items || response.data?.data || [];

  return rawItems
    .filter((item) => item.category === targetCategory)
    .map((item) => ({
      id: item.extId,
      title: item.title || '제목 없음',
      host: item.companyType || '주최자 정보 없음',
      dDay: calculateDday(item.recruitEndDate),
      thumbnailUrl: item.imageUri,
      mainTags: item.requiredSkills && item.requiredSkills.length > 0 
        ? item.requiredSkills.slice(0, 2) 
        : undefined,
    }));
};

export const fetchBoardDetail = async (id: string): Promise<BoardDetailData | null> => {
  const response = await api.get('/api/crawl');
  const rawItems: RawCrawlItem[] = response.data?.items || response.data?.data || [];
  
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
};