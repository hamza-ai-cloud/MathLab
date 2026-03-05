'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'blue' | 'violet' | 'none';
  animate?: boolean;
  delay?: number;
}

export function Card({
  children,
  className = '',
  hover = false,
  glow = 'none',
  animate = true,
  delay = 0,
}: CardProps) {
  const glowStyles = {
    blue: 'hover:shadow-glow hover:border-electric/30',
    violet: 'hover:shadow-glow-violet hover:border-violet/30',
    none: '',
  };

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      whileHover={
        hover
          ? { scale: 1.02, rotateY: 3, rotateX: -2, z: 20 }
          : undefined
      }
      className={`glass-card rounded-2xl p-6 ${glowStyles[glow]} transition-all duration-300 ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
}
