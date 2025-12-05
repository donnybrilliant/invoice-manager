import { useState, useEffect, useRef } from "react";
import { X, Printer, Download } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Invoice, InvoiceItem, CompanyProfile } from "../types";
import { getTemplate } from "../templates";
import {
  generatePDFFromElement,
  generateInvoiceFilename,
} from "../lib/pdfUtils";

interface InvoiceViewProps {
  invoice: Invoice;
  onClose: () => void;
}

export default function InvoiceView({ invoice, onClose }: InvoiceViewProps) {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const invoiceContentRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoice.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load invoice items
      const { data: itemsData, error: itemsError } = await supabase
        .from("invoice_items")
        .select("*")
        .eq("invoice_id", invoice.id)
        .order("created_at");

      if (itemsError) throw itemsError;
      setItems(itemsData || []);

      // Load company profile
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData, error: profileError } = await supabase
          .from("company_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          console.error("Error loading profile:", profileError);
        } else {
          setProfile(profileData);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!invoiceContentRef.current || downloading) return;

    setDownloading(true);
    try {
      const customerName = invoice.client?.name || "";
      const filename = generateInvoiceFilename(
        invoice.invoice_number,
        customerName,
        invoice.issue_date
      );
      await generatePDFFromElement(invoiceContentRef.current, { filename });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  // Get the template and render the invoice
  const renderInvoice = () => {
    if (loading || !invoice.client) {
      return <div className="text-center py-8 text-slate-600">Loading...</div>;
    }

    const template = getTemplate(invoice.template);
    const html = template.render({
      invoice,
      items,
      client: invoice.client,
      profile,
    });

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 my-8">
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
              disabled={downloading}
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

        <div
          ref={invoiceContentRef}
          className="border border-slate-200 dark:border-slate-700 rounded-lg p-8 print:border-0"
        >
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
          body * {
            visibility: hidden;
          }
          .fixed.inset-0 {
            position: static;
            background: white;
          }
          .fixed.inset-0, .fixed.inset-0 * {
            visibility: visible;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:border-0 {
            border: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
