import React, { useState, useId } from 'react';
import { useI18n } from '../i18n';
import { COUNTRIES } from '../data/countries';
import { calculateRemoteSalary, formatCurrency, formatUSD } from '../utils/calculator';
import { AdSlot } from './AdSlot';
import {
  DollarSign,
  TrendingUp,
  Award,
  Home,
  ShoppingBag,
  Coffee,
  Wifi,
  HeartPulse,
  PiggyBank,
  Sparkles,
} from 'lucide-react';

interface Props {
  showAdSlots: boolean;
}

const PRESET_AMOUNTS = [1500, 3000, 5000, 8000, 12000];

export const RemoteSalaryConverter: React.FC<Props> = ({ showAdSlots }) => {
  const { t } = useI18n();
  const destinationSelectId = useId();
  const remoteIncomeInputId = useId();

  const [targetId, setTargetId] = useState<string>('AR');
  const [usdAmount, setUsdAmount] = useState<number>(3500);

  const targetCountry = COUNTRIES.find((c) => c.id === targetId) || COUNTRIES[2];
  const result = calculateRemoteSalary(usdAmount, targetCountry);

  const getCountryName = (nameKey: string) => {
    return t.countries[nameKey as keyof typeof t.countries] || nameKey;
  };

  const getLifestyleTier = (key: string) => {
    switch (key) {
      case 'entry':
        return { label: t.tool3.tierEntry, color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'comfortable':
        return { label: t.tool3.tierComfortable, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'expat_luxury':
        return { label: t.tool3.tierExpatLuxury, color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'elite':
      default:
        return { label: t.tool3.tierElite, color: 'bg-amber-50 text-amber-800 border-amber-200' };
    }
  };

  const tier = getLifestyleTier(result.lifestyleTierKey);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="max-w-3xl">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {t.tool3.title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
          {t.tool3.subtitle}
        </p>
      </div>

      {/* Input Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        {/* USD Monthly Input */}
        <div className="md:col-span-6 space-y-3">
          <label htmlFor={remoteIncomeInputId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
            {t.tool3.remoteUSDLabel}
          </label>
          <div className="relative rounded-xl shadow-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <span className="text-slate-500 font-bold">$</span>
            </div>
            <input
              id={remoteIncomeInputId}
              type="number"
              min={200}
              step={100}
              value={usdAmount}
              onChange={(e) => setUsdAmount(Number(e.target.value) || 0)}
              className="block w-full rounded-xl border border-slate-300 bg-white py-3 pl-8 pr-4 text-base font-bold tabular-nums text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {PRESET_AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => setUsdAmount(amt)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  usdAmount === amt
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                ${amt.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Country Dropdown */}
        <div className="md:col-span-6 space-y-3">
          <label htmlFor={destinationSelectId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
            {t.tool3.destinationLabel}
          </label>
          <select
            id={destinationSelectId}
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-300 bg-slate-50/70 px-4 py-3 text-sm font-semibold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
          >
            {COUNTRIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} {getCountryName(c.nameKey)} ({c.currencyCode})
              </option>
            ))}
          </select>
          <div className="flex justify-between text-[11px] text-slate-500 pt-1">
            <span>COL Index: {targetCountry.costOfLivingIndex.toFixed(1)}</span>
            <span>Avg Local Net Salary: {formatUSD(targetCountry.avgMonthlyNetSalaryUSD)}/mo</span>
          </div>
        </div>
      </div>

      {/* Primary Arbitrage Result Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Effective US Lifestyle Equivalent */}
        <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-medium text-indigo-200 uppercase tracking-wider">
                  {t.tool3.effectiveValueTitle}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums text-white">
                  {formatUSD(result.effectiveUSDValue)}
                  <span className="text-lg font-normal text-indigo-300">{t.common.perMonth}</span>
                </span>
                <span className="text-sm font-semibold text-amber-400 tabular-nums">
                  ({result.purchasingPowerMultiplier}x Multiplier)
                </span>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-indigo-200/90 leading-relaxed max-w-xl">
                {t.tool3.effectiveValueDesc} Earning <strong className="text-white">${usdAmount.toLocaleString()} USD</strong> in {getCountryName(targetCountry.nameKey)} affords you the standard of living of an annual salary of{' '}
                <strong className="text-emerald-400 font-mono">${(result.effectiveUSDValue * 12).toLocaleString()} USD/yr</strong> in major US metro centers.
              </p>
            </div>

            <div className="pt-4 border-t border-indigo-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-indigo-200">
              <div>
                <span className="text-slate-400">{t.tool3.localCurrencyValue}:</span>{' '}
                <strong className="text-white font-mono text-sm">
                  {formatCurrency(result.localMonthly, targetCountry.currencyCode, targetCountry.currencySymbol)}
                  {t.common.perMonth}
                </strong>
              </div>
              <div className="text-indigo-300">
                Annual: {formatCurrency(result.localAnnual, targetCountry.currencyCode, targetCountry.currencySymbol)}
              </div>
            </div>
          </div>
        </div>

        {/* Local Earner Percentile & Tier Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Local Standing
              </span>
              <Award className="h-4 w-4 text-indigo-500" />
            </div>

            <div className="mt-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${tier.color}`}>
                {tier.label}
              </span>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tabular-nums text-slate-900">
                  Top {(100 - result.localIncomePercentile).toFixed(1)}%
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                {t.tool3.incomePercentileText} in {getCountryName(targetCountry.nameKey)}. You earn approx.{' '}
                <strong className="text-slate-900">
                  {(usdAmount / targetCountry.avgMonthlyNetSalaryUSD).toFixed(1)}x
                </strong>{' '}
                the national average monthly salary.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">{t.tool3.savingsRateLabel}:</span>
            <span className="font-bold tabular-nums text-emerald-600 text-sm">
              {result.savingsRatePct}% ({formatUSD(result.budgetBreakdown.discretionarySavings)}/mo)
            </span>
          </div>
        </div>
      </div>

      {/* AdSense In-Feed Slot */}
      {showAdSlots && <AdSlot type="in-feed" slotId="5029184736" />}

      {/* Realistic Monthly Expense Basket */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {t.tool3.monthlyBudgetTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulated expenditures in {getCountryName(targetCountry.nameKey)} for a high-comfort remote professional.
            </p>
          </div>
          <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 self-start sm:self-auto">
            Surplus Savings: {formatUSD(result.budgetBreakdown.discretionarySavings)} ({result.savingsRatePct}%)
          </div>
        </div>

        {/* Visual Budget Progress Bar */}
        <div className="mb-6">
          <div className="h-4 w-full rounded-full bg-slate-100 overflow-hidden flex">
            {/* Rent */}
            <div
              title={`Rent: $${result.budgetBreakdown.rent}`}
              style={{ width: `${(result.budgetBreakdown.rent / usdAmount) * 100}%` }}
              className="bg-indigo-600 h-full"
            />
            {/* Groceries */}
            <div
              title={`Groceries: $${result.budgetBreakdown.groceries}`}
              style={{ width: `${(result.budgetBreakdown.groceries / usdAmount) * 100}%` }}
              className="bg-sky-500 h-full"
            />
            {/* Dining */}
            <div
              title={`Dining: $${result.budgetBreakdown.diningAndEntertainment}`}
              style={{ width: `${(result.budgetBreakdown.diningAndEntertainment / usdAmount) * 100}%` }}
              className="bg-amber-500 h-full"
            />
            {/* Net & Utilities */}
            <div
              title={`Net & Utilities: $${result.budgetBreakdown.utilitiesAndInternet}`}
              style={{ width: `${(result.budgetBreakdown.utilitiesAndInternet / usdAmount) * 100}%` }}
              className="bg-purple-500 h-full"
            />
            {/* Health */}
            <div
              title={`Health: $${result.budgetBreakdown.healthcare}`}
              style={{ width: `${(result.budgetBreakdown.healthcare / usdAmount) * 100}%` }}
              className="bg-rose-500 h-full"
            />
            {/* Savings */}
            <div
              title={`Savings: $${result.budgetBreakdown.discretionarySavings}`}
              style={{ width: `${(result.budgetBreakdown.discretionarySavings / usdAmount) * 100}%` }}
              className="bg-emerald-500 h-full"
            />
          </div>
        </div>

        {/* Detailed Item List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Rent */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                <Home className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">{t.tool3.rentLuxury}</p>
                <p className="text-[11px] text-slate-500">Prime location</p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-900 tabular-nums">
              {formatUSD(result.budgetBreakdown.rent)}
            </span>
          </div>

          {/* Groceries */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">{t.tool3.groceriesImports}</p>
                <p className="text-[11px] text-slate-500">Fresh foods & gourmet</p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-900 tabular-nums">
              {formatUSD(result.budgetBreakdown.groceries)}
            </span>
          </div>

          {/* Dining */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                <Coffee className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">{t.tool3.diningLeisure}</p>
                <p className="text-[11px] text-slate-500">30+ outings / delivery</p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-900 tabular-nums">
              {formatUSD(result.budgetBreakdown.diningAndEntertainment)}
            </span>
          </div>

          {/* Internet & Utilities */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                <Wifi className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">{t.tool3.internetUtilities}</p>
                <p className="text-[11px] text-slate-500">Fiber + co-working</p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-900 tabular-nums">
              {formatUSD(result.budgetBreakdown.utilitiesAndInternet)}
            </span>
          </div>

          {/* Private Healthcare */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
                <HeartPulse className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">{t.tool3.privateHealth}</p>
                <p className="text-[11px] text-slate-500">Top-tier hospital network</p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-900 tabular-nums">
              {formatUSD(result.budgetBreakdown.healthcare)}
            </span>
          </div>

          {/* Monthly Savings Surplus */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-200 bg-emerald-50/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                <PiggyBank className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-950">{t.tool3.potentialSavings}</p>
                <p className="text-[11px] text-emerald-700 font-medium">Free capital accumulation</p>
              </div>
            </div>
            <span className="text-xs font-extrabold text-emerald-700 tabular-nums">
              {formatUSD(result.budgetBreakdown.discretionarySavings)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
