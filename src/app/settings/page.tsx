import { isDbConfigured, tryConnectDB } from "@/db";
import { SettingsForm } from "@/components/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const configured = isDbConfigured();
  const db = configured ? await tryConnectDB() : { ok: false as const, error: "MONGODB_URI is not configured" };

  return <SettingsForm dbConnected={db.ok} dbError={db.ok ? undefined : db.error} />;
}
