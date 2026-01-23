import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { useValidateShareToken } from "../hooks/useInvoiceShare";
import { getTemplate } from "../templates";
import { useToast } from "../contexts/ToastContext";
import { Client, CompanyProfile } from "../types";
import { generatePDFFromElement } from "../lib/pdfUtils";
import { generateInvoiceFilenameForDownload } from "../lib/utils";

interface PublicInvoiceViewProps {
  token: string;
}

export default function PublicInvoiceView({ token }: PublicInvoiceViewProps) {
  const { data, isLoading, error } = useValidateShareToken(token || null);
  const { showToast } = useToast();
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Invalid or expired invoice link",
        "error"
      );
    }
  }, [error, showToast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            Loading invoice...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Invalid Invoice Link
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {error instanceof Error
              ? error.message
              : "This invoice link is invalid or has expired. Please contact the sender for a new link."}
          </p>
        </div>
      </div>
    );
  }

  const { invoice, items, profile } = data;
  const client = invoice.client as Client;
  const companyProfile = profile as CompanyProfile | null;

  // Get the template and render the invoice
  const template = getTemplate(invoice.template);
  const TemplateComponent = template.Component;

  const handlePrint = () => {
    // Create a temporary container for rendering
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.style.top = "0";
    tempDiv.style.width = "794px";
    tempDiv.style.background = "white";
    tempDiv.style.display = "block";
    tempDiv.className = "pdf-generation-temp invoice-light-mode";
    document.body.appendChild(tempDiv);

    // Render the invoice component
    const root = createRoot(tempDiv);
    root.render(
      <div style={{ backgroundColor: "#ffffff", color: "#1f2937" }}>
        <TemplateComponent
          invoice={invoice}
          items={items}
          client={client}
          profile={companyProfile}
        />
      </div>
    );

    // Wait for render, then print
    setTimeout(() => {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Invoice ${invoice.invoice_number}</title>
              <style>
                body { margin: 0; padding: 20px; }
                @media print {
                  body { padding: 0; }
                }
              </style>
            </head>
            <body>
              ${tempDiv.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      } else {
        // Fallback to regular print if popup blocked
        window.print();
      }

      // Cleanup
      setTimeout(() => {
        root.unmount();
        if (tempDiv.parentNode) {
          document.body.removeChild(tempDiv);
        }
      }, 1000);
    }, 500);
  };

  const handleDownload = async () => {
    if (downloading || !client) return;

    setDownloading(true);
    let tempDiv: HTMLDivElement | null = null;
    let root: ReturnType<typeof createRoot> | null = null;

    try {
      // Create a temporary container for rendering
      tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "0";
      tempDiv.style.width = "794px";
      tempDiv.style.background = "white";
      tempDiv.style.display = "block";
      tempDiv.className = "pdf-generation-temp invoice-light-mode";
      document.body.appendChild(tempDiv);

      // Render the invoice component
      root = createRoot(tempDiv);
      root.render(
        <div style={{ backgroundColor: "#ffffff", color: "#1f2937" }}>
          <TemplateComponent
            invoice={invoice}
            items={items}
            client={client}
            profile={companyProfile}
          />
        </div>
      );

      // Wait for render
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Generate filename
      const filename = generateInvoiceFilenameForDownload(
        invoice.invoice_number,
        client.name,
        invoice.issue_date
      );

      // Generate PDF
      await generatePDFFromElement(tempDiv, { filename });

      showToast("PDF downloaded successfully", "success");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      showToast("Failed to download PDF. Please try again.", "error");
    } finally {
      // Cleanup
      if (root) {
        root.unmount();
      }
      if (tempDiv && tempDiv.parentNode) {
        document.body.removeChild(tempDiv);
      }
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Invoice {invoice.invoice_number}
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Shared Invoice
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
                  title="Print Invoice"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                  Print
                </button>
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  title="Download PDF"
                >
                  {downloading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Download PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8 invoice-light-mode">
          <div style={{ backgroundColor: "#ffffff", color: "#1f2937" }}>
            <TemplateComponent
              invoice={invoice}
              items={items}
              client={client}
              profile={companyProfile}
            />
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>
            This is a shared invoice link. For questions, please contact the
            sender.
          </p>
        </div>
      </div>

      <style>{`
        /* Force light mode for invoice content */
        @media (prefers-color-scheme: dark) {
          .invoice-light-mode {
            color-scheme: light !important;
            background-color: #ffffff !important;
          }
          .invoice-light-mode .dark\\:text-white,
          .invoice-light-mode .dark\\:text-slate-50,
          .invoice-light-mode .dark\\:text-slate-100,
          .invoice-light-mode .dark\\:text-slate-200,
          .invoice-light-mode .dark\\:text-slate-300,
          .invoice-light-mode .dark\\:text-slate-400 {
            color: #1f2937 !important;
          }
          .invoice-light-mode .dark\\:bg-slate-800,
          .invoice-light-mode .dark\\:bg-slate-700,
          .invoice-light-mode .dark\\:bg-slate-900 {
            background-color: #ffffff !important;
          }
        }
      `}</style>
    </div>
  );
}
