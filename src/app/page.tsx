
"use client";

import { useRouter } from "next/navigation";
import { WelcomeScreen } from "@/components/welcome-screen";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleStart = () => {
    setIsNavigating(true);
    // We push to the router. The loading screen will be visible until Next.js
    // fully transitions to the new page.
    router.push("/pre-questionnaire-form");
  };

  if (isNavigating) {
    return (
      <div
        className={cn(
          "min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden",
          "bg-gradient-to-br from-purple-900 via-indigo-950 to-rose-900 text-foreground font-body"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-700/5 to-pink-500/10 animate-pulse"></div>
        <Loader2 className="h-16 w-16 sm:h-20 sm:w-20 text-accent animate-spin mb-6" />
        <h1 className="font-headline text-2xl sm:text-3xl font-semibold text-primary mb-2 animate-fade-in">
          Preparando sua jornada...
        </h1>
        <p className="font-body text-lg sm:text-xl text-foreground/80 animate-fade-in [animation-delay:0.3s]">
          Só um momento!
        </p>
      </div>
    );
  }

  return <WelcomeScreen onStart={handleStart} />;
}
