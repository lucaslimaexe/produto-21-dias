import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Elas Falam Sobre Sucesso - Diagnóstico da Deusa',
  description: 'Frases reais de Anitta, Virginia, Luiza Sonza e IZA sobre sucesso e conquistas.',
};

export default function InspiracaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
