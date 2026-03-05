'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  icon,
  className = '',
  ...props
}: InputProps) {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 glass-input rounded-xl text-white placeholder-slate-500 focus:outline-none ${
            error ? 'border-red-500/50 focus:border-red-500/80' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-400 mt-1.5 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-400" />
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-slate-500 mt-1.5">{helperText}</p>
      )}
    </motion.div>
  );
}
