import React, { useState } from 'react';
import { INITIAL_REFUNDS_ADJUSTMENTS, INITIAL_TRANSACTIONS } from '../../data/initialFinanceData';
import { FeeRefundAdjustment } from '../../types/finance';
import {
  RotateCcw,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Receipt,
  User,
  Clock,
  X,
  ShieldAlert,
} from 'lucide-react';

export const AccountantRefundsAdjustmentsModule: React.FC = () => {
  const [records, setRecords] = useState<FeeRefundAdjustment[]>(INITIAL_REFUNDS_ADJUSTMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'Refund' | 'Adjustment' | 'Reversal'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Refund/Adjustment Form State
  const [formType, setFormType] = useState<'Refund' | 'Adjustment' | 'Reversal'>('Refund');
  const [formReceiptNo, setFormReceiptNo] = useState(INITIAL_TRANSACTIONS[0]?.receiptNo || 'REC-2026-0041');
  const [formAmount, setFormAmount] = useState<number>(150);
  const [formReason, setFormReason] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.receiptNo && r.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || r.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formReason.trim()) {
      setFormError('Please enter a detailed administrative reason.');
      return;
    }
    if (formAmount <= 0) {
      setFormError('Amount must be positive.');
      return;
    }

    const matchedTx = INITIAL_TRANSACTIONS.find((t) => t.receiptNo === formReceiptNo);
    if (formType === 'Refund' && matchedTx && formAmount > matchedTx.amount) {
      setFormError(`Refund amount cannot exceed original payment amount of ₹${matchedTx.amount.toLocaleString('en-IN')}.`);
      return;
    }

    const newRecord: FeeRefundAdjustment = {
      id: `radj-${Date.now()}`,
      type: formType,
      receiptNo: formReceiptNo,
      studentId: matchedTx?.studentId || 'stu-maya-chen',
      studentName: matchedTx?.studentName || 'Selected Student',
      amount: formAmount,
      reason: formReason,
      processedDate: new Date().toISOString().split('T')[0],
      approvedBy: 'Lead Bursar & Finance Officer',
      status: 'Completed',
    };

    setRecords([newRecord, ...records]);
    setIsModalOpen(false);
    setFormReason('');
    setFormError(null);
    setToastMessage(`${formType} of ₹${formAmount.toLocaleString('en-IN')} successfully recorded and ledger adjusted.`);
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
              Ledger Adjustments & Reversals
            </span>
            <span className="text-xs text-slate-400">Financial Corrections</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Refunds & Adjustments
          </h1>
          <p className="text-sm mt-1 max-w-2xl text-slate-500">
            Process authorized fee refunds against verified payment receipts, record balance adjustments, and audit transaction reversals.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs hover:opacity-90"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Refund or Adjustment</span>
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
            placeholder="Search by student, receipt number, or reason..."
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
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
          className="px-3 py-2 rounded-lg border text-xs outline-hidden font-medium"
          style={{
            backgroundColor: 'var(--color-background)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
        >
          <option value="all">All Operations</option>
          <option value="Refund">Refunds Only</option>
          <option value="Adjustment">Adjustments Only</option>
          <option value="Reversal">Reversals Only</option>
        </select>
      </div>

      {/* Records Table */}
      <div
        className="rounded-xl border shadow-xs overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Type</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Student</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Linked Receipt</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Reason</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Amount</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Processed Date</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.type === 'Refund'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400'
                          : r.type === 'Reversal'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                          : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400'
                      }`}
                    >
                      {r.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold" style={{ color: 'var(--color-text)' }}>
                    {r.studentName}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]" style={{ color: 'var(--color-primary)' }}>
                    {r.receiptNo || '—'}
                  </td>
                  <td className="py-3 px-4 max-w-xs text-slate-500">
                    {r.reason}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold" style={{ color: 'var(--color-text)' }}>
                    ₹{r.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{r.processedDate}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Refund / Adjustment Modal */}
      {isModalOpen && (
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
                <RotateCcw className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                <h3 className="text-base font-bold">Process Refund or Adjustment</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-4 text-xs">
              {formError && (
                <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                  {formError}
                </div>
              )}

              <div>
                <label className="font-semibold block mb-1">Adjustment Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Refund', 'Adjustment', 'Reversal'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormType(t)}
                      className={`py-1.5 rounded-lg border text-xs font-semibold ${
                        formType === t ? 'bg-black/10 dark:bg-white/10 border-2' : 'opacity-70'
                      }`}
                      style={{ borderColor: formType === t ? 'var(--color-primary)' : 'var(--color-border)' }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Reference Original Payment Receipt</label>
                <select
                  value={formReceiptNo}
                  onChange={(e) => setFormReceiptNo(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-xs outline-hidden"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                >
                  {INITIAL_TRANSACTIONS.map((tx) => (
                    <option key={tx.id} value={tx.receiptNo}>
                      {tx.receiptNo} · {tx.studentName} (₹{tx.amount.toLocaleString('en-IN')} · {tx.paymentMethod})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Amount (₹ INR)</label>
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
                <label className="font-semibold block mb-1">Administrative Justification / Reason</label>
                <textarea
                  rows={3}
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  placeholder="e.g. Overpayment adjustment credit for uniform sizing change..."
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
                  onClick={() => setIsModalOpen(false)}
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
                  Confirm & Post Ledger Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
