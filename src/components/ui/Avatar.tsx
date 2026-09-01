import { cn } from '../../lib/utils';

export function Avatar({ name, src, size = 'md', className }: {
  name: string; src?: string; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string;
}) {
  const sizes = {
    sm: 'w-7 h-7 text-[11px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-lg',
  }[size];
  const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  const palette = ['bg-teal', 'bg-blue', 'bg-yellow-400', 'bg-ink', 'bg-teal-600'];
  const color = palette[name.charCodeAt(0) % palette.length];
  if (src) {
    return <img src={src} alt={name} className={cn('rounded-full object-cover', sizes, className)} />;
  }
  return (
    <div className={cn('rounded-full flex items-center justify-center font-semibold text-white', color, sizes, className)}>
      {initials}
    </div>
  );
}
