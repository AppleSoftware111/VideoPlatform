import { db } from "@/db";
import { logs, accounts, proxies, tasks } from "@/db/schema";
import { sql } from "drizzle-orm";
import { Activity, AlertCircle, Info, Terminal, Play } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const dynamic = 'force-dynamic';

export default async function LogsPage() {
  const allLogs = await db.select({
    id: logs.id,
    level: logs.level,
    message: logs.message,
    createdAt: logs.createdAt,
    account: accounts.username,
    proxy: proxies.address,
    task: tasks.name,
  })
  .from(logs)
  .leftJoin(accounts, sql`${logs.accountId} = ${accounts.id}`)
  .leftJoin(proxies, sql`${logs.proxyId} = ${proxies.id}`)
  .leftJoin(tasks, sql`${logs.taskId} = ${tasks.id}`)
  .orderBy(sql`${logs.createdAt} DESC`)
  .limit(100);

  return (
    <div className="space-y-6 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Execution Engine Logs</h1>
          <p className="text-zinc-400 mt-1">Live feed from headless browser instances and network proxies.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-zinc-800 text-emerald-400 px-3 py-1.5 rounded-lg text-sm font-medium border border-emerald-500/30">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>Live Sync</span>
          </button>
        </div>
      </div>

      <div className="flex-1 bg-[#0a0a0a] border border-zinc-800 rounded-xl overflow-hidden flex flex-col font-mono text-sm shadow-xl">
        <div className="bg-zinc-900 border-b border-zinc-800 p-3 flex items-center space-x-2 shrink-0">
          <Terminal className="h-4 w-4 text-zinc-500" />
          <span className="text-zinc-400 font-medium text-xs">/var/log/aetherial-engine.log</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {allLogs.map((log) => (
            <div key={log.id} className="flex items-start hover:bg-zinc-900/50 rounded px-2 py-1 transition-colors">
              <div className="shrink-0 w-24 text-zinc-600 text-xs mt-0.5">
                {new Date(log.createdAt).toLocaleTimeString()}
              </div>
              
              <div className={`shrink-0 w-20 font-bold text-xs mt-0.5 ${
                log.level === 'ERROR' ? 'text-red-500' :
                log.level === 'WARNING' ? 'text-amber-500' :
                log.level === 'DEBUG' ? 'text-purple-500' :
                'text-blue-500'
              }`}>
                [{log.level}]
              </div>
              
              <div className="flex-1 break-all text-zinc-300">
                <span className="text-zinc-500 mr-2">
                  {log.account && `[Account:${log.account}]`}
                  {log.proxy && `[Proxy:${log.proxy}]`}
                  {log.task && `[Task:${log.task}]`}
                </span>
                <span className={
                  log.level === 'ERROR' ? 'text-red-400' :
                  log.level === 'WARNING' ? 'text-amber-300' :
                  log.level === 'DEBUG' ? 'text-zinc-400' :
                  'text-zinc-200'
                }>
                  {log.message}
                </span>
              </div>
            </div>
          ))}
          {allLogs.length === 0 && (
            <div className="text-zinc-600 flex items-center p-4">
              <Play className="h-4 w-4 mr-2 animate-pulse" />
              Waiting for log stream...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
