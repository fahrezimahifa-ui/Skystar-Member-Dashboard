import { cn } from '../../lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'yellow' | 'blue' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'bg-teal/80 text-white hover:bg-teal/90 border border-white/30 backdrop-blur',
  secondary: 'bg-white/70 text-ink hover:bg-white/90 border border-white/60 backdrop-blur',
  ghost: 'bg-transparent text-ink-soft hover:bg-white/50 border border-transparent backdrop-blur',
  outline: 'bg-white/55 text-ink border border-white/60 hover:border-teal hover:text-teal backdrop-blur',
  yellow: 'bg-yellow/85 text-ink-800 hover:bg-yellow border border-white/40 backdrop-blur',
  blue: 'bg-blue/80 text-white hover:bg-blue/90 border border-white/30 backdrop-blur',
  danger: 'bg-red-500/80 text-white hover:bg-red-500 border border-white/30 backdrop-blur',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
};

export function Button({
  variant = 'primary', size = 'md', className, children, ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant], sizes[size], className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
