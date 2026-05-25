import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { label: '대외활동', to: '/board/activities' },
  { label: '공모전', to: '/board/competitions' },
] as const;

export default function MainNav() {
  return (
    <ul className="flex items-center gap-6 sm:gap-8">
      {NAV_ITEMS.map((item) => (
        <li key={item.to}>
          <NavLink
            to={item.to}
            className={({ isActive }) =>
              [
                'text-sm transition-colors sm:text-base',
                isActive
                  ? 'font-bold text-orange-500'
                  : 'font-medium text-zinc-700 hover:text-zinc-900',
              ].join(' ')
            }
          >
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
