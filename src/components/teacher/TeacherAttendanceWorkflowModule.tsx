import React, { useState, useEffect } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  CheckSquare,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Save,
  RotateCcw,
  History,
  Edit3,
  X,
  Search,
  LayoutGrid,
  List,
  Check,
  Info,
} from 'lucide-react';
import { AttendanceRecord } from '../../types/school';

export interface TimetablePeriod {
  id: string;
  code: string;
  name: string;
  time: string;
  subject: string;
}

export const TIMETABLE_PERIODS: TimetablePeriod[] = [
  { id: 'p1', code: 'P1', name: 'Period 1', time: '08:30 - 09:15', subject: 'English Lit' },
  { id: 'p2', code: 'P2', name: 'Period 2', time: '09:15 - 10:00', subject: 'Mathematics' },
  { id: 'p3', code: 'P3', name: 'Period 3', time: '10:15 - 11:00', subject: 'General Science' },
  { id: 'p4', code: 'P4', name: 'Period 4', time: '11:00 - 11:45', subject: 'Social Studies' },
  { id: 'p5', code: 'P5', name: 'Period 5', time: '12:30 - 01:15', subject: 'Art & Design' },
  { id: 'p6', code: 'P6', name: 'Period 6', time: '01:15 - 02:00', subject: 'Physical Ed' },
];

interface TeacherAttendanceWorkflowModuleProps {
  initialSectionId?: string;
}

export const TeacherAttendanceWorkflowModule: React.FC<TeacherAttendanceWorkflowModuleProps> = ({
  initialSectionId,
}) => {
  const {
    sections,
    students,
    attendance,
    recordAttendanceBatch,
    addAuditLog,
  } = useSchoolData();

  // Demo teacher is Ms. Sarah Henderson, assigned to 8-A, 9-B, 10-A
  const assignedSectionIds = ['sec-8a', 'sec-9b', 'sec-10a'];
  const mySections = sections.filter((s) => assignedSectionIds.includes(s.id));

  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    initialSectionId || mySections[1]?.id || mySections[0]?.id || ''
  );
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-19');
  const [sessionPeriod, setSessionPeriod] = useState<string>('Period 3 (10:15 - 11:00 AM)');
  const [searchStudent, setSearchStudent] = useState('');
  const [viewMode, setViewMode] = useState<'matrix' | 'single'>('matrix');

  // Matrix state: studentId -> periodId -> status
  const [matrixStatusMap, setMatrixStatusMap] = useState<
    Record<string, Record<string, 'present' | 'absent' | 'late' | 'excused'>>
  >({});

  // Single period draft states for each student
  const [studentStatusMap, setStudentStatusMap] = useState<Record<string, 'present' | 'absent' | 'late' | 'excused'>>({});
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editReasonModalOpen, setEditReasonModalOpen] = useState(false);
  const [editReason, setEditReason] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [auditHistory, setAuditHistory] = useState<Array<{ timestamp: string; note: string }>>([
    { timestamp: '2026-10-18 10:16', note: 'Standard period roll call submitted by Ms. Henderson' },
  ]);

  const selectedSection = mySections.find((s) => s.id === selectedSectionId) || mySections[0];

  // Enrolled active students for this section
  const sectionStudents = students.filter(
    (st) => st.sectionId === selectedSection?.id && st.enrollmentStatus === 'active'
  );

  // Load existing records from context when section/date change
  useEffect(() => {
    if (!selectedSection) return;
    const existing = attendance.filter(
      (a) => a.sectionId === selectedSection.id && a.date === selectedDate
    );

    const singleMap: Record<string, 'present' | 'absent' | 'late' | 'excused'> = {};
    const matrixMap: Record<string, Record<string, 'present' | 'absent' | 'late' | 'excused'>> = {};

    if (existing.length > 0) {
      existing.forEach((rec) => {
        singleMap[rec.studentId] = rec.status;
      });
      sectionStudents.forEach((st) => {
        const studentStatus = singleMap[st.id] || 'present';
        matrixMap[st.id] = {
          p1: studentStatus === 'absent' ? 'absent' : 'present',
          p2: studentStatus === 'absent' ? 'absent' : 'present',
          p3: studentStatus,
          p4: studentStatus === 'absent' ? 'absent' : 'present',
          p5: studentStatus === 'absent' ? 'absent' : 'present',
          p6: studentStatus === 'absent' ? 'absent' : 'present',
        };
      });
      setIsEditMode(false);
    } else {
      sectionStudents.forEach((st) => {
        singleMap[st.id] = 'present';
        matrixMap[st.id] = {
          p1: 'present',
          p2: 'present',
          p3: 'present',
          p4: 'present',
          p5: 'present',
          p6: 'present',
        };
      });
      setIsEditMode(true);
    }
    setStudentStatusMap(singleMap);
    setMatrixStatusMap(matrixMap);
  }, [selectedSectionId, selectedDate, attendance]);

  const existingRecordsCount = attendance.filter(
    (a) => a.sectionId === selectedSection?.id && a.date === selectedDate
  ).length;

  const isAlreadyCommitted = existingRecordsCount > 0;

  // Counts based on active view mode
  const currentStatusArray =
    viewMode === 'matrix'
      ? sectionStudents.map((st) => matrixStatusMap[st.id]?.['p3'] || 'present')
      : Object.values(studentStatusMap);

  const presentCount = currentStatusArray.filter((s) => s === 'present').length;
  const absentCount = currentStatusArray.filter((s) => s === 'absent').length;
  const lateCount = currentStatusArray.filter((s) => s === 'late').length;
  const excusedCount = currentStatusArray.filter((s) => s === 'excused').length;
  const totalCount = sectionStudents.length;

  const handleSetAll = (status: 'present' | 'absent' | 'late' | 'excused') => {
    if (!isEditMode && isAlreadyCommitted) {
      setToastMessage('Please unlock editing first to make changes to submitted attendance.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    const map: Record<string, 'present' | 'absent' | 'late' | 'excused'> = {};
    const matrix: Record<string, Record<string, 'present' | 'absent' | 'late' | 'excused'>> = {};

    sectionStudents.forEach((s) => {
      map[s.id] = status;
      matrix[s.id] = {
        p1: status,
        p2: status,
        p3: status,
        p4: status,
        p5: status,
        p6: status,
      };
    });
    setStudentStatusMap(map);
    setMatrixStatusMap(matrix);
  };

  const handleUpdateStudent = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    if (!isEditMode && isAlreadyCommitted) {
      setToastMessage('Attendance is committed. Click "Unlock for Correction" to amend.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    setStudentStatusMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleToggleMatrixCell = (studentId: string, periodId: string) => {
    if (!isEditMode && isAlreadyCommitted) {
      setToastMessage('Attendance is committed. Click "Unlock for Correction" to amend.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    setMatrixStatusMap((prev) => {
      const studentRec = prev[studentId] || {};
      const current = studentRec[periodId] || 'present';
      // Toggle sequence: present -> absent -> late -> excused -> present
      const next = current === 'present' ? 'absent' : current === 'absent' ? 'late' : current === 'late' ? 'excused' : 'present';
      return {
        ...prev,
        [studentId]: {
          ...studentRec,
          [periodId]: next,
        },
      };
    });
  };

  const handleSetPeriodAll = (periodId: string, status: 'present' | 'absent') => {
    if (!isEditMode && isAlreadyCommitted) {
      setToastMessage('Attendance is committed. Click "Unlock for Correction" to amend.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    setMatrixStatusMap((prev) => {
      const updated = { ...prev };
      sectionStudents.forEach((st) => {
        updated[st.id] = {
          ...(updated[st.id] || {}),
          [periodId]: status,
        };
      });
      return updated;
    });
  };

  const handleSetAllPeriodsPresent = () => {
    if (!isEditMode && isAlreadyCommitted) {
      setToastMessage('Attendance is committed. Click "Unlock for Correction" to amend.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    setMatrixStatusMap((prev) => {
      const updated = { ...prev };
      sectionStudents.forEach((st) => {
        updated[st.id] = {
          p1: 'present',
          p2: 'present',
          p3: 'present',
          p4: 'present',
          p5: 'present',
          p6: 'present',
        };
      });
      return updated;
    });
    handleSetAll('present');
  };

  const handleSaveAttendance = () => {
    if (!selectedSection) return;

    if (isAlreadyCommitted && !editReason.trim()) {
      setEditReasonModalOpen(true);
      return;
    }

    commitAttendance(editReason || 'Standard roll call recorded');
  };

  const commitAttendance = (reasonNote: string) => {
    if (!selectedSection) return;

    const newRecords: Omit<AttendanceRecord, 'id'>[] = sectionStudents.map((st) => ({
      date: selectedDate,
      studentId: st.id,
      studentName: st.name,
      classId: selectedSection.classId,
      sectionId: selectedSection.id,
      status: viewMode === 'matrix' ? (matrixStatusMap[st.id]?.['p3'] || 'present') : (studentStatusMap[st.id] || 'present'),
      recordedBy: 'Ms. Sarah Henderson (staff-henderson)',
      notes: `${sessionPeriod}: ${reasonNote}`,
    }));

    recordAttendanceBatch(newRecords);
    addAuditLog({
      user: 'Ms. Sarah Henderson',
      action: 'Attendance Committed',
      module: 'Attendance / Instruction',
      details: `Class ${selectedSection.name}: ${presentCount} Present, ${absentCount} Absent, ${lateCount} Late on ${selectedDate}. (${reasonNote})`,
      severity: 'info',
    });

    setAuditHistory((prev) => [
      {
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        note: `Committed: ${presentCount}P / ${absentCount}A / ${lateCount}L. Note: ${reasonNote}`,
      },
      ...prev,
    ]);

    setIsEditMode(false);
    setEditReasonModalOpen(false);
    setEditReason('');
    setToastMessage(`Roll call for ${selectedSection.name} successfully saved to school database.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredStudents = sectionStudents.filter(
    (st) =>
      st.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      st.admissionNo.toLowerCase().includes(searchStudent.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-primary)',
              }}
            >
              Classroom Instruction
            </span>
            <span className="text-xs text-slate-500">Period Roll Call Desk</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Period Attendance Register</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Record, verify, and submit official attendance across all instructional periods.
          </p>
        </div>

        {/* Action Controls & View Switcher */}
        <div className="flex items-center flex-wrap gap-2 shrink-0">
          {/* View Mode Toggle */}
          <div
            className="flex items-center p-1 rounded-xl border text-xs font-semibold"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <button
              onClick={() => setViewMode('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'matrix' ? 'text-white shadow-2xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              style={{
                backgroundColor: viewMode === 'matrix' ? 'var(--color-primary)' : 'transparent',
              }}
              title="Multi-period matrix view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Multi-Period Matrix</span>
            </button>
            <button
              onClick={() => setViewMode('single')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'single' ? 'text-white shadow-2xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              style={{
                backgroundColor: viewMode === 'single' ? 'var(--color-primary)' : 'transparent',
              }}
              title="Single period roll call view"
            >
              <List className="w-3.5 h-3.5" />
              <span>Single Period</span>
            </button>
          </div>

          {isAlreadyCommitted && !isEditMode ? (
            <button
              onClick={() => setIsEditMode(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-500" />
              <span>Unlock for Correction</span>
            </button>
          ) : (
            <button
              onClick={handleSaveAttendance}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-all hover:opacity-95"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Save className="w-4 h-4" />
              <span>{isAlreadyCommitted ? 'Save Corrections' : 'Commit Register'}</span>
            </button>
          )}
        </div>
      </div>

      {/* TOAST MESSAGE */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* CLASS, DATE, SUBJECT, PERIOD INDICATORS BANNER */}
      <div
        className="p-4 rounded-2xl border shadow-xs"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Assigned Cohort / Class
            </label>
            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-lg border outline-none cursor-pointer"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              {mySections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.name} ({sec.className}) · Room {sec.room || '204'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Instructional Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-lg border outline-none"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Subject & Room
            </label>
            <div
              className="px-3 py-2 text-xs font-semibold rounded-lg border flex items-center justify-between"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              <span>Mathematics · General Science</span>
              <span className="text-[11px] text-slate-500 font-mono">Room {selectedSection?.room || '204'}</span>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              {viewMode === 'matrix' ? 'Timetable Span' : 'Active Period'}
            </label>
            {viewMode === 'matrix' ? (
              <div
                className="px-3 py-2 text-xs font-semibold rounded-lg border flex items-center justify-between"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                <span>6 Instructional Periods</span>
                <span className="text-[10px] text-emerald-600 font-bold uppercase">P1 to P6 Full Day</span>
              </div>
            ) : (
              <select
                value={sessionPeriod}
                onChange={(e) => setSessionPeriod(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-lg border outline-none cursor-pointer"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                {TIMETABLE_PERIODS.map((p) => (
                  <option key={p.id} value={`${p.name} (${p.time})`}>
                    {p.name} ({p.time}) — {p.subject}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Clear Indicator & Legend Bar */}
        <div
          className="mt-3 pt-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Attendance Symbols:</span>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                ✓ Present
              </span>
              <span className="px-2 py-0.5 rounded font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                X Absent
              </span>
              <span className="px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                ⏱ Late
              </span>
              <span className="px-2 py-0.5 rounded font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                E Excused
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>Click any symbol cell to toggle status</span>
            {viewMode === 'matrix' && (
              <button
                onClick={handleSetAllPeriodsPresent}
                disabled={!isEditMode && isAlreadyCommitted}
                className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline disabled:opacity-50"
              >
                Mark Entire Day Present (P1–P6)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* STATS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div
          className="p-3.5 rounded-xl border flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <span className="text-[10px] uppercase font-bold text-slate-400">Enrolled Roster</span>
          <span className="text-xl font-extrabold font-mono mt-1" style={{ color: 'var(--color-text)' }}>
            {totalCount} Students
          </span>
          <span className="text-[10px] text-slate-500 mt-1">Section {selectedSection?.name}</span>
        </div>

        <div
          className="p-3.5 rounded-xl border flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <span className="text-[10px] uppercase font-bold text-emerald-600">Present</span>
          <span className="text-xl font-extrabold font-mono text-emerald-600 mt-1">{presentCount}</span>
          <button
            onClick={() => handleSetAll('present')}
            disabled={!isEditMode && isAlreadyCommitted}
            className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 underline text-left mt-1 disabled:opacity-50"
          >
            Mark All Present
          </button>
        </div>

        <div
          className="p-3.5 rounded-xl border flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <span className="text-[10px] uppercase font-bold text-rose-600">Absent</span>
          <span className="text-xl font-extrabold font-mono text-rose-600 mt-1">{absentCount}</span>
          <span className="text-[10px] text-slate-500 mt-1">Requires follow-up</span>
        </div>

        <div
          className="p-3.5 rounded-xl border flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <span className="text-[10px] uppercase font-bold text-amber-600">Late Arrival</span>
          <span className="text-xl font-extrabold font-mono text-amber-600 mt-1">{lateCount}</span>
          <span className="text-[10px] text-slate-500 mt-1">Logged with slip</span>
        </div>

        <div
          className="p-3.5 rounded-xl border flex flex-col justify-between col-span-2 sm:col-span-1"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <span className="text-[10px] uppercase font-bold text-blue-600">Excused</span>
          <span className="text-xl font-extrabold font-mono text-blue-600 mt-1">{excusedCount}</span>
          <span className="text-[10px] text-slate-500 mt-1">Medical / Leave</span>
        </div>
      </div>

      {/* REGISTER DISPLAY: MULTI-PERIOD MATRIX OR SINGLE PERIOD */}
      <div
        className="rounded-2xl border shadow-xs overflow-hidden"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div
          className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
              {viewMode === 'matrix' ? 'Multi-Period Daily Matrix' : 'Period Roll Call Roster'} ({selectedSection?.name})
            </h3>
            {isAlreadyCommitted ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Register Committed
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Draft / Unsaved
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
              }}
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                placeholder="Search student or roll #..."
                className="bg-transparent border-none outline-none text-xs w-44"
                style={{ color: 'var(--color-text)' }}
              />
            </div>
          </div>
        </div>

        {/* 1 ROW PER STUDENT, APPLICABLE PERIODS AS COLUMNS */}
        {viewMode === 'matrix' ? (
          <div className="overflow-x-auto schlar-table-wrapper">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr
                  className="border-b"
                  style={{
                    backgroundColor: 'var(--color-table-header, #f9fafb)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {/* Sticky student identifiers on left */}
                  <th className="py-2.5 px-3 font-semibold text-[10px] uppercase sticky left-0 z-20 w-16 text-center border-r"
                      style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                    Roll #
                  </th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase sticky left-16 z-20 min-w-[160px] border-r shadow-xs"
                      style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                    Student Full Name
                  </th>

                  {/* 6 Periods as Columns */}
                  {TIMETABLE_PERIODS.map((period) => (
                    <th
                      key={period.id}
                      className="py-2 px-3 font-semibold text-[10px] text-center min-w-[110px] border-r"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <div className="font-bold text-xs" style={{ color: 'var(--color-text)' }}>
                        {period.code}
                      </div>
                      <div className="text-[9px] text-slate-500 font-normal">{period.time}</div>
                      <div className="text-[9px] font-semibold text-slate-400 truncate">{period.subject}</div>
                      <button
                        onClick={() => handleSetPeriodAll(period.id, 'present')}
                        disabled={!isEditMode && isAlreadyCommitted}
                        className="mt-1 text-[9px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline disabled:opacity-40"
                      >
                        All ✓
                      </button>
                    </th>
                  ))}

                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase text-center min-w-[100px]">
                    Day Summary
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-500">
                      No students match the search filter.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((st, idx) => {
                    const rollNo = `0${idx + 1}`.slice(-2);
                    const studentPeriods = matrixStatusMap[st.id] || {};
                    const p1 = studentPeriods.p1 || 'present';
                    const p2 = studentPeriods.p2 || 'present';
                    const p3 = studentPeriods.p3 || 'present';
                    const p4 = studentPeriods.p4 || 'present';
                    const p5 = studentPeriods.p5 || 'present';
                    const p6 = studentPeriods.p6 || 'present';

                    const periodList = [p1, p2, p3, p4, p5, p6];
                    const dayPresents = periodList.filter((p) => p === 'present').length;
                    const dayAbsents = periodList.filter((p) => p === 'absent').length;
                    const percentPresent = Math.round((dayPresents / 6) * 100);

                    return (
                      <tr key={st.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                        {/* Sticky Roll Number */}
                        <td
                          className="py-2.5 px-3 font-mono font-medium text-center sticky left-0 z-10 border-r"
                          style={{
                            backgroundColor: 'var(--color-surface)',
                            borderColor: 'var(--color-border)',
                          }}
                        >
                          {rollNo}
                        </td>

                        {/* Sticky Student Name */}
                        <td
                          className="py-2.5 px-4 font-semibold sticky left-16 z-10 border-r shadow-xs"
                          style={{
                            backgroundColor: 'var(--color-surface)',
                            borderColor: 'var(--color-border)',
                            color: 'var(--color-text)',
                          }}
                        >
                          <div className="truncate max-w-[140px]">{st.name}</div>
                          <div className="text-[10px] font-mono text-slate-400 font-normal">
                            {st.admissionNo}
                          </div>
                        </td>

                        {/* Period Columns P1 through P6 with ✓ and X */}
                        {TIMETABLE_PERIODS.map((period) => {
                          const status = studentPeriods[period.id] || 'present';
                          const isPresent = status === 'present';
                          const isAbsent = status === 'absent';
                          const isLate = status === 'late';

                          return (
                            <td
                              key={period.id}
                              className="py-2 px-3 text-center border-r"
                              style={{ borderColor: 'var(--color-border)' }}
                            >
                              <button
                                onClick={() => handleToggleMatrixCell(st.id, period.id)}
                                aria-label={`${st.name} ${period.code}: currently ${status}. Click to toggle.`}
                                className={`w-9 h-9 mx-auto rounded-lg font-extrabold text-sm flex items-center justify-center transition-all ${
                                  isPresent
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                                    : isAbsent
                                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 hover:bg-rose-100'
                                    : isLate
                                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-100'
                                    : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800 hover:bg-blue-100'
                                }`}
                              >
                                {isPresent ? '✓' : isAbsent ? 'X' : isLate ? '⏱' : 'E'}
                              </button>
                            </td>
                          );
                        })}

                        {/* Day Summary Column */}
                        <td className="py-2.5 px-4 text-center">
                          <span
                            className={`inline-block font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                              dayAbsents === 0
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                                : dayPresents >= 4
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                            }`}
                          >
                            {dayPresents}/6 ({percentPresent}%)
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* SINGLE PERIOD ROLL CALL VIEW */
          <div className="overflow-x-auto schlar-table-wrapper">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr
                  className="border-b"
                  style={{
                    backgroundColor: 'var(--color-table-header, #f9fafb)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Roll #</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Admission ID</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Student Full Name</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Gender</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase text-right">Attendance Mark</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No students match the search filter.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((st, idx) => {
                    const currentStatus = studentStatusMap[st.id] || 'present';
                    const rollNo = `0${idx + 1}`.slice(-2);
                    return (
                      <tr key={st.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                        <td className="py-2.5 px-4 font-mono font-medium">{rollNo}</td>
                        <td className="py-2.5 px-4 font-mono text-slate-500 text-[11px]">{st.admissionNo}</td>
                        <td className="py-2.5 px-4 font-semibold" style={{ color: 'var(--color-text)' }}>
                          {st.name}
                        </td>
                        <td className="py-2.5 px-4 text-slate-500 capitalize">{st.gender}</td>
                        <td className="py-2.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1 p-0.5 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                            {(['present', 'late', 'absent', 'excused'] as const).map((status) => {
                              const isSelected = currentStatus === status;
                              return (
                                <button
                                  key={status}
                                  onClick={() => handleUpdateStudent(st.id, status)}
                                  className={`px-2.5 py-1 text-[11px] font-bold rounded-md capitalize transition-all ${
                                    isSelected
                                      ? status === 'present'
                                        ? 'bg-emerald-600 text-white shadow-xs'
                                        : status === 'late'
                                        ? 'bg-amber-600 text-white shadow-xs'
                                        : status === 'absent'
                                        ? 'bg-rose-600 text-white shadow-xs'
                                        : 'bg-blue-600 text-white shadow-xs'
                                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                  }`}
                                >
                                  {status === 'present'
                                    ? '✓ Present'
                                    : status === 'absent'
                                    ? 'X Absent'
                                    : status === 'late'
                                    ? '⏱ Late'
                                    : 'Excused'}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* AUDIT HISTORY & AUDIT TRAIL */}
      <div
        className="p-4 rounded-2xl border"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <History className="w-4 h-4 text-slate-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text)' }}>
            Register Audit & Submission Log
          </h4>
        </div>
        <div className="space-y-2">
          {auditHistory.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-500">
              <span className="font-mono text-[11px] text-slate-400 shrink-0">{item.timestamp}</span>
              <span>·</span>
              <span>{item.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* EDIT REASON MODAL FOR CONTROLLED CORRECTION */}
      {editReasonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-md p-6 rounded-2xl border shadow-xl"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="w-5 h-5" />
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  Reason for Attendance Correction
                </h3>
              </div>
              <button
                onClick={() => setEditReasonModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              This attendance register was already officially committed. Institutional policy requires an explanatory note before committing amendments to the permanent register.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Correction Reason / Justification
                </label>
                <textarea
                  rows={3}
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  placeholder="e.g. Student arrived 15 mins late with nurse slip; updated from Absent to Late."
                  className="w-full p-2.5 text-xs rounded-lg border outline-none"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditReasonModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg border"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => commitAttendance(editReason || 'Correction recorded by teacher')}
                  disabled={!editReason.trim()}
                  className="px-4 py-2 text-xs font-semibold text-white rounded-lg disabled:opacity-50"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  Commit Correction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
