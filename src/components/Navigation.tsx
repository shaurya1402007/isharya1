import React from 'react';
import { Volume2, VolumeX, Sparkles, ImagePlus } from 'lucide-react';

interface NavigationProps {
  isPlayingMusic: boolean;
  toggleMusic: () => void;
  onOpenLetter: () => void;
  onOpenUploader: () => void;
  onTriggerSurprise: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  isPlayingMusic,
  toggleMusic,
  onOpenLetter,
  onOpenUploader,
  onTriggerSurprise,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-[#070709]/80 backdrop-blur-xl border-b border-white/[0.06] transition-all">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#top"
        className="font-serif text-2xl md:text-3xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#FDE047] via-[#FDA4AF] to-[#F43F5E] hover:opacity-90 transition-opacity uppercase select-none"
      >
        ISHARYA
      </a>

      {/* Zone 2: 4-6 clean text navigation links */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
        <a href="#gallery" className="hover:text-rose-300 transition-colors">
          3D Gallery
        </a>
        <a href="#story" className="hover:text-rose-300 transition-colors">
          Our Story
        </a>
        <a href="#milestones" className="hover:text-rose-300 transition-colors">
          Milestones
        </a>
        <button
          onClick={onOpenLetter}
          className="hover:text-rose-300 transition-colors text-left"
        >
          Love Letter
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenUploader}
          title="Upload or Customize Photos"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-white transition-all whitespace-nowrap"
        >
          <ImagePlus className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">Add Photos</span>
        </button>

        <button
          onClick={toggleMusic}
          title={isPlayingMusic ? 'Mute Atmosphere' : 'Play Romantic Music'}
          className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all ${
            isPlayingMusic
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
              : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
          }`}
          aria-label={isPlayingMusic ? 'Mute Music' : 'Play Music'}
        >
          {isPlayingMusic ? (
            <Volume2 className="w-4 h-4 animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={onTriggerSurprise}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wider uppercase text-white bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 rounded-full shadow-[0_0_20px_rgba(244,63,94,0.35)] hover:shadow-[0_0_28px_rgba(244,63,94,0.6)] hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Surprise Her</span>
        </button>
      </div>
    </header>
  );
};
