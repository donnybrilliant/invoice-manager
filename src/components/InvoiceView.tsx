import { useState } from "react";
import { X, Printer, Download } from "lucide-react";
import { Invoice } from "../types";
import { getTemplate } from "../templates";
import {
  generatePDFFromElement,
  generateInvoiceFilename,
} from "../lib/pdfUtils";
import { useInvoiceItems } from "../hooks/useInvoiceItems";
import { useCompanyProfile } from "../hooks/useCompanyProfile";
import { useToast } from "../contexts/ToastContext";

interface InvoiceViewProps {
  invoice: Invoice;
  onClose: () => void;
}

export default function InvoiceView({ invoice, onClose }: InvoiceViewProps) {
  const client = invoice.client || null;
  const { data: items = [], isLoading: itemsLoading } = useInvoiceItems(
    invoice.id
  );
  const { data: profile = null, isLoading: profileLoading } =
    useCompanyProfile();
  const { showToast } = useToast();
  const [downloading, setDownloading] = useState(false);

  const loading = itemsLoading || profileLoading;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePrint = () => {
    // Calculate scale to fit ALL content on one A4 page
    // A4: 210mm x 297mm, with 10mm padding = 190mm x 277mm available
    // At 96 DPI: 1mm ≈ 3.78px, so 277mm ≈ 1047px
    const contentDiv = document.querySelector('.invoice-content-print > div') as HTMLElement;
    if (contentDiv) {
      // Force a reflow to get accurate measurements
      contentDiv.style.height = 'auto';
      contentDiv.style.maxHeight = 'none';
      
      // Get the actual rendered height (including all content)
      const contentHeight = contentDiv.scrollHeight;
      const availableHeight = 1047; // pixels (277mm)
      
      // Always scale to fit, even if slightly smaller than available
      const scale = Math.min(1, availableHeight / contentHeight);
      
      // Apply scale via inline style for print
      const style = document.createElement('style');
      style.id = 'invoice-print-scale';
      style.textContent = `
        @media print {
          .invoice-content-print {
            overflow: visible !important;
            height: auto !important;
            max-height: none !important;
          }
          .invoice-content-print > div {
            transform: scale(${scale}) !important;
            transform-origin: top left !important;
            width: ${100 / scale}% !important;
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
          }
        }
      `;
      // Remove existing scale style if present
      const existing = document.getElementById('invoice-print-scale');
      if (existing) {
        document.head.removeChild(existing);
      }
      document.head.appendChild(style);
      
      // Clean up after print
      const cleanup = () => {
        const styleEl = document.getElementById('invoice-print-scale');
        if (styleEl) {
          document.head.removeChild(styleEl);
        }
      };
      window.addEventListener('afterprint', cleanup, { once: true });
    }
    window.print();
  };

  const handleDownload = async () => {
    if (downloading || loading || !client) return;

    setDownloading(true);
    try {
      // Create a temporary container for rendering
      // This ensures clean PDF generation without modal styling or print CSS interference
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "0";
      tempDiv.style.width = "800px";
      tempDiv.style.background = "white";
      // Ensure print CSS doesn't affect this element
      tempDiv.className = "pdf-generation-temp";
      document.body.appendChild(tempDiv);

      // Render invoice HTML directly into tempDiv
      const template = getTemplate(invoice.template);
      const html = template.render({
        invoice,
        items,
        client: client,
        profile,
      });
      tempDiv.innerHTML = html;

      // Wait for images and fonts to load
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Generate filename with .pdf extension
      const customerName = client.name || "";
      const filename = generateInvoiceFilename(
        invoice.invoice_number,
        customerName,
        invoice.issue_date
      );

      // Generate PDF - use tempDiv directly since it contains the invoice HTML
      // The template should render a single root element
      await generatePDFFromElement(tempDiv, { filename });

      // Cleanup
      document.body.removeChild(tempDiv);
      showToast("PDF downloaded successfully", "success");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      showToast("Failed to download PDF. Please try again.", "error");
    } finally {
      setDownloading(false);
    }
  };

  // Get the template and render the invoice
  const renderInvoice = () => {
    if (loading || !client) {
      return <div className="text-center py-8 text-slate-600">Loading...</div>;
    }

    const template = getTemplate(invoice.template);
    const html = template.render({
      invoice,
      items,
      client: client,
      profile,
    });

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60] invoice-print-container"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 my-8 print:bg-white">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Invoice Details
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
              title="Print"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading || loading || !client}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              title="Download PDF"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-8 print:border-0 invoice-content-print">
          {renderInvoice()}
        </div>

        <div className="mt-6 text-center print:hidden">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            margin: 0;
            size: A4;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100vh !important;
            overflow: hidden !important;
          }
          /* Hide everything by default */
          body * {
            visibility: hidden;
          }
          /* Show only invoice print container and its invoice content */
          .invoice-print-container,
          .invoice-print-container .invoice-content-print,
          .invoice-print-container .invoice-content-print * {
            visibility: visible !important;
          }
          .invoice-print-container {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            z-index: 99999 !important;
          }
          /* Remove modal styling */
          .invoice-print-container > div {
            position: static !important;
            background: white !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
          }
          /* Hide header and footer */
          .invoice-print-container > div > div:first-child,
          .invoice-print-container > div > div:last-child {
            display: none !important;
            visibility: hidden !important;
          }
          /* Position and size invoice content */
          .invoice-content-print {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 210mm !important;
            height: auto !important;
            min-height: 297mm !important;
            margin: 0 !important;
            padding: 10mm !important;
            border: 0 !important;
            box-sizing: border-box !important;
            overflow: visible !important;
            background: white !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }
          /* Scale the invoice content to fit - ensure all content is visible */
          .invoice-content-print > div {
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            transform-origin: top left !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            overflow: visible !important;
          }
          /* Ensure PDF generation temp element is not affected by print CSS */
          .pdf-generation-temp,
          .pdf-generation-temp * {
            visibility: hidden !important;
          }
          .print\\:hidden {
            display: none !important;
            visibility: hidden !important;
          }
          .print\\:border-0 {
            border: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
