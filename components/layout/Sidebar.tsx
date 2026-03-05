'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';
import {
  Home,
  Calculator,
  BarChart3,
  Settings,
  LogOut,
  Brain,
  Crown,
  X,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { open, close } = useSidebar();

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard#canvas', label: 'Solver', icon: Calculator },
    { href: '/dashboard/history', label: 'History', icon: BarChart3 },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  /* Shared sidebar content */
  const content = (
    <div className="flex flex-col h-full">
      {/* Logo + Close (mobile only) */}
      <div className="flex items-center justify-between px-3 py-4 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric to-violet flex items-center justify-center shadow-glow">
            <Brain size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-none">MathLab</h1>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">AI Solver</p>
          </div>
        </div>
        <button
          onClick={close}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
          aria-label="Close sidebar"
        >
          <X size={16} />
        </button>
      </div>

      {/* Navigation — takes available space */}
      <nav className="flex-1 space-y-0.5 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === '/dashboard#canvas' && pathname === '/dashboard');
          return (
            <Link key={item.label} href={item.href} onClick={close}>
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-200 relative group ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-gradient-to-r from-electric/12 to-violet/8 rounded-lg border border-electric/15"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-electric rounded-full" />
                )}
                <Icon size={16} className="relative z-10" />
                <span className="relative z-10 font-medium text-sm">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section — Pro + Logout pinned to bottom */}
      <div className="mt-auto px-2 pb-3 space-y-2">
        {/* Slim Pro Upgrade */}
        <div className="rounded-lg px-3 py-2.5 border border-violet/15 relative overflow-hidden" style={{ background: 'rgba(139,92,246,0.06)' }}>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown size={13} className="text-amber-400" />
              <div>
                <span className="text-xs font-semibold text-white">Go Pro</span>
                <p className="text-[9px] text-slate-500 leading-tight">Unlimited solves</p>
              </div>
            </div>
            <button className="px-2.5 py-1 text-[10px] font-semibold text-white bg-gradient-to-r from-violet to-electric rounded-md hover:opacity-90 transition">
              Upgrade
            </button>
          </div>
        </div>

        {/* Logout */}
        <motion.button
          whileHover={{ x: 2 }}
          onClick={async () => { await logout(); close(); router.push('/'); }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-500 hover:text-red-400 w-full transition-colors text-sm"
        >
          <LogOut size={15} />
          <span className="font-medium">Logout</span>
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar (slimmer at 240px) ── */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="hidden lg:flex w-60 min-h-screen flex-col glass-strong border-r border-white/5 relative"
      >
        {content}
      </motion.aside>

      {/* ── Mobile sidebar drawer ── */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 z-50 w-60 h-full flex flex-col glass-strong border-r border-white/10 lg:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
