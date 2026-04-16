import SkillTetrisLogo from '../brand/SkillTetrisLogo';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';

export default function AppHeader() {
  const { isLoggedIn, logout } = useAuthStore();

  const handleKakaoLogin = () => {
    const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
    const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
    
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <SkillTetrisLogo />
        <nav className="flex items-center gap-2 sm:gap-3" aria-label="계정">
          {!isLoggedIn ? (
            <>
              <Button variant="primary" onClick={handleKakaoLogin}>
                로그인
              </Button>
              <Button variant="secondary" to="/mypage">
                마이페이지
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" to="/mypage">
                마이페이지
              </Button>
              <Button variant="primary" onClick={logout}>
                로그아웃
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
