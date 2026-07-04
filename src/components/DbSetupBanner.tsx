import { AlertTriangle } from "lucide-react";

type DbSetupBannerProps = {
  error: string;
};

export function DbSetupBanner({ error }: DbSetupBannerProps) {
  return (
    <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
        <div className="space-y-2 text-sm">
          <p className="font-medium text-amber-200">Database not connected</p>
          <p className="text-amber-100/80">{error}</p>
          <ol className="list-decimal space-y-1 pl-4 text-amber-100/70">
            <li>Add <code className="rounded bg-zinc-900 px-1 py-0.5">MONGODB_URI</code> in Vercel → Settings → Environment Variables</li>
            <li>Allow <code className="rounded bg-zinc-900 px-1 py-0.5">0.0.0.0/0</code> in MongoDB Atlas → Network Access</li>
            <li>Redeploy, then use Settings → Seed Database or POST <code className="rounded bg-zinc-900 px-1 py-0.5">/api/seed</code></li>
          </ol>
        </div>
      </div>
    </div>
  );
}
