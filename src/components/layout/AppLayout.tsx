import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
import MainNav from './MainNav';
import KakaoLoginButton from '../../pages/kakao/component/KakaoLoginButton';

/** 전역 NAV: AppHeader + 페이지 본문(Outlet) */
export default function AppLayout() {
  return (
    <>
      <AppHeader centerSlot={<MainNav />} rightSlot={<KakaoLoginButton />} />
      <Outlet />
    </>
  );
}
