import { useAuthStore } from '../../../store/authStore';

export default function KakaoLoginButton() {
  const { isLoggedIn, logout } = useAuthStore();

  const handleKakaoLogin = () => {
    const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
    const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
    
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    window.location.href = KAKAO_AUTH_URL;
  };

  // 로그인 상태일 때: 로그아웃 버튼 보여주기
  if (isLoggedIn) {
    return (
      <button 
        onClick={logout}
        className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-colors shadow-lg shadow-black/10"
      >
        로그아웃
      </button>
    );
  }

  // 비로그인 상태일 때: 기존 카카오 로그인 버튼 보여주기
  return (
    <button 
      onClick={handleKakaoLogin}
      className="flex items-center gap-2 bg-[#FEE500] hover:bg-[#FDD800] text-[#000000] px-5 py-2.5 rounded-full font-bold text-sm transition-colors shadow-lg shadow-black/10"
    >
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3c-5.523 0-10 3.535-10 7.896 0 2.825 1.848 5.305 4.675 6.643l-1.196 4.394c-.086.315.265.556.53.376l5.127-3.41c.28.02.565.032.854.032 5.523 0 10-3.535 10-7.896C22 6.535 17.523 3 12 3z"/>
      </svg>
      카카오 로그인
    </button>
  );
}