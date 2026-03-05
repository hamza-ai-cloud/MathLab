'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import {
  Brain,
  ArrowRight,
  Sparkles,
  Sigma,
  Pi,
  Divide,
  Plus,
  X,
  Loader2,
} from 'lucide-react';

const floatingIcons = [
  { Icon: Sigma, x: '10%', y: '15%', size: 32, delay: 0 },
  { Icon: Pi, x: '85%', y: '20%', size: 28, delay: 0.5 },
  { Icon: Divide, x: '75%', y: '75%', size: 24, delay: 1 },
  { Icon: Plus, x: '15%', y: '70%', size: 26, delay: 1.5 },
  { Icon: X, x: '90%', y: '50%', size: 20, delay: 2 },
  { Icon: Sigma, x: '50%', y: '85%', size: 22, delay: 0.8 },
];

export default function AuthPage() {
  const { signInWithGoogle } = useAuth();
  const [signingIn, setSigningIn] = useState(false);

  const handleGoogleLogin = async () => {
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch {
      setSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep relative flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Mesh gradient */}
      <div className="mesh-gradient" />

      {/* Grid paper */}
      <div className="absolute inset-0 grid-paper opacity-10" />

      {/* Floating math icons */}
      {floatingIcons.map(({ Icon, x, y, size, delay }, i) => (
        <motion.div
          key={i}
          className="absolute text-white/[0.04] pointer-events-none"
          style={{ left: x, top: y }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 15, -15, 0],
          }}
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

      {/* Auth card */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: -10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 100 }}
        className="relative w-full max-w-md"
        style={{ perspective: '1200px' }}
      >
        <div className="glass-card rounded-3xl border border-white/10 shadow-depth overflow-hidden">
          {/* Top brand section */}
          <div className="relative px-8 pt-10 pb-6 text-center">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-electric to-violet shadow-glow mb-5"
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>

            <h1 className="text-2xl font-bold text-white mb-1">
              Welcome to MathLab
            </h1>
            <p className="text-sm text-slate-400">
              Sign in with your Google account to get started
            </p>
          </div>

          {/* Google sign-in button */}
          <div className="px-8 pb-6">
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              disabled={signingIn}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl glass border border-white/10 hover:border-white/20 transition-all text-white font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleGoogleLogin}
            >
              {signingIn ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              {signingIn ? 'Redirecting to Google…' : 'Continue with Google'}
            </motion.button>
          </div>

          {/* Features preview */}
          <div className="px-8 pb-8 pt-2">
            <div className="border-t border-white/5 pt-6">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-4 text-center">What you get</p>
              <div className="space-y-3">
                {[
                  { icon: '✨', text: 'AI-powered step-by-step math solutions' },
                  { icon: '📸', text: 'Upload photos of homework problems' },
                  { icon: '💬', text: 'Ask follow-up doubts in Roman Urdu' },
                  { icon: '🚀', text: '10 free problems every day' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3 text-sm text-slate-400">
                    <span className="text-base">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-slate-600 mt-6">
          By continuing, you agree to MathLab&apos;s{' '}
          <Link href="/terms" className="text-slate-400 hover:text-white transition">
            Terms
          </Link>{' '}
          &{' '}
          <Link href="/privacy" className="text-slate-400 hover:text-white transition">
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
