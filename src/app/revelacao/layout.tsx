import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "O que ninguém te conta - Diagnóstico da Deusa",
  description:
    "Não é lei da atração. O que famosos descobriram sobre sucesso e objetivos.",
};

export default function RevelacaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
