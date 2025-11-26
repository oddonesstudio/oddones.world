"use client";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon/Icon";

export function Video({
  className,
  playIcon,
}: {
  className?: string;
  playIcon?: { title?: string; svg?: string };
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const { width, height } = canvas;
      const imageData = ctx.createImageData(width, height);
      const buffer = new Uint32Array(imageData.data.buffer);

      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = Math.random() < 0.5 ? 0xff000000 : 0xffffffff;
      }

      ctx.putImageData(imageData, 0, 0);

      frameRef.current = requestAnimationFrame(draw);
    };

    if (isPlaying) {
      draw();
    } else {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    }

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isPlaying]);

  return (
    <div className={`relative ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />

      {/* Play/Pause Button */}
      <button
        type="button"
        onClick={() => setIsPlaying((p) => !p)}
        className="
          absolute inset-0 flex items-center justify-center
          bg-black/20 hover:bg-black/30
          transition-colors
        "
      >
        <div className="bg-black/80 text-white rounded-full text-sm font-bold flex items-center justify-center size-20 cursor-pointer">
          {isPlaying ? "Pause" : <Icon {...playIcon} size={20} />}
        </div>
      </button>
    </div>
  );
}
