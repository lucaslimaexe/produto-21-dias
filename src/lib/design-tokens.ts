/**
 * Design tokens for the Diagnóstico da Deusa app.
 * Blueprint: primary #9B51E0, accent #D4AF37, background #14111a
 */

export const tokens = {
  spacing: {
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
  },
  typography: {
    'heading-1': { size: 'clamp(1.75rem, 5vw, 4rem)', weight: 700, lineHeight: 1.15 },
    'heading-2': { size: 'clamp(1.5rem, 4vw, 2.5rem)', weight: 700, lineHeight: 1.2 },
    'heading-3': { size: 'clamp(1.25rem, 3vw, 1.75rem)', weight: 600, lineHeight: 1.25 },
    body: { size: '1rem', weight: 400, lineHeight: 1.6 },
    bodyLarge: { size: '1.125rem', weight: 400, lineHeight: 1.6 },
    caption: { size: '0.875rem', weight: 400, lineHeight: 1.5 },
  },
  shadows: {
    glow: '0 0 20px hsl(var(--accent) / 0.4)',
    glowStrong: '0 0 30px hsl(var(--accent) / 0.6)',
    card: '0 4px 20px hsl(266 72% 60% / 0.15)',
    cardHover: '0 8px 30px hsl(266 72% 60% / 0.25)',
  },
  touchTarget: '44px',
  radius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '0.85rem',
    xl: '1rem',
  },
} as const;
