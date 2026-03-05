'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'electric' | 'violet';
  className?: string;
  pulse?: boolean;
}

export function Badge({
  children,
  variant = 'default',
  className = '',
  pulse = false,
}: BadgeProps) {
  const variants = {
    default: 'bg-slate-700/50 text-slate-300 border-slate-600/30',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    error: 'bg-red-500/15 text-red-400 border-red-500/30',
    info: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    electric: 'bg-electric/15 text-electric-glow border-electric/30',
    violet: 'bg-violet/15 text-violet-glow border-violet/30',
  };

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${variants[variant]} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {children}
    </motion.span>
  );
}
