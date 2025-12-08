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
    top: 20,
    right: 15,
    bottom: 20,
    left: 15,
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

  try {
    // Capture the HTML element as a canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Allow cross-origin images (for logos)
      logging: false,
      backgroundColor: "#ffffff", // Ensure white background
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

    // If content fits on one page, add it directly (most invoices will be single page)
    if (imgHeight <= pageHeight) {
      pdf.addImage(
        imgData,
        "PNG",
        config.margins.left,
        config.margins.top,
        imgWidth,
        imgHeight
      );
    } else {
      // Handle multi-page documents - split content across pages
      // This is rare for invoices, but handle it properly
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

    // Save the PDF with the provided filename
    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF. Please try again.");
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
