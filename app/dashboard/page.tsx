'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import type { CanvasChatMsg } from '@/components/dashboard/AdvancedCanvas';
import { useAuth } from '@/context/AuthContext';
import {
  Send,
  Sparkles,
  Brain,
  Upload,
  ImageIcon,
  FileText,
  X,
  Loader2,
  PenTool,
  Maximize,
  Minimize,
} from 'lucide-react';

const AdvancedCanvas = dynamic(
  () => import('@/components/dashboard/AdvancedCanvas').then((m) => m.AdvancedCanvas),
  { ssr: false, loading: () => <div className="flex-1 flex items-center justify-center"><div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div> }
);

/* ═══════════════════════════════════════════════════════════
   Dashboard — ChatGPT-Style Dynamic Interface
   Clean centered input → slides into workspace when solving
   ═══════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<CanvasChatMsg[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ base64: string; mime: string; name: string } | null>(null);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* ── Workspace opens automatically when there are messages or loading ── */
  const hasActivity = messages.length > 0 || loading;

  useEffect(() => {
    if (hasActivity && !workspaceOpen) setWorkspaceOpen(true);
  }, [hasActivity, workspaceOpen]);

  /* ── Auto-resize textarea ── */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  }, [inputText]);

  /* ── Build conversation history for API ── */
  const buildHistory = useCallback(() => {
    return messages.map((m) => ({
      role: m.role === 'ai' ? ('model' as const) : ('user' as const),
      text: m.text,
    }));
  }, [messages]);

  /* ── Generic AI call ── */
  const callAI = useCallback(async (
    text: string,
    extra?: { fileBase64?: string; fileMimeType?: string; fileUrl?: string; fileName?: string },
  ) => {
    const userMsg: CanvasChatMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      fileName: extra?.fileName,
      fileMimeType: extra?.fileMimeType,
      timestamp: new Date(),
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
          fileUrl: extra?.fileUrl,
        }),
      });
      const json = await res.json();
      const data = json.data || json;

      const aiMsg: CanvasChatMsg = {
        id: `a-${Date.now()}`,
        role: 'ai',
        text: data.isFollowUp ? data.explanation : data.summary || '',
        isFollowUp: data.isFollowUp,
        solution: data.isFollowUp
          ? undefined
          : { steps: data.steps, answer: data.answer, summary: data.summary },
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: 'ai',
          text: 'Sorry, something went wrong. Please try again.',
          isFollowUp: true,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [buildHistory]);

  /* ── Submit from the central input ── */
  const handleSubmit = useCallback(async () => {
    const text = inputText.trim();
    if (!text && !attachedFile) return;
    const prompt = text || 'Please solve the math in this uploaded file.';
    setInputText('');
    const file = attachedFile;
    setAttachedFile(null);

    if (file) {
      await callAI(prompt, {
        fileBase64: file.base64,
        fileMimeType: file.mime,
        fileName: file.name,
      });
    } else {
      await callAI(`Solve: ${prompt}`);
    }
  }, [inputText, attachedFile, callAI]);

  /* ── Canvas handlers (from workspace) ── */
  const handleSolveDrawing = useCallback(async (imageDataUrl: string, latexText: string) => {
    const base64 = imageDataUrl.split(',')[1];
    const prompt = latexText
      ? `Solve this equation I drew on the canvas. The LaTeX equation is: ${latexText}. Also check the drawing for any additional context.`
      : 'Solve the math equation I drew on this canvas. Read the handwriting and solve step by step.';
    await callAI(prompt, { fileBase64: base64, fileMimeType: 'image/png', fileName: 'canvas-drawing.png' });
  }, [callAI]);

  const handleSolveText = useCallback(async (text: string) => {
    await callAI(`Solve: ${text}`);
  }, [callAI]);

  const handleSendDoubt = useCallback(async (text: string) => {
    await callAI(text);
  }, [callAI]);

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

  /* Escape exits focus mode */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && focusMode) setFocusMode(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [focusMode]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* ── Header (hidden in focus mode) ── */}
      <AnimatePresence>
        {!focusMode && (
          <motion.div
            initial={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DashboardHeader />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex-1 min-h-0 flex flex-col relative">

        {/* ── STATE A: Clean centered chat (no workspace yet) ── */}
        <AnimatePresence mode="wait">
          {!workspaceOpen && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="flex-1 flex flex-col items-center justify-center px-4 pb-8"
            >
              {/* Hero */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-center mb-8 max-w-xl"
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
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                  What would you like to solve?
                </h1>
                <p className="text-base text-slate-400">
                  Type a math problem, upload an image, or open the canvas to draw.
                </p>
              </motion.div>

              {/* ── Central Input ── */}
              <div className="w-full max-w-2xl">
                <div
                  className="rounded-2xl overflow-hidden transition-all duration-300"
                  style={{
                    background: 'linear-gradient(145deg, rgba(15,12,30,0.9) 0%, rgba(10,8,22,0.95) 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 0 60px rgba(108,99,255,0.06), 0 8px 32px rgba(0,0,0,0.3)',
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
                        <div className="px-4 py-2.5 flex items-center gap-2">
                          {attachedFile.mime.startsWith('image/')
                            ? <ImageIcon size={14} className="text-violet-light" />
                            : <FileText size={14} className="text-red-400" />}
                          <span className="text-xs text-slate-300 truncate flex-1">{attachedFile.name}</span>
                          <button onClick={() => setAttachedFile(null)} className="p-1 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition">
                            <X size={12} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="px-4 py-3">
                    <textarea
                      ref={textareaRef}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your math problem here... (e.g., ∫ x² dx, solve x² + 5x + 6 = 0)"
                      rows={1}
                      className="w-full bg-transparent text-sm text-white placeholder-slate-500 resize-none focus:outline-none leading-relaxed"
                      style={{ maxHeight: 160 }}
                    />
                  </div>

                  {/* Bottom toolbar */}
                  <div className="px-3 py-2.5 flex items-center justify-between border-t border-white/[0.04]">
                    <div className="flex items-center gap-1">
                      <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 transition"
                      >
                        <Upload size={14} />
                        <span className="hidden sm:inline">Upload</span>
                      </button>
                      <button
                        onClick={() => setWorkspaceOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 transition"
                      >
                        <PenTool size={14} />
                        <span className="hidden sm:inline">Canvas</span>
                      </button>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSubmit}
                      disabled={!inputText.trim() && !attachedFile}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-30 transition-all"
                      style={{
                        background: (inputText.trim() || attachedFile)
                          ? 'linear-gradient(135deg, #3b82f6, #6C63FF, #8b5cf6)'
                          : 'rgba(255,255,255,0.05)',
                        boxShadow: (inputText.trim() || attachedFile)
                          ? '0 0 20px rgba(108,99,255,0.3)'
                          : 'none',
                      }}
                    >
                      <Send size={14} />
                    </motion.button>
                  </div>
                </div>

                {/* Quick suggestions */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                  {['Solve x² + 5x + 6 = 0', '∫ sin(x) dx', 'Find dy/dx of y = e^(2x)', 'Simplify (a+b)²'].map((s) => (
                    <motion.button
                      key={s}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => { setInputText(s); textareaRef.current?.focus(); }}
                      className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white transition-all"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── STATE B: Workspace mode (slide-in) ── */}
        <AnimatePresence>
          {workspaceOpen && (
            <motion.div
              key="workspace"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="flex-1 min-h-0 flex flex-col"
            >
              {/* Workspace toolbar */}
              <div
                className="flex items-center justify-between px-3 sm:px-5 py-2 border-b border-white/[0.04]"
                style={{ background: 'rgba(8,5,18,0.5)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-electric to-violet flex items-center justify-center">
                      <Brain size={12} className="text-white" />
                    </div>
                    <span className="text-xs font-semibold text-white">AI Workspace</span>
                  </div>
                  {messages.length > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-electric/10 text-electric-light border border-electric/15 font-medium">
                      {messages.filter((m) => m.role === 'ai').length} solution{messages.filter((m) => m.role === 'ai').length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFocusMode(!focusMode)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 transition"
                    title={focusMode ? 'Exit Focus (Esc)' : 'Focus Mode'}
                  >
                    {focusMode ? <Minimize size={13} /> : <Maximize size={13} />}
                    <span className="hidden sm:inline">{focusMode ? 'Exit Focus' : 'Focus'}</span>
                  </motion.button>
                  {!hasActivity && (
                    <button
                      onClick={() => setWorkspaceOpen(false)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 transition"
                    >
                      <X size={13} />
                      <span className="hidden sm:inline">Close</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Canvas workspace fills remaining space */}
              <div className="flex-1 min-h-0 p-1.5 sm:p-2">
                <AdvancedCanvas
                  messages={messages}
                  loading={loading}
                  onSolveDrawing={handleSolveDrawing}
                  onSolveText={handleSolveText}
                  onSendDoubt={handleSendDoubt}
                  focusMode={focusMode}
                />
              </div>

              {/* Bottom input bar (always visible in workspace) */}
              <div className="border-t border-white/[0.04] px-3 sm:px-5 py-2.5" style={{ background: 'rgba(8,5,18,0.6)' }}>
                <div className="max-w-3xl mx-auto flex items-center gap-2">
                  <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
                  <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition" title="Upload file">
                    <Upload size={16} />
                  </button>
                  <div
                    className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    {attachedFile && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-violet/10 border border-violet/20 text-[10px] text-slate-300">
                        {attachedFile.mime.startsWith('image/') ? <ImageIcon size={10} /> : <FileText size={10} />}
                        <span className="truncate max-w-[80px]">{attachedFile.name}</span>
                        <button onClick={() => setAttachedFile(null)} className="ml-0.5 text-slate-500 hover:text-white"><X size={8} /></button>
                      </div>
                    )}
                    <input
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask a follow-up or type a new problem..."
                      disabled={loading}
                      className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={loading || (!inputText.trim() && !attachedFile)}
                    className="p-2.5 rounded-xl text-white disabled:opacity-30 transition-all relative overflow-hidden"
                    style={{
                      background: (inputText.trim() || attachedFile) && !loading
                        ? 'linear-gradient(135deg, #3b82f6, #6C63FF, #8b5cf6)'
                        : 'rgba(255,255,255,0.05)',
                      boxShadow: (inputText.trim() || attachedFile) && !loading
                        ? '0 0 16px rgba(108,99,255,0.3)'
                        : 'none',
                    }}
                  >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
