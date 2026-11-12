import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { INITIAL_CONCESSIONS, INITIAL_STUDENT_OBLIGATIONS } from '../../data/initialFinanceData';
import { FeeConcession } from '../../types/finance';
import {
  Award,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  ShieldCheck,
  AlertCircle,
  X,
  Filter,
} from 'lucide-react';

export const AccountantConcessionsModule: React.FC = () => {
  const { students } = useSchoolData();
  const [concessions, setConcessions] = useState<FeeConcession[]>(INITIAL_CONCESSIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Concession Form State
  const [formStudentId, setFormStudentId] = useState(students[0]?.id || 'stu-maya-chen');
  const [formType, setFormType] = useState<FeeConcession['type']>('Merit Scholarship');
  const [formAmount, setFormAmount] = useState<number>(300);
  const [formReason, setFormReason] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const filteredList = concessions.filter((c) => {
    const matchesSearch =
      c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.obligationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string) => {
    setConcessions((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'approved',
              approvedBy: 'Dr. Arthur Sterling (Principal) · Verified by Bursar',
            }
          : c
      )
    );
    setToastMessage('Concession request approved and applied to student ledger.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleReject = (id: string) => {
    setConcessions((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'rejected',
              approvedBy: 'Review Committee (Rejected)',
            }
          : c
      )
    );
    setToastMessage('Concession request rejected.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCreateConcession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formReason.trim()) {
      setFormError('Please provide a legitimate justification/reason.');
      return;
    }
    if (formAmount <= 0) {
      setFormError('Concession amount must be greater than ₹0.');
      return;
    }

    const studentObj = students.find((s) => s.id === formStudentId);
    const newRecord: FeeConcession = {
      id: `cnc-${Date.now()}`,
      studentId: formStudentId,
      studentName: studentObj?.name || 'Selected Student',
      classId: studentObj?.classId || 'cls-gr10',
      className: studentObj?.className || 'Grade 10',
      obligationId: 'ob-core',
      obligationName: 'Core Annual Tuition',
      type: formType,
      amount: formAmount,
      reason: formReason,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setConcessions([newRecord, ...concessions]);
    setIsNewModalOpen(false);
    setFormReason('');
    setFormError(null);
    setToastMessage(`Concession request of ₹${Number(formAmount).toLocaleString('en-IN')} submitted for committee review.`);
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
              className="text-xs font-bold px-2 py-0.5 rounded tracking-wide uppercase border"
              style={{
                backgroundColor: 'rgba(var(--color-primary), 0.08)',
                color: 'var(--color-primary)',
                borderColor: 'var(--color-border)',
              }}
            >
              Scholarships & Relief
            </span>
            <span className="text-xs text-slate-400">Approval Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Fee Concessions
          </h1>
          <p className="text-sm mt-1 max-w-2xl text-slate-500">
            Review merit scholarships, staff dependent waivers, sibling discounts, and financial hardship relief requests.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs hover:opacity-90"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Concession Request</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div
        className="p-4 rounded-xl border shadow-xs flex flex-col sm:flex-row gap-3"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex-1 relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name or concession reason..."
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
          <option value="all">All Statuses</option>
          <option value="pending">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Concession Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredList.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-xl border shadow-xs flex flex-col justify-between space-y-3"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 uppercase tracking-wider text-slate-500">
                    {c.type}
                  </span>
                  <h3 className="font-bold text-sm mt-1" style={{ color: 'var(--color-text)' }}>
                    {c.studentName} ({c.className})
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-lg font-extrabold font-mono text-emerald-600 block">
                    ₹{c.amount.toLocaleString('en-IN')}
                  </span>
                  {c.percentage && <span className="text-[10px] text-slate-400 font-mono">({c.percentage}% waiver)</span>}
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                "{c.reason}"
              </p>

              <div className="text-[11px] text-slate-400 space-y-1 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <div>Applied Against: <strong className="text-slate-600 dark:text-slate-300">{c.obligationName}</strong></div>
                {c.approvedBy && (
                  <div>Authorized by: <strong className="text-slate-600 dark:text-slate-300">{c.approvedBy}</strong></div>
                )}
                <div>Logged: {c.createdAt}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold ${
                  c.status === 'approved'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                    : c.status === 'rejected'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                }`}
              >
                {c.status === 'approved' ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : c.status === 'rejected' ? (
                  <XCircle className="w-3 h-3" />
                ) : (
                  <Clock className="w-3 h-3" />
                )}
                <span className="capitalize">{c.status}</span>
              </span>

              {c.status === 'pending' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReject(c.id)}
                    className="px-2.5 py-1 rounded border text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(c.id)}
                    className="px-3 py-1 rounded text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs"
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Concession Request Modal */}
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
                <Award className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                <h3 className="text-base font-bold">New Concession Request</h3>
              </div>
              <button onClick={() => setIsNewModalOpen(false)} className="p-1 rounded text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateConcession} className="space-y-4 text-xs">
              {formError && (
                <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                  {formError}
                </div>
              )}

              <div>
                <label className="font-semibold block mb-1">Student</label>
                <select
                  value={formStudentId}
                  onChange={(e) => setFormStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-xs outline-hidden"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.className})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Concession Type</label>
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
                  <option value="Merit Scholarship">Merit Scholarship</option>
                  <option value="Staff Child Waiver">Staff Child Waiver</option>
                  <option value="Financial Hardship">Financial Hardship</option>
                  <option value="Sibling Concession">Sibling Concession</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Concession Amount (₹ INR)</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={formAmount}
                  onChange={(e) => setFormAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border text-xs outline-hidden font-mono"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                  required
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Justification & Policy Reference</label>
                <textarea
                  rows={3}
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  placeholder="e.g. Student qualified for State Science Fair 1st position..."
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
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
