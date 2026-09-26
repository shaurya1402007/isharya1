import React, { useState, useEffect } from 'react';
import { Heart, Clock, Infinity as InfinityIcon, Camera, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const MilestonesSection: React.FC = () => {
  // Days counter: let's calculate days or provide an anniversary ticker
  const [heartbeats, setHeartbeats] = useState(1284520);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeartbeats((prev) => prev + 1);
    }, 850);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      value: '∞',
      label: 'Endless Laughs',
      note: 'Every inside joke & sweet giggle',
      icon: InfinityIcon,
    },
    {
      value: heartbeats.toLocaleString(),
      label: 'Heartbeats Synced',
      note: 'Ticking together in perfect harmony',
      isLive: true,
      icon: Heart,
    },
    {
      value: '6+',
      label: 'Cherished Snapshots',
      note: 'Immortalized in 3D realism',
      icon: Camera,
    },
    {
      value: '1',
      label: 'Red Thread of Destiny',
      note: 'Bound across every lifetime',
      icon: Sparkles,
    },
  ];

  const handleConfetti = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 50,
      spread: 75,
      origin: { x, y },
      colors: ['#F43F5E', '#FDA4AF', '#F59E0B'],
    });
  };

  return (
    <section id="milestones" className="relative py-20 px-6 md:px-12 bg-[#07060b] border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-amber-400 mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>Our Journey in Numbers</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight mb-4">
            Forever By The Numbers
          </h2>
          <p className="text-sm text-neutral-400 font-light">
            Some things can never be measured, but these numbers tell our story.
          </p>
        </div>

        {/* 4 Clean Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, idx) => {
            const IconComponent = s.icon;
            return (
              <div
                key={idx}
                onClick={handleConfetti}
                className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-rose-500/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="p-2.5 rounded-xl bg-white/5 text-rose-400 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-5 h-5" />
                  </span>
                  {s.isLive && (
                    <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Live
                    </span>
                  )}
                </div>

                <div className="font-mono tabular-nums text-3xl sm:text-4xl font-semibold text-white mb-2 tracking-tight group-hover:text-rose-200 transition-colors">
                  {s.value}
                </div>

                <div className="font-serif text-lg font-medium text-neutral-200 mb-1">
                  {s.label}
                </div>

                <div className="text-xs text-neutral-500 font-light">
                  {s.note}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
