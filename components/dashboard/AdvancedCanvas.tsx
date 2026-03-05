'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepCard } from '@/components/math/StepCard';
import {
  Pen,
  Type,
  Undo2,
  Redo2,
  Trash2,
  Sparkles,
  Brain,
  Send,
  Eraser,
  Bot,
  User,
  Copy,
  CheckCircle2,
  FileText,
  ImageIcon,
  Loader2,
  Minus,
  Palette,
  Download,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

/* ── Types ── */
export interface CanvasChatMsg {
  id: string;
  role: 'user' | 'ai';
  text: string;
  fileName?: string;
  fileMimeType?: string;
  solution?: {
    steps?: {
      description: string;
      math: string;
      explanation: string;
      concept?: string;
      conceptUrdu?: string;
    }[];
    answer?: string;
    summary?: string;
  };
  isFollowUp?: boolean;
  timestamp: Date;
}

interface Stroke {
  points: { x: number; y: number }[];
  color: string;
  width: number;
  tool: 'pen' | 'eraser';
}

interface AdvancedCanvasProps {
  messages: CanvasChatMsg[];
  loading: boolean;
  onSolveDrawing: (imageDataUrl: string, latexText: string) => void;
  onSolveText: (text: string) => void;
  onSendDoubt: (text: string) => void;
  focusMode?: boolean;
}

const COLORS = ['#ffffff', '#6C63FF', '#00D4FF', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#a855f7'];
const STROKE_WIDTHS = [2, 3, 5, 8];

/* ══════════════════════════════════════════════════════════════
   Advanced Canvas — Integrated Editor Workspace
   Left: AI Solutions   |   Right: Drawing Scratchpad
   ══════════════════════════════════════════════════════════════ */
export function AdvancedCanvas({
  messages,
  loading,
  onSolveDrawing,
  onSolveText,
  onSendDoubt,
  focusMode = false,
}: AdvancedCanvasProps) {
  /* ── Canvas drawing state ── */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [tool, setTool] = useState<'pen' | 'eraser' | 'text'>('pen');
  const [color, setColor] = useState('#ffffff');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showWidthPicker, setShowWidthPicker] = useState(false);

  /* ── LaTeX text state ── */
  const [latexInput, setLatexInput] = useState('');
  const [showLatex, setShowLatex] = useState(false);

  /* ── Panel state ── */
  const [solutionPanelOpen, setSolutionPanelOpen] = useState(true);
  const [doubt, setDoubt] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  /* ── Keyboard shortcuts ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'p' || e.key === 'P') { setTool('pen'); setShowLatex(false); }
      if (e.key === 'e' || e.key === 'E') { setTool('eraser'); setShowLatex(false); }
      if (e.key === 't' || e.key === 'T') { setTool('text'); setShowLatex(true); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); handleUndo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); handleRedo(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Resize canvas ── */
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);
    redraw();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  /* ── Re-resize when panel toggles ── */
  useEffect(() => {
    const t = setTimeout(resizeCanvas, 350);
    return () => clearTimeout(t);
  }, [solutionPanelOpen, focusMode, resizeCanvas]);

  /* ── Auto-scroll chat ── */
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, loading]);

  /* ── Auto-open solution panel when AI responds ── */
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'ai') {
      setSolutionPanelOpen(true);
    }
  }, [messages]);

  /* ── Redraw ── */
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    ctx.clearRect(0, 0, w, h);

    // Grid dots
    ctx.fillStyle = 'rgba(100, 116, 139, 0.08)';
    const spacing = 28;
    for (let x = spacing; x < w; x += spacing) {
      for (let y = spacing; y < h; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (const stroke of strokes) {
      if (stroke.points.length < 2) continue;
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (stroke.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = stroke.width * 3;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
        ctx.shadowColor = stroke.color;
        ctx.shadowBlur = 1;
      }
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        const p0 = stroke.points[i - 1];
        const p1 = stroke.points[i];
        ctx.quadraticCurveTo(p0.x, p0.y, (p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
      }
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
      ctx.shadowBlur = 0;
    }
  }, [strokes]);

  useEffect(() => { redraw(); }, [redraw]);

  /* ── Pointer handlers ── */
  const getCanvasPoint = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (tool === 'text') return;
    e.preventDefault();
    setShowColorPicker(false);
    setShowWidthPicker(false);
    const point = getCanvasPoint(e);
    setCurrentStroke({ points: [point], color: tool === 'eraser' ? '#000' : color, width: strokeWidth, tool });
    setIsDrawing(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing || !currentStroke) return;
    e.preventDefault();
    const point = getCanvasPoint(e);
    const updated = { ...currentStroke, points: [...currentStroke.points, point] };
    setCurrentStroke(updated);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pts = updated.points;
    if (pts.length < 2) return;

    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (updated.tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = updated.width * 3;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = updated.color;
      ctx.lineWidth = updated.width;
    }
    const p0 = pts[pts.length - 2];
    const p1 = pts[pts.length - 1];
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
  };

  const handlePointerUp = () => {
    if (currentStroke && currentStroke.points.length > 1) {
      setStrokes((prev) => [...prev, currentStroke]);
      setRedoStack([]);
    }
    setCurrentStroke(null);
    setIsDrawing(false);
  };

  /* ── Actions ── */
  const handleUndo = () => {
    setStrokes((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setRedoStack((r) => [...r, last]);
      return prev.slice(0, -1);
    });
  };

  const handleRedo = () => {
    setRedoStack((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setStrokes((s) => [...s, last]);
      return prev.slice(0, -1);
    });
  };

  const handleClear = () => { setStrokes([]); setRedoStack([]); setLatexInput(''); };

  const handleSolve = () => {
    const hasDrawing = strokes.length > 0;
    const hasLatex = latexInput.trim().length > 0;
    if (!hasDrawing && !hasLatex) return;

    if (hasDrawing) {
      const tempCanvas = document.createElement('canvas');
      const rect = containerRef.current?.getBoundingClientRect();
      const w = rect?.width || 800;
      const h = rect?.height || 500;
      tempCanvas.width = w;
      tempCanvas.height = h;
      const tc = tempCanvas.getContext('2d');
      if (tc) {
        tc.fillStyle = '#0f0a1e';
        tc.fillRect(0, 0, w, h);
        for (const stroke of strokes) {
          if (stroke.points.length < 2) continue;
          tc.beginPath(); tc.lineCap = 'round'; tc.lineJoin = 'round';
          tc.strokeStyle = stroke.tool === 'eraser' ? '#0f0a1e' : stroke.color;
          tc.lineWidth = stroke.width;
          tc.moveTo(stroke.points[0].x, stroke.points[0].y);
          for (let i = 1; i < stroke.points.length; i++) {
            const p0 = stroke.points[i - 1]; const p1 = stroke.points[i];
            tc.quadraticCurveTo(p0.x, p0.y, (p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
          }
          tc.stroke();
        }
        if (hasLatex) { tc.fillStyle = '#6C63FF'; tc.font = '20px monospace'; tc.fillText(latexInput, 20, h - 24); }
      }
      onSolveDrawing(tempCanvas.toDataURL('image/png'), latexInput);
    } else {
      onSolveText(latexInput);
    }
  };

  const handleExport = () => {
    if (strokes.length === 0) return;
    const tempCanvas = document.createElement('canvas');
    const rect = containerRef.current?.getBoundingClientRect();
    const w = rect?.width || 800;
    const h = rect?.height || 500;
    tempCanvas.width = w; tempCanvas.height = h;
    const tc = tempCanvas.getContext('2d');
    if (tc) {
      tc.fillStyle = '#0f0a1e'; tc.fillRect(0, 0, w, h);
      for (const stroke of strokes) {
        if (stroke.points.length < 2) continue;
        tc.beginPath(); tc.lineCap = 'round'; tc.lineJoin = 'round';
        tc.strokeStyle = stroke.tool === 'eraser' ? '#0f0a1e' : stroke.color;
        tc.lineWidth = stroke.width;
        tc.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length; i++) {
          const p0 = stroke.points[i - 1]; const p1 = stroke.points[i];
          tc.quadraticCurveTo(p0.x, p0.y, (p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
        }
        tc.stroke();
      }
    }
    const a = document.createElement('a');
    a.download = 'mathlab-canvas.png'; a.href = tempCanvas.toDataURL('image/png'); a.click();
  };

  const copyText = (id: string, text: string) => { navigator.clipboard.writeText(text); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); };
  const handleSendDoubt = () => { const t = doubt.trim(); if (!t || loading) return; onSendDoubt(t); setDoubt(''); };
  const handleDoubtKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendDoubt(); } };

  const hasContent = strokes.length > 0 || latexInput.trim().length > 0;
  const hasSolutions = messages.length > 0;

  return (
    <div
      className="flex h-full min-h-0 rounded-2xl overflow-hidden border border-white/[0.06] relative"
      style={{
        background: 'linear-gradient(145deg, rgba(10,6,22,0.95) 0%, rgba(15,12,30,0.9) 50%, rgba(10,6,22,0.95) 100%)',
        boxShadow: '0 0 80px rgba(108,99,255,0.04), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {/* ════ LEFT: AI Solutions Panel ════ */}
      <AnimatePresence initial={false}>
        {solutionPanelOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col border-r border-white/[0.04] overflow-hidden"
            style={{ background: 'rgba(6,4,16,0.6)', minWidth: hasSolutions ? 380 : 320, maxWidth: 480 }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500/20 to-emerald-400/10 border border-emerald-500/15 flex items-center justify-center">
                  <Brain size={11} className="text-emerald-400" />
                </div>
                <span className="text-xs font-semibold text-white">Solutions</span>
                {hasSolutions && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-electric/10 text-electric-light border border-electric/15 font-medium">
                    {messages.filter((m) => m.role === 'ai').length}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSolutionPanelOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition"
                title="Collapse panel"
              >
                <PanelLeftClose size={14} />
              </button>
            </div>

            {/* Solutions scrollable area */}
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {!hasSolutions && !loading && (
                <div className="flex items-center justify-center h-full min-h-[200px]">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-electric/10 to-violet/10 border border-white/5 flex items-center justify-center mx-auto mb-3">
                      <Brain size={22} className="text-slate-600" />
                    </div>
                    <p className="text-sm text-slate-500 mb-1">No solutions yet</p>
                    <p className="text-xs text-slate-600 max-w-[220px] mx-auto">
                      Draw on the canvas or type a problem, then hit <span className="text-electric-light font-semibold">Solve with AI</span>
                    </p>
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'ai' && (
                    <div className="flex-shrink-0 w-6 h-6 rounded-md bg-gradient-to-br from-electric/20 to-violet/20 flex items-center justify-center mt-0.5">
                      <Bot size={11} className="text-electric-light" />
                    </div>
                  )}
                  <div className="max-w-[95%]">
                    {msg.role === 'user' && (
                      <div className="rounded-2xl rounded-tr-sm px-3.5 py-2.5" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(108,99,255,0.08))', border: '1px solid rgba(59,130,246,0.15)' }}>
                        {msg.fileName && (
                          <div className="flex items-center gap-1.5 mb-1.5 px-2 py-1 rounded-lg w-fit" style={{ background: 'rgba(255,255,255,0.04)' }}>
                            {msg.fileMimeType?.startsWith('image/') ? <ImageIcon size={10} className="text-violet-light" /> : <FileText size={10} className="text-red-400" />}
                            <span className="text-[10px] text-slate-300 truncate max-w-[140px]">{msg.fileName}</span>
                          </div>
                        )}
                        <p className="text-xs text-white/90 leading-relaxed">{msg.text}</p>
                      </div>
                    )}
                    {msg.role === 'ai' && (
                      <div className="space-y-2.5">
                        {msg.solution?.steps && msg.solution.steps.length > 0 && (
                          <div className="space-y-2">
                            {msg.solution.steps.map((step, idx) => (
                              <StepCard key={idx} step={idx + 1} description={step.description} math={step.math} explanation={step.explanation} concept={step.concept} conceptUrdu={step.conceptUrdu} index={idx} />
                            ))}
                            {msg.solution.answer && (
                              <div className="relative rounded-xl overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-electric/8 via-violet/8 to-neon-cyan/8" />
                                <div className="relative px-4 py-3 rounded-xl" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
                                  <p className="text-[10px] text-electric-light uppercase tracking-wider font-semibold mb-1">✨ Final Answer</p>
                                  <p className="text-lg font-bold text-white font-mono">{msg.solution.answer}</p>
                                  {msg.solution.summary && <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{msg.solution.summary}</p>}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        {(msg.isFollowUp || !msg.solution?.steps?.length) && msg.text && (
                          <div className="rounded-2xl rounded-tl-sm px-3.5 py-2.5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                            <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-[9px] text-slate-600">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              <button onClick={() => copyText(msg.id, msg.text)} className="p-0.5 rounded hover:bg-white/5 transition">
                                {copiedId === msg.id ? <CheckCircle2 size={10} className="text-emerald-400" /> : <Copy size={10} className="text-slate-600 hover:text-slate-400" />}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="flex-shrink-0 w-6 h-6 rounded-md bg-gradient-to-br from-violet/20 to-electric/10 flex items-center justify-center mt-0.5">
                      <User size={11} className="text-violet-light" />
                    </div>
                  )}
                </motion.div>
              ))}

              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-electric/20 to-violet/20 flex items-center justify-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
                      <Sparkles size={11} className="text-electric-light" />
                    </motion.div>
                  </div>
                  <div className="rounded-2xl rounded-tl-sm px-3.5 py-2.5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Solving</span>
                      <div className="flex gap-0.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} className="w-1 h-1 rounded-full bg-electric" />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Follow-up input */}
            {hasSolutions && (
              <div className="border-t border-white/[0.04] p-3">
                <div className="flex items-center gap-2">
                  <input
                    value={doubt} onChange={(e) => setDoubt(e.target.value)} onKeyDown={handleDoubtKeyDown}
                    placeholder="Ask a follow-up…" disabled={loading}
                    className="flex-1 px-3 py-2 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none disabled:opacity-50 transition"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  />
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSendDoubt} disabled={!doubt.trim() || loading}
                    className="p-2 rounded-xl text-white disabled:opacity-30 transition" style={{ background: 'linear-gradient(135deg, #3b82f6, #6C63FF)' }}>
                    <Send size={12} />
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════ RIGHT: Drawing Canvas / Scratchpad ════ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Canvas Toolbar */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-white/[0.04]" style={{ background: 'rgba(8,5,18,0.6)', backdropFilter: 'blur(20px)' }}>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Open solution panel button (when collapsed) */}
            {!solutionPanelOpen && (
              <button
                onClick={() => setSolutionPanelOpen(true)}
                className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition mr-1"
                title="Show solutions"
              >
                <PanelLeftOpen size={15} />
              </button>
            )}

            <div className="flex items-center gap-0.5 rounded-xl p-0.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <ToolBtn active={tool === 'pen'} onClick={() => { setTool('pen'); setShowLatex(false); }} icon={<Pen size={14} />} tip="Pen (P)" ac="electric" />
              <ToolBtn active={tool === 'eraser'} onClick={() => { setTool('eraser'); setShowLatex(false); }} icon={<Eraser size={14} />} tip="Eraser (E)" ac="electric" />
              <ToolBtn active={tool === 'text'} onClick={() => { setTool('text'); setShowLatex(true); }} icon={<Type size={14} />} tip="LaTeX (T)" ac="violet" />
            </div>

            <div className="w-px h-5 bg-white/[0.06] hidden sm:block" />

            {/* Color picker */}
            <div className="relative hidden sm:block">
              <button onClick={() => { setShowColorPicker(!showColorPicker); setShowWidthPicker(false); }} className="flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all hover:bg-white/[0.04]" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: color }} />
                <Palette size={11} className="text-slate-500" />
              </button>
              <AnimatePresence>
                {showColorPicker && (
                  <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute top-full left-0 mt-2 p-3 rounded-xl z-50" style={{ background: 'rgba(15,10,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-medium">Color</p>
                    <div className="grid grid-cols-4 gap-1.5">
                      {COLORS.map((c) => (
                        <button key={c} onClick={() => { setColor(c); setShowColorPicker(false); }}
                          className={`w-6 h-6 rounded-lg border-2 transition-all hover:scale-110 ${color === c ? 'border-white shadow-lg scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Stroke width */}
            <div className="relative hidden md:block">
              <button onClick={() => { setShowWidthPicker(!showWidthPicker); setShowColorPicker(false); }} className="flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all hover:bg-white/[0.04]" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="rounded-full bg-white" style={{ width: strokeWidth + 1, height: strokeWidth + 1 }} />
                <span className="text-[10px] text-slate-500">{strokeWidth}px</span>
              </button>
              <AnimatePresence>
                {showWidthPicker && (
                  <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute top-full left-0 mt-2 p-3 rounded-xl z-50" style={{ background: 'rgba(15,10,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                    <div className="flex items-center gap-2">
                      {STROKE_WIDTHS.map((w) => (
                        <button key={w} onClick={() => { setStrokeWidth(w); setShowWidthPicker(false); }}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${strokeWidth === w ? 'bg-electric/20 border border-electric/30' : 'hover:bg-white/5 border border-transparent'}`}>
                          <div className="rounded-full bg-white" style={{ width: w + 1, height: w + 1 }} />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <ActBtn onClick={handleUndo} disabled={strokes.length === 0} icon={<Undo2 size={13} />} label="Undo" />
            <ActBtn onClick={handleRedo} disabled={redoStack.length === 0} icon={<Redo2 size={13} />} label="Redo" />
            <div className="w-px h-4 bg-white/[0.06] mx-0.5 hidden sm:block" />
            <ActBtn onClick={handleExport} disabled={strokes.length === 0} icon={<Download size={13} />} label="Export" />
            <ActBtn onClick={handleClear} disabled={!hasContent} icon={<Trash2 size={13} />} label="Clear" danger />
            <div className="w-px h-4 bg-white/[0.06] mx-0.5 hidden sm:block" />

            {/* ★ SOLVE WITH AI — Glowing animation when processing ★ */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleSolve}
              disabled={loading || !hasContent}
              className="relative flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold text-white disabled:opacity-30 transition-all overflow-hidden"
              style={{
                background: hasContent
                  ? 'linear-gradient(135deg, #3b82f6 0%, #6C63FF 50%, #8b5cf6 100%)'
                  : 'rgba(255,255,255,0.05)',
                boxShadow: loading
                  ? '0 0 30px rgba(108,99,255,0.6), 0 0 60px rgba(59,130,246,0.3), 0 4px 12px rgba(0,0,0,0.3)'
                  : hasContent
                    ? '0 0 20px rgba(108,99,255,0.3), 0 4px 12px rgba(0,0,0,0.3)'
                    : 'none',
              }}
            >
              {/* Shimmer when idle + content ready */}
              {hasContent && !loading && (
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
              )}
              {/* Pulsing glow ring when loading */}
              {loading && (
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  animate={{ boxShadow: ['0 0 10px rgba(108,99,255,0.4)', '0 0 30px rgba(108,99,255,0.8)', '0 0 10px rgba(108,99,255,0.4)'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
              {loading ? <Loader2 size={14} className="animate-spin relative z-10" /> : <Sparkles size={14} className="relative z-10" />}
              <span className="relative z-10 hidden sm:inline">{loading ? 'Solving...' : 'Solve with AI'}</span>
              <span className="relative z-10 sm:hidden">{loading ? '...' : 'Solve'}</span>
            </motion.button>
          </div>
        </div>

        {/* Canvas area */}
        <div className="flex-1 relative min-h-0">
          <div ref={containerRef} className="absolute inset-0">
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className={`w-full h-full ${tool === 'text' ? 'cursor-text' : tool === 'eraser' ? 'cursor-cell' : 'cursor-crosshair'}`}
              style={{ touchAction: 'none' }}
            />
          </div>

          {/* Empty state */}
          {strokes.length === 0 && !showLatex && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 0.4, y: 0 }} className="text-center">
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-electric/10 to-violet/10 border border-electric/10 flex items-center justify-center mx-auto">
                    <Pen size={24} className="text-slate-500" />
                  </div>
                </motion.div>
                <p className="text-sm text-slate-500 font-medium mb-1">Scratchpad</p>
                <p className="text-xs text-slate-600">
                  Draw with <kbd className="px-1 py-0.5 rounded text-[10px] bg-white/5 border border-white/10">P</kbd>en
                  {' · '}Type with <kbd className="px-1 py-0.5 rounded text-[10px] bg-white/5 border border-white/10">T</kbd>ext
                </p>
              </motion.div>
            </div>
          )}

          {/* LaTeX overlay */}
          <AnimatePresence>
            {showLatex && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute bottom-0 left-0 right-0 p-3 z-10">
                <div className="rounded-xl p-3" style={{ background: 'rgba(10,6,20,0.9)', border: '1px solid rgba(139,92,246,0.2)', backdropFilter: 'blur(16px)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Type size={12} className="text-violet-light" />
                    <span className="text-[10px] text-slate-400 font-semibold">LaTeX / Equation</span>
                    <div className="flex-1" />
                    <button onClick={() => setShowLatex(false)} className="text-slate-500 hover:text-white transition p-1 rounded-lg hover:bg-white/5"><Minus size={11} /></button>
                  </div>
                  <div className="flex gap-2">
                    <input value={latexInput} onChange={(e) => setLatexInput(e.target.value)}
                      placeholder="x^2 + 5x + 6 = 0, ∫ sin(x) dx ..."
                      className="flex-1 px-3 py-2.5 rounded-xl text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet/40 transition"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                      autoFocus
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSolve(); } }}
                    />
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={handleSolve}
                      disabled={!latexInput.trim() && strokes.length === 0}
                      className="px-3 py-2.5 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-30"
                      style={{ background: 'linear-gradient(135deg, #3b82f6, #6C63FF, #8b5cf6)', boxShadow: '0 0 16px rgba(108,99,255,0.3)' }}>
                      <Sparkles size={14} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active tool badge */}
          {!showLatex && (
            <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-medium" style={{ background: 'rgba(8,5,18,0.7)', border: '1px solid rgba(255,255,255,0.05)' }}>
                {tool === 'pen' && <><Pen size={9} className="text-electric-light" /><span className="text-slate-400">Drawing</span></>}
                {tool === 'eraser' && <><Eraser size={9} className="text-amber-400" /><span className="text-slate-400">Erasing</span></>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */
function ToolBtn({ active, onClick, icon, tip, ac }: { active: boolean; onClick: () => void; icon: React.ReactNode; tip: string; ac: 'electric' | 'violet' }) {
  const bg = ac === 'electric' ? 'rgba(59,130,246,0.2)' : 'rgba(139,92,246,0.2)';
  const border = ac === 'electric' ? 'rgba(59,130,246,0.3)' : 'rgba(139,92,246,0.3)';
  return (
    <button onClick={onClick} className={`p-2 rounded-lg transition-all ${active ? 'text-white shadow-sm' : 'text-slate-500 hover:text-white hover:bg-white/[0.04]'}`}
      style={active ? { background: bg, border: `1px solid ${border}` } : undefined} title={tip}>
      {icon}
    </button>
  );
}

function ActBtn({ onClick, disabled, icon, label, danger }: { onClick: () => void; disabled?: boolean; icon: React.ReactNode; label: string; danger?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all disabled:opacity-25 disabled:cursor-not-allowed ${danger ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/10' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'}`}
      title={label}>
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
