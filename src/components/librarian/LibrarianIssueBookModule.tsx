import React, { useState, useMemo } from 'react';
import {
  ScanLine,
  Search,
  CheckCircle2,
  AlertTriangle,
  User,
  BookOpen,
  Calendar,
  X,
  Printer,
  Barcode,
  ArrowRight,
} from 'lucide-react';
import { BookCopy, BookTitle, LibraryMember, BookLoan } from '../../types/library';
import { useSchoolData } from '../../context/SchoolDataContext';

export const LibrarianIssueBookModule: React.FC = () => {
  const {
    libraryMembers: members,
    bookTitles: titles,
    bookCopies: copies,
    bookLoans: loans,
    issueBookLoan,
  } = useSchoolData();

  // Form selections
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [selectedCopyId, setSelectedCopyId] = useState<string>('');
  const [issueDate, setIssueDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [dueDate, setDueDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14); // 14-day standard student loan
    return d.toISOString().split('T')[0];
  });
  const [issueNotes, setIssueNotes] = useState('');

  // Search queries
  const [memberSearch, setMemberSearch] = useState('');
  const [copySearch, setCopySearch] = useState('');

  // UI state
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [issuedSlip, setIssuedSlip] = useState<BookLoan | null>(null);

  // Selected Member object
  const selectedMember = useMemo(() => {
    return members.find((m) => m.id === selectedMemberId) || null;
  }, [members, selectedMemberId]);

  // Selected Copy object
  const selectedCopy = useMemo(() => {
    return copies.find((c) => c.id === selectedCopyId) || null;
  }, [copies, selectedCopyId]);

  // Available copies list
  const availableCopies = useMemo(() => {
    return copies.filter((c) => {
      const isAvailable = c.circulationStatus === 'available';
      if (!isAvailable) return false;
      if (!copySearch) return true;
      return (
        c.bookTitle.toLowerCase().includes(copySearch.toLowerCase()) ||
        c.accessionNumber.toLowerCase().includes(copySearch.toLowerCase()) ||
        c.barcode.toLowerCase().includes(copySearch.toLowerCase())
      );
    });
  }, [copies, copySearch]);

  // Filtered members list
  const eligibleMembers = useMemo(() => {
    return members.filter((m) => {
      if (!memberSearch) return true;
      return (
        m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
        m.admissionNoOrStaffId.toLowerCase().includes(memberSearch.toLowerCase()) ||
        m.classSectionOrDept.toLowerCase().includes(memberSearch.toLowerCase())
      );
    });
  }, [members, memberSearch]);

  // Adjust due date when member changes (e.g. 60 days for staff, 14 for student)
  const handleSelectMember = (memberId: string) => {
    setSelectedMemberId(memberId);
    const m = members.find((mem) => mem.id === memberId);
    if (m) {
      const d = new Date();
      d.setDate(d.getDate() + (m.memberType === 'staff' ? 60 : 14));
      setDueDate(d.toISOString().split('T')[0]);
    }
  };

  const handleIssueBook = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMember) {
      setFeedback({ type: 'error', message: 'Please select a registered library member.' });
      return;
    }

    if (selectedMember.status === 'suspended') {
      setFeedback({
        type: 'error',
        message: `Member ${selectedMember.name} is currently suspended from borrowing privileges.`,
      });
      return;
    }

    if (selectedMember.currentIssuedCount >= selectedMember.issueLimit) {
      setFeedback({
        type: 'error',
        message: `${selectedMember.name} has already reached their maximum borrow limit of ${selectedMember.issueLimit} volumes.`,
      });
      return;
    }

    if (selectedMember.fineBalance > 100) {
      setFeedback({
        type: 'error',
        message: `Borrowing blocked: ${selectedMember.name} has outstanding library fines of ₹${selectedMember.fineBalance.toFixed(2)}.`,
      });
      return;
    }

    if (!selectedCopy) {
      setFeedback({ type: 'error', message: 'Please select an available book copy to issue.' });
      return;
    }

    if (selectedCopy.circulationStatus !== 'available') {
      setFeedback({
        type: 'error',
        message: `Copy ${selectedCopy.accessionNumber} is not available (Status: ${selectedCopy.circulationStatus}).`,
      });
      return;
    }

    // Process Issue via unified context
    const res = issueBookLoan({
      memberId: selectedMember.id,
      copyId: selectedCopy.id,
      dueDate,
      notes: issueNotes,
    });

    if (res.isValid && res.loan) {
      setIssuedSlip(res.loan);
      setSelectedCopyId('');
      setIssueNotes('');
      setFeedback({
        type: 'success',
        message: `Successfully checked out "${selectedCopy.bookTitle}" (Accession: ${selectedCopy.accessionNumber}) to ${selectedMember.name}. Due on ${dueDate}.`,
      });
    } else {
      setFeedback({
        type: 'error',
        message: res.message || 'Failed to issue book loan.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
          Circulation Desk: Issue Books
        </h2>
        <p className="text-xs text-slate-500">
          Fast checkout terminal: member verification, quota enforcement, and due date slip generation.
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
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TWO COLUMN WORKFLOW: 1. SELECT BORROWER & 2. SELECT COPY */}
      <form onSubmit={handleIssueBook} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (6 cols): BORROWER SELECTION */}
        <div
          className="lg:col-span-6 p-5 rounded-2xl border shadow-xs space-y-4"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
              1
            </span>
            <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
              Select Borrower Member
            </h3>
          </div>

          {/* Member Search input */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs"
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: 'var(--color-border)',
            }}
          >
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              placeholder="Search member by name or admission number..."
              className="w-full bg-transparent border-none outline-none text-xs"
              style={{ color: 'var(--color-text)' }}
            />
          </div>

          {/* Members Radio List */}
          <div className="max-h-56 overflow-y-auto space-y-2 border rounded-xl p-2" style={{ borderColor: 'var(--color-border)' }}>
            {eligibleMembers.map((m) => {
              const isSelected = selectedMemberId === m.id;
              const isSuspended = m.status === 'suspended';
              const isAtQuota = m.currentIssuedCount >= m.issueLimit;

              return (
                <div
                  key={m.id}
                  onClick={() => !isSuspended && handleSelectMember(m.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer text-xs ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/20 shadow-xs'
                      : isSuspended
                      ? 'opacity-50 cursor-not-allowed bg-slate-50'
                      : 'hover:bg-black/[0.02]'
                  }`}
                  style={{ borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-100">
                      {m.name}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {m.admissionNoOrStaffId}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                    <span>{m.classSectionOrDept}</span>
                    <span className={isAtQuota ? 'text-rose-600 font-bold' : 'text-teal-700'}>
                      {m.currentIssuedCount} of {m.issueLimit} on loan
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Member Summary Card */}
          {selectedMember && (
            <div className="p-3 rounded-xl border bg-teal-50/30 text-xs space-y-1.5" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center justify-between font-bold text-teal-800">
                <span>Selected: {selectedMember.name}</span>
                <span className="capitalize text-[10px] px-2 py-0.5 rounded bg-teal-100">{selectedMember.memberType}</span>
              </div>
              <div className="text-slate-600 dark:text-slate-300 text-[11px]">
                Quota: {selectedMember.currentIssuedCount}/{selectedMember.issueLimit} books · Outstanding Fine: ${selectedMember.fineBalance.toFixed(2)}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (6 cols): COPY SELECTION & TERMS */}
        <div
          className="lg:col-span-6 p-5 rounded-2xl border shadow-xs space-y-4"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
              2
            </span>
            <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
              Select Available Book Copy
            </h3>
          </div>

          {/* Copy search */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs"
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: 'var(--color-border)',
            }}
          >
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={copySearch}
              onChange={(e) => setCopySearch(e.target.value)}
              placeholder="Search available titles, accession, or barcode..."
              className="w-full bg-transparent border-none outline-none text-xs"
              style={{ color: 'var(--color-text)' }}
            />
          </div>

          {/* Available copies selection */}
          <div className="max-h-56 overflow-y-auto space-y-2 border rounded-xl p-2" style={{ borderColor: 'var(--color-border)' }}>
            {availableCopies.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No available copies matched search.
              </div>
            ) : (
              availableCopies.map((copy) => {
                const isSelected = selectedCopyId === copy.id;

                return (
                  <div
                    key={copy.id}
                    onClick={() => setSelectedCopyId(copy.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer text-xs ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/20 shadow-xs'
                        : 'hover:bg-black/[0.02]'
                    }`}
                    style={{ borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)' }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                        {copy.bookTitle}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-teal-700 shrink-0">
                        {copy.accessionNumber}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                      <span>{copy.shelfLocation}</span>
                      <span className="capitalize font-semibold text-emerald-600">{copy.condition} condition</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Loan Dates */}
          <div className="grid grid-cols-2 gap-3 text-xs pt-2">
            <div>
              <label className="font-semibold block mb-1">Issue Date</label>
              <input
                type="date"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border outline-none font-mono"
                style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border outline-none font-mono"
                style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1 text-xs">Circulation Notes / Condition on Check-out</label>
            <input
              type="text"
              value={issueNotes}
              onChange={(e) => setIssueNotes(e.target.value)}
              placeholder="e.g. Pristine condition, special study loan"
              className="w-full px-3 py-2 rounded-lg border outline-none text-xs"
              style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
            />
          </div>

          <button
            type="submit"
            disabled={!selectedMemberId || !selectedCopyId}
            className="w-full py-3 rounded-xl text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <ScanLine className="w-4 h-4" />
            <span>Confirm & Issue Book</span>
          </button>
        </div>
      </form>

      {/* PRINTABLE DUE DATE SLIP MODAL */}
      {issuedSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  Loan Confirmation Slip
                </h3>
              </div>
              <button onClick={() => setIssuedSlip(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Slip Paper Card */}
            <div className="p-4 rounded-xl border border-dashed font-mono text-xs space-y-2 bg-amber-50/40 dark:bg-amber-950/20">
              <div className="text-center pb-2 border-b border-dashed">
                <span className="font-bold text-sm block">SCHLAR LIBRARY RESOURCE CENTRE</span>
                <span className="text-[10px] text-slate-500">Circulation Check-out Receipt</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Borrower:</span>
                <span className="font-bold">{issuedSlip.memberName}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Book Title:</span>
                <span className="font-bold text-right line-clamp-1">{issuedSlip.bookTitle}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Accession No:</span>
                <span className="font-bold text-teal-700">{issuedSlip.accessionNumber}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Issue Date:</span>
                <span>{issuedSlip.issueDate}</span>
              </div>
              <div className="flex justify-between text-[11px] pt-1 border-t border-dashed font-bold text-emerald-700">
                <span>DUE DATE:</span>
                <span className="text-sm">{issuedSlip.dueDate}</span>
              </div>
              <div className="text-[10px] text-slate-400 text-center pt-2">
                Daily late fine: ₹5.00/day after 2-day grace period.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIssuedSlip(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border hover:bg-black/5"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
