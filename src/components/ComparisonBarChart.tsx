import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { CountryData, PPPComparisonResult } from '../types';
import { useI18n } from '../i18n';
import { formatUSD } from '../utils/calculator';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  sourceCountry: CountryData;
  targetCountry: CountryData;
  result: PPPComparisonResult;
}

export const ComparisonBarChart: React.FC<Props> = ({
  sourceCountry,
  targetCountry,
  result,
}) => {
  const { t } = useI18n();

  const getCountryName = (nameKey: string) => {
    return t.countries[nameKey as keyof typeof t.countries] || nameKey;
  };

  const sourceName = `${sourceCountry.flag} ${getCountryName(sourceCountry.nameKey)}`;
  const targetName = `${targetCountry.flag} ${getCountryName(targetCountry.nameKey)}`;

  // Monthly salary in USD normalized for comparison
  const sourceSalaryUSD = Math.round(result.sourceSalary / sourceCountry.exchangeRateToUSD);
  const targetSalaryUSD = Math.round(result.targetEquivalentSalaryUSD);

  // Metrics:
  // 1. Monthly Equivalent Salary (USD)
  // 2. Cost of Living Index (NYC = 100)
  // 3. Local Purchasing Power Index (NYC = 100)
  const data = {
    labels: [
      'Equivalent Salary (USD/mo)',
      'Cost of Living Index (NYC=100)',
      'Local Purchasing Power Index (NYC=100)',
      'Rent Index (NYC=100)',
      'Groceries Index (NYC=100)',
    ],
    datasets: [
      {
        label: sourceName,
        data: [
          sourceSalaryUSD,
          sourceCountry.costOfLivingIndex,
          sourceCountry.localPurchasingPowerIndex,
          sourceCountry.rentIndex,
          sourceCountry.groceriesIndex,
        ],
        backgroundColor: 'rgba(79, 70, 229, 0.85)', // Indigo 600
        borderColor: 'rgb(67, 56, 202)',
        borderWidth: 1.5,
        borderRadius: 6,
      },
      {
        label: targetName,
        data: [
          targetSalaryUSD,
          targetCountry.costOfLivingIndex,
          targetCountry.localPurchasingPowerIndex,
          targetCountry.rentIndex,
          targetCountry.groceriesIndex,
        ],
        backgroundColor: 'rgba(16, 185, 129, 0.85)', // Emerald 500
        borderColor: 'rgb(5, 150, 105)',
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 12,
            weight: 600,
          },
          color: '#334155',
          boxWidth: 14,
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: {
          family: "'Plus Jakarta Sans', sans-serif",
          size: 13,
          weight: 700,
        },
        bodyFont: {
          family: "'JetBrains Mono', monospace",
          size: 12,
        },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const rawValue = context.raw as number;
            if (context.dataIndex === 0) {
              return ` ${context.dataset.label}: ${formatUSD(rawValue)} / month`;
            }
            return ` ${context.dataset.label}: ${rawValue.toFixed(1)} pts`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 11,
            weight: 500,
          },
          color: '#64748b',
        },
      },
      y: {
        grid: {
          color: 'rgba(226, 232, 240, 0.6)',
        },
        ticks: {
          font: {
            family: "'JetBrains Mono', monospace",
            size: 11,
          },
          color: '#64748b',
        },
      },
    },
  };

  return (
    <div id="tour-comparison-chart" className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Interactive Economic Parity Chart (Chart.js)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time visual comparison of salary equivalency, living costs, and purchasing power parity.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1 rounded bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 border border-indigo-200">
            Chart.js v4 Interactive
          </span>
        </div>
      </div>

      <div className="h-[280px] sm:h-[340px] w-full">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};
