'use client';

import { useEffect, useState } from 'react';

interface Pixel {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
}

export default function PixelEffects() {
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [matrixPixels, setMatrixPixels] = useState<{
    id: number;
    x: number;
    y: number;
    delay: number;
  }[]>([]);

  useEffect(() => {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
    const newPixels: Pixel[] = [];

    // Generate random pixels
    for (let i = 0; i < 30; i++) {
      newPixels.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 4,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
      });
    }

    setPixels(newPixels);
  }, []);

  // Generate matrix pixels on mount to avoid SSR/client mismatch
  useEffect(() => {
    const generated = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4
    }));
    setMatrixPixels(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Retro Grid Background */}
      <div className="absolute inset-0 retro-grid opacity-20"></div>
      
      {/* Floating Pixels */}
      {pixels.map((pixel) => (
        <div
          key={pixel.id}
          className="pixel-effect pixel-glow"
          style={{
            left: `${pixel.x}%`,
            top: `${pixel.y}%`,
            width: `${pixel.size}px`,
            height: `${pixel.size}px`,
            color: pixel.color,
            animationDelay: `${pixel.delay}s`,
            animationDuration: `${pixel.duration}s`,
          }}
        />
      ))}

      {/* Matrix-style pixels */}
      <div className="absolute inset-0">
        {matrixPixels.map((p) => (
          <div
            key={`matrix-${p.id}`}
            className="pixel-effect pixel-matrix"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              color: '#00ff00',
              animationDelay: `${p.delay}s`,
              width: '6px',
              height: '6px',
            }}
          />
        ))}
      </div>

      {/* Corner pixel decorations */}
      <div className="absolute top-4 left-4 flex flex-col gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={`corner-tl-${i}`} className="flex gap-1">
            {Array.from({ length: 5 - i }).map((_, j) => (
              <div
                key={j}
                className="w-2 h-2 bg-blue-500 pixel-glow"
                style={{
                  animationDelay: `${(i + j) * 0.1}s`,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="absolute top-4 right-4 flex flex-col gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={`corner-tr-${i}`} className="flex gap-1 justify-end">
            {Array.from({ length: 5 - i }).map((_, j) => (
              <div
                key={j}
                className="w-2 h-2 bg-purple-500 pixel-glow"
                style={{
                  animationDelay: `${(i + j) * 0.1 + 1}s`,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 flex flex-col-reverse gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={`corner-bl-${i}`} className="flex gap-1">
            {Array.from({ length: 5 - i }).map((_, j) => (
              <div
                key={j}
                className="w-2 h-2 bg-pink-500 pixel-glow"
                style={{
                  animationDelay: `${(i + j) * 0.1 + 2}s`,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 right-4 flex flex-col-reverse gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={`corner-br-${i}`} className="flex gap-1 justify-end">
            {Array.from({ length: 5 - i }).map((_, j) => (
              <div
                key={j}
                className="w-2 h-2 bg-green-500 pixel-glow"
                style={{
                  animationDelay: `${(i + j) * 0.1 + 3}s`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
