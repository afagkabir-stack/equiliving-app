import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode } from '../types';
import { TranslationSchema } from './schema';
import { ar } from './translations/ar';
import { en } from './translations/en';
import { es } from './translations/es';
import { ja } from './translations/ja';
import { id } from './translations/id';
import { bn } from './translations/bn';

export const TRANSLATIONS: Record<LanguageCode, TranslationSchema> = {
  ar,
  en,
  es,
  ja,
  id,
  bn,
};

export const LANGUAGE_OPTIONS: { code: LanguageCode; name: string; nativeName: string; flag: string }[] = [
  { code: 'ar', name: 'Arabic', nativeName: 'العربية (Arabic)', flag: '🇸🇦' },
  { code: 'en', name: 'English', nativeName: 'English (US)', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español (AR/LatAm)', flag: '🇦🇷' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
];

interface I18nContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  isRtl: boolean;
  t: TranslationSchema;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    // Check URL params first
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get('lang') as LanguageCode;
      if (urlLang && TRANSLATIONS[urlLang]) {
        return urlLang;
      }
      // Check localStorage
      const savedLang = localStorage.getItem('equiliving_lang') as LanguageCode;
      if (savedLang && TRANSLATIONS[savedLang]) {
        return savedLang;
      }
    }
    // Default to Arabic as primary default option
    return 'ar';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('equiliving_lang', lang);
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      window.history.replaceState({}, '', url.toString());
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      
      // Dynamically sync title and meta descriptions for SEO and social bots
      const titles: Record<LanguageCode, string> = {
        ar: 'EquiLiving – الذكاء الاقتصادي لتعادل القوة الشرائية والديموغرافيا العالمية',
        en: 'EquiLiving – Global Purchasing Power & Demographic Visualizer',
        es: 'EquiLiving – Calculadora de Paridad de Poder Adquisitivo y Demografía',
        ja: 'EquiLiving – 購買力平価（PPP）＆人口ボーナス試算ツール',
        id: 'EquiLiving – Kalkulator Paritas Daya Beli & Bonus Demografi',
        bn: 'EquiLiving – ক্রয়ক্ষমতার সমতা (PPP) ও জনসংখ্যা বিশ্লেষণ',
      };
      
      const descriptions: Record<LanguageCode, string> = {
        ar: 'أداة مقارنة تفاعلية لحساب تعادل القوة الشرائية (PPP)، مؤشرات التضخم العالمية، العائد الديموغرافي وسن التقاعد، ومحاكاة رواتب العمل عن بُعد بالدولار.',
        en: 'Compare international purchasing power parity (PPP), inflation, retirement horizons, and freelance remote compensation.',
        es: 'Compara paridad de poder adquisitivo (PPA), inflación real, bono demográfico y salarios remotos en dólares.',
        ja: '購買力平価（PPP）、インフレ耐性、人口ボーナス、リモートワーク米ドル給与の現地実質価値を比較算出。',
        id: 'Bandingkan paritas daya beli (PPP), erosi inflasi, usia pensiun, dan nilai gaji remote dollar di Indonesia & global.',
        bn: 'পার্চেজিং পাওয়ার প্যারিটি (PPP), মূল্যস্ফীতি, অবসরকালীন বয়স ও ফ্রিল্যান্সার রিমোট স্যালারির প্রকৃত মূল্যায়ন।',
      };

      document.title = titles[language] || titles.ar;
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', descriptions[language] || descriptions.ar);
      }
      
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', titles[language] || titles.ar);
      }

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute('content', descriptions[language] || descriptions.ar);
      }
    }
  }, [language]);

  const value: I18nContextType = {
    language,
    setLanguage,
    isRtl: language === 'ar',
    t: TRANSLATIONS[language] || ar,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
