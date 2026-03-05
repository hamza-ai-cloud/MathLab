'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

/* ── Mock history data ── */
const allSessions = [
  {
    id: 1,
    title: 'Quadratic Equations',
    topic: 'Algebra',
    lastMessage: 'Yeh step kyun kiya? Mujhe samajh nahi aaya.',
    doubts: 3,
    date: '2025-01-15T14:30:00',
    status: 'active' as const,
    hasFile: false,
    solved: true,
  },
  {
    id: 2,
    title: 'Integration by Parts',
    topic: 'Calculus',
    lastMessage: '∫ x·eˣ dx — can you explain the LIATE rule?',
    doubts: 5,
    date: '2025-01-14T09:20:00',
    status: 'resolved' as const,
    hasFile: false,
    solved: true,
  },
  {
    id: 3,
    title: 'Uploaded: homework_pg3.pdf',
    topic: 'Mixed',
    lastMessage: 'Please solve all problems on this page',
    doubts: 2,
    date: '2025-01-13T16:45:00',
    status: 'resolved' as const,
    hasFile: true,
    solved: true,
  },
  {
    id: 4,
    title: 'Matrix Determinants',
    topic: 'Linear Algebra',
    lastMessage: 'det([[1,2],[3,4]]) — 3x3 matrix bhi karo',
    doubts: 4,
    date: '2025-01-12T11:00:00',
    status: 'resolved' as const,
    hasFile: false,
    solved: true,
  },
  {
    id: 5,
    title: 'Probability Distributions',
    topic: 'Statistics',
    lastMessage: 'Normal distribution ka area kaise calculate karna hai?',
    doubts: 6,
    date: '2025-01-11T20:15:00',
    status: 'resolved' as const,
    hasFile: false,
    solved: true,
  },
  {
    id: 6,
    title: 'Trigonometric Identities',
    topic: 'Trigonometry',
    lastMessage: 'sin²θ + cos²θ = 1 se aage kaise jaayein?',
    doubts: 3,
    date: '2025-01-10T08:30:00',
    status: 'resolved' as const,
    hasFile: false,
    solved: true,
  },
  {
    id: 7,
    title: 'Complex Numbers',
    topic: 'Algebra',
    lastMessage: 'i² = -1 but what about i³?',
    doubts: 2,
    date: '2025-01-09T13:00:00',
    status: 'resolved' as const,
    hasFile: false,
    solved: false,
  },
  {
    id: 8,
    title: 'Uploaded: exam_prep.pdf',
    topic: 'Mixed',
    lastMessage: 'Solve Q1-Q5 from the paper',
    doubts: 8,
    date: '2025-01-08T17:40:00',
    status: 'resolved' as const,
    hasFile: true,
    solved: true,
  },
];

const topics = ['All', 'Algebra', 'Calculus', 'Linear Algebra', 'Statistics', 'Trigonometry', 'Mixed'];

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
   History Page — Past Solve Sessions
   ═══════════════════════════════════════════════════ */
export default function HistoryPage() {
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = allSessions.filter((s) => {
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.lastMessage.toLowerCase().includes(search.toLowerCase()) ||
      s.topic.toLowerCase().includes(search.toLowerCase());
    const matchTopic = selectedTopic === 'All' || s.topic === selectedTopic;
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchTopic && matchStatus;
  });

  const totalDoubts = allSessions.reduce((a, s) => a + s.doubts, 0);
  const solvedCount = allSessions.filter((s) => s.solved).length;

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
              Review your past doubt sessions and solutions
            </p>
          </div>
          <Link href="/solver">
            <Button variant="glow" size="sm" shimmer className="gap-2">
              <Brain size={14} />
              New Session
            </Button>
          </Link>
        </motion.div>

        {/* ── Quick Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Sessions', value: allSessions.length, icon: MessageSquare, color: 'from-electric to-electric-dark' },
            { label: 'Total Doubts', value: totalDoubts, icon: HelpCircle, color: 'from-violet to-violet-dark' },
            { label: 'Solved', value: solvedCount, icon: CheckCircle2, color: 'from-emerald-500 to-emerald-600' },
            { label: 'Unsolved', value: allSessions.length - solvedCount, icon: XCircle, color: 'from-amber-500 to-amber-600' },
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
            {/* Search */}
            <div className="flex-1 flex items-center gap-2 glass-input rounded-xl px-4 py-2.5">
              <Search size={16} className="text-slate-500 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search sessions, topics, or messages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-full"
              />
            </div>

            {/* Filter toggle */}
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
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}
              />
            </motion.button>
          </div>

          {/* Expandable filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-3">
                  {/* Topic tags */}
                  <div>
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

                  {/* Status filter */}
                  <div>
                    <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Status</p>
                    <div className="flex gap-2">
                      {([
                        { key: 'all', label: 'All' },
                        { key: 'active', label: 'Active' },
                        { key: 'resolved', label: 'Resolved' },
                      ] as const).map((f) => (
                        <motion.button
                          key={f.key}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setStatusFilter(f.key)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            statusFilter === f.key
                              ? 'bg-violet/20 text-violet-glow border border-violet/30'
                              : 'glass text-slate-400 hover:text-white'
                          }`}
                        >
                          {f.label}
                        </motion.button>
                      ))}
                    </div>
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
            <span className="text-white font-semibold">{allSessions.length}</span> sessions
          </p>
        </div>

        {/* ── Session List ── */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((session, i) => (
              <motion.div
                key={session.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href="/solver">
                  <motion.div
                    whileHover={{ scale: 1.01, x: 4 }}
                    className="glass-card rounded-xl p-5 cursor-pointer group transition-all duration-300 hover:border-electric/20"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-electric/15 to-violet/15 flex items-center justify-center flex-shrink-0">
                            {session.hasFile ? (
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
                                {session.topic}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-slate-400 truncate pl-12">
                          {session.lastMessage}
                        </p>

                        <div className="flex items-center gap-4 mt-2.5 pl-12">
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Calendar size={10} />
                            {formatDate(session.date)}
                          </span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(session.date).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <HelpCircle size={10} />
                            {session.doubts} doubts
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {session.solved ? (
                          <Badge variant="success">
                            <CheckCircle2 size={10} />
                            Solved
                          </Badge>
                        ) : (
                          <Badge variant="warning">
                            <XCircle size={10} />
                            Unsolved
                          </Badge>
                        )}
                        {session.status === 'active' && (
                          <Badge variant="electric" pulse>Active</Badge>
                        )}
                        <ArrowRight size={14} className="text-slate-600 group-hover:text-electric-light transition" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ── Empty State ── */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-xl p-12 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-electric/10 to-violet/10 flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No sessions found</h3>
            <p className="text-sm text-slate-400 mb-4">
              Try adjusting your search or filters
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch('');
                setSelectedTopic('All');
                setStatusFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}

        {/* ── Start New Session CTA ── */}
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
          <Link href="/solver">
            <Button variant="outline" size="sm" className="gap-2">
              <Brain size={14} />
              Start New Session
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
