'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Sparkles } from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoModal({ isOpen, onClose }: DemoModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal content */}
          <motion.div
            className="relative w-full max-w-2xl"
            initial={{ opacity: 0, scale: 0.85, rotateX: -15, y: 60 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateX: 10, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{ perspective: '1200px' }}
          >
            <div className="glass-card rounded-3xl border border-white/10 shadow-depth overflow-hidden">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full glass flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={18} />
              </button>

              {/* Video placeholder area */}
              <div className="relative aspect-video bg-gradient-to-br from-deep via-deep-50 to-deep flex items-center justify-center overflow-hidden">
                {/* Mesh gradient backdrop */}
                <div className="absolute inset-0">
                  <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-electric/15 blur-[80px]" />
                  <div className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full bg-violet/15 blur-[80px]" />
                </div>

                {/* Grid paper overlay */}
                <div className="absolute inset-0 grid-paper opacity-10" />

                {/* Play button */}
                <motion.div
                  className="relative z-10 flex flex-col items-center gap-6"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  <motion.div
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-electric to-violet flex items-center justify-center shadow-glow cursor-pointer"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(59,130,246,0.3)',
                        '0 0 40px rgba(59,130,246,0.5)',
                        '0 0 20px rgba(59,130,246,0.3)',
                      ],
                    }}
                    transition={{
                      boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                    }}
                  >
                    <Play size={30} className="text-white ml-1" />
                  </motion.div>

                  <div className="text-center">
                    <p className="text-white font-bold text-lg mb-1">Demo Coming Soon</p>
                    <p className="text-slate-400 text-sm">
                      We&apos;re crafting something magical ✨
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Bottom bar */}
              <div className="px-6 py-5 flex items-center justify-between border-t border-white/5">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-electric-light" />
                  <span className="text-sm text-slate-400">
                    Full walkthrough of MathLab AI Solver
                  </span>
                </div>
                <motion.span
                  className="text-xs font-semibold px-3 py-1 rounded-full bg-violet/15 text-violet-light border border-violet/20"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Coming Soon
                </motion.span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
