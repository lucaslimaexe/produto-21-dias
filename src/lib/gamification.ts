/**
 * Gamification logic: points, levels, achievements.
 */

export const XP_PER_ANSWER = 10;
export const XP_PER_QUESTION_COMPLETE = 25;
export const XP_WELCOME_ENERGY_FULL = 50;
export const XP_PRE_FORM_COMPLETE = 30;
export const XP_PER_SECTION_VIEW = 5;

export const LEVEL_THRESHOLDS = [0, 50, 120, 200, 300, 420, 560, 720, 900, 1100];

export type AchievementId =
  | 'primeira_verdade'
  | 'ritmo_certo'
  | '100_alinhada'
  | 'energia_cheia'
  | 'sonhos_escolhidos'
  | 'tempo_60'
  | 'jornada_completa'
  | 'codigo_desbloqueado';

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: Record<AchievementId, Achievement> = {
  primeira_verdade: { id: 'primeira_verdade', title: 'Primeira Verdade', description: 'Respondeu a primeira pergunta', icon: '✨' },
  ritmo_certo: { id: 'ritmo_certo', title: 'Ritmo Certo', description: 'Completou 3 perguntas', icon: '🎯' },
  '100_alinhada': { id: '100_alinhada', title: '100% Alinhada', description: 'Chegou a 100% de alinhamento', icon: '🌟' },
  energia_cheia: { id: 'energia_cheia', title: 'Energia Cheia', description: 'Preparou sua energia no início', icon: '⚡' },
  sonhos_escolhidos: { id: 'sonhos_escolhidos', title: 'Sonhos Escolhidos', description: 'Escolheu seus 3 sonhos', icon: '💫' },
  tempo_60: { id: 'tempo_60', title: 'Ritmo Perfeito', description: 'Completou em até 60 segundos', icon: '⏱️' },
  jornada_completa: { id: 'jornada_completa', title: 'Jornada Completa', description: 'Respondeu todas as perguntas', icon: '🔮' },
  codigo_desbloqueado: { id: 'codigo_desbloqueado', title: 'Código Desbloqueado', description: 'Acessou a oferta final', icon: '🔓' },
};

export function getLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function getXpForNextLevel(xp: number): number {
  const level = getLevel(xp);
  return LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}

export function getProgressToNextLevel(xp: number): number {
  const level = getLevel(xp);
  const current = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const next = LEVEL_THRESHOLDS[level];
  if (!next) return 100;
  return Math.min(100, ((xp - current) / (next - current)) * 100);
}
