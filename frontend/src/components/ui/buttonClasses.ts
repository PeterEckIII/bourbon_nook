export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'dangerOutline';
export type ButtonSize = 'md' | 'lg';

export interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  ringOffset?: 'ground' | 'cream';
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border-amber-500/40 bg-amber-600 text-amber-50 tracking-wide hover:bg-amber-700 focus:ring-amber-500/70',
  secondary: 'border-ink/20 text-ink hover:bg-ink/5 focus:ring-amber-500/70',
  danger: 'border-red-700/40 bg-red-700 text-red-50 hover:bg-red-800 focus:ring-red-500/70',
  dangerOutline: 'border-red-700/40 text-red-700 hover:bg-red-700/10 focus:ring-red-500/70',
};

const sizeClasses: Record<ButtonSize, string> = {
  md: 'px-4 py-2 text-sm',
  lg: 'px-4 py-2.5 text-base',
};

/** Shared button recipe, usable on both <button> and router <Link> elements. */
export function buttonClasses({
  variant = 'secondary',
  size = 'md',
  ringOffset = 'cream',
  fullWidth = false,
}: ButtonStyleProps = {}) {
  return [
    'inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border font-medium transition-colors duration-150',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    variantClasses[variant],
    sizeClasses[size],
    ringOffset === 'ground' ? 'focus:ring-offset-ground' : 'focus:ring-offset-cream',
    fullWidth ? 'w-full' : '',
  ]
    .filter(Boolean)
    .join(' ');
}
