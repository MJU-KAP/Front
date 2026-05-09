import { Link } from 'react-router-dom';

type NextPlanLogoProps = {
  className?: string;
};

/** NextPlan 워드마크: Next(검정) + Plan(오렌지), 띄어쓰기 없음. 클릭 시 홈(/) */
export default function NextPlanLogo({ className = '' }: NextPlanLogoProps) {
  return (
    <Link
      to="/"
      className={`text-xl font-black tracking-tighter transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 rounded-sm ${className}`}
    >
      <span className="text-zinc-900">Next</span>
      <span className="text-orange-500">Plan</span>
    </Link>
  );
}
