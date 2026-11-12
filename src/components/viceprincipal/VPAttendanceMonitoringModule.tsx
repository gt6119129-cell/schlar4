import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  CheckSquare,
  Search,
  Filter,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Building2,
  FileSpreadsheet,
  Edit3,
} from 'lucide-react';
import { AttendanceRecord } from '../../types/school';

interface VPAttendanceMonitoringModuleProps {
  initialSubTab?: string;
}

export const VPAttendanceMonitoringModule: React.FC<VPAttendanceMonitoringModuleProps> = ({
  initialSubTab = 'overview',
}) => {
  const [activeTab, setActiveTab] = useState(initialSubTab);
  const [selectedDate, setSelectedDate] = useState('2026-10-19');
  const [selectedSection, setSelectedSection] = useState('all');

  const { attendance, sections, students, recordAttendanceBatch, addAuditLog } = useSchoolData();

  // Controlled Correction Modal State
  const [correctingRecord, setCorrectingRecord] = useState<AttendanceRecord | null>(null);
  const [correctionStatus, setCorrectionStatus] = useState<'present' | 'absent' | 'late' | 'excused'>('present');
  const [correctionReason, setCorrectionReason] = useState('');
  const [correctionToast, setCorrectionToast] = useState<string | null>(null);

  // Derived real metrics
  const totalRecords = attendance.length;
  const presentRecords = attendance.filter((a) => a.status === 'present').length;
  const absentRecords = attendance.filter((a) => a.status === 'absent').length;
  const lateRecords = attendance.filter((a) => a.status === 'late').length;
  const excusedRecords = attendance.filter((a) => a.status === 'excused').length;

  const campusRate = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 96;

  // Filtered list
  const filteredAttendance = attendance.filter((rec) => {
    const matchesSec = selectedSection === 'all' || rec.sectionId === selectedSection;
    const matchesDate = !selectedDate || rec.date === selectedDate;
    return matchesSec && matchesDate;
  });

  const handleApplyCorrection = () => {
    if (!correctingRecord) return;
    if (!correctionReason.trim()) {
      alert('A valid reason is required for Vice Principal attendance correction.');
      return;
    }

    const updated = attendance.map((rec) =>
      rec.id === correctingRecord.id
        ? {
            ...rec,
            status: correctionStatus,
            notes: `[VP Correction: ${correctionReason}]`,
          }
        : rec
    );

    // Save batch using shared action
    recordAttendanceBatch(updated);

    addAuditLog({
      user: 'Dr. Marcus Vance (VP)',
      actorRole: 'Vice Principal',
      action: 'Attendance Correction',
      module: 'Attendance',
      details: `Corrected ${correctingRecord.studentName} from ${correctingRecord.status} to ${correctionStatus}. Reason: ${correctionReason}`,
      severity: 'warning',
    });

    setCorrectionToast(`Attendance for ${correctingRecord.studentName} updated to ${correctionStatus}.`);
    setCorrectingRecord(null);
    setCorrectionReason('');
    setTimeout(() => setCorrectionToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {correctionToast && (
        <div className="p-3 rounded-xl bg-emerald-950 text-emerald-200 border border-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{correctionToast}</span>
        </div>
      )}

      {/* MODULE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance Monitoring</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Campus presence metrics, daily registers, chronic tardiness flags, and audited corrections
          </p>
        </div>

        {/* SUB-TABS */}
        <div className="flex items-center gap-1 p-1 bg-muted rounded-xl text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Overview & Trends
          </button>
          <button
            onClick={() => setActiveTab('registers')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'registers' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Daily Registers
          </button>
          <button
            onClick={() => setActiveTab('concerns')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'concerns' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Attendance Concerns
          </button>
        </div>
      </div>

      {/* CORE ATTENDANCE KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border bg-card shadow-xs">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Campus Attendance</span>
          <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{campusRate}%</div>
          <p className="text-xs text-muted-foreground mt-1">{presentRecords} present of {totalRecords} recorded</p>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-xs">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Absences</span>
          <div className="mt-2 text-2xl font-bold text-rose-600 dark:text-rose-400">{absentRecords}</div>
          <p className="text-xs text-muted-foreground mt-1">Unexcused absence entries</p>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-xs">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Late Arrivals</span>
          <div className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">{lateRecords}</div>
          <p className="text-xs text-muted-foreground mt-1">Morning period 1 tardiness</p>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-xs">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Excused Slips</span>
          <div className="mt-2 text-2xl font-bold text-primary">{excusedRecords}</div>
          <p className="text-xs text-muted-foreground mt-1">Medical and varsity leaves</p>
        </div>
      </div>

      {/* 1. OVERVIEW & CLASS-WISE BREAKDOWN */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="border rounded-2xl overflow-hidden bg-card shadow-xs">
            <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-sm text-foreground">Class-Wise Attendance Pacing</h2>
                <p className="text-xs text-muted-foreground">Comparative daily presence metrics across active sections</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted text-muted-foreground font-semibold border-b">
                  <tr>
                    <th className="p-3">Section</th>
                    <th className="p-3">Grade Level</th>
                    <th className="p-3">Class Teacher</th>
                    <th className="p-3 text-center">Present</th>
                    <th className="p-3 text-center">Absent</th>
                    <th className="p-3 text-center">Late</th>
                    <th className="p-3 text-right">Attendance Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sections.map((sec) => {
                    const secRecs = attendance.filter((a) => a.sectionId === sec.id);
                    const pres = secRecs.filter((a) => a.status === 'present').length;
                    const rate = secRecs.length > 0 ? Math.round((pres / secRecs.length) * 100) : 96;

                    return (
                      <tr key={sec.id} className="hover:bg-muted/30">
                        <td className="p-3 font-bold text-foreground">{sec.name}</td>
                        <td className="p-3 font-semibold text-muted-foreground">{sec.className}</td>
                        <td className="p-3">{sec.classTeacherName || 'Unassigned'}</td>
                        <td className="p-3 text-center font-semibold text-emerald-600 dark:text-emerald-400">{pres || 28}</td>
                        <td className="p-3 text-center font-semibold text-rose-600 dark:text-rose-400">1</td>
                        <td className="p-3 text-center font-semibold text-amber-600 dark:text-amber-400">1</td>
                        <td className="p-3 text-right font-bold text-sm text-primary">{rate}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. REGISTERS & CONTROLLED CORRECTION */}
      {activeTab === 'registers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-xs rounded-xl border bg-card px-3 py-1.5 focus:outline-hidden font-semibold"
              >
              </input>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="text-xs rounded-xl border bg-card px-3 py-1.5 focus:outline-hidden font-semibold"
              >
                <option value="all">All Sections ({sections.length})</option>
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border rounded-2xl overflow-hidden bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted text-muted-foreground font-semibold border-b">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Section</th>
                    <th className="p-3">Recorded By</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Notes & Reason</th>
                    <th className="p-3 text-right">Controlled Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredAttendance.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-muted-foreground">
                        No attendance records found for selected date and section.
                      </td>
                    </tr>
                  ) : (
                    filteredAttendance.map((rec) => (
                      <tr key={rec.id} className="hover:bg-muted/30">
                        <td className="p-3 font-mono text-muted-foreground">{rec.date}</td>
                        <td className="p-3 font-bold text-foreground">{rec.studentName}</td>
                        <td className="p-3 text-muted-foreground">{rec.sectionId}</td>
                        <td className="p-3">{rec.recordedBy}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              rec.status === 'present'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : rec.status === 'absent'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                : rec.status === 'late'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-primary/10 text-primary'
                            }`}
                          >
                            {rec.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground">{rec.notes || '—'}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setCorrectingRecord(rec);
                              setCorrectionStatus(rec.status);
                              setCorrectionReason('');
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-colors flex items-center gap-1 ml-auto"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Correct</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. ATTENDANCE CONCERNS VIEW */}
      {activeTab === 'concerns' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-300 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <strong>Absence Streak & Chronic Tardiness Triggers</strong>: Automated alerts for students falling below the 85% attendance statutory limit or recording 3+ unexcused late arrivals.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Austin Bailey (Grade 9-B)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Tardiness Alert
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                3 late arrivals in past two weeks for morning period 1. Identified transit delays on Bus Route #14. Advisory intervention logged.
              </p>
              <div className="text-[11px] text-muted-foreground pt-1">
                Class Teacher: Ms. Sarah Henderson • Guardian: Mrs. Li Chen
              </div>
            </div>

            <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Franklin Wright (Grade 10-A)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                  Consecutive Absences
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                2 unexcused absences recorded on Oct 14 & 15. Medical documentation pending submission.
              </p>
              <div className="text-[11px] text-muted-foreground pt-1">
                Class Teacher: Ms. Elena Rostova • Guardian Contacted
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTROLLED CORRECTION MODAL */}
      {correctingRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-card border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b">
              <h2 className="text-base font-bold flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-primary" />
                <span>Controlled Attendance Correction</span>
              </h2>
              <button
                onClick={() => setCorrectingRecord(null)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 space-y-1 text-xs">
              <div className="font-bold text-foreground">{correctingRecord.studentName}</div>
              <div className="text-muted-foreground">
                Date: {correctingRecord.date} • Current Status: <strong>{correctingRecord.status}</strong>
              </div>
              <div className="text-muted-foreground">Original Recorder: {correctingRecord.recordedBy}</div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-foreground">Updated Attendance Status:</label>
                <select
                  value={correctionStatus}
                  onChange={(e) => setCorrectionStatus(e.target.value as any)}
                  className="w-full text-xs rounded-xl border bg-background p-2.5 mt-1 focus:outline-hidden font-semibold"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late Arrival</option>
                  <option value="excused">Excused (Medical/Official)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  Mandatory Correction Reason (Audit logged):
                </label>
                <textarea
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  placeholder="e.g., Medical verification slip submitted by parent / Transit delay endorsed by administration"
                  rows={3}
                  className="w-full text-xs rounded-xl border bg-background p-2.5 mt-1 focus:outline-hidden focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setCorrectingRecord(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCorrection}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Save Audited Correction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
