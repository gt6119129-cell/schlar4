import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { INITIAL_LEAVE_REQUESTS, INITIAL_LEAVE_BALANCES } from '../../data/initialHRData';
import { StaffLeaveRequest } from '../../types/hr';
import {
  CalendarClock,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  User,
  Filter,
  AlertCircle,
  X,
  FileCheck,
} from 'lucide-react';

export const HRLeaveManagementModule: React.FC = () => {
  const { staff } = useSchoolData();
  const [activeTab, setActiveTab] = useState<'requests' | 'approvals' | 'calendar' | 'balances'>('requests');
  const [leaveRequests, setLeaveRequests] = useState<StaffLeaveRequest[]>(INITIAL_LEAVE_REQUESTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pending' | 'Approved' | 'Rejected'>('all');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Request Form
  const [formStaffId, setFormStaffId] = useState(staff[0]?.id || 'staff-henderson');
  const [formType, setFormType] = useState<StaffLeaveRequest['leaveType']>('Casual Leave');
  const [formStart, setFormStart] = useState('2026-11-01');
  const [formEnd, setFormEnd] = useState('2026-11-02');
  const [formReason, setFormReason] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const filteredRequests = leaveRequests.filter((r) => {
    const matchesSearch =
      r.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Approved',
              reviewedBy: 'HR Director / Academic Dean',
              reviewedAt: new Date().toISOString().split('T')[0],
              reviewRemarks: 'Lesson plans verified and coverage arranged.',
            }
          : r
      )
    );
    setToastMessage('Staff leave request approved. Quota balances updated.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleReject = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Rejected',
              reviewedBy: 'HR Director',
              reviewedAt: new Date().toISOString().split('T')[0],
              reviewRemarks: 'Conflicting departmental examination schedule.',
            }
          : r
      )
    );
    setToastMessage('Staff leave request rejected.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (new Date(formEnd) < new Date(formStart)) {
      setFormError('End date cannot precede the start date.');
      return;
    }
    if (!formReason.trim()) {
      setFormError('Please enter a reason for the leave.');
      return;
    }

    const s = staff.find((x) => x.id === formStaffId);
    const diffTime = Math.abs(new Date(formEnd).getTime() - new Date(formStart).getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newReq: StaffLeaveRequest = {
      id: `lvr-${Date.now()}`,
      staffId: formStaffId,
      staffName: s?.name || '',
      departmentName: s?.department || '',
      designation: s?.designation || '',
      leaveType: formType,
      startDate: formStart,
      endDate: formEnd,
      totalDays,
      reason: formReason,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };

    setLeaveRequests([newReq, ...leaveRequests]);
    setIsNewModalOpen(false);
    setFormReason('');
    setFormError(null);
    setToastMessage(`Leave request submitted for ${s?.name} (${totalDays} days).`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center gap-2.5 shadow-lg border border-slate-700 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded tracking-wide uppercase border text-teal-700 bg-teal-50 dark:bg-teal-950/30"
              style={{ borderColor: 'var(--color-border)' }}
            >
              Absence & Entitlements
            </span>
            <span className="text-xs text-slate-400">Leave Management Board</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Leave Management
          </h1>
          <p className="text-sm mt-1 max-w-2xl text-slate-500">
            Process faculty leave applications, evaluate quota entitlements, monitor leave calendars, and coordinate substitute teaching coverage.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs hover:opacity-90"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Leave Application</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b text-xs font-medium" style={{ borderColor: 'var(--color-border)' }}>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2.5 border-b-2 font-bold transition-colors ${
            activeTab === 'requests' ? 'border-primary' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
          style={{
            borderColor: activeTab === 'requests' ? 'var(--color-primary)' : 'transparent',
            color: activeTab === 'requests' ? 'var(--color-primary)' : undefined,
          }}
        >
          All Leave Requests ({leaveRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-4 py-2.5 border-b-2 font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'approvals' ? 'border-primary' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
          style={{
            borderColor: activeTab === 'approvals' ? 'var(--color-primary)' : 'transparent',
            color: activeTab === 'approvals' ? 'var(--color-primary)' : undefined,
          }}
        >
          <span>Approval Queue</span>
          <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400 text-[10px]">
            {leaveRequests.filter((r) => r.status === 'Pending').length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2.5 border-b-2 font-bold transition-colors ${
            activeTab === 'calendar' ? 'border-primary' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
          style={{
            borderColor: activeTab === 'calendar' ? 'var(--color-primary)' : 'transparent',
            color: activeTab === 'calendar' ? 'var(--color-primary)' : undefined,
          }}
        >
          Leave Calendar
        </button>
        <button
          onClick={() => setActiveTab('balances')}
          className={`px-4 py-2.5 border-b-2 font-bold transition-colors ${
            activeTab === 'balances' ? 'border-primary' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
          style={{
            borderColor: activeTab === 'balances' ? 'var(--color-primary)' : 'transparent',
            color: activeTab === 'balances' ? 'var(--color-primary)' : undefined,
          }}
        >
          Leave Quota Balances
        </button>
      </div>

      {/* Tab: Requests or Approvals */}
      {(activeTab === 'requests' || activeTab === 'approvals') && (
        <div className="space-y-4">
          <div
            className="p-4 rounded-xl border shadow-xs flex flex-col sm:flex-row gap-3"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex-1 relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search leave requests by staff name or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border text-xs outline-hidden"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            {activeTab === 'requests' && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 rounded-lg border text-xs outline-hidden font-medium"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                <option value="all">All Request Statuses</option>
                <option value="Pending">Pending Only</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(activeTab === 'approvals'
              ? filteredRequests.filter((r) => r.status === 'Pending')
              : filteredRequests
            ).map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-xl border shadow-xs flex flex-col justify-between space-y-3"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 uppercase tracking-wider text-slate-500">
                        {req.leaveType}
                      </span>
                      <h3 className="font-bold text-sm mt-1" style={{ color: 'var(--color-text)' }}>
                        {req.staffName}
                      </h3>
                      <span className="text-[11px] text-slate-400">{req.departmentName} · {req.designation}</span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        req.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : req.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed mb-3">
                    "{req.reason}"
                  </p>

                  <div className="p-2.5 rounded-lg border bg-black/[0.01] dark:bg-white/[0.01] space-y-1 text-[11px] text-slate-400" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex justify-between">
                      <span>Date Range:</span>
                      <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {req.startDate} to {req.endDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Work Days:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{req.totalDays} Days</span>
                    </div>
                    {req.reviewedBy && (
                      <div className="flex justify-between">
                        <span>Reviewed By:</span>
                        <span className="text-slate-600 dark:text-slate-300">{req.reviewedBy}</span>
                      </div>
                    )}
                  </div>
                </div>

                {req.status === 'Pending' && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <button
                      onClick={() => handleReject(req.id)}
                      className="px-3 py-1.5 rounded-lg border text-xs font-semibold text-rose-600 hover:bg-rose-50"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Request</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Calendar */}
      {activeTab === 'calendar' && (
        <div
          className="p-6 rounded-xl border shadow-xs space-y-4"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
              Faculty Absence Schedule — Current & Upcoming Months
            </h3>
            <span className="text-xs text-slate-400">Showing approved leave blocks</span>
          </div>

          <div className="space-y-3">
            {leaveRequests.filter((r) => r.status === 'Approved').map((l) => (
              <div key={l.id} className="p-3.5 rounded-lg border flex items-center justify-between text-xs" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="font-bold">{l.staffName} ({l.departmentName})</div>
                    <div className="text-[11px] text-slate-400 font-mono">{l.startDate} → {l.endDate} · {l.leaveType}</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold text-[10px]">
                  {l.totalDays} Days Absence
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Balances */}
      {activeTab === 'balances' && (
        <div
          className="rounded-xl border shadow-xs overflow-hidden"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Staff Member</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Department</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Casual Leave</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Sick Leave</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Privilege Leave</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {INITIAL_LEAVE_BALANCES.map((b) => (
                <tr key={b.staffId} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-bold" style={{ color: 'var(--color-text)' }}>
                    {b.staffName}
                  </td>
                  <td className="py-3 px-4 text-slate-500">{b.department}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-emerald-600">
                    {b.casualRemaining} / {b.casualTotal}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-emerald-600">
                    {b.sickRemaining} / {b.sickTotal}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-emerald-600">
                    {b.privilegeRemaining} / {b.privilegeTotal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Leave Application Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-md rounded-2xl border shadow-2xl p-6 animate-in zoom-in-95 duration-150"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <CalendarClock className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                <h3 className="text-base font-bold">New Staff Leave Application</h3>
              </div>
              <button onClick={() => setIsNewModalOpen(false)} className="p-1 rounded text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
              {formError && (
                <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                  {formError}
                </div>
              )}

              <div>
                <label className="font-semibold block mb-1">Staff Member</label>
                <select
                  value={formStaffId}
                  onChange={(e) => setFormStaffId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-xs outline-hidden"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                >
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.department} · {s.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Leave Category</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border text-xs outline-hidden"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                >
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick / Medical">Sick / Medical</option>
                  <option value="Privilege / Earned">Privilege / Earned</option>
                  <option value="Duty Leave">Duty Leave (School Assignment)</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formStart}
                    onChange={(e) => setFormStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-xs outline-hidden"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">End Date</label>
                  <input
                    type="date"
                    value={formEnd}
                    onChange={(e) => setFormEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-xs outline-hidden"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Reason & Coverage Plan</label>
                <textarea
                  rows={3}
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  placeholder="e.g. Attending academic conference in Chicago; substitute syllabus materials prepared..."
                  className="w-full px-3 py-2 rounded-lg border text-xs outline-hidden resize-none"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border text-xs font-medium"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
