import { tryConnectDB } from "@/db";
import { Proxy } from "@/db/schema";
import { DbSetupBanner } from "@/components/DbSetupBanner";
import { ProxiesClient } from "@/components/ProxiesClient";

export const dynamic = "force-dynamic";

export default async function ProxiesPage() {
  const db = await tryConnectDB();

  if (!db.ok) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Proxy Management</h1>
          <p className="text-zinc-400 mt-1">Network rotation, health tracking, and protocol settings.</p>
        </div>
        <DbSetupBanner error={db.error} />
      </div>
    );
  }

  const allProxies = await Proxy.find().sort({ createdAt: 1 }).lean();

  return (
    <ProxiesClient
      initialProxies={allProxies.map((proxy) => ({
        id: proxy._id.toString(),
        protocol: proxy.protocol ?? "http",
        address: proxy.address,
        port: proxy.port,
        isActive: proxy.isActive ?? false,
        successRate: proxy.successRate ?? 0,
        failCount: proxy.failCount ?? 0,
      }))}
    />
  );
}
