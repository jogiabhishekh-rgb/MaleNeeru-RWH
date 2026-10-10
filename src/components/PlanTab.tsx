import React, { useState } from 'react';
import { 
  PlanInputs, 
  PlanOutputs, 
  PropertyType, 
  RoofSurface, 
  SoilType, 
  MainWaterSource 
} from '../types/rwh';
import { BENGALURU_AREAS, WATER_SOURCE_PRICES, ROOF_RUNOFF_MAP } from '../data/bengaluruData';
import { 
  Building2, 
  Droplet, 
  ShieldAlert, 
  CheckCircle2, 
  Calendar, 
  Sliders, 
  DollarSign, 
  FileDown, 
  Copy, 
  Share2, 
  Layers, 
  Info,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

interface PlanTabProps {
  inputs: PlanInputs;
  setInputs: React.Dispatch<React.SetStateAction<PlanInputs>>;
  outputs: PlanOutputs;
  onOpenExport: () => void;
  onAddInstallation: () => void;
}

export const PlanTab: React.FC<PlanTabProps> = ({
  inputs,
  setInputs,
  outputs,
  onOpenExport,
  onAddInstallation
}) => {
  const [showAdvancedAssumptions, setShowAdvancedAssumptions] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedArea = BENGALURU_AREAS.find(a => a.name === inputs.area) || BENGALURU_AREAS[0];

  const handleCopySummary = () => {
    const text = `Male Neeru - Rainwater Harvesting Plan for Bengaluru
Area: ${inputs.area} (Stress: ${selectedArea.stressIndex}/100)
Property: ${inputs.propertyType}, Roof: ${inputs.roofAreaSqFt} sq ft (${outputs.roofAreaM2} m²)
Annual Harvest: ${outputs.estimatedAnnualHarvestLitres.toLocaleString()} Litres (${outputs.estimatedAnnualHarvestKL} kL)
Suggested System: ${outputs.suggestedSystem}
Tank Capacity: ${outputs.tankCapacityLitres.toLocaleString()} L (${outputs.tankLengthM}m x ${outputs.tankWidthM}m)
Estimated Cost: ₹${outputs.totalInstallCost.low.toLocaleString()} - ₹${outputs.totalInstallCost.high.toLocaleString()}
BWSSB Compliance: ${outputs.complianceStatus}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Bengaluru Context Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white shadow-md relative overflow-hidden border border-blue-800/40">
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" /> Customized Engineering Sizing Engine
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              RWH Plan for {inputs.area}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Bengaluru receives ~970 mm of annual rainfall. With proper collection efficiency and rooftop desilting, 
              this property can capture <strong className="text-cyan-300 font-mono">{outputs.estimatedAnnualHarvestLitres.toLocaleString()} litres</strong> annually, 
              meeting <strong className="text-emerald-300">{outputs.shareDemandCoveredPct}%</strong> of domestic non-drinking water requirements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
            <button
              onClick={handleCopySummary}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition-all border border-white/10"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
            </button>
            <button
              onClick={onOpenExport}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/30 transition-all"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export Official Plan</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                Property & Site Specifications
              </h3>
              <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-800">
                Inputs Sheet
              </span>
            </div>

            <div className="space-y-4 text-xs">
              {/* Bengaluru Area */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bengaluru Ward / Locality
                </label>
                <select
                  value={inputs.area}
                  onChange={(e) => setInputs(prev => ({ ...prev, area: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-cyan-500 outline-none"
                >
                  {BENGALURU_AREAS.map((a) => (
                    <option key={a.id} value={a.name}>
                      {a.name} ({a.zone} — Stress: {a.stressIndex}/100)
                    </option>
                  ))}
                </select>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Cauvery Supply: <strong className="text-slate-700 dark:text-slate-200">{selectedArea.cauveryCoverage}</strong></span>
                  <span className={`px-1.5 py-0.2 rounded font-semibold text-[10px] ${
                    selectedArea.stressIndex >= 80 ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' :
                    selectedArea.stressIndex >= 65 ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                    'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  }`}>
                    Stress Index: {selectedArea.stressIndex}
                  </span>
                </div>
              </div>

              {/* Property Type & Year Built */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Property Type
                  </label>
                  <select
                    value={inputs.propertyType}
                    onChange={(e) => setInputs(prev => ({ ...prev, propertyType: e.target.value as PropertyType }))}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-cyan-500 outline-none"
                  >
                    <option value="Independent house">Independent house</option>
                    <option value="Apartment complex">Apartment complex</option>
                    <option value="Commercial or institution">Commercial or institution</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Year Built
                  </label>
                  <input
                    type="number"
                    min={1950}
                    max={2026}
                    value={inputs.yearBuilt}
                    onChange={(e) => setInputs(prev => ({ ...prev, yearBuilt: parseInt(e.target.value) || 2021 }))}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                  <span className="text-[10px] text-slate-400">Post-2021 triggers BWSSB rule</span>
                </div>
              </div>

              {/* Plot Dimensions */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Plot Dimensions (ft)
                  </label>
                  <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                    {outputs.plotAreaSqFt.toLocaleString()} sq ft ({Math.round(outputs.plotAreaSqFt * 0.092903)} m²)
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type="number"
                      min={10}
                      value={inputs.plotLength}
                      onChange={(e) => setInputs(prev => ({ ...prev, plotLength: Math.max(1, parseInt(e.target.value) || 0) }))}
                      className="w-full px-3 py-2 pr-8 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-cyan-500 outline-none"
                    />
                    <span className="absolute right-2.5 top-2.5 text-slate-400 font-mono text-[11px]">ft L</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min={10}
                      value={inputs.plotWidth}
                      onChange={(e) => setInputs(prev => ({ ...prev, plotWidth: Math.max(1, parseInt(e.target.value) || 0) }))}
                      className="w-full px-3 py-2 pr-8 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-cyan-500 outline-none"
                    />
                    <span className="absolute right-2.5 top-2.5 text-slate-400 font-mono text-[11px]">ft W</span>
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span>Common Bangalore layouts:</span>
                  <button type="button" onClick={() => setInputs(p => ({ ...p, plotLength: 60, plotWidth: 40 }))} className="text-cyan-600 underline font-semibold hover:text-cyan-700">60x40 (2,400)</button>
                  <span>•</span>
                  <button type="button" onClick={() => setInputs(p => ({ ...p, plotLength: 40, plotWidth: 30 }))} className="text-cyan-600 underline font-semibold hover:text-cyan-700">30x40 (1,200)</button>
                  <span>•</span>
                  <button type="button" onClick={() => setInputs(p => ({ ...p, plotLength: 80, plotWidth: 50 }))} className="text-cyan-600 underline font-semibold hover:text-cyan-700">80x50 (4,000)</button>
                </div>
              </div>

              {/* Roof Area & Surface Material */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Roof Area (sq ft)
                  </label>
                  <input
                    type="number"
                    min={50}
                    value={inputs.roofAreaSqFt}
                    onChange={(e) => setInputs(prev => ({ ...prev, roofAreaSqFt: Math.max(1, parseInt(e.target.value) || 0) }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                  <span className="text-[11px] text-slate-400 font-mono">
                    = {outputs.roofAreaM2} m² catchment
                  </span>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Roof Surface
                  </label>
                  <select
                    value={inputs.roofSurface}
                    onChange={(e) => setInputs(prev => ({ ...prev, roofSurface: e.target.value as RoofSurface }))}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-cyan-500 outline-none"
                  >
                    <option value="Concrete terrace (RCC)">Concrete RCC (0.80)</option>
                    <option value="Clay or Mangalore tile">Mangalore tile (0.75)</option>
                    <option value="Metal sheet">Metal sheet (0.90)</option>
                    <option value="Asbestos or cement sheet">Cement sheet (0.85)</option>
                  </select>
                  <span className="text-[11px] text-slate-400">
                    Runoff: {outputs.runoffCoefficient}
                  </span>
                </div>
              </div>

              {/* Occupants & Open Ground */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    People living / working
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={inputs.peopleCount}
                    onChange={(e) => setInputs(prev => ({ ...prev, peopleCount: Math.max(1, parseInt(e.target.value) || 1) }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                  <span className="text-[11px] text-slate-400">
                    45 L/day non-drinking each
                  </span>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Open Ground (sq ft)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={inputs.openGroundSqFt}
                    onChange={(e) => setInputs(prev => ({ ...prev, openGroundSqFt: Math.max(0, parseInt(e.target.value) || 0) }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                  <span className="text-[11px] text-slate-400">
                    Unpaved garden/setback
                  </span>
                </div>
              </div>

              {/* Soil Type & Existing Borewell */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Soil at Site
                  </label>
                  <select
                    value={inputs.soilType}
                    onChange={(e) => setInputs(prev => ({ ...prev, soilType: e.target.value as SoilType }))}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-cyan-500 outline-none"
                  >
                    <option value="Red soil or laterite">Red soil or laterite (Drains well)</option>
                    <option value="Sandy or gravelly">Sandy or gravelly (Drains well)</option>
                    <option value="Clayey or black soil">Clayey / black soil (Drains poorly)</option>
                    <option value="Hard rock close to surface">Hard rock close to surface (Poor)</option>
                  </select>
                  <div className="mt-1 flex items-center gap-1 text-[11px]">
                    <span className="text-slate-400">Percolation:</span>
                    <span className={outputs.soilDrainsWell ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>
                      {outputs.soilDrainsWell ? 'Well draining' : 'Slow infiltration'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Existing Borewell?
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setInputs(prev => ({ ...prev, existingBorewell: true }))}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        inputs.existingBorewell
                          ? 'bg-cyan-600 border-cyan-600 text-white shadow-xs'
                          : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputs(prev => ({ ...prev, existingBorewell: false }))}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        !inputs.existingBorewell
                          ? 'bg-slate-700 border-slate-700 text-white shadow-xs'
                          : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      No
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Enables direct aquifer recharge
                  </span>
                </div>
              </div>

              {/* Main Water Source Now */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Current Primary Water Source
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'Private tanker' as MainWaterSource, label: 'Private Tanker', price: '₹0.12/L' },
                    { key: 'BWSSB piped supply' as MainWaterSource, label: 'BWSSB Piped', price: '₹0.04/L' },
                    { key: 'Own borewell' as MainWaterSource, label: 'Own Borewell', price: '₹0.01/L' },
                  ].map((src) => {
                    const isSelected = inputs.mainWaterSource === src.key;
                    return (
                      <button
                        key={src.key}
                        type="button"
                        onClick={() => setInputs(prev => ({ ...prev, mainWaterSource: src.key }))}
                        className={`p-2 rounded-xl text-left border transition-all ${
                          isSelected
                            ? 'border-cyan-500 bg-cyan-50/80 dark:bg-cyan-950/60 ring-1 ring-cyan-500 text-cyan-900 dark:text-cyan-200'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <div className="font-bold text-[11px] leading-tight">{src.label}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{src.price}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Advanced Assumptions Accordion */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAdvancedAssumptions(!showAdvancedAssumptions)}
                  className="w-full flex items-center justify-between text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 py-1"
                >
                  <span className="flex items-center gap-1.5 font-semibold text-xs">
                    <Sliders className="w-3.5 h-3.5 text-cyan-600" />
                    Hydrology & Sizing Assumptions
                  </span>
                  {showAdvancedAssumptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showAdvancedAssumptions && (
                  <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-3 text-xs border border-slate-200/60 dark:border-slate-700/60">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium text-slate-600 dark:text-slate-400 mb-0.5">Annual Rainfall (mm)</label>
                        <input
                          type="number"
                          value={inputs.annualRainfallOverride ?? 970}
                          onChange={(e) => setInputs(p => ({ ...p, annualRainfallOverride: parseInt(e.target.value) || 970 }))}
                          className="w-full px-2 py-1 bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-700 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-slate-600 dark:text-slate-400 mb-0.5">Design Storm (mm)</label>
                        <input
                          type="number"
                          value={inputs.designStormOverride ?? 25}
                          onChange={(e) => setInputs(p => ({ ...p, designStormOverride: parseInt(e.target.value) || 25 }))}
                          className="w-full px-2 py-1 bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-700 font-mono"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium text-slate-600 dark:text-slate-400 mb-0.5">Non-Drinking (L/p/d)</label>
                        <input
                          type="number"
                          value={inputs.nonDrinkingUseOverride ?? 45}
                          onChange={(e) => setInputs(p => ({ ...p, nonDrinkingUseOverride: parseInt(e.target.value) || 45 }))}
                          className="w-full px-2 py-1 bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-700 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-slate-600 dark:text-slate-400 mb-0.5">Share Harvest Used (%)</label>
                        <input
                          type="number"
                          min={10}
                          max={100}
                          value={Math.round((inputs.shareHarvestUsedOverride ?? 0.65) * 100)}
                          onChange={(e) => setInputs(p => ({ ...p, shareHarvestUsedOverride: (parseInt(e.target.value) || 65) / 100 }))}
                          className="w-full px-2 py-1 bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-700 font-mono"
                        />
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Collection efficiency fixed at <strong>0.85</strong> (accounting for first-flush rejection and splash losses).
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* BWSSB Compliance Status Card */}
          <div className={`rounded-2xl p-4 border transition-all ${
            outputs.complianceStatus === 'Likely required'
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
          }`}>
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm">BWSSB Compliance Status</h4>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-950 dark:text-amber-100">
                    {outputs.complianceStatus}
                  </span>
                </div>
                <p className="text-xs mt-1 leading-relaxed opacity-90">
                  {outputs.plotAreaSqFt >= 2400
                    ? `Under the Karnataka Municipal Corporations & BWSSB Act, sites of 2,400 sq ft (60x40 ft) or more are legally mandated to install rainwater harvesting systems. Non-compliant properties face a 50% monthly water tariff surcharge penalty.`
                    : outputs.plotAreaSqFt >= 1200 && inputs.yearBuilt >= 2021
                    ? `New constructions built in 2021 or later on plots of 1,200 sq ft (30x40 ft) are mandated under updated municipal building bylaws.`
                    : `While not strictly required by plot size threshold, installing RWH is strongly recommended in Bengaluru to offset erratic tanker dependencies and preserve local borewells.`}
                </p>
                {outputs.largeOrNonResidential && (
                  <div className="mt-2 text-[11px] bg-white/60 dark:bg-black/30 p-2 rounded-lg border border-amber-300 dark:border-amber-700/60 font-medium">
                    ⚠️ {outputs.dualPipeNote}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Engineering Plan & Outputs (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Key Result Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Annual Harvest</div>
              <div className="text-xl sm:text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-1">
                {outputs.estimatedAnnualHarvestKL.toLocaleString()} <span className="text-xs font-bold text-slate-500">kL</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                {outputs.estimatedAnnualHarvestLitres.toLocaleString()} Litres
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Demand Met</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {outputs.shareDemandCoveredPct}%
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                {outputs.waterCouldUseLitres.toLocaleString()} L / {outputs.nonDrinkingDemandLitres.toLocaleString()} L
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Tank Capacity</div>
              <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                {outputs.tankCapacityLitres.toLocaleString()} <span className="text-xs font-bold text-slate-500">L</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                {outputs.tankVolumeM3} m³ (15d buffer)
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Tanker Trips Saved</div>
              <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                {(outputs.waterCouldUseLitres / 12000).toFixed(1)} <span className="text-xs font-bold text-slate-500">trips</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                12,000L loads/yr
              </div>
            </div>
          </div>

          {/* Sizing & Engineering Recommendation Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-600 dark:text-cyan-400">
                  Recommended System Architecture
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  {outputs.suggestedSystem}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {outputs.downpipeEstimate} Downpipes (100mm)
                </span>
              </div>
            </div>

            {/* Technical Specifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Storage Tank Specs */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400">
                  <Layers className="w-4 h-4" />
                  Masonry / RCC Storage Tank
                </div>
                <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Effective Volume:</span>
                    <strong className="font-mono text-slate-900 dark:text-white">{outputs.tankVolumeM3} m³ ({outputs.tankCapacityLitres.toLocaleString()} L)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Water Depth:</span>
                    <strong className="font-mono">{outputs.tankWaterDepthM} m + 0.3m freeboard</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Plan Footprint:</span>
                    <strong className="font-mono">{outputs.tankPlanAreaM2} m²</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimensions (1.5:1 ratio):</span>
                    <strong className="font-mono text-blue-600 dark:text-blue-300">{outputs.tankLengthM} m (L) × {outputs.tankWidthM} m (W)</strong>
                  </div>
                </div>
              </div>

              {/* Recharge Structure Specs */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs text-cyan-600 dark:text-cyan-400">
                  <Droplet className="w-4 h-4" />
                  {outputs.rechargeStructureType}
                </div>
                <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
                  {outputs.rechargeStructureType === 'Recharge well' ? (
                    <>
                      <div className="flex justify-between">
                        <span>Well Diameter:</span>
                        <strong className="font-mono">1.0 m concrete rings</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Depth:</span>
                        <strong className="font-mono">8 to 15 m (to permeable layer)</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Target:</span>
                        <strong className="text-emerald-600 dark:text-emerald-400">Direct Aquifer Injection</strong>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Connects roof overflow via dual-chamber silt trap into borewell casing or surrounding gravel pack.
                      </p>
                    </>
                  ) : outputs.rechargeStructureType === 'Recharge pit' ? (
                    <>
                      <div className="flex justify-between">
                        <span>Number of Pits:</span>
                        <strong className="font-mono text-slate-900 dark:text-white">{outputs.numberOfPits} Circular Pit(s)</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Pit Size:</span>
                        <strong className="font-mono">1.2m dia × 3.0m depth</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Filter Media:</span>
                        <strong className="font-mono">Gravel, charcoal & coarse sand (35% voids)</strong>
                      </div>
                      {outputs.useTrenchInstead && (
                        <div className="mt-1 text-amber-600 font-semibold">
                          Trench recommended: {outputs.trenchLengthM}m length × 1.0m width × 1.5m depth
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-[11px] text-slate-500">
                      Site constraints (limited open ground or dense rock layer) indicate primary reliance on storage tank with filtered overflow pipe to stormwater drain.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Design Storm & Collection Details */}
            <div className="p-3 bg-cyan-50/50 dark:bg-cyan-950/20 rounded-xl border border-cyan-100 dark:border-cyan-900/60 text-xs flex flex-wrap items-center justify-between gap-3 text-cyan-900 dark:text-cyan-200">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                <span>
                  Sized for a <strong>25 mm Design Storm</strong> generating <strong>{outputs.designStormVolumeM3} m³</strong> ({Math.round(outputs.designStormVolumeM3 * 1000)} L) in a single thunderstorm event.
                </span>
              </div>
              <button
                type="button"
                onClick={onAddInstallation}
                className="text-xs font-bold text-cyan-700 dark:text-cyan-300 hover:underline flex items-center gap-1"
              >
                + Register this system in Community Map →
              </button>
            </div>
          </div>

          {/* Cost Estimate Range */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Estimated Investment & Upkeep (₹ Indian Rupees)
              </h3>
              <span className="text-[11px] text-slate-400">Bengaluru contractor planning range</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-2 font-semibold">Bill of Quantities (BOQ)</th>
                    <th className="py-2 text-right font-semibold">Low End</th>
                    <th className="py-2 text-right font-semibold">High End</th>
                    <th className="py-2 pl-4 font-semibold hidden sm:table-cell">Basis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  <tr>
                    <td className="py-2 font-medium">Storage Tank ({outputs.tankCapacityLitres.toLocaleString()} L)</td>
                    <td className="py-2 text-right font-mono">₹{outputs.costStorageTank.low.toLocaleString()}</td>
                    <td className="py-2 text-right font-mono">₹{outputs.costStorageTank.high.toLocaleString()}</td>
                    <td className="py-2 pl-4 text-slate-400 text-[11px] hidden sm:table-cell">₹9 - ₹16 per litre capacity</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">{outputs.rechargeStructureType}</td>
                    <td className="py-2 text-right font-mono">
                      {outputs.costRechargeStructure.low > 0 ? `₹${outputs.costRechargeStructure.low.toLocaleString()}` : '-'}
                    </td>
                    <td className="py-2 text-right font-mono">
                      {outputs.costRechargeStructure.high > 0 ? `₹${outputs.costRechargeStructure.high.toLocaleString()}` : '-'}
                    </td>
                    <td className="py-2 pl-4 text-slate-400 text-[11px] hidden sm:table-cell">
                      {outputs.rechargeStructureType === 'Recharge well' ? '₹30k - ₹70k turnkey well' : '₹4k - ₹8k per m³ pit'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Gutters, First-Flush & Pop-up Filters</td>
                    <td className="py-2 text-right font-mono">₹{outputs.costGuttersFilterPlumbing.low.toLocaleString()}</td>
                    <td className="py-2 text-right font-mono">₹{outputs.costGuttersFilterPlumbing.high.toLocaleString()}</td>
                    <td className="py-2 pl-4 text-slate-400 text-[11px] hidden sm:table-cell">₹6k-12k base + ₹80-160/m² roof</td>
                  </tr>
                  <tr className="text-slate-500 font-semibold bg-slate-50/50 dark:bg-slate-800/30">
                    <td className="py-2">Contingency (10%)</td>
                    <td className="py-2 text-right font-mono">₹{outputs.contingencyCost.low.toLocaleString()}</td>
                    <td className="py-2 text-right font-mono">₹{outputs.contingencyCost.high.toLocaleString()}</td>
                    <td className="py-2 pl-4 text-slate-400 text-[11px] hidden sm:table-cell">Plumbing surprises & civil work</td>
                  </tr>
                  <tr className="font-bold text-sm bg-cyan-50/50 dark:bg-cyan-950/40 text-cyan-950 dark:text-cyan-200">
                    <td className="py-2.5">Total Installation Cost</td>
                    <td className="py-2.5 text-right font-mono">₹{outputs.totalInstallCost.low.toLocaleString()}</td>
                    <td className="py-2.5 text-right font-mono">₹{outputs.totalInstallCost.high.toLocaleString()}</td>
                    <td className="py-2.5 pl-4 text-slate-500 text-[11px] hidden sm:table-cell">Initial Capital Outlay</td>
                  </tr>
                  <tr className="text-emerald-700 dark:text-emerald-300 font-medium">
                    <td className="py-2">Yearly Upkeep & Filter Media Replacements</td>
                    <td className="py-2 text-right font-mono">₹{outputs.yearlyUpkeepCost.low.toLocaleString()}</td>
                    <td className="py-2 text-right font-mono">₹{outputs.yearlyUpkeepCost.high.toLocaleString()}</td>
                    <td className="py-2 pl-4 text-slate-400 text-[11px] hidden sm:table-cell">2-4% of capital cost (min ₹1,500/₹3,000)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Maintenance Calendar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              Annual Maintenance Protocol for Bengaluru Climate
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="font-bold text-amber-600 dark:text-amber-400 text-[11px] uppercase tracking-wide">
                  Before Monsoon (April - May)
                </span>
                <ul className="mt-1 space-y-1 text-slate-600 dark:text-slate-300 list-disc list-inside">
                  <li>Sweep roof thoroughly to remove dry leaves and pigeon droppings.</li>
                  <li>Check downpipe mesh and replace degraded wire gauze.</li>
                  <li>Flush the first-flush diverter pipe and inspect silt chamber.</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="font-bold text-blue-600 dark:text-blue-400 text-[11px] uppercase tracking-wide">
                  During Heavy Rains (July - Oct)
                </span>
                <ul className="mt-1 space-y-1 text-slate-600 dark:text-slate-300 list-disc list-inside">
                  <li>Verify that first 15 mins of heavy rain bypasses to drain.</li>
                  <li>Inspect recharge well inlet to ensure no cloudy mud enters aquifer.</li>
                  <li>Ensure storage tank overflow has a mosquito-proof wire mesh.</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px] uppercase tracking-wide">
                  After Monsoon (Nov - Dec)
                </span>
                <ul className="mt-1 space-y-1 text-slate-600 dark:text-slate-300 list-disc list-inside">
                  <li>Desilt sediment chamber and clean storage tank floor.</li>
                  <li>Wash filter sponge/nylon filter media with mild chlorine.</li>
                  <li>Close downpipes for dry season if leaf shedding begins.</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="font-bold text-purple-600 dark:text-purple-400 text-[11px] uppercase tracking-wide">
                  Year-Round Golden Rules
                </span>
                <ul className="mt-1 space-y-1 text-slate-600 dark:text-slate-300 list-disc list-inside">
                  <li>Never connect sewage or kitchen sink drains into RWH lines.</li>
                  <li>Keep recharge pit top slab elevated 15 cm above ground to avoid road water ingress.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
