"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RefreshCcw } from "lucide-react";

export default function Error({
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
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            कुछ गलत हो गया!
          </h1>
          <p className="text-muted-foreground">
            मिशन पेज लोड करने में समस्या आई है। कृपया पुनः प्रयास करें।
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="inline-flex items-center gap-2"
            variant="default"
          >
            <RefreshCcw className="w-4 h-4" />
            पुनः प्रयास करें
          </Button>

          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="inline-flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            होम पेज पर जाएं
          </Button>
        </div>
      </div>
    </div>
  );
}
