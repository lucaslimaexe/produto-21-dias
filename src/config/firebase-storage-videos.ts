/**
 * URLs dos vídeos no Firebase Storage (bucket: produto-21-dias.firebasestorage.app)
 *
 * Como obter as URLs:
 * 1. Acesse https://console.firebase.google.com → projeto produto-21-dias → Storage
 * 2. Abra a pasta/arquivo do vídeo
 * 3. Clique nos três pontos do arquivo → "Obter link" (Get download URL)
 * 4. Cole a URL abaixo. A URL é do tipo:
 *    https://firebasestorage.googleapis.com/v0/b/produto-21-dias.firebasestorage.app/o/...
 *
 * Adicione quantos vídeos quiser; eles aparecerão no carrossel da Revelação na ordem desta lista.
 */
export const FIREBASE_STORAGE_VIDEOS: { url: string; title?: string }[] = [
  // Exemplo (substitua pela sua URL):
  // { url: "https://firebasestorage.googleapis.com/v0/b/produto-21-dias.firebasestorage.app/o/videos%2Fintro.mp4?alt=media&token=...", title: "Intro" },
];
