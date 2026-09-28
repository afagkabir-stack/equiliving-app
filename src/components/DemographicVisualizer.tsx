import React, { useState, useId } from 'react';
import { useI18n } from '../i18n';
import { COUNTRIES } from '../data/countries';
import { calculateDemographics } from '../utils/calculator';
import { AdSlot } from './AdSlot';
import {
  Users,
  Calendar,
  Hourglass,
  Activity,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

interface Props {
  showAdSlots: boolean;
}

export const DemographicVisualizer: React.FC<Props> = ({ showAdSlots }) => {
  const { t } = useI18n();
  const countrySelectId = useId();
  const currentAgeId = useId();
  const retirementAgeId = useId();

  const [countryId, setCountryId] = useState<string>('JP');
  const [currentAge, setCurrentAge] = useState<number>(32);
  const [targetRetirementAge, setTargetRetirementAge] = useState<number>(65);

  const country = COUNTRIES.find((c) => c.id === countryId) || COUNTRIES[1];
  const result = calculateDemographics(country, currentAge, targetRetirementAge);

  const getCountryName = (nameKey: string) => {
    return t.countries[nameKey as keyof typeof t.countries] || nameKey;
  };

  const getStrainBadge = (level: string) => {
    switch (level) {
      case 'low':
        return {
          label: t.tool2.strainLow,
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <CheckCircle className="h-4 w-4" />,
        };
      case 'moderate':
        return {
          label: t.tool2.strainModerate,
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: <Activity className="h-4 w-4" />,
        };
      case 'high':
        return {
          label: t.tool2.strainHigh,
          color: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: <AlertTriangle className="h-4 w-4" />,
        };
      case 'critical':
      default:
        return {
          label: t.tool2.strainCritical,
          color: 'bg-rose-50 text-rose-800 border-rose-200',
          icon: <AlertTriangle className="h-4 w-4" />,
        };
    }
  };

  const strainBadge = getStrainBadge(result.systemStrainLevel);

  const getPhaseName = (phase: string) => {
    switch (phase) {
      case 'expanding':
        return t.tool2.phaseExpanding;
      case 'prime_dividend':
        return t.tool2.phasePrime;
      case 'maturing':
        return t.tool2.phaseMaturing;
      case 'post_dividend_aging':
      default:
        return t.tool2.phaseAging;
    }
  };

  const getInsightText = (insightKey: string) => {
    switch (insightKey) {
      case 'insight_aging_super_aged':
        return t.tool2.insightAging;
      case 'insight_youth_dividend':
        return t.tool2.insightYouth;
      case 'insight_prime_window':
        return t.tool2.insightPrime;
      case 'insight_maturing_workforce':
      default:
        return t.tool2.insightMaturing;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="max-w-3xl">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {t.tool2.title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
          {t.tool2.subtitle}
        </p>
      </div>

      {/* Controls Grid */}
      <div id="tour-demo-controls" className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        {/* Country Selector */}
        <div className="space-y-2">
          <label htmlFor={countrySelectId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
            {t.common.sourceCountry} / Target Economy
          </label>
          <select
            id={countrySelectId}
            value={countryId}
            onChange={(e) => setCountryId(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-300 bg-slate-50/70 px-4 py-3 text-sm font-semibold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
          >
            {COUNTRIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} {getCountryName(c.nameKey)}
              </option>
            ))}
          </select>
          <div className="flex justify-between text-[11px] text-slate-500 pt-1">
            <span>Life Expectancy: {country.demographics.lifeExpectancy} yrs</span>
            <span>Statutory Ret.: {country.demographics.statutoryRetirementAge}</span>
          </div>
        </div>

        {/* Current Age Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor={currentAgeId} className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
              {t.tool2.yourAgeLabel}
            </label>
            <span className="text-sm font-bold text-indigo-600 tabular-nums">
              {currentAge} years old
            </span>
          </div>
          <input
            id={currentAgeId}
            type="range"
            min={18}
            max={75}
            value={currentAge}
            onChange={(e) => setCurrentAge(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>18 yrs</span>
            <span>Median: {country.demographics.medianAge}</span>
            <span>75 yrs</span>
          </div>
        </div>

        {/* Target Retirement Age Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor={retirementAgeId} className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
              {t.tool2.retirementAgeLabel}
            </label>
            <span className="text-sm font-bold text-indigo-600 tabular-nums">
              {targetRetirementAge} years old
            </span>
          </div>
          <input
            id={retirementAgeId}
            type="range"
            min={Math.max(50, currentAge)}
            max={80}
            value={targetRetirementAge}
            onChange={(e) => setTargetRetirementAge(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>50 yrs</span>
            <span>National: {country.demographics.statutoryRetirementAge}</span>
            <span>80 yrs</span>
          </div>
        </div>
      </div>

      {/* Longevity & Timeline Horizon Bar */}
      <div id="tour-demo-longevity" className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-2">
          Personal Longevity & Working Timeline
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Based on national life expectancy of {country.demographics.lifeExpectancy} years in {getCountryName(country.nameKey)}.
        </p>

        {/* Visual Dual Timeline */}
        <div className="space-y-2">
          <div className="h-6 w-full rounded-xl bg-slate-100 overflow-hidden flex">
            {/* Working Years */}
            <div
              style={{
                width: `${Math.min(100, Math.max(15, (result.yearsToRetirement / (result.yearsToRetirement + result.retirementYearsExpected)) * 100))}%`,
              }}
              className="bg-indigo-600 h-full flex items-center justify-center text-[11px] font-semibold text-white px-2 truncate"
            >
              Working: {result.yearsToRetirement} yrs
            </div>
            {/* Retirement Years */}
            <div
              style={{
                width: `${Math.min(100, Math.max(15, (result.retirementYearsExpected / (result.yearsToRetirement + result.retirementYearsExpected)) * 100))}%`,
              }}
              className="bg-emerald-500 h-full flex items-center justify-center text-[11px] font-semibold text-white px-2 truncate"
            >
              Retirement: {result.retirementYearsExpected} yrs
            </div>
          </div>

          <div className="flex justify-between text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 inline-block" />
              {t.tool2.yearsRemaining}: <strong className="text-slate-800">{result.yearsToRetirement} years</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
              {t.tool2.expectedRetirementDuration}: <strong className="text-slate-800">{result.retirementYearsExpected} years</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Demographic Indicators Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* National Demographic Phase */}
        <div id="tour-demo-phase" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">{t.tool2.dividendStatusTitle}</span>
              <Users className="h-4 w-4 text-indigo-500" />
            </div>
            <h3 className="mt-3 text-lg font-bold text-slate-900 leading-snug">
              {getPhaseName(country.demographics.dividendPhaseKey)}
            </h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Peak Demographic Dividend Year: <strong className="text-slate-900 font-mono">{country.demographics.dividendPeakYear}</strong>
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Working Age (15-64):</span>
            <span className="font-bold tabular-nums text-slate-900">{country.demographics.workingAgePopulationPct}%</span>
          </div>
        </div>

        {/* Dependency Ratio Shift */}
        <div id="tour-demo-dependency" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">{t.tool2.dependencyRatioNow}</span>
              <TrendingUp className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tabular-nums text-slate-900">
                {country.demographics.dependencyRatio.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500">per 100 workers</span>
            </div>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              {t.tool2.dependencyRatioAtRetirement}:{' '}
              <strong className="text-slate-900 tabular-nums">
                {result.projectedDependencyRatioAtRetirement.toFixed(1)} per 100
              </strong>
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Shift Delta:</span>
            <span className="font-bold tabular-nums text-amber-600">
              +{Math.max(0, result.projectedDependencyRatioAtRetirement - country.demographics.dependencyRatio).toFixed(1)} pts
            </span>
          </div>
        </div>

        {/* State Pension Strain & Replacement Rate */}
        <div id="tour-demo-pension" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">{t.tool2.pensionStrainTitle}</span>
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${strainBadge.color}`}>
                {strainBadge.icon}
                {strainBadge.label}
              </span>
            </div>
            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              {t.tool2.replacementRateRecommended}:{' '}
              <strong className="text-indigo-600 font-bold tabular-nums">{result.replacementRateNeededPct}%</strong> of current net income.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Pension System Index:</span>
            <span className="font-bold tabular-nums text-slate-900">{country.demographics.pensionStabilityScore}/100</span>
          </div>
        </div>
      </div>

      {/* AdSense In-Feed placement */}
      {showAdSlots && <AdSlot type="in-feed" slotId="9381726451" />}

      {/* Strategic Demographic Insight Card */}
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5 sm:p-6 text-slate-800">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 shrink-0 mt-0.5">
            <Users className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-indigo-950">
              Demographic Trajectory & Financial Strategy for {getCountryName(country.nameKey)}
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {getInsightText(result.demographicInsightKey)}
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-500">
              <span>Median Age: <strong className="text-slate-800">{country.demographics.medianAge} yrs</strong></span>
              <span>·</span>
              <span>Retirement Age: <strong className="text-slate-800">{country.demographics.statutoryRetirementAge}</strong></span>
              <span>·</span>
              <span>Life Expectancy: <strong className="text-slate-800">{country.demographics.lifeExpectancy} yrs</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
