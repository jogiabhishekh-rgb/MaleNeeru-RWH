import React from 'react';
import { PlanInputs, PlanOutputs } from '../types/rwh';
import { calculateMonthlyHarvest } from '../utils/calculator';
import { CloudRain, Sun, Calendar, Droplets, AlertCircle } from 'lucide-react';

interface MonthlyHarvestTabProps {
  inputs: PlanInputs;
  outputs: PlanOutputs;
}

export const MonthlyHarvestTab: React.FC<MonthlyHarvestTabProps> = ({
  inputs,
  outputs
}) => {
  const annualRain = inputs.annualRainfallOverride ?? 970;
  const monthlyData = calculateMonthlyHarvest(
    annualRain,
    outputs.roofAreaM2,
    outputs.runoffCoefficient
  );

  const monthlyNonDrinkingDemand = Math.round(inputs.peopleCount * (inputs.nonDrinkingUseOverride ?? 45) * 30.4);

  const maxHarvestMonth = Math.max(...monthlyData.map(m => m.harvestLitres), 1);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <CloudRain className="w-4 h-4" /> Bengaluru Monsoon Precipitation Profile
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Estimated Monthly Rain Harvest on Your Roof
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
              Bengaluru experiences a bimodal monsoon with pre-monsoon convective thunderstorms (May) and peak retreat monsoon rainfall (Sept - Oct). 
              Over <strong>78%</strong> of annual precipitation arrives between May and October.
            </p>
          </div>

          <div className="bg-cyan-50 dark:bg-cyan-950/60 p-3 rounded-xl border border-cyan-100 dark:border-cyan-900 text-xs space-y-1">
            <span className="text-cyan-800 dark:text-cyan-300 font-semibold text-[11px] block">Annual Roof Capture</span>
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-lg font-mono text-cyan-600 dark:text-cyan-400">{outputs.estimatedAnnualHarvestLitres.toLocaleString()} L</span>
              <span className="text-slate-500 font-normal">({outputs.estimatedAnnualHarvestKL} kL)</span>
            </div>
          </div>
        </div>

        {/* Visual Monthly Rainfall & Harvest Chart */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">Monthly Catchment Distribution (Litres)</span>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-cyan-500" /> Harvest Volume</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-rose-500" /> Monthly Household Demand (~{monthlyNonDrinkingDemand.toLocaleString()} L)</span>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="grid grid-cols-12 gap-2 items-end h-64 pt-6 pb-2 px-2 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/80 dark:border-slate-800">
            {monthlyData.map((m) => {
              const heightPct = Math.round((m.harvestLitres / maxHarvestMonth) * 100);
              const isSurplus = m.harvestLitres >= monthlyNonDrinkingDemand;

              return (
                <div key={m.month} className="flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 z-20 pointer-events-none bg-slate-900 text-white text-[10px] rounded-lg py-1 px-2 whitespace-nowrap shadow-lg">
                    <p className="font-bold">{m.month}: {m.harvestLitres.toLocaleString()} L</p>
                    <p className="text-slate-300">{m.scaledRainMm} mm ({m.shareOfYearPct}%)</p>
                  </div>

                  {/* Value on top of bar for top months */}
                  {(m.month === 'Sep' || m.month === 'Oct' || m.month === 'May') && (
                    <span className="text-[10px] font-bold font-mono text-cyan-600 dark:text-cyan-400 mb-1 hidden sm:block">
                      {Math.round(m.harvestLitres / 1000)}k
                    </span>
                  )}

                  {/* The bar */}
                  <div
                    style={{ height: `${Math.max(4, heightPct)}%` }}
                    className={`w-full max-w-[36px] rounded-t-lg transition-all ${
                      isSurplus
                        ? 'bg-gradient-to-t from-cyan-600 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-400 shadow-sm'
                        : 'bg-gradient-to-t from-slate-400 to-slate-300 dark:from-slate-700 dark:to-slate-600'
                    }`}
                  />

                  {/* Month Label */}
                  <span className="mt-2 text-[11px] font-bold text-slate-600 dark:text-slate-400 font-sans">
                    {m.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Seasonality Strategy Guidance */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 space-y-2">
            <div className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-600" />
              Monsoon Surplus Period (May - October)
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              During September ({monthlyData[8].harvestLitres.toLocaleString()} L) and October ({monthlyData[9].harvestLitres.toLocaleString()} L), 
              rainwater generation substantially exceeds immediate household needs. 
              <strong> The surplus overflow must be directed into an artificial recharge well</strong> to recharge local aquifers and prevent urban street flooding.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 space-y-2">
            <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-600" />
              Dry Season Deficit Period (January - March)
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Precipitation drops sharply (only 2 mm in Jan, 5 mm in Feb). Stored water from late November will buffer initial weeks, 
              after which households rely on borewells or municipal supply. The recharge done during monsoon ensures your borewell yields stay healthy without drying!
            </p>
          </div>
        </div>
      </div>

      {/* Month-by-Month Full Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Detailed Monthly Meteorological & Catchment Breakdown
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 font-semibold">Month</th>
                <th className="py-2.5 text-right font-semibold">Typical Rain (mm)</th>
                <th className="py-2.5 text-right font-semibold">Share of Year (%)</th>
                <th className="py-2.5 text-right font-semibold">Scaled Rain (mm)</th>
                <th className="py-2.5 text-right font-semibold text-cyan-600 dark:text-cyan-400">Your Roof Harvest (Litres)</th>
                <th className="py-2.5 pl-4 font-semibold text-slate-400">Household Water Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-slate-700 dark:text-slate-300">
              {monthlyData.map((m) => {
                const diff = m.harvestLitres - monthlyNonDrinkingDemand;
                const isSurplus = diff >= 0;

                return (
                  <tr key={m.month}>
                    <td className="py-2 font-bold font-sans text-slate-900 dark:text-white">{m.month}</td>
                    <td className="py-2 text-right">{m.typicalRainMm} mm</td>
                    <td className="py-2 text-right">{m.shareOfYearPct}%</td>
                    <td className="py-2 text-right">{m.scaledRainMm} mm</td>
                    <td className="py-2 text-right font-bold text-cyan-600 dark:text-cyan-400">
                      {m.harvestLitres.toLocaleString()} L
                    </td>
                    <td className="py-2 pl-4 font-sans text-[11px]">
                      {isSurplus ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          +{diff.toLocaleString()} L surplus (Available for Aquifer Recharge)
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          {Math.abs(diff).toLocaleString()} L deficit (Use Tank Storage / Borewell)
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              <tr className="font-bold text-sm bg-slate-50 dark:bg-slate-800/40 text-slate-900 dark:text-white">
                <td className="py-2.5 font-sans">Annual Total</td>
                <td className="py-2.5 text-right">951 mm</td>
                <td className="py-2.5 text-right">100.0%</td>
                <td className="py-2.5 text-right">{annualRain} mm</td>
                <td className="py-2.5 text-right text-cyan-600 dark:text-cyan-400">
                  {outputs.estimatedAnnualHarvestLitres.toLocaleString()} L
                </td>
                <td className="py-2.5 pl-4 font-sans text-[11px] text-slate-500">
                  {outputs.estimatedAnnualHarvestKL} kL captured
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
