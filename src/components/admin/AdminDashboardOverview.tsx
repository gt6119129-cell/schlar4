import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { usePermissions } from '../../context/PermissionContext';
import {
  Users,
  UserCheck,
  Building2,
  CalendarCheck2,
  Inbox,
  Receipt,
  ArrowRight,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  FileText,
  CalendarDays,
  Shield,
  Layers,
  ChevronRight,
  Lock,
} from 'lucide-react';

interface AdminDashboardOverviewProps {
  onNavigateTab: (tabId: string) => void;
  onOpenAddStudent: () => void;
  onOpenAddStaff: () => void;
  onOpenAddClass: () => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  onNavigateTab,
  onOpenAddStudent,
  onOpenAddStaff,
  onOpenAddClass,
}) => {
  const {
    students,
    staff,
    classes,
    sections,
    attendance,
    admissions,
    feesSummary,
    schoolProfile,
  } = useSchoolData();

  const { hasPermission } = usePermissions();

  // 1. Calculate realistic live metrics derived from shared state
  const activeStudentsCount = students.filter((s) => s.enrollmentStatus === 'active').length;
  const activeStaffCount = staff.filter((s) => s.status === 'active').length;
  const activeClassesCount = classes.filter((c) => c.status === 'active').length;
  const activeSectionsCount = sections.filter((s) => s.status === 'active').length;

  // Attendance metrics for today (2026-10-19)
  const todayDate = '2026-10-19';
  const todayAttendance = attendance.filter((a) => a.date === todayDate);
  const totalMarkedToday = todayAttendance.length;
  const presentCount = todayAttendance.filter((a) => a.status === 'present').length;
  const lateCount = todayAttendance.filter((a) => a.status === 'late').length;
  const absentCount = todayAttendance.filter((a) => a.status === 'absent').length;
  const attendanceRate = totalMarkedToday > 0 ? Math.round(((presentCount + lateCount) / totalMarkedToday) * 100) : 0;

  // Admissions metrics
  const pendingAdmissions = admissions.filter((a) => a.status !== 'Enrolled' && a.status !== 'Rejected');
  const acceptedAdmissions = admissions.filter((a) => a.status === 'Accepted');

  // Permissions checks
  const canViewFees = hasPermission('fees.view');
  const canManageStudents = hasPermission('students.create');
  const canManageStaff = hasPermission('staff.manage');
  const canManageTimetable = hasPermission('timetable.create');
  const canViewAttendance = hasPermission('attendance.view');
  const canManageAdmissions = hasPermission('admissions.manage');

  // Dismissible administrative notices state
  const [notices, setNotices] = useState([
    {
      id: 'n-1',
      priority: 'high',
      title: 'Term 1 Mid-Term Examination Scheduling',
      description: 'Exam Coordinator needs syllabus completion sign-off from Science & Humanities heads.',
      date: 'Today, 08:30 AM',
      targetTab: 'timetable',
    },
    {
      id: 'n-2',
      priority: 'medium',
      title: 'Quarterly State Board Audit Preparation',
      description: 'Statutory attendance registers and teacher credential folders ready for inspection.',
      date: 'Yesterday',
      targetTab: 'reports',
    },
    {
      id: 'n-3',
      priority: 'info',
      title: 'Grade 10 Lab 3 STEM Wing Upgrades',
      description: 'Physics and Chemistry wet lab equipment calibration scheduled for Saturday morning.',
      date: 'Oct 17, 2026',
      targetTab: 'classes-sections',
    },
  ]);

  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const toggleTask = (id: string) => {
    setCompletedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Institutional Header Banner */}
      <div
        className="p-6 rounded-2xl border transition-colors shadow-xs relative overflow-hidden"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-primary)',
                }}
              >
                {schoolProfile.currentAcademicYear}
              </span>
              <span className="text-xs text-slate-400 font-medium">·</span>
              <span className="text-xs font-medium text-slate-500">{schoolProfile.currentTerm}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
              {schoolProfile.name}
            </h1>
            <p className="text-xs sm:text-sm mt-1 text-slate-500 max-w-2xl leading-relaxed">
              Institutional Governance Dashboard · Principal: {schoolProfile.principalName} · Affiliation: {schoolProfile.affiliationNo}
            </p>
          </div>

          {/* Quick Info Pill */}
          <div
            className="flex items-center gap-3 p-3 rounded-xl border text-xs self-start md:self-auto"
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div>
              <div className="font-bold text-[11px]" style={{ color: 'var(--color-text)' }}>
                Campus Operations Active
              </div>
              <div className="text-[10px] text-slate-400">Timezone: {schoolProfile.timezone}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SIX EXECUTIVE SUMMARY CARDS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Institutional Health & Overview Metrics
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">Live Demo Data</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {/* 1. Students Card */}
          <button
            onClick={() => onNavigateTab('students-guardians')}
            className="p-4 rounded-xl border text-left transition-all hover:shadow-md hover:-translate-y-0.5 group cursor-pointer"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">Active Students</span>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors group-hover:scale-105"
                style={{ backgroundColor: 'var(--color-background)' }}
              >
                <Users className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
              </div>
            </div>
            <div className="text-2xl font-extrabold font-mono tabular-nums" style={{ color: 'var(--color-text)' }}>
              {activeStudentsCount}
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t text-[11px]" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-slate-400 font-medium">Enrolled Roster</span>
              <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* 2. Staff Card */}
          <button
            onClick={() => onNavigateTab('staff-directory')}
            className="p-4 rounded-xl border text-left transition-all hover:shadow-md hover:-translate-y-0.5 group cursor-pointer"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">Active Staff</span>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors group-hover:scale-105"
                style={{ backgroundColor: 'var(--color-background)' }}
              >
                <UserCheck className="w-3.5 h-3.5" style={{ color: 'var(--color-secondary)' }} />
              </div>
            </div>
            <div className="text-2xl font-extrabold font-mono tabular-nums" style={{ color: 'var(--color-text)' }}>
              {activeStaffCount}
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t text-[11px]" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-slate-400 font-medium">Faculty & Admin</span>
              <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* 3. Classes & Sections Card */}
          <button
            onClick={() => onNavigateTab('classes-sections')}
            className="p-4 rounded-xl border text-left transition-all hover:shadow-md hover:-translate-y-0.5 group cursor-pointer"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">Classes & Secs</span>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors group-hover:scale-105"
                style={{ backgroundColor: 'var(--color-background)' }}
              >
                <Building2 className="w-3.5 h-3.5" style={{ color: 'var(--color-accent)' }} />
              </div>
            </div>
            <div className="text-2xl font-extrabold font-mono tabular-nums" style={{ color: 'var(--color-text)' }}>
              {activeClassesCount} / {activeSectionsCount}
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t text-[11px]" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-slate-400 font-medium">Active Cohorts</span>
              <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* 4. Today's Attendance Card */}
          <button
            onClick={() => onNavigateTab('attendance')}
            className="p-4 rounded-xl border text-left transition-all hover:shadow-md hover:-translate-y-0.5 group cursor-pointer"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">Today Attendance</span>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors group-hover:scale-105"
                style={{ backgroundColor: 'var(--color-background)' }}
              >
                <CalendarCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>
            <div className="text-2xl font-extrabold font-mono tabular-nums" style={{ color: 'var(--color-text)' }}>
              {attendanceRate}%
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t text-[11px]" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-emerald-600 font-semibold">{presentCount} Present · {lateCount} Late</span>
              <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* 5. Pending Admissions Card */}
          <button
            onClick={() => onNavigateTab('admissions')}
            className="p-4 rounded-xl border text-left transition-all hover:shadow-md hover:-translate-y-0.5 group cursor-pointer"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">Admissions Pipeline</span>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors group-hover:scale-105"
                style={{ backgroundColor: 'var(--color-background)' }}
              >
                <Inbox className="w-3.5 h-3.5 text-amber-600" />
              </div>
            </div>
            <div className="text-2xl font-extrabold font-mono tabular-nums" style={{ color: 'var(--color-text)' }}>
              {pendingAdmissions.length}
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t text-[11px]" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-amber-600 font-semibold">{acceptedAdmissions.length} Ready to Enroll</span>
              <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* 6. Outstanding Fees (Permission Protected) */}
          {canViewFees ? (
            <button
              onClick={() => onNavigateTab('fees-overview')}
              className="p-4 rounded-xl border text-left transition-all hover:shadow-md hover:-translate-y-0.5 group cursor-pointer"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500">Outstanding Fees</span>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors group-hover:scale-105"
                  style={{ backgroundColor: 'var(--color-background)' }}
                >
                  <Receipt className="w-3.5 h-3.5 text-sky-600" />
                </div>
              </div>
              <div className="text-2xl font-extrabold font-mono tabular-nums" style={{ color: 'var(--color-text)' }}>
                ${(feesSummary.outstandingTotal / 1000).toFixed(1)}k
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t text-[11px]" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-slate-400 font-medium">Rate: {feesSummary.collectionRate}%</span>
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ) : (
            <div
              className="p-4 rounded-xl border opacity-60 text-left"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
              title="Requires fees.view permission"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400">Fees Overview</span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-lg font-bold text-slate-400 mt-2">Restricted</div>
              <div className="mt-2 pt-2 border-t text-[10px] text-slate-400" style={{ borderColor: 'var(--color-border)' }}>
                Access requires financial role
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. QUICK ACTIONS BAR */}
      <div
        className="p-4 rounded-xl border transition-colors shadow-xs"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Authorized Quick Actions
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {canManageStudents && (
            <button
              onClick={onOpenAddStudent}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white rounded-lg shadow-xs hover:opacity-95 transition-opacity"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Student</span>
            </button>
          )}

          {canManageStaff && (
            <button
              onClick={onOpenAddStaff}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              <Plus className="w-3.5 h-3.5 text-slate-400" />
              <span>Add Staff Member</span>
            </button>
          )}

          <button
            onClick={onOpenAddClass}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Create Class or Section</span>
          </button>

          {canManageTimetable && (
            <button
              onClick={() => onNavigateTab('timetable')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
              <span>Manage Timetable</span>
            </button>
          )}

          {canViewAttendance && (
            <button
              onClick={() => onNavigateTab('attendance')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              <CalendarCheck2 className="w-3.5 h-3.5 text-slate-400" />
              <span>View Attendance</span>
            </button>
          )}

          {canManageAdmissions && (
            <button
              onClick={() => onNavigateTab('admissions')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              <Inbox className="w-3.5 h-3.5 text-slate-400" />
              <span>Review Admissions</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. TWO-COLUMN OPERATIONAL SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Class Status & Recent Admissions Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Class & Section Roster Overview */}
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
                  Active Academic Cohorts & Class Teachers
                </h3>
                <p className="text-xs text-slate-500">Live section capacities and assigned faculty leaders</p>
              </div>
              <button
                onClick={() => onNavigateTab('classes-sections')}
                className="text-xs font-semibold flex items-center gap-1 hover:underline"
                style={{ color: 'var(--color-primary)' }}
              >
                <span>All Classes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
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
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Class & Section</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Class Teacher</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Room</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Enrolled / Cap</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                  {sections.slice(0, 5).map((sec) => {
                    const enrolledInSec = students.filter(
                      (st) => st.sectionId === sec.id && st.enrollmentStatus === 'active'
                    ).length;
                    const percentCap = Math.round((enrolledInSec / sec.capacity) * 100);

                    return (
                      <tr key={sec.id} className="hover:bg-black/[0.015] dark:hover:bg-white/[0.015] transition-colors">
                        <td className="py-3 px-4 font-semibold" style={{ color: 'var(--color-text)' }}>
                          {sec.className} · {sec.name}
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-medium">
                          {sec.classTeacherName || <span className="text-amber-600 italic">Unassigned</span>}
                        </td>
                        <td className="py-3 px-4 text-slate-400">{sec.room}</td>
                        <td className="py-3 px-4 font-mono">
                          <span className="font-bold" style={{ color: 'var(--color-text)' }}>
                            {enrolledInSec}
                          </span>
                          <span className="text-slate-400 text-[11px]"> / {sec.capacity}</span>
                          <span className="text-[10px] ml-1.5 text-slate-400">({percentCap}%)</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            Active
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Admissions Pipeline Activity */}
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
                  Recent Admissions Enquiries & Conversions
                </h3>
                <p className="text-xs text-slate-500">Prospective student applications awaiting action</p>
              </div>
              <button
                onClick={() => onNavigateTab('admissions')}
                className="text-xs font-semibold flex items-center gap-1 hover:underline"
                style={{ color: 'var(--color-primary)' }}
              >
                <span>Open Admissions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {admissions.slice(0, 4).map((enq) => (
                <div key={enq.id} className="p-4 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                        {enq.applicantName}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">({enq.enquiryNo})</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          enq.status === 'Accepted'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                            : enq.status === 'Under Review'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                            : enq.status === 'Enrolled'
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Target: <strong style={{ color: 'var(--color-text)' }}>{enq.intendedClassName}</strong> · Guardian: {enq.guardianName} ({enq.guardianPhone})
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {enq.status === 'Accepted' && (
                      <button
                        onClick={() => onNavigateTab('admissions')}
                        className="px-2.5 py-1 text-[11px] font-bold text-white rounded shadow-xs"
                        style={{ backgroundColor: 'var(--color-accent)' }}
                      >
                        Convert to Student
                      </button>
                    )}
                    <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                      {enq.enquiryDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Important Notices & Pending Administrative Tasks */}
        <div className="space-y-6">
          {/* Important Notices */}
          <div
            className="p-5 rounded-xl border shadow-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                  Administrative Notices
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">{notices.length} Active</span>
            </div>

            <div className="space-y-3">
              {notices.map((n) => (
                <div
                  key={n.id}
                  onClick={() => onNavigateTab(n.targetTab)}
                  className="p-3 rounded-lg border text-xs cursor-pointer hover:opacity-90 transition-opacity"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold truncate" style={{ color: 'var(--color-text)' }}>
                      {n.title}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded shrink-0 ${
                        n.priority === 'high'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {n.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">
                    {n.description}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                    <span>{n.date}</span>
                    <span className="font-medium flex items-center gap-0.5" style={{ color: 'var(--color-primary)' }}>
                      View <ChevronRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Tasks Checklist */}
          <div
            className="p-5 rounded-xl border shadow-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                  Action Ledger & Tasks
                </h3>
              </div>
              <span className="text-[10px] text-slate-400">Self-Service</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                { id: 't-1', text: 'Approve Grade 8-A curriculum pacing adjustment' },
                { id: 't-2', text: 'Sign off today’s primary wing attendance log' },
                { id: 't-3', text: 'Review Oliver Martinez enrollment conversion' },
                { id: 't-4', text: 'Publish Term 1 timetable updates for Grade 10-A' },
              ].map((task) => {
                const done = !!completedTasks[task.id];
                return (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-black/[0.02] dark:hover:bg-white/[0.02] cursor-pointer transition-colors"
                  >
                    <div
                      className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center transition-colors ${
                        done ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-400'
                      }`}
                    >
                      {done && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-xs leading-snug ${
                        done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {task.text}
                    </span>
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
