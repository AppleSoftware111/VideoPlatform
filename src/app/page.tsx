import { connectDB } from "@/db";
import { Account, Proxy, Task, Log } from "@/db/schema";
import { Activity, Users, Shield, Zap, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  await connectDB();

  const [accountsCount, activeProxies, runningTasks, totalViews, recentLogs] = await Promise.all([
    Account.countDocuments(),
    Proxy.countDocuments({ isActive: true }),
    Task.countDocuments({ status: "running" }),
    Task.aggregate<{ total: number }>([
      { $match: { type: "view" } },
      { $group: { _id: null, total: { $sum: "$currentCount" } } },
    ]),
    Log.aggregate<{
      _id: string;
      message: string;
      level: string;
      createdAt: Date;
      account?: string;
    }>([
      { $sort: { createdAt: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "accounts",
          localField: "accountId",
          foreignField: "_id",
          as: "accountDoc",
        },
      },
      {
        $project: {
          message: 1,
          level: 1,
          createdAt: 1,
          account: { $arrayElemAt: ["$accountDoc.username", 0] },
        },
      },
    ]),
  ]);

  const stats = [
    { name: "Active Accounts", value: accountsCount, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
    { name: "Healthy Proxies", value: activeProxies, icon: Shield, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { name: "Running Workflows", value: runningTasks, icon: Zap, color: "text-amber-400", bg: "bg-amber-400/10" },
    { name: "Total Views Delivered", value: totalViews[0]?.total ?? 0, icon: TrendingUp, color: "text-indigo-400", bg: "bg-indigo-400/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System Overview</h1>
        <p className="text-zinc-400 mt-1">Real-time performance metrics and execution status.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-zinc-400">{stat.name}</p>
                <p className="text-2xl font-semibold text-white mt-1">{stat.value ? stat.value.toLocaleString() : 0}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-medium text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentLogs.map((log) => (
              <div key={log._id.toString()} className="flex items-start space-x-3">
                {log.level === "INFO" && <Activity className="h-5 w-5 text-blue-400 mt-0.5" />}
                {log.level === "WARNING" && <XCircle className="h-5 w-5 text-amber-400 mt-0.5" />}
                {log.level === "ERROR" && <XCircle className="h-5 w-5 text-red-400 mt-0.5" />}
                {log.level === "DEBUG" && <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5" />}
                <div>
                  <p className="text-sm text-zinc-300">
                    <span className="font-medium text-indigo-400">[{log.account || "System"}]</span> {log.message}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {log.createdAt ? formatDistanceToNow(new Date(log.createdAt), { addSuffix: true }) : ""}
                  </p>
                </div>
              </div>
            ))}
            {recentLogs.length === 0 && (
              <p className="text-zinc-500 text-sm">No recent activity.</p>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-medium text-white mb-4">System Health</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-zinc-300">Browser Automation Cluster</span>
                <span className="text-sm font-medium text-emerald-400">98%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "98%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-zinc-300">Proxy Rotation Engine</span>
                <span className="text-sm font-medium text-amber-400">85%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: "85%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-zinc-300">Database & Queue</span>
                <span className="text-sm font-medium text-emerald-400">100%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "100%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
