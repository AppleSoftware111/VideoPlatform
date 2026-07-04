import { tryConnectDB } from "@/db";
import { Account } from "@/db/schema";
import { DbSetupBanner } from "@/components/DbSetupBanner";
import { AccountsClient } from "@/components/AccountsClient";

export const dynamic = "force-dynamic";

export default async function AccountsPage() {
  const db = await tryConnectDB();

  if (!db.ok) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Account Management</h1>
          <p className="text-zinc-400 mt-1">Manage automated accounts and their health scores.</p>
        </div>
        <DbSetupBanner error={db.error} />
      </div>
    );
  }

  const allAccounts = await Account.find().sort({ createdAt: 1 }).lean();

  return (
    <AccountsClient
      initialAccounts={allAccounts.map((account) => ({
        id: account._id.toString(),
        username: account.username,
        status: account.status ?? "pending",
        healthScore: account.healthScore ?? 0,
        lastUsedAt: account.lastUsedAt?.toISOString() ?? null,
      }))}
    />
  );
}
