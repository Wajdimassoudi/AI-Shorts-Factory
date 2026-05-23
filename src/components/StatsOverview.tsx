import React from "react";
import { Eye, Calendar, Film, DollarSign, MousePointerClick, TrendingUp, Sparkles, Youtube, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

interface StatsOverviewProps {
  stats: {
    generatedToday: number;
    scheduled: number;
    published: number;
    totalViews: number;
    totalClicks: number;
    totalConversions: number;
    totalRevenue: number;
    estimatedRPM: number;
    fullAutoMode: boolean;
  };
  triggerRefresh: () => void;
  loading: boolean;
}

export default function StatsOverview({ stats, triggerRefresh, loading }: StatsOverviewProps) {
  // Conversion rate ratio
  const ctaCTR = stats.totalViews > 0 ? ((stats.totalClicks / stats.totalViews) * 100).toFixed(2) : "0.00";
  const clickToSaleConv = stats.totalClicks > 0 ? ((stats.totalConversions / stats.totalClicks) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-6">
      {/* Header action bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-medium text-white m-0 tracking-tight">
            Performance Registry
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Realtime cross-platform content and affiliate statistics.
          </p>
        </div>

        <button
          onClick={triggerRefresh}
          disabled={loading}
          id="refresh-stats-btn"
          className="flex items-center gap-2 bg-[#12072b] border border-purple-900/50 hover:border-purple-500/50 text-purple-300 hover:text-white px-3.5 py-1.5 rounded-lg text-xs font-mono transition duration-150 disabled:opacity-40 select-none cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'SYNCING...' : 'SYNC STATS'}
        </button>
      </div>

      {/* Main Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* STAT 1: VIEWS */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-5 rounded-2xl bg-[#111111] border border-white/5 relative overflow-hidden group shadow-lg"
          id="stat-views-card"
        >
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition duration-300">
            <Eye className="w-16 h-16 text-purple-400" />
          </div>
          <p className="text-xs font-mono text-gray-500 font-medium tracking-wider uppercase m-0">Total Views</p>
          <h3 className="text-3xl font-display font-bold text-white mt-1.5 mb-1 font-sans">
            {stats.totalViews.toLocaleString()}
          </h3>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-purple-400 font-mono font-medium">
              +{(stats.generatedToday * 1234).toLocaleString()} today
            </span>
          </div>
        </motion.div>

        {/* STAT 2: REVENUE */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-5 rounded-2xl bg-[#111111] border border-white/5 relative overflow-hidden group shadow-lg"
          id="stat-revenue-card"
        >
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition duration-300">
            <DollarSign className="w-16 h-16 text-emerald-400" />
          </div>
          <p className="text-xs font-mono text-gray-500 font-medium tracking-wider uppercase m-0">Est. Earnings</p>
          <h3 className="text-3xl font-display font-bold text-white mt-1.5 mb-1 font-sans">
            ${stats.totalRevenue.toLocaleString()}
          </h3>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-medium">
              RPM: ${stats.estimatedRPM.toFixed(2)}
            </span>
          </div>
        </motion.div>

        {/* STAT 3: AFFILIATE CLICKS */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-5 rounded-2xl bg-[#111111] border border-white/5 relative overflow-hidden group shadow-lg"
          id="stat-clicks-card"
        >
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition duration-300">
            <MousePointerClick className="w-16 h-16 text-fuchsia-400" />
          </div>
          <p className="text-xs font-mono text-gray-500 font-medium tracking-wider uppercase m-0">Affiliate Clicks</p>
          <h3 className="text-3xl font-display font-bold text-white mt-1.5 mb-1 font-sans">
            {stats.totalClicks.toLocaleString()}
          </h3>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-fuchsia-500/10 text-fuchsia-400 font-mono font-medium">
              CTR: {ctaCTR}%
            </span>
          </div>
        </motion.div>

        {/* STAT 4: CONVERSIONS */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-5 rounded-2xl bg-[#111111] border border-white/5 relative overflow-hidden group shadow-lg"
          id="stat-conversions-card"
        >
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition duration-300">
            <TrendingUp className="w-16 h-16 text-cyan-400" />
          </div>
          <p className="text-xs font-mono text-gray-500 font-medium tracking-wider uppercase m-0">Conversions</p>
          <h3 className="text-3xl font-display font-bold text-white mt-1.5 mb-1 font-sans">
            {stats.totalConversions.toLocaleString()}
          </h3>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono font-medium">
              Conv. Rate: {clickToSaleConv}%
            </span>
          </div>
        </motion.div>

      </div>

      {/* Production pipeline quick statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Videos Generated Today */}
        <div className="p-4 rounded-xl bg-[#111111] border border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
            <Film className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-[10px] text-gray-505 uppercase font-mono tracking-wider m-0">Pipeline Yield Today</p>
            <h4 className="text-sm font-bold text-white mt-0.5 mb-0 select-none">
              {stats.generatedToday} Videos Created
            </h4>
          </div>
        </div>

        {/* Posts Scheduled */}
        <div className="p-4 rounded-xl bg-[#111111] border border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/10">
            <Calendar className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] text-gray-550 uppercase font-mono tracking-wider m-0">Upcoming Schedules</p>
            <h4 className="text-sm font-bold text-white mt-0.5 mb-0 select-none">
              {stats.scheduled} Active Queued
            </h4>
          </div>
        </div>

        {/* Auto pilot status banner */}
        <div className={`p-4 rounded-xl border flex items-center gap-4 ${stats.fullAutoMode ? 'bg-[#111111] border-purple-500/30' : 'bg-[#111111] border-white/5'}`}>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${stats.fullAutoMode ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-white/5 border-white/10 text-gray-550'}`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-mono tracking-wider m-0">Factory Autopilot</p>
            <h4 className="text-sm font-bold text-white mt-0.5 mb-0 select-none">
              {stats.fullAutoMode ? "ENGAGED" : "MANUAL CONTROL"}
            </h4>
          </div>
        </div>

      </div>
    </div>
  );
}
