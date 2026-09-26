import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, MapPin, Calendar, Sparkles, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Memory } from '../types';

interface LightboxModalProps {
  memory: Memory | null;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ memory, onClose }) => {
  if (!memory) return null;

  const handleHeartBurst = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { x, y },
      colors: ['#F43F5E', '#FDA4AF', '#F59E0B'],
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          className="relative max-w-4xl w-full max-h-[92vh] flex flex-col md:flex-row bg-[#110f17] border border-white/10 rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.9)]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 border border-white/15 text-neutral-300 hover:text-white hover:bg-black/90 transition-all backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Image Pane */}
          <div className="md:w-3/5 bg-black flex items-center justify-center relative overflow-hidden min-h-[300px] md:min-h-[550px]">
            {memory.imageUrl ? (
              <img
                src={memory.imageUrl}
                alt={memory.title}
                className="w-full h-full object-contain max-h-[75vh]"
              />
            ) : (
              <div className="p-8 text-center text-neutral-500 font-serif text-lg">
                {memory.title}
              </div>
            )}
          </div>

          {/* Metadata & Poetic Side Pane */}
          <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between bg-[#13111a] border-t md:border-t-0 md:border-l border-white/10 overflow-y-auto">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-rose-400 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{memory.tag}</span>
                <span aria-hidden="true">·</span>
                <span>{memory.mood}</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-white mb-2">
                {memory.title}
              </h3>
              <p className="text-xs text-neutral-400 mb-6">{memory.subtitle}</p>

              <blockquote className="border-l-2 border-rose-500 pl-4 py-1 italic font-serif text-sm sm:text-base text-rose-200/90 mb-6 leading-relaxed">
                "{memory.quote}"
              </blockquote>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-6">
                <span className="text-[10px] uppercase tracking-widest text-amber-400/90 font-medium block mb-1">
                  Shaurya's Memory
                </span>
                <p className="font-serif text-xs sm:text-sm text-neutral-300 italic leading-relaxed">
                  "{memory.personalNote}"
                </p>
              </div>

              <div className="space-y-2 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{memory.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>{memory.date}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={handleHeartBurst}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-medium hover:bg-rose-500/30 transition-all cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-current text-rose-400" />
                <span>Cherish This Memory</span>
              </button>

              <span className="text-[11px] text-neutral-500 font-serif">
                Isharya Forever
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
