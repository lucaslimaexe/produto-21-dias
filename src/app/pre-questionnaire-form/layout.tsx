import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seus Sonhos - Diagnóstico da Deusa',
  description: 'Escolha seus 3 maiores sonhos e quando deseja realizá-los.',
};

export default function PreQuestionnaireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
