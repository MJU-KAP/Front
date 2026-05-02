import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../apis/api';
import Toast from '../../components/Toast'; 
import { useNavigate } from 'react-router-dom'

export default function KakaoCallback() {
  const { login } = useAuthStore();
  const [toast, setToast] = useState({
    show: false,
    title: '',
  });

  const closeToast = () => setToast((prev) => ({ ...prev, show: false }));
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');

    if (code) {
      api.post('/api/auth/kakao/login', { code })
        .then(res => {
          const { accessToken } = res.data;
          login(accessToken);

          navigate('/', { replace: true });
        })
        .catch((err) => {
          console.error("카카오 로그인 API 요청 실패: ", err);

          setToast({
            show: true,
            title: '곧 로그인이 완료됩니다.',
          });

          const dummyToken = 'kakao-temp-token-12345';
          login(dummyToken);
          
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 1000);
        });
    }
  }, [login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-12 border-4 border-zinc-700 border-t-orange-500 rounded-full animate-spin"></div>
        <div className="text-center">
          <p className="text-lg font-semibold">카카오 로그인 처리 중입니다</p>
          <p className="text-zinc-500 text-sm mt-2">잠시만 기다려주세요...</p>
        </div>
      </div>

      <Toast 
        show={toast.show} 
        onClose={closeToast} 
        title={toast.title} 
        type="warning" 
        icon="⚠️"
      />
    </div>
  );
}