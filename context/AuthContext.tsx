'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getBaseUrl } from '@/lib/utils/getBaseUrl';
import type { User, Session } from '@supabase/supabase-js';

/* ════════════════════════════════════
   Auth Context — Supabase (Email + OAuth)
   ════════════════════════════════════ */

/**
 * Race any promise against a timeout. If the original promise doesn't
 * resolve/reject within `ms` milliseconds, the returned promise rejects
 * with a clear timeout error. This prevents infinite hangs.
 */
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`[TIMEOUT] ${label} did not respond within ${ms / 1000}s. Check Supabase URL, anon key, and SMTP settings.`)), ms)
    ),
  ]);
}

/** Safely extract a readable message from any error shape */
function extractErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  if (err && typeof err === 'object') {
    const obj = err as Record<string, unknown>;
    if (typeof obj.message === 'string' && obj.message) return obj.message;
    if (typeof obj.msg === 'string' && obj.msg) return obj.msg;
    if (typeof obj.error_description === 'string') return obj.error_description;
    // Last resort: stringify, but flag if it's empty
    const str = JSON.stringify(err);
    if (str === '{}') return 'Unknown error (empty response from server). Check Supabase Dashboard logs → Auth → Logs.';
    return str;
  }
  return 'Unknown error';
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthResult {
  error?: string;
  code?: 'email_not_confirmed' | 'invalid_credentials' | 'user_not_found' | 'already_registered' | 'unknown';
}

interface AuthContextValue {
  isLoggedIn: boolean;
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  resendConfirmation: (email: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => ({}),
  signUpWithEmail: async () => ({}),
  resetPassword: async () => ({}),
  resendConfirmation: async () => ({}),
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
        queryParams: { prompt: 'select_account' },
      },
    });
    if (error) {
      console.error('Google sign-in error:', error.message);
    }
  }, [supabase]);

  /* ── Sign in with Email + Password ── */
  const signInWithEmail = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    console.log('[MathLab Auth] ▶ signInWithEmail called:', { email, hasPassword: !!password });
    console.log('[MathLab Auth] ENV CHECK:', {
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ ' + process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30) + '...' : '❌ UNDEFINED',
      ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ set (hidden)' : '❌ UNDEFINED',
    });

    try {
      const { data, error } = await withTimeout(
        supabase.auth.signInWithPassword({ email, password }),
        10000,
        'signInWithPassword'
      );

      console.log('[MathLab Auth] signIn raw response:', { data: JSON.stringify(data), error: JSON.stringify(error) });

      if (error) {
        const msg = (error.message || '').toLowerCase();

        if (msg.includes('email not confirmed') || msg.includes('not confirmed')) {
          return {
            error: 'Your email is not confirmed yet. Please check your inbox for the confirmation link, or click "Resend" below.',
            code: 'email_not_confirmed',
          };
        }

        if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
          return {
            error: 'Invalid email or password. Please try again or use "Forgot Password?".',
            code: 'invalid_credentials',
          };
        }

        if (msg.includes('rate limit') || msg.includes('too many requests')) {
          return { error: 'Too many attempts. Please wait a minute and try again.', code: 'unknown' };
        }

        return { error: extractErrorMessage(error), code: 'unknown' };
      }

      console.log('[MathLab Auth] ✅ Sign-in successful for:', data.user?.email);
      return {};
    } catch (err: unknown) {
      const message = extractErrorMessage(err);
      console.error('[MathLab Auth] ❌ signInWithEmail EXCEPTION:', message);
      return { error: message, code: 'unknown' };
    }
  }, [supabase]);

  /* ── Sign up with Email + Password + Name ── */
  const signUpWithEmail = useCallback(async (email: string, password: string, fullName: string): Promise<AuthResult> => {
    console.log('[MathLab Auth] ▶ signUpWithEmail called:', { email, fullName, passwordLength: password.length });
    console.log('[MathLab Auth] ENV CHECK:', {
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ UNDEFINED',
      ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ set' : '❌ UNDEFINED',
      SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || '❌ UNDEFINED',
      emailRedirectTo: `${getBaseUrl()}/auth/confirm`,
    });

    try {
      console.log('[MathLab Auth] Calling supabase.auth.signUp (10s timeout)...');
      const startTime = Date.now();

      const { data, error } = await withTimeout(
        supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${getBaseUrl()}/auth/confirm`,
          },
        }),
        10000,
        'signUp'
      );

      const elapsed = Date.now() - startTime;
      console.log(`[MathLab Auth] signUp responded in ${elapsed}ms`);
      console.log('[MathLab Auth] signUp RAW data:', JSON.stringify(data, null, 2));
      console.log('[MathLab Auth] signUp RAW error:', JSON.stringify(error, null, 2));

      if (error) {
        const msg = (error.message || '').toLowerCase();
        console.error('[MathLab Auth] ❌ signUp error message:', JSON.stringify(error.message), '| status:', error.status, '| name:', error.name);

        if (msg.includes('already registered') || msg.includes('already been registered')) {
          return { error: 'This email is already registered. Please sign in instead.', code: 'already_registered' };
        }
        if (msg.includes('rate limit') || msg.includes('too many requests') || msg.includes('email rate limit') || msg.includes('email sending') || error.status === 429) {
          return { error: 'Email rate limit reached. Please wait a few minutes and try again. If this persists, disable "Confirm Email" in Supabase → Auth → Providers to test.', code: 'unknown' };
        }

        // Catch-all: use extractErrorMessage to NEVER show {}
        return { error: extractErrorMessage(error), code: 'unknown' };
      }

      // Supabase may return a user with no identities if the email already exists (no error thrown)
      if (data?.user && data.user.identities && data.user.identities.length === 0) {
        console.warn('[MathLab Auth] signUp returned user with 0 identities — email already exists');
        return { error: 'This email is already registered. Please sign in instead.', code: 'already_registered' };
      }

      console.log('[MathLab Auth] ✅ Sign-up successful, confirmation email sent to:', email);
      return {};
    } catch (err: unknown) {
      const message = extractErrorMessage(err);
      console.error('[MathLab Auth] ❌ signUpWithEmail EXCEPTION:', message);
      return { error: message, code: 'unknown' };
    }
  }, [supabase]);

  /* ── Reset password via email ── */
  const resetPassword = useCallback(async (email: string): Promise<AuthResult> => {
    try {
      console.log('[MathLab Auth] Sending password reset email to:', email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getBaseUrl()}/auth/confirm?type=recovery`,
      });
      if (error) {
        console.error('[MathLab Auth] resetPasswordForEmail error:', JSON.stringify(error, null, 2));
        return { error: error.message || `Reset failed (${error.status || 'unknown'})`, code: 'unknown' };
      }
      console.log('[MathLab Auth] Password reset email sent successfully');
      return {};
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : JSON.stringify(err);
      console.error('[MathLab Auth] resetPassword EXCEPTION:', message);
      return { error: `Password reset failed: ${message}`, code: 'unknown' };
    }
  }, [supabase]);

  /* ── Resend confirmation email ── */
  const resendConfirmation = useCallback(async (email: string): Promise<AuthResult> => {
    try {
      console.log('[MathLab Auth] Resending confirmation email to:', email);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${getBaseUrl()}/auth/confirm`,
        },
      });
      if (error) {
        console.error('[MathLab Auth] resend confirmation error:', JSON.stringify(error, null, 2));
        return { error: error.message || `Resend failed (${error.status || 'unknown'})`, code: 'unknown' };
      }
      console.log('[MathLab Auth] Confirmation email resent successfully');
      return {};
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : JSON.stringify(err);
      console.error('[MathLab Auth] resendConfirmation EXCEPTION:', message);
      return { error: `Resend failed: ${message}`, code: 'unknown' };
    }
  }, [supabase]);

  /* ── Logout — clear session and force redirect to home ── */
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  }, [supabase]);

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword, resendConfirmation, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
