'use client';

import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  X,
  FileText,
  ImageIcon,
  AlertCircle,
} from 'lucide-react';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'application/pdf',
];

export interface UploadedFile {
  file: File;
  name: string;
  size: string;
  type: string;
  preview?: string; // base64 preview for images
  base64: string; // full base64 data
}

interface UniversalDropzoneProps {
  onFileSelect: (file: UploadedFile) => void;
  selectedFile: UploadedFile | null;
  onRemove: () => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function UniversalDropzone({
  onFileSelect,
  selectedFile,
  onRemove,
}: UniversalDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      setError(null);

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError('Only PNG, JPG, WEBP, GIF, and PDF files are supported.');
        return;
      }
      if (file.size > MAX_SIZE) {
        setError(`File too large (${formatSize(file.size)}). Maximum is 5MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64Full = reader.result as string;
        const base64Data = base64Full.split(',')[1];
        const uploaded: UploadedFile = {
          file,
          name: file.name,
          size: formatSize(file.size),
          type: file.type,
          base64: base64Data,
          preview: file.type.startsWith('image/') ? base64Full : undefined,
        };
        onFileSelect(uploaded);
      };
      reader.readAsDataURL(file);
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    if (fileRef.current) fileRef.current.value = '';
  };

  // If a file is selected, show the file chip
  if (selectedFile) {
    return (
      <FileChip file={selectedFile} onRemove={onRemove} />
    );
  }

  return (
    <div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`relative rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
          isDragging
            ? 'border-electric/60 bg-electric/5 shadow-glow'
            : 'border-white/10 hover:border-electric/30 hover:bg-white/[0.02]'
        }`}
      >
        <div className="flex flex-col items-center justify-center py-8 px-4">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-electric/15 to-violet/15 border border-electric/20 flex items-center justify-center mb-4">
              <Upload size={22} className="text-electric-light" />
            </div>
          </motion.div>
          <p className="text-white font-medium text-sm mb-1">
            Drop a file here, or click to browse
          </p>
          <p className="text-slate-500 text-xs">
            Images (PNG, JPG, WEBP) or PDF • Up to 5MB
          </p>
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-2 mt-2 text-red-400 text-xs"
          >
            <AlertCircle size={13} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <input
        ref={fileRef}
        type="file"
        accept=".png,.jpg,.jpeg,.webp,.gif,.pdf"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}

/** Visual file chip showing name, size, type icon, and remove button */
function FileChip({
  file,
  onRemove,
}: {
  file: UploadedFile;
  onRemove: () => void;
}) {
  const isPdf = file.type === 'application/pdf';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass rounded-xl border border-white/10 overflow-hidden"
    >
      <div className="flex items-center gap-3 p-3">
        {/* Preview / icon */}
        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-deep-50 to-deep border border-white/5">
          {file.preview ? (
            <img
              src={file.preview}
              alt={file.name}
              className="w-full h-full object-cover"
            />
          ) : isPdf ? (
            <FileText size={20} className="text-red-400" />
          ) : (
            <ImageIcon size={20} className="text-electric-light" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {file.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] px-1.5 py-0.5 rounded-full glass text-slate-400 border border-white/5">
              {isPdf ? 'PDF' : file.type.split('/')[1]?.toUpperCase()}
            </span>
            <span className="text-[10px] text-slate-500">{file.size}</span>
          </div>
        </div>

        {/* Remove */}
        <button
          onClick={onRemove}
          className="p-1.5 rounded-lg hover:bg-red-500/15 transition text-slate-500 hover:text-red-400"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
}
