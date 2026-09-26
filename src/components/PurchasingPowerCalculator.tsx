import React, { useState, useEffect, useId } from 'react';
import { useI18n } from '../i18n';
import { COUNTRIES, PRESET_SCENARIOS } from '../data/countries';
import { calculatePurchasingPower, formatCurrency, formatUSD } from '../utils/calculator';
import { getLiveCountryIndicators, LiveIndicatorState } from '../utils/worldBankApi';
import { ComparisonBarChart } from './ComparisonBarChart';
import { AdSlot } from './AdSlot';
import {
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Share2,
  Check,
  Building,
  ShoppingCart,
  Utensils,
  Wallet,
  ShieldAlert,
  Radio,
  RefreshCw,
} from 'lucide-react';

interface Props {
  showAdSlots: boolean;
}

export const PurchasingPowerCalculator: React.FC<Props> = ({ showAdSlots }) => {
  const { t } = useI18n();
  const sourceCountrySelectId = useId();
  const targetCountrySelectId = useId();
  const salaryInputId = useId();

  const [sourceId, setSourceId] = useState<string>('US');
  const [targetId, setTargetId] = useState<string>('AR');
  const [salary, setSalary] = useState<number>(5000);
  const [copied, setCopied] = useState<boolean>(false);

  // Live World Bank API state & fallback indicator
  const [sourceLive, setSourceLive] = useState<LiveIndicatorState | null>(null);
  const [targetLive, setTargetLive] = useState<LiveIndicatorState | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(false);

  const sourceCountry = COUNTRIES.find((c) => c.id === sourceId) || COUNTRIES[0];
  const targetCountry = COUNTRIES.find((c) => c.id === targetId) || COUNTRIES[2];

  // Fetch real-time World Bank data on country change, falling back seamlessly
  useEffect(() => {
    let isCancelled = false;
    async function fetchLiveIndicators() {
      setIsLoadingApi(true);
      try {
        const [srcData, tgtData] = await Promise.all([
          getLiveCountryIndicators(sourceCountry),
          getLiveCountryIndicators(targetCountry),
        ]);
        if (!isCancelled) {
          setSourceLive(srcData);
          setTargetLive(tgtData);
        }
      } catch {
        // Handled silently by fallback
      } finally {
        if (!isCancelled) {
          setIsLoadingApi(false);
        }
      }
    }

    fetchLiveIndicators();
    return () => {
      isCancelled = true;
    };
  }, [sourceId, targetId, sourceCountry, targetCountry]);

  // Use live inflation rates if returned from World Bank API, otherwise use country baseline
  const activeSourceInflation = sourceLive?.inflationRate ?? sourceCountry.annualInflationRate;
  const activeTargetInflation = targetLive?.inflationRate ?? targetCountry.annualInflationRate;

  const result = calculatePurchasingPower(
    sourceCountry,
    targetCountry,
    salary,
    activeSourceInflation,
    activeTargetInflation
  );

  const handlePresetSelect = (presetId: string) => {
    const preset = PRESET_SCENARIOS.find((p) => p.id === presetId);
    if (preset) {
      setSourceId(preset.sourceCountryId);
      setTargetId(preset.targetCountryId);
      setSalary(preset.defaultSalary);
    }
  };

  const handleShare = () => {
    const summary = `${sourceCountry.flag} ${t.countries[sourceCountry.nameKey as keyof typeof t.countries]} (${formatCurrency(salary, sourceCountry.currencyCode, sourceCountry.currencySymbol)}) → ${targetCountry.flag} ${t.countries[targetCountry.nameKey as keyof typeof t.countries]} Equivalent: ${formatCurrency(result.targetEquivalentSalaryLocal, targetCountry.currencyCode, targetCountry.currencySymbol)} (${formatUSD(result.targetEquivalentSalaryUSD)}/mo). Relative Cost: ${result.costDifferencePct > 0 ? '+' : ''}${result.costDifferencePct.toFixed(1)}%. Calculated via EquiLiving.`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const getCountryName = (nameKey: string) => {
    return t.countries[nameKey as keyof typeof t.countries] || nameKey;
  };

  return (
    <div className="space-y-8">
      {/* Tool Header & Live API Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {t.tool1.title}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            {t.tool1.subtitle}
          </p>
        </div>

        {/* Live Data Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs">
          <Radio className={`h-3.5 w-3.5 ${sourceLive?.isLive || targetLive?.isLive ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
          <div className="text-[11px] leading-tight text-left">
            <div className="font-semibold text-slate-800 flex items-center gap-1">
              <span>{sourceLive?.isLive || targetLive?.isLive ? 'World Bank Live API' : 'Cached Fallback Data'}</span>
              {isLoadingApi && <RefreshCw className="h-2.5 w-2.5 animate-spin text-indigo-600" />}
            </div>
            <span className="text-slate-500">
              {sourceLive?.isLive ? `Updated (${sourceLive.inflationYear})` : 'Offline ICP Baseline'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {t.common.presets}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_SCENARIOS.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePresetSelect(p.id)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors whitespace-nowrap shadow-xs cursor-pointer"
            >
              {t.presets[p.titleKey as keyof typeof t.presets] || p.titleKey}
            </button>
          ))}
        </div>
      </div>

      {/* Input Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        {/* Origin Country */}
        <div className="lg:col-span-4 space-y-2">
          <label htmlFor={sourceCountrySelectId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
            {t.common.sourceCountry}
          </label>
          <div className="relative">
            <select
              id={sourceCountrySelectId}
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-300 bg-slate-50/70 px-4 py-3 text-sm font-semibold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
            >
              {COUNTRIES.map((c) => (
                <option key={`src-${c.id}`} value={c.id}>
                  {c.flag} {getCountryName(c.nameKey)} ({c.currencyCode})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>COL Index: {sourceCountry.costOfLivingIndex.toFixed(1)}</span>
            <span className="font-semibold text-slate-700">
              CPI Inflation: {activeSourceInflation}% {sourceLive?.isLive && '• Live'}
            </span>
          </div>
        </div>

        {/* Arrow divider */}
        <div className="hidden lg:flex lg:col-span-1 items-center justify-center pt-6 text-slate-400">
          <ArrowRight className="h-5 w-5" />
        </div>

        {/* Destination Country */}
        <div className="lg:col-span-4 space-y-2">
          <label htmlFor={targetCountrySelectId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
            {t.common.targetCountry}
          </label>
          <div className="relative">
            <select
              id={targetCountrySelectId}
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-300 bg-slate-50/70 px-4 py-3 text-sm font-semibold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
            >
              {COUNTRIES.map((c) => (
                <option key={`dst-${c.id}`} value={c.id}>
                  {c.flag} {getCountryName(c.nameKey)} ({c.currencyCode})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>COL Index: {targetCountry.costOfLivingIndex.toFixed(1)}</span>
            <span className="font-semibold text-slate-700">
              CPI Inflation: {activeTargetInflation}% {targetLive?.isLive && '• Live'}
            </span>
          </div>
        </div>

        {/* Source Salary Input */}
        <div className="lg:col-span-3 space-y-2">
          <label htmlFor={salaryInputId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
            {t.tool1.sourceSalaryLabel} ({sourceCountry.currencyCode})
          </label>
          <div className="relative rounded-xl shadow-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <span className="text-slate-500 sm:text-sm font-medium">{sourceCountry.currencySymbol}</span>
            </div>
            <input
              id={salaryInputId}
              type="number"
              min={100}
              step={100}
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value) || 0)}
              className="block w-full rounded-xl border border-slate-300 bg-white py-3 pl-8 pr-4 text-sm font-semibold tabular-nums text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>≈ {formatUSD(salary / sourceCountry.exchangeRateToUSD)} USD</span>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Share2 className="h-3 w-3" />}
              {copied ? t.common.copied : t.common.shareLink}
            </button>
          </div>
        </div>
      </div>

      {/* Strategic AdSense Slot: Between Calculator and Results */}
      {showAdSlots && (
        <AdSlot
          type="between-results"
          slotId="4819203951"
          className="my-4"
        />
      )}

      {/* Primary Result Headline Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Equivalent Target Salary Card */}
        <div className="md:col-span-2 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-6 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
            <div>
              <span className="text-xs font-medium text-indigo-200 uppercase tracking-wider">
                {t.tool1.equivalentSalaryTitle}
              </span>
              <div className="mt-2 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums text-white">
                  {formatCurrency(result.targetEquivalentSalaryLocal, targetCountry.currencyCode, targetCountry.currencySymbol)}
                </span>
                <span className="text-sm font-medium text-indigo-300 tabular-nums">
                  ({formatUSD(result.targetEquivalentSalaryUSD)} USD{t.common.perMonth})
                </span>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-indigo-200/90 leading-relaxed max-w-xl">
                {t.tool1.equivalentSalaryDesc}
              </p>
            </div>

            <div className="pt-4 border-t border-indigo-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-indigo-200">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">
                  {targetCountry.flag} {getCountryName(targetCountry.nameKey)}
                </span>
                <span>·</span>
                <span>COL Index: {targetCountry.costOfLivingIndex.toFixed(1)}</span>
              </div>
              <div className="text-indigo-300">
                1 USD = {targetCountry.exchangeRateToUSD} {targetCountry.currencyCode}
              </div>
            </div>
          </div>
        </div>

        {/* Cost Difference Verdict Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {t.tool1.costOfLivingDiff}
              </span>
              {result.costDifferencePct < 0 ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <TrendingDown className="h-4 w-4" />
                  {Math.abs(result.costDifferencePct).toFixed(1)}% CHEAPER
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                  <TrendingUp className="h-4 w-4" />
                  +{result.costDifferencePct.toFixed(1)}% EXPENSIVE
                </span>
              )}
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-bold text-slate-900">
                {result.verdictKey === 'cheaper_lifestyle'
                  ? t.tool1.verdictCheaper
                  : result.verdictKey === 'more_expensive'
                  ? t.tool1.verdictExpensive
                  : t.tool1.verdictSimilar}
              </h2>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                {result.verdictKey === 'cheaper_lifestyle'
                  ? t.tool1.cheaperLifestyleExplanation
                  : result.verdictKey === 'more_expensive'
                  ? t.tool1.expensiveLifestyleExplanation
                  : t.tool1.similarLifestyleExplanation}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Purchasing Power Multiplier:</span>
            <span className="font-bold tabular-nums text-slate-900">
              {result.purchasingPowerMultiplier.toFixed(2)}x
            </span>
          </div>
        </div>
      </div>

      {/* Chart.js Comparison Bar Chart */}
      <ComparisonBarChart
        sourceCountry={sourceCountry}
        targetCountry={targetCountry}
        result={result}
      />

      {/* Living Cost Category Breakdowns Grid */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Key Living Cost Index Differentials
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Rent Index */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold">{t.tool1.rentDiff}</span>
              <Building className="h-4 w-4 text-indigo-500" />
            </div>
            <div className={`text-xl font-bold tabular-nums ${result.rentDifferencePct < 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
              {result.rentDifferencePct < 0 ? '' : '+'}
              {result.rentDifferencePct.toFixed(1)}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              1BR Center: {formatUSD(targetCountry.sampleCostsUSD.oneBedCityCenterRent)}/mo
            </p>
          </div>

          {/* Groceries Index */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold">{t.tool1.groceriesDiff}</span>
              <ShoppingCart className="h-4 w-4 text-emerald-500" />
            </div>
            <div className={`text-xl font-bold tabular-nums ${result.groceriesDifferencePct < 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
              {result.groceriesDifferencePct < 0 ? '' : '+'}
              {result.groceriesDifferencePct.toFixed(1)}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Monthly Basket: {formatUSD(targetCountry.sampleCostsUSD.monthlyGroceries)}
            </p>
          </div>

          {/* Restaurant & Dining */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold">{t.tool1.diningDiff}</span>
              <Utensils className="h-4 w-4 text-amber-500" />
            </div>
            <div className={`text-xl font-bold tabular-nums ${result.diningDifferencePct < 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
              {result.diningDifferencePct < 0 ? '' : '+'}
              {result.diningDifferencePct.toFixed(1)}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Casual Dining: {formatUSD(targetCountry.sampleCostsUSD.casualDiningMeal)}
            </p>
          </div>

          {/* Domestic Local Purchasing Power */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold">{t.tool1.localPurchasingPower}</span>
              <Wallet className="h-4 w-4 text-sky-500" />
            </div>
            <div className="text-xl font-bold tabular-nums text-slate-900">
              {targetCountry.localPurchasingPowerIndex.toFixed(1)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Avg Local Salary: {formatUSD(targetCountry.avgMonthlyNetSalaryUSD)}
            </p>
          </div>
        </div>
      </div>

      {/* Inflation Erosion Trajectory Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {t.tool1.inflationErosionTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.tool1.inflationErosionDesc}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 inline-block" />
              {sourceCountry.flag} {getCountryName(sourceCountry.nameKey)} ({activeSourceInflation}%)
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
              {targetCountry.flag} {getCountryName(targetCountry.nameKey)} ({activeTargetInflation}%)
            </span>
          </div>
        </div>

        {/* 1, 3, 5 Year Horizon Comparison */}
        <div className="space-y-4">
          {/* Year 1 */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>{t.tool1.retainedPower1Yr}</span>
              <span className="tabular-nums">
                {sourceCountry.flag} ${result.inflationErosion.year1Source} vs {targetCountry.flag} ${result.inflationErosion.year1Target}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 h-4">
              <div className="w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${result.inflationErosion.year1Source}%` }}
                />
              </div>
              <div className="w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${result.inflationErosion.year1Target}%` }}
                />
              </div>
            </div>
          </div>

          {/* Year 3 */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>{t.tool1.retainedPower3Yr}</span>
              <span className="tabular-nums">
                {sourceCountry.flag} ${result.inflationErosion.year3Source} vs {targetCountry.flag} ${result.inflationErosion.year3Target}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 h-4">
              <div className="w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${result.inflationErosion.year3Source}%` }}
                />
              </div>
              <div className="w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${result.inflationErosion.year3Target}%` }}
                />
              </div>
            </div>
          </div>

          {/* Year 5 */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>{t.tool1.retainedPower5Yr}</span>
              <span className="tabular-nums">
                {sourceCountry.flag} ${result.inflationErosion.year5Source} vs {targetCountry.flag} ${result.inflationErosion.year5Target}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 h-4">
              <div className="w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${result.inflationErosion.year5Source}%` }}
                />
              </div>
              <div className="w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${result.inflationErosion.year5Target}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {activeTargetInflation > 15 && (
          <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-amber-50 p-3 text-xs text-amber-900 border border-amber-200">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
            <div>
              <span className="font-bold">High Inflation Context ({activeTargetInflation}%):</span>{' '}
              In economies with accelerated inflation (e.g. Argentina), prices in local currency adjust rapidly. Digital nomads and expats typically maintain liquid reserves in hard currencies (USD/EUR) or inflation-hedged index instruments.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
