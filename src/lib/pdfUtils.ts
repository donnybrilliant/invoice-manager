import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Configuration options for PDF generation
 */
export interface PDFOptions {
  filename?: string;
  format?: "a4" | "letter";
  orientation?: "portrait" | "landscape";
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

/**
 * Default PDF configuration based on design document specifications
 * - A4 page size (210mm x 297mm)
 * - Margins: 20mm top/bottom, 15mm left/right
 */
const DEFAULT_PDF_OPTIONS: Required<PDFOptions> = {
  filename: "document.pdf",
  format: "a4",
  orientation: "portrait",
  margins: {
    top: 25,
    right: 20,
    bottom: 25,
    left: 20,
  },
};

/**
 * Generates a PDF from an HTML element and initiates download
 *
 * @param element - The HTML element to convert to PDF
 * @param options - PDF generation options
 * @returns Promise that resolves when PDF generation is complete
 */
export async function generatePDFFromElement(
  element: HTMLElement,
  options: PDFOptions = {}
): Promise<void> {
  const config = { ...DEFAULT_PDF_OPTIONS, ...options };
  let link: HTMLAnchorElement | null = null;
  let url: string | null = null;

  try {
    // Ensure element is visible and has dimensions for proper rendering
    element.style.display = "block";
    element.style.visibility = "visible";
    if (!element.style.position || element.style.position === "absolute") {
      element.style.position = "relative";
    }

    // Force layout recalculation for flexbox/grid
    void element.offsetHeight; // Force reflow

    // Wait for any pending renders and images to load
    await new Promise((resolve) => {
      // Use requestAnimationFrame to ensure DOM is fully rendered
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Additional wait for flexbox/grid layouts to calculate properly
          // html2canvas needs extra time for complex flexbox layouts
          setTimeout(() => {
            // Force another reflow to ensure all calculations are complete
            void element.offsetHeight;
            resolve(undefined);
          }, 200);
        });
      });
    });

    // Wait for images to load
    const images = element.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          let timeoutId: ReturnType<typeof setTimeout> | null = null;
          const cleanup = () => {
            if (timeoutId !== null) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
          };

          img.onload = () => {
            cleanup();
            resolve(undefined);
          };
          img.onerror = () => {
            cleanup();
            resolve(undefined); // Continue even if image fails
          };

          // Timeout as fallback for slow/failed images
          timeoutId = setTimeout(() => {
            timeoutId = null;
            resolve(undefined);
          }, 1000);
        });
      })
    );

    // Capture the HTML element as a canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Allow cross-origin images (for logos)
      logging: false,
      backgroundColor: "#ffffff", // Ensure white background
      allowTaint: false, // Prevent tainting canvas
      foreignObjectRendering: false, // Better compatibility
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        // Ensure flexbox layouts are properly calculated in the cloned document
        const clonedElement =
          clonedDoc.querySelector(".pdf-generation-temp") ||
          clonedDoc.body.querySelector("div");
        if (clonedElement && clonedElement instanceof HTMLElement) {
          // Force layout recalculation
          void clonedElement.offsetHeight;

          // Disable font ligatures for better text rendering accuracy
          // This helps with negative letter-spacing and prevents character overlap
          const allElements = clonedElement.querySelectorAll("*");
          allElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.fontFeatureSettings = '"liga" 0, "kern" 1';
              el.style.fontVariantLigatures = "none";
              // Improve text rendering for canvas
              el.style.textRendering = "geometricPrecision";
            }
          });

          // Fix Brutalist template: ensure elements with black backgrounds have white text
          // Only apply to Brutalist template to avoid affecting other templates
          const brutalistTemplate = clonedElement.querySelector(
            ".brutalist-template"
          );
          if (brutalistTemplate) {
            const brutalistElements = brutalistTemplate.querySelectorAll("*");
            brutalistElements.forEach((el) => {
              if (el instanceof HTMLElement) {
                // Check both inline style and computed style for black background
                const styleAttr = el.getAttribute("style") || "";
                const computedStyle =
                  clonedDoc.defaultView?.getComputedStyle(el);
                const bgColor = computedStyle?.backgroundColor || "";

                const hasBlackBackground =
                  styleAttr.includes("background: #000") ||
                  styleAttr.includes("background:#000") ||
                  styleAttr.includes("background: #000000") ||
                  styleAttr.includes("background:#000000") ||
                  styleAttr.includes("background-color: #000") ||
                  styleAttr.includes("background-color:#000") ||
                  styleAttr.includes("background-color: #000000") ||
                  styleAttr.includes("background-color:#000000") ||
                  bgColor === "rgb(0, 0, 0)" ||
                  bgColor === "#000" ||
                  bgColor === "#000000";

                if (hasBlackBackground) {
                  // Force white text on the element itself
                  el.style.setProperty("color", "#ffffff", "important");
                  el.style.color = "#ffffff";

                  // Force white text on ALL child elements (spans, divs, etc.)
                  const allChildren = el.querySelectorAll("*");
                  allChildren.forEach((child) => {
                    if (child instanceof HTMLElement) {
                      child.style.setProperty("color", "#ffffff", "important");
                      child.style.color = "#ffffff";
                    }
                  });
                }
              }
            });
          }
        }
      },
    });

    // Calculate dimensions
    const imgWidth = 210 - config.margins.left - config.margins.right; // A4 width minus margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Ensure filename has .pdf extension
    const filename = config.filename.endsWith(".pdf")
      ? config.filename
      : `${config.filename}.pdf`;

    // Create PDF
    const pdf = new jsPDF({
      orientation: config.orientation,
      unit: "mm",
      format: config.format,
    });

    // Add image to PDF
    const imgData = canvas.toDataURL("image/png");

    // Calculate available page height
    const pageHeight = 297 - config.margins.top - config.margins.bottom; // A4 height minus margins

    // Smart scaling: If content is within 1.5x page height, scale to fit on one page
    // This prevents payment info from being split while avoiding tiny text on very long invoices
    const maxScaleHeight = pageHeight * 1.5; // 1.5x page height threshold

    if (imgHeight <= pageHeight) {
      // Content fits naturally on one page
      pdf.addImage(
        imgData,
        "PNG",
        config.margins.left,
        config.margins.top,
        imgWidth,
        imgHeight
      );
    } else if (imgHeight <= maxScaleHeight) {
      // Content is slightly too long - scale to fit on one page (like print mode)
      // This ensures payment info stays together
      const scale = pageHeight / imgHeight;
      const scaledWidth = imgWidth * scale;
      const scaledHeight = pageHeight;

      pdf.addImage(
        imgData,
        "PNG",
        config.margins.left + (imgWidth - scaledWidth) / 2, // Center horizontally
        config.margins.top,
        scaledWidth,
        scaledHeight
      );
    } else {
      // Content is too long - use multi-page (very long invoices)
      // Split content across pages
      let heightLeft = imgHeight;
      let yPosition = config.margins.top;
      let sourceY = 0;

      while (heightLeft > 0) {
        // Calculate how much of the image to show on this page
        const pageContentHeight = Math.min(heightLeft, pageHeight);
        const sourceHeight = (pageContentHeight / imgHeight) * canvas.height;

        // Create a temporary canvas for this page's content
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = sourceHeight;
        const pageCtx = pageCanvas.getContext("2d");

        if (pageCtx) {
          // Draw the portion of the image for this page
          pageCtx.drawImage(
            canvas,
            0,
            sourceY,
            canvas.width,
            sourceHeight, // source
            0,
            0,
            canvas.width,
            sourceHeight // destination
          );

          const pageImgData = pageCanvas.toDataURL("image/png");
          const pageImgHeight = pageContentHeight;

          pdf.addImage(
            pageImgData,
            "PNG",
            config.margins.left,
            yPosition,
            imgWidth,
            pageImgHeight
          );
        }

        // Move to next page if there's more content
        heightLeft -= pageHeight;
        sourceY += sourceHeight;

        if (heightLeft > 0) {
          pdf.addPage();
          yPosition = config.margins.top;
        }
      }
    }

    // Generate PDF as blob and download with proper filename
    // Using the same approach as XML downloads for consistent filename handling
    const pdfBlob = pdf.output("blob");
    url = URL.createObjectURL(pdfBlob);

    // Create temporary link and trigger download
    link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF. Please try again.");
  } finally {
    // Cleanup: always execute to prevent memory leaks
    if (link && link.parentNode) {
      document.body.removeChild(link);
    }
    if (url) {
      URL.revokeObjectURL(url);
    }
  }
}

/**
 * Opens the browser's print dialog for an HTML element
 *
 * @param element - The HTML element to print
 */
export function printElement(element: HTMLElement): void {
  // Store original body content
  const originalContents = document.body.innerHTML;

  // Replace body with element to print
  document.body.innerHTML = element.outerHTML;

  // Trigger print dialog
  window.print();

  // Restore original content
  document.body.innerHTML = originalContents;

  // Reload to restore React event listeners
  window.location.reload();
}

// Re-export for backward compatibility
export { generateInvoiceFilename } from "./utils";
