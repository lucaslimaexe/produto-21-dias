
"use client";

import { useRouter } from "next/navigation";
import { WelcomeScreen } from "@/components/welcome-screen";

export default function HomePage() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/pre-analysis"); // Changed to pre-analysis
  };

  return <WelcomeScreen onStart={handleStart} />;
}
