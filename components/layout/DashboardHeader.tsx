'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, LogOut, History, ChevronDown, Menu, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const { toggle } = useSidebar();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => { setMenuOpen(false); await logout(); router.push('/'); };

  const initials = (user?.name || 'S').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header
      className="border-b border-white/[0.04] sticky top-0 z-30"
      style={{ background: 'rgba(8,5,18,0.7)', backdropFilter: 'blur(20px)' }}
    >
      <div className="px-3 sm:px-5 py-2.5 flex items-center justify-between">
        {/* Left: hamburger + title */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="lg:hidden p-1.5 -ml-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </button>
          <h1 className="text-sm font-semibold text-white">Dashboard</h1>
        </div>

        {/* Right: search + bell + profile */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="hidden md:flex items-center gap-1.5 rounded-lg px-2.5 py-1.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Search size={12} className="text-slate-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-xs text-white placeholder-slate-500 outline-none w-32"
            />
          </div>

          <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition relative">
            <Bell size={16} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-electric rounded-full" />
          </button>

          {/* Avatar + Dropdown */}
          <div ref={menuRef} className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-white/5 transition-colors"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-white/10"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-electric to-violet flex items-center justify-center text-[10px] font-bold text-white">
                  {initials}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-xs font-medium text-white leading-tight">
                  {user?.name || 'Student'}
                </p>
                <p className="text-[9px] text-slate-500 leading-tight">
                  {user?.email || 'student@mathlab.ai'}
                </p>
              </div>
              <ChevronDown size={12} className={`text-slate-400 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-white/10 shadow-depth py-1.5 z-50"
                  style={{ background: 'rgba(15,10,30,0.95)', backdropFilter: 'blur(20px)' }}
                >
                  {/* Profile name in dropdown */}
                  <div className="px-4 py-2 border-b border-white/[0.06] sm:hidden">
                    <p className="text-xs font-medium text-white">{user?.name || 'Student'}</p>
                    <p className="text-[10px] text-slate-500">{user?.email}</p>
                  </div>

                  <button
                    onClick={() => { setMenuOpen(false); router.push('/dashboard/settings'); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <User size={13} />
                    My Profile
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); router.push('/dashboard/history'); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <History size={13} />
                    Past Solutions
                  </button>
                  <div className="my-1 mx-3 h-px bg-white/[0.06]" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={13} />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
