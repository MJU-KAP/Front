import { api } from './api';
import type { MyPageResponse } from '../types/mypage';

export async function fetchMyPage(): Promise<MyPageResponse> {
  const { data } = await api.get<MyPageResponse>('/api/users/me');
  return data;
}
