import { useMemo, useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { templates } from "../templates";
import { InvoiceTemplateData } from "../templates/types";
import { Client, CompanyProfile } from "../types";

interface TemplateSelectorProps {
  selected: string;
  onChange: (templateId: string) => void;
  disabled?: boolean;
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

// Helper to create template data
const createTemplateData = (
  templateId: string,
  previewData: TemplateSelectorProps["previewData"]
): InvoiceTemplateData | null => {
  if (!previewData) return null;

  const { formData, items, clients, profile } = previewData;
  const selectedClient = clients.find((c) => c.id === formData.client_id);

  if (!selectedClient) return null;

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
    sent_date: null,
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

  return {
    invoice: mockInvoice,
    items: mockItems,
    client: selectedClient,
    profile,
  };
};

export default function TemplateSelector({
  selected,
  onChange,
  disabled = false,
  previewData,
}: TemplateSelectorProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Generate template data for all templates (for thumbnails)
  const templateDataMap = useMemo(() => {
    const dataMap: Record<string, InvoiceTemplateData | null> = {};
    if (previewData) {
      templates.forEach((template) => {
        dataMap[template.id] = createTemplateData(template.id, previewData);
      });
    }
    return dataMap;
  }, [previewData]);

  const hasClient =
    previewData?.formData.client_id && previewData.clients.length > 0;

  useEffect(() => {
    // Check scroll position; defined inside effect so cleanup removes same reference
    const checkScroll = () => {
      if (!scrollContainerRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    };

    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [templateDataMap]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    const targetScroll =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
        Invoice Template
      </label>
      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={disabled}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 rounded-full p-2 shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-2 px-1 scroll-smooth scrollbar-hide"
          style={{
            WebkitOverflowScrolling: "touch",
          }}
        >
          {templates.map((template) => {
            const templateData = templateDataMap[template.id];
            const TemplateComponent = template.Component;
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => onChange(template.id)}
                disabled={disabled}
                className={`relative p-3 border-2 rounded-lg transition-all flex-shrink-0 w-48 ${
                  selected === template.id
                    ? "border-slate-900 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 ring-2 ring-slate-900 dark:ring-slate-600 ring-offset-2"
                    : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 bg-white dark:bg-slate-800"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {/* Template Name */}
                <div className="font-semibold text-slate-900 dark:text-white text-xs mb-2 text-center">
                  {template.name}
                </div>

                {/* Actual Template Preview (scaled down, showing full length) */}
                <div
                  className={`bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded overflow-hidden relative ${
                    template.id !== "dark-mode" ? "invoice-light-mode" : ""
                  }`}
                  style={{ aspectRatio: "8.5/11" }}
                >
                  {templateData ? (
                    <>
                      <div
                        className="absolute inset-0 flex items-start justify-center overflow-hidden template-thumbnail-wrapper"
                        style={{
                          transformOrigin: "top center",
                        }}
                      >
                        <div
                          style={{
                            width: "800px",
                            transform: "scale(0.1875)",
                            transformOrigin: "top center",
                            height: "auto",
                          }}
                        >
                          <div
                            style={
                              template.id !== "dark-mode"
                                ? {
                                    backgroundColor: "#ffffff",
                                    color: "#1f2937",
                                  }
                                : {}
                            }
                          >
                            <TemplateComponent
                              invoice={templateData.invoice}
                              items={templateData.items}
                              client={templateData.client}
                              profile={templateData.profile}
                            />
                          </div>
                        </div>
                      </div>
                    </>
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

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={disabled}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 rounded-full p-2 shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </button>
        )}

        {/* Scroll Indicator - Shows that more templates are available */}
        {templates.length > 4 && (
          <div className="flex justify-center items-center gap-2 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Scroll to see more templates
              </span>
              <div className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
