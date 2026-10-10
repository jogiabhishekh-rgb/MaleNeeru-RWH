import React, { useState } from 'react';
import { RegisteredSystem, PropertyType } from '../types/rwh';
import { BENGALURU_AREAS } from '../data/bengaluruData';
import { 
  Users, 
  CheckCircle2, 
  PlusCircle, 
  Droplet, 
  Building, 
  Sparkles, 
  ShieldCheck, 
  Truck,
  Filter,
  X
} from 'lucide-react';

interface CommunityImpactTabProps {
  systems: RegisteredSystem[];
  onAddSystem: (newSystem: Omit<RegisteredSystem, 'id' | 'timestamp'>) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const CommunityImpactTab: React.FC<CommunityImpactTabProps> = ({
  systems,
  onAddSystem,
  isAddModalOpen,
  setIsAddModalOpen
}) => {
  const [filterArea, setFilterArea] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Form states
  const [area, setArea] = useState<string>(BENGALURU_AREAS[0].name);
  const [propertyType, setPropertyType] = useState<PropertyType>('Independent house');
  const [roofAreaSqFt, setRoofAreaSqFt] = useState<number>(1800);
  const [tankCapacityLitres, setTankCapacityLitres] = useState<number>(3000);
  const [rechargeStructure, setRechargeStructure] = useState<string>('Storage tank plus recharge well');
  const [installedBy, setInstalledBy] = useState<string>('');
  const [status, setStatus] = useState<'Installed' | 'Being built' | 'Planned'>('Installed');

  // Metrics computation
  const totalRegistered = systems.length;
  const installedCount = systems.filter(s => s.status === 'Installed').length;
  const beingBuiltCount = systems.filter(s => s.status === 'Being built').length;
  const plannedCount = systems.filter(s => s.status === 'Planned').length;

  // Approximate harvest from installed systems:
  // harvest (L) = roofArea * 0.092903 * 970 * 0.8 * 0.85
  const totalHarvestKL = Math.round(
    systems
      .filter(s => s.status === 'Installed')
      .reduce((sum, s) => sum + (s.roofAreaSqFt * 0.092903 * 970 * 0.8 * 0.85) / 1000, 0)
  );

  const potableWaterSavedKL = Math.round(totalHarvestKL * 0.65);
  const tankerTripsSaved = Math.round((potableWaterSavedKL * 1000) / 12000);

  const filteredSystems = systems.filter(s => {
    const matchArea = filterArea === 'All' || s.area === filterArea;
    const matchStatus = filterStatus === 'All' || s.status === filterStatus;
    return matchArea && matchStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSystem({
      area,
      propertyType,
      roofAreaSqFt: Number(roofAreaSqFt),
      tankCapacityLitres: Number(tankCapacityLitres),
      rechargeStructure,
      installedBy: installedBy.trim() || 'Anonymous Bengaluru Citizen',
      status
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Citywide Impact Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">Registered Properties</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {totalRegistered} <span className="text-xs font-normal text-slate-500">sites</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {installedCount} installed • {beingBuiltCount} active • {plannedCount} planned
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">Annual City Harvest</div>
          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-1">
            {totalHarvestKL.toLocaleString()} <span className="text-xs font-bold text-slate-500">kL/yr</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {(totalHarvestKL / 1000).toFixed(2)} MegaLitres rainwater
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">Potable Water Saved</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {potableWaterSavedKL.toLocaleString()} <span className="text-xs font-bold text-slate-500">kL</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Replaced tankers & piped water</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">Tanker Trips Averted</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {tankerTripsSaved.toLocaleString()} <span className="text-xs font-bold text-slate-500">trips</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Reduced heavy diesel tanker traffic</div>
        </div>
      </div>

      {/* Action Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-cyan-900 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div>
          <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-300" />
            Join the Bengaluru Citizen Water Resilience Movement
          </h3>
          <p className="text-xs text-teal-100 mt-1 max-w-2xl">
            Whether you have an independent house in Yelahanka or manage an apartment STP/RWH system in Bellandur, 
            register your installation to inspire your neighborhood and track cumulative groundwater recharge.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex-shrink-0 px-4 py-2.5 rounded-xl bg-white text-teal-950 text-xs font-bold shadow-lg hover:bg-teal-50 transition-all flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4 text-teal-700" />
          <span>Register My RWH System</span>
        </button>
      </div>

      {/* Filter and Registry List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Verified Bengaluru Community Installations ({filteredSystems.length})
            </h3>
            <span className="text-[11px] text-slate-400">Citizen & RWA reported installations across wards</span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            >
              <option value="All">All Wards</option>
              {BENGALURU_AREAS.map(a => (
                <option key={a.id} value={a.name}>{a.name}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Installed">Installed</option>
              <option value="Being built">Being built</option>
              <option value="Planned">Planned</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredSystems.map((sys) => {
            const isInstalled = sys.status === 'Installed';
            const estHarvest = Math.round((sys.roofAreaSqFt * 0.092903 * 970 * 0.8 * 0.85) / 1000);

            return (
              <div
                key={sys.id}
                className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 hover:border-cyan-500/50 transition-all text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
                      {sys.area.split(',')[0]}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs mt-0.5">
                      {sys.installedBy || 'Bengaluru Resident'}
                    </h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isInstalled
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : sys.status === 'Being built'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  }`}>
                    {sys.status}
                  </span>
                </div>

                <div className="text-slate-600 dark:text-slate-300 text-[11px] space-y-1 pt-1">
                  <div className="flex justify-between">
                    <span>Type & Roof:</span>
                    <strong className="text-slate-900 dark:text-white">{sys.propertyType} • {sys.roofAreaSqFt.toLocaleString()} sq ft</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Tank Capacity:</span>
                    <strong className="text-blue-600 dark:text-blue-400 font-mono">{sys.tankCapacityLitres.toLocaleString()} Litres</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Annual Harvest:</span>
                    <strong className="text-cyan-600 dark:text-cyan-400 font-mono">{estHarvest} kL/year</strong>
                  </div>
                  <div className="pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-slate-500">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Structure: </span>
                    {sys.rechargeStructure}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Register System */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative space-y-4">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Register Rainwater Harvesting System
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Help Bengaluru quantify total decentralised rainwater capture and borewell recharge.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Ward / Locality</label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                >
                  {BENGALURU_AREAS.map(a => (
                    <option key={a.id} value={a.name}>{a.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="Independent house">Independent house</option>
                    <option value="Apartment complex">Apartment complex</option>
                    <option value="Commercial or institution">Commercial or institution</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="Installed">Installed & Operating</option>
                    <option value="Being built">Under Construction</option>
                    <option value="Planned">Planned</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Roof Area (sq ft)</label>
                  <input
                    type="number"
                    required
                    value={roofAreaSqFt}
                    onChange={(e) => setRoofAreaSqFt(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Storage Tank (Litres)</label>
                  <input
                    type="number"
                    required
                    value={tankCapacityLitres}
                    onChange={(e) => setTankCapacityLitres(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Recharge Structure</label>
                <input
                  type="text"
                  value={rechargeStructure}
                  onChange={(e) => setRechargeStructure(e.target.value)}
                  placeholder="e.g. Storage tank + 12m Recharge well connected to borewell"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Owner / Resident Name (or Apartment RWA)</label>
                <input
                  type="text"
                  value={installedBy}
                  onChange={(e) => setInstalledBy(e.target.value)}
                  placeholder="e.g. Ramesh Hegde / Greenwood Residents Association"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-md shadow-cyan-600/20"
                >
                  Save Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
