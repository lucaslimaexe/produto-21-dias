"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  type AchievementId,
  ACHIEVEMENTS,
  getLevel,
  getProgressToNextLevel,
  XP_PER_ANSWER,
  XP_PER_QUESTION_COMPLETE,
  XP_WELCOME_ENERGY_FULL,
  XP_PRE_FORM_COMPLETE,
} from '@/lib/gamification';

const STORAGE_KEY = 'goddess-diagnostic-gamification';

interface GamificationState {
  xp: number;
  achievements: AchievementId[];
}

interface GamificationContextValue {
  xp: number;
  level: number;
  progressToNextLevel: number;
  achievements: AchievementId[];
  addXp: (amount: number) => void;
  unlockAchievement: (id: AchievementId) => void;
  hasAchievement: (id: AchievementId) => boolean;
  answerQuestion: (questionIndex: number) => void;
  completeWelcomeEnergy: () => void;
  completePreForm: () => void;
  reset: () => void;
}

const defaultState: GamificationState = {
  xp: 0,
  achievements: [],
};

function loadState(): GamificationState {
  if (typeof window === 'undefined') return defaultState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as GamificationState;
    return {
      xp: parsed.xp ?? 0,
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
    };
  } catch {
    return defaultState;
  }
}

function saveState(state: GamificationState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

const GamificationContext = createContext<GamificationContextValue | null>(null);

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GamificationState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const addXp = useCallback((amount: number) => {
    setState((s) => ({ ...s, xp: s.xp + amount }));
  }, []);

  const unlockAchievement = useCallback((id: AchievementId) => {
    setState((s) => {
      if (s.achievements.includes(id)) return s;
      return { ...s, achievements: [...s.achievements, id] };
    });
  }, []);

  const hasAchievement = useCallback(
    (id: AchievementId) => state.achievements.includes(id),
    [state.achievements]
  );

  const answerQuestion = useCallback(
    (questionIndex: number) => {
      addXp(XP_PER_ANSWER);
      if (questionIndex >= 2) unlockAchievement('ritmo_certo');
      if (questionIndex === 0) unlockAchievement('primeira_verdade');
    },
    [addXp, unlockAchievement]
  );

  const completeWelcomeEnergy = useCallback(() => {
    addXp(XP_WELCOME_ENERGY_FULL);
    unlockAchievement('energia_cheia');
  }, [addXp, unlockAchievement]);

  const completePreForm = useCallback(() => {
    addXp(XP_PRE_FORM_COMPLETE);
    unlockAchievement('sonhos_escolhidos');
  }, [addXp, unlockAchievement]);

  const reset = useCallback(() => {
    setState(defaultState);
  }, []);

  const value: GamificationContextValue = {
    xp: state.xp,
    level: getLevel(state.xp),
    progressToNextLevel: getProgressToNextLevel(state.xp),
    achievements: state.achievements,
    addXp,
    unlockAchievement,
    hasAchievement,
    answerQuestion,
    completeWelcomeEnergy,
    completePreForm,
    reset,
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const ctx = useContext(GamificationContext);
  if (!ctx) return null;
  return ctx;
}
