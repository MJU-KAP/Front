import { api } from './api';
import type {
  SaveUserPreferencesRequest,
  SaveUserPreferencesResponse,
} from '../types/profile';

export async function saveUserPreferences(
  payload: SaveUserPreferencesRequest
): Promise<SaveUserPreferencesResponse> {
  const { data } = await api.post<SaveUserPreferencesResponse>(
    '/api/users/me/preferences',
    payload
  );
  return data;
}
