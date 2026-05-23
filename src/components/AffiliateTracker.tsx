import React from "react";
import { DollarSign, MousePointerClick, Award, TrendingUp, Compass, ShoppingBag, ExternalLink, RefreshCw } from "lucide-react";
import { Niche, VideoProject } from "../types";

interface AffiliateTrackerProps {
  niches: Niche[];
  videos: VideoProject[];
}

export default function AffiliateTracker({ niches, videos }: AffiliateTrackerProps) {
  // Aggregate sales and CTR parameters
  let totalViews = 0;
  let totalClicks = 0;
  let totalConversions = 0;
  let earnedRevenue = 0;

  // Track stats per niche ID
  const nichePerformance: Record<string, { views: number; clicks: number; conversions: number; revenue: number }> = {};

  // Build structure
  niches.forEach(n => {
    nichePerformance[n.id] = { views: 0, clicks: 0, conversions: 0, revenue: 0 };
  });

  videos.forEach(v => {
    if (v.stats) {
      totalViews += v.stats.views || 0;
      totalClicks += v.stats.clicks || 0;
      totalConversions += v.stats.conversions || 0;
      earnedRevenue += v.stats.revenue || 0;

      if (v.nicheId && nichePerformance[v.nicheId]) {
        nichePerformance[v.nicheId].views += v.stats.views || 0;
        nichePerformance[v.nicheId].clicks += v.stats.clicks || 0;
        nichePerformance[v.nicheId].conversions += v.stats.conversions || 0;
        nichePerformance[v.nicheId].revenue += v.stats.revenue || 0;
      }
    }
  });

  const conversionCTR = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : "0.0";
  const viewsCTR = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : "0.00";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-display font-medium text-white tracking-tight m-0">AFFILIATE INTEGRATION TRACKER</h2>
        <p className="text-xs text-gray-400 mt-0.5">Track products embedded inside video descriptions, CTR conversion loops, and passive revenue streams.</p>
      </div>

      {/* Grid of aggregated indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        {/* REVENUE */}
        <div className="p-5 rounded-2xl bg-[#111111] border border-white/5 relative overflow-hidden group shadow`sm">
          <p className="text-xs font-mono text-purple-400 font-medium uppercase tracking-wider m-0">Affiliate Yield</p>
          <h3 className="text-3xl font-display font-bold text-white mt-1.5 mb-1 font-sans">
            ${earnedRevenue.toLocaleString()}
          </h3>
          <span className="text-[10px] font-mono text-gray-500 uppercase block">Total Net Commission</span>
        </div>

        {/* CLICK-THRU RATIO */}
        <div className="p-5 rounded-2xl bg-[#111111] border border-white/5 relative overflow-hidden group shadow`sm">
          <p className="text-xs font-mono text-purple-400 font-medium uppercase tracking-wider m-0">Description CTR</p>
          <h3 className="text-3xl font-display font-bold text-white mt-1.5 mb-1 font-sans">
            {viewsCTR}%
          </h3>
          <span className="text-[10px] font-mono text-gray-500 uppercase block">Total clicks / total impressions</span>
        </div>

        {/* CONVERSIONS ACTION */}
        <div className="p-5 rounded-2xl bg-[#111111] border border-white/5 relative overflow-hidden group shadow`sm">
          <p className="text-xs font-mono text-purple-400 font-medium uppercase tracking-wider m-0">Paid Conversions</p>
          <h3 className="text-3xl font-display font-bold text-white mt-1.5 mb-1 font-sans">
            {totalConversions.toLocaleString()}
          </h3>
          <span className="text-[10px] font-mono text-gray-500 uppercase block">Sales, signups, or book leads</span>
        </div>

        {/* CONVERSION SUCCESS RATING */}
        <div className="p-5 rounded-2xl bg-[#111111] border border-white/5 relative overflow-hidden group shadow`sm">
          <p className="text-xs font-mono text-purple-400 font-medium uppercase tracking-wider m-0">Sales Conv. Rate</p>
          <h3 className="text-3xl font-display font-bold text-white mt-1.5 mb-1 font-sans">
            {conversionCTR}%
          </h3>
          <span className="text-[10px] font-mono text-gray-500 uppercase block">Success purchase per clicked referral</span>
        </div>

      </div>

      {/* Performance by campaign niche */}
      <div className="space-y-4">
        <h3 className="text-sm font-display font-semibold text-white flex items-center gap-2 m-0 select-none">
          <Award className="w-4 h-4 text-purple-400" /> Promotion Performance by Kampaign category
        </h3>

        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#111111] text-purple-300 font-mono uppercase tracking-wider border-b border-white/5">
                  <th className="p-4">Niche Name</th>
                  <th className="p-4">Linked Product Offer</th>
                  <th className="p-4 text-center">CTR clicks</th>
                  <th className="p-4 text-center">Conversions</th>
                  <th className="p-4 text-right">Acquired commissions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {niches.map(n => {
                  const performance = nichePerformance[n.id] || { views: 0, clicks: 0, conversions: 0, revenue: 0 };
                  return (
                    <tr key={n.id} className="hover:bg-[#111111] transition">
                      <td className="p-4 font-semibold text-white flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        {n.name}
                      </td>
                      <td className="p-4">
                        {n.affiliateTitle ? (
                          <div className="space-y-1">
                            <span className="block font-medium text-white">{n.affiliateTitle}</span>
                            {n.affiliateLink && (
                              <a
                                href={n.affiliateLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-0.5 text-[10px] font-mono text-purple-400 hover:text-purple-300"
                              >
                                Pitch Link <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500 font-mono">[No Promo Offer Configured]</span>
                        )}
                      </td>
                      <td className="p-4 text-center font-mono">
                        {performance.clicks.toLocaleString()}
                      </td>
                      <td className="p-4 text-center font-mono text-purple-400 font-bold">
                        {performance.conversions.toLocaleString()}
                      </td>
                      <td className="p-4 text-right font-mono text-emerald-400 font-bold font-sans">
                        ${performance.revenue.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
