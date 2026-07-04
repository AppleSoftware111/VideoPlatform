import { db } from "@/db";
import { accounts } from "@/db/schema";
import { Users, Search, Filter, ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const dynamic = 'force-dynamic';

export default async function AccountsPage() {
  const allAccounts = await db.select().from(accounts).orderBy(accounts.createdAt);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Account Management</h1>
          <p className="text-zinc-400 mt-1">Manage automated accounts and their health scores.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Import Accounts
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search accounts..." 
              className="bg-zinc-950 border border-zinc-800 text-sm rounded-lg pl-9 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-64"
            />
          </div>
          <button className="flex items-center space-x-2 text-zinc-400 hover:text-white px-3 py-1.5 border border-zinc-800 rounded-lg text-sm">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
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
              {allAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center font-medium text-zinc-200">
                      <Users className="h-4 w-4 mr-2 text-zinc-500" />
                      {account.username}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {account.status === 'active' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                        Active
                      </span>
                    )}
                    {account.status === 'cooldown' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400">
                        Cooldown
                      </span>
                    )}
                    {account.status === 'banned' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400">
                        Banned
                      </span>
                    )}
                    {account.status === 'pending' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-400">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="mr-2">{account.healthScore}%</span>
                      {account.healthScore && account.healthScore > 80 ? (
                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      ) : account.healthScore && account.healthScore > 40 ? (
                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                      ) : (
                        <ShieldAlert className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {account.lastUsedAt 
                      ? formatDistanceToNow(new Date(account.lastUsedAt), { addSuffix: true })
                      : 'Never'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-400 hover:text-indigo-300 font-medium">Edit</button>
                  </td>
                </tr>
              ))}
              {allAccounts.length === 0 && (
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
  );
}
