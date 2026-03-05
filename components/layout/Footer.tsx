'use client';

import React from 'react';
import Link from 'next/link';
import { Brain } from 'lucide-react';

export function Footer() {
  return (
    <footer id="about" className="relative border-t border-white/5">
      <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep-50/80 to-transparent" />

      <div className="relative container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric to-violet flex items-center justify-center">
                <Brain size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold text-white">MathLab</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              AI-powered math solving with step-by-step solutions for students worldwide.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Product</h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li><Link href="/solver" className="hover:text-electric-light transition">Solver</Link></li>
              <li><Link href="/dashboard" className="hover:text-electric-light transition">Dashboard</Link></li>
              <li><Link href="/pricing" className="hover:text-electric-light transition">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Company</h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li><Link href="/about" className="hover:text-electric-light transition">About</Link></li>
              <li><Link href="/blog" className="hover:text-electric-light transition">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-electric-light transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Legal</h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li><Link href="/privacy" className="hover:text-electric-light transition">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-electric-light transition">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            &copy; 2024 MathLab. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Built with ❤️ for students worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
