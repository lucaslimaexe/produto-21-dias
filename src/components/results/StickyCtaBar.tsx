"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StickyCtaBarProps {
  visible: boolean;
  price: number;
  onCtaClick: () => void;
  ctaText?: string;
}

export function StickyCtaBar({
  visible,
  price,
  onCtaClick,
  ctaText = "GARANTIR AGORA",
}: StickyCtaBarProps) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40",
        "bg-[#0a0a0a]/98 backdrop-blur-md border-t border-white/10",
        "px-4 py-3 safe-area-pb",
        "animate-fade-in"
      )}
      role="banner"
    >
        <div className="max-w-[470px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <span className="text-sm text-white/60">Por apenas</span>
          <span className="text-xl sm:text-2xl font-bold text-green-400">
            R$ {price.toFixed(2).replace('.', ',')}
          </span>
          <span className="text-xs text-white/50">7 dias garantidos</span>
        </div>
        <Button
          onClick={onCtaClick}
          className={cn(
            "w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold",
            "text-base py-3 px-6 min-h-[48px] rounded-2xl"
          )}
        >
          {ctaText}
        </Button>
      </div>
    </div>
  );
}
