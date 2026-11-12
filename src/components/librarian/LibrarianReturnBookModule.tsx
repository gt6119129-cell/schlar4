import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Search,
  AlertTriangle,
  CheckCircle2,
  X,
  BookOpen,
  DollarSign,
  Barcode,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { BookLoan, BookCopy, BookCondition } from '../../types/library';
import { useSchoolData } from '../../context/SchoolDataContext';

export const LibrarianReturnBookModule: React.FC = () => {
  const { bookLoans: loans, bookCopies: copies, returnBookLoan } = useSchoolData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLoan, setSelectedLoan] = useState<BookLoan | null>(null);

  // Return inspection form
  const [returnCondition, setReturnCondition] = useState<BookCondition>('good');
  const [damageNotes, setDamageNotes] = useState('');
  const [returnDate, setReturnDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Active or overdue loans
  const activeLoans = useMemo(() => {
    return loans.filter((l) => l.status === 'active' || l.status === 'overdue');
  }, [loans]);

  const filteredLoans = useMemo(() => {
    return activeLoans.filter((loan) => {
      if (!searchQuery) return true;
      return (
        loan.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.accessionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.memberName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [activeLoans, searchQuery]);

  // Fine calculation for selected loan
  const fineCalculation = useMemo(() => {
    if (!selectedLoan) return { overdueDays: 0, assessedFine: 0, isOverdue: false };

    const due = new Date(selectedLoan.dueDate);
    const ret = new Date(returnDate);
    const diffTime = ret.getTime() - due.getTime();
    const overdueDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const gracePeriod = 2; // 2 days grace
    const chargeableDays = Math.max(0, overdueDays - gracePeriod);
    const fineRate = selectedLoan.dailyFineRate || 5.00;
    const assessedFine = chargeableDays * fineRate;

    return {
      overdueDays,
      chargeableDays,
      assessedFine,
      isOverdue: overdueDays > 0,
    };
  }, [selectedLoan, returnDate]);

  const handleConfirmReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoan) return;

    // Process Return via unified context
    const res = returnBookLoan(selectedLoan.id, returnCondition, damageNotes);

    if (res.isValid) {
      setFeedback({
        type: 'success',
        message: `Checked in "${selectedLoan.bookTitle}" (Accession: ${selectedLoan.accessionNumber}) from ${selectedLoan.memberName}.${
          fineCalculation.assessedFine > 0
            ? ` Overdue fine: ₹${fineCalculation.assessedFine.toFixed(2)} recorded.`
            : ' Returned without late charges.'
        } Copy returned to available circulation status.`,
      });
      setSelectedLoan(null);
      setDamageNotes('');
    } else {
      setFeedback({
        type: 'error',
        message: res.message || 'Failed to process return.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
          Circulation Desk: Return Books
        </h2>
        <p className="text-xs text-slate-500">
          Check-in desk, return inspection, fine assessment calculation, and shelf restock staging.
        </p>
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
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SEARCH BAR */}
      <div
        className="p-4 rounded-xl border flex items-center gap-3 shadow-xs"
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
          placeholder="Search active loans by book title, accession number, or borrower name..."
          className="w-full bg-transparent border-none outline-none text-xs"
          style={{ color: 'var(--color-text)' }}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ACTIVE LOANS TABLE */}
      <div
        className="rounded-xl border shadow-xs overflow-hidden"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="p-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
          <h3 className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>
            Active Loans Eligible for Return ({filteredLoans.length} volumes outstanding)
          </h3>
        </div>

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
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Accession No</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Book Title</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Borrower</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Issued On</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Due Date</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No matching active loans found.
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => {
                  const isOverdue = loan.status === 'overdue';

                  return (
                    <tr key={loan.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-mono font-bold text-teal-700">
                        {loan.accessionNumber}
                      </td>
                      <td className="py-3 px-4 font-medium" style={{ color: 'var(--color-text)' }}>
                        <span className="line-clamp-1">{loan.bookTitle}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold block">{loan.memberName}</span>
                        <span className="text-[10px] text-slate-400 capitalize">{loan.memberType}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">{loan.issueDate}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        <span className={isOverdue ? 'text-rose-600 font-bold' : ''}>
                          {loan.dueDate}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                            isOverdue ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {loan.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedLoan(loan);
                            setReturnCondition('good');
                            setDamageNotes('');
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs hover:opacity-90"
                          style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                          Check In
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RETURN INSPECTION & FINE MODAL */}
      {selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleConfirmReturn}
            className="w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-start justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <span className="font-mono text-[10px] font-bold text-teal-700">
                  {selectedLoan.accessionNumber}
                </span>
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  Return Inspection & Check-in Desk
                </h3>
              </div>
              <button type="button" onClick={() => setSelectedLoan(null)} className="p-1 rounded hover:bg-black/5">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Book & Borrower overview */}
            <div className="p-3 rounded-xl border bg-black/[0.02] text-xs space-y-1" style={{ borderColor: 'var(--color-border)' }}>
              <div className="font-bold text-slate-800 dark:text-slate-100">
                {selectedLoan.bookTitle}
              </div>
              <div className="text-slate-500 text-[11px]">
                Borrower: <strong>{selectedLoan.memberName}</strong> ({selectedLoan.memberType}) · Issued: {selectedLoan.issueDate}
              </div>
            </div>

            {/* Date and Overdue/Fine Box */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Return Check-in Date</label>
                <input
                  type="date"
                  required
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border outline-none font-mono"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Due Date</label>
                <input
                  type="text"
                  disabled
                  value={selectedLoan.dueDate}
                  className="w-full px-3 py-2 rounded-lg border outline-none font-mono bg-slate-100 dark:bg-slate-800 text-slate-500"
                />
              </div>
            </div>

            {/* Fine Assessment Calculation Banner */}
            <div
              className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                fineCalculation.assessedFine > 0
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" />
                  <span>Late Fine Assessment:</span>
                </div>
                <span className="text-sm font-mono">₹{fineCalculation.assessedFine.toFixed(2)}</span>
              </div>
              <div className="text-[11px] opacity-80">
                {fineCalculation.overdueDays > 0 ? (
                  <>
                    Overdue by {fineCalculation.overdueDays} days (2-day grace period applied: {fineCalculation.chargeableDays} billable days @ ₹5.00/day).
                  </>
                ) : (
                  <>Returned on or before due date. Zero overdue penalty assessed.</>
                )}
              </div>
            </div>

            {/* Condition on Return */}
            <div>
              <label className="font-semibold block mb-1.5 text-xs">Physical Condition on Return *</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['good', 'fair', 'damaged'] as BookCondition[]).map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setReturnCondition(cond)}
                    className={`py-2 px-3 rounded-lg border font-semibold capitalize text-center transition-all ${
                      returnCondition === cond
                        ? 'bg-teal-700 text-white border-teal-700'
                        : 'hover:bg-black/5'
                    }`}
                    style={returnCondition !== cond ? { borderColor: 'var(--color-border)' } : {}}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            {returnCondition === 'damaged' && (
              <div>
                <label className="font-semibold block mb-1 text-xs text-rose-700">
                  Damage Notes & Action Required *
                </label>
                <textarea
                  required
                  rows={2}
                  value={damageNotes}
                  onChange={(e) => setDamageNotes(e.target.value)}
                  placeholder="Describe damage (torn pages, water damage, cracked binding). Will flag volume as 'Under-Repair'."
                  className="w-full px-3 py-2 rounded-lg border outline-none text-xs border-rose-300"
                  style={{ backgroundColor: 'var(--color-background)' }}
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => setSelectedLoan(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border hover:bg-black/5"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-90"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Confirm Return & Check In
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
