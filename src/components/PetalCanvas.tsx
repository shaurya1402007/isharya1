import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  z: number;
  size: number;
  speedX: number;
  speedY: number;
  speedZ: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
  color: string;
}

export const PetalCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = [
      'rgba(244, 63, 94, 0.45)', // Rose
      'rgba(251, 113, 133, 0.4)', // Light rose
      'rgba(245, 158, 11, 0.35)', // Warm gold
      'rgba(253, 164, 175, 0.35)', // Pink petal
      'rgba(255, 255, 255, 0.5)', // Stardust
    ];

    // Initialize 45 petals and 60 glowing stardust particles
    const petals: Petal[] = Array.from({ length: 55 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 2 + 0.5,
      size: Math.random() * 8 + 4,
      speedX: (Math.random() - 0.4) * 0.8,
      speedY: Math.random() * 1.0 + 0.4,
      speedZ: (Math.random() - 0.5) * 0.01,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
      opacity: Math.random() * 0.6 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    let tick = 0;
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Subtle ambient vignette gradient
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        width * 0.1,
        width / 2,
        height / 2,
        width * 0.7
      );
      gradient.addColorStop(0, 'rgba(244, 63, 94, 0.03)');
      gradient.addColorStop(0.5, 'rgba(120, 10, 40, 0.02)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      petals.forEach((p) => {
        // Natural sine-wave flutter
        p.x += p.speedX + Math.sin(tick * 0.02 + p.y * 0.01) * 0.6;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(p.z, p.z);

        // Draw curved romantic petal shape
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          p.size / 2,
          -p.size / 2,
          p.size,
          p.size / 3,
          0,
          p.size * 1.4
        );
        ctx.bezierCurveTo(
          -p.size,
          p.size / 3,
          -p.size / 2,
          -p.size / 2,
          0,
          0
        );
        ctx.fillStyle = p.color;
        ctx.shadowColor = 'rgba(244, 63, 94, 0.4)';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
};
