import { api } from './api';
import type { MyPageResponse } from '../types/mypage';

export async function fetchMyPage(): Promise<MyPageResponse> {
  const { data } = await api.get<MyPageResponse>('/api/users/me');
  return data;
}

export type DeleteAnalysisResultResponse = {
  message: string;
};

export async function deleteAnalysisResult(
  analysisId: string
): Promise<DeleteAnalysisResultResponse> {
  const { data } = await api.delete<DeleteAnalysisResultResponse>(
    `/api/analyze/result/${analysisId}`
  );
  return data;
}
