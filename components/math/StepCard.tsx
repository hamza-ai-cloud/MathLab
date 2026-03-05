'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Lightbulb, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface StepCardProps {
  step: number;
  description: string;
  math: string;
  explanation: string;
  concept?: string;
  conceptUrdu?: string;
  index?: number;
}

export function StepCard({
  step,
  description,
  math,
  explanation,
  concept,
  conceptUrdu,
  index = 0,
}: StepCardProps) {
  const [expanded, setExpanded] = useState(true);

  // Alternate glow colors for visual depth
  const isEven = step % 2 === 0;
  const accentColor = isEven ? 'violet' : 'electric';
  const gradientFrom = isEven ? 'from-violet/20' : 'from-electric/20';
  const gradientTo = isEven ? 'to-violet/5' : 'to-electric/5';
  const borderColor = isEven ? 'border-violet/20' : 'border-electric/20';
  const numberBg = isEven
    ? 'from-violet to-violet-dark'
    : 'from-electric to-electric-dark';
  const numberShadow = isEven ? 'shadow-glow-violet' : 'shadow-glow';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`relative rounded-xl overflow-hidden border ${borderColor} backdrop-blur-sm`}
      style={{
        background:
          'linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.4) 100%)',
        boxShadow:
          '0 10px 40px -10px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Step Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full px-5 py-4 flex items-center justify-between transition-all duration-300 hover:bg-white/[0.02]`}
      >
        <div className="flex items-center gap-4 text-left">
          <motion.div
            whileHover={{ scale: 1.1, rotateY: 15 }}
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${numberBg} ${numberShadow} text-white flex items-center justify-center font-bold text-sm flex-shrink-0`}
          >
            {step}
          </motion.div>
          <div>
            <p className="font-semibold text-white text-sm">{description}</p>
            {/* Concept Badges */}
            {concept && (
              <div className="flex items-center gap-2 mt-1.5">
                <Badge variant={accentColor as any}>
                  <BookOpen size={10} />
                  {concept}
                </Badge>
                {conceptUrdu && (
                  <Badge variant="default">
                    {conceptUrdu}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={18} className="text-slate-400" />
        </motion.div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3">
              {/* Math Expression Block */}
              <div
                className={`relative p-4 rounded-lg bg-gradient-to-r ${gradientFrom} ${gradientTo} border ${borderColor} overflow-x-auto`}
              >
                <pre className="font-mono text-sm text-white/90 whitespace-pre-wrap">
                  {math}
                </pre>
                {/* Grid paper effect inside math block */}
                <div className="absolute inset-0 grid-paper opacity-30 pointer-events-none rounded-lg" />
              </div>

              {/* Explanation */}
              <div className="flex items-start gap-3 px-1">
                <div className="mt-0.5">
                  <Lightbulb
                    size={16}
                    className="text-amber-400/70"
                  />
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {explanation}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
