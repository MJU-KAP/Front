import type { ReactNode } from 'react';
import NextPlanLogo from '../brand/NextPlanLogo';

type AppHeaderProps = {
  /** 메인 등 페이지별 오른쪽 액션 (예: KakaoLoginButton) */
  rightSlot?: ReactNode;
};

export default function AppHeader({ rightSlot }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <NextPlanLogo />
        {rightSlot ? (
          <nav className="flex items-center gap-2 sm:gap-3" aria-label="계정">
            {rightSlot}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
