"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

type ErrorStateProps = {
  title?: string;
  message?: string | null;
  onRetry?: () => void;
  className?: string;
};

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Error",
  message = "Something went wrong",
  onRetry,
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-center h-64 ${className}`}>
      <div className="text-center max-w-xl">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-5 w-5 text-destructive" />
        </div>
        <p className="text-destructive font-semibold">{title}</p>
        {message ? (
          <p className="mt-2 text-muted-foreground text-sm">{message}</p>
        ) : null}
        {onRetry && (
          <div className="mt-4">
            <Button onClick={onRetry} variant="outline" size="sm">
              Retry
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
