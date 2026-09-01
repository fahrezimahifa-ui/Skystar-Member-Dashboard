import { cn } from '../../lib/utils';

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('card p-5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, icon }: {
  title: React.ReactNode; subtitle?: React.ReactNode; action?: React.ReactNode; icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="flex items-start gap-3">
        {icon && <div className="mt-0.5 text-teal">{icon}</div>}
        <div>
          <h3 className="text-base font-semibold text-ink">{title}</h3>
          {subtitle && <p className="text-sm text-ink-muted mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function Stat({ label, value, hint, accent = 'teal' }: {
  label: string; value: React.ReactNode; hint?: string; accent?: 'teal' | 'yellow' | 'blue';
}) {
  const color = accent === 'yellow' ? 'text-yellow-600' : accent === 'blue' ? 'text-blue' : 'text-teal';
  return (
    <div>
      <div className={cn('text-2xl font-bold', color)}>{value}</div>
      <div className="text-xs text-ink-muted mt-0.5">{label}</div>
      {hint && <div className="text-[11px] text-ink-muted">{hint}</div>}
    </div>
  );
}
