'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { DemoModal } from '@/components/ui/DemoModal';
import { useAuth } from '@/context/AuthContext';
import { Brain, Sparkles, ArrowRight, Zap, ImageIcon, BookOpen, Play } from 'lucide-react';

export function HeroSection() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [demoOpen, setDemoOpen] = useState(false);

  const handleStartSolving = () => {
    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      router.push('/auth');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-16 overflow-hidden">
      {/* Mesh gradient background */}
      <div className="mesh-gradient" />

      {/* Floating grid */}
      <div className="absolute inset-0 grid-paper opacity-20" />

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-electric/5 blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-violet/5 blur-3xl"
      />

      <div className="relative container mx-auto text-center max-w-5xl">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="glass rounded-full px-5 py-2 flex items-center gap-2 border border-electric/20">
            <Zap size={14} className="text-electric-light" />
            <span className="text-sm text-slate-300">
              Powered by MathLab AI
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-electric to-violet flex items-center justify-center shadow-glow">
                <Brain className="w-9 h-9 md:w-11 md:h-11 text-white" />
              </div>
            </motion.div>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-4 tracking-tight">
            Math
            <span className="text-gradient">Lab</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Solve any math problem{' '}
            <span className="text-white font-medium">instantly</span> with
            AI-powered{' '}
            <span className="text-electric-light font-medium">
              step-by-step
            </span>{' '}
            solutions
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          {/* Magnetic Start Solving Button */}
          <MagneticButton strength={0.3} radius={180}>
            <motion.div whileHover="hover">
              <Button
                variant="glow"
                size="lg"
                shimmer
                className="gap-2 text-base"
                onClick={handleStartSolving}
              >
                <Sparkles size={18} />
                Start Solving — Free
                <motion.span
                  className="inline-flex"
                  variants={{ hover: { x: 5 } }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <ArrowRight size={16} />
                </motion.span>
              </Button>
            </motion.div>
          </MagneticButton>

          {/* Watch Demo Button */}
          <motion.div whileHover="hover">
            <Button
              variant="outline"
              size="lg"
              className="text-base gap-2"
              onClick={() => setDemoOpen(true)}
            >
              <motion.span
                className="inline-flex"
                variants={{ hover: { scale: 1.2, rotate: 10 } }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Play size={16} />
              </motion.span>
              Watch Demo
            </Button>
          </motion.div>
        </motion.div>

        {/* Demo Modal */}
        <DemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {[
            { icon: Zap, label: 'Instant Solutions', color: 'electric' },
            { icon: ImageIcon, label: 'OCR Recognition', color: 'violet' },
            { icon: BookOpen, label: 'Step-by-Step', color: 'neon-cyan' },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.label}
                whileHover={{ scale: 1.05, y: -2 }}
                className="glass rounded-xl px-5 py-3 flex items-center gap-3 border border-white/5 hover:border-electric/20 transition-all"
              >
                <Icon size={18} className="text-electric-light" />
                <span className="text-sm text-slate-300">
                  {feature.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mock Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-20 perspective-1000"
        >
          <motion.div
            whileHover={{ rotateX: -5, rotateY: 3, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="glass-card rounded-2xl p-1 shadow-depth max-w-4xl mx-auto border border-white/10"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="rounded-xl overflow-hidden bg-deep-50 relative">
              {/* Mock header bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
                <div className="flex-1 text-center">
                  <div className="inline-block glass rounded-lg px-20 py-1.5 text-xs text-slate-500">
                    mathlab.ai/solver
                  </div>
                </div>
              </div>

              {/* Mock content */}
              <div className="grid grid-cols-2 gap-4 p-6 min-h-[300px]">
                {/* Left: Input */}
                <div className="glass rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-electric to-violet" />
                    <div className="h-3 w-24 bg-slate-700 rounded" />
                  </div>
                  <div className="h-24 glass rounded-lg grid-paper p-3">
                    <p className="text-sm font-mono text-electric-light">
                      x² + 5x + 6 = 0
                    </p>
                  </div>
                  <div className="h-9 bg-gradient-to-r from-electric/30 to-violet/30 rounded-lg shimmer-btn" />
                </div>

                {/* Right: Output */}
                <div className="glass rounded-xl p-4 space-y-3 grid-paper">
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-20 bg-slate-700 rounded" />
                    <div className="h-5 w-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full" />
                  </div>
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + i * 0.2 }}
                      className="glass rounded-lg p-3 border-l-2 border-electric/30 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-electric/20 flex items-center justify-center text-[10px] text-electric-light font-bold">
                          {i}
                        </div>
                        <div className="h-2 w-32 bg-slate-700 rounded" />
                      </div>
                      <div className="h-2 w-full bg-slate-700/50 rounded" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
