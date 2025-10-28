"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import QRCode from "qrcode";

function RssIdCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const userRole = "Volunteer";
  const isVolunteer = userRole === "Volunteer";
  const wings = "State Wing";
  const level = "District Level";
  const designation = "Coordinator";

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const baseUrl = window.location.origin;
        const userId = "12345";
        const verificationUrl = `${baseUrl}/idcard-verify/${userId}`;

        const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
          width: 120,
          margin: 1,
          color: {
            dark: "#1e3a5f",
            light: "#ffffff",
          },
        });

        setQrCodeUrl(qrDataUrl);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    generateQRCode();
  }, []);

  const overrideRootColors = () => {
    const root = document.documentElement;
    const body = document.body;
    const replacements: Record<string, string> = {
      "--background": "#ffffff",
      "--foreground": "#1e293b",
      "--card": "#ffffff",
      "--card-foreground": "#1e293b",
      "--popover": "#ffffff",
      "--popover-foreground": "#1e293b",
      "--primary": "#ff7f50",
      "--primary-foreground": "#ffffff",
      "--secondary": "#f2f4f7",
      "--secondary-foreground": "#1e293b",
      "--muted": "#f2f4f7",
      "--muted-foreground": "#1f2937",
      "--accent": "#f2f4f7",
      "--accent-foreground": "#1f2937",
      "--destructive": "#ef4444",
      "--destructive-foreground": "#ffffff",
      "--border": "#e2e8f0",
      "--input": "#e2e8f0",
      "--ring": "#ff7f50",
      "--chart-1": "#ff7f50",
      "--chart-2": "#38bdf8",
      "--chart-3": "#6366f1",
      "--chart-4": "#facc15",
      "--chart-5": "#f97316",
      "--sidebar": "#ffffff",
      "--sidebar-foreground": "#1e293b",
      "--sidebar-primary": "#ff7f50",
      "--sidebar-primary-foreground": "#ffffff",
      "--sidebar-accent": "#f2f4f7",
      "--sidebar-accent-foreground": "#1e293b",
      "--sidebar-border": "#e2e8f0",
      "--sidebar-ring": "#ff7f50",
    };

    const previous = new Map<string, string>();
    Object.entries(replacements).forEach(([key, value]) => {
      const existing = getComputedStyle(root).getPropertyValue(key);
      previous.set(key, existing);
      root.style.setProperty(key, value);
    });

    const prevBodyBg = body.style.backgroundColor;
    const prevBodyColor = body.style.color;
    body.style.backgroundColor = "#ffffff";
    body.style.color = "#1e293b";

    return () => {
      previous.forEach((value, key) => {
        root.style.setProperty(key, value.trim());
      });
      body.style.backgroundColor = prevBodyBg;
      body.style.color = prevBodyColor;
    };
  };

  const handleDownloadPDF = async () => {
    if (cardRef.current) {
      let restoreColors: (() => void) | null = null;
      try {
        const cards = cardRef.current.querySelectorAll(".id-card-item");

        if (cards.length === 0) {
          alert("No cards found to download");
          return;
        }

        restoreColors = overrideRootColors();

        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });

        for (let i = 0; i < cards.length; i++) {
          const card = cards[i] as HTMLElement;

          // Create a clone of the card
          const clone = card.cloneNode(true) as HTMLElement;
          clone.style.transform = "none";
          clone.style.transition = "none";

          // Append to body temporarily
          document.body.appendChild(clone);
          clone.style.position = "absolute";
          clone.style.left = "-9999px";
          clone.style.top = "-9999px";

          clone.style.setProperty("--primary", "#ff7f50");
          clone.style.setProperty("--background", "#ffffff");
          clone.style.setProperty("--foreground", "#1e293b");

          // Force badge styles before html2canvas processes
          const badges = clone.querySelectorAll('.volunteer-badge');
          badges.forEach((badge: Element) => {
            const htmlBadge = badge as HTMLElement;
            // Remove all classes to prevent any CSS interference
            htmlBadge.className = '';
            // Apply all styles as important inline styles
            htmlBadge.setAttribute('style', `
              display: inline-flex !important;
              align-items: center !important;
              gap: 6px !important;
              background-color: white !important;
              background: white !important;
              padding: 6px 12px !important;
              border-radius: 16px !important;
              box-shadow: 0 2px 8px rgba(30, 58, 95, 0.2) !important;
              margin-top: 5px !important;
              border: 1px solid rgb(30, 58, 95) !important;
            `);
          });

          const badgeTexts = clone.querySelectorAll('.badge-text');
          badgeTexts.forEach((text: Element) => {
            const htmlText = text as HTMLElement;
            htmlText.className = '';
            htmlText.setAttribute('style', `
              color: rgb(30, 58, 95) !important;
              font-size: 11px !important;
              font-weight: 600 !important;
              letter-spacing: 0.3px !important;
              white-space: nowrap !important;
              display: inline-block !important;
            `);
          });

          const badgeArrows = clone.querySelectorAll('.badge-arrow');
          badgeArrows.forEach((arrow: Element) => {
            const htmlArrow = arrow as HTMLElement;
            htmlArrow.className = '';
            htmlArrow.setAttribute('style', `
              color: rgb(255, 127, 80) !important;
              font-size: 12px !important;
              font-weight: 700 !important;
              margin: 0 2px !important;
              display: inline-block !important;
            `);
          });

          const nodes = [clone, ...Array.from(clone.querySelectorAll("*"))];

          const convertColor = (color: string) => {
            if (
              !color ||
              color === "transparent" ||
              color === "rgba(0, 0, 0, 0)"
            ) {
              return color;
            }

            if (!color.includes("oklch") && !color.includes("lab")) {
              return color;
            }

            const temp = document.createElement("div");
            temp.style.color = color;
            document.body.appendChild(temp);
            const computed = window.getComputedStyle(temp).color;
            document.body.removeChild(temp);
            return computed || "#ff7f50";
          };

          nodes.forEach((el: Element) => {
            const htmlEl = el as HTMLElement;

            // Skip if we already forced styles on this element
            if (htmlEl.style.cssText.includes('!important')) {
              return;
            }

            // Get computed styles before any modifications
            const computed = window.getComputedStyle(htmlEl);

            // Apply only the styles we need as inline styles using explicit RGB values
            const bgColor = computed.backgroundColor;
            if (bgColor && !htmlEl.style.backgroundColor) {
              htmlEl.style.backgroundColor = convertColor(bgColor) || bgColor;
            }

            const textColor = computed.color;
            if (textColor && !htmlEl.style.color) {
              htmlEl.style.color = convertColor(textColor) || textColor;
            }

            const borderColor = computed.borderColor;
            if (borderColor && !htmlEl.style.borderColor) {
              htmlEl.style.borderColor =
                convertColor(borderColor) || borderColor;
            }

            const bgImage = computed.backgroundImage;
            if (
              bgImage &&
              (bgImage.includes("oklch") || bgImage.includes("lab"))
            ) {
              htmlEl.style.backgroundImage = "none";
            }
          });

          // Wait a bit to ensure styles are applied
          await new Promise(resolve => setTimeout(resolve, 100));

          const canvas = await html2canvas(clone, {
            useCORS: true,
            allowTaint: true,
            logging: false,
          });

          // Remove clone
          document.body.removeChild(clone);

          const imgData = canvas.toDataURL("image/png");
          const imgWidth = 85;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          const xPosition = i === 0 ? 20 : 115;
          const yPosition = (210 - imgHeight) / 2;

          if (i > 0 && i % 2 === 0) {
            pdf.addPage();
          }

          pdf.addImage(
            imgData,
            "PNG",
            xPosition,
            yPosition,
            imgWidth,
            imgHeight
          );
        }

        // Save the PDF
        pdf.save("ID-Card.pdf");
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Error generating PDF. Please try again.");
      } finally {
        if (restoreColors) {
          restoreColors();
        }
      }
    }
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "5rem",
          right: "2rem",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        <button
          onClick={handleDownloadPDF}
          style={{
            background: "#1e3a5f",
            color: "white",
            fontWeight: "bold",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            transition: "all 300ms",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2d5a8a";
            e.currentTarget.style.boxShadow =
              "0 20px 25px -5px rgba(0, 0, 0, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#1e3a5f";
            e.currentTarget.style.boxShadow =
              "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{ height: "1.25rem", width: "1.25rem" }}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Download PDF
        </button>
      </div>

      <div className="id-card-wrapper">
        <div ref={cardRef} className="id-card-container">
          <div className="id-card id-card-item">
            <div style={{ paddingTop: '20px', paddingLeft: '24px', paddingRight: '24px', position: 'relative', zIndex: 20 }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <img
                  src="/logo/logo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  style={{
                    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))",
                  }}
                />
                <span
                  style={{
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: "700",
                    letterSpacing: "0.8px",
                    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
                  }}
                >
                  RASHTRIYA SEVA SANGH
                </span>
              </div>
            </div>

            <div className="id-card-profile-section">
              <div className="id-card-profile-ring">
                <div className="id-card-profile-photo">
                  <Image
                    src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1"
                    alt="Profile"
                    className="id-card-profile-img"
                    width={100}
                    height={100}
                  />
                </div>
              </div>
            </div>

            <div className="id-card-name-section">
              <h2 className="id-card-name">Anil Rawat</h2>
              <div className="id-card-role">{userRole}</div>
              {isVolunteer && (
                <div
                  className="volunteer-badge"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "rgb(255, 255, 255)",
                    padding: "6px 12px",
                    borderRadius: "16px",
                    boxShadow: "0 2px 8px rgba(30, 58, 95, 0.2)",
                    marginTop: "5px",
                    border: "1px solid rgb(30, 58, 95)",
                    borderColor: "rgb(30, 58, 95)",
                    background: "rgb(255, 255, 255)",
                  }}
                >
                  <span
                    className="badge-text"
                    style={{
                      color: "rgb(30, 58, 95)",
                      fontSize: "11px",
                      fontWeight: "600",
                      letterSpacing: "0.3px",
                      whiteSpace: "nowrap",
                      display: "inline-block",
                    }}
                  >
                    {wings}
                  </span>
                  <span
                    className="badge-arrow"
                    style={{
                      color: "rgb(255, 127, 80)",
                      fontSize: "12px",
                      fontWeight: "700",
                      margin: "0 2px",
                      display: "inline-block",
                    }}
                  >
                    {'→'}
                  </span>
                  <span
                    className="badge-text"
                    style={{
                      color: "rgb(30, 58, 95)",
                      fontSize: "11px",
                      fontWeight: "600",
                      letterSpacing: "0.3px",
                      whiteSpace: "nowrap",
                      display: "inline-block",
                    }}
                  >
                    {level}
                  </span>
                  <span
                    className="badge-arrow"
                    style={{
                      color: "rgb(255, 127, 80)",
                      fontSize: "12px",
                      fontWeight: "700",
                      margin: "0 2px",
                      display: "inline-block",
                    }}
                  >
                    {'→'}
                  </span>
                  <span
                    className="badge-text"
                    style={{
                      color: "rgb(30, 58, 95)",
                      fontSize: "11px",
                      fontWeight: "600",
                      letterSpacing: "0.3px",
                      whiteSpace: "nowrap",
                      display: "inline-block",
                    }}
                  >
                    {designation}
                  </span>
                </div>
              )}
            </div>

            <div className="id-card-wave">
              <svg viewBox="0 0 350 200" preserveAspectRatio="none">
                <path
                  d="M0,70 Q43.75,60 87.5,70 T175,70 T262.5,70 T350,70 L350,200 L0,200 Z"
                  fill="#ffffff"
                />
              </svg>
            </div>

            <div className="id-card-info-section">
              <div className="id-card-details-container">
                <h3 className="id-card-details-heading">
                  Details of Volunteer
                </h3>
                <div>
                  <div className="id-card-detail-row">
                    <span className="id-card-detail-label">Phone</span>
                    <span className="id-card-detail-colon">:</span>
                    <span className="id-card-detail-value">
                      +880 1531 034992
                    </span>
                  </div>
                  <div className="id-card-detail-row">
                    <span className="id-card-detail-label">Reg. No</span>
                    <span className="id-card-detail-colon">:</span>
                    <span className="id-card-detail-value">R-0001102</span>
                  </div>
                  <div className="id-card-detail-row">
                    <span className="id-card-detail-label">State</span>
                    <span className="id-card-detail-colon">:</span>
                    <span className="id-card-detail-value">Maharashtra</span>
                  </div>
                  <div className="id-card-detail-row">
                    <span className="id-card-detail-label">Reg. Date</span>
                    <span className="id-card-detail-colon">:</span>
                    <span className="id-card-detail-value">07-04-2025</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Card */}
          <div className="id-card id-card-item">
            <div
              style={{
                paddingTop: '24px',
                paddingLeft: '24px',
                paddingRight: '24px',
                position: 'relative',
                zIndex: 20,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src="/logo/logo.png"
                alt="Logo"
                width={40}
                height={40}
                style={{ filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))" }}
              />
              <span
                style={{
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "700",
                  letterSpacing: "0.8px",
                  filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
                }}
              >
                RASHTRIYA SEVA SANGH
              </span>
              </div>
            </div>

            <div className="id-card-terms-section">
              <div className="id-card-terms-container">
                <h3 className="id-card-terms-heading">नियम व शर्तें :-</h3>
                <ol className="id-card-terms-list">
                  <li className="id-card-terms-item">
                    यह कार्ड हस्तान्तरणीय नहीं है।
                  </li>
                  <li className="id-card-terms-item">
                    आई.डी. कार्ड का उपयोग केवल राष्ट्रीय सेवा संघ द्वारा
                    निर्धारित उद्देश्यों के लिए ही किया जायेगा।
                  </li>
                  <li className="id-card-terms-item">
                    आई.डी. कार्ड का दुरूपयोग करने पर स्वतः ही कार्ड निरस्त माना
                    जायेगा तथा किसी भी गैरकानूनी कार्य के लिए कार्ड धारक स्वयं
                    जिम्मेदार होंगा।
                  </li>
                  <li className="id-card-terms-item">
                    किसी भी स्थिति में संगठन की गोपनीयता को भंग करना गैरकानूनी
                    एवं दण्डनीय अपराध है।
                  </li>
                </ol>
              </div>
            </div>

            <div className="id-card-wave">
              <svg viewBox="0 0 350 200" preserveAspectRatio="none">
                <path
                  d="M0,70 Q43.75,60 87.5,70 T175,70 T262.5,70 T350,70 L350,200 L0,200 Z"
                  fill="#ffffff"
                />
              </svg>
            </div>

            <div className="id-card-verification-section">
              <div className="id-card-verification-container">
                <h3 className="id-card-verification-heading">
                  We are Registered and Verified by
                </h3>

                <div className="id-card-badges-container">
                  <span className="id-card-badge">
                    <img
                      src="/logo/gov-01.png"
                      alt="Verification Badge"
                      style={{
                        width: "38px",
                        height: "38px",
                        objectFit: "contain",
                      }}
                    />
                  </span>
                  <span className="id-card-badge">
                    <img
                      src="/logo/gov-02.jpg"
                      alt="Verification Badge"
                      style={{
                        width: "38px",
                        height: "38px",
                        objectFit: "contain",
                      }}
                    />
                  </span>
                  <span className="id-card-badge">
                    <img
                      src="/logo/gov-03.png"
                      alt="Verification Badge"
                      style={{
                        width: "38px",
                        height: "38px",
                        objectFit: "contain",
                      }}
                    />
                  </span>
                  <span className="id-card-badge">
                    <img
                      src="/logo/gov-04.png"
                      alt="Verification Badge"
                      style={{
                        width: "38px",
                        height: "38px",
                        objectFit: "contain",
                      }}
                    />
                  </span>
                  <span className="id-card-badge">
                    <img
                      src="/logo/gov-05.jpeg"
                      alt="Verification Badge"
                      style={{
                        width: "38px",
                        height: "38px",
                        objectFit: "contain",
                      }}
                    />
                  </span>
                  <span className="id-card-badge">
                    <img
                      src="/logo/gov-06.jpeg"
                      alt="Verification Badge"
                      style={{
                        width: "38px",
                        height: "38px",
                        objectFit: "contain",
                      }}
                    />
                  </span>
                  <span className="id-card-badge">
                    <img
                      src="/logo/gov-07.jpeg"
                      alt="Verification Badge"
                      style={{
                        width: "38px",
                        height: "38px",
                        objectFit: "contain",
                      }}
                    />
                  </span>
                </div>

                <div className="id-card-signature-row">
                  <div className="id-card-date-section">
                    {qrCodeUrl ? (
                      <img
                        src={qrCodeUrl}
                        alt="Verification QR Code"
                        style={{
                          width: "50px",
                          height: "50px",
                          border: "2px solid #1e3a5f",
                          borderRadius: "8px",
                          padding: "4px",
                          backgroundColor: "#ffffff",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "2px solid #e2e8f0",
                          borderRadius: "8px",
                          backgroundColor: "#f8fafc",
                          color: "#64748b",
                          fontSize: "0.625rem",
                        }}
                      >
                        Loading...
                      </div>
                    )}
                  </div>
                  <div className="id-card-signature-section">
                    <img
                      src="/logo/logo.png"
                      alt="Authorized Signature"
                      className="id-card-signature-img"
                    />
                    <span className="id-card-signature-label">
                      अधिकृत हस्ताक्षर
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RssIdCard;
