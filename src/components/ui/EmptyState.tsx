import { cn } from '../../lib/utils';

export function EmptyState({ icon, title, description, action, className }: {
  icon?: React.ReactNode; title: string; description?: string; action?: React.ReactNode; className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-12 px-6', className)}>
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-white/50 border border-white/60 flex items-center justify-center text-ink-muted mb-4">
          {icon}
        </div>
      )}
      <h4 className="text-base font-semibold text-ink">{title}</h4>
      {description && <p className="text-sm text-ink-muted mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
