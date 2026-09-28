import React from 'react';
import { useI18n } from '../i18n';
import { X, BookOpen, Calculator, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t, isRtl } = useI18n();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {t.common.methodology}
              </h2>
              <p className="text-xs text-slate-500">
                {isRtl ? 'المعادلات الاقتصادية وقواعد البيانات المفتوحة' : 'Economic Formulas & Open Datasets'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-6 space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
          {/* Section 1: PPP Formula */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Calculator className="h-4 w-4 text-indigo-600" />
              {isRtl ? '1. معادلة تعادل القوة الشرائية (PPP)' : '1. Purchasing Power Parity (PPP) Formulation'}
            </h3>
            <p className="mt-1.5">
              {isRtl
                ? 'تعتمد الأداة نموذج مستويات الأسعار النسبية المعتمد لدى برنامج المقارنات الدولية للبنك الدولي (World Bank ICP). يتم حساب الراتب المعادل بين الاقتصادين بالصيغة القياسية:'
                : 'The tool implements the standard relative price level model established by the World Bank International Comparison Program (ICP). Equivalent compensation between economies is calculated as:'}
            </p>
            <div className="my-2.5 rounded-xl bg-slate-50 p-3 font-mono text-xs text-slate-800 border border-slate-200 text-start" dir="ltr">
              Equivalent Salary = (Salary_source / FX_source) × (COLI_target / COLI_source) × FX_target
            </div>
            <p className="text-slate-500 text-xs">
              {isRtl
                ? 'حيث يمثل COLI مؤشر تكلفة المعيشة نسبةً لمدينة نيويورك (NYC = 100)، ويمثل FX سعر الصرف الفوري مقابل الدولار الأمريكي.'
                : 'Where COLI represents the Cost of Living Index relative to New York City (NYC = 100), and FX represents the spot exchange rate against the US Dollar.'}
            </p>
          </div>

          {/* Section 2: Demographic Dividend & Longevity */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              {isRtl ? '2. التوقعات الديموغرافية ونسب الإعالة' : '2. Demographic Projections & Dependency Ratios'}
            </h3>
            <p className="mt-1.5">
              {isRtl
                ? 'تستند الحسابات الديموغرافية إلى معايير شعبة السكان في إدارة الشؤون الاقتصادية والاجتماعية بالأمم المتحدة (UN DESA):'
                : 'Demographic calculations leverage the United Nations Department of Economic and Social Affairs (DESA) Population Division benchmarks:'}
            </p>
            <ul className="mt-2 list-disc ps-5 space-y-1 text-xs">
              <li>
                <strong>{isRtl ? 'نسبة إعالة كبار السن:' : 'Old-Age Dependency Ratio:'}</strong>{' '}
                {isRtl ? 'عدد الأفراد الذين تزيد أعمارهم عن 65 عاماً لكل 100 فرد في سن العمل (15–64 عاماً).' : 'Population aged 65+ per 100 working-age individuals (aged 15–64).'}
              </li>
              <li>
                <strong>{isRtl ? 'ذروة العائد الديموغرافي:' : 'Demographic Dividend Peak:'}</strong>{' '}
                {isRtl ? 'نقطة التحول التاريخية التي تبلغ فيها نسبة السكان في سن العمل أقصى مستوياتها مقارنة بالمعالين.' : 'The inflection period where the share of working-age population achieves its maximum ratio relative to youth and elderly dependents.'}
              </li>
              <li>
                <strong>{isRtl ? 'معدل تعويض التقاعد الموصى به:' : 'Retirement Replacement Rate:'}</strong>{' '}
                {isRtl ? 'النسبة المئوية المقترحة لصافي الدخل السابق للتقاعد المطلوب للحفاظ على نفس المستوى المعيشي.' : 'Recommended percentage of pre-retirement net income needed to maintain parity, adjusted for public pension sustainability indices.'}
              </li>
            </ul>
          </div>

          {/* Section 3: Data Sources */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              {isRtl ? '3. مصادر البيانات الدولية المعتمدة' : '3. Primary Data Sources'}
            </h3>
            <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50">
                <span className="font-semibold text-slate-800">World Bank ICP & Open API v2</span>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  {isRtl ? 'مؤشرات القوة الشرائية والتضخم الحي' : 'Purchasing power parity and live inflation metrics'}
                </p>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50">
                <span className="font-semibold text-slate-800">UN Population Division</span>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  {isRtl ? 'توقعات سكان العالم 2024–2026' : 'World Population Prospects 2024–2026'}
                </p>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50">
                <span className="font-semibold text-slate-800">International Monetary Fund (IMF)</span>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  {isRtl ? 'تقرير آفاق الاقتصاد العالمي ومعدلات الأسعار' : 'World Economic Outlook inflation metrics'}
                </p>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50">
                <span className="font-semibold text-slate-800">Numbeo & Expatistan</span>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  {isRtl ? 'سلات أسعار الإيجار والمطاعم والخدمات اليومية' : 'Metropolitan basket rentals, dining, and utilities'}
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            {t.common.disclaimer}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isRtl ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
