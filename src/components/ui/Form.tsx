import { cn } from '../../lib/utils';

export function Select({ value, onChange, options, className, placeholder }: {
  value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
  className?: string; placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn('w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal backdrop-blur', className)}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn('w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal backdrop-blur', className)}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn('w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal backdrop-blur', className)}
      {...props}
    />
  );
}

export function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={cn('block text-sm font-medium text-ink-soft mb-1', className)}>{children}</label>;
}
