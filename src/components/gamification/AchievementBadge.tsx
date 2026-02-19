"use client";

import React from 'react';
import { ACHIEVEMENTS, type AchievementId } from '@/lib/gamification';
import { cn } from '@/lib/utils';

interface AchievementBadgeProps {
  id: AchievementId;
  className?: string;
  size?: 'sm' | 'md';
}

export function AchievementBadge({ id, className, size = 'md' }: AchievementBadgeProps) {
  const a = ACHIEVEMENTS[id];
  if (!a) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg bg-accent/15 border border-accent/40 px-3 py-2',
        size === 'sm' && 'gap-1.5 px-2 py-1.5 text-sm',
        className
      )}
      title={a.description}
    >
      <span className={cn('text-lg', size === 'sm' && 'text-base')} aria-hidden>
        {a.icon}
      </span>
      <span className="font-medium text-foreground truncate">{a.title}</span>
    </div>
  );
}
