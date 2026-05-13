import { api } from './api';

export const testCrawlingApi = async () => {
  try {
    const response = await api.get('/api/crawl');
    
    console.log('--- 크롤링 API 테스트 성공 ---');
    console.log('크롤링 수행 시간:', response.data.crawledAt);
    console.log('크롤링된 항목 수:', response.data.count);
    console.table(response.data.items);
    
  } catch (error) {
    console.error('--- 크롤링 API 테스트 실패 ---');
    console.error('에러 상세:', error);
  }
};