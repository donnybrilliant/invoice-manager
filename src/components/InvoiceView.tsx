import { useState } from "react";
import {
  X,
  Printer,
  Download,
  FileCode,
  Share2,
  Mail,
  Copy,
  Check,
} from "lucide-react";
import { createRoot, Root } from "react-dom/client";
import { Invoice } from "../types";
import { getTemplate } from "../templates";
import { generatePDFFromElement, generatePDFBase64 } from "../lib/pdfUtils";
import {
  generateEHFXML,
  downloadEHFXML,
  generateEHFFilename,
} from "../lib/ehfGenerator";
import {
  generateInvoiceFilenameForDownload,
  generateInvoiceFilenameForEmail,
} from "../lib/utils";
import { useInvoiceItems } from "../hooks/useInvoiceItems";
import { useCompanyProfile } from "../hooks/useCompanyProfile";
import { useToast } from "../contexts/ToastContext";
import { useShareLink, useGenerateShareToken } from "../hooks/useInvoiceShare";
import { supabase } from "../lib/supabase";
import { formatDate, formatCurrencyWithCode } from "../lib/formatting";
import { useQueryClient } from "@tanstack/react-query";
import { renderEmailTemplate } from "../lib/emailTemplateUtils";
import { useAuth } from "../contexts/AuthContext";
import { InvoiceContainer } from "./InvoiceContainer";

interface InvoiceViewProps {
  invoice: Invoice;
  onClose: () => void;
  onInvoiceUpdate?: (invoice: Invoice) => void;
}

export default function InvoiceView({
  invoice,
  onClose,
  onInvoiceUpdate,
}: InvoiceViewProps) {
  const client = invoice.client || null;
  const { data: items = [], isLoading: itemsLoading } = useInvoiceItems(
    invoice.id
  );
  const { data: profile = null, isLoading: profileLoading } =
    useCompanyProfile();
  const { showToast } = useToast();
  const [downloading, setDownloading] = useState(false);
  const [downloadingEHF, setDownloadingEHF] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expiresInDays, setExpiresInDays] = useState<number>(30);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const { data: shareData } = useShareLink(invoice.id);
  const generateToken = useGenerateShareToken();
  const queryClient = useQueryClient();
  const { user } = useAuth();
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
            display: flex !important;
            justify-content: center !important;
            align-items: flex-start !important;
          }
          .invoice-content-print > div {
            transform: scale(${scale}) !important;
            transform-origin: top center !important;
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
      tempDiv.className = "pdf-generation-temp";
      document.body.appendChild(tempDiv);

      // Render invoice React component
      const template = getTemplate(invoice.template);
      const TemplateComponent = template.Component;
      root = createRoot(tempDiv);
      root.render(
        <InvoiceContainer>
          <TemplateComponent
            invoice={invoice}
            items={items}
            client={client}
            profile={profile}
          />
        </InvoiceContainer>
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

      // Generate filename for download: invoiceid-client-name-date-of-creation
      const filename = generateInvoiceFilenameForDownload(
        invoice.invoice_number,
        client.name || "",
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

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const handleCopyLink = async () => {
    if (!shareData?.url) return;

    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      showToast("Share link copied to clipboard", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("Failed to copy link", "error");
    }
  };

  const handleRegenerateLink = async () => {
    if (isRegenerating) return;

    setIsRegenerating(true);
    try {
      // Generate new token with selected expiration
      await generateToken.mutateAsync({
        invoiceId: invoice.id,
        expiresInDays,
      });

      // Invalidate and refetch share link
      await queryClient.invalidateQueries({
        queryKey: ["invoice-share", invoice.id],
      });

      showToast("Share link regenerated successfully", "success");
    } catch (error) {
      console.error("Error regenerating share link:", error);
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to regenerate share link",
        "error"
      );
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSendEmail = () => {
    setEmailRecipient(client?.email || "");
    setShowEmailDialog(true);
  };

  const handleEmailSubmit = async () => {
    if (!emailRecipient || !client) return;

    setSendingEmail(true);
    let tempDiv: HTMLDivElement | null = null;
    let root: Root | null = null;

    try {
      // Generate PDF first
      tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "0";
      tempDiv.style.width = "800px";
      tempDiv.style.background = "white";
      tempDiv.style.display = "block";
      tempDiv.style.visibility = "visible";
      tempDiv.style.opacity = "1";
      tempDiv.className = "pdf-generation-temp invoice-light-mode";
      document.body.appendChild(tempDiv);

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

      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(resolve, 200);
          });
        });
      });

      // Generate PDF as base64 using utility function
      const pdfBase64 = await generatePDFBase64(tempDiv);

      // Generate filename for email: invoiceid-company-name-due-date
      const emailFilename = generateInvoiceFilenameForEmail(
        invoice.invoice_number,
        profile?.company_name || "company",
        invoice.due_date
      );

      // Render email template HTML
      // Format total using the proper currency formatting function
      const formattedTotal = formatCurrencyWithCode(
        invoice.total,
        invoice.currency
      );

      const emailHtml = renderEmailTemplate({
        invoiceNumber: invoice.invoice_number,
        clientName: client.name,
        companyName: profile?.company_name || "Your Company",
        total: formattedTotal,
        currency: invoice.currency,
        issueDate: invoice.issue_date,
        dueDate: invoice.due_date,
        message: emailMessage || undefined,
        companyEmail: profile?.email || undefined,
        useCustomTemplate: profile?.use_custom_email_template || false,
        customTemplate: profile?.email_template || null,
        invoiceTemplateId: invoice.template || "classic",
      });

      // Get auth token
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      // Call Edge Function to send email
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(
        `${supabaseUrl}/functions/v1/send-invoice-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            invoiceId: invoice.id,
            recipientEmail: emailRecipient,
            message: emailMessage || undefined,
            emailHtml, // Pre-rendered HTML template
            pdfBase64,
            pdfFilename: emailFilename, // Filename for email attachment
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.details || errorData.error || "Failed to send email"
        );
      }

      // Invalidate and refetch invoices query to refresh the list with updated status
      await queryClient.invalidateQueries({ queryKey: ["invoices", user?.id] });

      // Refetch invoices to get the updated invoice data (matching useInvoices query)
      const updatedInvoices = await queryClient.fetchQuery({
        queryKey: ["invoices", user?.id],
        queryFn: async () => {
          if (!user) throw new Error("No user");

          // First, mark any overdue invoices automatically
          try {
            const { error: overdueError } = await supabase.rpc(
              "mark_overdue_invoices_for_user",
              { user_uuid: user.id }
            );
            // Don't throw on error - just log it, as this is a background operation
            if (overdueError) {
              console.warn("Error marking overdue invoices:", overdueError);
            }
          } catch (err) {
            // Function might not exist yet if migration hasn't run
            console.warn("Could not mark overdue invoices:", err);
          }

          const { data, error } = await supabase
            .from("invoices")
            .select(
              `
              *,
              client:clients(*)
            `
            )
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (error) throw error;
          return (data || []) as Invoice[];
        },
      });

      // Find the updated invoice and notify parent component
      const updatedInvoice = updatedInvoices?.find(
        (inv) => inv.id === invoice.id
      );
      if (updatedInvoice && onInvoiceUpdate) {
        onInvoiceUpdate(updatedInvoice);
      }

      showToast("Email sent successfully", "success");
      setShowEmailDialog(false);
      setEmailMessage("");
    } catch (error) {
      console.error("Error sending email:", error);
      showToast(
        error instanceof Error ? error.message : "Failed to send email",
        "error"
      );
    } finally {
      if (root) {
        root.unmount();
      }
      if (tempDiv && tempDiv.parentNode) {
        document.body.removeChild(tempDiv);
      }
      setSendingEmail(false);
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
      <InvoiceContainer>
        <TemplateComponent
          invoice={invoice}
          items={items}
          client={client}
          profile={profile}
        />
      </InvoiceContainer>
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
              onClick={handleShare}
              disabled={loading}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              title="Share Invoice"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleSendEmail}
              disabled={loading || !client || !client.email}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              title="Send Email"
            >
              <Mail className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-8 print:border-0 invoice-content-print overflow-x-auto">
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

      {/* Share Dialog */}
      {showShareDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[70]">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Share Invoice
              </h3>
              <button
                onClick={() => setShowShareDialog(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {shareData ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Link Expiration
                  </label>
                  <select
                    value={expiresInDays}
                    onChange={(e) => setExpiresInDays(Number(e.target.value))}
                    disabled={isRegenerating}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50"
                  >
                    <option value={1}>1 day</option>
                    <option value={7}>7 days</option>
                    <option value={30}>30 days</option>
                    <option value={60}>60 days</option>
                    <option value={90}>90 days</option>
                    <option value={180}>180 days</option>
                    <option value={365}>1 year</option>
                  </select>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Current link expires on {formatDate(shareData.expiresAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="text"
                    value={shareData.url}
                    readOnly
                    className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="p-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition"
                    title="Copy link"
                  >
                    {copied ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <button
                  onClick={handleRegenerateLink}
                  disabled={isRegenerating}
                  className="w-full mb-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRegenerating
                    ? "Regenerating..."
                    : "Regenerate Link with New Expiration"}
                </button>
              </>
            ) : (
              <p className="text-slate-600 dark:text-slate-400">
                Generating share link...
              </p>
            )}
            <button
              onClick={() => setShowShareDialog(false)}
              className="w-full px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Email Dialog */}
      {showEmailDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[70]">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Send Invoice via Email
              </h3>
              <button
                onClick={() => setShowEmailDialog(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                disabled={sendingEmail}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={emailRecipient}
                  onChange={(e) => setEmailRecipient(e.target.value)}
                  disabled={sendingEmail}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50"
                  placeholder="client@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Message (Optional)
                </label>
                <textarea
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  disabled={sendingEmail}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 resize-none"
                  placeholder="Add a personal message to the email..."
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  setShowEmailDialog(false);
                  setEmailMessage("");
                }}
                disabled={sendingEmail}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEmailSubmit}
                disabled={sendingEmail || !emailRecipient}
                className="flex-1 px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingEmail ? "Sending..." : "Send Email"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* Force light mode for invoice content - prevent dark mode inheritance */
        /* Only override Tailwind classes, preserve template inline styles */
        @media (prefers-color-scheme: dark) {
          .invoice-light-mode {
            color-scheme: light !important;
            background-color: #ffffff !important;
          }
          /* Override Tailwind dark mode text classes */
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

        @media print {
          @page {
            margin: 0;
            size: A4;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-scheme: light !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100vh !important;
            overflow: hidden !important;
            color-scheme: light !important;
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
            color-scheme: light !important;
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
            color-scheme: light !important;
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
            color-scheme: light !important;
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
            left: 50% !important;
            transform: translateX(-50%) !important;
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
            color-scheme: light !important;
          }
          /* Scale the invoice content to fit - ensure all content is visible */
          .invoice-content-print > div {
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            transform-origin: top center !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            overflow: visible !important;
            color-scheme: light !important;
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
