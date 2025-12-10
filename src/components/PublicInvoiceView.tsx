import { useEffect } from "react";
import { useValidateShareToken } from "../hooks/useInvoiceShare";
import { getTemplate } from "../templates";
import { useToast } from "../contexts/ToastContext";
import { Client, CompanyProfile } from "../types";

interface PublicInvoiceViewProps {
  token: string;
}

export default function PublicInvoiceView({ token }: PublicInvoiceViewProps) {
  const { data, isLoading, error } = useValidateShareToken(token || null);
  const { showToast } = useToast();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Invoice {invoice.invoice_number}
            </h1>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Shared Invoice
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
