import { JOURNEY } from '../../lib/stage';
import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';

export function JourneyStepper({ active }: { active: string }) {
  const idx = JOURNEY.findIndex((j) => j.key === active);
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {JOURNEY.map((step, i) => {
        const isDone = i < idx;
        const isActive = i === idx;
        return (
          <div key={step.key} className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0',
                  isActive && 'bg-teal text-white ring-4 ring-teal-50',
                  isDone && 'bg-teal-100 text-teal-700',
                  !isActive && !isDone && 'bg-white/50 text-ink-muted border border-white/60',
                )}
              >
                {isDone ? <Check size={14} /> : i + 1}
              </div>
              <span className={cn('text-sm font-medium whitespace-nowrap', isActive ? 'text-teal-700' : 'text-ink-muted')}>{step.label}</span>
            </div>
            {i < JOURNEY.length - 1 && <div className={cn('h-0.5 flex-1 rounded-full', i < idx ? 'bg-teal' : 'bg-line')} />}
          </div>
        );
      })}
    </div>
  );
}
