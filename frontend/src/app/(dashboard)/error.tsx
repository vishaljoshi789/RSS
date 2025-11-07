"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/dashboard");
  };

  const handleGoBack = () => {
    router.back();
  };

  const getErrorMessage = () => {
    if (
      error.message.includes("Network Error") ||
      error.message.includes("fetch")
    ) {
      return "Unable to connect to the server. Please check your internet connection.";
    }
    if (
      error.message.includes("401") ||
      error.message.includes("Unauthorized")
    ) {
      return "Your session has expired. Please login again.";
    }
    if (error.message.includes("403") || error.message.includes("Forbidden")) {
      return "You don't have permission to access this resource.";
    }
    if (error.message.includes("500")) {
      return "Server error occurred. Our team has been notified.";
    }
    return (
      error.message ||
      "An unexpected error occurred while loading the dashboard."
    );
  };

  const getErrorTitle = () => {
    if (
      error.message.includes("Network Error") ||
      error.message.includes("fetch")
    ) {
      return "Connection Error";
    }
    if (
      error.message.includes("401") ||
      error.message.includes("Unauthorized")
    ) {
      return "Authentication Error";
    }
    if (error.message.includes("403") || error.message.includes("Forbidden")) {
      return "Permission Error";
    }
    if (error.message.includes("500")) {
      return "Server Error";
    }
    return "Dashboard Error";
  };

  const shouldShowLoginButton = () => {
    return (
      error.message.includes("401") || error.message.includes("Unauthorized")
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-xl font-semibold text-red-600 dark:text-red-400">
              {getErrorTitle()}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Details</AlertTitle>
              <AlertDescription className="mt-2">
                {getErrorMessage()}
              </AlertDescription>
            </Alert>

            {error.digest && (
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Error ID: {error.digest}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={reset}
                className="flex items-center gap-2"
                variant="default"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>

              {shouldShowLoginButton() ? (
                <Button
                  onClick={() => router.push("/auth/login?redirect=/dashboard")}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Login Again
                </Button>
              ) : (
                <Button
                  onClick={handleGoHome}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Go to Dashboard
                </Button>
              )}

              <Button
                onClick={handleGoBack}
                variant="ghost"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium">Common Solutions:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Check your internet connection</li>
                  <li>• Try refreshing the page</li>
                  <li>• Clear your browser cache</li>
                  <li>• Logout and login again</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Still having issues?</h4>
                <p className="text-sm text-muted-foreground">
                  Contact our support team or try accessing the dashboard from a
                  different browser.
                </p>
              </div>
            </div>

            {process.env.NODE_ENV === "development" && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                  Technical Details (Development)
                </summary>
                <div className="mt-2 p-4 bg-muted rounded-md">
                  <pre className="text-xs whitespace-pre-wrap break-all">
                    {error.stack || error.message}
                  </pre>
                </div>
              </details>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
