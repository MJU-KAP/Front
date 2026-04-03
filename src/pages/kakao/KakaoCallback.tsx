import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

export default function KakaoCallback() {
  // const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');

    if (code) {
      console.log('카카오 인가 코드 획득 완료:', code);
      
      // 추후 api 연동 자리
      // 현재는 임시로 1.5초 뒤에 메인 페이지로 돌려보냅니다.
      setTimeout(() => {
        window.location.href = '/'; 
      }, 1500);
    }
  }, []);

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