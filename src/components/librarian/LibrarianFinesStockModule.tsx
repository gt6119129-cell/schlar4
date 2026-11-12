import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  X,
  CreditCard,
  FileText,
  Search,
  Plus,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { LibraryFine, StockAuditSession, BookCopy, BookCondition } from '../../types/library';
import {
  INITIAL_LIBRARY_FINES,
  INITIAL_STOCK_AUDIT,
  INITIAL_BOOK_COPIES,
} from '../../data/initialLibraryData';

export const LibrarianFinesStockModule: React.FC = () => {
  const [fines, setFines] = useState<LibraryFine[]>(INITIAL_LIBRARY_FINES);
  const [auditSession, setAuditSession] = useState<StockAuditSession>(INITIAL_STOCK_AUDIT);
  const [copies, setCopies] = useState<BookCopy[]>(INITIAL_BOOK_COPIES);
  const [activeTab, setActiveTab] = useState<'fines' | 'lost-damaged' | 'stock-audit'>('fines');

  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Payment simulation modal
  const [selectedFineForPayment, setSelectedFineForPayment] = useState<LibraryFine | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  // Waiver modal
  const [selectedFineForWaiver, setSelectedFineForWaiver] = useState<LibraryFine | null>(null);
  const [waiverReason, setWaiverReason] = useState('');

  // Lost/damaged reporting modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedCopyId, setSelectedCopyId] = useState(INITIAL_BOOK_COPIES[0]?.id || '');
  const [incidentType, setIncidentType] = useState<'lost' | 'damaged' | 'missing'>('damaged');
  const [incidentNotes, setIncidentNotes] = useState('');
  const [replacementCost, setReplacementCost] = useState(45);

  const filteredFines = useMemo(() => {
    return fines.filter((f) => {
      if (!searchQuery) return true;
      return (
        f.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.accessionNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [fines, searchQuery]);

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFineForPayment) return;

    const receiptNo = `LIB-REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const updated = fines.map((f) => {
      if (f.id === selectedFineForPayment.id) {
        const totalPaid = f.amountPaid + paymentAmount;
        const isFullyPaid = totalPaid >= f.netFine;
        return {
          ...f,
          amountPaid: totalPaid,
          paymentStatus: isFullyPaid ? ('paid' as const) : ('partially-paid' as const),
          paidDate: new Date().toISOString().split('T')[0],
          receiptNumber: receiptNo,
        };
      }
      return f;
    });

    setFines(updated);
    setSelectedFineForPayment(null);
    setFeedback({
      type: 'success',
      message: `Recorded payment of ₹${paymentAmount.toFixed(2)} from ${selectedFineForPayment.memberName}. Generated receipt #${receiptNo}.`,
    });
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleApplyWaiver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFineForWaiver) return;

    const updated = fines.map((f) => {
      if (f.id === selectedFineForWaiver.id) {
        return {
          ...f,
          discountOrWaiver: f.grossFine,
          netFine: 0,
          paymentStatus: 'waived' as const,
          waiverReason,
        };
      }
      return f;
    });

    setFines(updated);
    setSelectedFineForWaiver(null);
    setWaiverReason('');
    setFeedback({
      type: 'success',
      message: `Waived outstanding fine for ${selectedFineForWaiver.memberName} with logged authorization reason.`,
    });
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleReportIncident = (e: React.FormEvent) => {
    e.preventDefault();
    const copy = copies.find((c) => c.id === selectedCopyId);
    if (!copy) return;

    // Update copy condition
    setCopies(
      copies.map((c) => {
        if (c.id === copy.id) {
          return {
            ...c,
            condition: incidentType as BookCondition,
            circulationStatus: incidentType === 'damaged' ? 'under-repair' : 'withdrawn',
            conditionNotes: incidentNotes,
          };
        }
        return c;
      })
    );

    setIsReportModalOpen(false);
    setIncidentNotes('');
    setFeedback({
      type: 'success',
      message: `Marked copy ${copy.accessionNumber} ("${copy.bookTitle}") as ${incidentType.toUpperCase()}. Replacement assessment charge: ₹${replacementCost}.`,
    });
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Fines, Lost/Damaged & Stock Verification
          </h2>
          <p className="text-xs text-slate-500">
            Late fee accounting, replacement cost assessments, lost volume write-offs, and physical stack audits.
          </p>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-90 self-start sm:self-auto"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Report Lost / Damaged Volume</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between gap-2 animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TABS */}
      <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: 'var(--color-border)' }}>
        <button
          onClick={() => setActiveTab('fines')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'fines'
              ? 'bg-black/10 dark:bg-white/10 text-teal-800 dark:text-teal-300 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Assessed Fines & Ledgers ({fines.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('stock-audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'stock-audit'
              ? 'bg-black/10 dark:bg-white/10 text-teal-800 dark:text-teal-300 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Stock Verification & Discrepancies</span>
        </button>
      </div>

      {/* FINES TAB */}
      {activeTab === 'fines' && (
        <div className="space-y-4">
          {/* SEARCH */}
          <div
            className="p-3 rounded-xl border flex items-center gap-2 shadow-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fine records by member or title..."
              className="w-full bg-transparent border-none outline-none text-xs"
              style={{ color: 'var(--color-text)' }}
            />
          </div>

          <div
            className="rounded-xl border shadow-xs overflow-hidden"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr
                    className="border-b"
                    style={{
                      backgroundColor: 'var(--color-table-header, #f9fafb)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase">Borrower</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase">Book Title</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Overdue Days</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Gross Fine</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Waiver / Disc</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Net Due</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Status</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                  {filteredFines.map((fine) => {
                    const isUnpaid = fine.paymentStatus === 'unpaid';

                    return (
                      <tr key={fine.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                        <td className="py-3 px-4">
                          <span className="font-bold block" style={{ color: 'var(--color-text)' }}>
                            {fine.memberName}
                          </span>
                          <span className="text-[10px] text-slate-400 capitalize">{fine.memberType}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium block">{fine.bookTitle}</span>
                          <span className="font-mono text-[10px] text-teal-700">{fine.accessionNumber}</span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono">
                          {fine.overdueDays} days (Grace: {fine.gracePeriodDays}d)
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-500">
                          ₹{fine.grossFine.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-400">
                          ₹{fine.discountOrWaiver.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">
                          ₹{(fine.netFine - fine.amountPaid).toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                              fine.paymentStatus === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : fine.paymentStatus === 'waived'
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {fine.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isUnpaid && (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedFineForPayment(fine);
                                    setPaymentAmount(fine.netFine - fine.amountPaid);
                                  }}
                                  className="px-2.5 py-1 rounded text-[11px] font-semibold bg-emerald-700 text-white hover:bg-emerald-800"
                                >
                                  Collect
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedFineForWaiver(fine);
                                    setWaiverReason('');
                                  }}
                                  className="px-2.5 py-1 rounded text-[11px] font-semibold border hover:bg-black/5"
                                  style={{ borderColor: 'var(--color-border)' }}
                                >
                                  Waive
                                </button>
                              </>
                            )}
                            {fine.receiptNumber && (
                              <span className="font-mono text-[10px] text-slate-400">
                                {fine.receiptNumber}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* STOCK AUDIT TAB */}
      {activeTab === 'stock-audit' && (
        <div className="space-y-4">
          {/* Active audit summary card */}
          <div
            className="p-5 rounded-xl border shadow-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b gap-2" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                  Annual Physical Verification
                </span>
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  {auditSession.sessionName}
                </h3>
                <span className="text-xs text-slate-400">
                  Audited on {auditSession.auditDate} by {auditSession.verifiedBy}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 self-start sm:self-auto">
                Status: {auditSession.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 text-center">
              <div className="p-3 rounded-lg border bg-black/[0.02]" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-xs text-slate-400 block">Total Audited</span>
                <span className="text-xl font-bold font-mono">{auditSession.totalAudited}</span>
              </div>
              <div className="p-3 rounded-lg border bg-black/[0.02]" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-xs text-slate-400 block">Matched In Stacks</span>
                <span className="text-xl font-bold font-mono text-emerald-600">{auditSession.matchedCount}</span>
              </div>
              <div className="p-3 rounded-lg border bg-black/[0.02]" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-xs text-slate-400 block">Discrepancies / Damage</span>
                <span className="text-xl font-bold font-mono text-amber-600">{auditSession.discrepanciesCount}</span>
              </div>
            </div>

            {/* Discrepancies Table */}
            <div className="mt-5 border rounded-xl overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
              <div className="p-3 bg-black/[0.02] border-b" style={{ borderColor: 'var(--color-border)' }}>
                <h4 className="text-xs font-bold">Discrepancy & Shelf Sweep Audit Items</h4>
              </div>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b text-[10px] uppercase text-slate-400" style={{ borderColor: 'var(--color-border)' }}>
                    <th className="py-2.5 px-3">Accession No</th>
                    <th className="py-2.5 px-3">Title</th>
                    <th className="py-2.5 px-3">Shelf Location</th>
                    <th className="py-2.5 px-3">Expected</th>
                    <th className="py-2.5 px-3">Observed Grade</th>
                    <th className="py-2.5 px-3">Auditor Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                  {auditSession.discrepancies.map((d, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-mono font-bold text-teal-700">{d.accessionNumber}</td>
                      <td className="py-2.5 px-3 font-medium">{d.title}</td>
                      <td className="py-2.5 px-3 text-slate-500">{d.shelfLocation}</td>
                      <td className="py-2.5 px-3 capitalize">{d.expectedStatus}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                            d.observedStatus === 'damaged'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {d.observedStatus}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 text-[11px]">{d.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* COLLECT PAYMENT MODAL */}
      {selectedFineForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleRecordPayment}
            className="w-full max-w-sm rounded-2xl border p-6 shadow-2xl space-y-4"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                  Record Fine Payment
                </h3>
              </div>
              <button type="button" onClick={() => setSelectedFineForPayment(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="text-xs space-y-2">
              <div>
                <span className="text-slate-400 block text-[10px]">Borrower</span>
                <span className="font-semibold">{selectedFineForPayment.memberName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Book Title</span>
                <span className="font-medium line-clamp-1">{selectedFineForPayment.bookTitle}</span>
              </div>
              <div>
                <label className="font-semibold block mb-1">Payment Amount (₹ INR) *</label>
                <input
                  type="number"
                  step="0.10"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border outline-none font-mono text-base font-bold"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => setSelectedFineForPayment(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border hover:bg-black/5"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-700 text-white shadow-sm hover:bg-emerald-800"
              >
                Issue Receipt & Settle
              </button>
            </div>
          </form>
        </div>
      )}

      {/* WAIVER MODAL */}
      {selectedFineForWaiver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleApplyWaiver}
            className="w-full max-w-sm rounded-2xl border p-6 shadow-2xl space-y-4"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                Approve Fine Waiver
              </h3>
              <button type="button" onClick={() => setSelectedFineForWaiver(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div>
                <span className="text-slate-400 block text-[10px]">Member</span>
                <span className="font-semibold">{selectedFineForWaiver.memberName}</span>
              </div>
              <div>
                <label className="font-semibold block mb-1">Waiver Justification / Reason *</label>
                <textarea
                  required
                  rows={2}
                  value={waiverReason}
                  onChange={(e) => setWaiverReason(e.target.value)}
                  placeholder="e.g. Medical leave exemption, department head authorization"
                  className="w-full px-3 py-2 rounded-lg border outline-none text-xs"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => setSelectedFineForWaiver(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border hover:bg-black/5"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-teal-700 text-white shadow-sm"
              >
                Confirm Waiver
              </button>
            </div>
          </form>
        </div>
      )}

      {/* REPORT LOST / DAMAGED MODAL */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleReportIncident}
            className="w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  Report Lost / Damaged Volume
                </h3>
              </div>
              <button type="button" onClick={() => setIsReportModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Select Accessioned Volume *</label>
                <select
                  value={selectedCopyId}
                  onChange={(e) => setSelectedCopyId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                >
                  {copies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.accessionNumber} — {c.bookTitle} ({c.shelfLocation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Incident Classification *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['damaged', 'lost', 'missing'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setIncidentType(type)}
                      className={`py-2 px-3 rounded-lg border font-semibold capitalize text-center ${
                        incidentType === type
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'hover:bg-black/5'
                      }`}
                      style={incidentType !== type ? { borderColor: 'var(--color-border)' } : {}}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Replacement Valuation (₹ INR)</label>
                <input
                  type="number"
                  value={replacementCost}
                  onChange={(e) => setReplacementCost(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border outline-none font-mono"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Incident Circumstance & Notes *</label>
                <textarea
                  required
                  rows={2}
                  value={incidentNotes}
                  onChange={(e) => setIncidentNotes(e.target.value)}
                  placeholder="Circumstances of loss, borrower liability, or damage inspection..."
                  className="w-full px-3 py-2 rounded-lg border outline-none text-xs"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border hover:bg-black/5"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm bg-rose-700 hover:bg-rose-800"
              >
                Log Report
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
