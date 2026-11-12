import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { INITIAL_STUDENT_OBLIGATIONS } from '../../data/initialFinanceData';
import { StudentFeeObligation } from '../../types/finance';
import {
  AlertTriangle,
  Search,
  Filter,
  Calendar,
  Send,
  CheckCircle2,
  Clock,
  User,
  ArrowRight,
  Download,
  AlertCircle,
  X,
} from 'lucide-react';

interface AccountantOutstandingBalancesModuleProps {
  onNavigateToStudentAccount?: (studentId: string) => void;
}

export const AccountantOutstandingBalancesModule: React.FC<AccountantOutstandingBalancesModuleProps> = ({
  onNavigateToStudentAccount,
}) => {
  const { classes } = useSchoolData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Overdue' | 'Partially Paid' | 'Unpaid'>('all');
  const [classFilter, setClassFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [reminderModal, setReminderModal] = useState<{ open: boolean; obligation: StudentFeeObligation | null }>({
    open: false,
    obligation: null,
  });
  const [reminderNotice, setReminderNotice] = useState<string | null>(null);

  // Compute outstanding obligations
  const outstandingObligations = INITIAL_STUDENT_OBLIGATIONS.filter((o) => o.balance > 0);

  // Filtering
  const filteredList = outstandingObligations.filter((ob) => {
    const matchesSearch =
      ob.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ob.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ob.feeStructureName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ob.status === statusFilter;
    const matchesClass = classFilter === 'all' || ob.classId === classFilter;
    const matchesCat = categoryFilter === 'all' || ob.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesClass && matchesCat;
  });

  // Calculate aging statistics
  const totalOutstanding = outstandingObligations.reduce((sum, o) => sum + o.balance, 0);
  const overdueCount = outstandingObligations.filter((o) => o.status === 'Overdue').length;
  const overdueAmount = outstandingObligations
    .filter((o) => o.status === 'Overdue')
    .reduce((sum, o) => sum + o.balance, 0);

  const handleSendReminder = (ob: StudentFeeObligation) => {
    setReminderModal({ open: true, obligation: ob });
  };

  const confirmSendReminder = () => {
    if (reminderModal.obligation) {
      setReminderNotice(
        `Demo notification logged for ${reminderModal.obligation.studentName} (${reminderModal.obligation.feeStructureName} · ₹${reminderModal.obligation.balance.toLocaleString('en-IN')}). No live SMS/email dispatched in demo mode.`
      );
      setReminderModal({ open: false, obligation: null });
      setTimeout(() => setReminderNotice(null), 5000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {reminderNotice && (
        <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center gap-2.5 shadow-lg border border-slate-700 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{reminderNotice}</span>
        </div>
      )}

      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded tracking-wide uppercase border text-amber-600 bg-amber-50 dark:bg-amber-950/30"
              style={{ borderColor: 'var(--color-border)' }}
            >
              Credit Control & Recovery
            </span>
            <span className="text-xs text-slate-400">Aging Dues Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Outstanding Balances
          </h1>
          <p className="text-sm mt-1 max-w-2xl text-slate-500">
            Monitor aging student dues, review overdue installment schedules, and initiate collection follow-up actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const csvContent =
                'data:text/csv;charset=utf-8,' +
                'Student ID,Student Name,Class,Fee Name,Category,Due Date,Assessed (₹),Paid (₹),Balance (₹),Status\n' +
                filteredList
                  .map(
                    (o) =>
                      `${o.studentId},${o.studentName},${o.className},${o.feeStructureName},${o.category},${o.dueDate},${o.assessedAmount},${o.paidAmount},${o.balance},${o.status}`
                  )
                  .join('\n');
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement('a');
              link.setAttribute('href', encodedUri);
              link.setAttribute('download', `schlar_outstanding_dues_${Date.now()}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium hover:opacity-85 shadow-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Dues Ledger</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className="p-4 rounded-xl border shadow-xs"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <span className="text-xs font-medium text-slate-500">Total Unpaid Balance</span>
          <div className="my-1.5">
            <span className="text-2xl font-extrabold tracking-tight font-mono tabular-nums text-amber-600">
              ₹{totalOutstanding.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">{outstandingObligations.length} open obligations</span>
        </div>

        <div
          className="p-4 rounded-xl border shadow-xs"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <span className="text-xs font-medium text-slate-500">Past Due (Overdue) Amount</span>
          <div className="my-1.5">
            <span className="text-2xl font-extrabold tracking-tight font-mono tabular-nums text-rose-600">
              ₹{overdueAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[11px] text-rose-600 font-semibold">{overdueCount} student obligations past due date</span>
        </div>

        <div
          className="p-4 rounded-xl border shadow-xs"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <span className="text-xs font-medium text-slate-500">Aging Risk Index</span>
          <div className="my-1.5">
            <span className="text-2xl font-extrabold tracking-tight font-mono tabular-nums" style={{ color: 'var(--color-primary)' }}>
              Moderate
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Majority due within next 14 days</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="p-4 rounded-xl border shadow-xs space-y-3"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name, ID, or fee name..."
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

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-2 rounded-lg border text-xs outline-hidden font-medium"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              <option value="all">All Dues Statuses</option>
              <option value="Overdue">Overdue</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>

            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-2.5 py-2 rounded-lg border text-xs outline-hidden font-medium"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              <option value="all">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-2 rounded-lg border text-xs outline-hidden font-medium"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              <option value="all">All Categories</option>
              <option value="Tuition">Tuition</option>
              <option value="Laboratory">Laboratory</option>
              <option value="Library">Library</option>
              <option value="Transport">Transport</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dues Ledger Table */}
      <div
        className="rounded-xl border shadow-xs overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
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
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Student</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Class & Section</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Fee Obligation</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Due Date</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Assessed</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Paid</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Balance Due</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No outstanding obligations found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredList.map((ob) => (
                  <tr key={ob.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold" style={{ color: 'var(--color-text)' }}>
                        {ob.studentName}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">{ob.studentId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium" style={{ color: 'var(--color-text)' }}>
                        {ob.className} · {ob.sectionName}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold" style={{ color: 'var(--color-text)' }}>
                        {ob.feeStructureName}
                      </div>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/5 dark:bg-white/10 text-slate-500">
                        {ob.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{ob.dueDate}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-500">
                      ₹{ob.assessedAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-600 font-semibold">
                      ₹{ob.paidAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-rose-600">
                      ₹{ob.balance.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          ob.status === 'Overdue'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400'
                            : ob.status === 'Partially Paid'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                            : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {ob.status === 'Overdue' && <AlertCircle className="w-2.5 h-2.5" />}
                        {ob.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleSendReminder(ob)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold text-white shadow-xs hover:opacity-90"
                          style={{ backgroundColor: 'var(--color-primary)' }}
                          title="Log Follow-up Reminder"
                        >
                          <Send className="w-3 h-3" />
                          <span>Remind</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reminder Confirmation Modal */}
      {reminderModal.open && reminderModal.obligation && (
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
                <Send className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                <h3 className="text-base font-bold">Log Guardian Fee Reminder</h3>
              </div>
              <button
                onClick={() => setReminderModal({ open: false, obligation: null })}
                className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs mb-5">
              <p className="text-slate-500">
                You are logging a payment reminder for:
              </p>
              <div className="p-3 rounded-lg border bg-black/[0.02] dark:bg-white/[0.02] space-y-1" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex justify-between">
                  <span className="text-slate-400">Student:</span>
                  <span className="font-bold">{reminderModal.obligation.studentName} ({reminderModal.obligation.className})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Fee Item:</span>
                  <span>{reminderModal.obligation.feeStructureName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount Overdue:</span>
                  <span className="font-bold text-rose-600">₹{reminderModal.obligation.balance.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Original Due Date:</span>
                  <span>{reminderModal.obligation.dueDate}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 italic">
                Notice: In frontend demonstration mode, logging this follow-up records the activity in the audit trail without initiating external SMS or email gateways.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setReminderModal({ open: false, obligation: null })}
                className="px-3 py-1.5 rounded-lg border text-xs font-medium hover:opacity-85"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmSendReminder}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs hover:opacity-90"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm & Log Reminder</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
