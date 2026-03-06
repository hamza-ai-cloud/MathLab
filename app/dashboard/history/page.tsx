'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  MessageSquare,
  FileText,
  HelpCircle,
  ArrowRight,
  Brain,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  ChevronDown,
  BarChart3,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { fetchHistory, deleteHistoryEntry, clearHistory, type HistoryEntry } from '@/lib/supabase/history';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* ═══════════════════════════════════════════════════
   History Page — Supabase-backed Solve Sessions
   ═══════════════════════════════════════════════════ */
export default function HistoryPage() {
  const [sessions, setSessions] = useState<HistoryEntry[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  /* ── Fetch history from Supabase ── */
  const loadHistory = useCallback(async () => {
    setLoadingData(true);
    const data = await fetchHistory();
    setSessions(data);
    setLoadingData(false);
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  /* ── Delete single entry ── */
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteHistoryEntry(id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
    setDeletingId(null);
  };

  /* ── Clear all ── */
  const handleClearAll = async () => {
    if (!confirm('Delete all history? This cannot be undone.')) return;
    setClearing(true);
    await clearHistory();
    setSessions([]);
    setClearing(false);
  };

  /* ── Derive unique topics for filter ── */
  const topics = ['All', ...Array.from(new Set(sessions.map((s) => s.topic).filter(Boolean)))];

  const filtered = sessions.filter((s) => {
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.problem.toLowerCase().includes(search.toLowerCase()) ||
      (s.topic || '').toLowerCase().includes(search.toLowerCase());
    const matchTopic = selectedTopic === 'All' || s.topic === selectedTopic;
    return matchSearch && matchTopic;
  });

  const solvedCount = sessions.filter((s) => s.answer).length;

  return (
    <div className="min-h-screen">
      <DashboardHeader />

      <div className="p-4 sm:p-6 space-y-6">
        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric/20 to-violet/20 flex items-center justify-center">
                <BarChart3 size={20} className="text-electric-light" />
              </div>
              Session History
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {loadingData ? 'Loading…' : `${sessions.length} solved problem${sessions.length !== 1 ? 's' : ''} saved`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadHistory} className="gap-1.5">
              <RefreshCw size={13} />
              Refresh
            </Button>
            {sessions.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleClearAll} disabled={clearing} className="gap-1.5 text-red-400 border-red-500/20 hover:bg-red-500/10">
                {clearing ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                Clear All
              </Button>
            )}
            <Link href="/dashboard">
              <Button variant="glow" size="sm" shimmer className="gap-2">
                <Brain size={14} />
                New Session
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* ── Quick Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Sessions', value: sessions.length, icon: MessageSquare, color: 'from-electric to-electric-dark' },
            { label: 'With Steps', value: sessions.filter((s) => s.steps && s.steps.length > 0).length, icon: HelpCircle, color: 'from-violet to-violet-dark' },
            { label: 'Solved', value: solvedCount, icon: CheckCircle2, color: 'from-emerald-500 to-emerald-600' },
            { label: 'File Uploads', value: sessions.filter((s) => s.has_file).length, icon: FileText, color: 'from-amber-500 to-amber-600' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} delay={i * 0.08}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">{stat.label}</p>
                    <p className="text-lg font-bold text-white">{stat.value}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* ── Search & Filters ── */}
        <Card animate={false} className="!p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 glass-input rounded-xl px-4 py-2.5">
              <Search size={16} className="text-slate-500 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search sessions, topics, or problems..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-full"
              />
            </div>
            {topics.length > 2 && (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  showFilters
                    ? 'bg-electric/15 text-electric-light border border-electric/30'
                    : 'glass text-slate-300 hover:text-white'
                }`}
              >
                <Filter size={15} />
                Filters
                <ChevronDown size={14} className={`transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
              </motion.button>
            )}
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-4">
                  <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Topic</p>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((topic) => (
                      <motion.button
                        key={topic}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedTopic(topic)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedTopic === topic
                            ? 'bg-electric/20 text-electric-light border border-electric/30'
                            : 'glass text-slate-400 hover:text-white'
                        }`}
                      >
                        {topic}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* ── Results Count ── */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Showing <span className="text-white font-semibold">{filtered.length}</span> of{' '}
            <span className="text-white font-semibold">{sessions.length}</span> sessions
          </p>
        </div>

        {/* ── Loading state ── */}
        {loadingData && (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-electric-light" />
          </div>
        )}

        {/* ── Session List ── */}
        {!loadingData && (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((session, i) => (
                <motion.div
                  key={session.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.01, x: 4 }}
                    className="glass-card rounded-xl p-5 group transition-all duration-300 hover:border-electric/20"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-electric/15 to-violet/15 flex items-center justify-center flex-shrink-0">
                            {session.has_file ? (
                              <FileText size={16} className="text-violet-light" />
                            ) : (
                              <MessageSquare size={16} className="text-electric-light" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-white group-hover:text-electric-light transition-colors truncate">
                              {session.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] text-slate-500 bg-white/5 px-2 py-0.5 rounded">
                                {session.topic || 'General'}
                              </span>
                              {session.has_file && session.file_name && (
                                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                  <FileText size={9} /> {session.file_name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-slate-400 truncate pl-12">
                          {session.problem}
                        </p>

                        {session.answer && (
                          <p className="text-xs text-emerald-400/80 truncate pl-12 mt-1">
                            Answer: {session.answer}
                          </p>
                        )}

                        <div className="flex items-center gap-4 mt-2.5 pl-12">
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Calendar size={10} />
                            {formatDate(session.created_at)}
                          </span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(session.created_at).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </span>
                          {session.steps && session.steps.length > 0 && (
                            <span className="text-[11px] text-slate-500 flex items-center gap-1">
                              <HelpCircle size={10} />
                              {session.steps.length} steps
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {session.answer ? (
                          <Badge variant="success">
                            <CheckCircle2 size={10} />
                            Solved
                          </Badge>
                        ) : (
                          <Badge variant="warning">
                            <XCircle size={10} />
                            Partial
                          </Badge>
                        )}
                        <button
                          onClick={() => handleDelete(session.id)}
                          disabled={deletingId === session.id}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition opacity-0 group-hover:opacity-100"
                        >
                          {deletingId === session.id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Trash2 size={13} />
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* ── Empty State ── */}
        {!loadingData && sessions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-xl p-12 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-electric/10 to-violet/10 flex items-center justify-center mx-auto mb-4">
              <Brain size={24} className="text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No history yet</h3>
            <p className="text-sm text-slate-400 mb-4">
              Solve your first problem and it will appear here automatically.
            </p>
            <Link href="/dashboard">
              <Button variant="glow" size="sm" shimmer className="gap-2">
                <Sparkles size={14} />
                Start Solving
              </Button>
            </Link>
          </motion.div>
        )}

        {/* ── No search results ── */}
        {!loadingData && sessions.length > 0 && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-xl p-12 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-electric/10 to-violet/10 flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No sessions found</h3>
            <p className="text-sm text-slate-400 mb-4">Try adjusting your search or filters</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch('');
                setSelectedTopic('All');
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}

        {/* ── Start New Session CTA ── */}
        {!loadingData && sessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-xl p-6 border border-dashed border-electric/20 text-center"
          >
            <Sparkles size={24} className="text-electric-light mx-auto mb-3" />
            <p className="text-white font-medium mb-1">Need help with another problem?</p>
            <p className="text-sm text-slate-400 mb-4">
              Start a new session and get instant step-by-step solutions
            </p>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="gap-2">
                <Brain size={14} />
                Start New Session
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
