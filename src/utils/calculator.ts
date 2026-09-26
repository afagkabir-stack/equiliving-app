import { CountryData, PPPComparisonResult, DemographicProjectionResult, RemoteSalaryResult } from '../types';

/**
 * Standard Purchasing Power Parity (PPP) Calculation
 * Based on World Bank International Comparison Program (ICP) & relative price level indices
 */
export function calculatePurchasingPower(
  sourceCountry: CountryData,
  targetCountry: CountryData,
  sourceSalary: number,
  overrideSourceInflation?: number,
  overrideTargetInflation?: number
): PPPComparisonResult {
  const safeSourceSalary = Math.max(0, sourceSalary);
  
  // Cost of living ratio (NYC = 100 baseline)
  const costOfLivingRatio = targetCountry.costOfLivingIndex / sourceCountry.costOfLivingIndex;
  
  // Convert source salary to USD
  const sourceSalaryUSD = safeSourceSalary / sourceCountry.exchangeRateToUSD;
  
  // Target equivalent salary in USD that yields identical basket of goods & services
  const targetEquivalentSalaryUSD = sourceSalaryUSD * costOfLivingRatio;
  
  // Equivalent in target local currency
  const targetEquivalentSalaryLocal = targetEquivalentSalaryUSD * targetCountry.exchangeRateToUSD;
  
  // Percentage differentials
  const costDifferencePct = ((targetCountry.costOfLivingIndex - sourceCountry.costOfLivingIndex) / sourceCountry.costOfLivingIndex) * 100;
  const rentDifferencePct = ((targetCountry.rentIndex - sourceCountry.rentIndex) / sourceCountry.rentIndex) * 100;
  const groceriesDifferencePct = ((targetCountry.groceriesIndex - sourceCountry.groceriesIndex) / sourceCountry.groceriesIndex) * 100;
  const diningDifferencePct = ((targetCountry.restaurantIndex - sourceCountry.restaurantIndex) / sourceCountry.restaurantIndex) * 100;
  const localPurchasingPowerDiffPct = ((targetCountry.localPurchasingPowerIndex - sourceCountry.localPurchasingPowerIndex) / sourceCountry.localPurchasingPowerIndex) * 100;

  // Real purchasing power multiplier (e.g., $100 in US buys $250 worth of goods in Argentina)
  const purchasingPowerMultiplier = sourceCountry.costOfLivingIndex / targetCountry.costOfLivingIndex;

  // Inflation erosion calculation: Real value remaining of nominal $100 after 1, 3, 5 years
  const sourceInflationRate = overrideSourceInflation !== undefined ? overrideSourceInflation : sourceCountry.annualInflationRate;
  const targetInflationRate = overrideTargetInflation !== undefined ? overrideTargetInflation : targetCountry.annualInflationRate;

  const sourceInflation = Math.max(0, sourceInflationRate) / 100;
  const targetInflation = Math.max(0, targetInflationRate) / 100;

  const getPurchasingPowerRetained = (rate: number, years: number) => {
    return Math.round(100 / Math.pow(1 + rate, years));
  };

  const inflationErosion = {
    year1Source: getPurchasingPowerRetained(sourceInflation, 1),
    year1Target: getPurchasingPowerRetained(targetInflation, 1),
    year3Source: getPurchasingPowerRetained(sourceInflation, 3),
    year3Target: getPurchasingPowerRetained(targetInflation, 3),
    year5Source: getPurchasingPowerRetained(sourceInflation, 5),
    year5Target: getPurchasingPowerRetained(targetInflation, 5),
  };

  let verdictKey: 'cheaper_lifestyle' | 'similar_lifestyle' | 'more_expensive' = 'similar_lifestyle';
  if (costDifferencePct < -12) {
    verdictKey = 'cheaper_lifestyle';
  } else if (costDifferencePct > 12) {
    verdictKey = 'more_expensive';
  }

  return {
    sourceCountry,
    targetCountry,
    sourceSalary: safeSourceSalary,
    targetEquivalentSalaryLocal,
    targetEquivalentSalaryUSD,
    costOfLivingRatio,
    costDifferencePct,
    rentDifferencePct,
    groceriesDifferencePct,
    diningDifferencePct,
    localPurchasingPowerDiffPct,
    inflationErosion,
    verdictKey,
    purchasingPowerMultiplier,
  };
}

/**
 * Demographic Dividend & Retirement Age Visualizer Calculation
 * Projects dependency ratios, pension stress, and longevity horizons
 */
export function calculateDemographics(
  country: CountryData,
  currentAge: number,
  targetRetirementAge: number
): DemographicProjectionResult {
  const safeAge = Math.min(Math.max(18, currentAge), 90);
  const safeRetirement = Math.max(safeAge, Math.min(targetRetirementAge, 85));

  const yearsToRetirement = Math.max(0, safeRetirement - safeAge);
  const retirementYearsExpected = Math.max(1, country.demographics.lifeExpectancy - safeRetirement);

  // Projected dependency ratio at retirement year (simple demographic trend extrapolation)
  const yearsDelta = yearsToRetirement;
  const currentRatio = country.demographics.dependencyRatio;
  
  // Aging countries trend upwards ~0.4 - 0.7 points per year, young dividend countries slower
  const agingFactor = country.demographics.dividendPhaseKey === 'post_dividend_aging' ? 0.65 : 
                      country.demographics.dividendPhaseKey === 'maturing' ? 0.45 : 0.25;
  const projectedDependencyRatioAtRetirement = Math.min(95, Math.round(currentRatio + (yearsDelta * agingFactor)));

  // Target replacement rate needed: recommended % of pre-retirement net income
  // Higher dependency ratio and lower pension stability requires higher personal savings replacement
  const baseReplacementRate = 70; // Standard OECD benchmark
  const pensionOffset = (country.demographics.pensionStabilityScore - 50) * 0.25;
  const replacementRateNeededPct = Math.round(Math.min(90, Math.max(55, baseReplacementRate - pensionOffset)));

  // System strain classification
  let systemStrainLevel: 'low' | 'moderate' | 'high' | 'critical' = 'moderate';
  if (country.demographics.pensionStabilityScore > 75 && country.demographics.dependencyRatio < 55) {
    systemStrainLevel = 'low';
  } else if (country.demographics.pensionStabilityScore >= 55) {
    systemStrainLevel = 'moderate';
  } else if (country.demographics.pensionStabilityScore >= 45 || country.demographics.dependencyRatio > 65) {
    systemStrainLevel = 'high';
  } else {
    systemStrainLevel = 'critical';
  }

  let demographicInsightKey = 'insight_general';
  if (country.demographics.dividendPhaseKey === 'post_dividend_aging') {
    demographicInsightKey = 'insight_aging_super_aged';
  } else if (country.demographics.dividendPhaseKey === 'expanding') {
    demographicInsightKey = 'insight_youth_dividend';
  } else if (country.demographics.dividendPhaseKey === 'prime_dividend') {
    demographicInsightKey = 'insight_prime_window';
  } else {
    demographicInsightKey = 'insight_maturing_workforce';
  }

  return {
    country,
    currentAge: safeAge,
    targetRetirementAge: safeRetirement,
    yearsToRetirement,
    retirementYearsExpected: Math.round(retirementYearsExpected * 10) / 10,
    projectedDependencyRatioAtRetirement,
    replacementRateNeededPct,
    systemStrainLevel,
    dividendPhase: country.demographics.dividendPhaseKey,
    demographicInsightKey,
  };
}

/**
 * Freelance Remote Salary Converter
 * Calculates real-world purchasing power multiplier, lifestyle tier, and budget allocation in USD & local currency
 */
export function calculateRemoteSalary(
  usdMonthly: number,
  targetCountry: CountryData
): RemoteSalaryResult {
  const safeUSD = Math.max(100, usdMonthly);
  const localMonthly = safeUSD * targetCountry.exchangeRateToUSD;
  const localAnnual = localMonthly * 12;

  // Multiplier relative to US baseline ($100 index)
  const purchasingPowerMultiplier = 100 / targetCountry.costOfLivingIndex;
  const effectiveUSDValue = Math.round(safeUSD * purchasingPowerMultiplier);

  // Ratio compared to local average salary
  const ratioToAvgLocal = safeUSD / targetCountry.avgMonthlyNetSalaryUSD;

  let localIncomePercentile = 50;
  let lifestyleTierKey: 'entry' | 'comfortable' | 'expat_luxury' | 'elite' = 'comfortable';

  if (ratioToAvgLocal < 1.2) {
    localIncomePercentile = 60;
    lifestyleTierKey = 'entry';
  } else if (ratioToAvgLocal < 3.0) {
    localIncomePercentile = 85;
    lifestyleTierKey = 'comfortable';
  } else if (ratioToAvgLocal < 7.0) {
    localIncomePercentile = 96;
    lifestyleTierKey = 'expat_luxury';
  } else {
    localIncomePercentile = 99.2;
    lifestyleTierKey = 'elite';
  }

  // Realistic monthly expenses scaled for a remote professional in target country
  const costs = targetCountry.sampleCostsUSD;
  const rent = costs.oneBedCityCenterRent * 1.15; // Upscale modern furnished apartment
  const groceries = costs.monthlyGroceries * 1.2; // Premium / organic imports
  const diningAndEntertainment = costs.casualDiningMeal * 30; // Dining out & social
  const utilitiesAndInternet = (costs.internetFiber * 1.5) + 60; // Gigabit fiber + co-working/utilities
  const healthcare = costs.privateHealthInsurance; // International/private coverage

  const totalEssentialExpenses = rent + groceries + diningAndEntertainment + utilitiesAndInternet + healthcare;
  const discretionarySavings = Math.max(0, safeUSD - totalEssentialExpenses);
  const savingsRatePct = Math.round((discretionarySavings / safeUSD) * 100);

  return {
    targetCountry,
    usdMonthly: safeUSD,
    localMonthly,
    localAnnual,
    purchasingPowerMultiplier: Math.round(purchasingPowerMultiplier * 100) / 100,
    effectiveUSDValue,
    localIncomePercentile,
    lifestyleTierKey,
    budgetBreakdown: {
      rent: Math.round(rent),
      groceries: Math.round(groceries),
      diningAndEntertainment: Math.round(diningAndEntertainment),
      utilitiesAndInternet: Math.round(utilitiesAndInternet),
      healthcare: Math.round(healthcare),
      discretionarySavings: Math.round(discretionarySavings),
    },
    savingsRatePct,
  };
}

/**
 * Currency & Number Formatting Helpers
 */
export function formatCurrency(amount: number, currencyCode: string, symbol: string, decimals: number = 0): string {
  if (currencyCode === 'IDR' || currencyCode === 'VND') {
    return `${symbol} ${Math.round(amount).toLocaleString('en-US')}`;
  }
  if (currencyCode === 'JPY') {
    return `${symbol}${Math.round(amount).toLocaleString('en-US')}`;
  }
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function formatUSD(amount: number, decimals: number = 0): string {
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}
