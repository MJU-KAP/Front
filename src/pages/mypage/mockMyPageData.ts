import type { MyPageResponse } from '../../types/mypage';

/* 백엔드 미연동 시 개발 환경 UI 확인용 */
export const MOCK_MY_PAGE: MyPageResponse = {
  nickname: '김철익',
  email: 'chulick.kim@kakao.com',
  joinedAt: '2025-03-15T00:00:00+09:00',
  desiredJobRole: 'Frontend',
  techStacks: ['React', 'TypeScript', 'Next.js'],
  analysisCount: 3,
  resumes: [],
  analysisRecords: [
    {
      recordId: '8e2fd5b6-1bb6-4e21-9c48-1d22b7b50c2d',
      analysisType: 'RESUME',
      inputSummary: 'Frontend 이력서 분석',
      fileName: '이력서_김철익.pdf',
      tags: ['React', 'TypeScript', 'Next.js'],
      createdAt: '2025-03-28T00:00:00+09:00',
    },
    {
      recordId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      analysisType: 'RESUME',
      inputSummary: 'Backend 이력서 분석',
      fileName: '포트폴리오_김철익.pdf',
      tags: ['Node.js', 'Python', 'SQL'],
      createdAt: '2025-03-20T00:00:00+09:00',
    },
    {
      recordId: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210',
      analysisType: 'RESUME',
      inputSummary: 'Data 이력서 분석',
      fileName: null,
      tags: ['Python', 'Pandas'],
      createdAt: '2025-03-10T00:00:00+09:00',
    },
  ],
};