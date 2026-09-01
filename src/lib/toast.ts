export type ToastKind = 'success' | 'error' | 'info';

export interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
const listeners = new Set<Listener>();
let counter = 0;

function emit() {
  listeners.forEach((l) => l(toasts));
}

export const toast = {
  push(kind: ToastKind, message: string, ttl = 4000): number {
    const id = ++counter;
    toasts = [...toasts, { id, kind, message }];
    emit();
    if (ttl > 0) setTimeout(() => toast.dismiss(id), ttl);
    return id;
  },
  success(message: string) {
    return toast.push('success', message);
  },
  error(message: string) {
    return toast.push('error', message, 6000);
  },
  info(message: string) {
    return toast.push('info', message);
  },
  dismiss(id: number) {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  },
  subscribe(l: Listener): () => void {
    listeners.add(l);
    l(toasts);
    return () => {
      listeners.delete(l);
    };
  },
};
