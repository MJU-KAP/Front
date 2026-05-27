import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import NextPlanLogo from '../../components/brand/NextPlanLogo';
import { useAuthStore } from '../../store/authStore';
import { startKakaoLogin } from '../../utils/kakaoAuth';
import {
  consumePostLoginRedirect,
  savePostLoginRedirect,
} from '../../utils/postLoginRedirect';

type LoginLocationState = {
  from?: { pathname: string; search?: string };
  loginError?: boolean;
};

function KakaoIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 3c-5.523 0-10 3.535-10 7.896 0 2.825 1.848 5.305 4.675 6.643l-1.196 4.394c-.086.315.265.556.53.376l5.127-3.41c.28.02.565.032.854.032 5.523 0 10-3.535 10-7.896C22 6.535 17.523 3 12 3z" />
    </svg>
  );
}

export default function LoginPage() {
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const locationState = location.state as LoginLocationState | null;

  const bannerMessage = useMemo(() => {
    if (searchParams.get('reason') === 'session_expired') {
      return '로그인이 만료되었습니다. 다시 로그인해 주세요.';
    }
    if (locationState?.loginError) {
      return '로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.';
    }
    if (locationState?.from) {
      return '로그인이 필요합니다. 로그인 후 이어서 이용할 수 있습니다.';
    }
    return null;
  }, [searchParams, locationState]);

  useEffect(() => {
    const from = locationState?.from;
    if (from?.pathname) {
      savePostLoginRedirect(`${from.pathname}${from.search ?? ''}`);
    }
  }, [locationState?.from]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const saved = consumePostLoginRedirect();
    navigate(saved ?? '/', { replace: true });
  }, [isLoggedIn, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-100 px-4 py-12">
      <div className="mb-8">
        <NextPlanLogo className="text-2xl sm:text-3xl" />
      </div>

      <div className="w-full max-w-md rounded-3xl border border-zinc-100 bg-white px-8 py-10 shadow-sm shadow-zinc-900/5 sm:px-10 sm:py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900">로그인</h1>
          <p className="mt-2 text-sm text-zinc-500">
            AI 역량 분석 서비스에 오신 것을 환영합니다
          </p>
        </div>

        {bannerMessage && (
          <p
            className="mt-6 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-center text-sm text-orange-800"
            role="status"
          >
            {bannerMessage}
          </p>
        )}

        <button
          type="button"
          onClick={startKakaoLogin}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#FEE500] px-6 py-3.5 text-sm font-bold text-zinc-900 transition-colors hover:bg-[#FDD800] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FEE500]"
        >
          <KakaoIcon />
          카카오로 시작하기
        </button>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center" aria-hidden>
            <div className="w-full border-t border-zinc-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wide">
            <span className="bg-white px-3 text-zinc-400">OR</span>
          </div>
        </div>

        <p className="text-center text-xs leading-relaxed text-zinc-400">
          계속 진행하면 이용약관 및 개인정보처리방침에 동의하게 됩니다
        </p>
      </div>
    </div>
  );
}
