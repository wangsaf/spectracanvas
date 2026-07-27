'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { PoseSet } from '@/lib/types';

interface AnimationPreviewProps {
  poses: PoseSet;
  spriteSize: number;
}

export function AnimationPreview({ poses, spriteSize }: AnimationPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPose, setCurrentPose] = useState<keyof PoseSet>('idle');
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [fps, setFps] = useState(8);
  const animationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);

  const poseOptions: { key: keyof PoseSet; label: string; icon: string }[] = [
    { key: 'idle', label: 'IDLE', icon: 'I' },
    { key: 'walk', label: 'WALK', icon: 'W' },
    { key: 'run', label: 'RUN', icon: 'R' },
    { key: 'attack', label: 'ATTACK', icon: 'A' },
    { key: 'jump', label: 'JUMP', icon: 'J' },
  ];

  useEffect(() => {
    if (!canvasRef.current || !isPlaying) return;

    const frames = poses[currentPose];
    if (!frames || frames.length === 0) return;

    const animate = (timestamp: number) => {
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = timestamp;
      }

      const elapsed = timestamp - lastFrameTimeRef.current;
      const frameDelay = 1000 / fps;

      if (elapsed >= frameDelay) {
        setCurrentFrame((prev) => (prev + 1) % frames.length);
        lastFrameTimeRef.current = timestamp;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [poses, currentPose, isPlaying, fps]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const frames = poses[currentPose];
    if (!frames || frames.length === 0) return;

    const scale = 8;
    canvas.width = spriteSize * scale;
    canvas.height = spriteSize * scale;

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = frames[currentFrame];
  }, [poses, currentPose, currentFrame, spriteSize]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      lastFrameTimeRef.current = 0;
    }
  };

  const handleReset = () => {
    setCurrentFrame(0);
    lastFrameTimeRef.current = 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ANIMATION PREVIEW</CardTitle>
        <CardDescription>
          Preview character poses and animations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Canvas Display */}
        <div className="rounded border border-[#27272a] bg-[#000000] p-8 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="image-rendering-pixelated"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* Pose Selector */}
        <div className="space-y-2">
          <p className="text-xs font-bold tracking-wider text-[#a1a1aa]">SELECT POSE</p>
          <div className="grid grid-cols-5 gap-2">
            {poseOptions.map((pose) => (
              <button
                key={pose.key}
                onClick={() => {
                  setCurrentPose(pose.key);
                  setCurrentFrame(0);
                  lastFrameTimeRef.current = 0;
                }}
                className={`px-3 py-2 rounded border transition-colors ${
                  currentPose === pose.key
                    ? 'bg-[#ffffff] text-white border-[#ffffff]'
                    : 'bg-transparent text-[#a1a1aa] border-[#27272a] hover:border-[#ffffff] hover:text-[#ffffff]'
                }`}
              >
                <div className="text-xs font-bold">{pose.icon}</div>
                <div className="text-[10px] mt-1">{pose.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Animation Controls */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#27272a]">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePlayPause}
            >
              {isPlaying ? '⏸' : '▶'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
            >
              ⏹
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider text-[#a1a1aa]">FPS:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFps(Math.max(4, fps - 2))}
              disabled={fps <= 4}
            >
              -
            </Button>
            <span className="text-xs font-mono text-[#ffffff] w-8 text-center">{fps}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFps(Math.min(16, fps + 2))}
              disabled={fps >= 16}
            >
              +
            </Button>
          </div>
        </div>

        {/* Frame Info */}
        <div className="text-xs text-[#71717a] text-center">
          Frame {currentFrame + 1} / {poses[currentPose]?.length || 0}
        </div>
      </CardContent>
    </Card>
  );
}