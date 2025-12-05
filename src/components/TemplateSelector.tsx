import { useMemo } from "react";
import { templates, getTemplate } from "../templates";
import { InvoiceTemplateData } from "../templates/types";
import { Client, CompanyProfile } from "../types";

interface TemplateSelectorProps {
  selected: string;
  onChange: (templateId: string) => void;
  previewData?: {
    formData: {
      client_id: string;
      issue_date: string;
      due_date: string;
      tax_rate: number;
      currency: string;
      notes: string;
      show_account_number: boolean;
      show_iban: boolean;
      show_swift_bic: boolean;
      kid_number: string;
    };
    items: Array<{
      description: string;
      quantity: number;
      unit_price: number;
      amount: number;
    }>;
    clients: Client[];
    profile: CompanyProfile | null;
  };
}

// Helper to render template HTML
const renderTemplateHtml = (
  templateId: string,
  previewData: TemplateSelectorProps["previewData"]
): string => {
  if (!previewData) return "";

  const { formData, items, clients, profile } = previewData;
  const selectedClient = clients.find((c) => c.id === formData.client_id);

  if (!selectedClient) return "";

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const tax_amount = subtotal * (formData.tax_rate / 100);
  const total = subtotal + tax_amount;

  // Create mock invoice data
  const mockInvoice = {
    id: "preview",
    invoice_number: "INV-PREVIEW",
    client_id: formData.client_id,
    user_id: "",
    issue_date: formData.issue_date,
    due_date: formData.due_date,
    status: "draft" as const,
    subtotal,
    discount_percentage: 0,
    discount_amount: 0,
    tax_rate: formData.tax_rate,
    tax_amount,
    total,
    currency: formData.currency,
    notes: formData.notes || null,
    template: templateId,
    show_account_number: formData.show_account_number,
    show_iban: formData.show_iban,
    show_swift_bic: formData.show_swift_bic,
    kid_number: formData.kid_number || null,
    created_at: "",
    updated_at: "",
    client: selectedClient,
  };

  const mockItems = items.map((item, index) => ({
    id: `preview-${index}`,
    invoice_id: "preview",
    description: item.description || "Sample item",
    quantity: item.quantity,
    unit_price: item.unit_price,
    amount: item.amount,
    created_at: "",
  }));

  const template = getTemplate(templateId);
  const templateData: InvoiceTemplateData = {
    invoice: mockInvoice,
    items: mockItems,
    client: selectedClient,
    profile,
  };

  return template.render(templateData);
};

export default function TemplateSelector({
  selected,
  onChange,
  previewData,
}: TemplateSelectorProps) {
  // Generate HTML for all templates (for thumbnails)
  const templateHtmls = useMemo(() => {
    const htmls: Record<string, string> = {};
    if (previewData) {
      templates.forEach((template) => {
        htmls[template.id] = renderTemplateHtml(template.id, previewData);
      });
    }
    return htmls;
  }, [previewData]);

  const hasClient =
    previewData?.formData.client_id && previewData.clients.length > 0;

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
        Invoice Template
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {templates.map((template) => {
          const thumbnailHtml = templateHtmls[template.id] || "";
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onChange(template.id)}
              className={`relative p-3 border-2 rounded-lg transition-all ${
                selected === template.id
                  ? "border-slate-900 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 ring-2 ring-slate-900 dark:ring-slate-600 ring-offset-2"
                  : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 bg-white dark:bg-slate-800"
              }`}
            >
              {/* Template Name */}
              <div className="font-semibold text-slate-900 dark:text-white text-xs mb-2 text-center">
                {template.name}
              </div>

              {/* Actual Template Preview (scaled down, showing full length) */}
              <div className="aspect-[8.5/11] bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded overflow-hidden">
                {thumbnailHtml ? (
                  <div
                    className="transform scale-[0.35] origin-top-left w-[285%] h-[285%]"
                    dangerouslySetInnerHTML={{ __html: thumbnailHtml }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-[8px] p-1">
                    {hasClient ? "Loading..." : "Select client"}
                  </div>
                )}
              </div>

              {/* Selected Indicator */}
              {selected === template.id && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-slate-900 dark:bg-slate-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
