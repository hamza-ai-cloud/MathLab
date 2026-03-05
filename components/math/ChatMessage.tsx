'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepCard } from './StepCard';
import {
  User,
  Brain,
  Copy,
  Check,
  FileText,
  ImageIcon,
  Clock,
} from 'lucide-react';

export interface ChatMsg {
  id: string;
  role: 'user' | 'ai';
  text?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: string;
  /** AI response data */
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
    isFollowUp?: boolean;
    explanation?: string;
    language?: string;
  };
  timestamp: Date;
}

interface ChatMessageProps {
  message: ChatMsg;
  index: number;
}

export function ChatMessage({ message, index }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    const text = isUser
      ? message.text || ''
      : message.solution?.answer || message.solution?.explanation || '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            isUser
              ? 'bg-gradient-to-br from-violet to-neon-pink shadow-glow-violet'
              : 'bg-gradient-to-br from-electric to-violet shadow-glow'
          }`}
        >
          {isUser ? (
            <User size={16} className="text-white" />
          ) : (
            <Brain size={16} className="text-white" />
          )}
        </div>
      </div>

      {/* Message bubble */}
      <div className={`flex-1 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl overflow-hidden ${
            isUser
              ? 'bg-gradient-to-br from-violet/15 to-neon-pink/10 border border-violet/20 ml-auto'
              : 'glass-card border border-white/10'
          }`}
        >
          <div className="p-4">
            {/* User message */}
            {isUser && (
              <div>
                {message.text && (
                  <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                    {message.text}
                  </p>
                )}

                {/* File chip inside message */}
                {message.fileName && (
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 glass rounded-lg border border-white/10 text-xs">
                    {message.fileType?.startsWith('image/') ? (
                      <ImageIcon size={12} className="text-electric-light" />
                    ) : (
                      <FileText size={12} className="text-violet-light" />
                    )}
                    <span className="text-slate-300">{message.fileName}</span>
                    <span className="text-slate-500">{message.fileSize}</span>
                  </div>
                )}
              </div>
            )}

            {/* AI response */}
            {!isUser && message.solution && (
              <div className="space-y-4">
                {/* Follow-up explanation */}
                {message.solution.isFollowUp && message.solution.explanation && (
                  <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {message.solution.explanation}
                  </div>
                )}

                {/* Full solution with steps */}
                {!message.solution.isFollowUp && message.solution.steps && (
                  <>
                    {/* Steps */}
                    <div className="space-y-3">
                      {message.solution.steps.map((step, i) => (
                        <StepCard
                          key={i}
                          step={i + 1}
                          description={step.description}
                          math={step.math}
                          explanation={step.explanation}
                          concept={step.concept}
                          conceptUrdu={step.conceptUrdu}
                          index={i}
                        />
                      ))}
                    </div>

                    {/* Final answer */}
                    {message.solution.answer && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative rounded-xl overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-electric/10 via-violet/10 to-neon-cyan/10" />
                        <div className="relative px-5 py-4 border border-electric/20 rounded-xl">
                          <p className="text-xs text-electric-light uppercase tracking-wider font-semibold mb-1.5">
                            ✨ Final Answer
                          </p>
                          <p className="text-xl font-bold text-white font-mono">
                            {message.solution.answer}
                          </p>
                          {message.solution.summary && (
                            <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
                              {message.solution.summary}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Timestamp + copy */}
        <div
          className={`flex items-center gap-2 mt-1.5 px-1 ${
            isUser ? 'justify-end' : 'justify-start'
          }`}
        >
          <span className="text-[10px] text-slate-600 flex items-center gap-1">
            <Clock size={9} />
            {time}
          </span>
          <button
            onClick={handleCopy}
            className="text-slate-600 hover:text-slate-400 transition"
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
