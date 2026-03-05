'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

type MotionButtonProps = HTMLMotionProps<'button'>;

interface ButtonProps extends Omit<MotionButtonProps, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  shimmer?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  shimmer = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'relative font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer overflow-hidden';

  const variants = {
    primary:
      'bg-gradient-to-r from-electric to-violet text-white shadow-glow hover:shadow-glow-lg disabled:opacity-40',
    secondary:
      'glass text-white hover:bg-white/10 disabled:opacity-40',
    outline:
      'border border-electric/30 text-electric-light hover:bg-electric/10 hover:border-electric/50 disabled:opacity-40',
    ghost:
      'text-slate-300 hover:text-white hover:bg-white/5 disabled:opacity-40',
    glow: 'bg-gradient-to-r from-electric via-violet to-neon-cyan text-white shadow-glow hover:shadow-glow-lg disabled:opacity-40',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };

  return (
    <motion.button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      whileHover={{ scale: 1.03, rotateY: 2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {/* Shimmer overlay */}
      {(shimmer || loading) && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </div>
      )}

      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}
