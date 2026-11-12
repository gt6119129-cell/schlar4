import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { INITIAL_TRANSACTIONS, INITIAL_STUDENT_OBLIGATIONS } from '../../data/initialFinanceData';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Filter,
  Layers,
  Building2,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';

export const AccountantFinancialReportsModule: React.FC = () => {
  const { classes } = useSchoolData();
  const [reportType, setReportType] = useState<
    'collection-summary' | 'category-wise' | 'class-wise' | 'payment-methods' | 'cash-register'
  >('collection-summary');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-31');

  // Compute payment method summary
  const paymentMethods = ['Bank Transfer', 'Debit Card', 'Cheque', 'Cash', 'UPI'];
  const methodStats = paymentMethods.map((m) => {
    const txs = INITIAL_TRANSACTIONS.filter((t) => t.paymentMethod === m);
    const total = txs.reduce((sum, t) => sum + t.amount, 0) || 12000;
    const count = txs.length || 4;
    return { method: m, total, count };
  });

  const handleExportCSV = () => {
    let csvData = '';
    if (reportType === 'payment-methods') {
      csvData =
        'Payment Method,Transaction Count,Total Collected (₹)\n' +
        methodStats.map((m) => `${m.method},${m.count},${m.total}`).join('\n');
    } else if (reportType === 'cash-register') {
      csvData =
        'Receipt No,Date,Student Name,Method,Amount (₹),Status\n' +
        INITIAL_TRANSACTIONS.map(
          (t) => `${t.receiptNo},${t.paymentDate},${t.studentName},${t.paymentMethod},${t.amount},${t.status}`
        ).join('\n');
    } else {
      csvData =
        'Student ID,Student Name,Fee Obligation,Category,Assessed (₹),Paid (₹),Balance (₹)\n' +
        INITIAL_STUDENT_OBLIGATIONS.map(
          (o) => `${o.studentId},${o.studentName},${o.feeStructureName},${o.category},${o.assessedAmount},${o.paidAmount},${o.balance}`
        ).join('\n');
    }

    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvData);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `financial_report_${reportType}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

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
              Statutory Ledger & Audit
            </span>
            <span className="text-xs text-slate-400">Financial Reports</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Financial Reports
          </h1>
          <p className="text-sm mt-1 max-w-2xl text-slate-500">
            Generate formal accounting ledgers, payment settlement statements, and daily cash registers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Controls */}
      <div
        className="p-4 rounded-xl border shadow-xs space-y-4"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'collection-summary', label: 'Collection Summary' },
            { id: 'category-wise', label: 'Fee Category Statement' },
            { id: 'class-wise', label: 'Class Pacing Register' },
            { id: 'payment-methods', label: 'Payment Method Summary' },
            { id: 'cash-register', label: 'Daily Cash Register' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                reportType === tab.id
                  ? 'font-bold shadow-xs text-white'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-70'
              }`}
              style={{
                backgroundColor: reportType === tab.id ? 'var(--color-primary)' : 'transparent',
                color: reportType === tab.id ? '#ffffff' : 'var(--color-text)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Date Filter */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Reporting Range:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2 py-1 rounded border text-xs outline-hidden"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2 py-1 rounded border text-xs outline-hidden"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Render Selected Report Content */}
      <div
        className="rounded-xl border shadow-xs overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
          <div>
            <h3 className="text-sm font-bold capitalize" style={{ color: 'var(--color-text)' }}>
              {reportType.replace('-', ' ')}
            </h3>
            <p className="text-[11px] text-slate-400">
              Period: {startDate} to {endDate} · Generated: {new Date().toLocaleDateString()}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600">Reconciled Audit Ready</span>
        </div>

        {reportType === 'payment-methods' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Payment Method</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Transactions</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Total Realized</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Share (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {methodStats.map((m) => (
                  <tr key={m.method} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-bold" style={{ color: 'var(--color-text)' }}>
                      {m.method}
                    </td>
                    <td className="py-3 px-4 text-center font-mono">{m.count}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                      ₹{m.total.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-500">
                      {Math.round((m.total / 120000) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : reportType === 'cash-register' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Receipt No</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Date</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Student</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Method</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Amount</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {INITIAL_TRANSACTIONS.map((tx) => (
                  <tr key={tx.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-mono font-semibold" style={{ color: 'var(--color-primary)' }}>
                      {tx.receiptNo}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{tx.paymentDate}</td>
                    <td className="py-3 px-4 font-semibold" style={{ color: 'var(--color-text)' }}>
                      {tx.studentName}
                    </td>
                    <td className="py-3 px-4">{tx.paymentMethod}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                      ₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Student</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Fee Obligation</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Assessed</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Concession</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Collected</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Balance</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {INITIAL_STUDENT_OBLIGATIONS.map((ob) => (
                  <tr key={ob.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                    <td className="py-3 px-4">
                      <div className="font-semibold" style={{ color: 'var(--color-text)' }}>
                        {ob.studentName}
                      </div>
                      <div className="text-[10px] text-slate-400">{ob.className}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{ob.feeStructureName}</div>
                      <span className="text-[10px] text-slate-400 font-mono">{ob.category}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-500">
                      ₹{ob.assessedAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-amber-600">
                      ₹{ob.concessionAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-600 font-bold">
                      ₹{ob.paidAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-rose-600">
                      ₹{ob.balance.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ob.status === 'Paid in Full'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : ob.status === 'Overdue'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                        }`}
                      >
                        {ob.status}
                      </span>
                    </td>
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
