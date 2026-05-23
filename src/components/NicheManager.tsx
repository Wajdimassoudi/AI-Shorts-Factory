import React, { useState } from "react";
import { Plus, Trash2, Edit3, Save, Compass, Tag, Calendar, ShoppingBag, ExternalLink, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Niche } from "../types";

interface NicheManagerProps {
  niches: Niche[];
  onCreateNiche: (niche: Omit<Niche, 'id'>) => Promise<void>;
  onUpdateNiche: (id: string, niche: Partial<Niche>) => Promise<void>;
  onDeleteNiche: (id: string) => Promise<void>;
}

export default function NicheManager({ niches, onCreateNiche, onUpdateNiche, onDeleteNiche }: NicheManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [promptStyle, setPromptStyle] = useState("");
  const [scheduleTime, setScheduleTime] = useState("12:00");
  const [hashtags, setHashtags] = useState("");
  const [affiliateTitle, setAffiliateTitle] = useState("");
  const [affiliateLink, setAffiliateLink] = useState("");
  const [landingPageUrl, setLandingPageUrl] = useState("");

  const resetForm = () => {
    setName("");
    setPromptStyle("");
    setScheduleTime("12:00");
    setHashtags("");
    setAffiliateTitle("");
    setAffiliateLink("");
    setLandingPageUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !promptStyle) return;

    await onCreateNiche({
      name,
      promptStyle,
      scheduleTime,
      hashtags,
      affiliateTitle,
      affiliateLink,
      landingPageUrl
    });

    setIsAdding(false);
    resetForm();
  };

  const startEdit = (n: Niche) => {
    setEditingId(n.id);
    setName(n.name);
    setPromptStyle(n.promptStyle);
    setScheduleTime(n.scheduleTime);
    setHashtags(n.hashtags);
    setAffiliateTitle(n.affiliateTitle);
    setAffiliateLink(n.affiliateLink);
    setLandingPageUrl(n.landingPageUrl);
  };

  const handleUpdate = async (id: string) => {
    await onUpdateNiche(id, {
      name,
      promptStyle,
      scheduleTime,
      hashtags,
      affiliateTitle,
      affiliateLink,
      landingPageUrl
    });
    setEditingId(null);
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-medium text-white tracking-tight m-0">Niche Campaigns</h2>
          <p className="text-xs text-gray-400 mt-0.5">Define category configurations, visual script directive prompts, customized social hashtags, and product URLs.</p>
        </div>

        <button
          onClick={() => {
            setIsAdding(!isAdding);
            setEditingId(null);
            resetForm();
          }}
          id="add-niche-trigger"
          className="bg-purple-600 hover:bg-purple-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-purple-600/15 cursor-pointer transition-all duration-150 active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5" />
          {isAdding ? 'CANCEL' : 'ADD NEW NICHE'}
        </button>
      </div>

      {/* Add Niche Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/5 space-y-4 overflow-hidden shadow-xl"
            id="niche-form"
          >
            <div className="text-xs font-mono text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2 mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Create New Content Niche
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 font-mono uppercase tracking-wider mb-1.5">Niche Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Luxury Wealth Hacks"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#111111] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 font-mono uppercase tracking-wider mb-1.5">Daily Auto Posting Time</label>
                <input
                  type="time"
                  required
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full bg-[#111111] border border-white/5 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 font-mono uppercase tracking-wider mb-1.5">AI Visual Style Prompt Directive *</label>
              <textarea
                placeholder="Instruct the AI on tone and aesthetic styling (e.g. Ultra high energy visual, screen transitions descriptions, narrator guidelines...)"
                required
                rows={3}
                value={promptStyle}
                onChange={(e) => setPromptStyle(e.target.value)}
                className="w-full bg-[#111111] border border-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 font-sans focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 font-mono uppercase tracking-wider mb-1.5">Default Hashtags List</label>
              <input
                type="text"
                placeholder="#luxury #success #habits #crypto"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="w-full bg-[#111111] border border-white/5 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Affiliate Details banner */}
            <div className="p-4 rounded-lg bg-[#0F0F0F] border border-white/5 space-y-3">
              <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1"><ShoppingBag className="w-3 h-3" /> Affiliate Promotion Offer Setup</span>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-500 font-mono uppercase tracking-wider mb-1">Affiliate Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Free Affiliate Secrets eBook"
                    value={affiliateTitle}
                    onChange={(e) => setAffiliateTitle(e.target.value)}
                    className="w-full bg-[#161616] border border-white/5 rounded-md px-2.5 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 font-mono uppercase tracking-wider mb-1">Affiliate Pitch URL</label>
                  <input
                    type="url"
                    placeholder="https://partner.com/sign"
                    value={affiliateLink}
                    onChange={(e) => setAffiliateLink(e.target.value)}
                    className="w-full bg-[#161616] border border-white/5 rounded-md px-2.5 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 font-mono uppercase tracking-wider mb-1">Custom Landing Page Link</label>
                  <input
                    type="url"
                    placeholder="https://mycourse.carrd.co"
                    value={landingPageUrl}
                    onChange={(e) => setLandingPageUrl(e.target.value)}
                    className="w-full bg-[#161616] border border-white/5 rounded-md px-2.5 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setIsAdding(false); resetForm(); }}
                className="px-4 py-2 text-xs font-mono text-gray-400 hover:text-white transition cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition active:scale-[0.98]"
              >
                SAVE NICHE
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Niches List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {niches.map((n) => (
          <div
            key={n.id}
            id={`niche-${n.id}`}
            className="p-5 rounded-2xl bg-[#111111] border border-white/5 hover:border-purple-500/20 transition relative group shadow-sm"
          >
            {editingId === n.id ? (
              // EDIT MODE
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-[#161616] rounded px-2.5 py-1.5 text-sm font-sans font-bold text-white border border-white/5 focus:outline-none"
                  />
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="bg-[#161616] rounded px-2.5 py-1.5 text-xs font-mono text-white border border-white/5 focus:outline-none"
                  />
                </div>
                <div>
                  <textarea
                    rows={3}
                    value={promptStyle}
                    onChange={(e) => setPromptStyle(e.target.value)}
                    className="w-full bg-[#161616] rounded p-2 text-xs text-white border border-white/5 font-sans focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    className="w-full bg-[#161616] rounded px-2.5 py-1.5 text-xs text-white border border-white/5 font-mono focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 p-3 bg-[#0F0F0F] rounded-lg border border-white/5">
                  <input
                    type="text"
                    placeholder="Offer Title"
                    value={affiliateTitle}
                    onChange={(e) => setAffiliateTitle(e.target.value)}
                    className="bg-[#161616] text-[10px] px-2 py-1 rounded border border-white/5 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Offer Link"
                    value={affiliateLink}
                    onChange={(e) => setAffiliateLink(e.target.value)}
                    className="bg-[#161616] text-[10px] px-2 py-1 rounded border border-white/5 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Landing Link"
                    value={landingPageUrl}
                    onChange={(e) => setLandingPageUrl(e.target.value)}
                    className="bg-[#161616] text-[10px] px-2 py-1 rounded border border-white/5 text-white"
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-xs font-mono text-gray-400 px-3 py-1 hover:text-white"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={() => handleUpdate(n.id)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded flex items-center gap-1 cursor-pointer"
                  >
                    <Save className="w-3 h-3" /> SAVE
                  </button>
                </div>
              </div>
            ) : (
              // READ VIEW
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-display font-semibold text-white group-hover:text-purple-300 transition m-0 flex items-center gap-1.5 select-none">
                      <Compass className="w-4 h-4 text-purple-400 shrink-0" />
                      {n.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[10px] font-mono hover:text-white text-gray-400 border border-gray-800 rounded px-1.5 py-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-purple-400" />
                        Posts at {n.scheduleTime}
                      </span>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center opacity-40 group-hover:opacity-100 transition duration-150 gap-2">
                    <button
                      onClick={() => startEdit(n)}
                      className="p-1.5 hover:bg-purple-950/40 rounded border border-purple-500/10 text-purple-400 hover:text-white shrink-0 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteNiche(n.id)}
                      className="p-1.5 hover:bg-red-950/40 rounded border border-red-500/10 text-red-400 hover:text-red-300 shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-gray-400 bg-white/5 leading-relaxed p-3 rounded-lg border border-white/5 select-all">
                  <span className="block text-[10px] font-mono uppercase text-purple-400 font-bold mb-1">Prompt directive:</span>
                  {n.promptStyle}
                </div>

                {n.hashtags && (
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-purple-400 truncate select-all">
                    <Tag className="w-3 h-3 shrink-0" /> {n.hashtags}
                  </div>
                )}

                {(n.affiliateTitle || n.affiliateLink) && (
                  <div className="pt-2.5 mt-2 border-t border-white/5 flex flex-col gap-1.5">
                    <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3 text-purple-400" /> Linked Affiliate Hook
                    </span>
                    <div className="flex items-center justify-between text-xs bg-white/5 p-2 px-2.5 rounded border border-white/5">
                      <span className="text-white font-medium truncate shrink-0 max-w-[180px]">{n.affiliateTitle || 'Link Attached'}</span>
                      {n.affiliateLink && (
                        <a
                          href={n.affiliateLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-mono text-purple-400 hover:text-purple-300 flex items-center gap-0.5 truncate max-w-[120px]"
                        >
                          Pitch URL <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
