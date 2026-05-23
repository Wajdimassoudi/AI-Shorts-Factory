import React, { useState } from "react";
import { Key, Eye, EyeOff, Save, Trash2, RefreshCw, AlertCircle, CheckCircle2, Sliders, Shield, RefreshCcw } from "lucide-react";
import { motion } from "motion/react";
import { SystemSettings } from "../types";

interface SettingsPageProps {
  settings: SystemSettings;
  onSaveSettings: (settings: Partial<SystemSettings>) => Promise<void>;
  logs: Array<{ id: string; timestamp: string; type: string; message: string }>;
  onClearLogs: () => Promise<void>;
  onSeedDemo: () => Promise<void>;
}

export default function SettingsPage({ settings, onSaveSettings, logs, onClearLogs, onSeedDemo }: SettingsPageProps) {
  // Input fields
  const [openaiApiKey, setOpenaiApiKey] = useState(settings.openaiApiKey || "");
  const [crayoApiKey, setCrayoApiKey] = useState(settings.crayoApiKey || "");
  const [veoApiKey, setVeoApiKey] = useState(settings.veoApiKey || "");
  const [youtubeApiKey, setYoutubeApiKey] = useState(settings.youtubeApiKey || "");
  const [tiktokClientKey, setTiktokClientKey] = useState(settings.tiktokClientKey || "");
  const [tiktokClientSecret, setTiktokClientSecret] = useState(settings.tiktokClientSecret || "");
  const [instagramAppId, setInstagramAppId] = useState(settings.instagramAppId || "");
  const [instagramAppSecret, setInstagramAppSecret] = useState(settings.instagramAppSecret || "");
  const [fullAutoMode, setFullAutoMode] = useState(settings.fullAutoMode || false);

  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Toggle visible passwords
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const toggleShowKey = (field: string) => {
    setShowKeys(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      await onSaveSettings({
        openaiApiKey,
        crayoApiKey,
        veoApiKey,
        youtubeApiKey,
        tiktokClientKey,
        tiktokClientSecret,
        instagramAppId,
        instagramAppSecret,
        fullAutoMode
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const triggerSeedData = async () => {
    if (confirm("Are you sure you want to seed mock demo campaigns? This will fill the pipeline with realistic completed views/earnings for testing.")) {
      setSeeding(true);
      try {
        await onSeedDemo();
      } finally {
        setSeeding(false);
      }
    }
  };

  const triggerClearLogs = async () => {
    setClearing(true);
    try {
      await onClearLogs();
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
      
      {/* LEFT COLUMN: Credentials setup (size: 7 cols) */}
      <div className="lg:col-span-7">
        <form onSubmit={handleSave} className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/5 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h2 className="text-lg font-display font-medium text-white m-0 tracking-tight flex items-center gap-2 select-none">
                <Key className="w-5 h-5 text-purple-400" /> API Credentials Registry
              </h2>
              <p className="text-xs text-gray-400 mt-1">Configure your personal third-party API tokens. Leave empty to fallback gracefully to mock simulations.</p>
            </div>

            {/* Toggle Full Auto Button style */}
            <div className="flex items-center gap-2 bg-[#111111] px-3 py-1.5 rounded-xl border border-white/5">
              <span className="text-[10px] font-mono text-gray-500 uppercase font-bold">FULL AUTO MODE</span>
              <input
                type="checkbox"
                checked={fullAutoMode}
                onChange={(e) => setFullAutoMode(e.target.checked)}
                className="w-4 h-4 cursor-pointer accent-purple-500 outline-none"
              />
            </div>
          </div>

          {saveSuccess && (
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Configurations updated and saved securely! Autopilot engine synced.</span>
            </div>
          )}

          {/* SENSITIVE KEYS LIST */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono text-purple-400 uppercase tracking-widest font-bold">Core Engines Generators</h3>

            {/* OpenAI API Key */}
            <div className="space-y-1.5">
              <label className="block text-[10px] text-gray-400 font-mono uppercase tracking-wider">OpenAI API Key (Script generation)</label>
              <div className="relative">
                <input
                  type={showKeys.openai ? "text" : "password"}
                  value={openaiApiKey}
                  onChange={(e) => setOpenaiApiKey(e.target.value)}
                  placeholder="sk-proj-••••••••••••••••"
                  className="w-full bg-[#111111] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => toggleShowKey('openai')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-white"
                >
                  {showKeys.openai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Crayo API Key */}
            <div className="space-y-1.5">
              <label className="block text-[10px] text-gray-400 font-mono uppercase tracking-wider">Crayo AI Key (Narrator/Voice generation)</label>
              <div className="relative">
                <input
                  type={showKeys.crayo ? "text" : "password"}
                  value={crayoApiKey}
                  onChange={(e) => setCrayoApiKey(e.target.value)}
                  placeholder="crayo-auth-••••••••••••••••"
                  className="w-full bg-[#111111] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => toggleShowKey('crayo')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-white"
                >
                  {showKeys.crayo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Veo API Key */}
            <div className="space-y-1.5">
              <label className="block text-[10px] text-gray-400 font-mono uppercase tracking-wider">Veo AI Key (Video render generation)</label>
              <div className="relative">
                <input
                  type={showKeys.veo ? "text" : "password"}
                  value={veoApiKey}
                  onChange={(e) => setVeoApiKey(e.target.value)}
                  placeholder="veo-api-••••••••••••••••"
                  className="w-full bg-[#111111] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => toggleShowKey('veo')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-white"
                >
                  {showKeys.veo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <h3 className="text-xs font-mono text-purple-400 uppercase tracking-widest pt-2 font-bold">Social Platforms APIs credentials</h3>

            {/* YouTube API Developer Key */}
            <div className="space-y-1.5">
              <label className="block text-[10px] text-gray-400 font-mono uppercase tracking-wider">YouTube Data Developer API credentials</label>
              <input
                type={showKeys.youtube ? "text" : "password"}
                value={youtubeApiKey}
                onChange={(e) => setYoutubeApiKey(e.target.value)}
                placeholder="AIzaSy••••••••••••••••"
                className="w-full bg-[#111111] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* TikTok Client Keys */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-[10px] text-gray-400 font-mono uppercase tracking-wider">TikTok Client Key</label>
                <input
                  type="text"
                  value={tiktokClientKey}
                  onChange={(e) => setTiktokClientKey(e.target.value)}
                  placeholder="Client Key ID"
                  className="w-full bg-[#111111] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] text-gray-400 font-mono uppercase tracking-wider">TikTok Client Secret</label>
                <input
                  type="password"
                  value={tiktokClientSecret}
                  onChange={(e) => setTiktokClientSecret(e.target.value)}
                  placeholder="Client Secret Code"
                  className="w-full bg-[#111111] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            {/* Seed Demo buttons */}
            <button
              type="button"
              onClick={triggerSeedData}
              disabled={seeding}
              className="bg-white/5 hover:bg-white/10 border border-white/5 text-purple-300 text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCcw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
              SEED DEMO WORKPLAYSTATS
            </button>

            <button
              type="submit"
              disabled={saving}
              className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-purple-600/15 disabled:bg-purple-800 flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'SAVING...' : 'SAVE CONFIGURATIONS'}
            </button>
          </div>
        </form>
      </div>

      {/* RIGHT COLUMN: Live engine audit logs console (size: 5 cols) */}
      <div className="lg:col-span-5">
        <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h3 className="text-sm font-display font-semibold text-white m-0 select-none">
                Autopilot Engine Auditor logs
              </h3>
              <p className="text-[10px] text-gray-500 mt-0.5">Auditing logs of simulated video rendering jobs and publishes.</p>
            </div>

            <button
              onClick={triggerClearLogs}
              disabled={clearing}
              className="text-[10px] text-purple-400 hover:text-red-400 font-semibold cursor-pointer tracking-wider font-mono flex items-center gap-0.5 border border-white/10 rounded px-2 py-0.5"
            >
              <Trash2 className="w-3 h-3" /> CLEAR LOGS
            </button>
          </div>

          {/* LOGS LIST TERMINAL */}
          <div className="bg-[#111111] rounded-xl p-4 border border-white/5 h-[400px] overflow-y-auto space-y-3 font-mono text-[10px]">
            {logs.length === 0 ? (
              <div className="text-gray-600 text-center py-12">No active audit logs found in state. Logs appear as automations trigger.</div>
            ) : (
              logs.map(lg => {
                let badgeColor = "text-purple-400 bg-purple-950/20 border-purple-900/30";
                if (lg.type === "engine") badgeColor = "text-fuchsia-400 bg-fuchsia-950/20 border-fuchsia-900/30";
                if (lg.type === "posting") badgeColor = "text-emerald-400 bg-emerald-950/20 border-emerald-900/30";
                if (lg.type === "ai") badgeColor = "text-amber-400 bg-amber-950/20 border-amber-900/30";

                return (
                  <div key={lg.id} className="space-y-1.5 border-b border-white/5 pb-1.5 text-left">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className={`px-1.5 py-0.5 border rounded uppercase font-bold text-[9px] ${badgeColor}`}>
                        {lg.type}
                      </span>
                      <span className="text-gray-500 text-[8px]">
                        {new Date(lg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="m-0 text-white leading-relaxed select-text">{lg.message}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
