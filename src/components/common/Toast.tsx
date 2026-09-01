import { useEffect, useState } from 'react';
import { toast, type ToastItem, type ToastKind } from '../../lib/toast';
import { cn } from '../../lib/utils';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const styles: Record<ToastKind, { cls: string; Icon: typeof Info }> = {
  success: { cls: 'border-teal/40 bg-teal-50 text-ink', Icon: CheckCircle2 },
  error: { cls: 'border-red-300 bg-red-50 text-ink', Icon: AlertTriangle },
  info: { cls: 'border-blue/40 bg-blue-50 text-ink', Icon: Info },
};

export function ToastProvider() {
  const [items, setItems] = useState<ToastItem[]>([]);
  useEffect(() => toast.subscribe(setItems), []);
  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 w-80 max-w-[90vw]">
      {items.map((t) => {
        const { cls, Icon } = styles[t.kind];
        return (
          <div key={t.id} className={cn('flex items-start gap-2 rounded-xl border px-3 py-2.5 shadow-lg backdrop-blur', cls)}>
            <Icon size={18} className="mt-0.5 shrink-0" />
            <span className="text-sm flex-1">{t.message}</span>
            <button onClick={() => toast.dismiss(t.id)} className="text-ink-muted hover:text-ink" aria-label="Dismiss">
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
