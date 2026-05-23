import React, { useState, useEffect } from "react";
import { Sparkles, Compass, Film, Award, LayoutDashboard, Calendar, Key, AlertCircle, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Niche, VideoProject, SystemSettings } from "./types";
import LoginView from "./components/LoginView";
import StatsOverview from "./components/StatsOverview";
import NicheManager from "./components/NicheManager";
import VideoPipeline from "./components/VideoPipeline";
import AutoPostingQueue from "./components/AutoPostingQueue";
import AffiliateTracker from "./components/AffiliateTracker";
import SettingsPage from "./components/SettingsPage";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("performance");

  // Shared application resource states
  const [stats, setStats] = useState({
    generatedToday: 0,
    scheduled: 0,
    published: 0,
    totalViews: 0,
    totalClicks: 0,
    totalConversions: 0,
    totalRevenue: 0,
    estimatedRPM: 0.0,
    fullAutoMode: false
  });
  
  const [niches, setNiches] = useState<Niche[]>([]);
  const [videos, setVideos] = useState<VideoProject[]>([]);
  const [settings, setSettings] = useState<SystemSettings>({
    openaiApiKey: "",
    crayoApiKey: "",
    veoApiKey: "",
    youtubeApiKey: "",
    tiktokClientKey: "",
    tiktokClientSecret: "",
    instagramAppId: "",
    instagramAppSecret: "",
    fullAutoMode: false,
  });
  const [logs, setLogs] = useState<any[]>([]);
  const [globalLoading, setGlobalLoading] = useState<boolean>(false);

  // Authentication validation on boot
  useEffect(() => {
    const token = localStorage.getItem("shorts_admin_token");
    if (!token) {
      setAuthLoading(false);
      return;
    }

    fetch("/api/auth/verify", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setIsAuthenticated(true);
          loadEntireDashboard(token);
        } else {
          localStorage.removeItem("shorts_admin_token");
        }
      })
      .catch(() => {})
      .finally(() => setAuthLoading(false));
  }, []);

  // Poll statistics & campaign queue progress every 6 seconds to capture live autopilot simulation frames
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      const token = localStorage.getItem("shorts_admin_token");
      if (token) {
        syncMetricsAndPipeline(token);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const loadEntireDashboard = async (token: string) => {
    setGlobalLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // Load everything from express server endpoints in parallel
      const [resStats, resNiches, resVideos, resSettings, resLogs] = await Promise.all([
        fetch("/api/dashboard/stats", { headers }),
        fetch("/api/niches", { headers }),
        fetch("/api/videos", { headers }),
        fetch("/api/settings", { headers }),
        fetch("/api/logs", { headers })
      ]);

      const [dataStats, dataNiches, dataVideos, dataSettings, dataLogs] = await Promise.all([
        resStats.json(),
        resNiches.json(),
        resVideos.json(),
        resSettings.json(),
        resLogs.json()
      ]);

      setStats(dataStats);
      setNiches(dataNiches);
      setVideos(dataVideos);
      setSettings(dataSettings);
      setLogs(dataLogs);
    } catch (err) {
      console.error("Dashboard synchronization failure:", err);
    } finally {
      setGlobalLoading(false);
    }
  };

  const syncMetricsAndPipeline = async (token: string) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [resStats, resVideos, resLogs] = await Promise.all([
        fetch("/api/dashboard/stats", { headers }),
        fetch("/api/videos", { headers }),
        fetch("/api/logs", { headers })
      ]);
      const dataStats = await resStats.json();
      const dataVideos = await resVideos.json();
      const dataLogs = await resLogs.json();

      setStats(dataStats);
      setVideos(dataVideos);
      setLogs(dataLogs);
    } catch (err) {
      console.error("Autopilot dashboard update failure:", err);
    }
  };

  // Auth unlock callback
  const handleLoginSuccess = (token: string) => {
    setIsAuthenticated(true);
    loadEntireDashboard(token);
  };

  const handleLogout = () => {
    localStorage.removeItem("shorts_admin_token");
    setIsAuthenticated(false);
  };

  // --- CONTROLLER HANDLERS FOR INDIVIDUAL TABS API INTERFACES ---

  const getTokenHeader = () => {
    const token = localStorage.getItem("shorts_admin_token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    };
  };

  const handleCreateNiche = async (newNiche: Omit<Niche, 'id'>) => {
    try {
      const res = await fetch("/api/niches", {
        method: "POST",
        headers: getTokenHeader(),
        body: JSON.stringify(newNiche)
      });
      if (res.ok) {
        const token = localStorage.getItem("shorts_admin_token")!;
        await loadEntireDashboard(token);
      }
    } catch (err) {
      alert("Error adding niche parameters.");
    }
  };

  const handleUpdateNiche = async (id: string, updated: Partial<Niche>) => {
    try {
      const res = await fetch(`/api/niches/${id}`, {
        method: "PUT",
        headers: getTokenHeader(),
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        const token = localStorage.getItem("shorts_admin_token")!;
        await loadEntireDashboard(token);
      }
    } catch (err) {
      alert("Error saving custom niche details.");
    }
  };

  const handleDeleteNiche = async (id: string) => {
    if (!confirm("Are you sure you want to delete this niche category? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/niches/${id}`, {
        method: "DELETE",
        headers: getTokenHeader()
      });
      if (res.ok) {
        const token = localStorage.getItem("shorts_admin_token")!;
        await loadEntireDashboard(token);
      }
    } catch (err) {
      alert("Error removing niche.");
    }
  };

  const handleCreateVideo = async (newVideo: any) => {
    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: getTokenHeader(),
        body: JSON.stringify(newVideo)
      });
      if (res.ok) {
        const token = localStorage.getItem("shorts_admin_token")!;
        await loadEntireDashboard(token);
      }
    } catch (err) {
      alert("Error drafting new campaign idea.");
    }
  };

  const handleTriggerScript = async (id: string) => {
    try {
      const res = await fetch(`/api/videos/${id}/generate-script`, {
        method: "POST",
        headers: getTokenHeader()
      });
      if (res.ok) {
        const token = localStorage.getItem("shorts_admin_token")!;
        await syncMetricsAndPipeline(token);
      }
    } catch (err) {
      alert("AI Script rendering failed.");
    }
  };

  const handleSimulateStep = async (id: string, targetStatus: any) => {
    try {
      const res = await fetch(`/api/videos/${id}/simulate-generation`, {
        method: "POST",
        headers: getTokenHeader(),
        body: JSON.stringify({ targetStatus })
      });
      if (res.ok) {
        const token = localStorage.getItem("shorts_admin_token")!;
        await syncMetricsAndPipeline(token);
      }
    } catch (err) {
      alert("Error rendering video asset details.");
    }
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      const res = await fetch(`/api/videos/${id}`, {
        method: "DELETE",
        headers: getTokenHeader()
      });
      if (res.ok) {
        const token = localStorage.getItem("shorts_admin_token")!;
        await syncMetricsAndPipeline(token);
      }
    } catch (err) {
      alert("Error deleting video project.");
    }
  };

  const handleSaveSettings = async (updatedSettings: Partial<SystemSettings>) => {
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: getTokenHeader(),
        body: JSON.stringify(updatedSettings)
      });
      if (res.ok) {
        const token = localStorage.getItem("shorts_admin_token")!;
        await loadEntireDashboard(token);
      }
    } catch (err) {
      alert("Error securing API settings profile.");
    }
  };

  const handleClearLogs = async () => {
    try {
      const res = await fetch("/api/logs/clear", {
        method: "POST",
        headers: getTokenHeader()
      });
      if (res.ok) {
        setLogs([]);
      }
    } catch (err) {
      alert("Error purging terminal activity logs.");
    }
  };

  const handleSeedDemo = async () => {
    try {
      const res = await fetch("/api/system/seed-demo", {
        method: "POST",
        headers: getTokenHeader()
      });
      if (res.ok) {
        const token = localStorage.getItem("shorts_admin_token")!;
        await loadEntireDashboard(token);
      }
    } catch (err) {
      alert("Error installing mock demographics states.");
    }
  };

  const handleManualPublish = async (id: string) => {
    await handleSimulateStep(id, 'Publish');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center font-mono text-purple-400">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest animate-pulse">Initializing Shorts Factory Engine...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col sm:flex-row relative text-[#E0E0E0] font-sans">
      
      {/* SIDEBAR NAVIGATION GRID */}
      <aside className="w-full sm:w-64 shrink-0 bg-[#0A0A0A] border-b sm:border-b-0 sm:border-r border-purple-900/30 p-6 flex flex-col justify-between relative z-10">
        <div className="space-y-8 flex flex-col">
          
          {/* Logo Title Group */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)] shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-md font-display font-bold text-white tracking-tight m-0 uppercase">
                SHORTS <span className="text-purple-400">FACTORY</span>
              </h1>
              <span className="text-[9px] font-mono tracking-wider text-purple-400/40 uppercase block">
                Personal Autopilot v1.0
              </span>
            </div>
          </div>

          {/* Navigation Controls */}
          <nav className="flex flex-row sm:flex-col gap-1 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
            
            {/* Dashboard Tab */}
            <button
              onClick={() => setActiveTab("performance")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs tracking-wide transition select-none cursor-pointer w-full text-left ${activeTab === "performance" ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20 font-medium' : 'text-gray-400 hover:bg-white/5 border border-transparent'}`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </button>

            {/* Campaign Categories */}
            <button
              onClick={() => setActiveTab("campaigns")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs tracking-wide transition select-none cursor-pointer w-full text-left ${activeTab === "campaigns" ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20 font-medium' : 'text-gray-400 hover:bg-white/5 border border-transparent'}`}
            >
              <Compass className="w-4 h-4 shrink-0" />
              <span>Niches & Prompts</span>
            </button>

            {/* Automation Pipeline */}
            <button
              onClick={() => setActiveTab("workflow")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs tracking-wide transition select-none cursor-pointer w-full text-left ${activeTab === "workflow" ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20 font-medium' : 'text-gray-400 hover:bg-white/5 border border-transparent'}`}
            >
              <Film className="w-4 h-4 shrink-0" />
              <span>Video Pipeline</span>
            </button>

            {/* Social Post Queue */}
            <button
              onClick={() => setActiveTab("posting")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs tracking-wide transition select-none cursor-pointer w-full text-left ${activeTab === "posting" ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20 font-medium' : 'text-gray-400 hover:bg-white/5 border border-transparent'}`}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Publish Queue</span>
            </button>

            {/* Affiliations stats */}
            <button
              onClick={() => setActiveTab("affiliate")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs tracking-wide transition select-none cursor-pointer w-full text-left ${activeTab === "affiliate" ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20 font-medium' : 'text-gray-400 hover:bg-white/5 border border-transparent'}`}
            >
              <Award className="w-4 h-4 shrink-0" />
              <span>Affiliate Track</span>
            </button>

            {/* API Keys Profile */}
            <button
              onClick={() => setActiveTab("secrets")}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs tracking-wide transition select-none cursor-pointer w-full text-left ${activeTab === "secrets" ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20 font-medium' : 'text-gray-400 hover:bg-white/5 border border-transparent'}`}
            >
              <Key className="w-4 h-4 shrink-0" />
              <span>Settings Profile</span>
            </button>

          </nav>
        </div>

        {/* Full Auto quick stats indicator inside sidebar */}
        <div className="mt-8 hidden sm:block">
          <div className="p-4 rounded-xl border border-purple-500/30 bg-[#111111]/90">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-purple-400 tracking-wider uppercase">Auto Mode</span>
              <div className={`w-8 h-4 rounded-full relative p-0.5 transition-colors duration-200 cursor-pointer ${stats.fullAutoMode ? 'bg-purple-600' : 'bg-gray-800'}`}>
                <div className={`w-3 h-3 bg-white rounded-full transition-transform duration-200 ${stats.fullAutoMode ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </div>
            <p className="text-[10px] text-gray-500 m-0 leading-normal font-mono">System status: {stats.fullAutoMode ? 'AUTOMATED RUNNING' : 'MANUAL'}</p>
          </div>
        </div>

        {/* Bottom admin profiles log out action */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-6 sm:mt-auto pb-1 px-1">
          <div className="text-left">
            <span className="block text-[10px] font-mono text-purple-400 font-bold tracking-widest leading-none">SYS_ADMIN</span>
            <span className="text-[9px] text-gray-500 block mt-1 font-mono">Status: Connected</span>
          </div>

          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-400 p-1.5 rounded transition cursor-pointer bg-transparent"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* PRIMARY CONSOLE FRAMEPORT */}
      <main className="flex-1 flex flex-col min-h-screen bg-[#050505] relative z-10 w-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 md:px-8 bg-[#070707]/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono font-semibold text-gray-500 bg-white/5 px-2.5 py-1 rounded select-none">API: ONLINE</span>
            <span className="text-[10px] font-mono font-semibold text-emerald-500 flex items-center gap-1.5 select-none animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> WORKER ACTIVE
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab("secrets")}
              className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[11px] font-mono font-medium text-gray-300 hover:bg-white/10 transition-colors cursor-pointer"
            >
              System Keys
            </button>
            <div className="w-8 h-8 rounded-full border border-purple-500/50 p-0.5 shrink-0 select-none">
              <div className="w-full h-full rounded-full bg-[#1A1A1A] flex items-center justify-center text-[10px] font-mono font-bold text-purple-400 border border-white/5">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable View Containment */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
          <AnimatePresence mode="wait">
          {activeTab === "performance" && (
            <motion.div
              key="performance-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <StatsOverview
                stats={stats}
                loading={globalLoading}
                triggerRefresh={() => {
                  const token = localStorage.getItem("shorts_admin_token")!;
                  loadEntireDashboard(token);
                }}
              />
            </motion.div>
          )}

          {activeTab === "campaigns" && (
            <motion.div
              key="campaigns-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <NicheManager
                niches={niches}
                onCreateNiche={handleCreateNiche}
                onUpdateNiche={handleUpdateNiche}
                onDeleteNiche={handleDeleteNiche}
              />
            </motion.div>
          )}

          {activeTab === "workflow" && (
            <motion.div
              key="workflow-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <VideoPipeline
                videos={videos}
                niches={niches}
                onCreateVideo={handleCreateVideo}
                onTriggerScript={handleTriggerScript}
                onSimulateStep={handleSimulateStep}
                onDeleteVideo={handleDeleteVideo}
              />
            </motion.div>
          )}

          {activeTab === "posting" && (
            <motion.div
              key="posting-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <AutoPostingQueue
                videos={videos}
                onPublishVideoNow={handleManualPublish}
                onRetryVideoNow={handleManualPublish}
              />
            </motion.div>
          )}

          {activeTab === "affiliate" && (
            <motion.div
              key="affiliate-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <AffiliateTracker niches={niches} videos={videos} />
            </motion.div>
          )}

          {activeTab === "secrets" && (
            <motion.div
              key="secrets-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <SettingsPage
                settings={settings}
                onSaveSettings={handleSaveSettings}
                logs={logs}
                onClearLogs={handleClearLogs}
                onSeedDemo={handleSeedDemo}
              />
            </motion.div>
          )}
        </AnimatePresence>
        </div>

        {/* System Overlay Status Footer */}
        <footer className="mt-auto h-8 bg-black/95 border-t border-white/5 flex items-center justify-between px-6 shrink-0 select-none">
          <div className="flex gap-4">
            <span className="text-[9px] font-mono text-gray-600">Uptime: 14d 2h 44m</span>
            <span className="text-[9px] font-mono text-gray-600">CPU: 12%</span>
            <span className="text-[9px] font-mono text-gray-600 font-medium">RAM: 2.1GB / 8GB</span>
          </div>
          <div className="flex gap-4">
            <span className="text-[9px] font-mono text-gray-600 tracking-widest uppercase">v2.0.4-STABLE</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

