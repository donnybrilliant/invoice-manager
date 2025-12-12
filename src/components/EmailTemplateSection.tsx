import { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import { getDefaultEmailTemplate } from "../templates/email";
import { formatDate } from "../lib/formatting";

interface EmailTemplateSectionProps {
  useCustomTemplate: boolean;
  customTemplate: string;
  onUseCustomChange: (useCustom: boolean) => void;
  onCustomTemplateChange: (template: string) => void;
  companyName: string;
  companyEmail: string;
}

export default function EmailTemplateSection({
  useCustomTemplate,
  customTemplate,
  onUseCustomChange,
  onCustomTemplateChange,
  companyName,
  companyEmail,
}: EmailTemplateSectionProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [hasBeenEdited, setHasBeenEdited] = useState(false);
  const defaultTemplate = getDefaultEmailTemplate();

  // Check if template has been edited (differs from default)
  useEffect(() => {
    const trimmedCustom = customTemplate.trim();
    const trimmedDefault = defaultTemplate.trim();
    setHasBeenEdited(trimmedCustom !== "" && trimmedCustom !== trimmedDefault);
  }, [customTemplate, defaultTemplate]);

  // Sample data for preview
  const previewData = {
    invoiceNumber: "INV-2025-001",
    clientName: "John Doe",
    companyName: companyName || "Your Company",
    total: "1,250.00",
    currency: "EUR",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    message: "Thank you for your business!",
    companyEmail: companyEmail || undefined,
  };

  const handlePreview = () => {
    const template = customTemplate || defaultTemplate;

    // Replace template variables for preview
    const formattedIssueDate = formatDate(previewData.issueDate);
    const formattedDueDate = formatDate(previewData.dueDate);
    const formattedMessage = previewData.message
      ? previewData.message.replace(/\n/g, "<br>")
      : "";

    let result = template;

    // Handle conditionals
    if (previewData.message) {
      result = result.replace(
        /\{\{#if message\}\}([\s\S]*?)\{\{\/if\}\}/g,
        "$1"
      );
    } else {
      result = result.replace(/\{\{#if message\}\}([\s\S]*?)\{\{\/if\}\}/g, "");
    }

    if (previewData.companyEmail) {
      result = result.replace(
        /\{\{#if companyEmail\}\}([\s\S]*?)\{\{\/if\}\}/g,
        "$1"
      );
    } else {
      result = result.replace(
        /\{\{#if companyEmail\}\}([\s\S]*?)\{\{\/if\}\}/g,
        ""
      );
    }

    // Replace variables
    result = result
      .replace(/\{\{invoiceNumber\}\}/g, previewData.invoiceNumber)
      .replace(/\{\{clientName\}\}/g, previewData.clientName)
      .replace(/\{\{companyName\}\}/g, previewData.companyName)
      .replace(/\{\{total\}\}/g, previewData.total)
      .replace(/\{\{currency\}\}/g, previewData.currency)
      .replace(/\{\{issueDate\}\}/g, formattedIssueDate)
      .replace(/\{\{dueDate\}\}/g, formattedDueDate)
      .replace(/\{\{message\}\}/g, formattedMessage)
      .replace(/\{\{companyEmail\}\}/g, previewData.companyEmail || "");

    setPreviewHtml(result);
    setShowPreview(true);
  };

  const handleResetToDefault = () => {
    onCustomTemplateChange(defaultTemplate);
    setHasBeenEdited(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
        Email Template
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        By default, email templates match your invoice template style. Enable
        custom template to create your own branded email template.
      </p>

      {/* Use Custom Template Checkbox */}
      <div className="mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useCustomTemplate}
            onChange={(e) => {
              const checked = e.target.checked;
              onUseCustomChange(checked);
              // Initialize with default template if enabling and template is empty
              if (checked && !customTemplate.trim()) {
                onCustomTemplateChange(defaultTemplate);
              }
            }}
            className="w-4 h-4 text-slate-900 dark:text-slate-500 border-slate-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-slate-500"
          />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Use custom email template
          </span>
        </label>
        {!useCustomTemplate && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-6">
            Email templates will automatically match your invoice template style
            (e.g., Classic invoice → Classic email, Modern invoice → Modern
            email).
          </p>
        )}
      </div>

      {/* Custom Template Editor */}
      {useCustomTemplate && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Custom Email Template (HTML)
            </label>
            <div className="flex items-center gap-2">
              {hasBeenEdited && (
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  Reset to Default
                </button>
              )}
              <button
                type="button"
                onClick={handlePreview}
                className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
            </div>
          </div>
          <textarea
            value={customTemplate}
            onChange={(e) => onCustomTemplateChange(e.target.value)}
            rows={15}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent resize-none font-mono text-sm"
            placeholder="Enter your custom HTML template..."
          />
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            <p className="font-medium mb-1">Available template variables:</p>
            <div className="grid grid-cols-2 gap-1">
              <code className="text-xs">{"{{invoiceNumber}}"}</code>
              <code className="text-xs">{"{{clientName}}"}</code>
              <code className="text-xs">{"{{companyName}}"}</code>
              <code className="text-xs">{"{{total}}"}</code>
              <code className="text-xs">{"{{currency}}"}</code>
              <code className="text-xs">{"{{issueDate}}"}</code>
              <code className="text-xs">{"{{dueDate}}"}</code>
              <code className="text-xs">{"{{message}}"}</code>
              <code className="text-xs">{"{{companyEmail}}"}</code>
            </div>
            <p className="mt-2">
              Conditionals: <code>{"{{#if message}}...{{/if}}"}</code> or{" "}
              <code>{"{{#if companyEmail}}...{{/if}}"}</code>
            </p>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Email Preview
              </h3>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto p-4 flex-1">
              <div
                className="bg-white mx-auto"
                style={{ maxWidth: "600px" }}
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
