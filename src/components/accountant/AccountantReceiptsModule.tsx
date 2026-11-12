import React, { useState } from 'react';
import { INITIAL_TRANSACTIONS } from '../../data/initialFinanceData';
import { FeePaymentTransaction } from '../../types/finance';
import { SchlarLogo } from '../brand/SchlarLogo';
import {
  Receipt,
  Search,
  Filter,
  Eye,
  Printer,
  CheckCircle2,
  Calendar,
  CreditCard,
  X,
  Download,
} from 'lucide-react';

export const AccountantReceiptsModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [selectedReceipt, setSelectedReceipt] = useState<FeePaymentTransaction | null>(null);

  const filteredReceipts = INITIAL_TRANSACTIONS.filter((t) => {
    const matchesSearch =
      t.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.transactionRef.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = methodFilter === 'all' || t.paymentMethod === methodFilter;
    return matchesSearch && matchesMethod;
  });

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
              Document Vault
            </span>
            <span className="text-xs text-slate-400">Official Payment Documents</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Fee Receipts
          </h1>
          <p className="text-sm mt-1 max-w-2xl text-slate-500">
            Search immutable payment receipts, review stamped breakdowns, and print duplicate copies.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div
        className="p-4 rounded-xl border shadow-xs flex flex-col sm:flex-row gap-3"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex-1 relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by receipt number (e.g. REC-2026-0041) or student name..."
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
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border text-xs outline-hidden font-medium"
          style={{
            backgroundColor: 'var(--color-background)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
        >
          <option value="all">All Payment Methods</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Card">Debit / Credit Card</option>
          <option value="Cheque">Cheque</option>
          <option value="Cash">Cash</option>
          <option value="UPI">UPI</option>
        </select>
      </div>

      {/* Receipts Table */}
      <div
        className="rounded-xl border shadow-xs overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Receipt No</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Student</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Payment Date</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Method</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Transaction Ref</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Amount Paid</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {filteredReceipts.map((r) => (
                <tr key={r.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold" style={{ color: 'var(--color-primary)' }}>
                    {r.receiptNo}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold" style={{ color: 'var(--color-text)' }}>
                      {r.studentName}
                    </div>
                    <div className="text-[10px] text-slate-400">{r.className}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{r.paymentDate}</td>
                  <td className="py-3 px-4">{r.paymentMethod}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{r.transactionRef}</td>
                  <td className="py-3 px-4 text-right font-mono font-extrabold text-emerald-600">
                    ₹{r.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedReceipt(r)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold text-white shadow-xs hover:opacity-90 ml-auto"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      <Eye className="w-3 h-3" />
                      <span>View Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-lg rounded-2xl border shadow-2xl p-6 animate-in zoom-in-95 duration-150"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                <h3 className="text-base font-bold">Official Payment Receipt</h3>
              </div>
              <button onClick={() => setSelectedReceipt(null)} className="p-1 rounded text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-4 text-xs">
              <div className="flex items-start justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
                <div>
                  <SchlarLogo />
                  <div className="text-[10px] text-slate-400 mt-1">SCHLAR School Management System</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
                    {selectedReceipt.receiptNo}
                  </div>
                  <div className="text-[10px] text-slate-400">{selectedReceipt.paymentDate}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Student</span>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{selectedReceipt.studentName}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Class & Section</span>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{selectedReceipt.className}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Method</span>
                  <div>{selectedReceipt.paymentMethod}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Transaction Ref</span>
                  <div className="font-mono">{selectedReceipt.transactionRef}</div>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                  Allocation Breakdown
                </span>
                <div className="space-y-1">
                  {selectedReceipt.allocatedBreakdown.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{item.feeName}</span>
                      <span className="font-mono font-semibold">₹{item.amount.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2 mt-2 font-bold text-slate-900 dark:text-slate-100 text-sm">
                  <span>Total Amount Paid</span>
                  <span className="font-mono text-emerald-600">₹{selectedReceipt.amount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Issued by: {selectedReceipt.recordedBy}</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Status: Cleared
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold hover:opacity-85"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Copy</span>
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
