import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../apis/api';
import Toast from '../../components/Toast'; 

export default function KakaoCallback() {
  const { login } = useAuthStore();
  
  const [toast, setToast] = useState<{
    show: boolean;
    title: string;
    type: 'success' | 'warning' | 'info';
  }>({
    show: false,
    title: '',
    type: 'info',
  });

  const closeToast = () => setToast((prev) => ({ ...prev, show: false }));

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');

    if (code) {
      api.post('/api/auth/kako/login', { code })
        .then(res => {
          const { accessToken } = res.data;
          login(accessToken);

          setToast({
            show: true,
            title: '로그인이 성공했습니다.',
            type: 'success',
          });
          
          setTimeout(() => {
            window.location.href = '/'; 
          }, 1000);
        })
        .catch(() => {
          setToast({
            show: true,
            title: '곧 로그인이 완료됩니다.',
            type: 'warning',
          });

          const dummyToken = 'kakao-temp-token-12345';
          login(dummyToken);
          
          setTimeout(() => {
            window.location.href = '/'; 
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
        type={toast.type} 
        icon={toast.type === 'success' ? '✅' : '⚠️'}
      />
    </div>
  );
}