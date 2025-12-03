import { templates } from "../templates";

interface TemplateSelectorProps {
  selected: string;
  onChange: (templateId: string) => void;
}

export default function TemplateSelector({
  selected,
  onChange,
}: TemplateSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-3">
        Invoice Template
      </label>
      <div className="grid grid-cols-3 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onChange(template.id)}
            className={`relative p-4 border-2 rounded-lg transition-all ${
              selected === template.id
                ? "border-slate-900 bg-slate-50"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            {/* Template Preview Thumbnail */}
            <div className="aspect-[8.5/11] bg-white border border-slate-200 rounded mb-3 overflow-hidden">
              <div className="h-full p-2 text-xs">
                {template.id === "classic" && (
                  <div className="h-full flex flex-col">
                    <div className="flex-1 space-y-1">
                      <div className="h-2 bg-slate-300 w-3/4 rounded"></div>
                      <div className="h-1 bg-slate-200 w-1/2 rounded"></div>
                      <div className="h-1 bg-slate-200 w-2/3 rounded mt-2"></div>
                      <div className="h-1 bg-slate-200 w-1/2 rounded"></div>
                    </div>
                    <div className="h-6 bg-yellow-100 border-t-2 border-yellow-400 rounded-b"></div>
                  </div>
                )}
                {template.id === "modern" && (
                  <div className="h-full flex flex-col space-y-1">
                    <div className="h-2 bg-blue-500 w-full rounded"></div>
                    <div className="h-1 bg-slate-200 w-3/4 rounded mt-1"></div>
                    <div className="h-1 bg-slate-200 w-1/2 rounded"></div>
                    <div className="h-2 bg-blue-400 w-full rounded mt-2"></div>
                    <div className="h-1 bg-slate-200 w-2/3 rounded"></div>
                    <div className="h-1 bg-slate-200 w-1/2 rounded"></div>
                  </div>
                )}
                {template.id === "professional" && (
                  <div className="h-full flex flex-col space-y-1">
                    <div className="h-2 bg-slate-700 w-3/4 rounded"></div>
                    <div className="h-1 bg-slate-300 w-1/2 rounded"></div>
                    <div className="border-t border-slate-300 my-2"></div>
                    <div className="h-1 bg-slate-200 w-2/3 rounded"></div>
                    <div className="h-1 bg-slate-200 w-1/2 rounded"></div>
                    <div className="h-1 bg-slate-200 w-3/4 rounded"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Template Info */}
            <div className="text-left">
              <div className="font-semibold text-slate-900 text-sm mb-1">
                {template.name}
              </div>
              <div className="text-xs text-slate-600">
                {template.description}
              </div>
            </div>

            {/* Selected Indicator */}
            {selected === template.id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center">
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
        ))}
      </div>
    </div>
  );
}
