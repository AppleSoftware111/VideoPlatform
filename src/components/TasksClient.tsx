"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  Pause,
  Plus,
  MoreVertical,
  PlayCircle,
  Eye,
  MessageSquare,
  ThumbsUp,
  Video,
  Trash2,
} from "lucide-react";
import { parseJsonResponse, useToast } from "@/components/useToast";

export type TaskRow = {
  id: string;
  name: string;
  type: string;
  targetUrl: string;
  desiredCount: number;
  currentCount: number;
  status: string;
};

type TasksClientProps = {
  initialTasks: TaskRow[];
};

export function TasksClient({ initialTasks }: TasksClientProps) {
  const router = useRouter();
  const { showToast, Toast } = useToast();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "view",
    targetUrl: "",
    desiredCount: "100",
  });

  function getTaskIcon(type: string) {
    switch (type) {
      case "view": return <Eye className="h-5 w-5 text-blue-400" />;
      case "like": return <ThumbsUp className="h-5 w-5 text-emerald-400" />;
      case "comment": return <MessageSquare className="h-5 w-5 text-amber-400" />;
      case "subscribe": return <Video className="h-5 w-5 text-red-400" />;
      default: return <PlayCircle className="h-5 w-5 text-zinc-400" />;
    }
  }

  async function updateTask(id: string, action: "start" | "pause" | "restart") {
    setLoadingId(id);
    try {
      await parseJsonResponse(
        await fetch(`/api/tasks/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        }),
      );
      showToast(`Task ${action}ed`, "success");
      router.refresh();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Action failed", "error");
    } finally {
      setLoadingId(null);
    }
  }

  async function deleteTask(id: string, name: string) {
    if (!window.confirm(`Delete workflow "${name}"?`)) return;

    setLoadingId(id);
    try {
      await parseJsonResponse(await fetch(`/api/tasks/${id}`, { method: "DELETE" }));
      showToast(`Deleted "${name}"`, "success");
      setMenuOpenId(null);
      router.refresh();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Delete failed", "error");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setLoadingId("create");

    try {
      await parseJsonResponse(
        await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            type: form.type,
            targetUrl: form.targetUrl,
            desiredCount: Number(form.desiredCount),
          }),
        }),
      );
      showToast("Workflow created", "success");
      setShowCreate(false);
      setForm({ name: "", type: "view", targetUrl: "", desiredCount: "100" });
      router.refresh();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Create failed", "error");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <>
      {Toast}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Workflow Automation</h1>
            <p className="text-zinc-400 mt-1">Configure and manage automated execution workflows.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Workflow</span>
          </button>
        </div>

        {showCreate && (
          <form onSubmit={handleCreate} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <h3 className="text-white font-medium">Create Workflow</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                required
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Workflow name"
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm"
              />
              <select
                value={form.type}
                onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="view">View</option>
                <option value="like">Like</option>
                <option value="comment">Comment</option>
                <option value="subscribe">Subscribe</option>
              </select>
              <input
                required
                value={form.targetUrl}
                onChange={(event) => setForm((prev) => ({ ...prev, targetUrl: event.target.value }))}
                placeholder="Target URL"
                className="md:col-span-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm"
              />
              <input
                required
                type="number"
                min={1}
                value={form.desiredCount}
                onChange={(event) => setForm((prev) => ({ ...prev, desiredCount: event.target.value }))}
                placeholder="Desired count"
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={loadingId === "create"} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm">
                {loadingId === "create" ? "Creating..." : "Create"}
              </button>
              <button type="button" onClick={() => setShowCreate(false)} className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm">
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {initialTasks.map((task) => (
            <div key={task.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-zinc-800 rounded-lg">{getTaskIcon(task.type)}</div>
                  <div>
                    <h3 className="font-semibold text-white">{task.name}</h3>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mt-0.5">{task.type} WORKFLOW</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 relative">
                  {task.status === "running" && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                  )}
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                    task.status === "running" ? "bg-emerald-500/10 text-emerald-400" :
                    task.status === "completed" ? "bg-blue-500/10 text-blue-400" :
                    task.status === "paused" ? "bg-amber-500/10 text-amber-400" :
                    "bg-zinc-800 text-zinc-400"
                  }`}>
                    {task.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => setMenuOpenId(menuOpenId === task.id ? null : task.id)}
                    className="text-zinc-500 hover:text-white p-1"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  {menuOpenId === task.id && (
                    <div className="absolute right-0 top-8 z-10 w-36 rounded-lg border border-zinc-800 bg-zinc-950 py-1 shadow-xl">
                      <button
                        type="button"
                        onClick={() => deleteTask(task.id, task.name)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-zinc-800"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-zinc-400 truncate bg-zinc-950 px-3 py-2 rounded-lg font-mono border border-zinc-800/50">
                  {task.targetUrl}
                </p>
              </div>

              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Progress</span>
                  <span className="text-zinc-300 font-medium">
                    {task.currentCount.toLocaleString()} / {task.desiredCount.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${task.status === "running" ? "bg-indigo-500" : "bg-zinc-500"}`}
                    style={{ width: `${Math.min(100, (task.currentCount / task.desiredCount) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-4 border-t border-zinc-800">
                {task.status === "running" ? (
                  <button
                    type="button"
                    onClick={() => updateTask(task.id, "pause")}
                    disabled={loadingId === task.id}
                    className="flex-1 flex items-center justify-center space-x-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-60 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-zinc-700"
                  >
                    <Pause className="h-4 w-4" />
                    <span>{loadingId === task.id ? "..." : "Pause"}</span>
                  </button>
                ) : task.status === "completed" ? (
                  <button
                    type="button"
                    onClick={() => updateTask(task.id, "restart")}
                    disabled={loadingId === task.id}
                    className="flex-1 flex items-center justify-center space-x-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-60 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-zinc-700"
                  >
                    <Play className="h-4 w-4" />
                    <span>{loadingId === task.id ? "..." : "Restart"}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => updateTask(task.id, "start")}
                    disabled={loadingId === task.id}
                    className="flex-1 flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Play className="h-4 w-4" />
                    <span>{loadingId === task.id ? "..." : "Start Engine"}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
