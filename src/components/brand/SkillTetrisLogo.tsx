import { Link } from 'react-router-dom';

type SkillTetrisLogoProps = {
  className?: string;
};

/** "Skill" + 오렌지 "Tetris" 브랜드 마크. 기본 동작: 홈(/)으로 이동 */
export default function SkillTetrisLogo({ className = '' }: SkillTetrisLogoProps) {
  return (
    <Link
      to="/"
      className={`text-xl font-black tracking-tighter text-zinc-900 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 rounded-sm ${className}`}
    >
      <span className="text-zinc-900">Skill</span>
      <span className="text-orange-500">Tetris</span>
    </Link>
  );
}
