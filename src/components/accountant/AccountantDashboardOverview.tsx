import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  TrendingUp,
  Receipt,
  AlertTriangle,
  CreditCard,
  CheckCircle2,
  Calendar,
  Users,
  ArrowUpRight,
  PlusCircle,
  FileText,
  SlidersHorizontal,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface AccountantDashboardOverviewProps {
  onNavigateTab: (tabId: string) => void;
}

export const AccountantDashboardOverview: React.FC<AccountantDashboardOverviewProps> = ({
  onNavigateTab,
}) => {
  const { feesSummary, students, classes } = useSchoolData();

  // Metrics calculation
  const expectedTotal = feesSummary?.expectedTotal || 842500;
  const collectedTotal = feesSummary?.collectedTotal || 620400;
  const outstandingTotal = feesSummary?.outstandingTotal || 222100;
  const collectionRate = feesSummary?.collectionRate || 73.6;

  // Derive students with pending balance
  const activeStudents = students.filter((s) => s.enrollmentStatus === 'active');
  const studentsWithDuesCount = Math.round(activeStudents.length * 0.28) || 34;

  const recentTransactions = feesSummary?.recentTransactions || [
    {
      id: 'tx-1',
      studentId: 'stu-101',
      studentName: 'Adrian Vance',
      gradeSection: 'Grade 10 · Section A',
      amount: 2880,
      date: 'Oct 19, 2026',
      paymentMethod: 'Bank Wire / ACH' as const,
      status: 'cleared' as const,
      invoiceNumber: 'INV-2026-1049',
    },
    {
      id: 'tx-2',
      studentId: 'stu-102',
      studentName: 'Beatrice Lawson',
      gradeSection: 'Grade 10 · Section A',
      amount: 1440,
      date: 'Oct 18, 2026',
      paymentMethod: 'Debit Card' as const,
      status: 'cleared' as const,
      invoiceNumber: 'INV-2026-1050',
    },
    {
      id: 'tx-3',
      studentId: 'stu-104',
      studentName: 'Daniel Kim',
      gradeSection: 'Grade 10 · Section A',
      amount: 850,
      date: 'Oct 18, 2026',
      paymentMethod: 'Cash' as const,
      status: 'cleared' as const,
      invoiceNumber: 'INV-2026-1051',
    },
    {
      id: 'tx-4',
      studentId: 'stu-201',
      studentName: 'Austin Bailey',
      gradeSection: 'Grade 9 · Section B',
      amount: 3200,
      date: 'Oct 17, 2026',
      paymentMethod: 'Cheque' as const,
      status: 'cleared' as const,
      invoiceNumber: 'INV-2026-1048',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Heading & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
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
              Finance & Accounts
            </span>
            <span className="text-xs text-slate-400">Term 1 · FY 2026–2027</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Accountant / Fee Manager Workspace
          </h1>
          <p className="text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed text-slate-500">
            Institutional revenue tracking, fee tier allocations, student ledgers, cashier collection terminal, and bank statement reconciliations.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigateTab('collect-record-fees')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white rounded-lg shadow-sm hover:opacity-95 transition-opacity"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Collect Fees</span>
          </button>

          <button
            onClick={() => onNavigateTab('fee-structure')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border hover:opacity-90"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" style={{ color: 'var(--color-secondary)' }} />
            <span>Fee Structures</span>
          </button>

          <button
            onClick={() => onNavigateTab('receipts')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border hover:opacity-90"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <Receipt className="w-3.5 h-3.5" style={{ color: 'var(--color-accent)' }} />
            <span>Vouchers & Receipts</span>
          </button>
        </div>
      </div>

      {/* 4 Financial KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Assessed */}
        <div
          className="p-5 rounded-2xl border transition-colors shadow-sm flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Total Assessed Obligations</span>
            <FileText className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
          </div>
          <div className="my-2">
            <span
              className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums tracking-tight"
              style={{ color: 'var(--color-text)' }}
            >
              ₹{expectedTotal.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-400">
            All active cohorts & grade tiers
          </span>
        </div>

        {/* 2. Total Collected */}
        <div
          className="p-5 rounded-2xl border transition-colors shadow-sm flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Net Collected Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="my-2">
            <span
              className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums tracking-tight text-emerald-600"
            >
              ₹{collectedTotal.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-semibold">
            <span className="text-emerald-600">{collectionRate}% realized</span>
            <span className="text-slate-400">Term 1 pacing</span>
          </div>
        </div>

        {/* 3. Outstanding Balance */}
        <div
          className="p-5 rounded-2xl border transition-colors shadow-sm flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Outstanding Balance</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="my-2">
            <span
              className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums tracking-tight text-amber-600"
            >
              ₹{outstandingTotal.toLocaleString('en-IN')}
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('outstanding-balances')}
            className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 hover:underline text-left flex items-center gap-1"
          >
            <span>View aging report</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* 4. Student Dues Count */}
        <div
          className="p-5 rounded-2xl border transition-colors shadow-sm flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Students with Dues</span>
            <Users className="w-4 h-4" style={{ color: 'var(--color-secondary)' }} />
          </div>
          <div className="my-2">
            <span
              className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums tracking-tight"
              style={{ color: 'var(--color-text)' }}
            >
              {studentsWithDuesCount} Students
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-400">
            Across {classes.length} active academic grades
          </span>
        </div>
      </div>

      {/* Grid: Pacing Progress Bar & Quick Navigation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pacing & Breakdown */}
        <div
          className="lg:col-span-2 p-6 rounded-2xl border shadow-sm space-y-5"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <div>
              <h2 className="text-base font-extrabold" style={{ color: 'var(--color-text)' }}>
                Term Revenue Collection Pacing
              </h2>
              <span className="text-xs text-slate-500">
                Pacing against ₹84,25,000 target for Term 1
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
              {collectionRate}% Complete
            </span>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="h-3.5 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden flex">
              <div
                className="h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${collectionRate}%`,
                  backgroundColor: 'var(--color-primary)',
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Collected: ₹{collectedTotal.toLocaleString('en-IN')}</span>
              <span>Remaining: ₹{outstandingTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Category Pacing Blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl border bg-black/[0.015]" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Tuition</span>
              <span className="text-sm font-bold block" style={{ color: 'var(--color-text)' }}>92.4%</span>
              <span className="text-[10px] text-emerald-600">On Target</span>
            </div>

            <div className="p-3 rounded-xl border bg-black/[0.015]" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">STEM Lab</span>
              <span className="text-sm font-bold block" style={{ color: 'var(--color-text)' }}>88.1%</span>
              <span className="text-[10px] text-emerald-600">On Target</span>
            </div>

            <div className="p-3 rounded-xl border bg-black/[0.015]" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Library & Tech</span>
              <span className="text-sm font-bold block" style={{ color: 'var(--color-text)' }}>95.0%</span>
              <span className="text-[10px] text-emerald-600">Optimal</span>
            </div>

            <div className="p-3 rounded-xl border bg-black/[0.015]" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Transport</span>
              <span className="text-sm font-bold block" style={{ color: 'var(--color-text)' }}>64.2%</span>
              <span className="text-[10px] text-amber-600">Follow-up Due</span>
            </div>
          </div>
        </div>

        {/* Operational Shortcuts */}
        <div
          className="p-6 rounded-2xl border shadow-sm space-y-4"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <CreditCard className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
            <h2 className="text-base font-extrabold" style={{ color: 'var(--color-text)' }}>
              Quick Cashier Shortcuts
            </h2>
          </div>

          <div className="space-y-2 text-xs">
            <button
              onClick={() => onNavigateTab('collect-record-fees')}
              className="w-full p-3 rounded-xl border text-left flex items-center justify-between hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div>
                <span className="font-bold block" style={{ color: 'var(--color-text)' }}>
                  Record Payment Voucher
                </span>
                <span className="text-[11px] text-slate-500">Terminal for cash, wire, card, or check</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateTab('student-fee-records')}
              className="w-full p-3 rounded-xl border text-left flex items-center justify-between hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div>
                <span className="font-bold block" style={{ color: 'var(--color-text)' }}>
                  Student Fee Ledger Search
                </span>
                <span className="text-[11px] text-slate-500">Inspect individual student obligations & dues</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateTab('acc-assign-fees')}
              className="w-full p-3 rounded-xl border text-left flex items-center justify-between hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div>
                <span className="font-bold block" style={{ color: 'var(--color-text)' }}>
                  Assign Fee Structures
                </span>
                <span className="text-[11px] text-slate-500">Allocate fee tiers to classes or cohorts</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateTab('concessions')}
              className="w-full p-3 rounded-xl border text-left flex items-center justify-between hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div>
                <span className="font-bold block" style={{ color: 'var(--color-text)' }}>
                  Fee Concession Authorizations
                </span>
                <span className="text-[11px] text-slate-500">Merit scholarships and sibling discounts</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Valid Transactions Table */}
      <div
        className="rounded-2xl border shadow-sm overflow-hidden"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div
          className="p-5 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div>
            <h2 className="text-base font-extrabold" style={{ color: 'var(--color-text)' }}>
              Recent Fee Collection Transactions
            </h2>
            <span className="text-xs text-slate-500">
              Chronological log of verified tuition collections and issued receipts
            </span>
          </div>

          <button
            onClick={() => onNavigateTab('acc-payment-history')}
            className="text-xs font-semibold hover:underline"
            style={{ color: 'var(--color-primary)' }}
          >
            View Full Payment Ledger
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className="border-b uppercase font-bold text-[10px] tracking-wider"
              style={{
                backgroundColor: 'rgba(var(--color-primary), 0.03)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <tr>
                <th className="py-3 px-4">Receipt / Invoice</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Class & Section</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4 text-right">Amount Cleared</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-black/[0.015] dark:hover:bg-white/[0.015]">
                  <td className="py-3 px-4 font-mono font-bold" style={{ color: 'var(--color-primary)' }}>
                    {tx.invoiceNumber}
                  </td>
                  <td className="py-3 px-4 font-bold" style={{ color: 'var(--color-text)' }}>
                    {tx.studentName}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {tx.gradeSection}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {tx.date}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-black/[0.04] dark:bg-white/[0.05]">
                      {tx.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-extrabold text-emerald-600">
                    ₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      Cleared
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
