import React, { useState } from 'react';
import { AreaData } from '../types/rwh';
import { calculateAreaMetrics } from '../utils/calculator';
import { BENGALURU_AREAS } from '../data/bengaluruData';
import { 
  MapPin, 
  Layers, 
  Droplet, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Search, 
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface StressMapTabProps {
  currentArea: string;
  onSelectArea: (areaName: string) => void;
  openReportsCount: number;
}

export const StressMapTab: React.FC<StressMapTabProps> = ({
  currentArea,
  onSelectArea,
}) => {
  const [selectedAreaId, setSelectedAreaId] = useState<string>('whitefield');
  const [colorMode, setColorMode] = useState<'stress' | 'systems' | 'reports' | 'priority'>('stress');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('All');

  const areasWithMetrics = calculateAreaMetrics(BENGALURU_AREAS);

  const totalEligible = areasWithMetrics.reduce((sum, a) => sum + a.eligibleProperties, 0);
  const totalPotentialML = areasWithMetrics.reduce((sum, a) => sum + a.potentialHarvestML, 0);
  const totalRegistered = areasWithMetrics.reduce((sum, a) => sum + a.registeredSystems, 0);
  const totalOpenReports = areasWithMetrics.reduce((sum, a) => sum + a.openReports, 0);

  const filteredAreas = areasWithMetrics.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.kannadaName.includes(searchTerm) ||
                          a.zone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZone = selectedZone === 'All' || a.zone.includes(selectedZone);
    return matchesSearch && matchesZone;
  });

  const activeArea = areasWithMetrics.find(a => a.id === selectedAreaId) || areasWithMetrics[0];

  const getBadgeColor = (stress: number) => {
    if (stress >= 80) return 'bg-rose-500 text-white';
    if (stress >= 65) return 'bg-orange-500 text-white';
    if (stress >= 50) return 'bg-amber-500 text-white';
    if (stress >= 35) return 'bg-sky-500 text-white';
    return 'bg-emerald-500 text-white';
  };

  const getMetricColor = (area: typeof areasWithMetrics[0]) => {
    if (colorMode === 'stress') {
      return getBadgeColor(area.stressIndex);
    } else if (colorMode === 'systems') {
      if (area.registeredSystems >= 4) return 'bg-emerald-600 text-white';
      if (area.registeredSystems >= 2) return 'bg-blue-600 text-white';
      if (area.registeredSystems >= 1) return 'bg-cyan-600 text-white';
      return 'bg-slate-400 text-white';
    } else if (colorMode === 'reports') {
      if (area.openReports >= 1) return 'bg-rose-600 text-white animate-pulse';
      return 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    } else {
      // Priority score
      if (area.priorityScore >= 55) return 'bg-purple-600 text-white';
      if (area.priorityScore >= 40) return 'bg-indigo-600 text-white';
      return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bengaluru Macro Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">Monitored Bengaluru Wards</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">17 Areas</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Core, Peripheral & IT corridors</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">Eligible Properties</div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {totalEligible.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Roofs suitable for RWH</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">Potential City Harvest</div>
          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-1">
            {totalPotentialML.toLocaleString()} <span className="text-xs font-bold text-slate-500">ML/yr</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">39,998 MegaLitres Rainwater</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">Citizen Water Grievances</div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {totalOpenReports} Open
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{totalRegistered} community systems active</div>
        </div>
      </div>

      {/* Filter and Mode Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Color Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full md:w-auto overflow-x-auto text-xs">
          <span className="text-slate-400 text-[10px] font-bold px-2 uppercase">Color by:</span>
          {[
            { id: 'stress', label: 'Groundwater Stress' },
            { id: 'systems', label: 'Installed Systems' },
            { id: 'reports', label: 'Open Grievances' },
            { id: 'priority', label: 'Action Priority' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setColorMode(mode.id as any)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex-shrink-0 ${
                colorMode === mode.id
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Search & Zone Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search area (e.g. Whitefield)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>

          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
          >
            <option value="All">All Bengaluru Zones</option>
            <option value="East">East (Whitefield, KR Puram)</option>
            <option value="North">North (Yelahanka, Hebbal)</option>
            <option value="South">South (ECity, HSR, Jayanagar)</option>
            <option value="Central">Central (Shivajinagar, Shantinagar)</option>
            <option value="West">West (Rajajinagar, Banashankari)</option>
          </select>
        </div>
      </div>

      {/* Map & Detail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Geographic Ward Interactive Map Visualizer (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-600" />
              Bengaluru Spatial Stress Distribution
            </h3>
            <span className="text-[11px] text-slate-400">Click any marker to inspect ward</span>
          </div>

          {/* Interactive Scaled Diagram of Bengaluru */}
          <div className="relative w-full aspect-4/3 sm:aspect-16/10 bg-radial from-slate-100 to-slate-200/90 dark:from-slate-900 dark:to-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 overflow-hidden shadow-inner">
            {/* Outline contours representing BBMP zones */}
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <svg viewBox="0 0 100 100" className="w-full h-full stroke-cyan-500 fill-none stroke-[0.4]">
                <circle cx="50" cy="50" r="45" strokeDasharray="1,1" />
                <circle cx="50" cy="50" r="30" strokeDasharray="1,2" />
                <circle cx="50" cy="50" r="15" strokeDasharray="2,2" />
                {/* Major ring road indicative lines */}
                <path d="M 15,35 Q 50,20 85,35 Q 90,65 75,85 Q 40,90 20,75 Z" />
              </svg>
            </div>

            {/* Geographical Markers */}
            {filteredAreas.map((area) => {
              const isSelected = area.id === selectedAreaId;
              const isCurrentPlanning = area.name === currentArea;
              const markerBg = getMetricColor(area);

              return (
                <button
                  key={area.id}
                  onClick={() => setSelectedAreaId(area.id)}
                  style={{ left: `${area.coordinates.x}%`, top: `${area.coordinates.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all z-10 ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-115 hover:z-20'
                  }`}
                  title={`${area.name} (Stress: ${area.stressIndex}, Open reports: ${area.openReports})`}
                >
                  <div className={`relative px-2 py-1 rounded-full text-[10px] font-bold shadow-md flex items-center gap-1 border border-white/60 dark:border-black/60 transition-transform ${markerBg}`}>
                    {area.openReports > 0 && colorMode !== 'reports' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    )}
                    <span className="whitespace-nowrap font-mono">{area.name.split(',')[0]}</span>
                    {isCurrentPlanning && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-300" title="Active Plan" />
                    )}
                  </div>
                </button>
              );
            })}

            {/* Map Legend */}
            <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] space-y-1 shadow-sm">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">Legend ({colorMode}):</span>
              {colorMode === 'stress' ? (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> 80+ (Critical)</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> 65-79 (High)</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> 50-64 (Med)</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> &lt;35 (Low)</span>
                </div>
              ) : colorMode === 'reports' ? (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-600" /> Active Open Grievance</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400" /> 0 Open Grievances</span>
                </div>
              ) : colorMode === 'systems' ? (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-600" /> 4+ Systems</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600" /> 2-3 Systems</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400" /> 0 Systems</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-600" /> Priority 50+</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-500" /> Normal</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Area Deep-Dive Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  {activeArea.zone}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {activeArea.name}
                </h3>
                <span className="text-xs text-cyan-600 dark:text-cyan-400 font-['Noto_Sans_Kannada'] font-medium">
                  {activeArea.kannadaName}
                </span>
              </div>
              <span className={`px-2.5 py-1 rounded-xl text-xs font-black font-mono shadow-xs ${getBadgeColor(activeArea.stressIndex)}`}>
                Stress {activeArea.stressIndex}/100
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeArea.description}
            </p>

            {/* Ward Attributes Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60">
                <span className="text-[11px] text-slate-400 block">Cauvery Pipeline Status</span>
                <strong className={`text-xs ${
                  activeArea.cauveryCoverage === 'Full' ? 'text-emerald-600 dark:text-emerald-400' :
                  activeArea.cauveryCoverage === 'Partial' ? 'text-amber-600 dark:text-amber-400' :
                  'text-rose-600 dark:text-rose-400'
                }`}>
                  {activeArea.cauveryCoverage} Coverage
                </strong>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60">
                <span className="text-[11px] text-slate-400 block">Concern Flag</span>
                <strong className={activeArea.concernFlag === 'Groundwater dependent' ? 'text-rose-600 font-semibold' : 'text-slate-700 dark:text-slate-300'}>
                  {activeArea.concernFlag}
                </strong>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60">
                <span className="text-[11px] text-slate-400 block">Eligible Rooftops</span>
                <strong className="text-slate-900 dark:text-white font-mono text-sm">
                  {activeArea.eligibleProperties.toLocaleString()}
                </strong>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60">
                <span className="text-[11px] text-slate-400 block">Ward Potential Harvest</span>
                <strong className="text-cyan-600 dark:text-cyan-400 font-mono text-sm">
                  {activeArea.potentialHarvestML.toLocaleString()} ML/yr
                </strong>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60">
                <span className="text-[11px] text-slate-400 block">Action Priority Score</span>
                <strong className="text-purple-600 dark:text-purple-400 font-mono text-sm">
                  {activeArea.priorityScore} / 100
                </strong>
                <span className="text-[10px] text-slate-400 block mt-0.5">0.6×Stress + 8×Reports</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60">
                <span className="text-[11px] text-slate-400 block">Systems & Open Grievances</span>
                <strong className="text-slate-900 dark:text-white font-mono text-xs">
                  {activeArea.registeredSystems} RWH • {activeArea.openReports} Reports
                </strong>
              </div>
            </div>

            {/* Quick Action Button to load into Planner */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onSelectArea(activeArea.name)}
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/20 flex items-center justify-center gap-2 transition-all"
              >
                <span>Set {activeArea.name.split(',')[0]} as Active Planning Area</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Complete 17 Bengaluru Areas Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Full 17 Areas Planning & Priority Registry
          </h3>
          <span className="text-[11px] text-slate-400">Exact data from Male Neeru Workbook</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 font-semibold">Area</th>
                <th className="py-2.5 font-semibold">Cauvery</th>
                <th className="py-2.5 text-right font-semibold">Stress Index</th>
                <th className="py-2.5 text-right font-semibold">Priority</th>
                <th className="py-2.5 text-right font-semibold">Eligible Roofs</th>
                <th className="py-2.5 text-right font-semibold">Potential (ML/yr)</th>
                <th className="py-2.5 text-right font-semibold">Reg. Systems</th>
                <th className="py-2.5 text-right font-semibold">Open Reports</th>
                <th className="py-2.5 pl-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-slate-700 dark:text-slate-300">
              {filteredAreas.map((a) => {
                const isCurrent = a.name === currentArea;
                return (
                  <tr key={a.id} className={isCurrent ? 'bg-cyan-50/60 dark:bg-cyan-950/40' : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'}>
                    <td className="py-2.5 font-sans font-semibold text-slate-900 dark:text-white">
                      <div>{a.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{a.zone}</div>
                    </td>
                    <td className="py-2.5 font-sans">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        a.cauveryCoverage === 'Full' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        a.cauveryCoverage === 'Partial' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                        'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {a.cauveryCoverage}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-bold">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${getBadgeColor(a.stressIndex)}`}>
                        {a.stressIndex}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-bold text-purple-600 dark:text-purple-400">
                      {a.priorityScore}
                    </td>
                    <td className="py-2.5 text-right">{a.eligibleProperties.toLocaleString()}</td>
                    <td className="py-2.5 text-right text-cyan-600 dark:text-cyan-400 font-bold">{a.potentialHarvestML.toLocaleString()}</td>
                    <td className="py-2.5 text-right font-bold">{a.registeredSystems}</td>
                    <td className="py-2.5 text-right">
                      {a.openReports > 0 ? (
                        <span className="text-rose-600 font-bold bg-rose-50 dark:bg-rose-950 px-1.5 py-0.5 rounded">
                          {a.openReports}
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="py-2.5 pl-3 font-sans">
                      <button
                        onClick={() => onSelectArea(a.name)}
                        className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                          isCurrent
                            ? 'bg-cyan-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {isCurrent ? 'Active' : 'Select'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
