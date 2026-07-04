"use client";

import { useCallback, useState } from "react";
import { clsx } from "clsx";

type ToastType = "success" | "error" | "info";

type ToastState = {
  message: string;
  type: ToastType;
} | null;

export function useToast() {
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3500);
  }, []);

  const Toast = toast ? (
    <div
      className={clsx(
        "fixed bottom-6 right-6 z-50 max-w-sm rounded-lg border px-4 py-3 text-sm shadow-lg",
        toast.type === "success" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
        toast.type === "error" && "border-red-500/30 bg-red-500/10 text-red-200",
        toast.type === "info" && "border-indigo-500/30 bg-indigo-500/10 text-indigo-200",
      )}
    >
      {toast.message}
    </div>
  ) : null;

  return { showToast, Toast };
}

async function parseJsonResponse(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? "Request failed");
  }
  return data;
}

export { parseJsonResponse };
