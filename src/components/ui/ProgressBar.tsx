import { cn } from '../../lib/utils';

export function ProgressBar({ value, color = 'teal', className, height = 'h-2' }: {
  value: number; color?: 'teal' | 'yellow' | 'blue' | 'green' | 'red'; className?: string; height?: string;
}) {
  const bar = {
    teal: 'bg-teal', yellow: 'bg-yellow', blue: 'bg-blue', green: 'bg-green-500', red: 'bg-red-500',
  }[color];
  return (
    <div className={cn('w-full rounded-full bg-line overflow-hidden', height, className)}>
      <div className={cn('h-full rounded-full transition-all', bar)} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
