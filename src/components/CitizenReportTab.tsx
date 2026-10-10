import React, { useState } from 'react';
import { 
  CitizenReport, 
  ReportCategory, 
  ReportStatus, 
  Department 
} from '../types/rwh';
import { 
  BENGALURU_AREAS, 
  CATEGORY_DEPARTMENT_MAP, 
  OFFICIAL_CHANNELS 
} from '../data/bengaluruData';
import { 
  AlertTriangle, 
  Send, 
  CheckCircle, 
  Clock, 
  PhoneCall, 
  ShieldAlert, 
  Filter, 
  Lock, 
  Unlock, 
  FileText, 
  HelpCircle,
  Building,
  UserCheck
} from 'lucide-react';

interface CitizenReportTabProps {
  reports: CitizenReport[];
  onAddReport: (newReport: Omit<CitizenReport, 'id' | 'receiptNumber' | 'timestamp' | 'status'>) => void;
  onUpdateReportStatus: (id: string, status: ReportStatus, dept?: Department, note?: string) => void;
}

export const CitizenReportTab: React.FC<CitizenReportTabProps> = ({
  reports,
  onAddReport,
  onUpdateReportStatus
}) => {
  // Form state
  const [category, setCategory] = useState<ReportCategory>('Groundwater concern');
  const [area, setArea] = useState<string>(BENGALURU_AREAS[0].name);
  const [streetLandmark, setStreetLandmark] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [justSubmittedReceipt, setJustSubmittedReceipt] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Editor mode toggle (allows simulating the authority workflow from Page 23)
  const [isEditorMode, setIsEditorMode] = useState<boolean>(false);
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<ReportStatus>('Acknowledged');
  const [editDept, setEditDept] = useState<Department>('BWSSB');
  const [editNote, setEditNote] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streetLandmark.trim() || !description.trim()) return;

    onAddReport({
      category,
      area,
      streetLandmark: streetLandmark.trim().slice(0, 160),
      description: description.trim().slice(0, 1200),
      assignedDepartment: CATEGORY_DEPARTMENT_MAP[category]
    });

    const receipt = `BLR-RWH-${Math.floor(1000 + Math.random() * 9000)}`;
    setJustSubmittedReceipt(receipt);
    setStreetLandmark('');
    setDescription('');
  };

  const filteredReports = reports.filter(r => {
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchCategory = categoryFilter === 'All' || r.category === categoryFilter;
    return matchStatus && matchCategory;
  });

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'Submitted':
        return 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border-amber-300';
      case 'Acknowledged':
        return 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200 border-blue-300';
      case 'Assigned':
        return 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200 border-purple-300';
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border-emerald-300';
      case 'Closed':
        return 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Official Helplines Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <PhoneCall className="w-4 h-4" /> Official Emergency Channels
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Bengaluru Water Grievances & RWH Violation Reporting
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              This community registry tracks local waterlogging, dry borewells, tanker price gouging, and broken percolation pits. 
              For life-threatening floods or municipal emergency response, call <strong>BWSSB 1916</strong> or <strong>BBMP 1533</strong> directly.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditorMode(!isEditorMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isEditorMode
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              {isEditorMode ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{isEditorMode ? 'Editor Mode Active' : 'Enable Editor Access'}</span>
            </button>
          </div>
        </div>

        {/* Quick Contacts Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 text-[10px] block">BWSSB 24/7 Helpline</span>
            <strong className="text-cyan-300 font-mono text-sm">{OFFICIAL_CHANNELS.bwssbHelpline}</strong>
          </div>
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 text-[10px] block">BBMP Storm Drain Control</span>
            <strong className="text-amber-300 font-mono text-sm">{OFFICIAL_CHANNELS.bbmpHelpline}</strong>
          </div>
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 text-[10px] block">BWSSB WhatsApp Grievance</span>
            <strong className="text-emerald-300 font-mono text-sm">{OFFICIAL_CHANNELS.bwssbWhatsApp}</strong>
          </div>
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 text-[10px] block">BWSSB RWH Theme Park</span>
            <strong className="text-slate-200 text-[11px] truncate block" title={OFFICIAL_CHANNELS.bwssbRwhThemePark}>
              Jayanagar 5th Block
            </strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Log New Grievance Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                Log a Water Concern or RWH Issue
              </h3>
              <span className="text-[11px] text-slate-400">Citizen Reporting</span>
            </div>

            {justSubmittedReceipt && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-200">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Grievance Logged Successfully
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  Receipt Token: <strong className="font-mono">{justSubmittedReceipt}</strong>. 
                  Shown as <em>Submitted</em> until reviewed by ward editors.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Issue Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ReportCategory)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                >
                  <option value="Waterlogging">Waterlogging (Street / Underpass flooding)</option>
                  <option value="Overflowing storm drain">Overflowing storm drain (Rajakaluve)</option>
                  <option value="Broken RWH structure">Broken RWH structure (Choked filter / broken pit)</option>
                  <option value="Groundwater concern">Groundwater concern (Dry borewell / tanker surge)</option>
                  <option value="Other">Other water grievance</option>
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Auto-routed to: <strong>{CATEGORY_DEPARTMENT_MAP[category]}</strong>
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bengaluru Ward / Area
                </label>
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

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Street or Landmark
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">{streetLandmark.length}/160</span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={160}
                  placeholder="e.g. 5th Main Road, near Hope Farm junction"
                  value={streetLandmark}
                  onChange={(e) => setStreetLandmark(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Description & Observations
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">{description.length}/1200</span>
                </div>
                <textarea
                  rows={4}
                  required
                  minLength={10}
                  maxLength={1200}
                  placeholder="Detail the problem: how deep is waterlogging? Is borewell dry? How long has storm drain been blocked?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none resize-none"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-[11px] text-slate-500 space-y-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> Workflow Policy
                </span>
                <p>
                  This web app is not directly connected to BWSSB or the city corporation. A report is logged in the community queue and marked acknowledged once verified by page editors.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-md shadow-cyan-600/20 flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Submit Grievance</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Citizen Reports Queue (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-600" />
                  Community Report Queue ({filteredReports.length})
                </h3>
                <span className="text-[11px] text-slate-400">Live feed of reported water challenges</span>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Acknowledged">Acknowledged</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="Waterlogging">Waterlogging</option>
                  <option value="Overflowing storm drain">Overflowing drain</option>
                  <option value="Broken RWH structure">Broken RWH</option>
                  <option value="Groundwater concern">Groundwater</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Reports List */}
            <div className="space-y-3">
              {filteredReports.map((report) => {
                const isEditing = editingReportId === report.id;

                return (
                  <div
                    key={report.id}
                    className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 space-y-2.5 text-xs transition-all hover:border-slate-300 dark:hover:border-slate-700"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-xs">
                            {report.category}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">
                            #{report.receiptNumber}
                          </span>
                        </div>
                        <div className="text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold mt-0.5">
                          {report.area} • <span className="text-slate-600 dark:text-slate-400 font-normal">{report.streetLandmark}</span>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(report.status)}`}>
                          {report.status}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{report.timestamp}</div>
                      </div>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                      {report.description}
                    </p>

                    {/* Department Routing Info */}
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>Department: <strong className="text-slate-700 dark:text-slate-300">{report.assignedDepartment || 'Pending Assignment'}</strong></span>
                      </div>

                      {isEditorMode && !isEditing && (
                        <button
                          onClick={() => {
                            setEditingReportId(report.id);
                            setEditStatus(report.status);
                            setEditDept(report.assignedDepartment || 'BWSSB');
                            setEditNote(report.editorNote || '');
                          }}
                          className="text-[11px] font-bold text-amber-600 hover:underline flex items-center gap-1"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          Update Status / Route →
                        </button>
                      )}
                    </div>

                    {report.editorNote && (
                      <div className="p-2 bg-blue-50/60 dark:bg-blue-950/40 rounded-lg border border-blue-100 dark:border-blue-900 text-[11px] text-blue-900 dark:text-blue-300">
                        <strong>Editor Note:</strong> {report.editorNote}
                      </div>
                    )}

                    {/* Inline Editor Drawer */}
                    {isEditing && (
                      <div className="mt-3 p-3 bg-amber-50/60 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 space-y-3">
                        <span className="font-bold text-amber-900 dark:text-amber-200 block text-xs">
                          Authority Action (Editor Access)
                        </span>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Change Status</label>
                            <select
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value as ReportStatus)}
                              className="w-full p-1.5 rounded border border-slate-300 bg-white dark:bg-slate-900 text-xs"
                            >
                              <option value="Submitted">Submitted</option>
                              <option value="Acknowledged">Acknowledged</option>
                              <option value="Assigned">Assigned</option>
                              <option value="Resolved">Resolved</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Assign Department</label>
                            <select
                              value={editDept}
                              onChange={(e) => setEditDept(e.target.value as Department)}
                              className="w-full p-1.5 rounded border border-slate-300 bg-white dark:bg-slate-900 text-xs"
                            >
                              <option value="BWSSB">BWSSB</option>
                              <option value="City corporation, storm water drains">City corporation (SWD)</option>
                              <option value="City corporation, ward office">City corporation (Ward office)</option>
                              <option value="Lake authority">Lake authority</option>
                              <option value="Karnataka Ground Water Authority">Karnataka Ground Water Authority</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Action Note</label>
                          <input
                            type="text"
                            value={editNote}
                            onChange={(e) => setEditNote(e.target.value)}
                            placeholder="e.g. Field inspection logged with ward engineer."
                            className="w-full p-1.5 rounded border border-slate-300 bg-white dark:bg-slate-900 text-xs"
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingReportId(null)}
                            className="px-2.5 py-1 rounded bg-slate-200 text-slate-700 text-xs font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onUpdateReportStatus(report.id, editStatus, editDept, editNote);
                              setEditingReportId(null);
                            }}
                            className="px-3 py-1 rounded bg-amber-600 text-white text-xs font-bold"
                          >
                            Save Update
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
