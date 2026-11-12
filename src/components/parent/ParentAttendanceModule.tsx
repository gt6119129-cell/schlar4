import React, { useState, useEffect } from 'react';
import { LinkedChild } from '../../data/mockData';
import {
  CheckSquare,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Plus,
  X,
  UserCheck,
  ShieldCheck,
  Info,
  Check,
} from 'lucide-react';

interface ParentAttendanceModuleProps {
  selectedChild: LinkedChild;
  onNavigateTab?: (tabId: string) => void;
}

interface SubmittedExcuse {
  id: string;
  childId: string;
  childName: string;
  startDate: string;
  endDate: string;
  reasonCategory: string;
  note: string;
  guardianName: string;
  submittedAt: string;
  status: 'Pending Review' | 'Approved & Excused' | 'Rejected';
}

const STORAGE_KEY_LEAVE_SLIPS = 'schlar_parent_leave_slips_v1';

export const ParentAttendanceModule: React.FC<ParentAttendanceModuleProps> = ({
  selectedChild,
}) => {
  const [filterRange, setFilterRange] = useState<'all' | 'october' | 'september'>('all');
  const [showExcuseModal, setShowExcuseModal] = useState(false);
  const [submittedSlips, setSubmittedSlips] = useState<SubmittedExcuse[]>([]);
  const [activeTab, setActiveTab] = useState<'history' | 'slips'>('history');

  // Form State
  const [excuseStartDate, setExcuseStartDate] = useState('2026-10-24');
  const [excuseEndDate, setExcuseEndDate] = useState('2026-10-24');
  const [excuseCategory, setExcuseCategory] = useState('Medical Appointment / Illness');
  const [excuseNote, setExcuseNote] = useState('');
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load persisted leave slips
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_LEAVE_SLIPS);
      if (stored) {
        setSubmittedSlips(JSON.parse(stored));
      } else {
        const initialSlips: SubmittedExcuse[] = [
          {
            id: 'slip-demo-1',
            childId: 'child-1-maya',
            childName: 'Maya Chen',
            startDate: '2026-10-12',
            endDate: '2026-10-12',
            reasonCategory: 'Medical Appointment / Illness',
            note: 'Routine dental orthodontics appointment and medical review.',
            guardianName: 'Mrs. Li Chen',
            submittedAt: 'Oct 11, 2026, 04:30 PM',
            status: 'Approved & Excused',
          },
        ];
        setSubmittedSlips(initialSlips);
        localStorage.setItem(STORAGE_KEY_LEAVE_SLIPS, JSON.stringify(initialSlips));
      }
    } catch (e) {
      console.warn('Failed to parse leave slips from localStorage', e);
    }
  }, []);

  const handleSaveSlip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!excuseStartDate) {
      setFormFeedback({ type: 'error', message: 'Please select an absence start date.' });
      return;
    }
    if (!excuseNote.trim()) {
      setFormFeedback({ type: 'error', message: 'Please provide a brief explanation for the absence.' });
      return;
    }

    const newSlip: SubmittedExcuse[] = [
      {
        id: `slip-${Date.now()}`,
        childId: selectedChild.id,
        childName: selectedChild.name,
        startDate: excuseStartDate,
        endDate: excuseEndDate || excuseStartDate,
        reasonCategory: excuseCategory,
        note: excuseNote.trim(),
        guardianName: 'Mrs. Li Chen',
        submittedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'Pending Review',
      },
      ...submittedSlips,
    ];

    setSubmittedSlips(newSlip);
    try {
      localStorage.setItem(STORAGE_KEY_LEAVE_SLIPS, JSON.stringify(newSlip));
    } catch (err) {
      console.warn('Failed to persist leave slip', err);
    }

    setFormFeedback({
      type: 'success',
      message: `Leave excuse submitted for ${selectedChild.name}! Homeroom advisor notified.`,
    });

    setTimeout(() => {
      setShowExcuseModal(false);
      setFormFeedback(null);
      setExcuseNote('');
      setActiveTab('slips');
    }, 1200);
  };

  const records = selectedChild.attendanceHistory || [];
  const presentCount = records.filter((r) => r.status === 'present').length;
  const absentCount = records.filter((r) => r.status === 'absent').length;
  const lateCount = records.filter((r) => r.status === 'late').length;
  const excusedCount = records.filter((r) => r.status === 'excused').length;

  const filteredRecords = records.filter((r) => {
    if (filterRange === 'october') return r.date.toLowerCase().includes('oct');
    if (filterRange === 'september') return r.date.toLowerCase().includes('sep');
    return true;
  });

  const childSlips = submittedSlips.filter((s) => s.childId === selectedChild.id || s.childName === selectedChild.name);

  return (
    <div className="space-y-3 animate-in fade-in duration-150">
      {/* Attendance Summary Card */}
      <div
        className="p-4 rounded-xl border shadow-xs"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Daily Attendance Pacing
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold font-mono" style={{ color: 'var(--color-primary)' }}>
                {selectedChild.attendancePercent}%
              </span>
              <span className="text-xs font-semibold text-emerald-600">
                {selectedChild.attendanceDays.present} of {selectedChild.attendanceDays.total} Days
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowExcuseModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white rounded-lg shadow-xs hover:opacity-95"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Leave Slip</span>
          </button>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t text-center text-xs" style={{ borderColor: 'var(--color-border)' }}>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Present</span>
            <span className="text-sm font-extrabold font-mono text-emerald-600">{presentCount}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Late</span>
            <span className="text-sm font-extrabold font-mono text-amber-600">{lateCount}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Excused</span>
            <span className="text-sm font-extrabold font-mono text-blue-600">{excusedCount + absentCount}</span>
          </div>
        </div>
      </div>

      {/* Segmented Tab Switcher */}
      <div
        className="grid grid-cols-2 p-1 rounded-xl border text-xs font-semibold text-center"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <button
          onClick={() => setActiveTab('history')}
          className={`py-1.5 rounded-lg transition-all ${
            activeTab === 'history'
              ? 'bg-black/10 dark:bg-white/10 font-bold shadow-xs'
              : 'opacity-65 hover:opacity-100'
          }`}
          style={{ color: activeTab === 'history' ? 'var(--color-primary)' : 'var(--color-text)' }}
        >
          Daily Roll Log ({filteredRecords.length})
        </button>

        <button
          onClick={() => setActiveTab('slips')}
          className={`py-1.5 rounded-lg transition-all ${
            activeTab === 'slips'
              ? 'bg-black/10 dark:bg-white/10 font-bold shadow-xs'
              : 'opacity-65 hover:opacity-100'
          }`}
          style={{ color: activeTab === 'slips' ? 'var(--color-primary)' : 'var(--color-text)' }}
        >
          Absence Slips ({childSlips.length})
        </button>
      </div>

      {/* TAB 1: DAILY ROLL LOG (Clean Card Feed) */}
      {activeTab === 'history' && (
        <div className="space-y-2">
          {/* Quick Month Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs pb-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Month:</span>
            {(['all', 'october', 'september'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setFilterRange(r)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize transition-all border ${
                  filterRange === r ? 'bg-black/10 dark:bg-white/10' : 'opacity-60'
                }`}
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                {r === 'all' ? 'All' : r}
              </button>
            ))}
          </div>

          {filteredRecords.map((log, idx) => {
            const isPresent = log.status === 'present';
            const isLate = log.status === 'late';
            const isExcused = log.status === 'excused';

            return (
              <div
                key={idx}
                className="p-3 rounded-xl border text-xs flex items-center justify-between gap-3 shadow-xs"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs" style={{ color: 'var(--color-text)' }}>
                      {log.date}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {selectedChild.grade} ({selectedChild.section})
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                    {log.note || `Verified by advisor ${selectedChild.classTeacher}`}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                    isPresent
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : isLate
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      : isExcused
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                  }`}
                >
                  <span>{isPresent ? '✓' : isLate ? '⏱' : isExcused ? 'E' : 'X'}</span>
                  <span className="capitalize">{log.status}</span>
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: SUBMITTED LEAVE SLIPS */}
      {activeTab === 'slips' && (
        <div className="space-y-2">
          {childSlips.length === 0 ? (
            <div
              className="p-6 rounded-xl border text-center space-y-2 text-xs"
              style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <FileCheck className="w-8 h-8 text-slate-400 mx-auto" />
              <span className="font-bold block" style={{ color: 'var(--color-text)' }}>
                No Leave Slips on File
              </span>
              <p className="text-slate-500 text-[11px]">
                Submit an excused absence or medical note using the button above.
              </p>
            </div>
          ) : (
            childSlips.map((slip) => (
              <div
                key={slip.id}
                className="p-3.5 rounded-xl border text-xs space-y-2 shadow-xs"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-xs block" style={{ color: 'var(--color-text)' }}>
                      {slip.reasonCategory}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Dates: {slip.startDate} {slip.endDate !== slip.startDate && `– ${slip.endDate}`}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                      slip.status === 'Approved & Excused'
                        ? 'bg-emerald-100 text-emerald-800'
                        : slip.status === 'Pending Review'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {slip.status}
                  </span>
                </div>

                <p
                  className="p-2 rounded-lg border text-[11px] leading-relaxed text-slate-600 dark:text-slate-300"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  &ldquo;{slip.note}&rdquo;
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                  <span>Signer: {slip.guardianName}</span>
                  <span>{slip.submittedAt}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* LEAVE SLIP EXCUSE SUBMISSION MODAL */}
      {showExcuseModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border shadow-2xl p-4 sm:p-6 animate-in slide-in-from-bottom-5 duration-200 space-y-3.5"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <h3 className="text-sm font-extrabold" style={{ color: 'var(--color-text)' }}>
                  Submit Absence / Leave Slip
                </h3>
                <span className="text-[11px] text-slate-500">
                  Student: <strong>{selectedChild.name}</strong> ({selectedChild.grade})
                </span>
              </div>
              <button
                onClick={() => setShowExcuseModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formFeedback && (
              <div
                className={`p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                  formFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {formFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{formFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSaveSlip} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Reason Category
                </label>
                <select
                  value={excuseCategory}
                  onChange={(e) => setExcuseCategory(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border outline-none font-medium"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                >
                  <option value="Medical Appointment / Illness">Medical Appointment / Illness</option>
                  <option value="Family Bereavement / Emergency">Family Emergency</option>
                  <option value="Approved Academic Competition / Travel">Extracurricular / Competition</option>
                  <option value="Religious Observance">Religious Observance</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Absence Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={excuseStartDate}
                    onChange={(e) => setExcuseStartDate(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border outline-none font-medium"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    End Date (If Multi-Day)
                  </label>
                  <input
                    type="date"
                    value={excuseEndDate}
                    onChange={(e) => setExcuseEndDate(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border outline-none font-medium"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Explanation & Details
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Please state symptoms, doctor clinic name, or reason for absence."
                  value={excuseNote}
                  onChange={(e) => setExcuseNote(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border outline-none leading-relaxed"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  type="button"
                  onClick={() => setShowExcuseModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white rounded-lg shadow-xs hover:opacity-95"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  Submit Excuse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
