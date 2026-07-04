import { tryConnectDB } from "@/db";
import { Task } from "@/db/schema";
import { DbSetupBanner } from "@/components/DbSetupBanner";
import { TasksClient } from "@/components/TasksClient";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const db = await tryConnectDB();

  if (!db.ok) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Workflow Automation</h1>
          <p className="text-zinc-400 mt-1">Configure and manage automated execution workflows.</p>
        </div>
        <DbSetupBanner error={db.error} />
      </div>
    );
  }

  const allTasks = await Task.find().sort({ createdAt: 1 }).lean();

  return (
    <TasksClient
      initialTasks={allTasks.map((task) => ({
        id: task._id.toString(),
        name: task.name,
        type: task.type,
        targetUrl: task.targetUrl,
        desiredCount: task.desiredCount,
        currentCount: task.currentCount ?? 0,
        status: task.status ?? "pending",
      }))}
    />
  );
}
