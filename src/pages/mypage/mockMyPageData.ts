import type { MyPageResponse } from '../../types/mypage';

/** 백엔드 미연동 시 개발 환경 UI 확인용 */
export const MOCK_MY_PAGE: MyPageResponse = {
  nickname: '김철익',
  email: 'chulick.kim@kakao.com',
  joinedAt: '2025-03-15T00:00:00+09:00',
  analysisCount: 3,
  analysisRecords: [
    {
      recordId: '8e2fd5b6-1bb6-4e21-9c48-1d22b7b50c2d',
      analysisType: 'resume_review',
      inputSummary: '프론트엔드 개발자 이력서 분석',
      result: '',
      createdAt: '2025-03-28T00:00:00+09:00',
      fileName: '이력서_김철익.pdf',
      tags: ['React', 'TypeScript', 'Next.js'],
    },
    {
      recordId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      analysisType: 'resume_review',
      inputSummary: '백엔드 개발자 포트폴리오 분석',
      result: '',
      createdAt: '2025-03-20T00:00:00+09:00',
      fileName: '포트폴리오_김철익.pdf',
      tags: ['Node.js', 'Python', 'SQL'],
    },
    {
      recordId: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210',
      analysisType: 'resume_review',
      inputSummary: '데이터 분석가 역량 진단',
      result: '',
      createdAt: '2025-03-10T00:00:00+09:00',
      fileName: '자기소개서_김철익.pdf',
      tags: ['Python', 'Pandas'],
    },
  ],
};
