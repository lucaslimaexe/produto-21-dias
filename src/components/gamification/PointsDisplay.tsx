"use client";

import React from 'react';
import { Sparkles } from 'lucide-react';
import { useGamification } from './GamificationProvider';
import { cn } from '@/lib/utils';

interface PointsDisplayProps {
  className?: string;
  compact?: boolean;
}

export function PointsDisplay({ className, compact }: PointsDisplayProps) {
  const g = useGamification();
  if (!g) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1.5 text-primary border border-primary/40',
        compact && 'px-2 py-1 text-sm',
        className
      )}
      aria-label={`${g.xp} pontos de experiência, nível ${g.level}`}
    >
      <Sparkles className={cn('h-4 w-4 text-accent', compact && 'h-3 w-3')} aria-hidden />
      <span className="font-semibold tabular-nums">{g.xp}</span>
      <span className="text-muted-foreground text-xs">XP</span>
    </div>
  );
}
