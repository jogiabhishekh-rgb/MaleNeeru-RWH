import React from 'react';
import { Droplets, CloudRain, AlertTriangle, ShieldCheck, MapPin, PhoneCall, RefreshCw, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onResetExample: () => void;
  openReportsCount: number;
  registeredCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  onResetExample,
  openReportsCount,
  registeredCount
}) => {
  const tabs = [
    { id: 'plan', label: 'RWH Planner', sub: 'Harvest & Sizing' },
    { id: 'scenarios', label: 'Cost & Payback', sub: '3 Scenarios & ROI' },
    { id: 'map', label: 'Water-Stress Map', sub: '17 Bengaluru Wards' },
    { id: 'monthly', label: 'Monthly Rain', sub: 'Monsoon Profile' },
    { id: 'impact', label: 'Community Tracker', sub: `${registeredCount} Systems` },
    { id: 'reports', label: 'Citizen Grievances', sub: `${openReportsCount} Issues` },
    { id: 'anatomy', label: 'System Anatomy', sub: 'Engineering Guide' },
  ];

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors sticky top-0 z-40 shadow-xs">
      {/* Bengaluru Alert Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700 text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <AlertTriangle className="w-3.5 h-3.5 animate-pulse text-amber-200" />
          <span>Bengaluru Water Scarcity Advisory: Peripheral wards (Whitefield, Bellandur, Yelahanka) face severe groundwater depletion. Harvesting 100 mm saves ~10,000L.</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-amber-100 font-mono">
          <span className="flex items-center gap-1">
            <PhoneCall className="w-3 h-3" /> BWSSB: <strong>1916</strong>
          </span>
          <span className="hidden sm:inline">BBMP: <strong>1533</strong></span>
          <span className="bg-amber-800/80 px-2 py-0.5 rounded text-[10px] text-white">BWSSB Mandatory Rules Active</span>
        </div>
      </div>

      {/* Main Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 ring-2 ring-cyan-400/20">
            <CloudRain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Male Neeru <span className="text-xs sm:text-sm font-semibold text-cyan-600 dark:text-cyan-400 font-['Noto_Sans_Kannada']">| ಮಳೆ ನೀರು</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                Bengaluru 2026 RWH Hub
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Rooftop Harvesting Calculator, Tank Sizing, Borewell Recharge & Stress Mitigation for Namma Bengaluru
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-end md:self-auto">
          <button
            onClick={onResetExample}
            title="Load standard 60x40 ft Yelahanka sample property"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Load Sample (Yelahanka)</span>
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Light / Dark mode"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors shadow-2xs"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 dark:border-slate-800">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-3.5 py-2 rounded-lg text-left transition-all ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-sm ring-1 ring-cyan-500'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900'
                }`}
              >
                <div className="text-xs sm:text-sm font-bold leading-tight">{tab.label}</div>
                <div className={`text-[10px] font-medium leading-none mt-0.5 ${isActive ? 'text-cyan-100' : 'text-slate-400 dark:text-slate-500'}`}>
                  {tab.sub}
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
