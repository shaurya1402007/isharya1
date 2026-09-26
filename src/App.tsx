import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { INITIAL_MEMORIES } from './data/memories';
import { Memory } from './types';
import { Navigation } from './components/Navigation';
import { PetalCanvas } from './components/PetalCanvas';
import { HeroSection } from './components/HeroSection';
import { ThreeDCarousel } from './components/ThreeDCarousel';
import { StorySection } from './components/StorySection';
import { MilestonesSection } from './components/MilestonesSection';
import { Footer } from './components/Footer';
import { LoveLetterModal } from './components/LoveLetterModal';
import { PhotoUploaderModal } from './components/PhotoUploaderModal';
import { LightboxModal } from './components/LightboxModal';
import { audioEngine } from './utils/audio';
import { getAllPhotosFromDB, savePhotoToDB } from './utils/imageStorage';
import { Upload, Sparkles, Image, Check } from 'lucide-react';

const STORAGE_KEY = 'isharya_custom_memories_v2';

export default function App() {
  const [memories, setMemories] = useState<Memory[]>(INITIAL_MEMORIES);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [uploaderIndex, setUploaderIndex] = useState(0);
  const [selectedLightboxMemory, setSelectedLightboxMemory] = useState<Memory | null>(null);
  const [hasCustomPhotos, setHasCustomPhotos] = useState(false);

  // Load photos from IndexedDB & localStorage on mount
  useEffect(() => {
    async function loadSavedData() {
      try {
        const savedMeta = localStorage.getItem(STORAGE_KEY);
        let baseMemories = INITIAL_MEMORIES;
        if (savedMeta) {
          baseMemories = JSON.parse(savedMeta);
        }

        // Check IndexedDB for large image data
        const dbPhotos = await getAllPhotosFromDB();
        let loadedCustom = false;

        const merged = baseMemories.map((m, idx) => {
          const dbKey = `memory-${idx + 1}`;
          if (dbPhotos[dbKey]) {
            loadedCustom = true;
            return { ...m, imageUrl: dbPhotos[dbKey] };
          }
          if (m.imageUrl && m.imageUrl.startsWith('data:image')) {
            loadedCustom = true;
          }
          return m;
        });

        setMemories(merged);
        setHasCustomPhotos(loadedCustom);
      } catch (err) {
        console.error('Error loading saved photos', err);
      }
    }
    loadSavedData();
  }, []);

  // Sync memories to state & storage
  const handleUpdateMemories = async (newMemories: Memory[]) => {
    setMemories(newMemories);
    setHasCustomPhotos(true);

    // Save lightweight metadata to localStorage
    const metaOnly = newMemories.map((m) => ({
      ...m,
      // If dataUrl, avoid blowing up localStorage quota; it's saved in IndexedDB
      imageUrl: m.imageUrl?.startsWith('data:') ? undefined : m.imageUrl,
    }));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(metaOnly));
    } catch {
      // ignore
    }

    // Save each image to IndexedDB
    for (let i = 0; i < newMemories.length; i++) {
      if (newMemories[i].imageUrl) {
        await savePhotoToDB(`memory-${i + 1}`, newMemories[i].imageUrl!);
      }
    }
  };

  const toggleMusic = () => {
    const playing = audioEngine.toggle();
    setIsPlayingMusic(playing);
  };

  const handleOpenLetter = () => {
    setIsLetterOpen(true);
    audioEngine.playChime(1.2);
  };

  const handleOpenUploader = (index = 0) => {
    setUploaderIndex(index);
    setIsUploaderOpen(true);
  };

  const handleTriggerSurprise = () => {
    audioEngine.playChime(1.3);
    audioEngine.playHeartbeat();

    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;

    const interval: number = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 40 * (timeLeft / duration);
      confetti({
        particleCount,
        spread: 90,
        origin: { x: Math.random() * 0.4 + 0.1, y: Math.random() * 0.4 + 0.3 },
        colors: ['#F43F5E', '#FDA4AF', '#F59E0B', '#FFF'],
      });
      confetti({
        particleCount,
        spread: 90,
        origin: { x: Math.random() * 0.4 + 0.5, y: Math.random() * 0.4 + 0.3 },
        colors: ['#F43F5E', '#EC4899', '#FDE047', '#FFF'],
      });
    }, 250);
  };

  const scrollToGallery = () => {
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#070709] text-[#F3F1ED] overflow-x-hidden selection:bg-rose-500 selection:text-white">
      {/* 3D Floating Rose Petals & Stardust Canvas */}
      <PetalCanvas />

      {/* Top 3-Zone Navigation */}
      <Navigation
        isPlayingMusic={isPlayingMusic}
        toggleMusic={toggleMusic}
        onOpenLetter={handleOpenLetter}
        onOpenUploader={() => handleOpenUploader(0)}
        onTriggerSurprise={handleTriggerSurprise}
      />

      {/* Hero Section */}
      <HeroSection
        onExploreGallery={scrollToGallery}
        onOpenLetter={handleOpenLetter}
        toggleMusic={toggleMusic}
        isPlayingMusic={isPlayingMusic}
      />

      {/* Prominent Quick-Upload Banner for Shaurya's Photos */}
      <div className="max-w-4xl mx-auto px-6 mb-4">
        <div
          onClick={() => handleOpenUploader(0)}
          className="relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-rose-950/40 via-neutral-900/60 to-amber-950/30 border border-rose-500/30 hover:border-rose-400/60 shadow-lg cursor-pointer transition-all hover:scale-[1.01] flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="p-3 rounded-full bg-rose-500/20 text-rose-300 shrink-0">
              {hasCustomPhotos ? (
                <Check className="w-5 h-5 text-emerald-400" />
              ) : (
                <Upload className="w-5 h-5 animate-pulse text-rose-400" />
              )}
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="font-serif text-base sm:text-lg font-semibold text-white">
                  {hasCustomPhotos
                    ? "Isharya's Photos Are Live in 3D!"
                    : "Load Your 6 Photos into ISHARYA"}
                </span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono">
                  1-Click Multi-Upload
                </span>
              </div>
              <p className="text-xs text-neutral-300 font-light mt-0.5">
                {hasCustomPhotos
                  ? "Click anytime to swap photos or customize Shaurya's secret love notes."
                  : "Click here or drag your 6 files (IMG_3264, IMG_3259, etc.) to view them in realistic 3D!"}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="px-5 py-2 rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white text-xs font-semibold uppercase tracking-wider shadow-md shrink-0 hover:opacity-90"
          >
            {hasCustomPhotos ? "Manage Photos" : "Upload 6 Photos Now"}
          </button>
        </div>
      </div>

      {/* Realistic 3D Sliding Carousel */}
      <ThreeDCarousel
        memories={memories}
        onSelectMemory={(m) => setSelectedLightboxMemory(m)}
        onOpenUploaderForIndex={(idx) => handleOpenUploader(idx)}
      />

      {/* Our Love Story Timeline */}
      <StorySection />

      {/* Milestones in Numbers */}
      <MilestonesSection />

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <LoveLetterModal
        isOpen={isLetterOpen}
        onClose={() => setIsLetterOpen(false)}
      />

      <PhotoUploaderModal
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        memories={memories}
        onUpdateMemories={handleUpdateMemories}
        initialSelectedSlot={uploaderIndex}
      />

      <LightboxModal
        memory={selectedLightboxMemory}
        onClose={() => setSelectedLightboxMemory(null)}
      />
    </div>
  );
}
