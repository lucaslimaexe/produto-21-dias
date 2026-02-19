"use client";

import { useRouter } from "next/navigation";
import { InspiracaoScreen } from "@/components/inspiracao-screen";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function InspiracaoPage() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleContinue = () => {
    setIsNavigating(true);
    router.push("/revelacao");
  };

  if (isNavigating) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
        <header className="flex items-center justify-center h-14 border-b border-white/10">
          <span className="font-headline font-semibold text-base text-white tracking-tight">
            diagnóstico.da.deusa
          </span>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <Loader2 className="h-10 w-10 text-white/70 animate-spin mb-4" />
          <p className="text-sm text-gray-400">carregando...</p>
        </div>
      </div>
    );
  }

  return <InspiracaoScreen onContinue={handleContinue} />;
}
