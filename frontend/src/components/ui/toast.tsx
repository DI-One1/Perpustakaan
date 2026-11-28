"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================================
   BILIK Toast Notification System
   - Lightweight floating toasts with optional action button
   - Variants: success, warning, error, info
   - Auto-dismiss (5s), closeable, stacks from bottom-center
   ============================================================================ */

type ToastVariant = "success" | "warning" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toast: (params: {
    message: string;
    variant?: ToastVariant;
    action?: { label: string; onClick: () => void };
  }) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

const VARIANT_STYLES: Record<ToastVariant, string> = {
  success:
    "border-emerald-500/30 bg-emerald-50 text-emerald-900",
  warning:
    "border-amber-500/30 bg-amber-50 text-amber-900",
  error:
    "border-destructive/30 bg-red-50 text-red-900",
  info:
    "border-primary/30 bg-primary-soft text-primary",
};

function ToastSlot({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const [isExiting, setIsExiting] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(item.id), 250);
    }, 5000);
    return () => clearTimeout(timer);
  }, [item.id, onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(item.id), 250);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-center gap-3 rounded-xl border px-4 py-3 shadow-md text-xs font-medium transition-all duration-250",
        isExiting ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0",
        VARIANT_STYLES[item.variant]
      )}
    >
      <span className="flex-1">{item.message}</span>

      {item.action && (
        <button
          type="button"
          onClick={() => {
            item.action?.onClick();
            handleDismiss();
          }}
          className="shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-bold bg-white/80 border border-current/10 hover:bg-white transition-colors focus:outline-none"
        >
          {item.action.label}
        </button>
      )}

      <button
        type="button"
        onClick={handleDismiss}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity focus:outline-none"
        aria-label="Tutup"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = React.useCallback(
    (params: {
      message: string;
      variant?: ToastVariant;
      action?: { label: string; onClick: () => void };
    }) => {
      const newItem: ToastItem = {
        id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        message: params.message,
        variant: params.variant || "info",
        action: params.action,
      };
      setToasts((prev) => [...prev, newItem].slice(-5)); // max 5 stacked
    },
    []
  );

  const contextValue = React.useMemo(() => ({ toast: addToast }), [addToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Toast Container: fixed bottom-center */}
      {toasts.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-[min(calc(100%-32px),440px)]">
          {toasts.map((item) => (
            <ToastSlot key={item.id} item={item} onDismiss={dismiss} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast harus digunakan di dalam ToastProvider");
  }
  return context;
}
