import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seu Diagnóstico - Diagnóstico da Deusa',
  description: 'Confira seu arquétipo dominante e o caminho para manifestar seus sonhos.',
};

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
