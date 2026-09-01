export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

export function pct(n: number): string {
  return `${Math.round(n)}%`;
}

export function initials(name: string): string {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export function daysUntil(date: string): number {
  const today = new Date();
  return Math.round((new Date(date).getTime() - today.getTime()) / 86400000);
}

export function formatDate(date: string): string {
  try {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return date;
  }
}
