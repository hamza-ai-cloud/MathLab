'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Zap, Check, Crown, Sparkles } from 'lucide-react';

export function SubscriptionStatus() {
  // TODO: fetch from user's subscription data
  const plan = 'free' as 'free' | 'pro';
  const solvesRemaining = 5;
  const totalSolves = 10;
  const percentage = (solvesRemaining / totalSolves) * 100;

  return (
    <Card glow="violet">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown size={18} className="text-amber-400" />
            <h3 className="font-bold text-white">Your Plan</h3>
          </div>
          <Badge variant={plan === 'pro' ? 'success' : 'electric'}>
            {plan.charAt(0).toUpperCase() + plan.slice(1)}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">Problems Remaining</p>
            <p className="text-xs text-electric-light font-semibold">
              {solvesRemaining}/{totalSolves}
            </p>
          </div>
          <div className="w-full h-2 glass rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-electric to-violet rounded-full"
            />
          </div>
        </div>

        {/* Pro Features */}
        <div className="border-t border-white/5 pt-4">
          <h4 className="font-semibold text-white mb-3 text-sm">Pro Features</h4>
          <ul className="space-y-2.5">
            {[
              'Unlimited problems',
              'Advanced step-by-step',
              'PDF & LaTeX export',
              'Priority AI engine',
            ].map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2.5 text-sm text-slate-400"
              >
                <div className="w-4 h-4 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                  <Check size={10} className="text-emerald-400" />
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <Button variant="glow" size="sm" shimmer className="w-full gap-2">
          <Sparkles size={14} />
          Upgrade to Pro
        </Button>
      </div>
    </Card>
  );
}
