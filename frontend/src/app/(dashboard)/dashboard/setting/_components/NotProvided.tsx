"use client";

import React from "react";
import { FileQuestion, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotProvidedProps {
  className?: string;
  onClick?: () => void;
  label?: string;
}

export const NotProvided: React.FC<NotProvidedProps> = ({ 
  className = "", 
  onClick,
  label = "Not Provided"
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/20 hover:bg-muted/40 hover:border-primary/50 transition-all cursor-pointer ${className}`}
    >
      <FileQuestion className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary/70 transition-colors" />
      <span className="text-sm text-muted-foreground/70 group-hover:text-primary font-medium transition-colors">
        {label}
      </span>
      {onClick && (
        <Plus className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary/70 transition-colors" />
      )}
    </button>
  );
};
