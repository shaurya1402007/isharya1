import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';

export const StorySection: React.FC = () => {
  const chapters = [
    {
      index: '01',
      title: 'The Spark',
      timeframe: 'Chapter One',
      description:
        'When our paths first crossed, neither of us knew that ordinary conversations would turn into late-night whispers, effortless laughter, and the beginning of the most beautiful chapter of our lives.',
      detail: 'The moment laughter became our shared language.',
    },
    {
      index: '02',
      title: 'The Red Thread',
      timeframe: 'Chapter Two',
      description:
        'They say some connections are woven into the fabric of the universe before we even arrive. From our first deep talks to holding hands with the red cord tied around our wrists, every step proved we were meant to be.',
      detail: 'An unbreakable bond written in the stars.',
    },
    {
      index: '03',
      title: 'Our Wild Adventures',
      timeframe: 'Chapter Three',
      description:
        'From spontaneous auto rides with heart filters to strolling through quiet sunlit streets, exploring cafes, and trying on silly outfits in boutique mirrors. With you, every mundane day is pure cinema.',
      detail: 'Creating endless memories in every corner of the city.',
    },
    {
      index: '04',
      title: 'Safe In Your Arms',
      timeframe: 'Chapter Four',
      description:
        'In a fast, chaotic world, resting my eyes beside you and feeling you lean your head upon my shoulder is the truest peace I have ever known. You are my safe harbor, today and for all the tomorrows to come.',
      detail: 'Where silence feels like home.',
    },
  ];

  return (
    <section id="story" className="relative py-24 px-6 md:px-12 bg-[#09080e] border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-rose-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Chronicle</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight mb-4">
            How Two Worlds Became One
          </h2>
          <p className="text-sm text-neutral-400 font-light leading-relaxed">
            Every love story is special, but ours is my absolute favorite.
          </p>
        </div>

        {/* Editorial Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {chapters.map((ch) => (
            <div
              key={ch.index}
              className="relative p-8 rounded-3xl bg-white/[0.02] border border-white/[0.08] hover:border-rose-500/30 transition-all duration-300 group"
            >
              <div className="flex items-baseline justify-between mb-4">
                <span className="font-serif text-3xl font-light text-rose-400/80">
                  {ch.index}
                </span>
                {/* Zero-pill metadata */}
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span>{ch.timeframe}</span>
                  <span aria-hidden="true">·</span>
                  <span>Isharya</span>
                </div>
              </div>

              <h3 className="font-serif text-2xl font-medium text-white mb-3 group-hover:text-rose-200 transition-colors">
                {ch.title}
              </h3>

              <p className="text-sm text-neutral-300 font-light leading-relaxed mb-6">
                {ch.description}
              </p>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-rose-300/80 font-serif italic">
                <span>{ch.detail}</span>
                <Heart className="w-3 h-3 text-rose-400 opacity-60" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
