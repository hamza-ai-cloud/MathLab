'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  Brain,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  Sigma,
  Pi,
  Divide,
  Plus,
  X,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

const floatingIcons = [
  { Icon: Sigma, x: '10%', y: '15%', size: 30, delay: 0 },
  { Icon: Pi, x: '87%', y: '18%', size: 26, delay: 0.5 },
  { Icon: Divide, x: '78%', y: '78%', size: 22, delay: 1 },
  { Icon: Plus, x: '12%', y: '72%', size: 24, delay: 1.5 },
  { Icon: X, x: '92%', y: '50%', size: 18, delay: 2 },
  { Icon: Sigma, x: '50%', y: '88%', size: 20, delay: 0.8 },
];

function AuthPageContent() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword, resendConfirmation } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  /* ── Handle error/success from callback redirect ── */
  useEffect(() => {
    const errorParam = searchParams.get('error');
    const messageParam = searchParams.get('message');
    if (errorParam === 'auth_callback_failed') {
      setError('Authentication failed. Please try again.');
    }
    if (errorParam === 'recovery_link_expired') {
      setError('Your password reset link has expired or was already used. Please request a new one.');
      setMode('forgot');
    }
    if (errorParam === 'confirmation_link_expired') {
      setError('Your confirmation link has expired. Please sign up again or request a new link.');
    }
    if (messageParam === 'password_updated') {
      setSuccess('Password updated successfully! You can now sign in.');
    }
  }, [searchParams]);

  const resetForm = () => {
    setError('');
    setSuccess('');
    setShowResend(false);
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setConfirmPassword('');
    setPassword('');
    resetForm();
  };

  const goToForgot = () => {
    setMode('forgot');
    setPassword('');
    setConfirmPassword('');
    resetForm();
  };

  const backToLogin = () => {
    setMode('login');
    setPassword('');
    resetForm();
  };

  /* ── Password match helper ── */
  const passwordsMatch = password === confirmPassword;
  const showMismatch = mode === 'signup' && confirmPassword.length > 0 && !passwordsMatch;

  /* ── Email form submit ── */
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetForm();

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    /* ── Forgot password flow ── */
    if (mode === 'forgot') {
      setLoading(true);
      try {
        const res = await resetPassword(email.trim());
        if (res.error) {
          setError(res.error);
        } else {
          setSuccess('Password reset link sent! Check your email inbox.');
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : JSON.stringify(err);
        console.error('[MathLab Auth Page] Forgot password exception:', msg);
        setError(`Something went wrong: ${msg}`);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (mode === 'signup' && !fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (mode === 'signup' && !passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const res = await signUpWithEmail(email.trim(), password, fullName.trim());
        if (res.error) {
          setError(res.error);
        } else {
          setSuccess('Account created! Check your email to confirm, then log in.');
          setMode('login');
          setPassword('');
          setConfirmPassword('');
        }
      } else {
        const res = await signInWithEmail(email.trim(), password);
        if (res.error) {
          setError(res.error);
          // Show the resend confirmation button if email is not confirmed
          if (res.code === 'email_not_confirmed') {
            setShowResend(true);
          }
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : JSON.stringify(err);
      console.error('[MathLab Auth Page] Submit exception:', msg);
      setError(`Something went wrong: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  /* ── Google sign-in ── */
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    resetForm();
    try {
      await signInWithGoogle();
    } catch {
      setGoogleLoading(false);
    }
  };

  /* ── Disable submit when signup passwords don't match ── */
  const isSubmitDisabled =
    loading ||
    (mode === 'signup' && (confirmPassword.length === 0 || !passwordsMatch)) ||
    (mode === 'forgot' && !email.trim());

  return (
    <div className="min-h-screen bg-deep relative flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Mesh gradient */}
      <div className="mesh-gradient" />
      <div className="absolute inset-0 grid-paper opacity-10" />

      {/* Floating math icons */}
      {floatingIcons.map(({ Icon, x, y, size, delay }, i) => (
        <motion.div
          key={i}
          className="absolute text-white/[0.04] pointer-events-none"
          style={{ left: x, top: y }}
          animate={{ y: [0, -18, 0], rotate: [0, 12, -12, 0] }}
          transition={{ duration: 6 + i, repeat: Infinity, delay, ease: 'easeInOut' }}
        >
          <Icon size={size} />
        </motion.div>
      ))}

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-electric/8 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-violet/8 blur-[120px]" />

      {/* ═══ Auth Card ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full max-w-[420px] z-10"
      >
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(15,12,30,0.95) 0%, rgba(10,8,22,0.98) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 0 80px rgba(108,99,255,0.08), 0 25px 60px rgba(0,0,0,0.5)',
          }}
        >
          {/* ── Brand header ── */}
          <div className="px-8 pt-8 pb-2 text-center">
            <motion.div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-electric to-violet shadow-glow mb-4"
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Brain className="w-7 h-7 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
            </h1>
            <p className="text-sm text-slate-400 mb-1">
              {mode === 'login'
                ? 'Sign in to continue to MathLab'
                : mode === 'signup'
                  ? 'Sign up to start solving math with AI'
                  : 'Enter your email to receive a reset link'}
            </p>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleEmailSubmit} className="px-8 pt-4 pb-3 space-y-3.5">
            {/* Error / Success messages */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="rounded-xl text-[13px] text-red-300 bg-red-500/10 border border-red-500/20 leading-snug"
                >
                  <div className="flex items-start gap-2.5 px-4 py-3">
                    <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                  {/* Resend confirmation email button */}
                  {showResend && (
                    <div className="px-4 pb-3">
                      <button
                        type="button"
                        disabled={resendLoading}
                        onClick={async () => {
                          setResendLoading(true);
                          const res = await resendConfirmation(email.trim());
                          if (res.error) {
                            setError(res.error);
                            setShowResend(false);
                          } else {
                            setError('');
                            setShowResend(false);
                            setSuccess('Confirmation email resent! Please check your inbox.');
                          }
                          setResendLoading(false);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] font-medium text-red-200 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all disabled:opacity-50"
                      >
                        {resendLoading ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Mail size={12} />
                        )}
                        <span>{resendLoading ? 'Sending…' : 'Resend Confirmation Email'}</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
              {success && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-[13px] text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 leading-snug"
                >
                  <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5" />
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Full Name (sign-up only) */}
            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div
                  key="name-field"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <label className="block text-[11px] text-slate-400 uppercase tracking-wider font-medium mb-1.5">Full Name</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Hamza Mumtaz"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-600 bg-white/[0.03] border border-white/[0.08] focus:border-electric/40 focus:ring-1 focus:ring-electric/20 outline-none transition"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div>
              <label className="block text-[11px] text-slate-400 uppercase tracking-wider font-medium mb-1.5">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-600 bg-white/[0.03] border border-white/[0.08] focus:border-electric/40 focus:ring-1 focus:ring-electric/20 outline-none transition"
                />
              </div>
            </div>

            {/* Password (login & signup only) */}
            <AnimatePresence>
              {mode !== 'forgot' && (
                <motion.div
                  key="password-field"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <label className="block text-[11px] text-slate-400 uppercase tracking-wider font-medium mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl text-sm text-white placeholder-slate-600 bg-white/[0.03] border border-white/[0.08] focus:border-electric/40 focus:ring-1 focus:ring-electric/20 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  {/* Forgot Password link (login only) */}
                  {mode === 'login' && (
                    <div className="flex justify-end mt-1.5">
                      <button
                        type="button"
                        onClick={goToForgot}
                        className="text-[11px] text-electric-light hover:text-white transition font-medium"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Confirm Password (sign-up only) */}
            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div
                  key="confirm-field"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <label className="block text-[11px] text-slate-400 uppercase tracking-wider font-medium mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <ShieldCheck size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-11 py-2.5 rounded-xl text-sm text-white placeholder-slate-600 bg-white/[0.03] border outline-none transition ${
                        showMismatch
                          ? 'border-red-500/50 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20'
                          : confirmPassword.length > 0 && passwordsMatch
                            ? 'border-emerald-500/40 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20'
                            : 'border-white/[0.08] focus:border-electric/40 focus:ring-1 focus:ring-electric/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
                    >
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {/* Mismatch / match indicator */}
                  <AnimatePresence>
                    {confirmPassword.length > 0 && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`text-[11px] mt-1.5 flex items-center gap-1 ${
                          passwordsMatch ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {passwordsMatch ? (
                          <><CheckCircle2 size={11} /> Passwords match</>
                        ) : (
                          <><AlertCircle size={11} /> Passwords do not match</>
                        )}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isSubmitDisabled}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all mt-1"
              style={{
                background: isSubmitDisabled
                  ? 'rgba(108,99,255,0.25)'
                  : 'linear-gradient(135deg, #3b82f6, #6C63FF, #8b5cf6)',
                boxShadow: isSubmitDisabled ? 'none' : '0 0 24px rgba(108,99,255,0.25)',
              }}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
                  <ArrowRight size={14} />
                </>
              )}
            </motion.button>
          </form>

          {/* ── Divider (hide in forgot mode) ── */}
          {mode !== 'forgot' && (
            <div className="px-8 py-3">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>
            </div>
          )}

          {/* ── Google button (hide in forgot mode) ── */}
          {mode !== 'forgot' && (
            <div className="px-8 pb-5">
              <motion.button
                whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.06)' }}
                whileTap={{ scale: 0.98 }}
                disabled={googleLoading}
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2.5 h-11 rounded-xl text-sm text-white/90 font-medium disabled:opacity-50 transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {googleLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" className="flex-shrink-0">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                )}
                <span>{googleLoading ? 'Redirecting…' : 'Continue with Google'}</span>
              </motion.button>
            </div>
          )}

          {/* ── Toggle login/signup / Back to login ── */}
          <div className="px-8 pb-7 text-center">
            {mode === 'forgot' ? (
              <p className="text-xs text-slate-500">
                Remember your password?{' '}
                <button onClick={backToLogin} className="text-electric-light hover:text-white font-medium transition">
                  Back to Sign In
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button onClick={toggleMode} className="text-electric-light hover:text-white font-medium transition">
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-[10px] text-slate-600 mt-5">
          By continuing, you agree to MathLab&apos;s{' '}
          <Link href="/terms" className="text-slate-500 hover:text-white transition">Terms</Link>{' '}
          &{' '}
          <Link href="/privacy" className="text-slate-500 hover:text-white transition">Privacy Policy</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthPageContent />
    </Suspense>
  );
}
