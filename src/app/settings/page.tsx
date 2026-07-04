import { Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System Settings</h1>
        <p className="text-zinc-400 mt-1">Configure global automation parameters and backend connections.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-lg font-medium text-white">Browser Automation Defaults</h2>
          <p className="text-sm text-zinc-400 mt-1">Configure headless browser settings.</p>
          
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-zinc-300">Max Concurrent Browsers</label>
              <input type="number" defaultValue={10} className="mt-1 block w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300">Default View Duration (seconds)</label>
              <input type="number" defaultValue={45} className="mt-1 block w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300">Browser Mode</label>
              <select className="mt-1 block w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option>Headless (Performance)</option>
                <option>GUI (Debugging)</option>
                <option>Stealth Mode (Anti-Bot Bypass)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300">Captcha Solving API Key</label>
              <input type="password" defaultValue="********" className="mt-1 block w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-lg font-medium text-white">Network & Proxy Routing</h2>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-zinc-800 bg-zinc-950 text-indigo-600 focus:ring-indigo-500" />
              </div>
              <div className="ml-3 text-sm">
                <label className="font-medium text-zinc-300">Auto-Rotate Dead Proxies</label>
                <p className="text-zinc-500">Automatically switch accounts to a new proxy if connection fails 3 times.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-zinc-800 bg-zinc-950 text-indigo-600 focus:ring-indigo-500" />
              </div>
              <div className="ml-3 text-sm">
                <label className="font-medium text-zinc-300">DNS Leak Protection</label>
                <p className="text-zinc-500">Force all DNS requests through the SOCKS5 proxy.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-zinc-900/50 flex justify-end">
          <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Save className="h-4 w-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
}
