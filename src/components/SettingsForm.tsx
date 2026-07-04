"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { SeedDatabaseButton } from "@/components/SeedDatabaseButton";
import { useToast } from "@/components/useToast";

type SettingsFormProps = {
  dbConnected: boolean;
  dbError?: string;
};

type SettingsData = {
  maxBrowsers: number;
  viewDuration: number;
  browserMode: string;
  captchaKey: string;
  autoRotateProxies: boolean;
  dnsLeakProtection: boolean;
};

const STORAGE_KEY = "aetherial-settings";

const defaultSettings: SettingsData = {
  maxBrowsers: 10,
  viewDuration: 45,
  browserMode: "Headless (Performance)",
  captchaKey: "",
  autoRotateProxies: true,
  dnsLeakProtection: true,
};

export function SettingsForm({ dbConnected, dbError }: SettingsFormProps) {
  const { showToast, Toast } = useToast();
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      } catch {
        // ignore invalid stored settings
      }
    }
  }, []);

  function handleSave() {
    setSaving(true);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    window.setTimeout(() => {
      setSaving(false);
      showToast("Configuration saved locally", "success");
    }, 400);
  }

  return (
    <>
      {Toast}
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Settings</h1>
          <p className="text-zinc-400 mt-1">Configure global automation parameters and backend connections.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-lg font-medium text-white">Database</h2>
            <p className="text-sm text-zinc-400 mt-1">MongoDB connection status and demo data.</p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <span className={`inline-flex h-2.5 w-2.5 rounded-full ${dbConnected ? "bg-emerald-500" : "bg-red-500"}`} />
                <span className={dbConnected ? "text-emerald-400" : "text-red-400"}>
                  {dbConnected ? "Connected" : "Not connected"}
                </span>
              </div>
              {!dbConnected && dbError && <p className="text-sm text-zinc-500">{dbError}</p>}
              <SeedDatabaseButton />
            </div>
          </div>

          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-lg font-medium text-white">Browser Automation Defaults</h2>
            <p className="text-sm text-zinc-400 mt-1">Configure headless browser settings.</p>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-zinc-300">Max Concurrent Browsers</label>
                <input
                  type="number"
                  value={settings.maxBrowsers}
                  onChange={(event) => setSettings((prev) => ({ ...prev, maxBrowsers: Number(event.target.value) }))}
                  className="mt-1 block w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300">Default View Duration (seconds)</label>
                <input
                  type="number"
                  value={settings.viewDuration}
                  onChange={(event) => setSettings((prev) => ({ ...prev, viewDuration: Number(event.target.value) }))}
                  className="mt-1 block w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300">Browser Mode</label>
                <select
                  value={settings.browserMode}
                  onChange={(event) => setSettings((prev) => ({ ...prev, browserMode: event.target.value }))}
                  className="mt-1 block w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option>Headless (Performance)</option>
                  <option>GUI (Debugging)</option>
                  <option>Stealth Mode (Anti-Bot Bypass)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300">Captcha Solving API Key</label>
                <input
                  type="password"
                  value={settings.captchaKey}
                  onChange={(event) => setSettings((prev) => ({ ...prev, captchaKey: event.target.value }))}
                  placeholder="Enter API key"
                  className="mt-1 block w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-lg font-medium text-white">Network & Proxy Routing</h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    type="checkbox"
                    checked={settings.autoRotateProxies}
                    onChange={(event) => setSettings((prev) => ({ ...prev, autoRotateProxies: event.target.checked }))}
                    className="h-4 w-4 rounded border-zinc-800 bg-zinc-950 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-zinc-300">Auto-Rotate Dead Proxies</label>
                  <p className="text-zinc-500">Automatically switch accounts to a new proxy if connection fails 3 times.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    type="checkbox"
                    checked={settings.dnsLeakProtection}
                    onChange={(event) => setSettings((prev) => ({ ...prev, dnsLeakProtection: event.target.checked }))}
                    className="h-4 w-4 rounded border-zinc-800 bg-zinc-950 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-zinc-300">DNS Leak Protection</label>
                  <p className="text-zinc-500">Force all DNS requests through the SOCKS5 proxy.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-zinc-900/50 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? "Saving..." : "Save Configuration"}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
