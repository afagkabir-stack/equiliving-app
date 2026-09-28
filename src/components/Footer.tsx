import React from 'react';
import { useI18n, LANGUAGE_OPTIONS } from '../i18n';
import { LanguageCode } from '../types';
import { LegalModalType } from './LegalModal';
import {
  MessageCircle,
  Mail,
  Shield,
  FileText,
  UserCheck,
  BookOpen,
  Code2,
  Sparkles,
  ExternalLink,
  Heart,
  Globe2,
  Compass,
} from 'lucide-react';

interface Props {
  onOpenMethodology: () => void;
  onSelectTab: (tab: 'calculator' | 'demographics' | 'freelance') => void;
  onOpenLegalModal: (type: NonNullable<LegalModalType>) => void;
  onStartTour?: () => void;
}

export const Footer: React.FC<Props> = ({
  onOpenMethodology,
  onSelectTab,
  onOpenLegalModal,
  onStartTour,
}) => {
  const { language, setLanguage, t, isRtl } = useI18n();

  return (
    <footer className="mt-20 border-t border-slate-800 bg-slate-950 text-slate-200" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Highlight Banner: Developer Spotlight */}
      <div className="border-b border-slate-800/80 bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-start">
            <div className="relative">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
                A
              </div>
              <span className="absolute -bottom-1 -end-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950"></span>
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  {isRtl ? 'مهندس ومطور المنصة' : 'Lead Creator & Engineer'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold border border-indigo-500/30">
                  Full-Stack
                </span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                Developer: <span className="text-indigo-300">Amjad</span> (Full-Stack Developer)
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                {t.developer.bio}
              </p>
            </div>
          </div>

          {/* Contact & Social Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* WhatsApp Direct */}
            <a
              href="https://wa.me/249112159495"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-950 hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp: +249 112159495</span>
            </a>

            {/* Email Direct */}
            <a
              href="mailto:amjad8835m@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Mail className="h-4 w-4 text-indigo-400" />
              <span>amjad8835m@gmail.com</span>
            </a>

            {/* About Modal Quick Trigger */}
            <button
              onClick={() => onOpenLegalModal('about')}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-semibold transition-colors cursor-pointer"
            >
              <UserCheck className="h-4 w-4" />
              <span>{isRtl ? 'السيرة الذاتية' : 'Profile'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Directory */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand & Platform Summary */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-xl font-black tracking-tight text-white">
                {t.common.appName}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 text-[10px] font-bold border border-indigo-500/30">
                PRO v2.0
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {t.common.tagline}. {isRtl ? 'محرك تحليلي مالي متقدم لحساب تعادل القوة الشرائية، التضخم الفعلي، ومحاكاة رواتب العمل عن بُعد.' : 'Precision analytical decision engine for purchasing power parity (PPP), inflation calibration, and remote career mobility.'}
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-500">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                World Bank ICP 2024–2026
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                UN Population Prospects
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                IMF WEO
              </span>
            </div>
          </div>

          {/* Core Tools Navigation */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              {isRtl ? 'الأدوات والحاسبات' : 'Core Tools & Models'}
            </span>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onSelectTab('calculator')}
                  className="hover:text-indigo-400 transition-colors text-start cursor-pointer"
                >
                  {t.common.calculator}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('demographics')}
                  className="hover:text-indigo-400 transition-colors text-start cursor-pointer"
                >
                  {t.common.demographics}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('freelance')}
                  className="hover:text-indigo-400 transition-colors text-start cursor-pointer"
                >
                  {t.common.freelance}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenMethodology}
                  className="hover:text-indigo-400 transition-colors text-start cursor-pointer flex items-center gap-1"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>{t.common.methodology}</span>
                </button>
              </li>
              {onStartTour && (
                <li>
                  <button
                    onClick={onStartTour}
                    className="hover:text-indigo-400 transition-colors text-start cursor-pointer flex items-center gap-1 text-indigo-300 font-semibold"
                  >
                    <Compass className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{t.tour.startTourBtn}</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Legal & Policy Modals */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              {isRtl ? 'الشفافية والسياسات' : 'Legal & Compliance'}
            </span>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onOpenLegalModal('about')}
                  className="hover:text-indigo-400 transition-colors text-start cursor-pointer flex items-center gap-1.5"
                >
                  <UserCheck className="h-3.5 w-3.5 text-indigo-400" />
                  <span>{t.legal.aboutTitle}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('privacy')}
                  className="hover:text-indigo-400 transition-colors text-start cursor-pointer flex items-center gap-1.5"
                >
                  <Shield className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{t.legal.privacyTitle}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('terms')}
                  className="hover:text-indigo-400 transition-colors text-start cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="h-3.5 w-3.5 text-amber-400" />
                  <span>{t.legal.termsTitle}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenMethodology}
                  className="hover:text-indigo-400 transition-colors text-start cursor-pointer"
                >
                  {isRtl ? 'معايير إعلانات AdSense' : 'AdSense Disclosure'}
                </button>
              </li>
            </ul>
          </div>

          {/* Multilingual Switcher Bar */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              {isRtl ? 'اللغات المدعومة' : 'Available Languages'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {LANGUAGE_OPTIONS.map((item) => (
                <button
                  key={item.code}
                  onClick={() => setLanguage(item.code as LanguageCode)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                    language === item.code
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span>{item.flag}</span> <span className="ms-1">{item.name}</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              {isRtl
                ? 'اللغة العربية مفعلة بالكامل مع اتجاه القراءة من اليمين إلى اليسار (RTL).'
                : 'Full Arabic support with automatic RTL directional alignment.'}
            </p>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
            <span>© {new Date().getFullYear()} {t.common.appName}.</span>
            <span>{isRtl ? 'تم التطوير بواسطة' : 'Crafted by'}</span>
            <strong className="text-slate-300 font-semibold">Amjad (Full-Stack Developer)</strong>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => onOpenLegalModal('about')}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              {isRtl ? 'عن المطور' : 'About Developer'}
            </button>
            <span>·</span>
            <button
              onClick={() => onOpenLegalModal('privacy')}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              {isRtl ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </button>
            <span>·</span>
            <button
              onClick={() => onOpenLegalModal('terms')}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              {isRtl ? 'الشروط والأحكام' : 'Terms & Disclaimer'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
