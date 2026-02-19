"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-purple-950 via-black to-red-950 text-foreground">
      <AlertTriangle className="h-16 w-16 text-yellow-400 mb-6" aria-hidden />
      <h1 className="font-headline text-2xl sm:text-3xl text-white font-bold mb-4 text-center">
        Algo deu errado
      </h1>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        Ocorreu um erro inesperado. Por favor, tente novamente.
      </p>
      <Button
        onClick={reset}
        className="goddess-gradient text-primary-foreground font-bold py-3 px-8 rounded-lg h-auto min-h-[44px]"
        aria-label="Tentar novamente"
      >
        Tentar Novamente
      </Button>
    </div>
  );
}
