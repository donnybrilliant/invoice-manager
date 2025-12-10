import { useState } from "react";
import { X, Printer, Download, FileCode } from "lucide-react";
import { createRoot, Root } from "react-dom/client";
import { Invoice } from "../types";
import { getTemplate } from "../templates";
import { generatePDFFromElement } from "../lib/pdfUtils";
import {
  generateEHFXML,
  downloadEHFXML,
  generateEHFFilename,
} from "../lib/ehfGenerator";
import { generateInvoiceFilename } from "../lib/utils";
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
  const [downloadingEHF, setDownloadingEHF] = useState(false);

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
    const contentDiv = document.querySelector(
      ".invoice-content-print > div"
    ) as HTMLElement;
    if (contentDiv) {
      // Force a reflow to get accurate measurements
      contentDiv.style.height = "auto";
      contentDiv.style.maxHeight = "none";

      // Get the actual rendered height (including all content)
      const contentHeight = contentDiv.scrollHeight;
      const availableHeight = 1047; // pixels (277mm)

      // Always scale to fit, even if slightly smaller than available
      const scale = Math.min(1, availableHeight / contentHeight);

      // Apply scale via inline style for print
      const style = document.createElement("style");
      style.id = "invoice-print-scale";
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
      const existing = document.getElementById("invoice-print-scale");
      if (existing) {
        document.head.removeChild(existing);
      }
      document.head.appendChild(style);

      // Clean up after print
      const cleanup = () => {
        try {
          const styleEl = document.getElementById("invoice-print-scale");
          if (styleEl && styleEl.parentNode) {
            document.head.removeChild(styleEl);
          }
        } catch {
          // Silently handle errors from browser extensions or disconnected ports
          // This is often caused by browser extensions trying to communicate after print mode
        }
      };
      window.addEventListener("afterprint", cleanup, { once: true });
    }
    window.print();
  };

  const handleDownload = async () => {
    if (downloading || loading || !client) return;

    setDownloading(true);
    let tempDiv: HTMLDivElement | null = null;
    let root: Root | null = null;

    try {
      // Create a temporary container for rendering
      // This ensures clean PDF generation without modal styling or print CSS interference
      tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "0";
      tempDiv.style.width = "800px";
      tempDiv.style.background = "white";
      tempDiv.style.display = "block";
      tempDiv.style.visibility = "visible";
      tempDiv.style.opacity = "1";
      // Ensure print CSS doesn't affect this element
      // Centralized styles in invoice.css handle dark mode isolation
      tempDiv.className = "pdf-generation-temp invoice-light-mode";
      document.body.appendChild(tempDiv);

      // Render invoice React component
      const template = getTemplate(invoice.template);
      const TemplateComponent = template.Component;
      root = createRoot(tempDiv);
      root.render(
        <div style={{ backgroundColor: "#ffffff", color: "#1f2937" }}>
          <TemplateComponent
            invoice={invoice}
            items={items}
            client={client}
            profile={profile}
          />
        </div>
      );

      // Wait for React to render and images/fonts to load
      // Use requestAnimationFrame to ensure DOM is fully rendered
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(resolve, 200);
          });
        });
      });

      // Generate filename with .pdf extension
      const customerName = client.name || "";
      const filename = generateInvoiceFilename(
        invoice.invoice_number,
        "pdf",
        customerName,
        invoice.issue_date
      );

      // Generate PDF - use tempDiv directly since it contains the invoice React component
      await generatePDFFromElement(tempDiv, { filename });

      showToast("PDF downloaded successfully", "success");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      showToast("Failed to download PDF. Please try again.", "error");
    } finally {
      // Cleanup: always execute to prevent memory leaks
      if (root) {
        root.unmount();
      }
      if (tempDiv && tempDiv.parentNode) {
        document.body.removeChild(tempDiv);
      }
      setDownloading(false);
    }
  };

  const handleDownloadEHF = () => {
    if (downloadingEHF || loading || !client || !profile) return;

    setDownloadingEHF(true);
    try {
      // Validate required fields for EHF
      if (!profile.organization_number) {
        showToast(
          "Company organization number is required for EHF export",
          "error"
        );
        return;
      }

      if (!client.organization_number) {
        showToast(
          "Client organization number is required for EHF export",
          "error"
        );
        return;
      }

      // Generate EHF XML
      const xmlContent = generateEHFXML(invoice, items, client, profile);

      // Generate filename
      const customerName = client.name || "";
      const filename = generateEHFFilename(
        invoice.invoice_number,
        customerName,
        invoice.issue_date
      );

      // Download XML file
      downloadEHFXML(xmlContent, filename);
      showToast("EHF XML downloaded successfully", "success");
    } catch (error) {
      console.error("Error generating EHF XML:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to generate EHF XML. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setDownloadingEHF(false);
    }
  };

  // Get the template and render the invoice
  const renderInvoice = () => {
    if (loading || !client) {
      return <div className="text-center py-8 text-slate-600">Loading...</div>;
    }

    const template = getTemplate(invoice.template);
    const TemplateComponent = template.Component;

    return (
      <div style={{ backgroundColor: "#ffffff", color: "#1f2937" }}>
        <TemplateComponent
          invoice={invoice}
          items={items}
          client={client}
          profile={profile}
        />
      </div>
    );
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
              onClick={handleDownloadEHF}
              disabled={downloadingEHF || loading || !client || !profile}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              title="Export EHF (Electronic Invoice Format)"
            >
              <FileCode className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-8 print:border-0 invoice-content-print overflow-x-auto invoice-light-mode">
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
    </div>
  );
}
