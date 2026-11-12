import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { usePermissions } from '../../context/PermissionContext';
import { AccessDenied } from '../common/AccessDenied';
import {
  Receipt,
  DollarSign,
  TrendingUp,
  CreditCard,
  FileCheck,
  AlertCircle,
  Clock,
  Shield,
  Download,
  CheckCircle2,
} from 'lucide-react';

export const FeesOverviewModule: React.FC = () => {
  const { feesSummary } = useSchoolData();
  const { hasPermission } = usePermissions();

  const canViewFees = hasPermission('fees.view');

  if (!canViewFees) {
    return (
      <AccessDenied
        requiredPermission="fees.view"
        roleName="Admin"
        onReturnToOverview={() => {}}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Informative Governance Banner */}
      <div
        className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'var(--color-background)' }}
          >
            <Receipt className="w-4 h-4 text-sky-600" />
          </div>
          <div>
            <h3 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
              Institutional Fee Revenue & Receivables Overview
            </h3>
            <p className="text-slate-500 text-xs">
              Executive read-only ledger. Operational cashiering and fee concessions are managed by the Accountant / Fee Manager workspace.
            </p>
          </div>
        </div>

        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded border self-start sm:self-auto" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
          Audited Demo Ledger
        </span>
      </div>

      {/* 4 Revenue Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="p-4 rounded-xl border shadow-xs"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <span className="text-slate-400 text-xs font-semibold">Total Projected Revenue</span>
          <div className="text-2xl font-extrabold font-mono tabular-nums mt-1" style={{ color: 'var(--color-text)' }}>
            ₹{feesSummary.expectedTotal.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Based on enrolled student fee slabs</p>
        </div>

        <div
          className="p-4 rounded-xl border shadow-xs"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <span className="text-emerald-600 text-xs font-semibold">Recorded Collected</span>
          <div className="text-2xl font-extrabold font-mono tabular-nums text-emerald-600 mt-1">
            ₹{feesSummary.collectedTotal.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            {feesSummary.collectionRate}% of term billing received
          </p>
        </div>

        <div
          className="p-4 rounded-xl border shadow-xs"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <span className="text-amber-600 text-xs font-semibold">Outstanding Dues</span>
          <div className="text-2xl font-extrabold font-mono tabular-nums text-amber-600 mt-1">
            ₹{feesSummary.outstandingTotal.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Pending parent payments & bank wires</p>
        </div>

        <div
          className="p-4 rounded-xl border shadow-xs"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <span className="text-slate-400 text-xs font-semibold">Collection Pacing</span>
          <div className="text-2xl font-extrabold font-mono tabular-nums mt-1" style={{ color: 'var(--color-text)' }}>
            {feesSummary.collectionRate}%
          </div>
          {/* Progress Bar */}
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 mt-2 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${feesSummary.collectionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div
        className="rounded-xl border shadow-xs overflow-hidden"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
          <div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
              Recent Fee Transactions Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Audited payment clearance log with numbered receipts
            </p>
          </div>
        </div>

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
                <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Receipt No</th>
                <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Student Name</th>
                <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Cohort</th>
                <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Payment Method</th>
                <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Amount</th>
                <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Date</th>
                <th className="py-2.5 px-4 font-semibold text-[10px] uppercase text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {feesSummary.recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-black/[0.015] dark:hover:bg-white/[0.015] transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-slate-500">
                    {tx.invoiceNumber}
                  </td>
                  <td className="py-3 px-4 font-bold" style={{ color: 'var(--color-text)' }}>
                    {tx.studentName}
                  </td>
                  <td className="py-3 px-4 text-slate-500">{tx.gradeSection}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {tx.paymentMethod}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold" style={{ color: 'var(--color-text)' }}>
                    ₹{tx.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{tx.date}</td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.status === 'cleared'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {tx.status === 'cleared' && <CheckCircle2 className="w-3 h-3" />}
                      <span>{tx.status === 'cleared' ? 'Cleared' : 'Pending Verification'}</span>
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
