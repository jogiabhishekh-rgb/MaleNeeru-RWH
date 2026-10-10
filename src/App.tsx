/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PlanInputs, RegisteredSystem, CitizenReport, ReportStatus, Department } from './types/rwh';
import { calculateRwhPlan } from './utils/calculator';
import { 
  BENGALURU_AREAS, 
  INITIAL_REGISTERED_SYSTEMS, 
  INITIAL_CITIZEN_REPORTS,
  OFFICIAL_CHANNELS 
} from './data/bengaluruData';

import { Header } from './components/Header';
import { PlanTab } from './components/PlanTab';
import { CostScenariosTab } from './components/CostScenariosTab';
import { StressMapTab } from './components/StressMapTab';
import { MonthlyHarvestTab } from './components/MonthlyHarvestTab';
import { CommunityImpactTab } from './components/CommunityImpactTab';
import { CitizenReportTab } from './components/CitizenReportTab';
import { ArchitectureVisualizer } from './components/ArchitectureVisualizer';
import { ExportSummaryModal } from './components/ExportSummaryModal';

// Initial sample row exactly as specified in the Male Neeru workbook (Page 9)
const SAMPLE_YELAHANKA_INPUTS: PlanInputs = {
  area: 'Yelahanka',
  propertyType: 'Independent house',
  yearBuilt: 2012,
  plotLength: 60,
  plotWidth: 40,
  roofAreaSqFt: 1800,
  roofSurface: 'Concrete terrace (RCC)',
  peopleCount: 4,
  openGroundSqFt: 300,
  soilType: 'Red soil or laterite',
  existingBorewell: true,
  mainWaterSource: 'Private tanker',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('plan');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [inputs, setInputs] = useState<PlanInputs>(() => {
    try {
      const saved = localStorage.getItem('male_neeru_inputs');
      return saved ? JSON.parse(saved) : SAMPLE_YELAHANKA_INPUTS;
    } catch {
      return SAMPLE_YELAHANKA_INPUTS;
    }
  });

  const [systems, setSystems] = useState<RegisteredSystem[]>(() => {
    try {
      const saved = localStorage.getItem('male_neeru_systems');
      return saved ? JSON.parse(saved) : INITIAL_REGISTERED_SYSTEMS;
    } catch {
      return INITIAL_REGISTERED_SYSTEMS;
    }
  });

  const [reports, setReports] = useState<CitizenReport[]>(() => {
    try {
      const saved = localStorage.getItem('male_neeru_reports');
      return saved ? JSON.parse(saved) : INITIAL_CITIZEN_REPORTS;
    } catch {
      return INITIAL_CITIZEN_REPORTS;
    }
  });

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAddInstallModalOpen, setIsAddInstallModalOpen] = useState(false);

  // Sync inputs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('male_neeru_inputs', JSON.stringify(inputs));
    } catch (e) {
      console.warn('Could not persist inputs', e);
    }
  }, [inputs]);

  // Sync systems to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('male_neeru_systems', JSON.stringify(systems));
    } catch (e) {
      console.warn('Could not persist systems', e);
    }
  }, [systems]);

  // Sync reports to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('male_neeru_reports', JSON.stringify(reports));
    } catch (e) {
      console.warn('Could not persist reports', e);
    }
  }, [reports]);

  // Dark mode handler
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const outputs = calculateRwhPlan(inputs);

  const handleResetExample = () => {
    setInputs(SAMPLE_YELAHANKA_INPUTS);
  };

  const handleSelectArea = (areaName: string) => {
    setInputs(prev => ({ ...prev, area: areaName }));
    setActiveTab('plan');
  };

  const handleAddSystem = (newSystemData: Omit<RegisteredSystem, 'id' | 'timestamp'>) => {
    const newSys: RegisteredSystem = {
      ...newSystemData,
      id: `sys-${Date.now()}`,
      timestamp: new Date().toISOString().split('T')[0]
    };
    setSystems(prev => [newSys, ...prev]);
  };

  const handleAddReport = (newReportData: Omit<CitizenReport, 'id' | 'receiptNumber' | 'timestamp' | 'status'>) => {
    const newRep: CitizenReport = {
      ...newReportData,
      id: `rep-${Date.now()}`,
      receiptNumber: `BLR-RWH-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Submitted'
    };
    setReports(prev => [newRep, ...prev]);
  };

  const handleUpdateReportStatus = (id: string, status: ReportStatus, dept?: Department, note?: string) => {
    setReports(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status,
          ...(dept ? { assignedDepartment: dept } : {}),
          ...(note ? { editorNote: note } : {})
        };
      }
      return r;
    }));
  };

  const openReportsCount = reports.filter(r => r.status === 'Submitted' || r.status === 'Acknowledged' || r.status === 'Assigned').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors flex flex-col">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onResetExample={handleResetExample}
        openReportsCount={openReportsCount}
        registeredCount={systems.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'plan' && (
          <PlanTab
            inputs={inputs}
            setInputs={setInputs}
            outputs={outputs}
            onOpenExport={() => setIsExportModalOpen(true)}
            onAddInstallation={() => {
              setActiveTab('impact');
              setIsAddInstallModalOpen(true);
            }}
          />
        )}

        {activeTab === 'scenarios' && (
          <CostScenariosTab
            inputs={inputs}
            setInputs={setInputs}
            outputs={outputs}
          />
        )}

        {activeTab === 'map' && (
          <StressMapTab
            currentArea={inputs.area}
            onSelectArea={handleSelectArea}
            openReportsCount={openReportsCount}
          />
        )}

        {activeTab === 'monthly' && (
          <MonthlyHarvestTab
            inputs={inputs}
            outputs={outputs}
          />
        )}

        {activeTab === 'impact' && (
          <CommunityImpactTab
            systems={systems}
            onAddSystem={handleAddSystem}
            isAddModalOpen={isAddInstallModalOpen}
            setIsAddModalOpen={setIsAddInstallModalOpen}
          />
        )}

        {activeTab === 'reports' && (
          <CitizenReportTab
            reports={reports}
            onAddReport={handleAddReport}
            onUpdateReportStatus={handleUpdateReportStatus}
          />
        )}

        {activeTab === 'anatomy' && (
          <ArchitectureVisualizer />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center sm:justify-start gap-1.5">
              <span>Male Neeru (ಮಳೆ ನೀರು) — Bengaluru Rainwater Harvesting Planning Workbook</span>
            </p>
            <p className="text-[11px] mt-0.5">
              Dedicated to solving Bengaluru's water crisis through decentralized rooftop capture and aquifer recharge.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-medium">
            <span>BWSSB Helpline: <strong>1916</strong></span>
            <span>BBMP Control Room: <strong>1533</strong></span>
            <span>Theme Park: <strong>Jayanagar 5th Block</strong></span>
          </div>
        </div>
      </footer>

      {/* Export / Print Plan Modal */}
      <ExportSummaryModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        inputs={inputs}
        outputs={outputs}
      />
    </div>
  );
}
