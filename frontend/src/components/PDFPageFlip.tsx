"use client";

import React, { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import * as pdfjsLib from "pdfjs-dist";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf-worker/pdf.worker.min.mjs";

interface PDFPageFlipProps {
  pdfUrl: string;
  width?: number;
  height?: number;
}

interface PageData {
  pageNumber: number;
  canvas: HTMLCanvasElement;
}

const PDFPageFlip: React.FC<PDFPageFlipProps> = ({
  pdfUrl,
  width = 550,
  height = 733,
}) => {
  const bookRef = useRef<any>(null);
  const [pages, setPages] = useState<PageData[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [dimensions, setDimensions] = useState({ width, height });

  
  useEffect(() => {
    const updateDimensions = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      if (screenWidth < 640) {
        
        const mobileWidth = Math.min(screenWidth - 40, 400);
        const mobileHeight = Math.min(screenHeight * 0.6, 600);
        setDimensions({ width: mobileWidth, height: mobileHeight });
      } else if (screenWidth < 1024) {
        
        setDimensions({ width: 400, height: 550 });
      } else {
        
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [width, height]);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        setIsLoading(true);
        setError(null);

        
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        setTotalPages(numPages);

        
        const firstPage = await pdf.getPage(1);
        const viewport = firstPage.getViewport({ scale: 1.0 });
        
        
        const calculatedScale = dimensions.height / viewport.height;

        
        const renderedPages: PageData[] = [];
        
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const pageViewport = page.getViewport({ scale: calculatedScale });
          
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          canvas.width = pageViewport.width;
          canvas.height = pageViewport.height;

          if (context) {
            await page.render({
              canvasContext: context,
              viewport: pageViewport,
              canvas: canvas,
            }).promise;
          }

          renderedPages.push({
            pageNumber: pageNum,
            canvas: canvas,
          });
        }

        setPages(renderedPages);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading PDF:", error);
        setError(error instanceof Error ? error.message : "Failed to load PDF");
        setIsLoading(false);
      }
    };

    loadPDF();
  }, [pdfUrl, dimensions.height]);

  const onFlip = (e: any) => {
    setCurrentPage(e.data);
  };

  const nextPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const prevPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {isLoading && (
        <div className="flex items-center justify-center h-[600px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading PDF...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center h-[600px]">
          <div className="text-center max-w-md p-6 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-destructive font-semibold mb-2">Error Loading PDF</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      )}

      {!isLoading && !error && pages.length > 0 && (
        <>
          <div className="book-wrapper w-full px-4" style={{ perspective: "2000px" }}>
            <HTMLFlipBook
              ref={bookRef}
              width={dimensions.width}
              height={dimensions.height}
              size="stretch"
              minWidth={300}
              maxWidth={1000}
              minHeight={400}
              maxHeight={1533}
              maxShadowOpacity={0.5}
              showCover={true}
              mobileScrollSupport={true}
              onFlip={onFlip}
              className="book-flip"
              style={{}}
              startPage={0}
              drawShadow={true}
              flippingTime={1000}
              usePortrait={false}
              startZIndex={0}
              autoSize={true}
              clickEventForward={true}
              useMouseEvents={true}
              swipeDistance={30}
              showPageCorners={true}
              disableFlipByClick={false}
            >
              {pages.map((pageData) => (
                <div key={pageData.pageNumber} className="pdf-page">
                  <div
                    ref={(el) => {
                      if (el && !el.hasChildNodes()) {
                        el.appendChild(pageData.canvas);
                      }
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      background: "white",
                    }}
                  />
                </div>
              ))}
            </HTMLFlipBook>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center px-4">
            <div className="flex items-center gap-2">
              <Button
                onClick={prevPage}
                variant="outline"
                size="icon"
                disabled={currentPage === 0}
                className="h-9 w-9"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs sm:text-sm font-medium px-2 sm:px-4">
                {currentPage + 1} / {totalPages}
              </span>
              <Button
                onClick={nextPage}
                variant="outline"
                size="icon"
                disabled={currentPage >= totalPages - 1}
                className="h-9 w-9"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      <style jsx global>{`
        .book-wrapper {
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow-x: hidden;
        }
        .book-flip {
          margin: 0 auto;
          max-width: 100%;
        }
        .pdf-page {
          background: white;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .pdf-page canvas {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        
        /* Mobile optimizations */
        @media (max-width: 640px) {
          .book-wrapper {
            padding: 0 10px;
          }
          .book-flip {
            touch-action: pan-y pinch-zoom;
          }
        }
      `}</style>
    </div>
  );
};

export default PDFPageFlip;