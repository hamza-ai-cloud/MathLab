'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { Brain, Sparkles, Menu, X, ArrowRight, LayoutDashboard } from 'lucide-react';

const navLinks = [
  { label: 'Features', href: '/#features', scroll: true },
  { label: 'About', href: '/about', scroll: false },
  { label: 'Blog', href: '/blog', scroll: false },
  { label: 'Contact', href: '/contact', scroll: false },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Close mobile menu on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* Prevent body scroll when menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNavClick = (e: React.MouseEvent, link: typeof navLinks[0]) => {
    setMobileOpen(false);
    if (link.scroll) {
      if (pathname === '/') {
        e.preventDefault();
        const id = link.href.replace('/#', '');
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-950/50 border-b border-white/10"
      >
        <nav className="w-full px-6 md:px-12 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-electric to-violet flex items-center justify-center shadow-glow"
            >
              <Brain className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold text-white group-hover:text-gradient transition-all">
              MathLab
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = !link.scroll && pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`text-sm transition-colors relative group cursor-pointer ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-electric to-violet transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Button
                variant="primary"
                size="sm"
                className="gap-2"
                onClick={() => router.push('/dashboard')}
              >
                <LayoutDashboard size={14} />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            ) : (
              <>
                <motion.div whileHover="hover" className="hidden sm:block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => router.push('/auth')}
                  >
                    <Sparkles size={14} />
                    Try Free
                    <motion.span
                      variants={{ hover: { x: 3 } }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <ArrowRight size={13} />
                    </motion.span>
                  </Button>
                </motion.div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => router.push('/auth')}
                >
                  Sign In
                </Button>
              </>
            )}

            {/* Hamburger toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* ═══ Mobile Menu Overlay ═══ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 z-50 h-full w-72 glass-strong border-l border-white/10 p-6 flex flex-col md:hidden"
            >
              {/* Close */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric to-violet flex items-center justify-center shadow-glow">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-bold text-white">MathLab</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex flex-col gap-1 flex-1">
                {navLinks.map((link, i) => {
                  const isActive = !link.scroll && pathname === link.href;
                  return (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link)}
                        className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? 'text-white bg-gradient-to-r from-electric/15 to-violet/10 border border-electric/20'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* CTA Buttons */}
              <div className="space-y-3 pt-6 border-t border-white/10">
                {isLoggedIn ? (
                  <Button
                    variant="glow"
                    size="sm"
                    shimmer
                    className="w-full gap-2"
                    onClick={() => { setMobileOpen(false); router.push('/dashboard'); }}
                  >
                    <LayoutDashboard size={14} />
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="glow"
                      size="sm"
                      shimmer
                      className="w-full gap-2"
                      onClick={() => { setMobileOpen(false); router.push('/auth'); }}
                    >
                      <Sparkles size={14} />
                      Try Free
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => { setMobileOpen(false); router.push('/auth'); }}
                    >
                      Sign In
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
