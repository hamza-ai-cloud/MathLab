'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

/**
 * Wrap any route/layout with this component to require authentication.
 * Redirects to /auth when user is not logged in (after loading finishes).
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace('/auth');
    }
  }, [isLoggedIn, loading, router]);

  /* Show branded spinner while checking session */
  if (loading || !isLoggedIn) {
    return (
      <div className="min-h-screen bg-deep flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-electric to-violet flex items-center justify-center shadow-glow mx-auto mb-4">
            <Brain className="w-7 h-7 text-white animate-pulse" />
          </div>
          <p className="text-sm text-slate-400">
            {loading ? 'Checking session…' : 'Redirecting to login…'}
          </p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
