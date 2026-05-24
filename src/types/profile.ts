export interface SaveUserPreferencesRequest {
  desiredJobRole: string;
  techStacks: string[];
}

export interface SaveUserPreferencesResponse {
  message: string;
}
