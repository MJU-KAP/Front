export type AnalysisRecord = {
  recordId: string;
  analysisType: string;
  inputSummary: string;
  result: string;
  createdAt: string;
  /** API 확장 전 UI용 (선택) */
  fileName?: string;
  tags?: string[];
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
  analysisCount: number;
  resumes: Resume[];
  analysisRecords: AnalysisRecord[];
  
  // 새로 추가된 프로필 설정 필드
  desiredJobRole: string | null;
  techStacks: string[];
};