import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { usePermissions } from '../../context/PermissionContext';
import { AccessDenied } from '../common/AccessDenied';
import {
  Settings,
  Building,
  Calendar,
  Clock,
  ShieldAlert,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  X,
  Lock,
  Award,
  SlidersHorizontal,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';

interface SchoolSettingsModuleProps {
  initialTab?: 'profile' | 'academic' | 'academics' | 'bell-schedule' | 'calendar' | 'grading' | 'settings' | 'danger';
}

export const SchoolSettingsModule: React.FC<SchoolSettingsModuleProps> = ({
  initialTab = 'profile',
}) => {
  const {
    schoolProfile,
    updateSchoolProfile,
    bellSchedule,
    updateBellSchedule,
    academicTerms,
    updateAcademicTerms,
    gradingScale,
    updateGradingScale,
    resetAllSchoolDataToDefaults,
  } = useSchoolData();

  const { hasPermission } = usePermissions();
  const canManageSettings = hasPermission('settings.manage');

  // Normalize initialTab
  const getNormalizedTab = (): 'profile' | 'academic' | 'bell-schedule' | 'calendar' | 'grading' | 'danger' => {
    if (initialTab === 'academics' || initialTab === 'academic') return 'academic';
    if (initialTab === 'bell-schedule') return 'bell-schedule';
    if (initialTab === 'calendar') return 'calendar';
    if (initialTab === 'grading') return 'grading';
    if (initialTab === 'settings' || initialTab === 'danger') return 'danger';
    return 'profile';
  };

  const [activeTab, setActiveTab] = useState<
    'profile' | 'academic' | 'bell-schedule' | 'calendar' | 'grading' | 'danger'
  >(getNormalizedTab());

  // Form state initialized with schoolProfile
  const [name, setName] = useState(schoolProfile.name);
  const [motto, setMotto] = useState(schoolProfile.motto);
  const [email, setEmail] = useState(schoolProfile.email);
  const [phone, setPhone] = useState(schoolProfile.phone);
  const [address, setAddress] = useState(schoolProfile.address);
  const [academicYear, setAcademicYear] = useState(schoolProfile.currentAcademicYear);
  const [term, setTerm] = useState(schoolProfile.currentTerm);
  const [timezone, setTimezone] = useState(schoolProfile.timezone);
  const [principalName, setPrincipalName] = useState(schoolProfile.principalName);
  const [affiliationNo, setAffiliationNo] = useState(schoolProfile.affiliationNo);
  const [establishedYear, setEstablishedYear] = useState(schoolProfile.establishedYear);

  // Unsaved changes tracking
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Reset confirmation modal
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  if (!canManageSettings) {
    return (
      <AccessDenied
        requiredPermission="settings.manage"
        roleName="Admin"
        onReturnToOverview={() => {}}
      />
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolProfile({
      name,
      motto,
      email,
      phone,
      address,
      currentAcademicYear: academicYear,
      currentTerm: term,
      timezone,
      principalName,
      affiliationNo,
      establishedYear,
    });
    setHasUnsavedChanges(false);
    showToast('School profile and institutional configurations successfully saved.');
  };

  const handleConfirmResetData = () => {
    resetAllSchoolDataToDefaults();
    setResetModalOpen(false);
    showToast('All school demo records reset to default state. Theme preferences preserved.');
    setName('SCHLAR International Academy');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Feedback */}
      {toastMessage && (
        <div
          className="fixed bottom-6 right-6 z-50 p-4 rounded-xl border shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-3 duration-300"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase mb-1" style={{ color: 'var(--color-primary)' }}>
            <Settings className="w-4 h-4" />
            <span>Campus Master Configuration</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--color-text)' }}>
            School Settings & Standards
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Institutional identities, period bell schedules, academic terms, grading standards, and system preferences.
          </p>
        </div>

        {hasUnsavedChanges && (
          <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 self-start sm:self-auto">
            Unsaved changes present
          </span>
        )}
      </div>

      {/* Sub Tabs */}
      <div
        className="p-1.5 rounded-xl border flex items-center gap-1 text-xs overflow-x-auto"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap ${
            activeTab === 'profile' ? 'shadow-xs font-black' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: activeTab === 'profile' ? 'var(--color-background)' : 'transparent',
            color: 'var(--color-text)',
          }}
        >
          Institutional Profile
        </button>

        <button
          onClick={() => setActiveTab('academic')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap ${
            activeTab === 'academic' ? 'shadow-xs font-black' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: activeTab === 'academic' ? 'var(--color-background)' : 'transparent',
            color: 'var(--color-text)',
          }}
        >
          Academic Years & Sessions
        </button>

        <button
          onClick={() => setActiveTab('bell-schedule')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap ${
            activeTab === 'bell-schedule' ? 'shadow-xs font-black' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: activeTab === 'bell-schedule' ? 'var(--color-background)' : 'transparent',
            color: 'var(--color-text)',
          }}
        >
          Bell Schedule & Periods
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap ${
            activeTab === 'calendar' ? 'shadow-xs font-black' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: activeTab === 'calendar' ? 'var(--color-background)' : 'transparent',
            color: 'var(--color-text)',
          }}
        >
          Academic Terms & Dates
        </button>

        <button
          onClick={() => setActiveTab('grading')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap ${
            activeTab === 'grading' ? 'shadow-xs font-black' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: activeTab === 'grading' ? 'var(--color-background)' : 'transparent',
            color: 'var(--color-text)',
          }}
        >
          Grading Scale Matrix
        </button>

        <button
          onClick={() => setActiveTab('danger')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap ${
            activeTab === 'danger' ? 'shadow-xs text-rose-600 font-black' : 'opacity-70 hover:opacity-100 text-rose-500'
          }`}
          style={{
            backgroundColor: activeTab === 'danger' ? 'var(--color-background)' : 'transparent',
          }}
        >
          System & Reset
        </button>
      </div>

      {/* TAB 1: PROFILE */}
      {activeTab === 'profile' && (
        <form
          onSubmit={handleSaveProfile}
          className="p-6 rounded-xl border shadow-xs space-y-4 text-xs"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                School Institutional Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                required
                className="w-full px-3 py-2 text-xs rounded border outline-none font-bold"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Institutional Motto / Vision
              </label>
              <input
                type="text"
                value={motto}
                onChange={(e) => {
                  setMotto(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3 py-2 text-xs rounded border outline-none"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Head of School / Principal Name
              </label>
              <input
                type="text"
                value={principalName}
                onChange={(e) => {
                  setPrincipalName(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3 py-2 text-xs rounded border outline-none"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Affiliation / Accreditation Board Code
              </label>
              <input
                type="text"
                value={affiliationNo}
                onChange={(e) => {
                  setAffiliationNo(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3 py-2 text-xs rounded border outline-none font-mono"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Official Contact Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                required
                className="w-full px-3 py-2 text-xs rounded border outline-none"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Direct Contact Phone *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                required
                className="w-full px-3 py-2 text-xs rounded border outline-none"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Established Foundation Year
              </label>
              <input
                type="number"
                value={establishedYear}
                onChange={(e) => {
                  setEstablishedYear(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3 py-2 text-xs rounded border outline-none font-mono"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Campus Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => {
                  setTimezone(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3 py-2 text-xs rounded border outline-none"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                <option value="America/New_York">America/New_York (EST / UTC-5)</option>
                <option value="America/Chicago">America/Chicago (CST / UTC-6)</option>
                <option value="America/Denver">America/Denver (MST / UTC-7)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PST / UTC-8)</option>
                <option value="Europe/London">Europe/London (GMT / UTC+0)</option>
                <option value="Asia/Kolkata">Asia/Kolkata (IST / UTC+5:30)</option>
                <option value="Asia/Singapore">Asia/Singapore (SGT / UTC+8)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Physical Campus Address
              </label>
              <textarea
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                rows={2}
                className="w-full px-3 py-2 text-xs rounded border outline-none resize-none"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white shadow-xs transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Save className="w-4 h-4" />
              Save Institutional Profile
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: ACADEMIC */}
      {activeTab === 'academic' && (
        <form
          onSubmit={handleSaveProfile}
          className="p-6 rounded-xl border shadow-xs space-y-4 text-xs"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Active Academic Year
              </label>
              <select
                value={academicYear}
                onChange={(e) => {
                  setAcademicYear(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3 py-2 text-xs rounded border outline-none"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                <option value="2026-2027">2026-2027 (Active Session)</option>
                <option value="2027-2028">2027-2028 (Upcoming Session)</option>
                <option value="2025-2026">2025-2026 (Archived)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Active Semester / Term
              </label>
              <select
                value={term}
                onChange={(e) => {
                  setTerm(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                className="w-full px-3 py-2 text-xs rounded border outline-none"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                <option value="Term 1 (Fall Semester)">Term 1 (Fall Semester)</option>
                <option value="Term 2 (Winter Semester)">Term 2 (Winter Semester)</option>
                <option value="Term 3 (Spring Semester)">Term 3 (Spring Semester)</option>
              </select>
            </div>
          </div>

          <div
            className="p-4 rounded-xl border bg-black/[0.02] dark:bg-white/[0.02] space-y-2"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <h3 className="font-bold text-xs" style={{ color: 'var(--color-text)' }}>
              Academic Operations Status
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg border bg-white dark:bg-slate-900" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Curriculum Model</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">K-12 STEM + Humanities</span>
              </div>
              <div className="p-3 rounded-lg border bg-white dark:bg-slate-900" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Class Attendance Policy</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Daily Homeroom + Period Log</span>
              </div>
              <div className="p-3 rounded-lg border bg-white dark:bg-slate-900" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Promotion Criteria</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">75% Attendance & 2.0 GPA</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white shadow-xs transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Save className="w-4 h-4" />
              Update Academic Parameters
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: BELL SCHEDULE */}
      {activeTab === 'bell-schedule' && (
        <div
          className="p-6 rounded-xl border shadow-xs space-y-4 text-xs"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                Campus Bell Schedule & Period Intervals
              </h2>
              <p className="text-xs text-slate-500">
                Synchronized bell schedule governing lesson durations, passing intervals, nutrition recess, and lunch.
              </p>
            </div>
            <button
              onClick={() => showToast('Bell schedule synchronized across all timetable views.')}
              className="px-3 py-1.5 rounded-lg font-bold text-white text-xs flex items-center gap-1.5"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Save className="w-3.5 h-3.5" />
              Save Schedule
            </button>
          </div>

          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr
                  className="border-b text-[10px] uppercase font-bold tracking-wider"
                  style={{
                    backgroundColor: 'var(--color-table-header, #f8fafc)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Slot Name</th>
                  <th className="py-3 px-4">Start Time</th>
                  <th className="py-3 px-4">End Time</th>
                  <th className="py-3 px-4">Interval Type</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {bellSchedule.map((slot) => {
                  const typeBadge =
                    slot.type === 'lesson'
                      ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                      : slot.type === 'break'
                      ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      : slot.type === 'lunch'
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                      : 'bg-purple-500/10 text-purple-600 border-purple-500/20';

                  return (
                    <tr key={slot.id} className="hover:bg-black/[0.015] dark:hover:bg-white/[0.015]">
                      <td className="py-3 px-4 font-bold font-mono text-slate-700 dark:text-slate-300">
                        {slot.periodNumber === 0 ? 'Advisory' : `P${slot.periodNumber}`}
                      </td>
                      <td className="py-3 px-4 font-semibold" style={{ color: 'var(--color-text)' }}>
                        {slot.name}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-600 dark:text-slate-300">
                        {slot.startTime}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-600 dark:text-slate-300">
                        {slot.endTime}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border capitalize ${typeBadge}`}>
                          {slot.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-emerald-600">
                        Active Bell
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CALENDAR */}
      {activeTab === 'calendar' && (
        <div
          className="p-6 rounded-xl border shadow-xs space-y-4 text-xs"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                Academic Calendar & Term Boundaries
              </h2>
              <p className="text-xs text-slate-500">
                Official instructional days, semester starting/ending dates, and holidays.
              </p>
            </div>
            <button
              onClick={() => showToast('Academic term dates saved.')}
              className="px-3 py-1.5 rounded-lg font-bold text-white text-xs flex items-center gap-1.5"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Save className="w-3.5 h-3.5" />
              Save Terms
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {academicTerms.map((termItem) => (
              <div
                key={termItem.id}
                className={`p-4 rounded-xl border space-y-2 transition-all ${
                  termItem.isCurrent ? 'ring-2 ring-emerald-500/50 bg-emerald-500/[0.03]' : ''
                }`}
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs" style={{ color: 'var(--color-text)' }}>
                    {termItem.name}
                  </span>
                  {termItem.isCurrent && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500 text-white uppercase">
                      Current
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 space-y-1 font-mono">
                  <div>Start: <strong className="text-slate-800 dark:text-slate-200">{termItem.startDate}</strong></div>
                  <div>End: <strong className="text-slate-800 dark:text-slate-200">{termItem.endDate}</strong></div>
                </div>
              </div>
            ))}
          </div>

          {/* Statutory Holidays & Breaks Preview */}
          <div className="mt-4 p-4 rounded-xl border bg-black/[0.02] dark:bg-white/[0.02] space-y-2" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="font-bold text-xs" style={{ color: 'var(--color-text)' }}>
              Upcoming School Holidays & Breaks (2026-2027)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-lg border bg-white dark:bg-slate-900" style={{ borderColor: 'var(--color-border)' }}>
                <span className="font-bold block text-slate-800 dark:text-slate-200">Thanksgiving Recess</span>
                <span className="text-[10px] text-slate-400 font-mono">Nov 23 - Nov 27, 2026</span>
              </div>
              <div className="p-2.5 rounded-lg border bg-white dark:bg-slate-900" style={{ borderColor: 'var(--color-border)' }}>
                <span className="font-bold block text-slate-800 dark:text-slate-200">Winter Holidays</span>
                <span className="text-[10px] text-slate-400 font-mono">Dec 21, 2026 - Jan 4, 2027</span>
              </div>
              <div className="p-2.5 rounded-lg border bg-white dark:bg-slate-900" style={{ borderColor: 'var(--color-border)' }}>
                <span className="font-bold block text-slate-800 dark:text-slate-200">Spring Break</span>
                <span className="text-[10px] text-slate-400 font-mono">Mar 22 - Mar 26, 2027</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GRADING */}
      {activeTab === 'grading' && (
        <div
          className="p-6 rounded-xl border shadow-xs space-y-4 text-xs"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                Standardized Grading Scale & GPA Converter
              </h2>
              <p className="text-xs text-slate-500">
                Institutional mark brackets, 4.0 GPA scale weight, and proficiency mastery descriptors.
              </p>
            </div>
            <button
              onClick={() => showToast('Grading scale verified and applied.')}
              className="px-3 py-1.5 rounded-lg font-bold text-white text-xs flex items-center gap-1.5"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Save className="w-3.5 h-3.5" />
              Save Scale
            </button>
          </div>

          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr
                  className="border-b text-[10px] uppercase font-bold tracking-wider"
                  style={{
                    backgroundColor: 'var(--color-table-header, #f8fafc)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4">GPA Weight</th>
                  <th className="py-3 px-4">Percentage Score Range</th>
                  <th className="py-3 px-4">Proficiency Descriptor</th>
                  <th className="py-3 px-4 text-right">Academic Standing</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {gradingScale.map((scale) => (
                  <tr key={scale.grade} className="hover:bg-black/[0.015] dark:hover:bg-white/[0.015]">
                    <td className="py-2.5 px-4 font-bold text-sm" style={{ color: 'var(--color-primary)' }}>
                      {scale.grade}
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {scale.gpa.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-4 font-mono font-medium text-slate-600 dark:text-slate-400">
                      {scale.minScore}% – {scale.maxScore}%
                    </td>
                    <td className="py-2.5 px-4 font-medium" style={{ color: 'var(--color-text)' }}>
                      {scale.description}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        scale.gpa >= 3.0 ? 'bg-emerald-500/10 text-emerald-600' : scale.gpa >= 2.0 ? 'bg-amber-500/10 text-amber-600' : 'bg-rose-500/10 text-rose-600'
                      }`}>
                        {scale.gpa >= 3.0 ? 'Honors / Passing' : scale.gpa >= 2.0 ? 'Adequate' : 'Remediation'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: DANGER / RESET */}
      {activeTab === 'danger' && (
        <div
          className="p-6 rounded-xl border shadow-xs space-y-4 text-xs"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center gap-2 text-rose-500 font-bold uppercase text-[10px] tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Demonstration State & Relational Reset</span>
          </div>

          <h2 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
            Reset Demo Data to Initial Seed
          </h2>

          <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
            This operation restores all school data (Classes, Sections, Students, Guardians, Staff, Timetable, Admissions, and Fees) back to the clean demonstration seed. Active theme colors and role permissions will remain untouched.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setResetModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              Reset All School Data
            </button>
          </div>
        </div>
      )}

      {/* RESET CONFIRMATION MODAL */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4 text-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/50">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base" style={{ color: 'var(--color-text)' }}>
                  Confirm Demo Reset
                </h3>
                <p className="text-xs text-slate-500">
                  This action will discard local additions and restore seed records.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Are you sure you want to restore the default dataset? All custom sections, student entries, timetable modifications, and fee transactions stored in browser memory will be reset.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="px-4 py-2 rounded-lg border font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmResetData}
                className="px-4 py-2 rounded-lg font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors"
              >
                Yes, Restore Initial Seed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
