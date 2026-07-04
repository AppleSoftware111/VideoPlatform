import { tryConnectDB } from "@/db";
import { Log } from "@/db/schema";
import { DbSetupBanner } from "@/components/DbSetupBanner";
import { LogsClient } from "@/components/LogsClient";

export const dynamic = "force-dynamic";

export default async function LogsPage() {
  const db = await tryConnectDB();

  if (!db.ok) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Execution Engine Logs</h1>
          <p className="text-zinc-400 mt-1">Live feed from headless browser instances and network proxies.</p>
        </div>
        <DbSetupBanner error={db.error} />
      </div>
    );
  }

  const allLogs = await Log.aggregate<{
    _id: string;
    level: string;
    message: string;
    createdAt: Date;
    account?: string;
    proxy?: string;
    task?: string;
  }>([
    { $sort: { createdAt: -1 } },
    { $limit: 100 },
    {
      $lookup: {
        from: "accounts",
        localField: "accountId",
        foreignField: "_id",
        as: "accountDoc",
      },
    },
    {
      $lookup: {
        from: "proxies",
        localField: "proxyId",
        foreignField: "_id",
        as: "proxyDoc",
      },
    },
    {
      $lookup: {
        from: "tasks",
        localField: "taskId",
        foreignField: "_id",
        as: "taskDoc",
      },
    },
    {
      $project: {
        level: 1,
        message: 1,
        createdAt: 1,
        account: { $arrayElemAt: ["$accountDoc.username", 0] },
        proxy: { $arrayElemAt: ["$proxyDoc.address", 0] },
        task: { $arrayElemAt: ["$taskDoc.name", 0] },
      },
    },
  ]);

  return (
    <LogsClient
      initialLogs={allLogs.map((log) => ({
        id: log._id.toString(),
        level: log.level,
        message: log.message,
        createdAt: log.createdAt.toISOString(),
        account: log.account,
        proxy: log.proxy,
        task: log.task,
      }))}
    />
  );
}
