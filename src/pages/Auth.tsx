import { useState } from 'react';
import { useAuth } from '../store/auth';
import { Button } from '../components/ui';
import { cn } from '../lib/utils';

type Mode = 'signin' | 'signup';

const USERNAME_RE = /^[a-z0-9._-]{3,30}$/;

export function Auth() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  function validate(): string | null {
    if (!USERNAME_RE.test(username.trim().toLowerCase())) return 'Username must be 3–30 chars: letters, numbers, . _ -';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setInfo('');
    const v = validate();
    if (v) { setError(v); return; }
    setBusy(true);
    try {
      if (mode === 'signin') {
        const r = await signIn(username, password);
        if (r.error) setError(r.error); else setInfo('Signed in — loading your workspace…');
      } else {
        const r = await signUp(username, password);
        if (r.error) {
          if (/already registered/i.test(r.error)) setError('That username is taken.');
          else setError(r.error);
        } else if (r.needsConfirmation) setInfo('Check your email to confirm your account, then sign in.');
        else setInfo('Account created — loading your workspace…');
      }
    } finally { setBusy(false); }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="glass-strong w-full max-w-md rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-teal flex items-center justify-center text-white font-bold text-lg">T</div>
          <div>
            <div className="font-bold text-ink text-lg leading-tight">Teamrise</div>
            <div className="text-xs text-ink-muted leading-tight">Entrepreneurship OS</div>
          </div>
        </div>

        <div className="flex gap-1 p-1 rounded-xl bg-black/5 mb-6">
          {(['signin', 'signup'] as Mode[]).map((m) => (
            <button key={m} onClick={() => { setMode(m); setError(''); setInfo(''); }}
              className={cn('flex-1 py-2 text-sm rounded-lg font-medium transition', mode === m ? 'bg-white text-teal-700 shadow' : 'text-ink-soft')}>
              {m === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="text-sm text-ink-soft">Username</span>
            <input type="text" required autoCapitalize="none" autoCorrect="off" spellCheck={false} value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-white/70 px-3 py-2.5 text-ink outline-none focus:ring-2 focus:ring-teal/40" placeholder="alex" />
          </label>
          <label className="block">
            <span className="text-sm text-ink-soft">Password</span>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-white/70 px-3 py-2.5 text-ink outline-none focus:ring-2 focus:ring-teal/40" placeholder="••••••••" />
          </label>

          {error && <div className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</div>}
          {info && <div className="text-sm text-teal-700 bg-teal-50 rounded-lg px-3 py-2">{info}</div>}

          <Button type="submit" variant="primary" className="w-full justify-center" disabled={busy}>
            {busy ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
      </div>
    </div>
  );
}
