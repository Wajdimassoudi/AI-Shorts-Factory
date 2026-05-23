import React, { useState } from "react";
import { Youtube, Instagram, Facebook, RefreshCw, Layers, Calendar, CheckCircle2, AlertCircle, PlayCircle, HelpCircle, Shield, Share2 } from "lucide-react";
import { VideoProject } from "../types";

interface AutoPostingQueueProps {
  videos: VideoProject[];
  onPublishVideoNow: (id: string) => Promise<void>;
  onRetryVideoNow: (id: string) => Promise<void>;
}

export default function AutoPostingQueue({ videos, onPublishVideoNow, onRetryVideoNow }: AutoPostingQueueProps) {
  const queuedVideos = videos.filter(v => v.status === "Schedule" || v.status === "Subtitle" || v.status === "Thumbnail");
  const publishedVideos = videos.filter(v => v.status === "Publish");

  // Multi platform active connection mock toggle
  const [connections, setConnections] = useState({
    tiktok: true,
    youtube: true,
    instagram: false,
    facebook: false
  });

  const toggleConnection = (platform: 'tiktok' | 'youtube' | 'instagram' | 'facebook') => {
    setConnections(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-display font-medium text-white tracking-tight m-0">MULTI-PLATFORM POSTING QUEUE</h2>
        <p className="text-xs text-gray-400 mt-0.5">Track publishing states, connected social channels, queue intervals, and delivery performance metrics.</p>
      </div>

      {/* Connected accounts panel */}
      <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-white/5 space-y-4 shadow-xl">
        <h3 className="text-xs font-mono text-purple-400 uppercase tracking-wider m-0 flex items-center gap-1.5 font-bold">
          <Shield className="w-4 h-4 text-purple-400" /> Active API Publishing Channels
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          
          {/* TIKTOK */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition ${connections.tiktok ? 'bg-purple-500/10 border-purple-500/20' : 'bg-white/5 border-white/5'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase font-mono">TikTok API</span>
              <span className={`w-2 h-2 rounded-full ${connections.tiktok ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
            </div>
            <button
              onClick={() => toggleConnection('tiktok')}
              className={`w-full py-1.5 rounded text-[10px] font-mono tracking-wider font-semibold cursor-pointer ${connections.tiktok ? 'bg-white/5 hover:bg-white/10 text-purple-300' : 'bg-purple-600 text-white'}`}
            >
              {connections.tiktok ? 'DISCONNECT' : 'CONNECT'}
            </button>
          </div>

          {/* YOUTUBE SHORTS */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition ${connections.youtube ? 'bg-red-500/10 border-red-500/20' : 'bg-white/5 border-white/5'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase font-mono flex items-center gap-1"><Youtube className="w-4 h-4 text-red-500" /> YouTube Shorts</span>
              <span className={`w-2 h-2 rounded-full ${connections.youtube ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
            </div>
            <button
              onClick={() => toggleConnection('youtube')}
              className={`w-full py-1.5 rounded text-[10px] font-mono tracking-wider font-semibold cursor-pointer ${connections.youtube ? 'bg-white/5 hover:bg-white/10 text-purple-300' : 'bg-purple-600 text-white'}`}
            >
              {connections.youtube ? 'DISCONNECT' : 'CONNECT'}
            </button>
          </div>

          {/* INSTAGRAM REELS */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition ${connections.instagram ? 'bg-pink-500/10 border-pink-500/20' : 'bg-white/5 border-white/5'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase font-mono flex items-center gap-1"><Instagram className="w-4 h-4 text-pink-400" /> Instagram Reels</span>
              <span className={`w-2 h-2 rounded-full ${connections.instagram ? 'bg-emerald-400' : 'bg-gray-600'}`} />
            </div>
            <button
              onClick={() => toggleConnection('instagram')}
              className={`w-full py-1.5 rounded text-[10px] font-mono tracking-wider font-semibold cursor-pointer ${connections.instagram ? 'bg-white/5 hover:bg-white/10 text-purple-300' : 'bg-purple-600 text-white'}`}
            >
              {connections.instagram ? 'DISCONNECT' : 'CONNECT'}
            </button>
          </div>

          {/* FACEBOOK REELS */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition ${connections.facebook ? 'bg-blue-500/10 border-blue-500/20' : 'bg-white/5 border-white/5'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase font-mono flex items-center gap-1"><Facebook className="w-4 h-4 text-blue-400" /> Facebook Reels</span>
              <span className={`w-2 h-2 rounded-full ${connections.facebook ? 'bg-emerald-400' : 'bg-gray-600'}`} />
            </div>
            <button
              onClick={() => toggleConnection('facebook')}
              className={`w-full py-1.5 rounded text-[10px] font-mono tracking-wider font-semibold cursor-pointer ${connections.facebook ? 'bg-white/5 hover:bg-white/10 text-purple-300' : 'bg-purple-600 text-white'}`}
            >
              {connections.facebook ? 'DISCONNECT' : 'CONNECT'}
            </button>
          </div>

        </div>
      </div>

      {/* Split view: active queue left, history logs right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ACTIVE QUEUE */}
        <div className="space-y-4">
          <h3 className="text-sm font-display font-semibold text-white flex items-center gap-2 m-0 select-none">
            <Layers className="w-4 h-4 text-purple-400" /> Currently Preparing & Scheduled Queue ({queuedVideos.length})
          </h3>
          
          <div className="space-y-3">
            {queuedVideos.length === 0 ? (
              <div className="p-8 rounded-xl bg-purple-950/5 border border-purple-900/10 text-center text-gray-500 text-xs font-mono">
                [No video campaigns actively scheduled]
              </div>
            ) : (
              queuedVideos.map(q => (
                <div key={q.id} className="p-5 rounded-2xl bg-[#111111] border border-white/5 space-y-3 hover:border-purple-500/20 transition shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[9px] font-mono text-purple-400 block font-bold uppercase tracking-wider">{q.nicheName}</span>
                      <h4 className="text-sm font-semibold text-white leading-snug m-0">{q.title}</h4>
                    </div>
                    <span className="text-[10px] bg-purple-950/40 px-2 py-0.5 rounded font-mono text-purple-300 border border-purple-800/10 uppercase font-bold shrink-0">{q.status}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2.5 border-t border-white/5">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" /> Live Target: {q.scheduledTime || '18:00'}
                    </span>
                    
                    <button
                      onClick={() => onPublishVideoNow(q.id)}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] px-3 py-1 rounded flex items-center gap-1 cursor-pointer transition active:scale-95 shadow"
                    >
                      <Share2 className="w-3 h-3" /> PUBLISH NOW
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* DELIVERY SUCCEEDED / COMPLETED PUBLISH LOGS */}
        <div className="space-y-4">
          <h3 className="text-sm font-display font-semibold text-white flex items-center gap-2 m-0 select-none">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automated Delivery Ledger ({publishedVideos.length})
          </h3>

          <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
            {publishedVideos.length === 0 ? (
              <div className="p-8 rounded-xl bg-purple-950/5 border border-purple-900/10 text-center text-gray-500 text-xs font-mono">
                [No published deliveries listed yet]
              </div>
            ) : (
              publishedVideos.map(p => (
                <div key={p.id} className="p-5 rounded-2xl bg-[#111111] border border-white/5 space-y-3 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[9px] font-mono text-emerald-400 font-bold block uppercase tracking-wider">{p.nicheName}</span>
                      <h4 className="text-sm font-semibold text-white leading-snug m-0">{p.title}</h4>
                      <span className="text-[10px] block text-gray-400 mt-1 font-mono">Published at {p.publishedAt ? new Date(p.publishedAt).toLocaleTimeString() : 'Recently'}</span>
                    </div>
                  </div>

                  {/* Channel delivery verification list */}
                  <div className="grid grid-cols-4 gap-1.5 pt-2.5 border-t border-white/5">
                    {Object.entries(p.platforms || {}).map(([platform, pstate]) => {
                      if (pstate === 'none') return null;
                      return (
                        <div key={platform} className={`p-1.5 rounded-md flex flex-col items-center justify-center text-center capitalize ${pstate === 'published' ? 'bg-[#021f10] text-emerald-400' : 'bg-red-950/20 text-red-400'}`}>
                          <span className="text-[8px] font-mono font-bold tracking-wider uppercase block">{platform}</span>
                          <span className="text-[8px] font-mono block mt-0.5">{pstate}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
