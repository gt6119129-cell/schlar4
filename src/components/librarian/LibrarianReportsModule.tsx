import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Filter,
  BookOpen,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Layers,
} from 'lucide-react';
import {
  INITIAL_BOOK_TITLES,
  INITIAL_BOOK_COPIES,
  INITIAL_BOOK_LOANS,
  INITIAL_LIBRARY_FINES,
  INITIAL_BOOK_CATEGORIES,
} from '../../data/initialLibraryData';

export const LibrarianReportsModule: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<
    'inventory' | 'circulation' | 'overdue' | 'fines'
  >('inventory');

  const [dateRange, setDateRange] = useState('term1-2026');
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  // Derived Report Data
  const inventoryStats = useMemo(() => {
    return INITIAL_BOOK_CATEGORIES.map((cat) => {
      const catTitles = INITIAL_BOOK_TITLES.filter((t) => t.categoryId === cat.id);
      const totalCopies = catTitles.reduce((acc, t) => acc + t.totalCopies, 0);
      const availableCopies = catTitles.reduce((acc, t) => acc + t.availableCopies, 0);
      const issuedCopies = catTitles.reduce((acc, t) => acc + t.issuedCopies, 0);
      return {
        id: cat.id,
        category: cat.name,
        code: cat.code,
        titleCount: catTitles.length,
        totalCopies,
        availableCopies,
        issuedCopies,
        utilizationRate: totalCopies > 0 ? ((issuedCopies / totalCopies) * 100).toFixed(1) : '0',
      };
    });
  }, []);

  const circulationRanking = useMemo(() => {
    return INITIAL_BOOK_TITLES.map((title) => {
      const titleLoans = INITIAL_BOOK_LOANS.filter((l) => l.titleId === title.id);
      return {
        id: title.id,
        title: title.title,
        isbn: title.isbn,
        category: title.categoryName,
        totalLoans: titleLoans.length,
        currentActive: title.issuedCopies,
        available: title.availableCopies,
      };
    }).sort((a, b) => b.totalLoans - a.totalLoans);
  }, []);

  const overdueAudit = useMemo(() => {
    return INITIAL_BOOK_LOANS.filter((l) => l.status === 'overdue');
  }, []);

  const handleExportCSV = () => {
    setExportFeedback(`Exported ${selectedReport.toUpperCase()} report as SCHLAR_Library_${selectedReport}_Q4.csv.`);
    setTimeout(() => setExportFeedback(null), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Library Analytics & Statutory Reports
          </h2>
          <p className="text-xs text-slate-500">
            Official circulation frequency metrics, inventory holding audits, overdue fine assessments, and loss logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border hover:bg-black/5"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border hover:bg-black/5"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {exportFeedback && (
        <div className="p-3 rounded-xl border bg-emerald-50 text-emerald-800 border-emerald-200 text-xs font-medium animate-in fade-in">
          {exportFeedback}
        </div>
      )}

      {/* REPORT TYPE SELECTOR PILLS */}
      <div
        className="flex items-center gap-1 p-1 rounded-xl border w-fit max-w-full overflow-x-auto text-xs"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <button
          onClick={() => setSelectedReport('inventory')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            selectedReport === 'inventory' ? 'bg-black/10 dark:bg-white/10 font-bold' : 'opacity-70'
          }`}
          style={{ color: 'var(--color-text)' }}
        >
          Category Holdings & Inventory
        </button>
        <button
          onClick={() => setSelectedReport('circulation')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            selectedReport === 'circulation' ? 'bg-black/10 dark:bg-white/10 font-bold' : 'opacity-70'
          }`}
          style={{ color: 'var(--color-text)' }}
        >
          Top Circulating Titles
        </button>
        <button
          onClick={() => setSelectedReport('overdue')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            selectedReport === 'overdue' ? 'bg-black/10 dark:bg-white/10 font-bold' : 'opacity-70'
          }`}
          style={{ color: 'var(--color-text)' }}
        >
          Overdue Recall Audit
        </button>
        <button
          onClick={() => setSelectedReport('fines')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            selectedReport === 'fines' ? 'bg-black/10 dark:bg-white/10 font-bold' : 'opacity-70'
          }`}
          style={{ color: 'var(--color-text)' }}
        >
          Fines & Recovery Ledger
        </button>
      </div>

      {/* REPORT CONTENT */}
      {selectedReport === 'inventory' && (
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
                Dewey Category Volume Holdings & Stack Allocation
              </h3>
              <p className="text-xs text-slate-500">
                Summary of physical volumes accessioned across core curriculum classifications
              </p>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-black/5">
              Academic Term 1 (2026–2027)
            </span>
          </div>

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
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Category</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Dewey Code</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Titles</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Total Volumes</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Available</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">On Loan</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Circulation Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {inventoryStats.map((stat) => (
                <tr key={stat.id} className="hover:bg-black/[0.02]">
                  <td className="py-3 px-4 font-bold" style={{ color: 'var(--color-text)' }}>
                    {stat.category}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">{stat.code}</td>
                  <td className="py-3 px-4 text-center font-mono">{stat.titleCount}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold">{stat.totalCopies}</td>
                  <td className="py-3 px-4 text-center font-mono text-emerald-600">{stat.availableCopies}</td>
                  <td className="py-3 px-4 text-center font-mono text-blue-600">{stat.issuedCopies}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-teal-700">
                    {stat.utilizationRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedReport === 'circulation' && (
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
                Most Circulated Titles Leaderboard
              </h3>
              <p className="text-xs text-slate-500">
                Ranking by borrowing frequency across student and faculty cohorts
              </p>
            </div>
          </div>

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
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Rank & Title</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">ISBN</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Category</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Total Loans</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Currently Out</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">In Stacks</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {circulationRanking.map((book, idx) => (
                <tr key={book.id} className="hover:bg-black/[0.02]">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400 w-4">
                        #{idx + 1}
                      </span>
                      <span className="font-bold" style={{ color: 'var(--color-text)' }}>
                        {book.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{book.isbn}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{book.category}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-teal-700">
                    {book.totalLoans}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-blue-600">{book.currentActive}</td>
                  <td className="py-3 px-4 text-center font-mono text-emerald-600">{book.available}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedReport === 'overdue' && (
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
                Official Overdue Volume Recall Register
              </h3>
              <p className="text-xs text-slate-500">
                Borrowers currently exceeding loan expiry terms
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800">
              {overdueAudit.length} delinquent loans
            </span>
          </div>

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
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Issue Date</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Due Date</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Assessed Late Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {overdueAudit.map((loan) => (
                <tr key={loan.id} className="hover:bg-black/[0.02]">
                  <td className="py-3 px-4 font-mono font-bold text-teal-700">{loan.accessionNumber}</td>
                  <td className="py-3 px-4 font-medium">{loan.bookTitle}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold block">{loan.memberName}</span>
                    <span className="text-[10px] text-slate-400 capitalize">{loan.memberType}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">{loan.issueDate}</td>
                  <td className="py-3 px-4 font-mono font-bold text-rose-600">{loan.dueDate}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-amber-700">
                    ${loan.assessedFine.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedReport === 'fines' && (
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
                Fine Collections & Waiver Audit Ledger
              </h3>
              <p className="text-xs text-slate-500">
                Detailed transaction records of late fines, waiver justifications, and cashier receipts
              </p>
            </div>
          </div>

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
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Receipt / ID</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Borrower</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Book Title</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Gross Fine</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Waived</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Net Due</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {INITIAL_LIBRARY_FINES.map((fine) => (
                <tr key={fine.id} className="hover:bg-black/[0.02]">
                  <td className="py-3 px-4 font-mono text-slate-500">{fine.receiptNumber || fine.id}</td>
                  <td className="py-3 px-4 font-bold">{fine.memberName}</td>
                  <td className="py-3 px-4">{fine.bookTitle}</td>
                  <td className="py-3 px-4 text-right font-mono">${fine.grossFine.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-400">${fine.discountOrWaiver.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-teal-700">
                    ${fine.netFine.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
