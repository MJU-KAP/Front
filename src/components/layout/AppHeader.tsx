import type { ReactNode } from 'react';
import NextPlanLogo from '../brand/NextPlanLogo';

type AppHeaderProps = {
  /** 가운데 NAV (메인 페이지 등에서만 사용) */
  centerSlot?: ReactNode;
  /** 페이지별 오른쪽 액션 (예: KakaoLoginButton) */
  rightSlot?: ReactNode;
};

export default function AppHeader({ centerSlot, rightSlot }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:h-16 sm:px-6">
        <div className="flex flex-1 items-center justify-start">
          <NextPlanLogo />
        </div>

        {centerSlot ? (
          <nav
            className="hidden flex-1 items-center justify-center sm:flex"
            aria-label="주요 메뉴"
          >
            {centerSlot}
          </nav>
        ) : null}

        {rightSlot ? (
          <nav
            className="flex flex-1 items-center justify-end gap-2 sm:gap-3"
            aria-label="계정"
          >
            {rightSlot}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
