import React, { useState, useRef, useEffect } from 'react';
import { useI18n, LANGUAGE_OPTIONS } from '../i18n';
import { LanguageCode } from '../types';
import { Globe, Eye, EyeOff, ChevronDown, Check } from 'lucide-react';

interface NavbarProps {
  activeTab: 'calculator' | 'demographics' | 'freelance';
  setActiveTab: (tab: 'calculator' | 'demographics' | 'freelance') => void;
  onOpenMethodology: () => void;
  showAdSlots: boolean;
  setShowAdSlots: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenMethodology,
  showAdSlots,
  setShowAdSlots,
}) => {
  const { language, setLanguage, t } = useI18n();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangOption = LANGUAGE_OPTIONS.find((opt) => opt.code === language) || LANGUAGE_OPTIONS[0];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Zone 1: Brand title, single line */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('calculator');
          }}
          className="text-lg font-bold tracking-tight text-slate-900 transition-colors hover:text-indigo-600 whitespace-nowrap"
        >
          {t.common.appName}
        </a>

        {/* Zone 2: 4-6 text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'calculator'
                ? 'text-indigo-600 border-b-2 border-indigo-600 pb-0.5 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.common.calculator}
          </button>

          <button
            onClick={() => setActiveTab('demographics')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'demographics'
                ? 'text-indigo-600 border-b-2 border-indigo-600 pb-0.5 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.common.demographics}
          </button>

          <button
            onClick={() => setActiveTab('freelance')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'freelance'
                ? 'text-indigo-600 border-b-2 border-indigo-600 pb-0.5 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.common.freelance}
          </button>

          <button
            onClick={onOpenMethodology}
            className="text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap"
          >
            {t.common.methodology}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          {/* AdSense slots toggle preview */}
          <button
            onClick={() => setShowAdSlots((prev) => !prev)}
            title={showAdSlots ? 'Hide AdSense Slots' : 'Show AdSense Slots Preview'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
              showAdSlots
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {showAdSlots ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">Ad Slots</span>
          </button>

          {/* Language Switcher Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors whitespace-nowrap"
              aria-label="Select language"
              aria-expanded={langMenuOpen}
            >
              <Globe className="h-3.5 w-3.5 text-slate-500" />
              <span>{currentLangOption.flag}</span>
              <span className="font-semibold">{currentLangOption.code.toUpperCase()}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-52 rounded-xl bg-white border border-slate-200 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-100">
                  Select Language / Sprache
                </div>
                {LANGUAGE_OPTIONS.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setLanguage(item.code as LanguageCode);
                      setLangMenuOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-3 py-2 text-xs text-left transition-colors ${
                      language === item.code
                        ? 'bg-indigo-50 text-indigo-900 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.flag}</span>
                      <span>{item.nativeName}</span>
                    </div>
                    {language === item.code && <Check className="h-3.5 w-3.5 text-indigo-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Tabs */}
      <div className="md:hidden flex border-t border-slate-200 bg-slate-50 px-2 py-1.5 overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex-1 min-w-[100px] text-center py-1.5 px-2 rounded text-xs font-medium whitespace-nowrap ${
            activeTab === 'calculator' ? 'bg-white shadow-sm text-indigo-600 font-semibold' : 'text-slate-600'
          }`}
        >
          {t.common.calculator}
        </button>
        <button
          onClick={() => setActiveTab('demographics')}
          className={`flex-1 min-w-[100px] text-center py-1.5 px-2 rounded text-xs font-medium whitespace-nowrap ${
            activeTab === 'demographics' ? 'bg-white shadow-sm text-indigo-600 font-semibold' : 'text-slate-600'
          }`}
        >
          {t.common.demographics}
        </button>
        <button
          onClick={() => setActiveTab('freelance')}
          className={`flex-1 min-w-[100px] text-center py-1.5 px-2 rounded text-xs font-medium whitespace-nowrap ${
            activeTab === 'freelance' ? 'bg-white shadow-sm text-indigo-600 font-semibold' : 'text-slate-600'
          }`}
        >
          {t.common.freelance}
        </button>
      </div>
    </header>
  );
};
