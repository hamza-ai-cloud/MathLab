'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getBaseUrl } from '@/lib/utils/getBaseUrl';
import type { User, Session } from '@supabase/supabase-js';

/* ════════════════════════════════════
   Auth Context — Supabase (Email + OAuth)
   ════════════════════════════════════ */

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
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        // Debug log — always print the raw Supabase error so we can diagnose
        console.error('[MathLab Auth] signInWithPassword error:', JSON.stringify(error, null, 2));

        const msg = (error.message || '').toLowerCase();

        // Supabase returns "Email not confirmed" when the account exists but hasn't been verified
        if (msg.includes('email not confirmed') || msg.includes('not confirmed')) {
          return {
            error: 'Your email is not confirmed yet. Please check your inbox for the confirmation link, or click "Resend" below.',
            code: 'email_not_confirmed',
          };
        }

        // "Invalid login credentials" is Supabase's catch-all for wrong email OR wrong password
        if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
          // Try a no-op signUp to see if the email exists at all
          const { data: probe } = await supabase.auth.signUp({
            email,
            password: '__probe_only_never_match__',
            options: { data: { _probe: true } },
          });

          // If identities is empty, the user exists — so it's a wrong password
          if (probe?.user?.identities && probe.user.identities.length === 0) {
            console.error('[MathLab Auth] User exists but password is wrong');
            return {
              error: 'Incorrect password. Please try again or use "Forgot Password?" to reset it.',
              code: 'invalid_credentials',
            };
          }

          // Otherwise the user doesn't exist
          console.error('[MathLab Auth] No account found for this email');
          return {
            error: 'No account found with this email. Please sign up first.',
            code: 'user_not_found',
          };
        }

        // Rate limit or any other error — always return a human-readable message
        if (msg.includes('rate limit') || msg.includes('too many requests')) {
          return { error: 'Too many attempts. Please wait a minute and try again.', code: 'unknown' };
        }

        return { error: error.message || `Authentication failed (${error.status || 'unknown'})`, code: 'unknown' };
      }

      console.log('[MathLab Auth] Sign-in successful for:', data.user?.email);
      return {};
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : JSON.stringify(err);
      console.error('[MathLab Auth] signInWithEmail EXCEPTION:', message);
      return { error: `Sign-in failed: ${message}`, code: 'unknown' };
    }
  }, [supabase]);

  /* ── Sign up with Email + Password + Name ── */
  const signUpWithEmail = useCallback(async (email: string, password: string, fullName: string): Promise<AuthResult> => {
    try {
      console.log('[MathLab Auth] Attempting signUp for:', email, '| Name:', fullName);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${getBaseUrl()}/auth/confirm`,
        },
      });

      // Debug: log the FULL response so we can always diagnose
      console.log('[MathLab Auth] signUp response — data:', JSON.stringify(data, null, 2));
      if (error) {
        console.error('[MathLab Auth] signUp error:', JSON.stringify(error, null, 2));
      }

      if (error) {
        const msg = (error.message || '').toLowerCase();
        if (msg.includes('already registered') || msg.includes('already been registered')) {
          return { error: 'This email is already registered. Please sign in instead.', code: 'already_registered' };
        }
        if (msg.includes('rate limit') || msg.includes('too many requests') || msg.includes('email rate limit')) {
          return { error: 'Email rate limit reached. Please wait a few minutes and try again, or check SMTP settings.', code: 'unknown' };
        }
        if (msg.includes('smtp') || msg.includes('email') && msg.includes('send')) {
          return { error: `Email delivery failed: ${error.message}. Please verify SMTP settings in Supabase Dashboard.`, code: 'unknown' };
        }
        return { error: error.message || `Sign-up failed (status ${error.status || 'unknown'})`, code: 'unknown' };
      }

      // Supabase may return a user with no identities if the email already exists (no error thrown)
      if (data?.user && data.user.identities && data.user.identities.length === 0) {
        console.warn('[MathLab Auth] signUp returned user with 0 identities — email already exists');
        return { error: 'This email is already registered. Please sign in instead.', code: 'already_registered' };
      }

      console.log('[MathLab Auth] Sign-up successful, confirmation email sent to:', email);
      return {};
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : JSON.stringify(err);
      console.error('[MathLab Auth] signUpWithEmail EXCEPTION:', message);
      return { error: `Sign-up failed: ${message}`, code: 'unknown' };
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
