import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Heart,
  RotateCw,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  CircleDot,
  SlidersHorizontal,
  Play,
  Pause,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Memory, Slide3DMode } from '../types';
import { audioEngine } from '../utils/audio';

interface ThreeDCarouselProps {
  memories: Memory[];
  onSelectMemory: (memory: Memory) => void;
  onOpenUploaderForIndex: (index: number) => void;
}

export const ThreeDCarousel: React.FC<ThreeDCarouselProps> = ({
  memories,
  onSelectMemory,
  onOpenUploaderForIndex,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mode, setMode] = useState<Slide3DMode>('coverflow');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const total = memories.length;

  const nextSlide = useCallback(() => {
    setIsFlipped(false);
    setActiveIndex((prev) => (prev + 1) % total);
    audioEngine.playChime(1.1);
  }, [total]);

  const prevSlide = useCallback(() => {
    setIsFlipped(false);
    setActiveIndex((prev) => (prev - 1 + total) % total);
    audioEngine.playChime(0.9);
  }, [total]);

  // Autoplay timer
  useEffect(() => {
    if (!isAutoplay || isDragging) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoplay, isDragging, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === ' ') {
        e.preventDefault();
        setIsAutoplay((a) => !a);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Interactive 3D tilt tracking relative to container center
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Drag / touch swipe handling
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    setDragStartX(clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const clientX =
      'changedTouches' in e
        ? e.changedTouches[0].clientX
        : (e as React.MouseEvent).clientX;
    const delta = clientX - dragStartX;
    if (delta < -45) nextSlide();
    else if (delta > 45) prevSlide();
  };

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
    audioEngine.playHeartbeat();

    // Trigger sweet heart confetti
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 28,
      spread: 60,
      origin: { x, y },
      colors: ['#F43F5E', '#FDA4AF', '#F59E0B', '#FFFFFF'],
      ticks: 150,
      scalar: 1.1,
    });
  };

  const activeMemory = memories[activeIndex];

  return (
    <section id="gallery" className="relative py-20 px-4 md:px-8 overflow-hidden select-none">
      {/* Ambient background glow highlights */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] rounded-full blur-[140px] pointer-events-none transition-colors duration-1000 opacity-25"
        style={{
          background: `radial-gradient(circle, ${activeMemory.colorAccent} 0%, rgba(0,0,0,0) 70%)`,
        }}
      />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12 max-w-2xl px-4">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-rose-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive 3D Romance</span>
            <span aria-hidden="true">·</span>
            <span>Memory {activeIndex + 1} of {total}</span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-normal tracking-tight text-white mb-4">
            Moments Frozen In Space & Time
          </h2>
          <p className="text-sm md:text-base text-neutral-400 font-light leading-relaxed">
            Drag, tilt, or slide through our story. Every photo holds a heartbeat that will always belong to you.
          </p>
        </div>

        {/* 3D Mode Selector Buttons */}
        <div className="flex items-center gap-2 p-1.5 bg-neutral-900/80 border border-white/10 rounded-full mb-8 backdrop-blur-md shadow-xl">
          <button
            onClick={() => setMode('coverflow')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap ${
              mode === 'coverflow'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>3D Coverflow</span>
          </button>
          <button
            onClick={() => setMode('cylinder')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap ${
              mode === 'cylinder'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <CircleDot className="w-3 h-3" />
            <span>3D Cylinder</span>
          </button>
          <button
            onClick={() => setMode('floating-stack')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap ${
              mode === 'floating-stack'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>3D Depth Stack</span>
          </button>
        </div>

        {/* 3D VIEWPORT STAGE */}
        <div
          ref={stageRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleTouchStart}
          onMouseUp={handleTouchEnd}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full h-[520px] md:h-[620px] flex items-center justify-center cursor-grab active:cursor-grabbing perspective-1600"
          style={{
            perspective: '1400px',
          }}
        >
          {/* 3D Rotating World Container */}
          <div
            className="relative w-full h-full flex items-center justify-center preserve-3d transition-transform duration-300 ease-out"
            style={{
              transform: `rotateX(${-mousePos.y * 7}deg) rotateY(${mousePos.x * 9}deg)`,
            }}
          >
            {memories.map((mem, index) => {
              // Calculate spatial distance from active slide
              let offset = index - activeIndex;
              // Wrap offset for circular cylinder
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;

              const isCurrent = index === activeIndex;
              const isLiked = !!likedMap[mem.id];

              // Compute 3D transforms based on selected mode
              let transformStyle = '';
              let zIndex = 10 - Math.abs(offset);
              let opacity = 1;
              let filter = 'none';

              if (mode === 'coverflow') {
                if (isCurrent) {
                  transformStyle = `translateX(0px) translateZ(120px) rotateY(${mousePos.x * 6}deg) scale(1.05)`;
                  opacity = 1;
                  filter = 'brightness(1.08) drop-shadow(0 25px 40px rgba(0,0,0,0.85))';
                } else {
                  const direction = offset > 0 ? 1 : -1;
                  const distance = Math.abs(offset);
                  const xOffset = direction * (170 + distance * 80);
                  const zOffset = -120 - distance * 90;
                  const rotY = -direction * 48;
                  transformStyle = `translateX(${xOffset}px) translateZ(${zOffset}px) rotateY(${rotY}deg) scale(${
                    1 - distance * 0.12
                  })`;
                  opacity = Math.max(0.2, 0.9 - distance * 0.28);
                  filter = `brightness(${0.65 - distance * 0.1}) blur(${distance > 1 ? '1.5px' : '0px'})`;
                }
              } else if (mode === 'cylinder') {
                const angleStep = 360 / total;
                const cardAngle = offset * angleStep;
                const radius = window.innerWidth < 768 ? 320 : 460;
                transformStyle = `rotateY(${cardAngle}deg) translateZ(${radius}px) scale(${
                  isCurrent ? 1.05 : 0.92
                })`;
                opacity = isCurrent ? 1 : Math.max(0.25, Math.cos((cardAngle * Math.PI) / 180));
                filter = isCurrent
                  ? 'brightness(1.1) drop-shadow(0 20px 35px rgba(244,63,94,0.3))'
                  : 'brightness(0.55)';
              } else {
                // Floating stack mode
                if (isCurrent) {
                  transformStyle = `translateX(0px) translateY(0px) translateZ(140px) rotate(${
                    mousePos.x * 3
                  }deg) scale(1.06)`;
                  opacity = 1;
                } else {
                  const rot = offset * 6;
                  const x = offset * 35;
                  const y = Math.abs(offset) * 14;
                  const z = -Math.abs(offset) * 80;
                  transformStyle = `translateX(${x}px) translateY(${y}px) translateZ(${z}px) rotate(${rot}deg) scale(${
                    1 - Math.abs(offset) * 0.08
                  })`;
                  opacity = Math.max(0.15, 0.85 - Math.abs(offset) * 0.25);
                }
              }

              return (
                <div
                  key={mem.id}
                  onClick={() => {
                    if (isCurrent) {
                      setIsFlipped(!isFlipped);
                    } else {
                      setActiveIndex(index);
                      setIsFlipped(false);
                      audioEngine.playChime(1.0);
                    }
                  }}
                  className="absolute w-[290px] sm:w-[340px] md:w-[380px] h-[440px] sm:h-[490px] md:h-[530px] rounded-2xl preserve-3d transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer"
                  style={{
                    transform: transformStyle,
                    zIndex,
                    opacity,
                    filter,
                  }}
                >
                  {/* Flip card inner wrapper */}
                  <div
                    className="w-full h-full preserve-3d transition-transform duration-700"
                    style={{
                      transform: isCurrent && isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                  >
                    {/* FRONT OF 3D CARD */}
                    <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden glass-luxury border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)] group">
                      {/* Image frame */}
                      <div className="relative w-full h-[72%] overflow-hidden bg-neutral-900">
                        {mem.imageUrl ? (
                          <img
                            src={mem.imageUrl}
                            alt={mem.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900 p-6 text-center">
                            <Sparkles className="w-10 h-10 text-rose-400 mb-2 opacity-60" />
                            <span className="font-serif text-lg text-white font-medium">
                              {mem.title}
                            </span>
                            <span className="text-xs text-neutral-400 mt-1">
                              {mem.subtitle}
                            </span>
                          </div>
                        )}

                        {/* Gradient scrim for text legibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-[#0d0d12]/30 to-transparent" />

                        {/* Specular sheen highlight moving with mouse */}
                        {isCurrent && (
                          <div
                            className="absolute inset-0 pointer-events-none mix-blend-overlay transition-opacity duration-300 opacity-60"
                            style={{
                              background: `radial-gradient(circle at ${(mousePos.x + 1) * 50}% ${(mousePos.y + 1) * 50}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 60%)`,
                            }}
                          />
                        )}

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                          <span className="px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase text-neutral-200 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                            {mem.tag}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => handleLike(mem.id, e)}
                              className={`p-2 rounded-full backdrop-blur-md border transition-all ${
                                isLiked
                                  ? 'bg-rose-500/80 border-rose-400 text-white shadow-lg'
                                  : 'bg-black/50 border-white/10 text-neutral-300 hover:text-white hover:bg-black/70'
                              }`}
                              title={isLiked ? 'Loved' : 'Send Love'}
                            >
                              <Heart
                                className={`w-3.5 h-3.5 ${
                                  isLiked ? 'fill-current scale-110' : ''
                                }`}
                              />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectMemory(mem);
                              }}
                              className="p-2 rounded-full bg-black/50 border border-white/10 text-neutral-300 hover:text-white hover:bg-black/70 backdrop-blur-md transition-all"
                              title="Full Resolution Lightbox"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Flip prompt hint */}
                        {isCurrent && (
                          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-neutral-300 opacity-80 group-hover:opacity-100 transition-opacity">
                            <RotateCw className="w-2.5 h-2.5" />
                            <span>Click to read secret note</span>
                          </div>
                        )}
                      </div>

                      {/* Card Content Footer */}
                      <div className="p-4 sm:p-5 flex flex-col justify-between h-[28%] bg-[#0e0c12]/95 border-t border-white/[0.06]">
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-neutral-400 font-light mb-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-rose-400" />
                              {mem.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-amber-400" />
                              {mem.date}
                            </span>
                          </div>
                          <h3 className="font-serif text-lg sm:text-xl font-medium text-white truncate">
                            {mem.title}
                          </h3>
                        </div>

                        <p className="text-xs text-rose-200/80 italic font-serif truncate mt-1">
                          "{mem.quote}"
                        </p>
                      </div>
                    </div>

                    {/* BACK OF 3D CARD (FLIPPED SECRET NOTE) */}
                    <div
                      className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a141b] via-[#120d14] to-[#0a080d] border border-rose-500/30 p-6 flex flex-col justify-between shadow-[0_20px_50px_rgba(244,63,94,0.25)]"
                      style={{ transform: 'rotateY(180deg)' }}
                    >
                      <div>
                        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                          <span className="text-[11px] uppercase tracking-widest text-rose-400 font-medium">
                            Shaurya's Private Note to Isha
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsFlipped(false);
                            }}
                            className="text-xs text-neutral-400 hover:text-white"
                          >
                            Flip Back
                          </button>
                        </div>
                        <h4 className="font-serif text-xl text-white font-medium mb-3">
                          {mem.title}
                        </h4>
                        <p className="font-serif text-sm sm:text-base text-neutral-300 leading-relaxed italic">
                          "{mem.personalNote}"
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs text-rose-300 font-serif">
                          Forever yours, Shaurya
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenUploaderForIndex(index);
                          }}
                          className="text-[11px] text-amber-400 hover:text-amber-300 underline font-medium"
                        >
                          Change Photo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Glossy Floor Reflection Effect */}
        <div className="w-[85%] max-w-3xl h-8 -mt-6 bg-gradient-to-b from-rose-500/10 via-transparent to-transparent blur-md rounded-full pointer-events-none" />

        {/* Intuitive Sliding Controls */}
        <div className="w-full max-w-xl flex items-center justify-between mt-6 px-4">
          {/* Previous Slide Button */}
          <button
            onClick={prevSlide}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/15 hover:scale-105 active:scale-95 transition-all shadow-lg"
            aria-label="Previous Memory"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Dots Indicator & Autoplay Toggle */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              {memories.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveIndex(i);
                    setIsFlipped(false);
                    audioEngine.playChime(1.0);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? 'w-8 bg-gradient-to-r from-rose-500 to-amber-400'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setIsAutoplay(!isAutoplay)}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-rose-300 transition-colors"
            >
              {isAutoplay ? (
                <>
                  <Pause className="w-3 h-3 text-rose-400" />
                  <span>Autoplay Active</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-neutral-400" />
                  <span>Resume Autoplay</span>
                </>
              )}
            </button>
          </div>

          {/* Next Slide Button */}
          <button
            onClick={nextSlide}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/15 hover:scale-105 active:scale-95 transition-all shadow-lg"
            aria-label="Next Memory"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Active Memory Poetic Card Highlight */}
        <div className="mt-12 w-full max-w-2xl text-center p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-sm">
          <span className="text-[11px] uppercase tracking-widest text-amber-400/80 font-medium">
            Moment {activeIndex + 1} Spotlight
          </span>
          <h3 className="font-serif text-2xl text-white font-semibold mt-1">
            {activeMemory.title}
          </h3>
          <p className="text-sm text-neutral-300 font-light mt-2 max-w-lg mx-auto">
            {activeMemory.personalNote}
          </p>
        </div>
      </div>
    </section>
  );
};
