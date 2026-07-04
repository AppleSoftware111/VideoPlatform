"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Users, Search, Filter, ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";
import { parseJsonResponse, useToast } from "@/components/useToast";

export type AccountRow = {
  id: string;
  username: string;
  status: string;
  healthScore: number;
  lastUsedAt: string | null;
};

type AccountsClientProps = {
  initialAccounts: AccountRow[];
};

const statuses = ["all", "active", "cooldown", "banned", "pending"] as const;

export function AccountsClient({ initialAccounts }: AccountsClientProps) {
  const router = useRouter();
  const { showToast, Toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof statuses)[number]>("all");
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const filteredAccounts = useMemo(() => {
    return initialAccounts.filter((account) => {
      const matchesSearch = account.username.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || account.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [initialAccounts, search, statusFilter]);

  async function handleImport() {
    const username = window.prompt("Enter account username to import:");
    if (!username?.trim()) return;

    setLoading("import");
    try {
      await parseJsonResponse(
        await fetch("/api/accounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: username.trim() }),
        }),
      );
      showToast(`Account "${username.trim()}" imported`, "success");
      router.refresh();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Import failed", "error");
    } finally {
      setLoading(null);
    }
  }

  async function handleEdit(account: AccountRow) {
    const status = window.prompt(
      `Edit status for ${account.username} (active, cooldown, banned, pending):`,
      account.status,
    );
    if (!status || !["active", "cooldown", "banned", "pending"].includes(status)) {
      showToast("Invalid status", "error");
      return;
    }

    setLoading(account.id);
    try {
      await parseJsonResponse(
        await fetch(`/api/accounts/${account.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }),
      );
      showToast(`Updated ${account.username}`, "success");
      router.refresh();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Update failed", "error");
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
      {Toast}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Account Management</h1>
            <p className="text-zinc-400 mt-1">Manage automated accounts and their health scores.</p>
          </div>
          <button
            type="button"
            onClick={handleImport}
            disabled={loading === "import"}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {loading === "import" ? "Importing..." : "Import Accounts"}
          </button>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search accounts..."
                className="bg-zinc-950 border border-zinc-800 text-sm rounded-lg pl-9 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-64"
              />
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFilter((value) => !value)}
                className="flex items-center space-x-2 text-zinc-400 hover:text-white px-3 py-1.5 border border-zinc-800 rounded-lg text-sm"
              >
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
              {showFilter && (
                <div className="absolute right-0 top-full mt-2 z-10 w-44 rounded-lg border border-zinc-800 bg-zinc-950 p-2 shadow-xl">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        setStatusFilter(status);
                        setShowFilter(false);
                        showToast(`Filter: ${status}`, "info");
                      }}
                      className={`block w-full rounded px-3 py-2 text-left text-sm capitalize ${
                        statusFilter === status ? "bg-indigo-600 text-white" : "text-zinc-300 hover:bg-zinc-800"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400">
              <thead className="text-xs uppercase bg-zinc-950/50 text-zinc-500 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Username</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Health Score</th>
                  <th className="px-6 py-4 font-medium">Last Used</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center font-medium text-zinc-200">
                        <Users className="h-4 w-4 mr-2 text-zinc-500" />
                        {account.username}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        account.status === "active" ? "bg-emerald-500/10 text-emerald-400" :
                        account.status === "cooldown" ? "bg-amber-500/10 text-amber-400" :
                        account.status === "banned" ? "bg-red-500/10 text-red-400" :
                        "bg-zinc-500/10 text-zinc-400"
                      }`}>
                        {account.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="mr-2">{account.healthScore}%</span>
                        {account.healthScore > 80 ? (
                          <ShieldCheck className="h-4 w-4 text-emerald-400" />
                        ) : account.healthScore > 40 ? (
                          <AlertTriangle className="h-4 w-4 text-amber-400" />
                        ) : (
                          <ShieldAlert className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {account.lastUsedAt
                        ? formatDistanceToNow(new Date(account.lastUsedAt), { addSuffix: true })
                        : "Never"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleEdit(account)}
                        disabled={loading === account.id}
                        className="text-indigo-400 hover:text-indigo-300 disabled:opacity-60 font-medium"
                      >
                        {loading === account.id ? "Saving..." : "Edit"}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredAccounts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                      No accounts found. Add some accounts to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
