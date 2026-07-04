import { db } from "@/db";
import { tasks } from "@/db/schema";
import { Play, Pause, Plus, MoreVertical, PlayCircle, Eye, MessageSquare, ThumbsUp, Video } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function TasksPage() {
  const allTasks = await db.select().from(tasks).orderBy(tasks.createdAt);

  const getTaskIcon = (type: string | null) => {
    switch (type) {
      case 'view': return <Eye className="h-5 w-5 text-blue-400" />;
      case 'like': return <ThumbsUp className="h-5 w-5 text-emerald-400" />;
      case 'comment': return <MessageSquare className="h-5 w-5 text-amber-400" />;
      case 'subscribe': return <Video className="h-5 w-5 text-red-400" />;
      default: return <PlayCircle className="h-5 w-5 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Workflow Automation</h1>
          <p className="text-zinc-400 mt-1">Configure and manage automated execution workflows.</p>
        </div>
        <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="h-4 w-4" />
          <span>New Workflow</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {allTasks.map((task) => (
          <div key={task.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-zinc-800 rounded-lg">
                  {getTaskIcon(task.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{task.name}</h3>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mt-0.5">{task.type} WORKFLOW</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {task.status === 'running' && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  task.status === 'running' ? 'bg-emerald-500/10 text-emerald-400' :
                  task.status === 'completed' ? 'bg-blue-500/10 text-blue-400' :
                  task.status === 'paused' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-zinc-800 text-zinc-400'
                }`}>
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
                <button className="text-zinc-500 hover:text-white p-1">
                  <MoreVertical className="h-4 w-4" />
                </button>
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
                  className={`h-2 rounded-full ${task.status === 'running' ? 'bg-indigo-500' : 'bg-zinc-500'}`}
                  style={{ width: `${Math.min(100, (task.currentCount / task.desiredCount) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="flex space-x-2 pt-4 border-t border-zinc-800">
              {task.status === 'running' ? (
                <button className="flex-1 flex items-center justify-center space-x-2 bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-zinc-700">
                  <Pause className="h-4 w-4" />
                  <span>Pause</span>
                </button>
              ) : task.status === 'completed' ? (
                 <button className="flex-1 flex items-center justify-center space-x-2 bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-zinc-700">
                 <Play className="h-4 w-4" />
                 <span>Restart</span>
               </button>
              ) : (
                <button className="flex-1 flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Play className="h-4 w-4" />
                  <span>Start Engine</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
