import React, { useMemo } from 'react';
import {
  BookOpen,
  Library,
  ScanLine,
  AlertTriangle,
  Clock,
  Users,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  BookMarked,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import {
  INITIAL_BOOK_TITLES,
  INITIAL_BOOK_COPIES,
  INITIAL_BOOK_LOANS,
  INITIAL_LIBRARY_MEMBERS,
  INITIAL_LIBRARY_FINES,
  INITIAL_BOOK_RESERVATIONS,
} from '../../data/initialLibraryData';

interface LibrarianDashboardOverviewProps {
  onNavigateTab: (tabId: string) => void;
}

export const LibrarianDashboardOverview: React.FC<LibrarianDashboardOverviewProps> = ({
  onNavigateTab,
}) => {
  // Derive live statistics from demo state
  const stats = useMemo(() => {
    const totalTitles = INITIAL_BOOK_TITLES.length;
    const totalCopies = INITIAL_BOOK_COPIES.length;
    const availableCopies = INITIAL_BOOK_COPIES.filter(
      (c) => c.circulationStatus === 'available'
    ).length;
    const issuedCopies = INITIAL_BOOK_COPIES.filter(
      (c) => c.circulationStatus === 'issued'
    ).length;
    const activeLoans = INITIAL_BOOK_LOANS.filter((l) => l.status === 'active' || l.status === 'overdue');
    const overdueLoans = INITIAL_BOOK_LOANS.filter((l) => l.status === 'overdue');
    const pendingReservations = INITIAL_BOOK_RESERVATIONS.filter(
      (r) => r.status === 'pending' || r.status === 'ready-for-pickup'
    );
    const activeMembers = INITIAL_LIBRARY_MEMBERS.filter((m) => m.status === 'active').length;
    const totalFines = INITIAL_LIBRARY_FINES.filter((f) => f.paymentStatus === 'unpaid').reduce(
      (acc, curr) => acc + (curr.netFine - curr.amountPaid),
      0
    );

    return {
      totalTitles,
      totalCopies,
      availableCopies,
      issuedCopies,
      activeLoansCount: activeLoans.length,
      overdueLoansCount: overdueLoans.length,
      pendingReservationsCount: pendingReservations.length,
      activeMembers,
      totalFines,
    };
  }, []);

  const overdueList = useMemo(() => {
    return INITIAL_BOOK_LOANS.filter((l) => l.status === 'overdue');
  }, []);

  const recentLoans = useMemo(() => {
    return INITIAL_BOOK_LOANS.slice(0, 6);
  }, []);

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div
        className="rounded-2xl p-6 sm:p-8 border shadow-sm relative overflow-hidden transition-colors"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border"
              style={{
                backgroundColor: 'var(--color-subtle-accent, rgba(0,0,0,0.04))',
                borderColor: 'var(--color-border)',
                color: 'var(--color-primary)',
              }}
            >
              <Library className="w-3.5 h-3.5" />
              <span>Library & Information Resource Centre</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
              Librarian Circulation Hub
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Dewey-decimal catalog holdings, real-time circulation desk terminal, student and faculty borrowing quotas, overdue fine recovery, and physical stack audits.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('issue-books')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <ScanLine className="w-4 h-4" />
              <span>Issue Book</span>
            </button>
            <button
              onClick={() => onNavigateTab('return-books')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold rounded-xl border transition-all hover:bg-black/5 dark:hover:bg-white/5 active:scale-95"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
                backgroundColor: 'var(--color-surface)',
              }}
            >
              <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--color-secondary)' }} />
              <span>Return Desk</span>
            </button>
            <button
              onClick={() => onNavigateTab('book-catalogue')}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold rounded-xl border hover:opacity-85"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
                backgroundColor: 'var(--color-surface)',
              }}
            >
              <BookMarked className="w-4 h-4 text-slate-400" />
              <span>Catalogue</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI METRIC CARDS (4 PRIMARY METRICS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Catalogue & Copies */}
        <div
          onClick={() => onNavigateTab('book-catalogue')}
          className="p-5 rounded-xl border shadow-xs transition-all hover:shadow-md cursor-pointer group flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Catalogued Titles</span>
            <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black font-mono tracking-tight" style={{ color: 'var(--color-text)' }}>
              {stats.totalTitles} <span className="text-xs font-normal text-slate-400">titles</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {stats.totalCopies} physical volumes in stacks
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-teal-700 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <span>{stats.availableCopies} available for loan</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 2: Active Circulation */}
        <div
          onClick={() => onNavigateTab('issue-books')}
          className="p-5 rounded-xl border shadow-xs transition-all hover:shadow-md cursor-pointer group flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Currently On Loan</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <ScanLine className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black font-mono tracking-tight" style={{ color: 'var(--color-text)' }}>
              {stats.activeLoansCount} <span className="text-xs font-normal text-slate-400">active loans</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {stats.issuedCopies} physical copies checked out
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <span>Across student & staff borrowers</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 3: Overdue Loans */}
        <div
          onClick={() => onNavigateTab('overdue-books')}
          className="p-5 rounded-xl border shadow-xs transition-all hover:shadow-md cursor-pointer group flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Overdue Returns</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black font-mono tracking-tight text-amber-600">
              {stats.overdueLoansCount} <span className="text-xs font-normal text-slate-400">items</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Automated reminder notices sent
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <span>Review overdue items & fines</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 4: Fines & Reservations */}
        <div
          onClick={() => onNavigateTab('overdue-books')}
          className="p-5 rounded-xl border shadow-xs transition-all hover:shadow-md cursor-pointer group flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Unpaid Fines & Holds</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black font-mono tracking-tight" style={{ color: 'var(--color-text)' }}>
              ₹{stats.totalFines.toFixed(2)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {stats.pendingReservationsCount} active hold reservations
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <span>Daily fine rate: ₹5.00 (2-day grace)</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID: OVERDUE ALERTS + RECENT CIRCULATION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1/3): Overdue Recall Notices */}
        <div
          className="rounded-xl border p-5 shadow-xs flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b mb-3" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                  Overdue Return Recall
                </h3>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                {overdueList.length} items
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Items exceeding configured loan periods with assessed daily late charges.
            </p>

            <div className="space-y-2.5">
              {overdueList.map((loan) => (
                <div
                  key={loan.id}
                  className="p-3 rounded-lg border bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/70 text-xs space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                      {loan.bookTitle}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-200/60 text-amber-900">
                      Due: {loan.dueDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                    <span>Borrower: <strong className="text-slate-800 dark:text-slate-200">{loan.memberName}</strong> ({loan.memberType})</span>
                    <span className="font-mono font-bold text-amber-700 dark:text-amber-400">Fine: ${loan.assessedFine.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('overdue-books')}
            className="w-full mt-4 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <span>Open Overdue & Fines Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Column (2/3): Recent Circulation Transactions */}
        <div
          className="lg:col-span-2 rounded-xl border shadow-xs overflow-hidden"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div
            className="p-4 border-b flex items-center justify-between"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div>
              <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                Recent Circulation Transactions
              </h3>
              <p className="text-xs text-slate-500">
                Live borrow, return, and renewal desk audit activity
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('library-reports')}
              className="text-xs font-semibold flex items-center gap-1 text-teal-700 hover:underline"
            >
              <span>View All Reports</span>
              <ArrowRight className="w-3 h-3" />
            </button>
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
                  <th className="py-2.5 px-3 font-semibold text-[10px] uppercase">Accession / Copy</th>
                  <th className="py-2.5 px-3 font-semibold text-[10px] uppercase">Book Title</th>
                  <th className="py-2.5 px-3 font-semibold text-[10px] uppercase">Borrower</th>
                  <th className="py-2.5 px-3 font-semibold text-[10px] uppercase">Issued Date</th>
                  <th className="py-2.5 px-3 font-semibold text-[10px] uppercase">Due Date</th>
                  <th className="py-2.5 px-3 font-semibold text-[10px] uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {recentLoans.map((loan) => {
                  const isOverdue = loan.status === 'overdue';
                  const isReturned = loan.status === 'returned';

                  return (
                    <tr key={loan.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-500">
                        {loan.accessionNumber}
                      </td>
                      <td className="py-2.5 px-3 font-medium" style={{ color: 'var(--color-text)' }}>
                        <span className="line-clamp-1">{loan.bookTitle}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                        <span className="font-semibold block">{loan.memberName}</span>
                        <span className="text-[10px] text-slate-400 capitalize">{loan.memberType}</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{loan.issueDate}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{loan.dueDate}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                            isOverdue
                              ? 'bg-rose-100 text-rose-800'
                              : isReturned
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {loan.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
