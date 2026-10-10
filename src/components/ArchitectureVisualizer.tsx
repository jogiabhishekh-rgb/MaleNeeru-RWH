import React, { useState } from 'react';
import { 
  Droplet, 
  Layers, 
  ShieldCheck, 
  CheckCircle, 
  HelpCircle, 
  ArrowRight, 
  Zap, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface StageInfo {
  id: string;
  name: string;
  subtitle: string;
  desc: string;
  bengaluruTip: string;
  failureRisk: string;
}

export const ArchitectureVisualizer: React.FC = () => {
  const [activeStageId, setActiveStageId] = useState<string>('first_flush');

  const stages: StageInfo[] = [
    {
      id: 'catchment',
      name: '1. Rooftop Catchment',
      subtitle: 'Terrace or Sheet Surface',
      desc: 'The collection footprint. Concrete RCC has a runoff coefficient of 0.80, while metal sheets yield 0.90.',
      bengaluruTip: 'In Bengaluru, high dust accumulation occurs during dry winter and construction activity. Sweep roof before April pre-monsoon showers.',
      failureRisk: 'Open roof drains allowing bird nests or dead leaves to enter downpipes directly.'
    },
    {
      id: 'gutters',
      name: '2. Gutters & Coarse Mesh',
      subtitle: 'Rainwater Downpipes (100mm)',
      desc: 'Conveys water smoothly from roof edges. Bengaluru standard recommends 1 downpipe of 100mm diameter per 50 m² of roof.',
      bengaluruTip: 'Use UV-stabilised PVC downpipes with leaf strainers at roof outlets to stop debris early.',
      failureRisk: 'Inadequate gutter slope causing water stagnation and mosquito breeding.'
    },
    {
      id: 'first_flush',
      name: '3. First-Flush Diverter',
      subtitle: 'Rejects First 1-2 mm of Dirty Rain',
      desc: 'A vertical standpipe with a floating ball valve that captures the initial 15 minutes of dirty runoff carrying soot, bird droppings, and vehicle exhaust.',
      bengaluruTip: 'This is the most critical device! Without a first flush diverter, your storage tank water develops foul odours and black sediment.',
      failureRisk: 'Owners forget to open the bottom cap to drain out the dirty trapped water between rains.'
    },
    {
      id: 'filtration',
      name: '4. Filtration Chamber',
      subtitle: 'Dual-Stage Mesh or Sand/Charcoal Filter',
      desc: 'Water flows through fine stainless steel mesh (100 micron) or sand-gravel-charcoal media to remove suspended silt and micro-debris.',
      bengaluruTip: 'Pop-up mechanical filters (like Rainy FL or Varun filter) are very popular in Bengaluru because they auto-flush silt with zero recurring media cost.',
      failureRisk: 'Choked mesh screens causing incoming clean rainwater to overflow and spill onto driveway.'
    },
    {
      id: 'storage',
      name: '5. Masonry / RCC Storage Tank',
      subtitle: 'Flushing & Secondary Utility Buffer',
      desc: 'Holds 15 days of domestic non-drinking water (3,000L to 10,000L). Saves expensive tanker purchases during dry spells.',
      bengaluruTip: 'Equip with a floating suction line so the pump draws water from 15cm below the surface where water is clearest, avoiding bottom silt.',
      failureRisk: 'Uncovered overflow pipe allowing mosquitoes or rodents to enter the clean reservoir.'
    },
    {
      id: 'recharge',
      name: '6. Artificial Recharge Well',
      subtitle: 'Borewell & Shallow Aquifer Injection',
      desc: 'When the storage tank is full, clean overflow water is channeled to an 8-15m deep recharge well or direct borewell casing filter.',
      bengaluruTip: 'In Whitefield and Bellandur where borewells are 1,000ft+ deep, a recharge well acts as a sponge, raising the water table by 15 to 40 ft across 3 seasons.',
      failureRisk: 'Directly pouring unfiltered muddy road runoff into borewells which permanently clogs the aquifer fissures.'
    }
  ];

  const currentStage = stages.find(s => s.id === activeStageId) || stages[0];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" /> Technical Blueprint & Best Practices
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Anatomy of an Optimal Bengaluru Rainwater Harvesting System
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Learn how each stage works to turn episodic thunderstorm deluges into crystal-clear domestic water and long-term borewell security. Click any stage below.
          </p>
        </div>
      </div>

      {/* Interactive Flow Sequence */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {stages.map((stg, idx) => {
          const isSelected = stg.id === activeStageId;
          return (
            <button
              key={stg.id}
              onClick={() => setActiveStageId(stg.id)}
              className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-600 text-white border-cyan-600 shadow-md ring-2 ring-cyan-400/30'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-cyan-300'
              }`}
            >
              <div>
                <span className={`text-[10px] font-bold block ${isSelected ? 'text-cyan-200' : 'text-slate-400'}`}>
                  STAGE 0{idx + 1}
                </span>
                <strong className="text-xs font-bold block mt-0.5 leading-tight">
                  {stg.name.split('. ')[1]}
                </strong>
              </div>
              <span className={`text-[10px] mt-2 block truncate ${isSelected ? 'text-cyan-100' : 'text-slate-400'}`}>
                {stg.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Deep-Dive Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Schematic Diagram (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Schematic Cross-Section (Bengaluru Urban Standard)
            </h3>
            <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
              Active: {currentStage.name}
            </span>
          </div>

          {/* SVG Cross-section of complete home */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <svg viewBox="0 0 700 420" className="w-full h-auto">
              {/* Sky and clouds */}
              <rect x="0" y="0" width="700" height="100" fill="none" />
              {/* Rain clouds */}
              <g className="text-slate-300 dark:text-slate-700">
                <ellipse cx="140" cy="40" rx="45" ry="18" fill="currentColor" opacity="0.3" />
                <ellipse cx="180" cy="35" rx="35" ry="16" fill="currentColor" opacity="0.4" />
                <ellipse cx="320" cy="35" rx="55" ry="20" fill="currentColor" opacity="0.3" />
              </g>

              {/* Rain streaks */}
              <g stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3,6" opacity="0.7">
                <line x1="120" y1="65" x2="110" y2="105" />
                <line x1="160" y1="65" x2="150" y2="105" />
                <line x1="200" y1="65" x2="190" y2="105" />
                <line x1="240" y1="65" x2="230" y2="105" />
                <line x1="280" y1="65" x2="270" y2="105" />
                <line x1="320" y1="65" x2="310" y2="105" />
              </g>

              {/* Roof Catchment */}
              <path
                d="M 60,110 L 360,110 L 350,125 L 50,125 Z"
                fill={activeStageId === 'catchment' ? '#06b6d4' : '#64748b'}
                className="cursor-pointer transition-all"
                onClick={() => setActiveStageId('catchment')}
              />
              <text x="200" y="100" fill="#0284c7" fontSize="11" fontWeight="bold" textAnchor="middle">
                RCC Catchment Terrace (0.80 Runoff)
              </text>

              {/* Building walls */}
              <rect x="70" y="125" width="270" height="170" fill="#94a3b8" opacity="0.25" stroke="#475569" strokeWidth="2" />
              {/* Windows */}
              <rect x="100" y="150" width="40" height="40" fill="#cbd5e1" stroke="#64748b" />
              <rect x="180" y="150" width="40" height="40" fill="#cbd5e1" stroke="#64748b" />
              <rect x="100" y="210" width="40" height="40" fill="#cbd5e1" stroke="#64748b" />
              <rect x="180" y="210" width="40" height="40" fill="#cbd5e1" stroke="#64748b" />

              {/* Ground level line */}
              <line x1="20" y1="295" x2="680" y2="295" stroke="#334155" strokeWidth="3" />
              <text x="50" y="315" fill="#64748b" fontSize="10" fontStyle="italic">Ground Level (GL)</text>

              {/* Downpipe & Gutter */}
              <path
                d="M 355,110 L 375,110 L 375,190"
                fill="none"
                stroke={activeStageId === 'gutters' ? '#06b6d4' : '#3b82f6'}
                strokeWidth="5"
                strokeLinecap="round"
                className="cursor-pointer"
                onClick={() => setActiveStageId('gutters')}
              />
              <circle cx="365" cy="110" r="6" fill="#0284c7" />

              {/* First-flush divert pipe (Tee-joint at 190) */}
              <g
                className="cursor-pointer"
                onClick={() => setActiveStageId('first_flush')}
              >
                {/* Horizontal branch */}
                <line x1="375" y1="190" x2="430" y2="190" stroke={activeStageId === 'first_flush' ? '#f59e0b' : '#64748b'} strokeWidth="4" />
                {/* Vertical First-flush trap downpipe */}
                <rect x="368" y="190" width="14" height="75" rx="3" fill={activeStageId === 'first_flush' ? '#f59e0b' : '#475569'} />
                {/* Drain plug */}
                <rect x="366" y="265" width="18" height="6" fill="#1e293b" />
                <text x="375" y="285" fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="middle">First-Flush</text>
              </g>

              {/* Filter unit */}
              <g
                className="cursor-pointer"
                onClick={() => setActiveStageId('filtration')}
              >
                <line x1="430" y1="190" x2="430" y2="215" stroke="#3b82f6" strokeWidth="4" />
                <rect x="415" y="215" width="30" height="40" rx="4" fill={activeStageId === 'filtration' ? '#06b6d4' : '#10b981'} stroke="#047857" strokeWidth="1.5" />
                <line x1="418" y1="235" x2="442" y2="235" stroke="#ffffff" strokeWidth="2" strokeDasharray="2,2" />
                <text x="430" y="270" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="middle">Pop-up Filter</text>
              </g>

              {/* Storage Tank (Underground / Semi-sump) */}
              <g
                className="cursor-pointer"
                onClick={() => setActiveStageId('storage')}
              >
                <line x1="445" y1="235" x2="490" y2="235" stroke="#0ea5e9" strokeWidth="4" />
                <line x1="490" y1="235" x2="490" y2="290" stroke="#0ea5e9" strokeWidth="4" />
                {/* The Tank */}
                <rect x="460" y="295" width="90" height="90" rx="6" fill="#e0f2fe" stroke={activeStageId === 'storage' ? '#0284c7' : '#0369a1'} strokeWidth={activeStageId === 'storage' ? '3' : '2'} />
                {/* Water level inside tank */}
                <rect x="462" y="325" width="86" height="58" rx="2" fill="#38bdf8" opacity="0.65" />
                {/* Floating suction line */}
                <line x1="480" y1="340" x2="520" y2="340" stroke="#0284c7" strokeWidth="2" />
                <circle cx="520" cy="340" r="4" fill="#f59e0b" />
                <text x="505" y="365" fill="#0369a1" fontSize="10" fontWeight="bold" textAnchor="middle">3,000L Tank</text>
              </g>

              {/* Overflow pipe from storage tank to Recharge Well */}
              <g
                className="cursor-pointer"
                onClick={() => setActiveStageId('recharge')}
              >
                <path
                  d="M 550,315 L 610,315 L 610,330"
                  fill="none"
                  stroke={activeStageId === 'recharge' ? '#10b981' : '#64748b'}
                  strokeWidth="3.5"
                  strokeDasharray="4,2"
                />
                {/* Recharge Well Rings */}
                <rect x="590" y="330" width="40" height="75" rx="3" fill="#f1f5f9" stroke={activeStageId === 'recharge' ? '#10b981' : '#475569'} strokeWidth={activeStageId === 'recharge' ? '2.5' : '1.5'} />
                {/* Perforated rings / gravel layer */}
                <line x1="590" y1="350" x2="630" y2="350" stroke="#94a3b8" />
                <line x1="590" y1="370" x2="630" y2="370" stroke="#94a3b8" />
                <line x1="590" y1="390" x2="630" y2="390" stroke="#94a3b8" />
                {/* Aquifer water percolation arrows */}
                <text x="610" y="415" fill="#10b981" fontSize="8" fontWeight="bold" textAnchor="middle">Aquifer Inflow</text>
                <text x="610" y="325" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="middle">Recharge Well</text>
              </g>
            </svg>
          </div>
          <div className="text-[11px] text-slate-400 text-center">
            Click on any diagram component (Terrace, First Flush, Filter, Tank, Recharge Well) to reveal specs.
          </div>
        </div>

        {/* Component Detailed Specs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
                Engineering Specification
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {currentStage.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{currentStage.subtitle}</p>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentStage.desc}
            </p>

            {/* Bengaluru specific practical tip */}
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-1.5 text-xs">
              <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Bengaluru Practical Experience
              </div>
              <p className="text-emerald-800 dark:text-emerald-300 text-[11px] leading-relaxed">
                {currentStage.bengaluruTip}
              </p>
            </div>

            {/* Failure Mode Alert */}
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-800 space-y-1.5 text-xs">
              <div className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Common Bangalore Failure Mode
              </div>
              <p className="text-rose-800 dark:text-rose-300 text-[11px] leading-relaxed">
                {currentStage.failureRisk}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
