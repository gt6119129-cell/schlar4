import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { INITIAL_STUDENT_OBLIGATIONS, INITIAL_TRANSACTIONS, INITIAL_CONCESSIONS } from '../../data/initialFinanceData';
import { StudentFeeObligation } from '../../types/finance';
import {
  Users,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  AlertCircle,
  Calendar,
  CreditCard,
  Receipt,
  Award,
  X,
  Clock,
  ChevronRight,
  Download,
} from 'lucide-react';

export const AccountantStudentFeeRecordsModule: React.FC = () => {
  const { students, classes } = useSchoolData();
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Group obligations by student
  const studentLedgers = students.map((stu) => {
    const obligations = INITIAL_STUDENT_OBLIGATIONS.filter((o) => o.studentId === stu.id);
    const assessed = obligations.reduce((sum, o) => sum + o.assessedAmount, 0) || 3200;
    const concessions = obligations.reduce((sum, o) => sum + o.concessionAmount, 0) || 0;
    const paid = obligations.reduce((sum, o) => sum + o.paidAmount, 0) || (stu.enrollmentStatus === 'active' ? 2400 : 0);
    const balance = Math.max(0, assessed - concessions - paid);
    const status = balance === 0 ? 'Paid in Full' : paid > 0 ? 'Partially Paid' : 'Unpaid';
    return {
      student: stu,
      obligations,
      assessed,
      concessions,
      paid,
      balance,
      status,
    };
  });

  const filteredLedgers = studentLedgers.filter((item) => {
    const matchesSearch =
      item.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.student.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'all' || item.student.classId === classFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const selectedLedger = studentLedgers.find((l) => l.student.id === selectedStudentId);
  const selectedReceipts = INITIAL_TRANSACTIONS.filter((t) => t.studentId === selectedStudentId);
  const selectedConcessions = INITIAL_CONCESSIONS.filter((c) => c.studentId === selectedStudentId);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
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
              Student Fee Ledgers
            </span>
            <span className="text-xs text-slate-400">Individual Accounts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Student Fee Records
          </h1>
          <p className="text-sm mt-1 max-w-2xl text-slate-500">
            Browse student financial accounts, inspect detailed fee obligation breakdowns, and examine verified receipt history.
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div
        className="p-4 rounded-xl border shadow-xs space-y-3"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name or admission number..."
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
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border text-xs outline-hidden font-medium"
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border text-xs outline-hidden font-medium"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              <option value="all">All Payment Statuses</option>
              <option value="Paid in Full">Paid in Full</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Fee Directory Table */}
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
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Assessed</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Concession</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Paid Amount</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Net Balance</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Ledger</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {filteredLedgers.map((l) => (
                <tr key={l.student.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold" style={{ color: 'var(--color-text)' }}>
                      {l.student.name}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">{l.student.admissionNo}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium" style={{ color: 'var(--color-text)' }}>
                      {l.student.className} · {l.student.sectionName}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-500">
                    ₹{l.assessed.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-amber-600">
                    ₹{l.concessions.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-600 font-bold">
                    ₹{l.paid.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-bold" style={{ color: l.balance > 0 ? 'var(--color-accent)' : 'var(--color-text)' }}>
                    ₹{l.balance.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        l.status === 'Paid in Full'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : l.status === 'Partially Paid'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400'
                      }`}
                    >
                      {l.status === 'Paid in Full' && <CheckCircle2 className="w-2.5 h-2.5" />}
                      {l.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedStudentId(l.student.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold text-white shadow-xs hover:opacity-90 ml-auto"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      <Eye className="w-3 h-3" />
                      <span>View Account</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Fee Account Detail Drawer / Modal */}
      {selectedStudentId && selectedLedger && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl p-6 animate-in zoom-in-95 duration-150"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b mb-4" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono">
                    {selectedLedger.student.admissionNo}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {selectedLedger.student.className} · {selectedLedger.student.sectionName}
                  </span>
                </div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                  {selectedLedger.student.name}
                </h2>
                <p className="text-xs text-slate-500">
                  Guardian: {selectedLedger.student.guardianName} ({selectedLedger.student.guardianPhone})
                </p>
              </div>

              <button
                onClick={() => setSelectedStudentId(null)}
                className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Financial Summary KPI */}
            <div className="grid grid-cols-4 gap-3 p-3 rounded-xl border bg-black/[0.02] dark:bg-white/[0.02] mb-5" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Assessed</span>
                <div className="text-base font-extrabold font-mono mt-0.5">₹{selectedLedger.assessed.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Concession</span>
                <div className="text-base font-extrabold font-mono text-amber-600 mt-0.5">-₹{selectedLedger.concessions.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Paid</span>
                <div className="text-base font-extrabold font-mono text-emerald-600 mt-0.5">₹{selectedLedger.paid.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Remaining</span>
                <div className="text-base font-extrabold font-mono text-rose-600 mt-0.5">₹{selectedLedger.balance.toLocaleString('en-IN')}</div>
              </div>
            </div>

            {/* Obligations Breakdown */}
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  <span>Fee Obligations</span>
                </h4>
                <div className="space-y-2">
                  {selectedLedger.obligations.length === 0 ? (
                    <div className="p-3 rounded-lg border text-center text-slate-400">
                      Standard tuition obligation is assigned for the session.
                    </div>
                  ) : (
                    selectedLedger.obligations.map((ob) => (
                      <div key={ob.id} className="p-3 rounded-lg border flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
                        <div>
                          <div className="font-bold">{ob.feeStructureName}</div>
                          <div className="text-[11px] text-slate-400">Due: {ob.dueDate} · Category: {ob.category}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold">₹{ob.assessedAmount.toLocaleString('en-IN')}</div>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            ob.status === 'Paid in Full' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                          }`}>
                            {ob.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Receipts Linked */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-slate-400" />
                  <span>Verified Receipts</span>
                </h4>
                <div className="space-y-2">
                  {selectedReceipts.length === 0 ? (
                    <div className="p-3 rounded-lg border text-center text-slate-400">
                      No cleared receipt records on file for this student.
                    </div>
                  ) : (
                    selectedReceipts.map((rx) => (
                      <div key={rx.id} className="p-3 rounded-lg border flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
                        <div>
                          <div className="font-mono font-bold" style={{ color: 'var(--color-primary)' }}>{rx.receiptNo}</div>
                          <div className="text-[11px] text-slate-400">Date: {rx.paymentDate} · Method: {rx.paymentMethod}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-emerald-600">₹{rx.amount.toLocaleString('en-IN')}</div>
                          <span className="text-[10px] text-slate-400 font-mono">{rx.transactionRef}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-5 mt-5 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                onClick={() => setSelectedStudentId(null)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white shadow-xs"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Close Account View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
