import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Questionário - Diagnóstico da Deusa',
  description: 'Responda às perguntas para descobrir seu arquétipo e bloqueios.',
};

export default function QuestionnaireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
