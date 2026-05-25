import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../apis/api';
import { fetchMyPage } from '../../apis/userApi';
import Toast from '../../components/Toast';
import { useAuthStore } from '../../store/authStore';

export default function KakaoCallback() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const handledRef = useRef(false);

  const [toast, setToast] = useState<{
    show: boolean;
    title: string;
    description?: string;
  }>({
    show: false,
    title: '',
  });

  const closeToast = () => setToast((prev) => ({ ...prev, show: false }));

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const code = new URL(window.location.href).searchParams.get('code');
    if (!code) {
      navigate('/', { replace: true });
      return;
    }

    (async () => {
      try {
        const res = await api.post('/api/auth/kakao/login', { code });
        const { accessToken } = res.data;
        login(accessToken);
      } catch (err) {
        console.error('카카오 로그인 API 요청 실패: ', err);
        setToast({
          show: true,
          title: '로그인에 실패했습니다',
          description: '잠시 후 다시 시도해 주세요.',
        });
        setTimeout(() => navigate('/login', { replace: true }), 1500);
        return;
      }

      try {
        const me = await fetchMyPage();
        const onboarded = Boolean(me?.desiredJobRole);
        navigate(onboarded ? '/' : '/profile-setup', { replace: true });
      } catch (err) {
        console.error('프로필 조회 실패, 메인으로 이동: ', err);
        navigate('/', { replace: true });
      }
    })();
  }, [login, navigate]);

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
        description={toast.description}
        type="warning"
        icon="⚠️"
      />
    </div>
  );
}
