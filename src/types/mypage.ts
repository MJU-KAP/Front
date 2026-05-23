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

export type MyPageResponse = {
  nickname: string;
  email: string;
  joinedAt: string;
  analysisCount: number;
  analysisRecords: AnalysisRecord[];
};
