import { db } from "@/db";
import { proxies } from "@/db/schema";
import { Shield, Plus, RefreshCw, Server, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const dynamic = 'force-dynamic';

export default async function ProxiesPage() {
  const allProxies = await db.select().from(proxies).orderBy(proxies.createdAt);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Proxy Management</h1>
          <p className="text-zinc-400 mt-1">Network rotation, health tracking, and protocol settings.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-zinc-700">
            <RefreshCw className="h-4 w-4" />
            <span>Test All</span>
          </button>
          <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add Proxy List</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-400">Total Proxies</p>
              <p className="text-2xl font-bold text-white mt-1">{allProxies.length}</p>
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
              <p className="text-2xl font-bold text-white mt-1">{allProxies.filter(p => p.isActive).length}</p>
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
              <p className="text-2xl font-bold text-white mt-1">
                {allProxies.length ? Math.round(allProxies.reduce((acc, p) => acc + (p.successRate || 0), 0) / allProxies.length) : 0}%
              </p>
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
              {allProxies.map((proxy) => (
                <tr key={proxy.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-300 uppercase">
                    {proxy.protocol}
                  </td>
                  <td className="px-6 py-4 font-mono text-zinc-300">
                    {proxy.address}:{proxy.port}
                  </td>
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
                          className={`h-1.5 rounded-full ${(proxy.successRate || 0) > 80 ? 'bg-emerald-500' : (proxy.successRate || 0) > 40 ? 'bg-amber-500' : 'bg-red-500'}`} 
                          style={{ width: `${proxy.successRate || 0}%` }}
                        />
                      </div>
                      <span className="text-xs">{proxy.successRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {proxy.failCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
