import React, { useState, useMemo } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { usePermissions } from '../../context/PermissionContext';
import { AttendanceRecord, Section } from '../../types/school';
import {
  CalendarCheck2,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  Users,
  Edit2,
  X,
  FileCheck,
  Check,
  ChevronRight,
} from 'lucide-react';

export const AttendanceMonitoringModule: React.FC = () => {
  const {
    sections,
    students,
    attendance,
    recordAttendanceBatch,
  } = useSchoolData();

  const { hasPermission } = usePermissions();

  const canEditAttendance = hasPermission('attendance.edit');

  // Selected date state (defaults to 2026-10-19)
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-19');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');

  // Register Modal / Drawer for marking attendance for a section
  const [registerSection, setRegisterSection] = useState<Section | null>(null);
  const [draftRollCall, setDraftRollCall] = useState<Record<string, { status: 'present' | 'absent' | 'late' | 'excused'; notes: string }>>({});

  // Banner notification
  const [bannerSuccess, setBannerSuccess] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setBannerSuccess(msg);
    setTimeout(() => setBannerSuccess(null), 3500);
  };

  // Filter attendance records by the selected date
  const dateAttendance = useMemo(() => {
    return attendance.filter((a) => a.date === selectedDate);
  }, [attendance, selectedDate]);

  // Overall School Statistics for selected date
  const totalEnrolledStudents = useMemo(() => {
    return students.filter((s) => s.enrollmentStatus === 'active').length;
  }, [students]);

  const totalMarked = dateAttendance.length;
  const presentCount = dateAttendance.filter((a) => a.status === 'present').length;
  const lateCount = dateAttendance.filter((a) => a.status === 'late').length;
  const absentCount = dateAttendance.filter((a) => a.status === 'absent').length;
  const excusedCount = dateAttendance.filter((a) => a.status === 'excused').length;
  const dailyRate = totalMarked > 0 ? Math.round(((presentCount + lateCount) / totalMarked) * 100) : 0;

  // Active sections
  const activeSections = useMemo(() => {
    return sections.filter((s) => s.status === 'active');
  }, [sections]);

  // Open Roll-call Register for a section
  const handleOpenRegister = (sec: Section) => {
    const secStudents = students.filter(
      (s) => s.sectionId === sec.id && s.enrollmentStatus === 'active'
    );

    // Seed draft with existing records or default to 'present'
    const draft: Record<string, { status: 'present' | 'absent' | 'late' | 'excused'; notes: string }> = {};
    secStudents.forEach((st) => {
      const existing = attendance.find((a) => a.date === selectedDate && a.studentId === st.id);
      if (existing) {
        draft[st.id] = { status: existing.status, notes: existing.notes || '' };
      } else {
        draft[st.id] = { status: 'present', notes: '' };
      }
    });

    setDraftRollCall(draft);
    setRegisterSection(sec);
  };

  // Mark all present in draft
  const handleMarkAllPresent = () => {
    setDraftRollCall((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((id) => {
        updated[id] = { ...updated[id], status: 'present' };
      });
      return updated;
    });
  };

  // Save Register
  const handleSaveRegister = () => {
    if (!registerSection) return;

    const secStudents = students.filter(
      (s) => s.sectionId === registerSection.id && s.enrollmentStatus === 'active'
    );

    const recordsToCommit: Omit<AttendanceRecord, 'id'>[] = secStudents.map((st) => {
      const entry = draftRollCall[st.id] || { status: 'present', notes: '' };
      return {
        date: selectedDate,
        studentId: st.id,
        studentName: st.name,
        classId: st.classId,
        sectionId: st.sectionId,
        status: entry.status,
        recordedBy: registerSection.classTeacherName || 'Admin Office',
        notes: entry.notes || undefined,
      };
    });

    recordAttendanceBatch(recordsToCommit);
    showNotification(`Attendance for ${registerSection.className} · ${registerSection.name} successfully committed.`);
    setRegisterSection(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner Feedback */}
      {bannerSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{bannerSuccess}</span>
          </div>
          <button onClick={() => setBannerSuccess(null)} className="p-1 hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Campus Attendance Monitoring
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time daily attendance registers, section sign-off logs, and statutory audit records.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Session Date:</span>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none outline-none font-bold text-xs"
              style={{ color: 'var(--color-text)' }}
            />
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div
          className="p-3.5 rounded-xl border text-xs flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <span className="text-slate-400 text-[10px] font-bold uppercase">Enrolled</span>
          <div className="text-xl font-extrabold font-mono tabular-nums mt-1" style={{ color: 'var(--color-text)' }}>
            {totalEnrolledStudents}
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Total Campus Cohort</span>
        </div>

        <div
          className="p-3.5 rounded-xl border text-xs flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <span className="text-slate-400 text-[10px] font-bold uppercase">Roll Taken</span>
          <div className="text-xl font-extrabold font-mono tabular-nums mt-1" style={{ color: 'var(--color-text)' }}>
            {totalMarked} / {totalEnrolledStudents}
          </div>
          <span className="text-[10px] text-slate-400 mt-1">
            {totalMarked === totalEnrolledStudents ? '100% Complete' : 'Sections in progress'}
          </span>
        </div>

        <div
          className="p-3.5 rounded-xl border text-xs flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <span className="text-emerald-600 text-[10px] font-bold uppercase">Present Rate</span>
          <div className="text-xl font-extrabold font-mono tabular-nums text-emerald-600 mt-1">
            {dailyRate}%
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Present + Late</span>
        </div>

        <div
          className="p-3.5 rounded-xl border text-xs flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <span className="text-emerald-700 text-[10px] font-bold uppercase">Present</span>
          <div className="text-xl font-extrabold font-mono tabular-nums text-emerald-700 mt-1">
            {presentCount}
          </div>
          <span className="text-[10px] text-slate-400 mt-1">On-time check-ins</span>
        </div>

        <div
          className="p-3.5 rounded-xl border text-xs flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <span className="text-amber-600 text-[10px] font-bold uppercase">Late</span>
          <div className="text-xl font-extrabold font-mono tabular-nums text-amber-600 mt-1">
            {lateCount}
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Tardy arrivals</span>
        </div>

        <div
          className="p-3.5 rounded-xl border text-xs flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <span className="text-rose-600 text-[10px] font-bold uppercase">Absent / Excused</span>
          <div className="text-xl font-extrabold font-mono tabular-nums text-rose-600 mt-1">
            {absentCount + excusedCount}
          </div>
          <span className="text-[10px] text-slate-400 mt-1">{absentCount} Unexcused · {excusedCount} Excused</span>
        </div>
      </div>

      {/* Class & Section Register Overview */}
      <div
        className="rounded-xl border shadow-xs overflow-hidden"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
          <div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
              Section Sign-Off Ledger for {selectedDate}
            </h3>
            <p className="text-xs text-slate-500">
              Inspection status across individual grade divisions
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr
                className="border-b"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Cohort Section</th>
                <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Class Teacher</th>
                <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Enrolled Students</th>
                <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Recorded Status</th>
                <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Present / Late / Absent</th>
                <th className="py-2.5 px-4 font-semibold text-[10px] uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {activeSections.map((sec) => {
                const secStudents = students.filter(
                  (s) => s.sectionId === sec.id && s.enrollmentStatus === 'active'
                );

                const secAttendance = dateAttendance.filter((a) => a.sectionId === sec.id);
                const isMarked = secAttendance.length > 0;
                const secPresent = secAttendance.filter((a) => a.status === 'present').length;
                const secLate = secAttendance.filter((a) => a.status === 'late').length;
                const secAbsent = secAttendance.filter((a) => a.status === 'absent').length;

                return (
                  <tr key={sec.id} className="hover:bg-black/[0.015] dark:hover:bg-white/[0.015] transition-colors">
                    <td className="py-3 px-4 font-bold" style={{ color: 'var(--color-text)' }}>
                      {sec.className} · {sec.name}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-medium">
                      {sec.classTeacherName || <span className="italic text-amber-600">Unassigned</span>}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold" style={{ color: 'var(--color-text)' }}>
                      {secStudents.length} Students
                    </td>
                    <td className="py-3 px-4">
                      {isMarked ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Submitted</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          <Clock className="w-3 h-3" />
                          <span>Pending Roll Call</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      {isMarked ? (
                        <span>
                          <strong className="text-emerald-600">{secPresent}</strong> P ·{' '}
                          <strong className="text-amber-600">{secLate}</strong> L ·{' '}
                          <strong className="text-rose-600">{secAbsent}</strong> A
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Not recorded yet</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenRegister(sec)}
                        className="px-3 py-1 rounded text-[11px] font-bold border hover:opacity-90 inline-flex items-center gap-1"
                        style={{
                          backgroundColor: 'var(--color-surface)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-primary)',
                        }}
                      >
                        <span>{canEditAttendance ? (isMarked ? 'Edit Register' : 'Take Attendance') : 'View Register'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ATTENDANCE REGISTER ROLL CALL */}
      {registerSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-2xl rounded-xl border shadow-xl flex flex-col max-h-[88vh] text-xs overflow-hidden"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            {/* Modal Header */}
            <div className="p-4 border-b flex items-start justify-between" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  Attendance Register: {registerSection.className} · {registerSection.name}
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Date: <strong>{selectedDate}</strong> · Teacher: {registerSection.classTeacherName || 'Admin Office'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {canEditAttendance && (
                  <button
                    onClick={handleMarkAllPresent}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded border hover:bg-black/5"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  >
                    Mark All Present
                  </button>
                )}
                <button onClick={() => setRegisterSection(null)} className="p-1 hover:opacity-75">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Students Roll Call List */}
            <div className="overflow-y-auto flex-1 p-4 divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {(() => {
                const secStudents = students.filter(
                  (s) => s.sectionId === registerSection.id && s.enrollmentStatus === 'active'
                );

                if (secStudents.length === 0) {
                  return (
                    <div className="py-8 text-center text-slate-400">
                      No active students enrolled in this section.
                    </div>
                  );
                }

                return secStudents.map((st) => {
                  const entry = draftRollCall[st.id] || { status: 'present', notes: '' };

                  return (
                    <div key={st.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs" style={{ color: 'var(--color-text)' }}>
                            {st.name}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">({st.admissionNo})</span>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          Guardian: {st.guardianName} ({st.guardianPhone})
                        </span>
                      </div>

                      {/* Status Selector Buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        {(['present', 'late', 'absent', 'excused'] as const).map((stat) => {
                          const isSelected = entry.status === stat;
                          const colorMap = {
                            present: isSelected
                              ? 'bg-emerald-600 text-white font-bold'
                              : 'border hover:bg-emerald-50 text-slate-600',
                            late: isSelected
                              ? 'bg-amber-500 text-white font-bold'
                              : 'border hover:bg-amber-50 text-slate-600',
                            absent: isSelected
                              ? 'bg-rose-600 text-white font-bold'
                              : 'border hover:bg-rose-50 text-slate-600',
                            excused: isSelected
                              ? 'bg-indigo-600 text-white font-bold'
                              : 'border hover:bg-indigo-50 text-slate-600',
                          };

                          return (
                            <button
                              key={stat}
                              type="button"
                              disabled={!canEditAttendance}
                              onClick={() => {
                                setDraftRollCall((prev) => ({
                                  ...prev,
                                  [st.id]: { ...entry, status: stat },
                                }));
                              }}
                              className={`px-2.5 py-1 rounded text-[10px] uppercase tracking-wider capitalize transition-colors ${colorMap[stat]}`}
                              style={!isSelected ? { borderColor: 'var(--color-border)' } : {}}
                            >
                              {stat}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Footer */}
            <div className="p-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-[11px] text-slate-400">
                {canEditAttendance ? 'Changes will be saved to the permanent school attendance ledger.' : 'Viewing mode (read-only)'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRegisterSection(null)}
                  className="px-3 py-1.5 rounded-lg border text-slate-500 font-medium"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  Cancel
                </button>
                {canEditAttendance && (
                  <button
                    type="button"
                    onClick={handleSaveRegister}
                    className="px-4 py-1.5 font-bold text-white rounded-lg shadow-xs hover:opacity-95"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    Commit Register
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
