import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  Check,
  Camera,
  Sparkles,
  FileCheck,
  RefreshCw,
  Image,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Memory } from '../types';
import { savePhotoToDB } from '../utils/imageStorage';
import { audioEngine } from '../utils/audio';

interface PhotoUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  memories: Memory[];
  onUpdateMemories: (newMemories: Memory[]) => void;
  initialSelectedSlot?: number;
}

export const PhotoUploaderModal: React.FC<PhotoUploaderModalProps> = ({
  isOpen,
  onClose,
  memories,
  onUpdateMemories,
  initialSelectedSlot = 0,
}) => {
  const [selectedSlot, setSelectedSlot] = useState(initialSelectedSlot);
  const [isDraggingBatch, setIsDraggingBatch] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  const singleFileInputRef = useRef<HTMLInputElement>(null);
  const multiFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentMemory = memories[selectedSlot];

  // Smart file classifier for matching IMG_3264, IMG_3259, etc.
  const processFilesBatch = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const updated = [...memories];
    let matchedCount = 0;

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const name = file.name.toLowerCase();

      let targetIndex = -1;
      if (name.includes('3264')) targetIndex = 0; // Boutique mirror
      else if (name.includes('3259')) targetIndex = 1; // Red string / hands
      else if (name.includes('3260')) targetIndex = 2; // Golden hour car
      else if (name.includes('3261')) targetIndex = 3; // Rickshaw hearts
      else if (name.includes('3262')) targetIndex = 4; // Sunlit glasses
      else if (name.includes('3263')) targetIndex = 5; // Head on shoulder
      else {
        // Fallback to sequential slot
        targetIndex = Math.min(i, memories.length - 1);
      }

      if (targetIndex >= 0 && targetIndex < updated.length) {
        const dataUrl = await readFileAsDataUrl(file);
        updated[targetIndex] = {
          ...updated[targetIndex],
          imageUrl: dataUrl,
        };
        await savePhotoToDB(`memory-${targetIndex + 1}`, dataUrl);
        matchedCount++;
      }
    }

    onUpdateMemories(updated);
    audioEngine.playHeartbeat();
    setUploadSuccessMsg(`Successfully loaded ${matchedCount} photos into 3D gallery!`);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F43F5E', '#FDA4AF', '#F59E0B'],
    });

    setTimeout(() => {
      setUploadSuccessMsg(null);
    }, 4000);
  };

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleSingleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const dataUrl = await readFileAsDataUrl(file);
    const updated = [...memories];
    updated[selectedSlot] = {
      ...updated[selectedSlot],
      imageUrl: dataUrl,
    };
    await savePhotoToDB(`memory-${selectedSlot + 1}`, dataUrl);
    onUpdateMemories(updated);
    audioEngine.playChime(1.1);
  };

  const handleTextChange = (field: keyof Memory, val: string) => {
    const updated = [...memories];
    updated[selectedSlot] = {
      ...updated[selectedSlot],
      [field]: val,
    };
    onUpdateMemories(updated);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-[#110e17] border border-white/10 rounded-3xl p-5 sm:p-8 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-400" />
                <h3 className="font-serif text-2xl text-white font-medium">
                  Load Your Photos Into ISHARYA
                </h3>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Select or drag all 6 images (IMG_3264, IMG_3259, etc.) to view them in realistic 3D!
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* BATCH UPLOAD DROPZONE */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingBatch(true);
            }}
            onDragLeave={() => setIsDraggingBatch(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingBatch(false);
              if (e.dataTransfer.files) {
                processFilesBatch(e.dataTransfer.files);
              }
            }}
            onClick={() => multiFileInputRef.current?.click()}
            className={`w-full py-5 px-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer mb-5 text-center flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isDraggingBatch
                ? 'border-rose-400 bg-rose-500/20'
                : 'border-rose-500/30 bg-rose-950/20 hover:border-rose-400/60 hover:bg-rose-950/30'
            }`}
          >
            <div className="flex items-center gap-3.5 text-left">
              <div className="p-3 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300">
                <Upload className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <span className="text-sm font-medium text-white block">
                  Select All 6 Photos At Once (or Drop Them Here)
                </span>
                <span className="text-xs text-neutral-400">
                  Automatically sorts IMG_3264, IMG_3259, IMG_3260, IMG_3261, IMG_3262, IMG_3263
                </span>
              </div>
            </div>

            <button
              type="button"
              className="px-5 py-2 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 text-xs font-semibold text-white tracking-wide uppercase shadow-md hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
            >
              Browse 6 Photos
            </button>
          </div>

          <input
            ref={multiFileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && processFilesBatch(e.target.files)}
            className="hidden"
          />

          {uploadSuccessMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{uploadSuccessMsg}</span>
            </div>
          )}

          {/* Quick Slot Grid of 6 Photos */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-5">
            {memories.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => setSelectedSlot(idx)}
                className={`flex flex-col items-center p-2 rounded-xl border text-left transition-all ${
                  selectedSlot === idx
                    ? 'border-rose-500 bg-rose-500/20 shadow-md'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-neutral-900 mb-1.5 relative">
                  {m.imageUrl ? (
                    <img src={m.imageUrl} alt={m.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600">
                      <Image className="w-4 h-4" />
                    </div>
                  )}
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-white font-mono">
                    #{idx + 1}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-neutral-200 truncate w-full text-center">
                  {m.title}
                </span>
              </button>
            ))}
          </div>

          {/* Selected Slot Customizer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 overflow-y-auto pr-1 no-scrollbar flex-1">
            {/* Single Photo Preview & Upload */}
            <div className="flex flex-col items-center">
              <div className="relative w-full aspect-[3/4] max-h-[280px] rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 group">
                {currentMemory.imageUrl ? (
                  <img
                    src={currentMemory.imageUrl}
                    alt={currentMemory.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 p-6 text-center">
                    <Camera className="w-10 h-10 mb-2 opacity-50" />
                    <span className="text-xs">No image loaded yet</span>
                  </div>
                )}

                <div
                  onClick={() => singleFileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 cursor-pointer transition-opacity backdrop-blur-xs"
                >
                  <Upload className="w-7 h-7 text-rose-400" />
                  <span className="text-xs font-medium text-white">Click to Replace Slot #{selectedSlot + 1}</span>
                </div>
              </div>

              <input
                ref={singleFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleSingleFileUpload}
                className="hidden"
              />

              <button
                onClick={() => singleFileInputRef.current?.click()}
                className="mt-2.5 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-neutral-200 transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-rose-400" />
                <span>Replace This Single Photo</span>
              </button>
            </div>

            {/* Note & Info Form */}
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium block mb-1">
                  Memory #{selectedSlot + 1} Title
                </label>
                <input
                  type="text"
                  value={currentMemory.title}
                  onChange={(e) => handleTextChange('title', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium block mb-1">
                  Romantic Quote
                </label>
                <input
                  type="text"
                  value={currentMemory.quote}
                  onChange={(e) => handleTextChange('quote', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium block mb-1">
                  Shaurya's Secret Note on Card Flip
                </label>
                <textarea
                  rows={3}
                  value={currentMemory.personalNote}
                  onChange={(e) => handleTextChange('personalNote', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-rose-500 resize-none font-serif italic"
                />
              </div>
            </div>
          </div>

          {/* Footer Save */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-serif italic">
              Photos automatically persist across page reloads
            </span>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 text-white text-xs font-semibold tracking-wider uppercase hover:opacity-95 transition-opacity"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Enjoy in Full 3D</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
