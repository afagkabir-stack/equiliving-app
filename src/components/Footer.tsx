import React from 'react';
import { useI18n, LANGUAGE_OPTIONS } from '../i18n';
import { LanguageCode } from '../types';

interface Props {
  onOpenMethodology: () => void;
  onSelectTab: (tab: 'calculator' | 'demographics' | 'freelance') => void;
}

export const Footer: React.FC<Props> = ({ onOpenMethodology, onSelectTab }) => {
  const { language, setLanguage, t } = useI18n();

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-base font-bold tracking-tight text-slate-900">
              {t.common.appName}
            </span>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md">
              {t.common.tagline}. An open economic decision engine tailored for international relocations, remote income valuation, and demographic pension longevity.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <span>World Bank ICP 2024–2026</span>
              <span aria-hidden="true">·</span>
              <span>UN Population Prospects</span>
              <span aria-hidden="true">·</span>
              <span>IMF WEO</span>
            </div>
          </div>

          {/* Quick Tools Navigation */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Calculators & Tools
            </span>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => onSelectTab('calculator')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {t.common.calculator}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('demographics')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {t.common.demographics}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('freelance')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {t.common.freelance}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenMethodology}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {t.common.methodology}
                </button>
              </li>
            </ul>
          </div>

          {/* Languages & Regional Targets */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Localized Editions
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              {LANGUAGE_OPTIONS.map((item) => (
                <button
                  key={item.code}
                  onClick={() => setLanguage(item.code as LanguageCode)}
                  className={`px-2 py-1 rounded-md text-xs transition-colors ${
                    language === item.code
                      ? 'bg-slate-900 text-white font-medium'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.flag} {item.nativeName}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {t.common.appName}. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <button onClick={onOpenMethodology} className="hover:text-slate-600">
              Privacy & Cookies
            </button>
            <span>·</span>
            <button onClick={onOpenMethodology} className="hover:text-slate-600">
              AdSense Disclosure
            </button>
            <span>·</span>
            <button onClick={onOpenMethodology} className="hover:text-slate-600">
              API Methodology
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
