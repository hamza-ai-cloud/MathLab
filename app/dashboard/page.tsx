'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { StepCard } from '@/components/math/StepCard';
import { useAuth } from '@/context/AuthContext';
import {
  Send,
  Brain,
  Upload,
  ImageIcon,
  FileText,
  X,
  Loader2,
  Bot,
  User,
  CheckCircle2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

/* ── Types ── */
interface ChatMsg {
  id: string;
  role: 'user' | 'ai';
  text: string;
  fileName?: string;
  isFollowUp?: boolean;
  solution?: {
    steps?: { description: string; math: string; explanation: string; concept?: string; conceptUrdu?: string }[];
    answer?: string;
    summary?: string;
  };
}

/* ═══════════════════════════════════════════════════════════
   Dashboard — ChatGPT-style: same layout always,
   solution slides in as an overlay / conversation panel.
   Sidebar + Header NEVER change.
   ═══════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ base64: string; mime: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;

  /* ── Auto-resize textarea ── */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [inputText]);

  /* ── Scroll to bottom when new messages arrive ── */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  /* ── Build conversation history for API ── */
  const buildHistory = useCallback(() => {
    return messages.map((m) => ({
      role: m.role === 'ai' ? ('model' as const) : ('user' as const),
      text: m.text,
    }));
  }, [messages]);

  /* ── Call Gemini API ── */
  const callAI = useCallback(async (
    text: string,
    extra?: { fileBase64?: string; fileMimeType?: string; fileName?: string },
  ) => {
    const userMsg: ChatMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      fileName: extra?.fileName,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: buildHistory(),
          fileBase64: extra?.fileBase64,
          fileMimeType: extra?.fileMimeType,
        }),
      });

      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }

      const json = await res.json();
      const data = json.data || json;

      const aiMsg: ChatMsg = {
        id: `a-${Date.now()}`,
        role: 'ai',
        text: data.isFollowUp ? data.explanation : (data.summary || data.answer || ''),
        isFollowUp: data.isFollowUp,
        solution: data.isFollowUp
          ? undefined
          : { steps: data.steps, answer: data.answer, summary: data.summary },
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI call failed:', err);
      setMessages((prev) => [
        ...prev,
        { id: `e-${Date.now()}`, role: 'ai', text: 'Sorry, something went wrong. Please check your API key or try again.', isFollowUp: true },
      ]);
    } finally {
      setLoading(false);
    }
  }, [buildHistory]);

  /* ── Submit ── */
  const handleSubmit = useCallback(async () => {
    const text = inputText.trim();
    if (!text && !attachedFile) return;
    const prompt = text || 'Please solve the math in this uploaded file.';
    setInputText('');
    const file = attachedFile;
    setAttachedFile(null);

    if (file) {
      await callAI(prompt, { fileBase64: file.base64, fileMimeType: file.mime, fileName: file.name });
    } else {
      await callAI(prompt);
    }
  }, [inputText, attachedFile, callAI]);

  /* ── File upload ── */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      setAttachedFile({ base64, mime: file.type, name: file.name });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  /* ── New Chat ── */
  const handleNewChat = () => {
    setMessages([]);
    setInputText('');
    setAttachedFile(null);
    textareaRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* ── Header — always visible, never changes ── */}
      <DashboardHeader />

      {/* ── Main area ── */}
      <div className="flex-1 min-h-0 flex flex-col relative">

        {/* ── Scrollable content zone ── */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Empty state: hero + suggestions (visible when no messages) ── */}
          <AnimatePresence>
            {!hasMessages && !loading && (
              <motion.div
                key="hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                className="flex flex-col items-center justify-center px-4 pt-16 sm:pt-24 pb-8"
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-flex mb-5"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-electric to-violet flex items-center justify-center shadow-glow">
                    <Brain size={32} className="text-white" />
                  </div>
                </motion.div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 text-center">
                  What would you like to solve?
                </h1>
                <p className="text-base text-slate-400 text-center max-w-md">
                  Type a math problem, upload an image, or pick a suggestion below.
                </p>

                {/* Quick suggestions */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-8 max-w-xl">
                  {['Solve x² + 5x + 6 = 0', '∫ sin(x) dx', 'Find dy/dx of y = e^(2x)', 'Simplify (a+b)²'].map((s) => (
                    <motion.button
                      key={s}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => { setInputText(s); textareaRef.current?.focus(); }}
                      className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-all"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <Sparkles size={10} className="inline mr-1.5 text-violet-light" />
                      {s}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Conversation messages ── */}
          {hasMessages && (
            <div className="max-w-3xl mx-auto px-4 pt-6 pb-4 space-y-5">
              {messages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i === messages.length - 1 ? 0.1 : 0 }}
                >
                  {/* ── User message ── */}
                  {msg.role === 'user' && (
                    <div className="flex items-start gap-3 justify-end">
                      <div className="max-w-[85%]">
                        <div
                          className="rounded-2xl rounded-tr-md px-4 py-3 text-sm text-white"
                          style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.25), rgba(139,92,246,0.2))', border: '1px solid rgba(108,99,255,0.2)' }}
                        >
                          {msg.text}
                          {msg.fileName && (
                            <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-slate-400">
                              <ImageIcon size={10} /> {msg.fileName}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-electric to-violet flex items-center justify-center flex-shrink-0">
                        <User size={12} className="text-white" />
                      </div>
                    </div>
                  )}

                  {/* ── AI message ── */}
                  {msg.role === 'ai' && (
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot size={12} className="text-white" />
                      </div>
                      <div className="max-w-[90%] flex-1 space-y-3">
                        {/* Follow-up text response */}
                        {(msg.isFollowUp || !msg.solution) && (
                          <div
                            className="rounded-2xl rounded-tl-md px-4 py-3 text-sm text-slate-200 leading-relaxed"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                          >
                            {msg.text}
                          </div>
                        )}

                        {/* Full solution with steps */}
                        {msg.solution && msg.solution.steps && (
                          <div className="space-y-3">
                            {/* Summary */}
                            {msg.solution.summary && (
                              <div
                                className="rounded-xl px-4 py-3 text-sm text-slate-300 leading-relaxed"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                              >
                                <span className="text-violet-light font-medium">Summary: </span>
                                {msg.solution.summary}
                              </div>
                            )}

                            {/* Step cards */}
                            {msg.solution.steps.map((step, idx) => (
                              <StepCard
                                key={`${msg.id}-step-${idx}`}
                                step={idx + 1}
                                description={step.description}
                                math={step.math}
                                explanation={step.explanation}
                                concept={step.concept}
                                conceptUrdu={step.conceptUrdu}
                                index={idx}
                              />
                            ))}

                            {/* Final answer */}
                            {msg.solution.answer && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: (msg.solution.steps.length || 0) * 0.15 + 0.2 }}
                                className="rounded-xl px-4 py-3 flex items-center gap-3"
                                style={{
                                  background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(6,182,212,0.08))',
                                  border: '1px solid rgba(16,185,129,0.2)',
                                }}
                              >
                                <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                                <div>
                                  <p className="text-[10px] uppercase tracking-wider text-emerald-400/70 font-semibold mb-0.5">Final Answer</p>
                                  <p className="text-sm font-semibold text-white">{msg.solution.answer}</p>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* ── Thinking indicator ── */}
              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                      <Bot size={12} className="text-white" />
                    </div>
                    <div
                      className="rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-2"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-violet-light rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-violet-light rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-violet-light rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-xs text-slate-400 ml-1">Solving...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* ── Fixed bottom input bar ── */}
        <div className="border-t border-white/[0.04] px-3 sm:px-5 py-3" style={{ background: 'rgba(8,5,18,0.8)', backdropFilter: 'blur(16px)' }}>
          <div className="max-w-3xl mx-auto">
            {/* New chat button when conversation exists */}
            {hasMessages && (
              <div className="flex justify-center mb-2">
                <button
                  onClick={handleNewChat}
                  className="text-[10px] text-slate-500 hover:text-white px-3 py-1 rounded-lg hover:bg-white/5 transition flex items-center gap-1"
                >
                  <ChevronDown size={10} className="rotate-180" /> New conversation
                </button>
              </div>
            )}

            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, rgba(15,12,30,0.9) 0%, rgba(10,8,22,0.95) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 0 40px rgba(108,99,255,0.04), 0 4px 24px rgba(0,0,0,0.2)',
              }}
            >
              {/* Attached file preview */}
              <AnimatePresence>
                {attachedFile && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-b border-white/[0.04] overflow-hidden"
                  >
                    <div className="px-4 py-2 flex items-center gap-2">
                      {attachedFile.mime.startsWith('image/') ? <ImageIcon size={13} className="text-violet-light" /> : <FileText size={13} className="text-red-400" />}
                      <span className="text-xs text-slate-300 truncate flex-1">{attachedFile.name}</span>
                      <button onClick={() => setAttachedFile(null)} className="p-1 rounded hover:bg-white/5 text-slate-500 hover:text-white transition"><X size={11} /></button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="px-4 py-2.5">
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={hasMessages ? 'Ask a follow-up or type a new problem...' : 'Type your math problem here... (e.g., ∫ x² dx, solve x² + 5x + 6 = 0)'}
                  disabled={loading}
                  rows={1}
                  className="w-full bg-transparent text-sm text-white placeholder-slate-500 resize-none focus:outline-none leading-relaxed disabled:opacity-50"
                  style={{ maxHeight: 150 }}
                />
              </div>

              <div className="px-3 py-2 flex items-center justify-between border-t border-white/[0.04]">
                <div className="flex items-center gap-1">
                  <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 transition"
                  >
                    <Upload size={14} />
                    <span className="hidden sm:inline">Upload</span>
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={loading || (!inputText.trim() && !attachedFile)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-30 transition-all"
                  style={{
                    background: (inputText.trim() || attachedFile) && !loading
                      ? 'linear-gradient(135deg, #3b82f6, #6C63FF, #8b5cf6)'
                      : 'rgba(255,255,255,0.05)',
                    boxShadow: (inputText.trim() || attachedFile) && !loading
                      ? '0 0 20px rgba(108,99,255,0.3)'
                      : 'none',
                  }}
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </motion.button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
