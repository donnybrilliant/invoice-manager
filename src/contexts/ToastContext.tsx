import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300";
      case "error":
        return "bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300";
      default:
        return "bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300";
    }
  };

  return (
    <div
      className={`${getToastStyles()} border rounded-lg shadow-lg p-4 flex items-start gap-3 transition-all duration-300 ease-in-out`}
      style={{
        animation: "slideInRight 0.3s ease-out",
      }}
    >
      <div className="flex-1 text-sm font-medium">{toast.message}</div>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-current opacity-70 hover:opacity-100 transition"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
