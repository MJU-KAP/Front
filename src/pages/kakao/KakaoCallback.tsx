import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function KakaoCallback() {
  // const navigate = useNavigate();

  const { login } = useAuthStore();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');

    if (code) {
      console.log('카카오 인가 코드 획득 완료:', code);
      
      // 추후 api 연동 자리:
      // api.post('/api/auth/kakao', { code }).then(res => login(res.data.accessToken)) ...
      
      // 백엔드 연동 전이라 가짜 토큰을 넣어 강제로 로그인 상태로 만듭니다.
      const dummyToken = 'kakao-temp-token-12345';
      login(dummyToken);

      setTimeout(() => {
        window.location.href = '/'; 
      }, 1500);
    }
  }, [login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
      <div className="flex flex-col items-center gap-6">
        {/* 로딩 스피너 UI */}
        <div className="w-12 h-12 border-4 border-zinc-700 border-t-orange-500 rounded-full animate-spin"></div>
        <div className="text-center">
          <p className="text-lg font-semibold">카카오 로그인 처리 중입니다</p>
          <p className="text-zinc-500 text-sm mt-2">잠시만 기다려주세요...</p>
        </div>
      </div>
    </div>
  );
}