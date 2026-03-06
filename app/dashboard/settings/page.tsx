'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import {
  User,
  Mail,
  Shield,
  Bell,
  BellOff,
  Palette,
  Monitor,
  Moon,
  Sun,
  Globe,
  LogOut,
  Trash2,
  ChevronRight,
  Crown,
  Sparkles,
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Zap,
  BookOpen,
  Check,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════
   Settings Page — Profile, Preferences, Account
   ═══════════════════════════════════════════════════ */
function SettingsPageContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ── Password reset state ── */
  const isPasswordReset = searchParams.get('password_reset') === 'true';
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showPasswordSection, setShowPasswordSection] = useState(isPasswordReset);

  /* ── Local preference state (mock — persist to Supabase later) ── */
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [language, setLanguage] = useState('en');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const initials = (user?.name || 'S')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen">
      <DashboardHeader />

      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric/20 to-violet/20 flex items-center justify-center">
              <SettingsIcon size={20} className="text-electric-light" />
            </div>
            Settings
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your profile, preferences, and account
          </p>
        </motion.div>

        {/* ══════════════════════════════════════
           SECTION 1 — Profile
           ══════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <User size={16} className="text-electric-light" />
              <h2 className="text-lg font-bold text-white">Profile</h2>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar */}
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-2xl object-cover shadow-glow border-2 border-electric/20"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-electric to-violet flex items-center justify-center shadow-glow text-xl font-bold text-white">
                  {initials}
                </div>
              )}

              <div className="flex-1 space-y-3 w-full">
                {/* Name */}
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">
                    Full Name
                  </label>
                  <div className="glass-input rounded-xl px-4 py-2.5 text-sm text-white flex items-center gap-2">
                    <User size={14} className="text-slate-500" />
                    {user?.name || 'Student'}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">
                    Email
                  </label>
                  <div className="glass-input rounded-xl px-4 py-2.5 text-sm text-white flex items-center gap-2">
                    <Mail size={14} className="text-slate-500" />
                    {user?.email || 'student@mathlab.ai'}
                  </div>
                </div>

                {/* Auth provider */}
                <div className="flex items-center gap-2">
                  <Shield size={12} className="text-slate-500" />
                  <span className="text-xs text-slate-500">
                    Signed in with
                  </span>
                  <Badge variant="info">
                    <svg className="w-3 h-3" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* ══════════════════════════════════════
           SECTION 1.5 — Change Password
           ══════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-amber-400" />
                <h2 className="text-lg font-bold text-white">Password</h2>
                {isPasswordReset && (
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/20">
                    Action Required
                  </span>
                )}
              </div>
              {!showPasswordSection && (
                <button
                  onClick={() => setShowPasswordSection(true)}
                  className="text-xs text-electric-light hover:text-white transition font-medium"
                >
                  Change Password
                </button>
              )}
            </div>

            <AnimatePresence>
              {showPasswordSection && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {isPasswordReset && (
                    <p className="text-sm text-amber-300/80 mb-4">
                      You arrived here from a password reset link. Please set your new password below.
                    </p>
                  )}

                  <AnimatePresence mode="wait">
                    {passwordError && (
                      <motion.div
                        key="pw-error"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] text-red-300 bg-red-500/10 border border-red-500/20 mb-3"
                      >
                        <AlertCircle size={13} />
                        <span>{passwordError}</span>
                      </motion.div>
                    )}
                    {passwordSuccess && (
                      <motion.div
                        key="pw-success"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 mb-3"
                      >
                        <CheckCircle2 size={13} />
                        <span>{passwordSuccess}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">New Password</label>
                      <div className="relative">
                        <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password (min 6 characters)"
                          className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm text-white placeholder-slate-600 bg-white/[0.03] border border-white/[0.08] focus:border-electric/40 focus:ring-1 focus:ring-electric/20 outline-none transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
                        >
                          {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">Confirm New Password</label>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className={`w-full pl-4 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-600 bg-white/[0.03] border outline-none transition ${
                          confirmNewPassword.length > 0 && newPassword !== confirmNewPassword
                            ? 'border-red-500/50'
                            : confirmNewPassword.length > 0 && newPassword === confirmNewPassword
                              ? 'border-emerald-500/40'
                              : 'border-white/[0.08] focus:border-electric/40 focus:ring-1 focus:ring-electric/20'
                        }`}
                      />
                    </div>

                    <div className="flex gap-3 pt-1">
                      <button
                        disabled={passwordLoading || newPassword.length < 6 || newPassword !== confirmNewPassword}
                        onClick={async () => {
                          setPasswordError('');
                          setPasswordSuccess('');
                          setPasswordLoading(true);
                          try {
                            const supabase = createClient();
                            const { error } = await supabase.auth.updateUser({ password: newPassword });
                            if (error) {
                              console.error('[MathLab Auth] updateUser password error:', error.message);
                              setPasswordError(error.message);
                            } else {
                              console.log('[MathLab Auth] Password updated successfully');
                              setPasswordSuccess('Password updated successfully!');
                              setNewPassword('');
                              setConfirmNewPassword('');
                              // Remove the query param without reload
                              if (isPasswordReset) {
                                window.history.replaceState({}, '', '/dashboard/settings');
                              }
                            }
                          } catch (err) {
                            console.error('[MathLab Auth] Unexpected error updating password:', err);
                            setPasswordError('Something went wrong. Please try again.');
                          }
                          setPasswordLoading(false);
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                          background: (passwordLoading || newPassword.length < 6 || newPassword !== confirmNewPassword)
                            ? 'rgba(108,99,255,0.25)'
                            : 'linear-gradient(135deg, #3b82f6, #6C63FF, #8b5cf6)',
                          boxShadow: (passwordLoading || newPassword.length < 6 || newPassword !== confirmNewPassword)
                            ? 'none'
                            : '0 0 20px rgba(108,99,255,0.2)',
                        }}
                      >
                        {passwordLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                        {passwordLoading ? 'Updating…' : 'Update Password'}
                      </button>

                      {!isPasswordReset && (
                        <button
                          onClick={() => {
                            setShowPasswordSection(false);
                            setNewPassword('');
                            setConfirmNewPassword('');
                            setPasswordError('');
                            setPasswordSuccess('');
                          }}
                          className="px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        {/* ══════════════════════════════════════
           SECTION 2 — Appearance
           ══════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <Palette size={16} className="text-violet-light" />
              <h2 className="text-lg font-bold text-white">Appearance</h2>
            </div>

            {/* Theme selector */}
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider mb-3 block">
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { key: 'dark', icon: Moon, label: 'Dark', desc: 'Default' },
                    { key: 'light', icon: Sun, label: 'Light', desc: 'Coming soon' },
                    { key: 'system', icon: Monitor, label: 'System', desc: 'Auto' },
                  ] as const).map((t) => {
                    const Icon = t.icon;
                    const isSelected = theme === t.key;
                    return (
                      <motion.button
                        key={t.key}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setTheme(t.key)}
                        disabled={t.key === 'light'}
                        className={`relative p-4 rounded-xl text-center transition-all ${
                          isSelected
                            ? 'bg-electric/15 border border-electric/30 text-white'
                            : 'glass text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <Check size={14} className="text-electric-light" />
                          </div>
                        )}
                        <Icon size={20} className="mx-auto mb-2" />
                        <p className="text-sm font-medium">{t.label}</p>
                        <p className="text-[10px] text-slate-500">{t.desc}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">
                  Language
                </label>
                <div className="glass-input rounded-xl px-4 py-2.5 flex items-center gap-2">
                  <Globe size={14} className="text-slate-500" />
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-transparent text-sm text-white outline-none flex-1 cursor-pointer"
                  >
                    <option value="en" className="bg-slate-900">English</option>
                    <option value="ur" className="bg-slate-900">اردو (Urdu)</option>
                    <option value="hi" className="bg-slate-900">हिन्दी (Hindi)</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* ══════════════════════════════════════
           SECTION 3 — Preferences
           ══════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <Zap size={16} className="text-neon-cyan" />
              <h2 className="text-lg font-bold text-white">Preferences</h2>
            </div>

            <div className="space-y-1">
              {/* Notifications */}
              <SettingToggle
                icon={notifications ? Bell : BellOff}
                label="Notifications"
                description="Get notified about new features and tips"
                checked={notifications}
                onChange={setNotifications}
              />

              {/* Sound Effects */}
              <SettingToggle
                icon={soundEffects ? Volume2 : VolumeX}
                label="Sound Effects"
                description="Play sounds on solve completion"
                checked={soundEffects}
                onChange={setSoundEffects}
              />

              {/* Show Steps */}
              <SettingToggle
                icon={showSteps ? Eye : EyeOff}
                label="Show Step-by-Step"
                description="Always show detailed solution steps"
                checked={showSteps}
                onChange={setShowSteps}
              />
            </div>
          </Card>
        </motion.div>

        {/* ══════════════════════════════════════
           SECTION 4 — Subscription
           ══════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card glow="violet">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Crown size={16} className="text-amber-400" />
                <h2 className="text-lg font-bold text-white">Subscription</h2>
              </div>
              <Badge variant="electric">Free Plan</Badge>
            </div>

            <div className="glass rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Problems remaining</span>
                <span className="text-sm font-bold text-electric-light">5 / 10</span>
              </div>
              <div className="w-full h-2 glass rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '50%' }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-electric to-violet rounded-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {[
                'Unlimited problems',
                'Priority AI engine',
                'PDF & LaTeX export',
                'Advanced step-by-step',
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-sm text-slate-400"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                    <Check size={10} className="text-emerald-400" />
                  </div>
                  {feature}
                </div>
              ))}
            </div>

            <Button variant="glow" size="sm" shimmer className="w-full gap-2">
              <Sparkles size={14} />
              Upgrade to Pro — $9.99/mo
            </Button>
          </Card>
        </motion.div>

        {/* ══════════════════════════════════════
           SECTION 5 — Account Actions
           ══════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <Shield size={16} className="text-slate-400" />
              <h2 className="text-lg font-bold text-white">Account</h2>
            </div>

            <div className="space-y-2">
              <motion.button
                whileHover={{ x: 4 }}
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 rounded-xl glass hover:bg-white/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <LogOut size={16} className="text-red-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-red-400">Sign Out</p>
                    <p className="text-xs text-slate-500">Log out of your account</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-600 group-hover:text-red-400 transition" />
              </motion.button>

              <motion.button
                whileHover={{ x: 4 }}
                className="w-full flex items-center justify-between p-4 rounded-xl glass hover:bg-white/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Trash2 size={16} className="text-red-400/60" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-red-400/60">Delete Account</p>
                    <p className="text-xs text-slate-500">Permanently remove your data</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-600 group-hover:text-red-400/60 transition" />
              </motion.button>
            </div>
          </Card>
        </motion.div>

        {/* ── Save Button ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end pb-6"
        >
          <Button
            variant="glow"
            size="md"
            shimmer
            className="gap-2 min-w-[160px]"
            onClick={handleSave}
          >
            {saved ? (
              <>
                <Check size={16} />
                Saved!
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Save Changes
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Reusable Toggle Row ── */
function SettingToggle({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
          <Icon size={16} className="text-slate-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          checked
            ? 'bg-gradient-to-r from-electric to-violet'
            : 'bg-slate-700'
        }`}
      >
        <motion.div
          layout
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
          style={{ left: checked ? '22px' : '2px' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense>
      <SettingsPageContent />
    </Suspense>
  );
}
