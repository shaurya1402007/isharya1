import React from 'react';
import { motion } from 'motion/react';
import { Heart, Compass, Sparkles, Music } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HeroSectionProps {
  onExploreGallery: () => void;
  onOpenLetter: () => void;
  toggleMusic: () => void;
  isPlayingMusic: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreGallery,
  onOpenLetter,
  toggleMusic,
  isPlayingMusic,
}) => {
  const handleLoveClick = () => {
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#F43F5E', '#FDA4AF', '#F59E0B', '#E11D48', '#FFFFFF'],
    });
  };

  return (
    <section
      id="top"
      className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden"
    >
      {/* Soft romantic radial gradient in background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-rose-900/20 via-amber-900/15 to-rose-950/20 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative z-20 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Subtle Romantic Kicker */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md text-xs font-medium text-rose-300 mb-8"
        >
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
          <span>Isha & Shaurya</span>
          <span aria-hidden="true" className="text-white/20">·</span>
          <span>A 3D Love Story</span>
        </motion.div>

        {/* Masterpiece Title with 3D Depth */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-[0.12em] text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5F5] via-[#FED7AA] to-[#F43F5E] mb-6 drop-shadow-[0_15px_30px_rgba(244,63,94,0.3)] select-none uppercase"
        >
          ISHARYA
        </motion.h1>

        {/* Poetic Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif text-lg sm:text-2xl md:text-3xl text-neutral-200 font-light italic max-w-2xl leading-relaxed mb-10 text-balance"
        >
          "Some souls are tied by invisible red threads, destined to find each other across every universe."
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={onExploreGallery}
            className="flex items-center gap-2.5 px-7 py-3.5 text-sm font-semibold tracking-wide text-white bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 rounded-full shadow-[0_0_30px_rgba(244,63,94,0.4)] hover:shadow-[0_0_40px_rgba(244,63,94,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Enter 3D Gallery</span>
          </button>

          <button
            onClick={onOpenLetter}
            className="flex items-center gap-2.5 px-6 py-3.5 text-sm font-medium text-neutral-200 bg-white/5 border border-white/15 rounded-full hover:bg-white/10 hover:text-white hover:border-white/30 transition-all cursor-pointer backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Open Love Letter</span>
          </button>

          <button
            onClick={toggleMusic}
            className="flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-full hover:bg-rose-500/20 transition-all cursor-pointer"
          >
            <Music className="w-4 h-4" />
            <span>{isPlayingMusic ? 'Atmosphere On' : 'Play Music'}</span>
          </button>
        </motion.div>

        {/* Floating Heart Button */}
        <div className="mt-14">
          <button
            onClick={handleLoveClick}
            className="group flex items-center gap-2 text-xs text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
          >
            <Heart className="w-4 h-4 text-rose-500 group-hover:scale-125 transition-transform" />
            <span>Tap to send a heartbeat to Isha</span>
          </button>
        </div>
      </div>
    </section>
  );
};
