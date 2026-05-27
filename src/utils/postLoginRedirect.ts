const STORAGE_KEY = 'postLoginRedirect';

function isSafeRedirectPath(path: string): boolean {
  return (
    path.startsWith('/') &&
    !path.startsWith('//') &&
    path !== '/login' &&
    !path.startsWith('/auth/')
  );
}

/** 카카오 OAuth 라운드트립 후 복귀할 경로 저장 */
export function savePostLoginRedirect(path: string): void {
  if (isSafeRedirectPath(path)) {
    sessionStorage.setItem(STORAGE_KEY, path);
  }
}

export function peekPostLoginRedirect(): string | null {
  const path = sessionStorage.getItem(STORAGE_KEY);
  return path && isSafeRedirectPath(path) ? path : null;
}

export function consumePostLoginRedirect(): string | null {
  const path = peekPostLoginRedirect();
  sessionStorage.removeItem(STORAGE_KEY);
  return path;
}
