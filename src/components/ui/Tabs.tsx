import { cn } from '../../lib/utils';

export function Tabs({ tabs, active, onChange, className }: {
  tabs: { key: string; label: string; count?: number }[];
  active: string;
  onChange: (key: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('flex gap-1 border-b border-line overflow-x-auto scrollbar-thin', className)}>
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={cn(
            'relative whitespace-nowrap px-3.5 py-2.5 text-sm font-medium transition-colors',
            active === t.key ? 'text-teal' : 'text-ink-muted hover:text-ink',
          )}
        >
          {t.label}
          {t.count !== undefined && (
            <span className="ml-1.5 rounded-full bg-canvas px-1.5 py-0.5 text-[10px] text-ink-muted">{t.count}</span>
          )}
          {active === t.key && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-teal rounded-full" />}
        </button>
      ))}
    </div>
  );
}
