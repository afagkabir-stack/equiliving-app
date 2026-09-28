import React, { useState } from 'react';
import { I18nProvider, useI18n } from './i18n';
import { Navbar } from './components/Navbar';
import { PurchasingPowerCalculator } from './components/PurchasingPowerCalculator';
import { DemographicVisualizer } from './components/DemographicVisualizer';
import { RemoteSalaryConverter } from './components/RemoteSalaryConverter';
import { MethodologyModal } from './components/MethodologyModal';
import { LegalModal, LegalModalType } from './components/LegalModal';
import { AdSlot } from './components/AdSlot';
import { Footer } from './components/Footer';
import { startGuidedTour } from './utils/tour';
import { Compass, Sparkles, X } from 'lucide-react';

function MainDashboard() {
  const { t, isRtl } = useI18n();
  const [activeTab, setActiveTab] = useState<'calculator' | 'demographics' | 'freelance'>('calculator');
  const [showAdSlots, setShowAdSlots] = useState<boolean>(true);
  const [methodologyOpen, setMethodologyOpen] = useState<boolean>(false);
  const [legalModalType, setLegalModalType] = useState<LegalModalType>(null);
  const [showTourBanner, setShowTourBanner] = useState<boolean>(() => {
    try {
      return localStorage.getItem('equiliving_tour_seen') !== 'true';
    } catch {
      return true;
    }
  });

  const handleStartTour = () => {
    setShowTourBanner(false);
    startGuidedTour({
      t,
      isRtl,
      activeTab,
      setActiveTab,
    });
  };

  return (
    <div 
      className={`min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white ${isRtl ? 'font-[Tajawal]' : ''}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMethodology={() => setMethodologyOpen(true)}
        showAdSlots={showAdSlots}
        setShowAdSlots={setShowAdSlots}
        onStartTour={handleStartTour}
      />

      {/* Strategic AdSense Slot 1: Top Responsive Leaderboard Banner (728x90) */}
      {showAdSlots && (
        <div className="px-4 sm:px-6 lg:px-8 pt-3">
          <AdSlot type="leaderboard" slotId="7391028475" />
        </div>
      )}

      {/* Main Content Workspace with Sticky Sidebar Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Calculator Tools Column */}
          <section className="lg:col-span-8 space-y-6">
            {/* First-time Welcome Tour Callout Banner */}
            {showTourBanner && (
              <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/90 via-white to-indigo-50/70 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-xs shrink-0 mt-0.5">
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
                      <span>{isRtl ? 'جولة إرشادية تفاعلية للمنصة' : 'Interactive Guided Tour'}</span>
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-100 text-indigo-700 rounded-full border border-indigo-200">
                        {isRtl ? 'دقيقة واحدة' : '1 min'}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
                      {isRtl
                        ? 'تعرّف خطوة بخطوة على كيفية احتساب تعادل القوة الشرائية، تفسير مخططات Chart.js، وقراءة مؤشرات العائد الديموغرافي وسن التقاعد.'
                        : 'Learn step-by-step how to interpret Purchasing Power Parity (PPP), read interactive Chart.js graphs, and evaluate demographic retirement projections.'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={handleStartTour}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{t.tour.startTourBtn}</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowTourBanner(false);
                      try {
                        localStorage.setItem('equiliving_tour_seen', 'true');
                      } catch {
                        // ignore
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    title={isRtl ? 'إغلاق' : 'Dismiss'}
                    aria-label="Dismiss tour banner"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'calculator' && (
              <PurchasingPowerCalculator showAdSlots={showAdSlots} />
            )}

            {activeTab === 'demographics' && (
              <DemographicVisualizer showAdSlots={showAdSlots} />
            )}

            {activeTab === 'freelance' && (
              <RemoteSalaryConverter showAdSlots={showAdSlots} />
            )}
          </section>

          {/* Strategic AdSense Slot 3: Sticky Sidebar (300x600 Skyscraper) + Quick Info */}
          <aside className="lg:col-span-4 space-y-6">
            {showAdSlots && (
              <AdSlot
                type="sidebar"
                slotId="6291048201"
                className="sticky top-20"
              />
            )}

            {/* Quick Economic Reference Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {isRtl ? 'البيانات الحية والمصادر' : 'Live Data & Sources'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isRtl
                  ? 'يتم الاستعلام المباشر عن مؤشرات تعادل القوة الشرائية (PPP) والتضخم من واجهة بيانات البنك الدولي الرسمية (World Bank Open Data v2) مع توفير نسخ احتياطية فورية.'
                  : 'Purchasing Power Parity (PPP) and CPI inflation metrics query the official World Bank Open Data API v2, grounded in the ICP benchmark dataset.'}
              </p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600">
                <button
                  onClick={() => setMethodologyOpen(true)}
                  className="font-semibold hover:underline cursor-pointer"
                >
                  {isRtl ? 'عرض المنهجية الكاملة ←' : 'View full methodology →'}
                </button>
                <button
                  onClick={handleStartTour}
                  className="font-semibold hover:underline cursor-pointer flex items-center gap-1 text-slate-700 hover:text-indigo-600"
                >
                  <Compass className="h-3.5 w-3.5 text-indigo-600" />
                  <span>{t.tour.startTourBtn}</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Methodology & Data Disclosure Modal */}
      <MethodologyModal
        isOpen={methodologyOpen}
        onClose={() => setMethodologyOpen(false)}
      />

      {/* Legal & Info Modals (About Us, Privacy Policy, Terms & Disclaimer) */}
      <LegalModal
        type={legalModalType}
        isOpen={!!legalModalType}
        onClose={() => setLegalModalType(null)}
      />

      {/* Modern High-Contrast Footer with Developer Info */}
      <Footer
        onOpenMethodology={() => setMethodologyOpen(true)}
        onOpenLegalModal={(type) => setLegalModalType(type)}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onStartTour={handleStartTour}
      />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <MainDashboard />
    </I18nProvider>
  );
}
