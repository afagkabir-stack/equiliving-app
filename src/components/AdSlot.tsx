import React from 'react';
import { useI18n } from '../i18n';

interface AdSlotProps {
  type: 'leaderboard' | 'in-feed' | 'sidebar' | 'between-results';
  slotId?: string;
  className?: string;
  previewMode?: boolean;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  type,
  slotId = '1234567890',
  className = '',
  previewMode = true,
}) => {
  const { t } = useI18n();

  // Top leaderboard banner (728x90 desktop / responsive)
  if (type === 'leaderboard') {
    return (
      <aside aria-label="Advertisement Banner" className={`adsense-slot adsense-leaderboard my-4 mx-auto w-full max-w-5xl ${className}`}>
        <div className="flex items-center justify-between pb-1.5 px-2 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
          <span>{t.ads.advertisement}</span>
          <span className="font-mono text-[10px] text-slate-400">Google AdSense · Responsive Leaderboard</span>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-dashed border-slate-300 bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 p-4 sm:p-5 text-center transition-all hover:border-slate-400">
          {previewMode ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-600">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-200">
                  AD
                </span>
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-800">{t.ads.leaderboardNotice}</p>
                  <p className="text-[11px] text-slate-500">Target CPM Tier: US ($14–$28), JP ($10–$22), LatAm/Asia ($3–$9)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                  Slot Active: {slotId}
                </span>
              </div>
            </div>
          ) : (
            <ins
              className="adsbygoogle"
              style={{ display: 'block', minHeight: '90px' }}
              data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
              data-ad-slot={slotId}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          )}
        </div>
      </aside>
    );
  }

  // Between calculator and results slot
  if (type === 'between-results' || type === 'in-feed') {
    return (
      <aside aria-label="Sponsored In-Feed" className={`adsense-slot adsense-in-feed my-6 w-full ${className}`}>
        <div className="flex items-center justify-between pb-1 px-1 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
          <span>{t.ads.advertisement}</span>
          <span className="font-mono text-[10px] text-slate-400">Between Calculator & Results Unit</span>
        </div>
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 transition-all hover:border-slate-400">
          {previewMode ? (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700 font-bold text-xs border border-amber-200">
                AD
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-800">{t.ads.inFeedNotice}</p>
                  <span className="text-[10px] font-mono text-slate-400">data-ad-format="fluid"</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  High-converting contextual ad slot situated right between calculation parameters and comparative metrics.
                </p>
              </div>
            </div>
          ) : (
            <ins
              className="adsbygoogle"
              style={{ display: 'block', minHeight: '110px' }}
              data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
              data-ad-slot={slotId}
              data-ad-format="fluid"
              data-ad-layout-key="-fb+5w+4e-db+86"
            />
          )}
        </div>
      </aside>
    );
  }

  // Sticky Sidebar Skyscraper slot
  return (
    <aside aria-label="Sidebar Advertisement" className={`adsense-slot adsense-sidebar sticky top-20 w-full ${className}`}>
      <div className="flex items-center justify-between pb-1 px-1 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
        <span>{t.ads.advertisement}</span>
        <span className="font-mono text-[10px] text-slate-400">Sticky Skyscraper (300x600)</span>
      </div>
      <div className="min-h-[300px] lg:min-h-[460px] rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 flex flex-col justify-between items-center text-center">
        {previewMode ? (
          <>
            <div className="w-full flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span>Viewability 85%+</span>
              <span>High Dwell</span>
            </div>
            <div className="space-y-3 py-6">
              <span className="inline-block px-3 py-1 rounded bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200">
                AdSense 300x600
              </span>
              <p className="text-xs font-semibold text-slate-800">{t.ads.sidebarNotice}</p>
              <p className="text-[11px] text-slate-500 max-w-[210px] mx-auto">
                Desktop sticky sidebar container with high dwell time for maximum ad engagement.
              </p>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Slot ID: {slotId}
            </div>
          </>
        ) : (
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '300px', height: '600px' }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot={slotId}
            data-ad-format="vertical"
          />
        )}
      </div>
    </aside>
  );
};
