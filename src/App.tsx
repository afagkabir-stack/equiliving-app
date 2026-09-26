import React, { useState } from 'react';
import { I18nProvider, useI18n } from './i18n';
import { Navbar } from './components/Navbar';
import { PurchasingPowerCalculator } from './components/PurchasingPowerCalculator';
import { DemographicVisualizer } from './components/DemographicVisualizer';
import { RemoteSalaryConverter } from './components/RemoteSalaryConverter';
import { MethodologyModal } from './components/MethodologyModal';
import { AdSlot } from './components/AdSlot';
import { Footer } from './components/Footer';

function MainDashboard() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'calculator' | 'demographics' | 'freelance'>('calculator');
  const [showAdSlots, setShowAdSlots] = useState<boolean>(true);
  const [methodologyOpen, setMethodologyOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMethodology={() => setMethodologyOpen(true)}
        showAdSlots={showAdSlots}
        setShowAdSlots={setShowAdSlots}
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
          <section className="lg:col-span-8 space-y-8">
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
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Live Data & Sources
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Purchasing Power Parity (PPP) and CPI inflation metrics query the official World Bank Open Data API v2, grounded in the ICP benchmark dataset.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600">
                <button
                  onClick={() => setMethodologyOpen(true)}
                  className="font-semibold hover:underline"
                >
                  View full methodology →
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

      {/* Editorial Footer */}
      <Footer
        onOpenMethodology={() => setMethodologyOpen(true)}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
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
