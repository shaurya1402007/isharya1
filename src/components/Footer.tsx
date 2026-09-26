import React from 'react';
import { Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Footer: React.FC = () => {
  const triggerLove = () => {
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.8 },
      colors: ['#F43F5E', '#FDA4AF', '#F59E0B', '#FFFFFF'],
    });
  };

  return (
    <footer className="py-16 px-6 border-t border-white/[0.06] bg-[#050408] text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <a
          href="#top"
          className="font-serif text-3xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-rose-500 uppercase mb-4 hover:opacity-90 transition-opacity"
        >
          ISHARYA
        </a>

        <p className="font-serif text-base text-neutral-400 italic mb-6 max-w-md">
          "Two souls, one red thread, and an infinity of cherished moments."
        </p>

        <button
          onClick={triggerLove}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium transition-all mb-8 cursor-pointer"
        >
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>Isha, you will always be my forever</span>
        </button>

        <div className="text-xs text-neutral-500 flex flex-col sm:flex-row items-center gap-2">
          <span>Designed & built for Isha with all my heart</span>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <span>Shaurya & Isha · Isharya 2026</span>
        </div>
      </div>
    </footer>
  );
};
