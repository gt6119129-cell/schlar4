import React, { useState } from 'react';
import { INITIAL_RECONCILIATION_ITEMS } from '../../data/initialFinanceData';
import { BankReconciliationItem } from '../../types/finance';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  Search,
  Check,
  RefreshCw,
  Building2,
  FileText,
  Calendar,
} from 'lucide-react';

export const AccountantReconciliationModule: React.FC = () => {
  const [items, setItems] = useState<BankReconciliationItem[]>(INITIAL_RECONCILIATION_ITEMS);
  const [activeTab, setActiveTab] = useState<'overview' | 'unmatched' | 'history'>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const matchedItems = items.filter((i) => i.status === 'Matched');
  const unmatchedItems = items.filter((i) => i.status === 'Unmatched' || i.status === 'Exception');

  const handleMatchManually = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'Matched',
              systemAmount: item.statementAmount,
              difference: 0,
              reconciledAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            }
          : item
      )
    );
    setToastMessage('Bank statement transaction matched and verified with ledger.');
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
              Settlement & Banking
            </span>
            <span className="text-xs text-slate-400">Monthly Statement Reconciliation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Bank Reconciliation
          </h1>
          <p className="text-sm mt-1 max-w-2xl text-slate-500">
            Compare bank statement references with local receipt records and resolve unmatched transaction exceptions.
          </p>
        </div>
      </div>

      {/* Secondary Sub-Tabs */}
      <div className="flex border-b text-xs font-medium" style={{ borderColor: 'var(--color-border)' }}>
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 border-b-2 font-bold transition-colors ${
            activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
          style={{ borderColor: activeTab === 'overview' ? 'var(--color-primary)' : 'transparent' }}
        >
          Reconciliation Overview ({matchedItems.length} Matched)
        </button>
        <button
          onClick={() => setActiveTab('unmatched')}
          className={`px-4 py-2.5 border-b-2 font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'unmatched' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
          style={{ borderColor: activeTab === 'unmatched' ? 'var(--color-primary)' : 'transparent' }}
        >
          <span>Unmatched Payments</span>
          {unmatchedItems.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 text-[10px]">
              {unmatchedItems.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 border-b-2 font-bold transition-colors ${
            activeTab === 'history' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
          style={{ borderColor: activeTab === 'history' ? 'var(--color-primary)' : 'transparent' }}
        >
          Audit History
        </button>
      </div>

      {/* Content depending on tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border shadow-xs" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
              <span className="text-xs font-medium text-slate-400">Statement Matched Volume</span>
              <div className="my-1 text-2xl font-mono font-extrabold text-emerald-600">
                ₹{matchedItems.reduce((acc, i) => acc + i.statementAmount, 0).toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-400">{matchedItems.length} verified transactions</span>
            </div>

            <div className="p-4 rounded-xl border shadow-xs" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
              <span className="text-xs font-medium text-slate-400">Unmatched Exceptions</span>
              <div className="my-1 text-2xl font-mono font-extrabold text-amber-600">
                ₹{unmatchedItems.reduce((acc, i) => acc + i.statementAmount, 0).toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-amber-600 font-semibold">{unmatchedItems.length} transactions requiring manual review</span>
            </div>

            <div className="p-4 rounded-xl border shadow-xs" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
              <span className="text-xs font-medium text-slate-400">Reconciliation Rate</span>
              <div className="my-1 text-2xl font-mono font-extrabold" style={{ color: 'var(--color-primary)' }}>
                {Math.round((matchedItems.length / items.length) * 100)}%
              </div>
              <span className="text-[11px] text-slate-400">State Bank of India Corporate Account</span>
            </div>
          </div>

          <div className="rounded-xl border shadow-xs overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Bank Statement Ref</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">System Ref</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Student / Entity</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Statement Amt</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">System Amt</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-mono font-semibold">{item.bankStatementRef}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{item.transactionRef}</td>
                    <td className="py-3 px-4 font-semibold">{item.studentName || 'Unallocated Wire'}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold">₹{item.statementAmount.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-right font-mono">₹{item.systemAmount.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'Matched' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'unmatched' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
            Unmatched transactions represent bank credits that have not yet been tied to a specific student obligation. Review the reference code to confirm manual match.
          </div>

          <div className="rounded-xl border shadow-xs overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Bank Statement Ref</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Reference Code</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Amount</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {unmatchedItems.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      All bank entries successfully matched.
                    </td>
                  </tr>
                ) : (
                  unmatchedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-mono font-bold">{item.bankStatementRef}</td>
                      <td className="py-3 px-4 font-mono text-slate-400">{item.transactionRef}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-600">
                        ₹{item.statementAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleMatchManually(item.id)}
                          className="flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs ml-auto"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Confirm Match</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="rounded-xl border shadow-xs p-6 space-y-3 text-xs" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <h4 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
            Past Reconciliation Statements
          </h4>
          <div className="space-y-2">
            {[
              { period: 'October 2026 (Mid-Cycle)', date: '2026-10-15', user: 'Lead Bursar', items: 14, diff: '₹0.00' },
              { period: 'September 2026 (Month-End)', date: '2026-09-30', user: 'Dr. Arthur Sterling', items: 48, diff: '₹0.00' },
              { period: 'August 2026 (Enrollment Influx)', date: '2026-08-31', user: 'Lead Bursar', items: 92, diff: '₹0.00' },
            ].map((h, i) => (
              <div key={i} className="p-3 rounded-lg border flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
                <div>
                  <div className="font-bold">{h.period}</div>
                  <div className="text-[11px] text-slate-400">Reconciled on {h.date} by {h.user}</div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-600">{h.diff} Variance</span>
                  <div className="text-[10px] text-slate-400">{h.items} cleared records</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
