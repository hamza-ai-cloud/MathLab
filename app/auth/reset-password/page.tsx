'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import {
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Sigma,
  Pi,
  Divide,
  Plus,
  X,
} from 'lucide-react';

/* ═══════════════════════════════════════════════
   Reset Password Page — Set a new password
   after arriving via a recovery email link.
   ═══════════════════════════════════════════════ */

const floatingIcons = [
  { Icon: Sigma, x: '10%', y: '15%', size: 30, delay: 0 },
  { Icon: Pi, x: '87%', y: '18%', size: 26, delay: 0.5 },
  { Icon: Divide, x: '78%', y: '78%', size: 22, delay: 1 },
  { Icon: Plus, x: '12%', y: '72%', size: 24, delay: 1.5 },
  { Icon: X, x: '92%', y: '50%', size: 18, delay: 2 },
  { Icon: Sigma, x: '50%', y: '88%', size: 20, delay: 0.8 },
];

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  /* ── Verify the user has a valid session (set by /auth/confirm) ── */
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setHasSession(true);
        console.log('[MathLab Auth] Reset-password page: session found for', user.email);
      } else {
        console.warn('[MathLab Auth] Reset-password page: no session found');
        setError(
          'Your password reset link has expired or is invalid. Please request a new one.',
        );
      }
      setChecking(false);
    };
    checkSession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Validation ── */
  const passwordsMatch = newPassword === confirmPassword;
  const showMismatch = confirmPassword.length > 0 && !passwordsMatch;
  const isValid =
    newPassword.length >= 6 && passwordsMatch && confirmPassword.length > 0;

  /* ── Submit handler ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setError('');

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      console.error(
        '[MathLab Auth] updateUser password error:',
        updateError.message,
      );
      const msg = updateError.message.toLowerCase();
      if (msg.includes('same password') || msg.includes('different from')) {
        setError(
          'New password must be different from your current password.',
        );
      } else {
        setError(updateError.message);
      }
      setLoading(false);
      return;
    }

    console.log('[MathLab Auth] Password updated successfully via reset flow');
    setSuccess(true);
    setLoading(false);

    // Redirect to dashboard after a brief delay
    setTimeout(() => router.push('/dashboard'), 2500);
  };

  /* ── Loading spinner while checking session ── */
  if (checking) {
    return (
      <div className="min-h-screen bg-deep flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-electric-light" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep relative flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* ── Background effects ── */}
      <div className="mesh-gradient" />
      <div className="absolute inset-0 grid-paper opacity-10" />

      {/* Floating math icons */}
      {floatingIcons.map(({ Icon, x, y, size, delay }, i) => (
        <motion.div
          key={i}
          className="absolute text-white/[0.04] pointer-events-none"
          style={{ left: x, top: y }}
          animate={{ y: [0, -18, 0], rotate: [0, 12, -12, 0] }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            delay,
            ease: 'easeInOut',
          }}
        >
          <Icon size={size} />
        </motion.div>
      ))}

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-electric/8 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-violet/8 blur-[120px]" />

      {/* ═══ Card ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full max-w-[420px] z-10"
      >
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background:
              'linear-gradient(145deg, rgba(15,12,30,0.95) 0%, rgba(10,8,22,0.98) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow:
              '0 0 80px rgba(108,99,255,0.08), 0 25px 60px rgba(0,0,0,0.5)',
          }}
        >
          {/* ── Header ── */}
          <div className="px-8 pt-8 pb-2 text-center">
            <motion.div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-electric to-violet shadow-glow mb-4"
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {success ? (
                <CheckCircle2 className="w-7 h-7 text-white" />
              ) : (
                <KeyRound className="w-7 h-7 text-white" />
              )}
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {success ? 'Password Updated!' : 'Set New Password'}
            </h1>
            <p className="text-sm text-slate-400 mb-1">
              {success
                ? 'Redirecting you to the dashboard…'
                : 'Choose a strong password for your MathLab account'}
            </p>
          </div>

          {/* ── Success state ── */}
          {success ? (
            <div className="px-8 pb-8 pt-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-[13px] text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 leading-snug"
              >
                <CheckCircle2
                  size={15}
                  className="flex-shrink-0 mt-0.5"
                />
                <span>
                  Your password has been updated successfully. You can now
                  sign in with your new password.
                </span>
              </motion.div>
              <div className="flex items-center justify-center mt-5 gap-2">
                <Loader2
                  size={14}
                  className="animate-spin text-electric-light"
                />
                <span className="text-sm text-slate-400">
                  Redirecting to Dashboard…
                </span>
              </div>
            </div>
          ) : (
            /* ── Password form ── */
            <form
              onSubmit={handleSubmit}
              className="px-8 pt-4 pb-8 space-y-3.5"
            >
              {/* Error banner */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-[13px] text-red-300 bg-red-500/10 border border-red-500/20 leading-snug"
                  >
                    <AlertCircle
                      size={15}
                      className="flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <span>{error}</span>
                      {!hasSession && (
                        <button
                          type="button"
                          onClick={() => router.push('/auth')}
                          className="block mt-2 text-[12px] text-electric-light hover:text-white transition font-medium"
                        >
                          ← Back to Sign In
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {hasSession && (
                <>
                  {/* New Password */}
                  <div>
                    <label className="block text-[11px] text-slate-400 uppercase tracking-wider font-medium mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                      />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        autoFocus
                        className="w-full pl-10 pr-11 py-2.5 rounded-xl text-sm text-white placeholder-slate-600 bg-white/[0.03] border border-white/[0.08] focus:border-electric/40 focus:ring-1 focus:ring-electric/20 outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
                      >
                        {showPassword ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}
                      </button>
                    </div>
                    {newPassword.length > 0 && newPassword.length < 6 && (
                      <p className="text-[11px] text-amber-400 mt-1.5 flex items-center gap-1">
                        <AlertCircle size={11} /> Must be at least 6
                        characters
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-[11px] text-slate-400 uppercase tracking-wider font-medium mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <ShieldCheck
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                      />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(e.target.value)
                        }
                        placeholder="Re-enter your new password"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-600 bg-white/[0.03] border outline-none transition ${
                          showMismatch
                            ? 'border-red-500/50 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20'
                            : confirmPassword.length > 0 &&
                                passwordsMatch
                              ? 'border-emerald-500/40 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20'
                              : 'border-white/[0.08] focus:border-electric/40 focus:ring-1 focus:ring-electric/20'
                        }`}
                      />
                    </div>
                    <AnimatePresence>
                      {confirmPassword.length > 0 && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className={`text-[11px] mt-1.5 flex items-center gap-1 ${
                            passwordsMatch
                              ? 'text-emerald-400'
                              : 'text-red-400'
                          }`}
                        >
                          {passwordsMatch ? (
                            <>
                              <CheckCircle2 size={11} /> Passwords match
                            </>
                          ) : (
                            <>
                              <AlertCircle size={11} /> Passwords do not
                              match
                            </>
                          )}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={loading || !isValid}
                    whileHover={{ scale: loading ? 1 : 1.01 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all mt-1"
                    style={{
                      background:
                        !isValid || loading
                          ? 'rgba(108,99,255,0.25)'
                          : 'linear-gradient(135deg, #3b82f6, #6C63FF, #8b5cf6)',
                      boxShadow:
                        !isValid || loading
                          ? 'none'
                          : '0 0 24px rgba(108,99,255,0.25)',
                    }}
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        Update Password
                        <ArrowRight size={14} />
                      </>
                    )}
                  </motion.button>
                </>
              )}
            </form>
          )}

          {/* ── Footer link ── */}
          {!success && (
            <div className="px-8 pb-7 text-center">
              <p className="text-xs text-slate-500">
                Remember your password?{' '}
                <button
                  onClick={() => router.push('/auth')}
                  className="text-electric-light hover:text-white font-medium transition"
                >
                  Back to Sign In
                </button>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
