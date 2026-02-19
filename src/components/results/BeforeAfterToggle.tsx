"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ShieldOff, ShieldCheck } from "lucide-react";

type Tab = "antes" | "depois";

const ANTES_ITEMS = [
  "Você acorda com peso. Se sabota sem perceber.",
  "Vive como figurante. Reclamando no espelho toda manhã.",
  "Nasceu pra mais. Mas esqueceu como era ser você.",
];

const DEPOIS_ITEMS = [
  "Você acorda e SENTE no corpo que algo mudou.",
  "Sabe o que quer. Quem não entra mais. Quem você é.",
  "Não pede mais permissão pra ninguém.",
  "Cria, manifesta e expande.",
];

interface BeforeAfterToggleProps {
  className?: string;
}

export function BeforeAfterToggle({ className }: BeforeAfterToggleProps) {
  const [tab, setTab] = useState<Tab>("antes");

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex rounded-xl overflow-hidden border border-white/10 p-1 bg-white/5">
        <button
          type="button"
          onClick={() => setTab("antes")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all",
            tab === "antes"
              ? "bg-red-900/40 text-red-200 border border-red-600/50"
              : "text-white/60 hover:text-red-300/80"
          )}
        >
          <ShieldOff className="h-5 w-5" /> ANTES
        </button>
        <button
          type="button"
          onClick={() => setTab("depois")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all",
            tab === "depois"
              ? "bg-green-900/40 text-green-200 border border-green-500/50"
              : "text-white/60 hover:text-green-300/80"
          )}
        >
          <ShieldCheck className="h-5 w-5" /> DEPOIS
        </button>
      </div>

      <Card
        className={cn(
          "p-6 rounded-xl shadow-xl transition-all duration-300",
          tab === "antes"
            ? "bg-white/5 border border-red-500/30"
            : "bg-white/5 border border-green-500/30"
        )}
      >
        <CardHeader className="p-0 mb-4 text-center">
          {tab === "antes" ? (
            <ShieldOff className="h-10 w-10 mx-auto mb-2 text-red-400" />
          ) : (
            <ShieldCheck className="h-10 w-10 mx-auto mb-2 text-green-400" />
          )}
          <CardTitle
            className={cn(
              "text-xl sm:text-2xl",
              tab === "antes" ? "text-red-300" : "text-green-300"
            )}
          >
            {tab === "antes" ? "ANTES" : "DEPOIS"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul
            className={cn(
              "space-y-2 text-sm sm:text-base",
              tab === "antes" ? "text-red-200/90" : "text-green-200/90"
            )}
          >
            {(tab === "antes" ? ANTES_ITEMS : DEPOIS_ITEMS).map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span
                  className={cn(
                    "mt-1.5 h-2 w-2 rounded-full shrink-0",
                    tab === "antes" ? "bg-red-400" : "bg-green-400"
                  )}
                />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
