import React from 'react';
import { useI18n } from '../i18n';
import { X, ShieldCheck, FileText, User, Mail, MessageCircle, Globe, ExternalLink, Award, Code, CheckCircle } from 'lucide-react';

export type LegalModalType = 'about' | 'privacy' | 'terms' | null;

interface LegalModalProps {
  type: LegalModalType;
  isOpen: boolean;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, isOpen, onClose }) => {
  const { t, isRtl } = useI18n();

  if (!isOpen || !type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-800"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              {type === 'about' && <User className="h-6 w-6" />}
              {type === 'privacy' && <ShieldCheck className="h-6 w-6" />}
              {type === 'terms' && <FileText className="h-6 w-6" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {type === 'about' && t.legal.aboutTitle}
                {type === 'privacy' && t.legal.privacyTitle}
                {type === 'terms' && t.legal.termsTitle}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {type === 'about' && t.legal.aboutDesc}
                {type === 'privacy' && t.legal.privacyDesc}
                {type === 'terms' && t.legal.termsDesc}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="mt-6 space-y-6 text-sm text-slate-600 leading-relaxed">
          {/* ABOUT US MODAL */}
          {type === 'about' && (
            <div className="space-y-6">
              {/* Mission Statement */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 border border-indigo-100/70">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Award className="h-4 w-4 text-indigo-600" />
                  {isRtl ? 'رؤية المنصة والهدف' : 'Platform Mission & Vision'}
                </h3>
                <p className="mt-2 text-slate-700 leading-relaxed text-xs sm:text-sm">
                  {isRtl
                    ? 'منصة EquiLiving هي أداة سحابية تفاعلية دقيقة تم تصميمها لدعم رواد الأعمال، المستقلين، والرحالة الرقميين (Digital Nomads) في اتخاذ قرارات مالية وانتقالية مستنيرة. نعتمد على أحدث بيانات تعادل القوة الشرائية (PPP) والتضخم من البنك الدولي ومعدلات الخصوبة والأعمار من الأمم المتحدة.'
                    : 'EquiLiving is a precision micro-SaaS application built to empower global digital nomads, remote freelancers, and international expatriates with actionable purchasing power parity (PPP), inflation resilience trajectories, and demographic dividend insights based on open international datasets.'}
                </p>
              </div>

              {/* Developer Spotlight Card */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-md relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-inner">
                        A
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-bold text-white tracking-tight">{t.developer.name}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
                            Full-Stack Engineer
                          </span>
                        </div>
                        <p className="text-xs text-indigo-200 mt-0.5">{t.developer.role}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {t.developer.bio}
                  </p>

                  <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-3">
                    <a
                      href="https://wa.me/249112159495"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{t.developer.whatsapp}: +249 112159495</span>
                    </a>
                    <a
                      href="mailto:amjad8835m@gmail.com"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-semibold transition-colors"
                    >
                      <Mail className="h-4 w-4 text-indigo-400" />
                      <span>{t.developer.email}: amjad8835m@gmail.com</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Core Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                    {isRtl ? 'بيانات حية وموثوقة' : 'Live World Bank API'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {isRtl ? 'استعلام مباشر لمؤشرات التضخم والقوة الشرائية' : 'Direct queries to World Bank open data indicators'}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-indigo-600" />
                    {isRtl ? 'تصور بياني تفاعلي' : 'Chart.js Analytics'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {isRtl ? 'مقارنات رسومية سلسة لمتوسطات الدخل والتكاليف' : 'Interactive visual benchmark across living indices'}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-amber-600" />
                    {isRtl ? 'دعم كامل للغات' : 'Multilingual & RTL'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {isRtl ? 'تجربة مستخدم أصلية باللغة العربية مع دعم 5 لغات' : 'Native Arabic RTL alongside 5 global languages'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PRIVACY POLICY MODAL (Google AdSense & GDPR Compliant) */}
          {type === 'privacy' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-600">
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs">
                <strong>{isRtl ? 'إشعار الامتثال الإعلاني وحماية البيانات:' : 'Advertising & Privacy Compliance Notice:'}</strong>{' '}
                {isRtl
                  ? 'تم صياغة هذه السياسة لتتوافق بشكل كامل مع معايير Google AdSense وسياسات حماية البيانات العامة (GDPR) وقوانين الخصوصية الرقمية.'
                  : 'This policy is structured in strict adherence with Google AdSense program policies, European GDPR, and California CCPA transparency rules.'}
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">{isRtl ? '1. ملفات تعريف الارتباط وإعلانات Google AdSense' : '1. Cookies & Google AdSense Advertising'}</h4>
                <p className="mt-1 leading-relaxed">
                  {isRtl
                    ? 'يستخدم هذا الموقع ملفات تعريف الارتباط (Cookies) لخدمة وعرض الإعلانات المخصصة عبر شبكة Google AdSense وشبكات الإعلانات التابعة لجهات خارجية معتمدة. قد تستخدم Google ملفات تعريف الارتباط مثل DART لعرض الإعلانات للمستخدمين استناداً إلى زياراتهم لهذا الموقع والمواقع الأخرى على شبكة الإنترنت.'
                    : 'We display advertisements provided by Google AdSense and third-party advertising partners. Google uses cookies, including the DoubleClick/DART cookie, to serve ads based on your visit to this and other websites across the Internet. You may opt out of personalized advertising by visiting Google Ad Settings.'}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">{isRtl ? '2. البيانات التي يتم جمعها تلقائياً' : '2. Information Automatically Logged'}</h4>
                <p className="mt-1 leading-relaxed">
                  {isRtl
                    ? 'مثل معظم خوادم الويب، نقوم بتسجيل معلومات قياسية غير محددة للهوية مثل: نوع المتصفح، نظام التشغيل، عنوان البروتوكول (IP)، لغة العرض المختارة، ووقت الزيارة. هذه البيانات تُستخدم حصرياً لتحسين استقرار وسرعة الأداة.'
                    : 'Like standard web applications, non-identifying telemetry (such as browser type, operating system, IP address, referral URLs, language preference, and timestamp) may be logged solely for performance, caching, and security purposes.'}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">{isRtl ? '3. عدم جمع أو بيع البيانات الشخصية' : '3. Zero Personal Data Sale'}</h4>
                <p className="mt-1 leading-relaxed">
                  {isRtl
                    ? 'لا نطلب تسجيل حسابات ولا نجمع أرقام هواتف أو بطاقات ائتمان. جميع المدخلات (الرواتب، الأعمار) تُعالج محلياً في متصفحك (Client-side) ولا تُخزن على خوادمنا.'
                    : 'EquiLiving does not collect or sell personal identification records. Calculator inputs (such as salaries, age, and country selections) are processed entirely client-side in your local browser runtime.'}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">{isRtl ? '4. مسؤول الاتصال والخصوصية' : '4. Privacy Officer Contact'}</h4>
                <p className="mt-1 leading-relaxed">
                  {isRtl
                    ? 'لأي استفسارات قانونية أو أسئلة تتعلق بالخصوصية، يمكنك التواصل مع المطور أمجد عبر البريد الإلكتروني: amjad8835m@gmail.com'
                    : 'For any privacy-related inquiries, please contact the developer Amjad at amjad8835m@gmail.com.'}
                </p>
              </div>
            </div>
          )}

          {/* TERMS OF SERVICE & DISCLAIMER MODAL */}
          {type === 'terms' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-600">
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs">
                <strong>{t.legal.disclaimerTitle}:</strong>{' '}
                {isRtl
                  ? 'جميع الحسابات الصادرة عن هذه الأداة مبنية على بيانات إحصائية عامة وهي للأغراض الإرشادية والتثقيفية فقط ولا تشكل استشارة مالية أو ضريبية أو قانونية معتمدة.'
                  : 'All mathematical and financial outputs produced by EquiLiving are simulations derived from open statistical models and must not be construed as binding financial, tax, or legal advice.'}
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">{isRtl ? '1. مصدر البيانات ومنهجية التقدير' : '1. Open Datasets & Estimation Basis'}</h4>
                <p className="mt-1 leading-relaxed">
                  {isRtl
                    ? 'تعتمد معادلات تعادل القوة الشرائية ومؤشرات التضخم وسن التقاعد على قواعد بيانات البنك الدولي (World Bank Open Data) وبرنامج المقارنات الدولية (ICP) وشعبة السكان بالأمم المتحدة ومؤشرات Numbeo. ورغم حرصنا على دقة التحديثات، قد تختلف الأسعار الحقيقية على أرض الواقع باختلاف المدن والتقلبات الاقتصادية اللحظية.'
                    : 'Calculations utilize datasets sourced from the World Bank ICP, United Nations Population Division, and public cost-of-living benchmarks. While regularly calibrated, market conditions, regional disparities, and local inflation may cause real-world costs to vary.'}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">{isRtl ? '2. حدود المسؤولية القانونية' : '2. Limitation of Liability'}</h4>
                <p className="mt-1 leading-relaxed">
                  {isRtl
                    ? 'لا يتحمل مطور الأداة (أمجد) أو منصة EquiLiving أي مسؤولية عن أي قرارات انتقال جغرافي أو استقالة أو استثمار أو توقيع عقود عمل تتخذ بناءً على نتائج هذه الحاسبة. يُنصح دائماً بالتحقق المستقل من مصادر موثوقة في بلد الوجهة.'
                    : 'Under no circumstances shall the developer (Amjad) or EquiLiving be liable for any direct, indirect, incidental, or consequential decisions (including relocation, salary negotiations, or investments) made based on these estimations.'}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">{isRtl ? '3. حقوق الملكية الفكرية' : '3. Intellectual Property'}</h4>
                <p className="mt-1 leading-relaxed">
                  {isRtl
                    ? 'تصميم واجهة المستخدم، المخططات البرمجية، وهندسة الكود البرمجي تخضع لحقوق الملكية للمطور أمجد. نرحب بالاستخدام الشخصي والتعليمي والمهني الحر.'
                    : 'The interface architecture, responsive design system, and proprietary calculation wrappers are authored by Amjad. Open exploration and professional planning usage are warmly permitted.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Developer: Amjad</span>
            <span>·</span>
            <span>EquiLiving v2.0</span>
          </div>
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
