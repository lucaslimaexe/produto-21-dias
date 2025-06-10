// src/lib/audioUtils.ts
'use client';

/**
 * Reproduz um arquivo de som.
 * Certifique-se de que o arquivo de som correspondente exista na pasta /public/sounds/
 * @param soundFile O nome do arquivo de som (ex: "click.mp3") localizado na pasta /public/sounds/
 */
export const playSound = (soundFile: string) => {
  if (typeof window !== 'undefined') { // Garante que está no cliente
    const audio = new Audio(`/sounds/${soundFile}`);
    audio.play().catch(e => console.error(`Error playing sound ${soundFile}:`, e));
  }
};
