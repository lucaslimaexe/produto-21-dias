"use client";

import React, { useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExitIntentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  displayName: string;
  dreamsText: string;
  dreamsAchievementDateLabel?: string;
  price: number;
  onCtaClick: () => void;
}

export function ExitIntentModal({
  open,
  onOpenChange,
  displayName,
  dreamsText,
  dreamsAchievementDateLabel,
  price,
  onCtaClick,
}: ExitIntentModalProps) {
  const handleCta = useCallback(() => {
    onOpenChange(false);
    onCtaClick();
  }, [onOpenChange, onCtaClick]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-md bg-[#0a0a0a] border border-white/10 text-white",
          "sm:rounded-2xl p-6 sm:p-8"
        )}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:text-white transition-colors"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>
        <DialogHeader className="text-center space-y-4 pr-8">
          <DialogTitle className="font-headline text-xl sm:text-2xl text-white">
            {displayName}, espera.
          </DialogTitle>
          <DialogDescription className="text-white/70 text-base">
            Seus sonhos de {dreamsText}
            {dreamsAchievementDateLabel
              ? ` em ${dreamsAchievementDateLabel}`
              : ""}{" "}
            merecem um sim. Última chance por R${price.toFixed(2).replace(".", ",")}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-6">
          <Button
            onClick={handleCta}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold text-base py-3 px-6 rounded-2xl min-h-[48px] w-full"
          >
            SIM, EU QUERO
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const EXIT_INTENT_KEY = "exit-intent-shown";

export function useExitIntent(
  onTrigger: () => void,
  options: {
    enabled?: boolean;
    throttleMs?: number;
  } = {}
) {
  const { enabled = true, throttleMs = 2000 } = options;
  const triggeredRef = React.useRef(false);
  const lastTriggerRef = React.useRef(0);

  const tryTrigger = useCallback(() => {
    if (!enabled || triggeredRef.current) return;
    if (typeof window === "undefined") return;
    const alreadyShown = sessionStorage.getItem(EXIT_INTENT_KEY);
    if (alreadyShown) return;
    const now = Date.now();
    if (now - lastTriggerRef.current < throttleMs) return;

    triggeredRef.current = true;
    sessionStorage.setItem(EXIT_INTENT_KEY, "1");
    lastTriggerRef.current = now;
    onTrigger();
  }, [enabled, throttleMs, onTrigger]);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 || (e.clientY <= 15 && !e.relatedTarget)) {
        tryTrigger();
      }
    };

    let visibilityHadHidden = false;
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        visibilityHadHidden = true;
      } else if (document.visibilityState === "visible" && visibilityHadHidden) {
        visibilityHadHidden = false;
        tryTrigger();
      }
    };

    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled, tryTrigger]);
}
