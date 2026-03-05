'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brain, ArrowLeft, Zap, LayoutDashboard } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function SolverHeader() {
  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-950/60 border-b border-white/10"
    >
      <div className="w-full px-4 md:px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="!p-2">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric to-violet flex items-center justify-center shadow-glow">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white hidden sm:inline">MathLab</span>
          </Link>
          <div className="hidden sm:block w-px h-5 bg-white/10 mx-1" />
          <Badge variant="electric" pulse>
            <Zap size={10} />
            AI Tutor
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-1.5 text-slate-400 hover:text-white">
              <LayoutDashboard size={14} />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
