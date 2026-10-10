import React from 'react';
import { PlanInputs, PlanOutputs } from '../types/rwh';
import { BENGALURU_AREAS } from '../data/bengaluruData';
import { X, Printer, Copy, Check, FileText, ShieldCheck } from 'lucide-react';

interface ExportSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: PlanInputs;
  outputs: PlanOutputs;
}

export const ExportSummaryModal: React.FC<ExportSummaryModalProps> = ({
  isOpen,
  onClose,
  inputs,
  outputs
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const areaInfo = BENGALURU_AREAS.find(a => a.name === inputs.area) || BENGALURU_AREAS[0];

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = `
MALE NEERU: BENGALURU RAINWATER HARVESTING & ARTIFICIAL RECHARGE PLAN
Generated on: ${new Date().toLocaleDateString('en-IN')}

============================================================
PROPERTY & SITE SPECIFICATIONS
============================================================
Location / Ward: ${inputs.area} (Stress Index: ${areaInfo.stressIndex}/100)
Cauvery Supply Status: ${areaInfo.cauveryCoverage} Coverage
Property Type: ${inputs.propertyType}
Year Built: ${inputs.yearBuilt}
Plot Dimensions: ${inputs.plotLength} ft x ${inputs.plotWidth} ft (${outputs.plotAreaSqFt.toLocaleString()} sq ft)
Roof Catchment Area: ${inputs.roofAreaSqFt.toLocaleString()} sq ft (${outputs.roofAreaM2} m²)
Roof Surface: ${inputs.roofSurface} (Runoff Coeff: ${outputs.runoffCoefficient})
Occupants / Workforce: ${inputs.peopleCount} persons
Open Ground Available: ${inputs.openGroundSqFt} sq ft
Soil Characteristics: ${inputs.soilType} (Infiltration: ${outputs.soilDrainsWell ? 'Good' : 'Restricted'})
Existing Borewell: ${inputs.existingBorewell ? 'Yes' : 'No'}
Current Main Supply: ${inputs.mainWaterSource}

============================================================
HYDROLOGICAL HARVEST & SIZING SPECIFICATIONS
============================================================
Annual Rainfall Assumed: 970 mm (Bengaluru Benchmark)
Total Potential Roof Harvest: ${outputs.estimatedAnnualHarvestLitres.toLocaleString()} Litres (${outputs.estimatedAnnualHarvestKL} kL)
Annual Domestic Non-Drinking Demand: ${outputs.nonDrinkingDemandLitres.toLocaleString()} Litres (45 L/person/day)
Harvest Utilized Directly: ${outputs.waterCouldUseLitres.toLocaleString()} Litres (${outputs.shareDemandCoveredPct}% of demand met)
Estimated Tanker Trips Averted: ${(outputs.waterCouldUseLitres / 12000).toFixed(1)} loads (12,000L tankers/year)

============================================================
RECOMMENDED SYSTEM ARCHITECTURE
============================================================
Suggested System: ${outputs.suggestedSystem}
Masonry / RCC Storage Tank: ${outputs.tankCapacityLitres.toLocaleString()} Litres (${outputs.tankVolumeM3} m³)
Tank Dimensions: ${outputs.tankLengthM}m (L) x ${outputs.tankWidthM}m (W) x ${outputs.tankWaterDepthM}m (D) + 0.3m freeboard
Downpipes Required: ${outputs.downpipeEstimate} Nos (100mm dia UV-PVC)
Recharge Unit: ${outputs.rechargeStructureType}
${outputs.rechargeStructureType === 'Recharge well' ? '- 1.0m diameter concrete rings, 8-15m depth, direct borewell aquifer link' : ''}
${outputs.rechargeStructureType === 'Recharge pit' ? `- ${outputs.numberOfPits} circular pit(s) of 1.2m dia x 3.0m depth with aggregate filter media` : ''}

============================================================
ESTIMATED INVESTMENT & BILL OF QUANTITIES
============================================================
Storage Tank: ₹${outputs.costStorageTank.low.toLocaleString()} - ₹${outputs.costStorageTank.high.toLocaleString()}
Recharge Structure: ₹${outputs.costRechargeStructure.low.toLocaleString()} - ₹${outputs.costRechargeStructure.high.toLocaleString()}
Gutters, Pop-up Filter & Plumbing: ₹${outputs.costGuttersFilterPlumbing.low.toLocaleString()} - ₹${outputs.costGuttersFilterPlumbing.high.toLocaleString()}
Contingency (10%): ₹${outputs.contingencyCost.low.toLocaleString()} - ₹${outputs.contingencyCost.high.toLocaleString()}
------------------------------------------------------------
TOTAL INITIAL CAPITAL: ₹${outputs.totalInstallCost.low.toLocaleString()} - ₹${outputs.totalInstallCost.high.toLocaleString()}
Annual Filter Maintenance: ₹${outputs.yearlyUpkeepCost.low.toLocaleString()} - ₹${outputs.yearlyUpkeepCost.high.toLocaleString()} / year

============================================================
MUNICIPAL COMPLIANCE STATUS
============================================================
BWSSB Act Mandatory Status: ${outputs.complianceStatus}
Dual-Piping Note: ${outputs.dualPipeNote}
Helplines: BWSSB 1916 | BBMP 1533
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Male Neeru Engineering Plan Dossier
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Print-ready specification report for contractor quotation & BWSSB compliance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-700 dark:text-slate-300">
          {/* Official Letterhead */}
          <div className="border-b pb-4 flex justify-between items-start border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                MALE NEERU: RWH & RECHARGE PLAN
              </h2>
              <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold block">
                Namma Bengaluru Water Conservation Initiative
              </span>
            </div>
            <div className="text-right text-[11px] font-mono text-slate-400">
              <div>Ref: MN-BLR-{Math.floor(10000 + Math.random() * 90000)}</div>
              <div>Date: {new Date().toLocaleDateString('en-IN')}</div>
            </div>
          </div>

          {/* Section 1: Property Details */}
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-[11px] text-slate-400">
              1. Site & Catchment Parameters
            </h4>
            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl font-mono text-[11px]">
              <div><span className="text-slate-400 font-sans">Locality:</span> <strong>{inputs.area}</strong></div>
              <div><span className="text-slate-400 font-sans">Plot Area:</span> <strong>{outputs.plotAreaSqFt.toLocaleString()} sq ft ({inputs.plotLength}x{inputs.plotWidth}ft)</strong></div>
              <div><span className="text-slate-400 font-sans">Roof Area:</span> <strong>{inputs.roofAreaSqFt.toLocaleString()} sq ft ({outputs.roofAreaM2} m²)</strong></div>
              <div><span className="text-slate-400 font-sans">Roof Material:</span> <strong>{inputs.roofSurface}</strong></div>
              <div><span className="text-slate-400 font-sans">Occupancy:</span> <strong>{inputs.peopleCount} occupants</strong></div>
              <div><span className="text-slate-400 font-sans">Soil / Infiltration:</span> <strong>{inputs.soilType}</strong></div>
            </div>
          </div>

          {/* Section 2: Hydrological Yield */}
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-[11px] text-slate-400">
              2. Annual Harvest & Water Balance
            </h4>
            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl font-mono text-[11px]">
              <div><span className="text-slate-400 font-sans">Annual Harvest:</span> <strong className="text-cyan-600 dark:text-cyan-400">{outputs.estimatedAnnualHarvestLitres.toLocaleString()} Litres ({outputs.estimatedAnnualHarvestKL} kL)</strong></div>
              <div><span className="text-slate-400 font-sans">Non-Drinking Demand:</span> <strong>{outputs.nonDrinkingDemandLitres.toLocaleString()} Litres/year</strong></div>
              <div><span className="text-slate-400 font-sans">Demand Covered:</span> <strong className="text-emerald-600 dark:text-emerald-400">{outputs.shareDemandCoveredPct}% met by rainwater</strong></div>
              <div><span className="text-slate-400 font-sans">Tanker Loads Averted:</span> <strong className="text-amber-600 dark:text-amber-400">{(outputs.waterCouldUseLitres / 12000).toFixed(1)} loads (12 kL each)</strong></div>
            </div>
          </div>

          {/* Section 3: Engineering Sizing */}
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-[11px] text-slate-400">
              3. Recommended System Specifications
            </h4>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1.5 text-[11px]">
              <div><strong>Suggested Architecture:</strong> {outputs.suggestedSystem}</div>
              <div><strong>Storage Tank Capacity:</strong> {outputs.tankCapacityLitres.toLocaleString()} L ({outputs.tankVolumeM3} m³) — Dimensions: {outputs.tankLengthM}m (L) x {outputs.tankWidthM}m (W) x {outputs.tankWaterDepthM}m (D)</div>
              <div><strong>Downpipes:</strong> {outputs.downpipeEstimate} downpipes (100mm diameter)</div>
              <div><strong>Recharge Component:</strong> {outputs.rechargeStructureType}</div>
            </div>
          </div>

          {/* Section 4: Budget & Compliance */}
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-[11px] text-slate-400">
              4. Budget Estimate & Compliance Certification
            </h4>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span>Capital Installation Budget:</span>
                <strong className="font-mono text-cyan-600 dark:text-cyan-400">₹{outputs.totalInstallCost.low.toLocaleString()} - ₹{outputs.totalInstallCost.high.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span>Annual Maintenance Reserve:</span>
                <strong className="font-mono">₹{outputs.yearlyUpkeepCost.low.toLocaleString()} - ₹{outputs.yearlyUpkeepCost.high.toLocaleString()} / year</strong>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                <span>BWSSB Regulatory Requirement:</span>
                <strong className="text-amber-600 dark:text-amber-400 font-bold">{outputs.complianceStatus}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Text' : 'Copy Plaintext Plan'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/20 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
