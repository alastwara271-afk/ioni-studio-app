import React, { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
  height?: number;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  isPlaying,
  barCount = 36,
  height = 42,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const barWidth = Math.max(2, (w / barCount) - 2);

      for (let i = 0; i < barCount; i++) {
        let barHeight = 6;
        if (isPlaying) {
          // Dynamic wave pattern
          const sin1 = Math.sin((i * 0.25) + phase);
          const cos1 = Math.cos((i * 0.4) - (phase * 1.5));
          const norm = Math.abs(sin1 * 0.7 + cos1 * 0.3);
          barHeight = Math.max(6, norm * (h - 8));
        } else {
          // Idle subtle curve
          const norm = 0.2 + 0.3 * Math.sin((i / barCount) * Math.PI);
          barHeight = norm * (h - 16);
        }

        const x = i * (barWidth + 2);
        const y = (h - barHeight) / 2;

        // Gradient from Tech Blue to Neon Yellow
        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isPlaying) {
          grad.addColorStop(0, '#38BDF8'); // Sky blue
          grad.addColorStop(0.5, '#FACC15'); // Yellow
          grad.addColorStop(1, '#EAB308'); // Dark yellow
        } else {
          grad.addColorStop(0, '#334155');
          grad.addColorStop(1, '#1E293B');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }

      if (isPlaying) {
        phase += 0.15;
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, barCount]);

  return (
    <div className="w-full flex items-center justify-center bg-[#07090E] rounded-xl p-2 border border-slate-800/80 shadow-inner">
      <canvas
        ref={canvasRef}
        width={360}
        height={height}
        className="w-full max-w-md h-10 block"
      />
    </div>
  );
};
