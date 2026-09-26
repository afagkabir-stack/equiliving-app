import { CountryData } from '../types';

export interface WorldBankIndicatorData {
  countryCode: string;
  indicator: string;
  year: number;
  value: number;
}

export interface LiveIndicatorState {
  inflationRate?: number;
  inflationYear?: number;
  pppConversionFactor?: number;
  pppYear?: number;
  gdpPerCapitaPPP?: number;
  isLive: boolean;
  lastUpdated: string;
  source: 'world_bank_live' | 'fallback_baseline';
}

// Country code mappings from ISO 2-letter to ISO 3-letter used by the World Bank API
export const ISO2_TO_ISO3: Record<string, string> = {
  US: 'USA',
  JP: 'JPN',
  AR: 'ARG',
  ID: 'IDN',
  BD: 'BGD',
  GB: 'GBR',
  DE: 'DEU',
  ES: 'ESP',
  BR: 'BRA',
  MX: 'MEX',
  VN: 'VNM',
  PH: 'PHL',
  IN: 'IND',
  CA: 'CAN',
  AU: 'AUS',
};

// In-memory cache for fetched World Bank metrics
const liveMetricsCache = new Map<string, LiveIndicatorState>();

/**
 * Fetches latest indicator from World Bank Open API v2
 * Indicators:
 * - FP.CPI.TOTL.ZG : Inflation, consumer prices (annual %)
 * - PA.NUS.PPP : PPP conversion factor, GDP (LCU per international $)
 * - NY.GDP.PCAP.PP.CD : GDP per capita, PPP (current international $)
 */
async function fetchIndicator(iso3: string, indicatorCode: string): Promise<{ value: number; year: number } | null> {
  try {
    const url = `https://api.worldbank.org/v2/country/${iso3}/indicator/${indicatorCode}?format=json&per_page=5&date=2020:2026`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout for snappy UI

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (Array.isArray(data) && data.length > 1 && Array.isArray(data[1])) {
      // Find the most recent non-null value
      const validEntry = data[1].find((entry: { value: number | null; date: string }) => entry.value !== null);
      if (validEntry) {
        return {
          value: Number(validEntry.value),
          year: parseInt(validEntry.date, 10),
        };
      }
    }
    return null;
  } catch {
    // Graceful fallback to cached or baseline on any network issue or timeout
    return null;
  }
}

/**
 * Fetch combined economic indicators for a country from World Bank API with fallback
 */
export async function getLiveCountryIndicators(country: CountryData): Promise<LiveIndicatorState> {
  const cached = liveMetricsCache.get(country.id);
  if (cached) {
    return cached;
  }

  const iso3 = ISO2_TO_ISO3[country.id];
  if (!iso3) {
    const fallback: LiveIndicatorState = {
      inflationRate: country.annualInflationRate,
      inflationYear: 2024,
      isLive: false,
      lastUpdated: 'Fallback Baseline',
      source: 'fallback_baseline',
    };
    liveMetricsCache.set(country.id, fallback);
    return fallback;
  }

  try {
    // Fetch inflation and PPP in parallel
    const [inflationRes, pppRes] = await Promise.all([
      fetchIndicator(iso3, 'FP.CPI.TOTL.ZG'),
      fetchIndicator(iso3, 'PA.NUS.PPP'),
    ]);

    if (inflationRes || pppRes) {
      const state: LiveIndicatorState = {
        inflationRate: inflationRes ? Math.round(inflationRes.value * 10) / 10 : country.annualInflationRate,
        inflationYear: inflationRes ? inflationRes.year : 2024,
        pppConversionFactor: pppRes ? Math.round(pppRes.value * 100) / 100 : undefined,
        pppYear: pppRes ? pppRes.year : undefined,
        isLive: true,
        lastUpdated: new Date().toISOString(),
        source: 'world_bank_live',
      };
      liveMetricsCache.set(country.id, state);
      return state;
    }
  } catch {
    // fallback
  }

  const fallbackState: LiveIndicatorState = {
    inflationRate: country.annualInflationRate,
    inflationYear: 2024,
    isLive: false,
    lastUpdated: 'Offline Benchmark Dataset',
    source: 'fallback_baseline',
  };
  liveMetricsCache.set(country.id, fallbackState);
  return fallbackState;
}
