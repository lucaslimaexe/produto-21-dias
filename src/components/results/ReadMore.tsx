"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ReadMoreProps {
  children: string;
  maxChars?: number;
  className?: string;
  buttonClassName?: string;
}

export function ReadMore({
  children,
  maxChars = 120,
  className,
  buttonClassName,
}: ReadMoreProps) {
  const [expanded, setExpanded] = useState(false);
  const needsToggle = children.length > maxChars;
  const displayText = needsToggle && !expanded ? children.slice(0, maxChars).trim() + "…" : children;

  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-inherit leading-relaxed whitespace-pre-line">
        {displayText}
      </p>
      {needsToggle && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className={cn(
            "inline-flex items-center gap-1 text-accent hover:text-yellow-300 text-sm font-medium transition-colors",
            buttonClassName
          )}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4" /> Ler menos
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" /> Leia mais
            </>
          )}
        </button>
      )}
    </div>
  );
}
