import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  INITIAL_HR_DEPARTMENTS,
  INITIAL_STAFF_ATTENDANCE,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_JOB_OPENINGS,
  INITIAL_JOB_CANDIDATES,
} from '../../data/initialHRData';
import {
  Users,
  UserCheck,
  CheckSquare,
  CalendarClock,
  Briefcase,
  UserPlus,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Building2,
  Clock,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface HRDashboardOverviewProps {
  onNavigateTab: (tabId: string) => void;
}

export const HRDashboardOverview: React.FC<HRDashboardOverviewProps> = ({ onNavigateTab }) => {
  const { staff } = useSchoolData();

  // Metrics
  const activeStaff = staff.filter((s) => s.status === 'active');
  const teachingStaff = staff.filter((s) => s.assignedSubjects && s.assignedSubjects.length > 0);
  const supportStaffCount = Math.max(0, staff.length - teachingStaff.length);
  const onLeaveToday = INITIAL_STAFF_ATTENDANCE.filter((a) => a.status === 'on_leave').length;
  const pendingLeaves = INITIAL_LEAVE_REQUESTS.filter((l) => l.status === 'Pending').length;
  const activeJobOpenings = INITIAL_JOB_OPENINGS.filter((j) => j.status === 'Open' || j.status === 'Interviewing').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded tracking-wide uppercase border text-teal-700 bg-teal-50 dark:bg-teal-950/30"
              style={{ borderColor: 'var(--color-border)' }}
            >
              Faculty & Staff Administration
            </span>
            <span className="text-xs text-slate-400">Campus Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            HR / Staff Manager Dashboard
          </h1>
          <p className="text-sm mt-1 max-w-2xl text-slate-500">
            Real-time human resources pulse: active headcount, faculty presence, open hiring requisitions, and pending leave queue.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('hr-add-staff')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Staff Member</span>
          </button>

          <button
            onClick={() => onNavigateTab('staff-attendance')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium hover:opacity-85 shadow-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Today's Attendance</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('staff-directory')}
          className="p-4 rounded-xl border shadow-xs cursor-pointer hover:border-primary transition-all"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Total Active Staff</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="my-1.5">
            <span className="text-2xl font-extrabold tracking-tight font-mono tabular-nums" style={{ color: 'var(--color-text)' }}>
              {activeStaff.length || 24}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>{teachingStaff.length} Faculty · {supportStaffCount} Support</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('staff-attendance')}
          className="p-4 rounded-xl border shadow-xs cursor-pointer hover:border-primary transition-all"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Staff On Leave Today</span>
            <CalendarClock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="my-1.5">
            <span className="text-2xl font-extrabold tracking-tight font-mono tabular-nums text-amber-600">
              {onLeaveToday}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Substitutes allocated</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('leave-management')}
          className="p-4 rounded-xl border shadow-xs cursor-pointer hover:border-primary transition-all"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Pending Leave Requests</span>
            <AlertCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="my-1.5">
            <span className="text-2xl font-extrabold tracking-tight font-mono tabular-nums text-rose-600">
              {pendingLeaves}
            </span>
          </div>
          <div className="text-[11px] text-rose-600 font-semibold flex items-center justify-between">
            <span>Awaiting review</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('folder-recruitment')}
          className="p-4 rounded-xl border shadow-xs cursor-pointer hover:border-primary transition-all"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Active Job Openings</span>
            <Briefcase className="w-4 h-4 text-slate-400" />
          </div>
          <div className="my-1.5">
            <span className="text-2xl font-extrabold tracking-tight font-mono tabular-nums" style={{ color: 'var(--color-primary)' }}>
              {activeJobOpenings}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>{INITIAL_JOB_CANDIDATES.length} candidates in pipeline</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Approvals & Department Strengths */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Leave Requests Queue */}
        <div
          className="p-5 rounded-xl border shadow-xs flex flex-col justify-between"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Pending Leave Requests Queue</span>
              </h3>
              <button
                onClick={() => onNavigateTab('leave-management')}
                className="text-xs font-semibold hover:underline flex items-center gap-1"
                style={{ color: 'var(--color-primary)' }}
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {INITIAL_LEAVE_REQUESTS.filter((l) => l.status === 'Pending').map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-lg border bg-black/[0.01] dark:bg-white/[0.01] flex items-start justify-between gap-3 text-xs"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <div>
                    <div className="font-bold" style={{ color: 'var(--color-text)' }}>
                      {req.staffName}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {req.departmentName} · {req.leaveType}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 italic">
                      "{req.reason}"
                    </p>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {req.startDate} to {req.endDate} ({req.totalDays} days)
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigateTab('leave-management')}
                    className="px-2.5 py-1 rounded text-[11px] font-semibold text-white shrink-0 shadow-xs"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Headcount Breakdown */}
        <div
          className="p-5 rounded-xl border shadow-xs"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center justify-between pb-3 mb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>Department Headcount Strength</span>
            </h3>
            <button
              onClick={() => onNavigateTab('hr-departments')}
              className="text-xs font-semibold hover:underline flex items-center gap-1"
              style={{ color: 'var(--color-primary)' }}
            >
              <span>Manage</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {INITIAL_HR_DEPARTMENTS.slice(0, 5).map((dept) => (
              <div key={dept.id} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold" style={{ color: 'var(--color-text)' }}>
                    {dept.name}
                  </span>
                  <span className="font-mono font-bold text-slate-500">
                    {dept.staffCount} Staff
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(dept.staffCount / 10) * 100}%`,
                      backgroundColor: 'var(--color-primary)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
