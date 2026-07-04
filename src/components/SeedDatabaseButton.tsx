"use client";

import { useState } from "react";
import { Database, Loader2 } from "lucide-react";

export function SeedDatabaseButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSeed() {
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/seed", { method: "POST" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to seed database");
      }

      setStatus("success");
      setMessage(data.message ?? "Database seeded successfully.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Failed to seed database");
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleSeed}
        disabled={status === "loading"}
        className="flex items-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Database className="h-4 w-4" />
        )}
        <span>{status === "loading" ? "Seeding..." : "Seed Database"}</span>
      </button>

      {message && (
        <p className={`text-sm ${status === "error" ? "text-red-400" : "text-emerald-400"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
