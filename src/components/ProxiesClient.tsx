"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Plus, RefreshCw, Server } from "lucide-react";
import { parseJsonResponse, useToast } from "@/components/useToast";

export type ProxyRow = {
  id: string;
  protocol: string;
  address: string;
  port: number;
  isActive: boolean;
  successRate: number;
  failCount: number;
};

type ProxiesClientProps = {
  initialProxies: ProxyRow[];
};

export function ProxiesClient({ initialProxies }: ProxiesClientProps) {
  const router = useRouter();
  const { showToast, Toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [proxyList, setProxyList] = useState("192.168.1.10:1080\n10.0.0.15:8080");

  const activeCount = initialProxies.filter((proxy) => proxy.isActive).length;
  const avgSuccess = initialProxies.length
    ? Math.round(initialProxies.reduce((acc, proxy) => acc + (proxy.successRate || 0), 0) / initialProxies.length)
    : 0;

  async function handleTestAll() {
    setLoading("test");
    try {
      const data = await parseJsonResponse(await fetch("/api/proxies/test-all", { method: "POST" }));
      showToast(data.message ?? "Proxy test complete", "success");
      router.refresh();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Test failed", "error");
    } finally {
      setLoading(null);
    }
  }

  async function handleAddProxies(event: React.FormEvent) {
    event.preventDefault();
    setLoading("add");

    try {
      const data = await parseJsonResponse(
        await fetch("/api/proxies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ list: proxyList }),
        }),
      );
      showToast(data.message ?? "Proxies added", "success");
      setShowAdd(false);
      router.refresh();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Add failed", "error");
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
            <h1 className="text-2xl font-bold text-white tracking-tight">Proxy Management</h1>
            <p className="text-zinc-400 mt-1">Network rotation, health tracking, and protocol settings.</p>
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleTestAll}
              disabled={loading === "test"}
              className="flex items-center space-x-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-zinc-700"
            >
              <RefreshCw className={`h-4 w-4 ${loading === "test" ? "animate-spin" : ""}`} />
              <span>{loading === "test" ? "Testing..." : "Test All"}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Proxy List</span>
            </button>
          </div>
        </div>

        {showAdd && (
          <form onSubmit={handleAddProxies} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <h3 className="text-white font-medium">Add Proxy List</h3>
            <p className="text-sm text-zinc-500">One proxy per line as address:port</p>
            <textarea
              value={proxyList}
              onChange={(event) => setProxyList(event.target.value)}
              rows={5}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm font-mono"
            />
            <div className="flex gap-2">
              <button type="submit" disabled={loading === "add"} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm">
                {loading === "add" ? "Adding..." : "Add Proxies"}
              </button>
              <button type="button" onClick={() => setShowAdd(false)} className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm">
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-400">Total Proxies</p>
                <p className="text-2xl font-bold text-white mt-1">{initialProxies.length}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Server className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-400">Active / Healthy</p>
                <p className="text-2xl font-bold text-white mt-1">{activeCount}</p>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                <Shield className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-400">Avg Success Rate</p>
                <p className="text-2xl font-bold text-white mt-1">{avgSuccess}%</p>
              </div>
              <div className="p-3 bg-indigo-500/10 rounded-lg">
                <RefreshCw className="h-6 w-6 text-indigo-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400">
              <thead className="text-xs uppercase bg-zinc-950/50 text-zinc-500 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Protocol</th>
                  <th className="px-6 py-4 font-medium">Address:Port</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Success Rate</th>
                  <th className="px-6 py-4 font-medium">Failures</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {initialProxies.map((proxy) => (
                  <tr key={proxy.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-300 uppercase">{proxy.protocol}</td>
                    <td className="px-6 py-4 font-mono text-zinc-300">{proxy.address}:{proxy.port}</td>
                    <td className="px-6 py-4">
                      {proxy.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                          Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400">
                          Dead
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-zinc-800 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${(proxy.successRate || 0) > 80 ? "bg-emerald-500" : (proxy.successRate || 0) > 40 ? "bg-amber-500" : "bg-red-500"}`}
                            style={{ width: `${proxy.successRate || 0}%` }}
                          />
                        </div>
                        <span className="text-xs">{proxy.successRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{proxy.failCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
