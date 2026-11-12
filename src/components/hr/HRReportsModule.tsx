import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  INITIAL_HR_DEPARTMENTS,
  INITIAL_STAFF_ATTENDANCE,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_JOB_CANDIDATES,
} from '../../data/initialHRData';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Users,
  CheckSquare,
  CalendarClock,
  Briefcase,
  Building2,
} from 'lucide-react';

export const HRReportsModule: React.FC = () => {
  const { staff } = useSchoolData();
  const [reportType, setReportType] = useState<'headcount' | 'attendance' | 'leave' | 'recruitment'>('headcount');

  const handleExportCSV = () => {
    let csvData = '';
    if (reportType === 'headcount') {
      csvData =
        'Employee ID,Name,Department,Designation,Status,Join Date\n' +
        staff.map((s) => `${s.staffId},${s.name},${s.department},${s.designation},${s.status},${s.joinDate}`).join('\n');
    } else if (reportType === 'attendance') {
      csvData =
        'Date,Staff ID,Staff Name,Department,Status,Check-In,Check-Out\n' +
        INITIAL_STAFF_ATTENDANCE.map(
          (a) => `${a.date},${a.staffId},${a.staffName},${a.department},${a.status},${a.checkInTime || ''},${a.checkOutTime || ''}`
        ).join('\n');
    } else if (reportType === 'leave') {
      csvData =
        'Staff Name,Department,Leave Type,Start Date,End Date,Days,Status,Reason\n' +
        INITIAL_LEAVE_REQUESTS.map(
          (l) => `${l.staffName},${l.departmentName},${l.leaveType},${l.startDate},${l.endDate},${l.totalDays},${l.status},"${l.reason}"`
        ).join('\n');
    } else {
      csvData =
        'Candidate ID,Name,Applied Role,Stage,Interview Date,Rating\n' +
        INITIAL_JOB_CANDIDATES.map(
          (c) => `${c.id},${c.name},${c.appliedRole},${c.stage},${c.interviewDate || ''},${c.rating}/5`
        ).join('\n');
    }

    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvData);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hr_report_${reportType}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded tracking-wide uppercase border text-teal-700 bg-teal-50 dark:bg-teal-950/30"
              style={{ borderColor: 'var(--color-border)' }}
            >
              Statutory Human Resources
            </span>
            <span className="text-xs text-slate-400">Institutional Auditing Reports</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            HR Reports
          </h1>
          <p className="text-sm mt-1 max-w-2xl text-slate-500">
            Generate formal faculty headcount registries, attendance audit summaries, leave utilization rosters, and recruitment metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium hover:opacity-85 shadow-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div
        className="p-4 rounded-xl border shadow-xs space-y-3"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'headcount', label: 'Faculty Headcount Report', icon: Users },
            { id: 'attendance', label: 'Attendance Audit Register', icon: CheckSquare },
            { id: 'leave', label: 'Leave Utilization Statement', icon: CalendarClock },
            { id: 'recruitment', label: 'Recruitment Pipeline Report', icon: Briefcase },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setReportType(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  reportType === tab.id
                    ? 'font-bold shadow-xs text-white'
                    : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-70'
                }`}
                style={{
                  backgroundColor: reportType === tab.id ? 'var(--color-primary)' : 'transparent',
                  color: reportType === tab.id ? '#ffffff' : 'var(--color-text)',
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Report Table */}
      <div
        className="rounded-xl border shadow-xs overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
          <h3 className="text-sm font-bold capitalize" style={{ color: 'var(--color-text)' }}>
            {reportType} Report Output
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Generated: {new Date().toLocaleDateString()} · Certified Institutional Export
          </span>
        </div>

        {reportType === 'headcount' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Employee ID</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Full Name</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Department</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Designation</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Join Date</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {staff.map((s) => (
                  <tr key={s.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-mono font-bold" style={{ color: 'var(--color-primary)' }}>
                      {s.staffId}
                    </td>
                    <td className="py-3 px-4 font-bold" style={{ color: 'var(--color-text)' }}>
                      {s.name}
                    </td>
                    <td className="py-3 px-4">{s.department}</td>
                    <td className="py-3 px-4 text-slate-500">{s.designation}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{s.joinDate || '2018-08-15'}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold capitalize bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'attendance' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Date</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Staff Member</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Department</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Check-In</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Check-Out</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {INITIAL_STAFF_ATTENDANCE.map((a) => (
                  <tr key={a.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-mono text-[11px]">{a.date}</td>
                    <td className="py-3 px-4 font-bold" style={{ color: 'var(--color-text)' }}>
                      {a.staffName}
                    </td>
                    <td className="py-3 px-4">{a.department}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{a.checkInTime || '—'}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{a.checkOutTime || '—'}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold capitalize bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'leave' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Staff Member</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Leave Type</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Period</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Days</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Reason</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {INITIAL_LEAVE_REQUESTS.map((l) => (
                  <tr key={l.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-bold" style={{ color: 'var(--color-text)' }}>
                      {l.staffName}
                    </td>
                    <td className="py-3 px-4 font-semibold">{l.leaveType}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{l.startDate} to {l.endDate}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold">{l.totalDays}</td>
                    <td className="py-3 px-4 text-slate-500">{l.reason}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'recruitment' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Candidate</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Target Vacancy</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Current Pipeline Stage</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Interview Schedule</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {INITIAL_JOB_CANDIDATES.map((c) => (
                  <tr key={c.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-bold" style={{ color: 'var(--color-text)' }}>
                      {c.name}
                    </td>
                    <td className="py-3 px-4 font-medium">{c.appliedRole}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/5 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                        {c.stage}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{c.interviewDate || 'Not scheduled'}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-amber-500">{c.rating} / 5</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
