import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ensureProfile } from '../data/api';
import * as conv from '../data/database';

const AUTH_EMAIL_DOMAIN = 'teamrise.app';
export function toAuthEmail(username: string): string {
  return username.trim().toLowerCase() + '@' + AUTH_EMAIL_DOMAIN;
}

interface AuthState {
  loading: boolean;
  userId: string | null;
  username: string | null;
  profile: conv.ProfileRow | null;
  configured: boolean;
  signIn: (username: string, password: string) => Promise<{ error?: string }>;
  signUp: (username: string, password: string) => Promise<{ error?: string; needsConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [profile, setProfile] = useState<conv.ProfileRow | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user;
      if (u && active) {
        setUserId(u.id); setUsername(u.email ? u.email.split('@')[0] : null);
        const p = await ensureProfile({ id: u.id, email: u.email ?? undefined });
        if (active) setProfile(p);
      }
      if (active) setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange(async (_, session) => {
      const u = session?.user;
      if (u) {
        setUserId(u.id); setUsername(u.email ? u.email.split('@')[0] : null);
        const p = await ensureProfile({ id: u.id, email: u.email ?? undefined });
        setProfile(p);
      } else {
        setUserId(null); setUsername(null); setProfile(null);
      }
      setLoading(false);
    });
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, []);

  const signIn = async (u: string, p: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: toAuthEmail(u), password: p });
    return { error: error?.message };
  };
  const signUp = async (u: string, p: string) => {
    const { data, error } = await supabase.auth.signUp({ email: toAuthEmail(u), password: p });
    if (error) return { error: error.message };
    return { needsConfirmation: !data.session };
  };
  const signOut = async () => { await supabase.auth.signOut(); };
  const refreshProfile = async () => {
    if (!userId) return;
    const p = await ensureProfile({ id: userId, email: username ? toAuthEmail(username) : undefined });
    setProfile(p);
  };

  return (
    <Ctx.Provider value={{ loading, userId, username, profile, configured: isSupabaseConfigured, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
