import { templates } from "../templates";

interface TemplateSelectorProps {
  selected: string;
  onChange: (templateId: string) => void;
}

const getTemplatePreview = (templateId: string) => {
  switch (templateId) {
    case "classic":
      return (
        <div className="h-full flex flex-col">
          <div className="flex-1 space-y-1">
            <div className="h-2 bg-slate-300 w-3/4 rounded"></div>
            <div className="h-1 bg-slate-200 w-1/2 rounded"></div>
            <div className="h-1 bg-slate-200 w-2/3 rounded mt-2"></div>
            <div className="h-1 bg-slate-200 w-1/2 rounded"></div>
          </div>
          <div className="h-6 bg-yellow-100 border-t-2 border-yellow-400 rounded-b"></div>
        </div>
      );
    case "modern":
      return (
        <div className="h-full flex flex-col space-y-1">
          <div className="h-2 bg-blue-500 w-full rounded"></div>
          <div className="h-1 bg-slate-200 w-3/4 rounded mt-1"></div>
          <div className="h-1 bg-slate-200 w-1/2 rounded"></div>
          <div className="h-2 bg-blue-400 w-full rounded mt-2"></div>
          <div className="h-1 bg-slate-200 w-2/3 rounded"></div>
          <div className="h-1 bg-slate-200 w-1/2 rounded"></div>
        </div>
      );
    case "professional":
      return (
        <div className="h-full flex flex-col space-y-1">
          <div className="h-2 bg-slate-700 w-3/4 rounded"></div>
          <div className="h-1 bg-slate-300 w-1/2 rounded"></div>
          <div className="border-t border-slate-300 my-2"></div>
          <div className="h-1 bg-slate-200 w-2/3 rounded"></div>
          <div className="h-1 bg-slate-200 w-1/2 rounded"></div>
          <div className="h-1 bg-slate-200 w-3/4 rounded"></div>
        </div>
      );
    case "brutalist":
      return (
        <div className="h-full flex flex-col border-2 border-black">
          <div className="h-3 bg-black"></div>
          <div className="flex-1 p-1 space-y-0.5">
            <div className="h-1 bg-black w-full"></div>
            <div className="h-0.5 bg-black w-3/4"></div>
            <div className="h-0.5 bg-black w-2/3"></div>
            <div className="h-1 bg-black w-full mt-1"></div>
          </div>
        </div>
      );
    case "dark-mode":
      return (
        <div className="h-full flex flex-col bg-slate-900 rounded">
          <div className="flex-1 p-1 space-y-0.5">
            <div className="h-1 bg-slate-700 w-3/4 rounded"></div>
            <div className="h-0.5 bg-slate-800 w-1/2 rounded"></div>
            <div className="h-0.5 bg-green-400 w-2/3 rounded"></div>
            <div className="h-1 bg-slate-700 w-full rounded mt-1"></div>
          </div>
        </div>
      );
    case "minimal-japanese":
      return (
        <div className="h-full flex flex-col bg-amber-50">
          <div className="h-0.5 bg-amber-300 w-1/2 mx-auto mt-2"></div>
          <div className="flex-1 p-1 space-y-1">
            <div className="h-0.5 bg-amber-400 w-3/4"></div>
            <div className="h-0.5 bg-amber-300 w-1/2"></div>
            <div className="h-0.5 bg-amber-400 w-2/3"></div>
          </div>
          <div className="h-0.5 bg-amber-300 w-1/3 mx-auto mb-2"></div>
        </div>
      );
    case "neo-brutalist":
      return (
        <div className="h-full flex flex-col border-4 border-black bg-green-50">
          <div className="h-2 bg-orange-500 border-b-2 border-black"></div>
          <div className="flex-1 p-1 space-y-0.5">
            <div className="h-1 bg-yellow-300 w-full"></div>
            <div className="h-0.5 bg-black w-3/4"></div>
            <div className="h-1 bg-red-500 w-full"></div>
          </div>
        </div>
      );
    case "swiss":
      return (
        <div className="h-full flex flex-col">
          <div className="h-1 bg-red-500 w-1/4"></div>
          <div className="flex-1 p-1 space-y-1">
            <div className="h-0.5 bg-slate-300 w-full"></div>
            <div className="h-0.5 bg-slate-200 w-3/4"></div>
            <div className="h-0.5 bg-slate-300 w-full"></div>
            <div className="h-0.5 bg-slate-200 w-2/3"></div>
          </div>
        </div>
      );
    case "typewriter":
      return (
        <div className="h-full flex flex-col bg-amber-50 border border-amber-300">
          <div className="flex-1 p-1 space-y-0.5">
            <div className="h-1 bg-amber-200 w-full"></div>
            <div className="h-0.5 bg-amber-300 w-3/4"></div>
            <div className="h-0.5 bg-amber-200 w-2/3 border-b border-dashed border-amber-400"></div>
            <div className="h-1 bg-amber-300 w-full"></div>
          </div>
        </div>
      );
    default:
      return (
        <div className="h-full flex items-center justify-center text-slate-400 text-xs">
          Preview
        </div>
      );
  }
};

export default function TemplateSelector({
  selected,
  onChange,
}: TemplateSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
        Invoice Template
      </label>
      <div className="grid grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-2">
        {templates.map((template) => (
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
            {/* Template Preview Thumbnail */}
            <div className="aspect-[8.5/11] bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded mb-2 overflow-hidden">
              <div className="h-full p-1.5 text-xs">
                {getTemplatePreview(template.id)}
              </div>
            </div>

            {/* Template Info */}
            <div className="text-left">
              <div className="font-semibold text-slate-900 dark:text-white text-xs mb-0.5">
                {template.name}
              </div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-2">
                {template.description}
              </div>
            </div>

            {/* Selected Indicator */}
            {selected === template.id && (
              <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-slate-900 dark:bg-slate-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-2.5 h-2.5 text-white"
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
