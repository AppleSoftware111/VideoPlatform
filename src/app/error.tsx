"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl space-y-4 rounded-xl border border-red-500/30 bg-red-500/10 p-6">
      <h2 className="text-lg font-semibold text-red-200">Something went wrong</h2>
      <p className="text-sm text-red-100/80">
        {error.message || "An unexpected server error occurred."}
      </p>
      <p className="text-sm text-zinc-400">
        If this is a database issue, set <code className="rounded bg-zinc-900 px-1">MONGODB_URI</code> in
        Vercel and redeploy.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
      >
        Try again
      </button>
    </div>
  );
}
