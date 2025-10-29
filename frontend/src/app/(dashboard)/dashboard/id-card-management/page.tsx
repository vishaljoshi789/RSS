'use client';

import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

const RssIdCard = () => {
  async function getpdf() {
    const accessToken = Cookies.get("access_token");

    if (!accessToken) {
      console.error("Access token not found in cookies!");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/dashboard/documents/generate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ document_type: "idcard" }),
      });

      if (!res.ok) {
        console.error("Error generating PDF:", await res.text());
        return;
      }

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "idcard.pdf";
      link.click();

      setTimeout(() => window.URL.revokeObjectURL(url), 5000);

      console.log("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <Button onClick={getpdf}>Get PDF</Button>
    </div>
  );
};

export default RssIdCard;
