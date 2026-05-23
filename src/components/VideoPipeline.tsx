import React, { useState } from "react";
import { Film, Sparkles, Wand2, Volume2, Video, Languages, Image as ImageIcon, Calendar, CheckCircle, Clock, AlertCircle, Play, ChevronRight, Share2, Plus, MonitorPlay, Trash2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { VideoProject, Niche, VideoStatus } from "../types";

interface VideoPipelineProps {
  videos: VideoProject[];
  niches: Niche[];
  onCreateVideo: (video: { nicheId: string; title: string; language: string; tone: string; duration: number }) => Promise<void>;
  onTriggerScript: (id: string) => Promise<void>;
  onSimulateStep: (id: string, targetStatus: VideoStatus) => Promise<void>;
  onDeleteVideo: (id: string) => Promise<void>;
}

export default function VideoPipeline({ videos, niches, onCreateVideo, onTriggerScript, onSimulateStep, onDeleteVideo }: VideoPipelineProps) {
  const [isDrafting, setIsDrafting] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  // Draft form state
  const [title, setTitle] = useState("");
  const [nicheId, setNicheId] = useState("");
  const [language, setLanguage] = useState("English");
  const [tone, setTone] = useState("High Energy & Snappy");
  const [duration, setDuration] = useState(45);

  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const languagesList = ["English", "Spanish", "French", "German", "Arabic", "Japanese"];
  const tonesList = ["Drama Storyteller", "High Energy & Snappy", "Stoic & Serious", "Sarcastic & Dry", "Whispering Confession", "ASMR Chill"];

  const handleDraftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalNicheId = nicheId || (niches.length > 0 ? niches[0].id : "custom");
    await onCreateVideo({
      title: title || `Instant Virality campaign #${Math.floor(Math.random() * 900) + 100}`,
      nicheId: finalNicheId,
      language,
      tone,
      duration,
    });
    setIsDrafting(false);
    setTitle("");
  };

  const executeScriptGen = async (id: string) => {
    setLoadingMap(prev => ({ ...prev, [id]: true }));
    try {
      await onTriggerScript(id);
    } finally {
      setLoadingMap(prev => ({ ...prev, [id]: false }));
    }
  };

  const executePipelineStep = async (id: string, target: VideoStatus) => {
    setLoadingMap(prev => ({ ...prev, [`${id}-${target}`]: true }));
    try {
      await onSimulateStep(id, target);
    } finally {
      setLoadingMap(prev => ({ ...prev, [`${id}-${target}`]: false }));
    }
  };

  const activeVideo = videos.find(v => v.id === selectedVideoId) || (videos.length > 0 ? videos[0] : null);

  const getStatusIcon = (status: VideoStatus) => {
    switch (status) {
      case 'Idea': return <Clock className="w-4 h-4 text-gray-500" />;
      case 'Script': return <Wand2 className="w-4 h-4 text-amber-400" />;
      case 'Voice': return <Volume2 className="w-4 h-4 text-violet-400" />;
      case 'Video': return <Video className="w-4 h-4 text-blue-400" />;
      case 'Subtitle': return <Languages className="w-4 h-4 text-cyan-400" />;
      case 'Thumbnail': return <ImageIcon className="w-4 h-4 text-pink-400" />;
      case 'Schedule': return <Calendar className="w-4 h-4 text-lime-400" />;
      case 'Publish': return <CheckCircle className="w-4 h-4 text-teal-400" />;
    }
  };

  // Steps list to traverse manually
  const steps: { name: VideoStatus; label: string; icon: any }[] = [
    { name: 'Script', label: 'AI Scripting', icon: <Wand2 className="w-3.5 h-3.5" /> },
    { name: 'Voice', label: 'Crayo TTS Voice', icon: <Volume2 className="w-3.5 h-3.5" /> },
    { name: 'Video', label: 'VeoAI Footage', icon: <Video className="w-3.5 h-3.5" /> },
    { name: 'Subtitle', label: 'Subtitles Burn', icon: <Languages className="w-3.5 h-3.5" /> },
    { name: 'Thumbnail', label: 'Visual Cover', icon: <ImageIcon className="w-3.5 h-3.5" /> },
    { name: 'Schedule', label: 'Queue Time', icon: <Calendar className="w-3.5 h-3.5" /> },
    { name: 'Publish', label: 'Share Live', icon: <Share2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header and top action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-medium text-white tracking-tight m-0">AUTOMATED WORKFLOW PIPELINE</h2>
          <p className="text-xs text-gray-400 mt-0.5">Automated visual production suite translating campaign notes to raw multi-platform shorts.</p>
        </div>

        <button
          onClick={() => setIsDrafting(!isDrafting)}
          id="draft-campaign-btn"
          className="bg-purple-600 hover:bg-purple-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-purple-600/15 cursor-pointer transition active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          {isDrafting ? 'CLOSE FORM' : 'SPAWN VIDEO DRAFT'}
        </button>
      </div>

      {/* Drafting Campaign Form */}
      <AnimatePresence>
        {isDrafting && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleDraftSubmit}
            className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-xl"
            id="draft-video-form"
          >
            <div className="md:col-span-3 text-xs font-mono text-gray-400 font-bold uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Draft New Virality Proposal
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 font-mono uppercase tracking-wider mb-1.5">Video/Script Focus Title</label>
              <input
                type="text"
                placeholder="e.g. 3 AI Websites that feel highly illegal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#111111] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 font-mono uppercase tracking-wider mb-1.5">Target Campaign Niche</label>
              <select
                value={nicheId}
                onChange={(e) => setNicheId(e.target.value)}
                className="w-full bg-[#111111] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              >
                {niches.map(n => (
                  <option key={n.id} value={n.id}>{n.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 font-mono uppercase tracking-wider mb-1.5">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-[#111111] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              >
                {languagesList.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 font-mono uppercase tracking-wider mb-1.5">Acoustic Tone Style</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-[#111111] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              >
                {tonesList.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 font-mono uppercase tracking-wider mb-1.5">Nominal Duration (Seconds)</label>
              <input
                type="number"
                min={15}
                max={90}
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full bg-[#111111] border border-white/5 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="md:col-span-3 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDrafting(false)}
                className="px-4 py-2 text-xs font-mono text-gray-400 hover:text-white transition cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition active:scale-95"
              >
                DRAFT PIPELINE CAMPAIGN
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Main split viewport split: Campaign lists left, detail specs active workspace right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Queue of projects (size: 5 cols) */}
        <div className="lg:col-span-5 space-y-3 max-h-[640px] overflow-y-auto pr-1">
          {videos.length === 0 ? (
            <div className="p-8 rounded-xl bg-black/20 border border-purple-900/10 text-center text-gray-500 text-xs">
              No drafted video pipelines found. Generate a video draft to begin.
            </div>
          ) : (
            videos.map((v) => {
              const worksAsActive = selectedVideoId === v.id || (!selectedVideoId && videos[0].id === v.id);
              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVideoId(v.id)}
                  id={`video-queue-item-${v.id}`}
                  className={`p-4 rounded-xl cursor-pointer select-none text-left transition duration-150 relative overflow-hidden group border ${worksAsActive ? 'bg-[#1A112C]/60 border-purple-500/20 text-white shadow-[0_0_15px_rgba(168,85,247,0.05)]' : 'bg-[#111111] border-white/5 text-gray-300 hover:bg-[#161616] hover:border-white/10'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <span className="text-[10px] uppercase font-mono text-purple-400/80 font-bold block truncate">
                        {v.nicheName} • {v.duration}s
                      </span>
                      <h4 className="text-sm font-semibold truncate leading-tight pr-4 text-white m-0">
                        {v.title}
                      </h4>
                    </div>
                    
                    {/* Status badge */}
                    <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-1 rounded-md text-[10px] font-mono shrink-0">
                      {getStatusIcon(v.status)}
                      <span className="uppercase text-purple-300 font-bold">{v.status}</span>
                    </div>
                  </div>

                  {/* Progress Line */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-[10px] font-mono text-gray-500">
                      <span>Progress</span>
                      <span>{v.progress}%</span>
                    </div>
                    <div className="w-full h-1 bg-purple-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-500 transition-all duration-300"
                        style={{ width: `${v.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT COLUMN: Active workspace console (size: 7 cols) */}
        <div className="lg:col-span-7">
          {activeVideo ? (
            <motion.div
              layoutId="console"
              className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/5 space-y-6 flex flex-col justify-between shadow-xl"
            >
              
              {/* Top Meta info */}
              <div className="flex items-start justify-between border-b border-white/5 pb-4">
                <div className="min-w-0">
                  <span className="text-[10px] text-purple-400 font-mono tracking-widest uppercase font-bold">
                    Active Factory Workspace Console
                  </span>
                  <h3 className="text-lg font-display font-bold text-white mt-1 pr-6 leading-tight m-0 select-text">
                    {activeVideo.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Tone: <strong className="text-purple-300 font-normal">{activeVideo.tone}</strong> • Language: <strong className="text-purple-300 font-normal">{activeVideo.language}</strong>
                  </p>
                </div>

                <button
                  onClick={() => onDeleteVideo(activeVideo.id)}
                  className="bg-transparent hover:bg-red-950/20 border border-transparent hover:border-red-500/20 text-red-400 p-2 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Stage Nodes Tracker */}
              <div className="space-y-4">
                <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase font-bold">Pipeline Stage Nodes tracker</span>
                
                <div className="grid grid-cols-2 xs:grid-cols-4 sm:grid-cols-7 gap-1 bg-[#111111] p-1.5 rounded-xl border border-white/5">
                  {steps.map((st, i) => {
                    const statusSchedule = ['Idea', 'Script', 'Voice', 'Video', 'Subtitle', 'Thumbnail', 'Schedule', 'Publish'];
                    const activeIndex = statusSchedule.indexOf(activeVideo.status);
                    const targetIndex = statusSchedule.indexOf(st.name);

                    const completed = targetIndex <= activeIndex && activeVideo.status !== "Idea";
                    const active = activeVideo.status === st.name;

                    return (
                      <div
                        key={st.name}
                        onClick={() => {
                          if (completed || i === 0 || statusSchedule.indexOf(activeVideo.status) >= i) {
                            // Can manually click to step through simulation
                            executePipelineStep(activeVideo.id, st.name);
                          }
                        }}
                        className={`p-2 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer select-none transition ${completed ? 'bg-purple-600/10 border border-purple-500/25 text-purple-400' : 'text-gray-605 border border-transparent'} ${active ? 'border-purple-500 bg-purple-500/10 text-purple-300 shadow-sm font-semibold' : ''}`}
                      >
                        {st.icon}
                        <span className="text-[8px] font-mono uppercase tracking-wider block mt-1.5 font-bold truncate max-w-full">
                          {st.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Script & prompt spec display */}
              <div className="bg-[#111111] border border-white/5 rounded-xl p-4 space-y-4 max-h-[300px] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-[10px] font-mono uppercase text-purple-400 font-bold flex items-center gap-1">
                    <MonitorPlay className="w-3.5 h-3.5" /> Generation Log Console & Copy
                  </span>
                  
                  {activeVideo.status === 'Idea' && (
                    <button
                      onClick={() => executeScriptGen(activeVideo.id)}
                      disabled={loadingMap[activeVideo.id]}
                      id="trigger-ai-script-btn"
                      className="bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800 disabled:cursor-not-allowed text-black font-semibold text-[10px] px-3 py-1 rounded cursor-pointer select-none font-mono flex items-center gap-1 transition"
                    >
                      <Sparkles className="w-3 h-3 text-black animate-pulse" />
                      {loadingMap[activeVideo.id] ? 'AI WRITING...' : 'GENERATE AI SCRIPT'}
                    </button>
                  )}
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-gray-300">
                  {activeVideo.viralHook && (
                    <div className="p-3 bg-white/5 border border-white/5 rounded-lg">
                      <span className="text-[9px] font-mono uppercase text-amber-400/80 font-bold block mb-1">Viral Hook (Succeed CTR)</span>
                      <p className="m-0 italic text-white font-display text-sm tracking-tight">“{activeVideo.viralHook}”</p>
                    </div>
                  )}

                  {activeVideo.scriptText ? (
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                      <span className="text-[9px] font-mono uppercase text-purple-400 font-bold block mb-1.5">Acoustic Audio Script / Prompt copy</span>
                      <p className="m-0 select-all font-sans text-xs text-gray-300 whitespace-pre-wrap">{activeVideo.scriptText}</p>
                    </div>
                  ) : (
                    <div className="text-center p-8 text-gray-600 font-mono text-[10px]">
                      [Waiting for AI Script Generation - Click "GENERATE AI SCRIPT" above to trigger Gemini model]
                    </div>
                  )}

                  {activeVideo.ctaText && (
                    <div className="p-2 bg-white/5 rounded-md border border-white/5">
                      <span className="text-[9px] font-mono uppercase text-purple-400/80 font-bold block">Call To Action (Affiliate Link Hook)</span>
                      <p className="m-0 font-medium text-[11px] text-white">“{activeVideo.ctaText}”</p>
                    </div>
                  )}

                  {activeVideo.hashtags && (
                    <div className="text-[10px] font-mono text-purple-400 bg-white/5 px-2.5 py-1 rounded border border-white/5 truncate">
                      Tags: {activeVideo.hashtags}
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic simulated generation simulator helper triggers */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-3">
                <span className="text-[10px] font-mono uppercase text-purple-300 tracking-wider font-bold">Manual Factory Engine Controllers</span>
                
                <div className="flex flex-wrap items-center gap-2">
                  {activeVideo.status === 'Idea' && (
                    <div className="text-xs text-purple-400 font-mono">← Trigger the AI script generator above to boot the campaign pipeline.</div>
                  )}
                  {activeVideo.status !== 'Publish' && activeVideo.status !== 'Idea' && (
                    <>
                      {activeVideo.status === 'Script' && (
                        <button
                          onClick={() => executePipelineStep(activeVideo.id, 'Voice')}
                          disabled={loadingMap[`${activeVideo.id}-Voice`]}
                          className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-[10px] px-3.5 py-2 rounded-lg flex items-center gap-1 shadow cursor-pointer"
                        >
                          Synthesize Voice Over (Crayo TTS)
                        </button>
                      )}
                      
                      {activeVideo.status === 'Voice' && (
                        <button
                          onClick={() => executePipelineStep(activeVideo.id, 'Video')}
                          disabled={loadingMap[`${activeVideo.id}-Video`]}
                          className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-[10px] px-3.5 py-2 rounded-lg flex items-center gap-1 shadow cursor-pointer"
                        >
                          Generate Video Footage (VeoAI)
                        </button>
                      )}

                      {activeVideo.status === 'Video' && (
                        <button
                          onClick={() => executePipelineStep(activeVideo.id, 'Subtitle')}
                          className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-[10px] px-3.5 py-2 rounded-lg flex items-center gap-1 shadow cursor-pointer"
                        >
                          Overlay Kinetic Subtitles
                        </button>
                      )}

                      {activeVideo.status === 'Subtitle' && (
                        <button
                          onClick={() => executePipelineStep(activeVideo.id, 'Thumbnail')}
                          className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-[10px] px-3.5 py-2 rounded-lg flex items-center gap-1 shadow cursor-pointer"
                        >
                          Render Click-Magnet Cover
                        </button>
                      )}

                      {activeVideo.status === 'Thumbnail' && (
                        <button
                          onClick={() => executePipelineStep(activeVideo.id, 'Schedule')}
                          className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-[10px] px-3.5 py-2 rounded-lg flex items-center gap-1 shadow cursor-pointer"
                        >
                          Schedule Video to Channel Queue
                        </button>
                      )}

                      {activeVideo.status === 'Schedule' && (
                        <button
                          onClick={() => executePipelineStep(activeVideo.id, 'Publish')}
                          className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-semibold text-[10px] px-3.5 py-2 rounded-lg flex items-center gap-1 shadow shadow-fuchsia-600/10 cursor-pointer"
                        >
                          Auto-Publish Multiplatform
                        </button>
                      )}
                    </>
                  )}

                  {activeVideo.status === 'Publish' && (
                    <div className="flex items-center gap-2 bg-[#092211] p-3 rounded-lg border border-emerald-500/20 text-emerald-300 text-xs w-full">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <span className="font-semibold block font-sans">Campaign complete and actively generating views!</span>
                        <span className="text-[10px] font-mono text-emerald-400/80 uppercase block">Automatic API Repost metrics: Tiktok, YouTube, Reels.</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </motion.div>
          ) : (
            <div className="text-center p-12 bg-black/40 border border-purple-900/10 rounded-2xl text-gray-500 text-xs">
              Configure or select a campaign pipeline proposal from the list.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
