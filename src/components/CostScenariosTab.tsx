import React from 'react';
import { PlanInputs, PlanOutputs } from '../types/rwh';
import { calculateCostScenarios } from '../utils/calculator';
import { WATER_SOURCE_PRICES } from '../data/bengaluruData';
import { TrendingUp, AlertCircle, CheckCircle, Clock, Truck, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

interface CostScenariosTabProps {
  inputs: PlanInputs;
  setInputs: React.Dispatch<React.SetStateAction<PlanInputs>>;
  outputs: PlanOutputs;
}

export const CostScenariosTab: React.FC<CostScenariosTabProps> = ({
  inputs,
  setInputs,
  outputs
}) => {
  const scenarios = calculateCostScenarios(inputs, outputs);

  const defaultPrice = WATER_SOURCE_PRICES[inputs.mainWaterSource];
  const activeWaterPrice = inputs.customWaterPrice ?? defaultPrice;

  return (
    <div className="space-y-6">
      {/* Intro Box */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" /> Three-Case Financial & Payback Analysis
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Return on Investment (ROI) & 10-Year Cash Flow
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
              Payback calculates when cumulative water savings outpace installation and yearly maintenance costs. 
              In Bengaluru's tanker-dependent areas, private tankers average <strong className="text-slate-700 dark:text-slate-200">₹0.12/L</strong> (approx ₹1,400+ per 12,000L load).
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs space-y-1">
            <span className="text-slate-400 font-medium text-[11px] block">Current Benchmark Price</span>
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-base font-mono text-cyan-600 dark:text-cyan-400">₹{activeWaterPrice.toFixed(3)}</span>
              <span className="text-slate-500 font-normal">/ litre ({inputs.mainWaterSource})</span>
            </div>
          </div>
        </div>

        {/* Custom Price & Contractor Overrides */}
        <div className="mt-4 pt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
              Water Price Override (₹ / Litre)
            </label>
            <input
              type="number"
              step="0.005"
              placeholder={`Default: ₹${defaultPrice.toFixed(3)}`}
              value={inputs.customWaterPrice ?? ''}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setInputs(p => ({ ...p, customWaterPrice: isNaN(val) ? undefined : val }));
              }}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-cyan-500 outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">Leave empty to use source rate</span>
          </div>

          <div>
            <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
              Contractor Installation Quote (₹)
            </label>
            <input
              type="number"
              step="1000"
              placeholder={`Plan range: ₹${outputs.totalInstallCost.low.toLocaleString()} - ₹${outputs.totalInstallCost.high.toLocaleString()}`}
              value={inputs.customInstallCost ?? ''}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setInputs(p => ({ ...p, customInstallCost: isNaN(val) ? undefined : val }));
              }}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-cyan-500 outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">Overrides low/mid/high range</span>
          </div>

          <div>
            <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
              Annual Upkeep Quote (₹ / Year)
            </label>
            <input
              type="number"
              step="500"
              placeholder={`Range: ₹${outputs.yearlyUpkeepCost.low.toLocaleString()} - ₹${outputs.yearlyUpkeepCost.high.toLocaleString()}`}
              value={inputs.customUpkeepCost ?? ''}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setInputs(p => ({ ...p, customUpkeepCost: isNaN(val) ? undefined : val }));
              }}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-cyan-500 outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">Filters & maintenance contracts</span>
          </div>
        </div>
      </div>

      {/* 3 Scenarios Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {scenarios.map((sc) => {
          const isBase = sc.name === 'Base';
          const isOptimistic = sc.name === 'Optimistic';

          return (
            <div
              key={sc.name}
              className={`rounded-2xl p-5 border relative overflow-hidden transition-all shadow-xs ${
                isBase
                  ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700 ring-2 ring-blue-500/20'
                  : isOptimistic
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              {isBase && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-xs">
                  Recommended Base Case
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {sc.name} Scenario
                </h3>
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                  {sc.priceFactor}x Tariff
                </span>
              </div>

              {/* Payback Highlight Badge */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 mb-4 space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Estimated Simple Payback
                </span>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-black font-mono ${
                    sc.simplePaybackYears === null
                      ? 'text-rose-600 dark:text-rose-400'
                      : sc.simplePaybackYears <= 10
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    {sc.simplePaybackYears !== null ? `${sc.simplePaybackYears} Years` : 'No Payback'}
                  </span>
                  {sc.simplePaybackYears !== null && sc.simplePaybackYears <= 10 && (
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                      Fast Breakeven
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-1">
                  <Truck className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Saves <strong>{sc.tankerLoadsAvoidedPerYear} tankers</strong> of 12,000L / yr</span>
                </div>
              </div>

              {/* Detail Metrics */}
              <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800/80">
                <div className="flex justify-between pt-1.5">
                  <span className="text-slate-500">Capital Installation:</span>
                  <strong className="font-mono text-slate-900 dark:text-white">₹{sc.installationCost.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between pt-1.5">
                  <span className="text-slate-500">Annual Upkeep:</span>
                  <strong className="font-mono text-slate-900 dark:text-white">₹{sc.yearlyUpkeep.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between pt-1.5">
                  <span className="text-slate-500">Effective Water Tariff:</span>
                  <strong className="font-mono text-cyan-600 dark:text-cyan-400">₹{sc.priceUsed.toFixed(3)} / L</strong>
                </div>
                <div className="flex justify-between pt-1.5">
                  <span className="text-slate-500">Harvest Utilization:</span>
                  <strong className="font-mono text-slate-900 dark:text-white">{Math.round(sc.shareHarvestUsed * 100)}% ({sc.waterUsedLitres.toLocaleString()} L)</strong>
                </div>
                <div className="flex justify-between pt-1.5">
                  <span className="text-slate-500">Gross Saving / Year:</span>
                  <strong className="font-mono text-emerald-600 dark:text-emerald-400">₹{sc.savingPerYear.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between pt-1.5">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">Net Annual Gain:</span>
                  <strong className={`font-mono font-bold ${sc.netSavingAfterUpkeep >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                    {sc.netSavingAfterUpkeep >= 0 ? `+₹${sc.netSavingAfterUpkeep.toLocaleString()}` : `-₹${Math.abs(sc.netSavingAfterUpkeep).toLocaleString()}`}
                  </strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 10-Year Cumulative Cash Flow Graph & Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-600" />
              10-Year Cumulative Net Financial Position
            </h3>
            <span className="text-xs text-slate-400">Negative until the capital investment pays back</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visual progression: initial negative balance (-Capex) decreases annually as harvested rainwater substitutes purchased tanker or municipal water.
          </p>
        </div>

        {/* Visual Line Trajectory Chart (SVG) */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div className="h-60 sm:h-72 w-full relative">
            <svg viewBox="0 0 800 300" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="gridGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {/* Zero line (breakeven) */}
              {(() => {
                // Determine min and max across all 10 years
                const allVals = scenarios.flatMap(s => s.cumulative10Years);
                const minVal = Math.min(...allVals, -180000);
                const maxVal = Math.max(...allVals, 20000);

                const getY = (val: number) => {
                  const padding = 20;
                  const h = 260;
                  const ratio = (val - minVal) / (maxVal - minVal);
                  return h - ratio * h + padding;
                };

                const zeroY = getY(0);

                return (
                  <>
                    {/* Background Grid Lines */}
                    {[0, 2, 4, 6, 8, 10].map(yr => {
                      const x = 60 + yr * 70;
                      return (
                        <g key={yr}>
                          <line x1={x} y1="20" x2={x} y2="280" stroke="currentColor" strokeDasharray="3,3" className="text-slate-300 dark:text-slate-800" strokeWidth="1" />
                          <text x={x} y="295" textAnchor="middle" className="text-[10px] fill-slate-400 font-mono">Yr {yr}</text>
                        </g>
                      );
                    })}

                    {/* Zero Breakeven Horizontal Line */}
                    <line x1="40" y1={zeroY} x2="780" y2={zeroY} stroke="#10b981" strokeWidth="1.5" strokeDasharray="4,2" />
                    <text x="785" y={zeroY + 4} textAnchor="start" className="text-[10px] font-bold fill-emerald-600">Break-even (₹0)</text>

                    {/* Scenario Lines */}
                    {scenarios.map((sc) => {
                      const points = sc.cumulative10Years.map((val: number, yr: number) => {
                        const x = 60 + yr * 70;
                        const y = getY(val);
                        return `${x},${y}`;
                      }).join(' ');

                      const strokeColor = sc.name === 'Optimistic'
                        ? '#10b981'
                        : sc.name === 'Base'
                        ? '#3b82f6'
                        : '#f43f5e';

                      return (
                        <g key={sc.name}>
                          <polyline
                            fill="none"
                            stroke={strokeColor}
                            strokeWidth={sc.name === 'Base' ? "3" : "2"}
                            strokeDasharray={sc.name === 'Conservative' ? '4,4' : 'none'}
                            points={points}
                          />
                          {sc.cumulative10Years.map((val: number, yr: number) => {
                            const x = 60 + yr * 70;
                            const y = getY(val);
                            return (
                              <circle
                                key={yr}
                                cx={x}
                                cy={y}
                                r={sc.name === 'Base' ? 4 : 3}
                                fill={strokeColor}
                                className="cursor-pointer hover:r-6 transition-all"
                              >
                                <title>{`${sc.name} Year ${yr}: ₹${val.toLocaleString()}`}</title>
                              </circle>
                            );
                          })}
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-3 text-xs pt-2 border-t border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Base Scenario</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Optimistic (₹0.168/L)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Conservative (Higher cost, 50% cap)</span>
            </div>
          </div>
        </div>

        {/* Detailed 10-Year Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 font-semibold">Year</th>
                <th className="py-2.5 text-right font-semibold text-rose-600 dark:text-rose-400">Conservative (₹)</th>
                <th className="py-2.5 text-right font-semibold text-blue-600 dark:text-blue-400">Base Scenario (₹)</th>
                <th className="py-2.5 text-right font-semibold text-emerald-600 dark:text-emerald-400">Optimistic (₹)</th>
                <th className="py-2.5 pl-4 font-semibold text-slate-400">Milestone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono text-slate-700 dark:text-slate-300">
              {Array.from({ length: 11 }).map((_, yr) => {
                const con = scenarios[0].cumulative10Years[yr];
                const base = scenarios[1].cumulative10Years[yr];
                const opt = scenarios[2].cumulative10Years[yr];

                const isPaybackOpt = opt >= 0 && scenarios[2].cumulative10Years[Math.max(0, yr - 1)] < 0;
                const isPaybackBase = base >= 0 && scenarios[1].cumulative10Years[Math.max(0, yr - 1)] < 0;

                return (
                  <tr key={yr} className={yr === 0 ? 'bg-slate-50 dark:bg-slate-800/40' : ''}>
                    <td className="py-2 font-bold font-sans">
                      {yr === 0 ? 'Year 0 (Capex Outlay)' : `Year ${yr}`}
                    </td>
                    <td className="py-2 text-right">
                      {con < 0 ? `(₹${Math.abs(con).toLocaleString()})` : `+₹${con.toLocaleString()}`}
                    </td>
                    <td className="py-2 text-right font-semibold">
                      {base < 0 ? `(₹${Math.abs(base).toLocaleString()})` : `+₹${base.toLocaleString()}`}
                    </td>
                    <td className={`py-2 text-right font-semibold ${opt >= 0 ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                      {opt < 0 ? `(₹${Math.abs(opt).toLocaleString()})` : `+₹${opt.toLocaleString()}`}
                    </td>
                    <td className="py-2 pl-4 font-sans text-[11px]">
                      {yr === 0 ? (
                        <span className="text-slate-400">Initial system setup</span>
                      ) : isPaybackOpt ? (
                        <span className="text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                          ★ Optimistic Breakeven!
                        </span>
                      ) : isPaybackBase ? (
                        <span className="text-blue-600 font-bold bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                          ★ Base Breakeven!
                        </span>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Note on Aquifer Recharge Value:</strong> Financial payback only credits water stored directly in tanks and substituted for piped/tanker consumption. Water recharged into deep borewells and ground aquifers provides immense ecological security, prevents borewell deepening expenses (which cost ₹1.5L - ₹3L+ when a borewell dries), and guarantees water availability during severe heatwaves.
          </span>
        </div>
      </div>
    </div>
  );
};
