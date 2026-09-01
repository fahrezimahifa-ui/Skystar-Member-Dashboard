import { cn } from '../../lib/utils';

type Tone = 'teal' | 'yellow' | 'blue' | 'gray' | 'green' | 'red';

const tones: Record<Tone, string> = {
  teal: 'bg-teal-50 text-teal-700 border-teal-100',
  yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  gray: 'bg-canvas text-ink-muted border-line',
  green: 'bg-green-50 text-green-700 border-green-100',
  red: 'bg-red-50 text-red-600 border-red-100',
};

export function Badge({ tone = 'gray', className, children }: {
  tone?: Tone; className?: string; children: React.ReactNode;
}) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium', tones[tone], className)}>
      {children}
    </span>
  );
}
