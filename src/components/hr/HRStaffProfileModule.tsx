import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  INITIAL_STAFF_ATTENDANCE,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_STAFF_DOCUMENTS,
  INITIAL_LEAVE_BALANCES,
} from '../../data/initialHRData';
import { StaffMember } from '../../types/school';
import {
  User,
  Building2,
  Mail,
  Phone,
  Calendar,
  Award,
  BookOpen,
  CheckSquare,
  CalendarClock,
  FileText,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Edit3,
  Save,
} from 'lucide-react';

interface HRStaffProfileModuleProps {
  initialStaffId?: string;
  onBackToDirectory?: () => void;
}

export const HRStaffProfileModule: React.FC<HRStaffProfileModuleProps> = ({
  initialStaffId,
  onBackToDirectory,
}) => {
  const { staff } = useSchoolData();
  const [selectedStaffId, setSelectedStaffId] = useState<string>(
    initialStaffId || staff[0]?.id || 'staff-henderson'
  );
  const [activeTab, setActiveTab] = useState<
    'overview' | 'employment' | 'assignments' | 'attendance' | 'leave' | 'documents'
  >('overview');

  const currentStaff = staff.find((s) => s.id === selectedStaffId) || staff[0];

  // Specific data for this staff member
  const attendanceRecords = INITIAL_STAFF_ATTENDANCE.filter((a) => a.staffId === currentStaff.id);
  const leaveHistory = INITIAL_LEAVE_REQUESTS.filter((l) => l.staffId === currentStaff.id);
  const documents = INITIAL_STAFF_DOCUMENTS.filter((d) => d.staffId === currentStaff.id);
  const leaveBalance = INITIAL_LEAVE_BALANCES.find((b) => b.staffId === currentStaff.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Back Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-3">
          {onBackToDirectory && (
            <button
              onClick={onBackToDirectory}
              className="p-2 rounded-lg border hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              style={{ borderColor: 'var(--color-border)' }}
              title="Return to Staff Directory"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded tracking-wide uppercase border text-teal-700 bg-teal-50 dark:bg-teal-950/30"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Employee Dossier
              </span>
              <span className="text-xs text-slate-400 font-mono">{currentStaff.staffId}</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
              {currentStaff.name}
            </h1>
          </div>
        </div>

        {/* Staff Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Select Personnel:</span>
          <select
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            className="px-3 py-1.5 rounded-lg border text-xs outline-hidden font-semibold"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.designation})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Profile Dossier Tabs */}
      <div className="flex border-b text-xs font-medium overflow-x-auto" style={{ borderColor: 'var(--color-border)' }}>
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'employment', label: 'Employment & Credentials' },
          { id: 'assignments', label: 'Teaching Assignments' },
          { id: 'attendance', label: 'Attendance Ledger' },
          { id: 'leave', label: 'Leave History & Quotas' },
          { id: 'documents', label: 'Documents & Verification' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 border-b-2 font-bold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-primary'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
            style={{
              borderColor: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
              color: activeTab === tab.id ? 'var(--color-primary)' : undefined,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="p-5 rounded-xl border shadow-xs space-y-4"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="text-center pb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div
                className="w-20 h-20 rounded-full mx-auto flex items-center justify-center font-bold text-xl text-white mb-3"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {currentStaff.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <h3 className="font-bold text-base" style={{ color: 'var(--color-text)' }}>
                {currentStaff.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{currentStaff.designation}</p>
              <span className="inline-block px-2.5 py-0.5 mt-2 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                {currentStaff.status}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-500">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Department: <strong>{currentStaff.department}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{currentStaff.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{currentStaff.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Joined Campus: <strong>{currentStaff.joinDate || '2018-08-15'}</strong></span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div
              className="p-5 rounded-xl border shadow-xs space-y-3"
              style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <h4 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                Professional Role Snapshot
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Appointed as senior academic personnel in the {currentStaff.department} department. Leads curriculum delivery, student assessment oversight, and departmental peer review meetings.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t text-xs" style={{ borderColor: 'var(--color-border)' }}>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Assigned Subjects</span>
                  <div className="font-bold mt-1 text-slate-800 dark:text-slate-200">
                    {currentStaff.assignedSubjects?.join(', ') || 'General Faculty'}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Active Sections</span>
                  <div className="font-bold mt-1 text-slate-800 dark:text-slate-200">
                    {currentStaff.assignedSections?.length || 3} Classes
                  </div>
                </div>
              </div>
            </div>

            {/* Leave Balance Quick Card */}
            {leaveBalance && (
              <div
                className="p-5 rounded-xl border shadow-xs space-y-3"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              >
                <h4 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                  Current Leave Quota Balances
                </h4>
                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="p-3 rounded-lg border bg-black/[0.01] dark:bg-white/[0.01]" style={{ borderColor: 'var(--color-border)' }}>
                    <span className="text-slate-400 text-[10px]">Casual Leave</span>
                    <div className="text-lg font-mono font-bold mt-1 text-emerald-600">
                      {leaveBalance.casualRemaining} / {leaveBalance.casualTotal}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border bg-black/[0.01] dark:bg-white/[0.01]" style={{ borderColor: 'var(--color-border)' }}>
                    <span className="text-slate-400 text-[10px]">Sick Leave</span>
                    <div className="text-lg font-mono font-bold mt-1 text-emerald-600">
                      {leaveBalance.sickRemaining} / {leaveBalance.sickTotal}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border bg-black/[0.01] dark:bg-white/[0.01]" style={{ borderColor: 'var(--color-border)' }}>
                    <span className="text-slate-400 text-[10px]">Privilege Leave</span>
                    <div className="text-lg font-mono font-bold mt-1 text-emerald-600">
                      {leaveBalance.privilegeRemaining} / {leaveBalance.privilegeTotal}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Employment */}
      {activeTab === 'employment' && (
        <div
          className="p-6 rounded-xl border shadow-xs space-y-4 max-w-3xl"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <h3 className="text-sm font-bold pb-2 border-b" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
            Employment Record & Professional Qualifications
          </h3>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Employee ID</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{currentStaff.staffId}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Appointment Category</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Full-Time Permanent</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Primary Department</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{currentStaff.department}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Official Designation</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{currentStaff.designation}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Campus Joining Date</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{currentStaff.joinDate || '2018-08-15'}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Background Verification Status</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Cleared & Verified
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Teaching Assignments */}
      {activeTab === 'assignments' && (
        <div
          className="p-6 rounded-xl border shadow-xs space-y-4"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <h3 className="text-sm font-bold pb-2 border-b" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
            Teaching Workload & Subject Allocations
          </h3>

          <div className="space-y-3">
            {currentStaff.assignedSubjects?.map((subj, idx) => (
              <div key={idx} className="p-3.5 rounded-lg border flex items-center justify-between text-xs" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="font-bold" style={{ color: 'var(--color-text)' }}>{subj}</div>
                    <div className="text-[11px] text-slate-400">Department of {currentStaff.department}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-xs" style={{ color: 'var(--color-primary)' }}>
                    5 Periods / Week
                  </span>
                  <div className="text-[10px] text-slate-400">Grade 10 · Section A</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Attendance */}
      {activeTab === 'attendance' && (
        <div
          className="rounded-xl border shadow-xs overflow-hidden"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Date</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Check-In</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Check-Out</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Session</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {attendanceRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400">
                    Standard attendance record present for active academic session.
                  </td>
                </tr>
              ) : (
                attendanceRecords.map((att) => (
                  <tr key={att.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-mono font-semibold">{att.date}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{att.checkInTime || '—'}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{att.checkOutTime || '—'}</td>
                    <td className="py-3 px-4">{att.session}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                        att.status === 'present' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}>
                        {att.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 5: Leave */}
      {activeTab === 'leave' && (
        <div
          className="rounded-xl border shadow-xs overflow-hidden"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Leave Type</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Duration</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Days</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Reason</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {leaveHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400">
                    No past leave requests logged for this staff member.
                  </td>
                </tr>
              ) : (
                leaveHistory.map((l) => (
                  <tr key={l.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-bold">{l.leaveType}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{l.startDate} to {l.endDate}</td>
                    <td className="py-3 px-4 font-mono font-bold">{l.totalDays}</td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs">{l.reason}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        l.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 6: Documents */}
      {activeTab === 'documents' && (
        <div
          className="p-6 rounded-xl border shadow-xs space-y-4"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <h3 className="text-sm font-bold pb-2 border-b" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
            Verified Documentation & State Credentials
          </h3>

          <div className="space-y-3">
            {documents.length === 0 ? (
              <div className="p-4 rounded-lg border text-center text-slate-400 text-xs">
                Credentials verified during institutional onboarding.
              </div>
            ) : (
              documents.map((doc) => (
                <div key={doc.id} className="p-3.5 rounded-lg border flex items-center justify-between text-xs" style={{ borderColor: 'var(--color-border)' }}>
                  <div>
                    <div className="font-bold" style={{ color: 'var(--color-text)' }}>{doc.documentTitle}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {doc.documentNumber} · Issued: {doc.issueDate} {doc.expiryDate && `· Expires: ${doc.expiryDate}`}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    doc.status === 'Valid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                  }`}>
                    {doc.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
