"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";

const IDCardManagement = () => {
  const [storageHydrated, setStorageHydrated] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [memberData, setMemberData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    role: "VOLUNTEER",
    image: "/logo/logo.png",
    memberId: "",
    address: "",
  });

  useEffect(() => {
    if (typeof window === "undefined" || storageHydrated) {
      return;
    }

    try {
      const storedUserData = window.localStorage.getItem("user_data");

      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          
          setMemberData({
            name: userData.name?.toUpperCase() || "",
            email: userData.email || "",
            phone: userData.phone || "",
            gender: userData.gender?.toUpperCase() || "",
            role: "VOLUNTEER",
            image: userData.image || "/logo/logo.png",
            memberId: userData.member_id || userData.id || "N/A",
            address: [
              userData.city,
              userData.district,
              userData.state,
              userData.postal_code
            ]
              .filter(Boolean)
              .join(", "),
          });
        } catch (e) {
          console.warn("Unable to parse user_data from localStorage", e);
        }
      }
    } catch (error) {
      console.warn("Unable to read stored user data", error);
    } finally {
      setStorageHydrated(true);
    }
  }, [storageHydrated]);

  const quote = "सेवा परमो धर्मः";

  const handleDownload = () => {
    handlePrint();
  };

  const handlePrint = () => {
    if (!cardRef.current) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to print/download the ID card");
      return;
    }

    const cardHTML = cardRef.current.outerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>RSS ID Card - ${memberData.name}</title>
          <meta charset="UTF-8">
          <style>
            * { 
              margin: 0; 
              padding: 0; 
              box-sizing: border-box; 
            }
            body {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: #f3f4f6;
              padding: 20px;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            .rounded-xl { border-radius: 0.75rem; }
            .rounded-full { border-radius: 9999px; }
            .rounded-md { border-radius: 0.375rem; }
            .shadow-2xl { 
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            }
            .overflow-hidden { overflow: hidden; }
            .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
            .py-5 { padding-top: 1.25rem; padding-bottom: 1.25rem; }
            .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
            .px-8 { padding-left: 2rem; padding-right: 2rem; }
            .px-4 { padding-left: 1rem; padding-right: 1rem; }
            .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
            .pb-2 { padding-bottom: 0.5rem; }
            .mt-1 { margin-top: 0.25rem; }
            .mt-6 { margin-top: 1.5rem; }
            .mb-6 { margin-bottom: 1.5rem; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
            .text-xs { font-size: 0.75rem; line-height: 1rem; }
            .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
            .font-bold { font-weight: 700; }
            .font-semibold { font-weight: 600; }
            .font-medium { font-weight: 500; }
            .font-mono { font-family: ui-monospace, monospace; }
            .uppercase { text-transform: uppercase; }
            .italic { font-style: italic; }
            .tracking-wider { letter-spacing: 0.05em; }
            .tracking-wide { letter-spacing: 0.025em; }
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            .items-center { align-items: center; }
            .space-y-3 > * + * { margin-top: 0.75rem; }
            .max-w-\\[180px\\] { max-width: 180px; }
            .mx-auto { margin-left: auto; margin-right: auto; }
            .h-36 { height: 9rem; }
            .w-36 { width: 9rem; }
            .h-full { height: 100%; }
            .w-full { width: 100%; }
            .border { border-width: 1px; }
            .border-4 { border-width: 4px; }
            .object-cover { object-fit: cover; }
            @media print {
              body { 
                background: white; 
                padding: 0;
              }
              @page { 
                margin: 10mm;
                size: A4 portrait;
              }
            }
          </style>
        </head>
        <body>
          ${cardHTML}
          <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
              }, 800);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
    toast.success("Print/Download window opened. You can save as PDF or print.", { duration: 4000 });
  };

  if (!storageHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800"></div>
          <p className="mt-4 text-sm text-gray-600">Loading ID Card...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm">
        <div ref={cardRef} data-card className="overflow-hidden rounded-xl shadow-2xl" style={{ backgroundColor: '#ffffff' }}>
          <div className="px-6 py-5 text-center" style={{ backgroundColor: '#2d2d2d' }}>
            <h1 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#ffffff' }}>
              RSS - Rashtriya Swayamsevak Sangh
            </h1>
          </div>

          <div className="px-8 py-8" style={{ backgroundColor: '#ffffff' }}>
            <div className="mx-auto mb-6 flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4" style={{ borderColor: '#1f2937', backgroundColor: '#f3f4f6' }}>
              <Image
                src={memberData.image}
                alt={memberData.name}
                width={144}
                height={144}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold uppercase tracking-wide" style={{ color: '#111827' }}>
                {memberData.name}
              </h2>
              <p className="mt-1 text-sm font-medium uppercase tracking-wider" style={{ color: '#4b5563' }}>
                {memberData.role}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b pb-2" style={{ borderColor: '#e5e7eb' }}>
                <span className="font-semibold uppercase" style={{ color: '#4b5563' }}>
                  ID No
                </span>
                <span className="font-mono" style={{ color: '#111827' }}>
                  {memberData.memberId || "N/A"}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2" style={{ borderColor: '#e5e7eb' }}>
                <span className="font-semibold uppercase" style={{ color: '#4b5563' }}>
                  Gender
                </span>
                <span style={{ color: '#111827' }}>
                  {memberData.gender || "N/A"}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2" style={{ borderColor: '#e5e7eb' }}>
                <span className="font-semibold uppercase" style={{ color: '#4b5563' }}>
                  Email
                </span>
                <span className="text-right" style={{ color: '#111827' }}>
                  {memberData.email || "N/A"}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2" style={{ borderColor: '#e5e7eb' }}>
                <span className="font-semibold uppercase" style={{ color: '#4b5563' }}>
                  Phone
                </span>
                <span style={{ color: '#111827' }}>
                  {memberData.phone || "N/A"}
                </span>
              </div>

              <div className="flex justify-between pb-2">
                <span className="font-semibold uppercase" style={{ color: '#4b5563' }}>
                  Address
                </span>
                <span className="max-w-[180px] text-right" style={{ color: '#111827' }}>
                  {memberData.address || "N/A"}
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-md border px-4 py-3 text-center" style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}>
              <p className="text-sm font-semibold italic" style={{ color: '#374151' }}>
                &quot;{quote}&quot;
              </p>
            </div>
          </div>

          <div className="px-6 py-3 text-center" style={{ backgroundColor: '#2d2d2d' }}>
            <p className="text-xs font-medium" style={{ color: '#d1d5db' }}>www.rss.org</p>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button 
            onClick={handleDownload}
            className="rounded-lg bg-gray-800 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
          >
            Download as PDF
          </button>
          <button 
            onClick={handlePrint}
            className="rounded-lg border-2 border-gray-800 bg-white px-6 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50"
          >
            Print Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default IDCardManagement;
