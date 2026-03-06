'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Sparkles, ArrowRight } from 'lucide-react';

export function CTASection() {
  const router = useRouter();

  return (
    <section id="pricing" className="relative py-28 px-4 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-electric/5 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-electric/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-violet/8 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative container mx-auto max-w-3xl text-center"
      >
        <div className="glass-card rounded-3xl p-12 md:p-16 border border-electric/15 shadow-depth">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Ready to Master{' '}
            <span className="text-gradient">Math?</span>
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-md mx-auto">
            Start solving problems for free today. No credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover="hover">
              <Button
                variant="glow"
                size="lg"
                shimmer
                className="gap-2"
                onClick={() => router.push('/auth')}
              >
                <Sparkles size={18} />
                Get Started Free
                <motion.span
                  className="inline-flex"
                  variants={{ hover: { x: 5 } }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <ArrowRight size={16} />
                </motion.span>
              </Button>
            </motion.div>
          </div>

          <p className="text-xs text-slate-500 mt-6">
            ✨ Free to get started • Sign up in seconds
          </p>
        </div>
      </motion.div>
    </section>
  );
}
