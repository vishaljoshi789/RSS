"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

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
            मिशन नहीं मिला
          </h1>
          <p className="text-muted-foreground">
            यह मिशन उपलब्ध नहीं है या हटा दिया गया है।
          </p>
        </div>

        <Button
          onClick={() => router.push("/divine-mission")}
          className="inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          सभी मिशन देखें
        </Button>
      </div>
    </div>
  );
}
