"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <AlertCircle className="w-16 h-16 mx-auto text-destructive" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-4">
          कुछ गलत हो गया
        </h1>
        <p className="text-muted-foreground mb-6">
          ब्लॉग लोड करते समय एक त्रुटि हुई। कृपया पुनः प्रयास करें।
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground mb-6">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>पुनः प्रयास करें</Button>
          <Link href="/">
            <Button variant="outline">होम पेज पर जाएं</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
