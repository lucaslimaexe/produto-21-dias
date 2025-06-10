
"use client";

import { useRouter } from "next/navigation";
import { WelcomeScreen } from "@/components/welcome-screen";

export default function HomePage() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/questionnaire");
  };

  return <WelcomeScreen onStart={handleStart} />;
}
