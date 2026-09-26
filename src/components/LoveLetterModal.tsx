import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Edit3, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../utils/audio';

interface LoveLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoveLetterModal: React.FC<LoveLetterModalProps> = ({ isOpen, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [letterText, setLetterText] = useState(
    `My dearest Isha,

From the moment you entered my life, ordinary days turned into something magical. The way you look at me in a crowded room, the warmth of your hand tied to mine, the crazy laughs we share on bumpy auto rides, and the quiet comfort when you rest your head on my shoulder—every single moment with you is etched into my heart forever.

You are my peace, my biggest cheerleader, and my absolute favorite person in the entire world. No matter where life takes us, my hand will always be holding yours. 

Thank you for being you, for your kindness, your radiant smile, and the endless happiness you bring to my soul.

With all my love and devotion,
Shaurya (Isharya forever) ❤️`
  );

  if (!isOpen) return null;

  const handleWaxSealClick = () => {
    audioEngine.playHeartbeat();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#F43F5E', '#FDA4AF', '#F59E0B', '#E11D48'],
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-gradient-to-br from-[#1c1822] via-[#141018] to-[#0c0a10] border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-[0_25px_70px_rgba(244,63,94,0.3)] overflow-hidden"
        >
          {/* Subtle gold foil corner accents */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-amber-500/20 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-rose-500/20 via-transparent to-transparent pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Letter Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-serif text-rose-300 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>A Personal Confession</span>
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-amber-100 font-semibold tracking-wide">
              To My Beloved Isha
            </h3>
          </div>

          {/* Parchment Body */}
          <div className="relative p-6 sm:p-8 rounded-2xl bg-[#0a080d]/80 border border-white/[0.07] backdrop-blur-md mb-6 max-h-[50vh] overflow-y-auto no-scrollbar">
            {isEditing ? (
              <textarea
                value={letterText}
                onChange={(e) => setLetterText(e.target.value)}
                rows={9}
                className="w-full bg-transparent font-serif text-base sm:text-lg text-neutral-200 leading-relaxed focus:outline-none resize-none"
              />
            ) : (
              <p className="font-serif text-base sm:text-lg text-neutral-200 leading-relaxed whitespace-pre-line italic">
                {letterText}
              </p>
            )}
          </div>

          {/* Wax Seal & Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-amber-300 transition-colors"
            >
              {isEditing ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Done Editing</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Personalize Letter</span>
                </>
              )}
            </button>

            {/* Wax Seal Stamp */}
            <button
              onClick={handleWaxSealClick}
              className="group flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-red-800 via-rose-700 to-red-900 border border-rose-400/40 shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(225,29,72,0.7)] hover:scale-105 active:scale-95 transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-red-950 flex items-center justify-center border border-amber-300/40 font-serif text-[10px] font-bold text-amber-200">
                I&S
              </div>
              <span className="text-xs font-serif tracking-wider uppercase text-amber-100 font-medium">
                Seal With Love
              </span>
              <Heart className="w-3.5 h-3.5 text-rose-300 fill-current group-hover:scale-125 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
