export type LanguageCode = 'ar' | 'en' | 'es' | 'ja' | 'id' | 'bn';

export interface CountryData {
  id: string;
  nameKey: string;
  flag: string;
  currencyCode: string;
  currencySymbol: string;
  exchangeRateToUSD: number; // 1 USD = X local currency
  costOfLivingIndex: number; // NYC = 100
  rentIndex: number;
  groceriesIndex: number;
  restaurantIndex: number;
  localPurchasingPowerIndex: number; // NYC = 100
  annualInflationRate: number; // % in 2025/2026
  avgMonthlyNetSalaryUSD: number; // Average local salary in USD
  demographics: {
    medianAge: number;
    lifeExpectancy: number;
    statutoryRetirementAge: number;
    dependencyRatio: number; // Dependents per 100 working-age (15-64)
    workingAgePopulationPct: number; // % aged 15-64
    dividendPeakYear: number;
    dividendPhaseKey: 'expanding' | 'prime_dividend' | 'maturing' | 'post_dividend_aging';
    pensionStabilityScore: number; // 0-100
  };
  sampleCostsUSD: {
    oneBedCityCenterRent: number;
    monthlyGroceries: number;
    internetFiber: number;
    casualDiningMeal: number;
    privateHealthInsurance: number;
    gymMembership: number;
  };
}

export interface PPPComparisonResult {
  sourceCountry: CountryData;
  targetCountry: CountryData;
  sourceSalary: number;
  targetEquivalentSalaryLocal: number;
  targetEquivalentSalaryUSD: number;
  costOfLivingRatio: number; // target / source
  costDifferencePct: number;
  rentDifferencePct: number;
  groceriesDifferencePct: number;
  diningDifferencePct: number;
  localPurchasingPowerDiffPct: number;
  inflationErosion: {
    year1Source: number;
    year1Target: number;
    year3Source: number;
    year3Target: number;
    year5Source: number;
    year5Target: number;
  };
  verdictKey: 'cheaper_lifestyle' | 'similar_lifestyle' | 'more_expensive';
  purchasingPowerMultiplier: number;
}

export interface DemographicProjectionResult {
  country: CountryData;
  currentAge: number;
  targetRetirementAge: number;
  yearsToRetirement: number;
  retirementYearsExpected: number;
  projectedDependencyRatioAtRetirement: number;
  replacementRateNeededPct: number;
  systemStrainLevel: 'low' | 'moderate' | 'high' | 'critical';
  dividendPhase: string;
  demographicInsightKey: string;
}

export interface RemoteSalaryResult {
  targetCountry: CountryData;
  usdMonthly: number;
  localMonthly: number;
  localAnnual: number;
  purchasingPowerMultiplier: number;
  effectiveUSDValue: number;
  localIncomePercentile: number; // e.g. 98 -> top 2%
  lifestyleTierKey: 'entry' | 'comfortable' | 'expat_luxury' | 'elite';
  budgetBreakdown: {
    rent: number;
    groceries: number;
    diningAndEntertainment: number;
    utilitiesAndInternet: number;
    healthcare: number;
    discretionarySavings: number;
  };
  savingsRatePct: number;
}
