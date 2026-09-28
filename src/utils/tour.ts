import { driver, DriveStep, Config } from 'driver.js';
import { TranslationSchema } from '../i18n/schema';

export interface TourHandlerOptions {
  t: TranslationSchema;
  isRtl: boolean;
  activeTab: 'calculator' | 'demographics' | 'freelance';
  setActiveTab: (tab: 'calculator' | 'demographics' | 'freelance') => void;
  onFinish?: () => void;
}

export function startGuidedTour({
  t,
  isRtl,
  activeTab,
  setActiveTab,
  onFinish,
}: TourHandlerOptions) {
  // Ensure we start on the calculator tab if not already there
  if (activeTab !== 'calculator') {
    setActiveTab('calculator');
  }

  const steps: DriveStep[] = [
    // 1. Navigation & Tools Overview
    {
      element: '#tour-nav-tabs',
      popover: {
        title: t.tour.stepTabsTitle,
        description: t.tour.stepTabsDesc,
        side: 'bottom',
        align: isRtl ? 'end' : 'start',
      },
    },
    // 2. Scenario Presets
    {
      element: '#tour-presets',
      popover: {
        title: t.tour.stepPresetsTitle,
        description: t.tour.stepPresetsDesc,
        side: 'bottom',
        align: isRtl ? 'end' : 'start',
      },
    },
    // 3. Country & Net Salary Inputs
    {
      element: '#tour-country-inputs',
      popover: {
        title: t.tour.stepInputsTitle,
        description: t.tour.stepInputsDesc,
        side: 'bottom',
        align: isRtl ? 'end' : 'start',
      },
    },
    // 4. Live World Bank Indicator Badge
    {
      element: '#tour-live-api',
      popover: {
        title: t.tour.stepLiveApiTitle,
        description: t.tour.stepLiveApiDesc,
        side: 'bottom',
        align: isRtl ? 'start' : 'end',
      },
    },
    // 5. Equivalent Salary & Verdict
    {
      element: '#tour-equivalent-salary',
      popover: {
        title: t.tour.stepEquivalentTitle,
        description: t.tour.stepEquivalentDesc,
        side: 'bottom',
        align: isRtl ? 'end' : 'start',
      },
    },
    // 6. Chart.js Comparison Bar Chart
    {
      element: '#tour-comparison-chart',
      popover: {
        title: t.tour.stepChartTitle,
        description: t.tour.stepChartDesc,
        side: 'top',
        align: 'center',
      },
    },
    // 7. Inflation Erosion Trajectory
    {
      element: '#tour-inflation-projection',
      popover: {
        title: t.tour.stepInflationTitle,
        description: t.tour.stepInflationDesc,
        side: 'top',
        align: isRtl ? 'end' : 'start',
      },
    },
    // 8. Demographic & Age Visualizer Inputs (Transitions to Demographics Tab)
    {
      element: '#tour-demo-controls',
      popover: {
        title: t.tour.stepDemoControlsTitle,
        description: t.tour.stepDemoControlsDesc,
        side: 'bottom',
        align: isRtl ? 'end' : 'start',
      },
    },
    // 9. Personal Longevity & Working Timeline
    {
      element: '#tour-demo-longevity',
      popover: {
        title: t.tour.stepDemoLongevityTitle,
        description: t.tour.stepDemoLongevityDesc,
        side: 'bottom',
        align: isRtl ? 'end' : 'start',
      },
    },
    // 10. Demographic Dividend Phase
    {
      element: '#tour-demo-phase',
      popover: {
        title: t.tour.stepDemoPhaseTitle,
        description: t.tour.stepDemoPhaseDesc,
        side: 'top',
        align: isRtl ? 'end' : 'start',
      },
    },
    // 11. Old-Age Dependency Ratio Shift
    {
      element: '#tour-demo-dependency',
      popover: {
        title: t.tour.stepDemoDependencyTitle,
        description: t.tour.stepDemoDependencyDesc,
        side: 'top',
        align: 'center',
      },
    },
    // 12. Pension Strain & Recommended Replacement Rate
    {
      element: '#tour-demo-pension',
      popover: {
        title: t.tour.stepDemoPensionTitle,
        description: t.tour.stepDemoPensionDesc,
        side: 'top',
        align: isRtl ? 'start' : 'end',
      },
    },
  ];

  let currentTab: 'calculator' | 'demographics' | 'freelance' = activeTab;

  const config: Config = {
    steps,
    showProgress: true,
    animate: true,
    allowClose: true,
    smoothScroll: true,
    waitForElement: 2500,
    overlayColor: 'rgba(15, 23, 42, 0.75)',
    stagePadding: 8,
    stageRadius: 14,
    popoverClass: isRtl ? 'driverjs-rtl' : '',
    nextBtnText: t.tour.next,
    prevBtnText: t.tour.prev,
    doneBtnText: t.tour.done,
    onHighlightStarted: (_element, _step, { state }) => {
      const idx = state.activeIndex ?? 0;
      // Steps 0 to 6 are on the Calculator tab
      // Steps 7 to 11 are on the Demographics tab
      if (idx >= 7 && currentTab !== 'demographics') {
        currentTab = 'demographics';
        setActiveTab('demographics');
      } else if (idx < 7 && currentTab !== 'calculator') {
        currentTab = 'calculator';
        setActiveTab('calculator');
      }
    },
    onDestroyed: () => {
      try {
        localStorage.setItem('equiliving_tour_seen', 'true');
      } catch {
        // Ignore localStorage errors
      }
      if (onFinish) {
        onFinish();
      }
    },
  };

  const driverInstance = driver(config);

  // If we just had to switch tab, give a short grace period for the DOM to settle
  if (activeTab !== 'calculator') {
    setTimeout(() => {
      driverInstance.drive(0);
    }, 150);
  } else {
    driverInstance.drive(0);
  }

  return driverInstance;
}
