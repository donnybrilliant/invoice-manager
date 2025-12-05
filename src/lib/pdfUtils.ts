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
    });

    // Calculate dimensions
    const imgWidth = 210 - config.margins.left - config.margins.right; // A4 width minus margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF
    const pdf = new jsPDF({
      orientation: config.orientation,
      unit: "mm",
      format: config.format,
    });

    // Add image to PDF
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(
      imgData,
      "PNG",
      config.margins.left,
      config.margins.top,
      imgWidth,
      imgHeight
    );

    // Handle multi-page documents if content exceeds one page
    const pageHeight = 297 - config.margins.top - config.margins.bottom; // A4 height minus margins
    let heightLeft = imgHeight;
    let position = config.margins.top;

    while (heightLeft > pageHeight) {
      position = heightLeft - pageHeight;
      pdf.addPage();
      pdf.addImage(
        imgData,
        "PNG",
        config.margins.left,
        -position + config.margins.top,
        imgWidth,
        imgHeight
      );
      heightLeft -= pageHeight;
    }

    // Save the PDF
    pdf.save(config.filename);
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

/**
 * Generates a standardized filename for invoice PDFs
 * Format: invoice-{customer-name}-{date}.pdf
 *
 * @param invoiceNumber - The invoice number
 * @param customerName - The customer/client name (optional)
 * @param date - The invoice date (optional)
 * @returns Formatted filename
 */
export function generateInvoiceFilename(
  invoiceNumber: string,
  customerName?: string,
  date?: string
): string {
  let filename = "invoice";
  
  if (customerName) {
    // Sanitize customer name for filename
    const sanitizedName = customerName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    filename += `-${sanitizedName}`;
  }
  
  if (date) {
    // Format date as YYYY-MM-DD
    const dateStr = new Date(date).toISOString().split("T")[0];
    filename += `-${dateStr}`;
  }
  
  return `${filename}.pdf`;
}
