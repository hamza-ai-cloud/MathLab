'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import {
  Plus,
  MessageSquare,
  Clock,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Brain,
  Sparkles,
} from 'lucide-react';

export interface Session {
  id: string;
  title: string;
  preview: string;
  date: string;
  messageCount: number;
}

interface HistorySidebarProps {
  sessions: Session[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function HistorySidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  collapsed,
  onToggleCollapse,
}: HistorySidebarProps) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 56 : 280 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="relative flex-shrink-0 h-full glass-strong border-r border-white/5 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/5">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-electric to-violet flex items-center justify-center">
                <Brain size={14} className="text-white" />
              </div>
              <span className="text-sm font-bold text-white">History</span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition flex-shrink-0"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* New chat button */}
      <div className="p-3">
        <Button
          variant="glow"
          size="sm"
          onClick={onNewSession}
          className={`w-full ${collapsed ? '!p-2 !rounded-lg' : ''}`}
        >
          <Plus size={16} />
          {!collapsed && <span>New Chat</span>}
        </Button>
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1">
        <AnimatePresence>
          {sessions.map((session, i) => {
            const isActive = session.id === activeSessionId;
            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: i * 0.03 }}
              >
                <button
                  onClick={() => onSelectSession(session.id)}
                  className={`w-full text-left rounded-xl p-2.5 transition-all group relative ${
                    isActive
                      ? 'bg-electric/10 border border-electric/20'
                      : 'hover:bg-white/[0.03] border border-transparent'
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-session"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-electric to-violet"
                    />
                  )}

                  {collapsed ? (
                    <div className="flex justify-center">
                      <MessageSquare
                        size={16}
                        className={isActive ? 'text-electric-light' : 'text-slate-500'}
                      />
                    </div>
                  ) : (
                    <div>
                      <p
                        className={`text-sm font-medium truncate ${
                          isActive ? 'text-white' : 'text-slate-300'
                        }`}
                      >
                        {session.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {session.preview}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-600 flex items-center gap-1">
                          <Clock size={9} />
                          {session.date}
                        </span>
                        <span className="text-[10px] text-slate-600 flex items-center gap-1">
                          <MessageSquare size={9} />
                          {session.messageCount}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Delete on hover */}
                  {!collapsed && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      className="absolute top-2 right-2 p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/15 text-slate-600 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={12} />
                    </div>
                  )}
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {sessions.length === 0 && !collapsed && (
          <div className="text-center py-8 px-2">
            <Sparkles size={24} className="text-slate-700 mx-auto mb-3" />
            <p className="text-xs text-slate-600">
              No sessions yet. Start a new chat!
            </p>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
