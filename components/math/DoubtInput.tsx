'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import {
  UniversalDropzone,
  type UploadedFile,
} from './UniversalDropzone';
import { Send, Paperclip, X, Sparkles } from 'lucide-react';

interface DoubtInputProps {
  onSend: (text: string, file?: UploadedFile) => void;
  loading: boolean;
  placeholder?: string;
}

export function DoubtInput({
  onSend,
  loading,
  placeholder = 'Type your math problem or follow-up doubt...',
}: DoubtInputProps) {
  const [text, setText] = useState('');
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [showDropzone, setShowDropzone] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 160) + 'px';
    }
  }, [text]);

  const handleSubmit = () => {
    if ((!text.trim() && !file) || loading) return;
    onSend(text.trim(), file || undefined);
    setText('');
    setFile(null);
    setShowDropzone(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-white/5 bg-deep-50/50 backdrop-blur-lg">
      {/* Dropzone (shown when attach is clicked) */}
      {showDropzone && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="px-4 pt-4"
        >
          <UniversalDropzone
            onFileSelect={(f) => {
              setFile(f);
              setShowDropzone(false);
            }}
            selectedFile={file}
            onRemove={() => setFile(null)}
          />
        </motion.div>
      )}

      {/* File chip (inline preview) */}
      {file && !showDropzone && (
        <div className="px-4 pt-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 glass rounded-lg border border-white/10 text-xs">
            <Sparkles size={12} className="text-electric-light" />
            <span className="text-slate-300 truncate max-w-[200px]">
              {file.name}
            </span>
            <span className="text-slate-500">{file.size}</span>
            <button
              onClick={() => setFile(null)}
              className="text-slate-500 hover:text-red-400 transition"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2 p-4">
        {/* Attach button */}
        <button
          onClick={() => setShowDropzone(!showDropzone)}
          className={`flex-shrink-0 p-2.5 rounded-xl transition-all ${
            showDropzone
              ? 'bg-electric/15 text-electric-light'
              : 'text-slate-500 hover:text-white hover:bg-white/5'
          }`}
        >
          <Paperclip size={18} />
        </button>

        {/* Textarea */}
        <div className="flex-1 relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-electric/15 to-violet/15 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="relative w-full py-3 px-4 glass-input rounded-xl text-white placeholder-slate-500 focus:outline-none resize-none text-sm leading-relaxed max-h-40"
          />
        </div>

        {/* Send button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="glow"
            size="sm"
            onClick={handleSubmit}
            loading={loading}
            disabled={!text.trim() && !file}
            className="flex-shrink-0 !p-2.5 !rounded-xl"
          >
            <Send size={16} />
          </Button>
        </motion.div>
      </div>

      {/* Hint */}
      <div className="px-4 pb-2 flex items-center gap-4 text-[10px] text-slate-600">
        <span>Press <kbd className="px-1 py-0.5 glass rounded text-slate-500">Enter</kbd> to send</span>
        <span>•</span>
        <span><kbd className="px-1 py-0.5 glass rounded text-slate-500">Shift+Enter</kbd> for new line</span>
        <span>•</span>
        <span>Supports Roman Urdu 🇵🇰</span>
      </div>
    </div>
  );
}
