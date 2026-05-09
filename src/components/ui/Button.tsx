import { Link } from 'react-router-dom';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

const baseClass =
  'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 disabled:pointer-events-none disabled:opacity-50';

const variantClass = {
  primary: 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20',
  secondary: 'border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50',
} as const;

type Variant = keyof typeof variantClass;

type ButtonOwnProps = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

type ButtonAsLink = ButtonOwnProps & {
  to: string;
};

type ButtonAsNative = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    to?: undefined;
  };

export type ButtonProps = ButtonAsLink | ButtonAsNative;

export function Button(props: ButtonProps) {
  const variant = props.variant ?? 'primary';
  const cls = `${baseClass} ${variantClass[variant]} ${props.className ?? ''}`;

  if ('to' in props && props.to) {
    return (
      <Link to={props.to} className={cls}>
        {props.children}
      </Link>
    );
  }

  const { children, variant: _v, className: _c, to: _t, type = 'button', ...rest } =
    props as ButtonAsNative;
  void _v;
  void _c;
  void _t;

  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  );
}
