import React, { useState, useMemo } from 'react';
import {
  Clock,
  RotateCcw,
  Search,
  CheckCircle2,
  AlertTriangle,
  X,
  Plus,
  BookOpen,
  Calendar,
  AlertCircle,
  Bookmark,
} from 'lucide-react';
import { BookLoan, BookReservation, LibraryMember, BookTitle } from '../../types/library';
import {
  INITIAL_BOOK_LOANS,
  INITIAL_BOOK_RESERVATIONS,
  INITIAL_LIBRARY_MEMBERS,
  INITIAL_BOOK_TITLES,
} from '../../data/initialLibraryData';

export const LibrarianRenewalsReservationsModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'renewals' | 'reservations'>('renewals');
  const [loans, setLoans] = useState<BookLoan[]>(INITIAL_BOOK_LOANS);
  const [reservations, setReservations] = useState<BookReservation[]>(INITIAL_BOOK_RESERVATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New Reservation modal
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [selectedTitleId, setSelectedTitleId] = useState<string>(INITIAL_BOOK_TITLES[0]?.id || '');
  const [selectedMemberId, setSelectedMemberId] = useState<string>(INITIAL_LIBRARY_MEMBERS[0]?.id || '');
  const [reservationNotes, setReservationNotes] = useState('');

  // Active loans eligible for renewal
  const activeLoans = useMemo(() => {
    return loans.filter((l) => l.status === 'active' || l.status === 'overdue');
  }, [loans]);

  const filteredLoans = useMemo(() => {
    return activeLoans.filter((l) => {
      if (!searchQuery) return true;
      return (
        l.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.accessionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.memberName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [activeLoans, searchQuery]);

  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      if (!searchQuery) return true;
      return (
        r.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.memberName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [reservations, searchQuery]);

  const handleRenewLoan = (loan: BookLoan) => {
    // 1. Check if max renewals reached
    if (loan.renewalCount >= loan.maxRenewals) {
      setFeedback({
        type: 'error',
        message: `Renewal rejected: ${loan.memberName} has already reached the maximum renewal limit of ${loan.maxRenewals} extensions for this item.`,
      });
      return;
    }

    // 2. Check if hold reservation exists for this title
    const hasHold = reservations.some(
      (r) => r.titleId === loan.titleId && (r.status === 'pending' || r.status === 'ready-for-pickup')
    );
    if (hasHold) {
      setFeedback({
        type: 'error',
        message: `Renewal blocked: An active hold reservation exists in the queue for "${loan.bookTitle}". The copy must be returned for the next borrower.`,
      });
      return;
    }

    // 3. Extend due date by 14 days
    const currentDue = new Date(loan.dueDate);
    currentDue.setDate(currentDue.getDate() + 14);
    const newDueDate = currentDue.toISOString().split('T')[0];

    const updated = loans.map((l) => {
      if (l.id === loan.id) {
        return {
          ...l,
          dueDate: newDueDate,
          renewalCount: l.renewalCount + 1,
          status: 'active' as const, // Clear overdue if renewed
        };
      }
      return l;
    });

    setLoans(updated);
    setFeedback({
      type: 'success',
      message: `Renewed loan for "${loan.bookTitle}" (${loan.memberName}). New Due Date: ${newDueDate} (Renewal ${loan.renewalCount + 1} of ${loan.maxRenewals}).`,
    });
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    const title = INITIAL_BOOK_TITLES.find((t) => t.id === selectedTitleId);
    const member = INITIAL_LIBRARY_MEMBERS.find((m) => m.id === selectedMemberId);
    if (!title || !member) return;

    // Check duplicate reservation
    const isDuplicate = reservations.some(
      (r) => r.titleId === title.id && r.memberId === member.id && r.status === 'pending'
    );
    if (isDuplicate) {
      setFeedback({
        type: 'error',
        message: `${member.name} already has an active hold reservation for "${title.title}".`,
      });
      return;
    }

    const titleReservations = reservations.filter(
      (r) => r.titleId === title.id && r.status === 'pending'
    );
    const queuePosition = titleReservations.length + 1;

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    const newRes: BookReservation = {
      id: `res-${Date.now()}`,
      titleId: title.id,
      bookTitle: title.title,
      memberId: member.id,
      memberName: member.name,
      memberType: member.memberType,
      reservationDate: new Date().toISOString().split('T')[0],
      queuePosition,
      status: 'pending',
      expiryDate: expiryDate.toISOString().split('T')[0],
      notes: reservationNotes,
    };

    setReservations([newRes, ...reservations]);
    setIsReserveModalOpen(false);
    setReservationNotes('');
    setFeedback({
      type: 'success',
      message: `Placed hold reservation for "${title.title}" for ${member.name} (Queue Position #${queuePosition}).`,
    });
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleCancelReservation = (resId: string) => {
    setReservations(
      reservations.map((r) => (r.id === resId ? { ...r, status: 'cancelled' } : r))
    );
    setFeedback({ type: 'success', message: 'Cancelled hold reservation.' });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleMarkReadyForPickup = (resId: string) => {
    const pickupDate = new Date();
    pickupDate.setDate(pickupDate.getDate() + 3);

    setReservations(
      reservations.map((r) =>
        r.id === resId
          ? {
              ...r,
              status: 'ready-for-pickup',
              pickupDeadline: pickupDate.toISOString().split('T')[0],
            }
          : r
      )
    );
    setFeedback({
      type: 'success',
      message: 'Notified member that book copy is waiting on the hold shelf (Hold valid for 3 days).',
    });
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Loan Renewals & Hold Reservations
          </h2>
          <p className="text-xs text-slate-500">
            Extend active loan tenures with quota checks and manage student reservation queues.
          </p>
        </div>

        <button
          onClick={() => setIsReserveModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-90 self-start sm:self-auto"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Plus className="w-4 h-4" />
          <span>New Hold Reservation</span>
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

      {/* TABS */}
      <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: 'var(--color-border)' }}>
        <button
          onClick={() => setActiveSubTab('renewals')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeSubTab === 'renewals'
              ? 'bg-black/10 dark:bg-white/10 text-teal-800 dark:text-teal-300 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Active Loan Renewals ({activeLoans.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('reservations')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeSubTab === 'reservations'
              ? 'bg-black/10 dark:bg-white/10 text-teal-800 dark:text-teal-300 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Hold Reservations Queue ({reservations.filter((r) => r.status === 'pending').length})</span>
        </button>
      </div>

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
          placeholder="Filter titles or borrowers..."
          className="w-full bg-transparent border-none outline-none text-xs"
          style={{ color: 'var(--color-text)' }}
        />
      </div>

      {/* RENEWALS SUBTAB */}
      {activeSubTab === 'renewals' && (
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
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Accession / Title</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Borrower</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Current Due Date</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Renewal Count</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {filteredLoans.map((loan) => {
                  const canRenew = loan.renewalCount < loan.maxRenewals;

                  return (
                    <tr key={loan.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                      <td className="py-3 px-4">
                        <span className="font-bold block" style={{ color: 'var(--color-text)' }}>
                          {loan.bookTitle}
                        </span>
                        <span className="font-mono text-[11px] text-teal-700">
                          {loan.accessionNumber}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold block">{loan.memberName}</span>
                        <span className="text-[10px] text-slate-400 capitalize">{loan.memberType}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                        {loan.dueDate}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[11px] bg-black/5 dark:bg-white/5">
                          {loan.renewalCount} of {loan.maxRenewals} max
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleRenewLoan(loan)}
                          disabled={!canRenew}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            canRenew
                              ? 'bg-teal-700 text-white hover:bg-teal-800 shadow-xs'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {canRenew ? 'Extend Due (+14 Days)' : 'Limit Reached'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RESERVATIONS SUBTAB */}
      {activeSubTab === 'reservations' && (
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
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Book Title</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Reserved By</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Queue Position</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Reserved Date</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Status</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {filteredReservations.map((res) => (
                  <tr key={res.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-bold" style={{ color: 'var(--color-text)' }}>
                      {res.bookTitle}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold block">{res.memberName}</span>
                      <span className="text-[10px] text-slate-400 capitalize">{res.memberType}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full font-mono font-bold text-[11px] bg-teal-50 text-teal-800 border border-teal-200">
                        #{res.queuePosition}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{res.reservationDate}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                          res.status === 'ready-for-pickup'
                            ? 'bg-emerald-100 text-emerald-800'
                            : res.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {res.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {res.status === 'pending' && (
                          <button
                            onClick={() => handleMarkReadyForPickup(res.id)}
                            className="px-2.5 py-1 rounded text-[11px] font-semibold border text-teal-700 border-teal-200 hover:bg-teal-50"
                          >
                            Ready for Pickup
                          </button>
                        )}
                        {res.status !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelReservation(res.id)}
                            className="px-2.5 py-1 rounded text-[11px] font-semibold border text-rose-600 border-rose-200 hover:bg-rose-50"
                          >
                            Cancel Hold
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE RESERVATION MODAL */}
      {isReserveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleCreateReservation}
            className="w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-teal-700" />
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  Place Hold Reservation
                </h3>
              </div>
              <button type="button" onClick={() => setIsReserveModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Select Book Title *</label>
                <select
                  value={selectedTitleId}
                  onChange={(e) => setSelectedTitleId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                >
                  {INITIAL_BOOK_TITLES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.categoryName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Select Reserving Member *</label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                >
                  {INITIAL_LIBRARY_MEMBERS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.classSectionOrDept})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Reservation Notes</label>
                <input
                  type="text"
                  value={reservationNotes}
                  onChange={(e) => setReservationNotes(e.target.value)}
                  placeholder="e.g. Research project priority, notify parent email"
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => setIsReserveModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border hover:bg-black/5"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Confirm Hold
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
