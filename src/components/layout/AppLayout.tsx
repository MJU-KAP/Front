import { Outlet, useLocation } from 'react-router-dom';
import AppHeader from './AppHeader';
import MainNav from './MainNav';
import KakaoLoginButton from '../../pages/kakao/component/KakaoLoginButton';

/** 전역 NAV: AppHeader + 페이지 본문(Outlet) */
export default function AppLayout() {
  const { pathname } = useLocation();
  const isMainPage = pathname === '/' || pathname === '/main';

  return (
    <>
      <AppHeader
        centerSlot={isMainPage ? <MainNav /> : undefined}
        rightSlot={<KakaoLoginButton />}
      />
      <Outlet />
    </>
  );
}
