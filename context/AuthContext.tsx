'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getBaseUrl } from '@/lib/utils/getBaseUrl';
import type { User, Session } from '@supabase/supabase-js';

/* ════════════════════════════════════
   Auth Context — Supabase OAuth
   ════════════════════════════════════ */

interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextValue {
  isLoggedIn: boolean;
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
});

/** Map a Supabase User to our AuthUser shape */
function mapUser(user: User): AuthUser {
  const meta = user.user_metadata ?? {};
  return {
    id: user.id,
    name: meta.full_name || meta.name || user.email?.split('@')[0] || 'Student',
    email: user.email || '',
    avatar: meta.avatar_url || meta.picture || undefined,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  /* ── Bootstrap: get current session on mount ── */
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { user: supaUser } } = await supabase.auth.getUser();
        setUser(supaUser ? mapUser(supaUser) : null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    /* ── Listen for auth state changes (login, logout, token refresh) ── */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session: Session | null) => {
        if (session?.user) {
          setUser(mapUser(session.user));
        } else {
          setUser(null);
        }
        setLoading(false);
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Sign in with Google OAuth ── */
  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${getBaseUrl()}/auth/callback`,
      },
    });
    if (error) {
      console.error('Google sign-in error:', error.message);
    }
  }, [supabase]);

  /* ── Logout ── */
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, [supabase]);

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
