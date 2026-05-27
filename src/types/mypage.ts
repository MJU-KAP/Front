export type AnalysisRecord = {
  recordId: string;
  analysisType: string;
  /** 카드 1번째 줄. BE가 "{직군} 이력서 분석" 형태의 라벨로 내려줌 */
  inputSummary: string;
  /** 카드 2번째 줄에 표시할 대표 파일명 (없을 수 있음) */
  fileName: string | null;
  /** 카드 하단 칩으로 표시할 태그 목록 (최대 3개) */
  tags: string[];
  createdAt: string;
};

export type Resume = {
  resumeId: number;
  fileName: string;
  fileUrl: string;
};

export type MyPageResponse = {
  nickname: string;
  email: string | null;
  joinedAt: string;
  desiredJobRole: string | null;
  techStacks: string[];
  analysisCount: number;
  resumes: Resume[];
  analysisRecords: AnalysisRecord[];
};
