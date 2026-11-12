import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  GraduationCap,
  Briefcase,
  UserCheck,
  UserX,
  X,
  CreditCard,
  BookOpen,
} from 'lucide-react';
import { LibraryMember, MembershipStatus } from '../../types/library';
import { INITIAL_LIBRARY_MEMBERS, INITIAL_BOOK_LOANS } from '../../data/initialLibraryData';

export const LibrarianMembersModule: React.FC = () => {
  const [members, setMembers] = useState<LibraryMember[]>(INITIAL_LIBRARY_MEMBERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'student' | 'staff'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [selectedMember, setSelectedMember] = useState<LibraryMember | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.admissionNoOrStaffId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.classSectionOrDept.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.contactEmail.toLowerCase().includes(searchQuery.toLowerCase());

      const matchType = typeFilter === 'all' || m.memberType === typeFilter;
      const matchStatus = statusFilter === 'all' || m.status === statusFilter;

      return matchSearch && matchType && matchStatus;
    });
  }, [members, searchQuery, typeFilter, statusFilter]);

  // Loans for selectedMember
  const memberLoans = useMemo(() => {
    if (!selectedMember) return [];
    return INITIAL_BOOK_LOANS.filter((l) => l.memberId === selectedMember.id);
  }, [selectedMember]);

  const handleToggleStatus = (member: LibraryMember) => {
    const nextStatus: MembershipStatus = member.status === 'active' ? 'suspended' : 'active';
    setMembers(
      members.map((m) => (m.id === member.id ? { ...m, status: nextStatus } : m))
    );
    setFeedback(`Membership status for ${member.name} changed to ${nextStatus}.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Library Borrowers & Members
          </h2>
          <p className="text-xs text-slate-500">
            Registered borrowing accounts linked to shared student and faculty records with quota enforcement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
            <span className="text-slate-400">Student Limit:</span>
            <strong className="text-teal-700">3 books</strong>
            <span className="text-slate-300">|</span>
            <span className="text-slate-400">Staff Limit:</span>
            <strong className="text-teal-700">6 books</strong>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl border bg-emerald-50 text-emerald-800 border-emerald-200 text-xs font-medium flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SEARCH AND FILTER BAR */}
      <div
        className="p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs flex-1 max-w-md"
          style={{
            backgroundColor: 'var(--color-background)',
            borderColor: 'var(--color-border)',
          }}
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, Admission No, Staff ID, or class..."
            className="w-full bg-transparent border-none outline-none text-xs"
            style={{ color: 'var(--color-text)' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg border text-xs" style={{ borderColor: 'var(--color-border)' }}>
            {(['all', 'student', 'staff'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2.5 py-1 rounded capitalize text-[11px] font-medium transition-colors ${
                  typeFilter === t ? 'bg-black/10 dark:bg-white/10 font-bold' : 'opacity-70'
                }`}
                style={{ color: 'var(--color-text)' }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg border text-xs" style={{ borderColor: 'var(--color-border)' }}>
            {(['all', 'active', 'suspended'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded capitalize text-[11px] font-medium transition-colors ${
                  statusFilter === s ? 'bg-black/10 dark:bg-white/10 font-bold' : 'opacity-70'
                }`}
                style={{ color: 'var(--color-text)' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MEMBERS TABLE */}
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
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Borrower Profile</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">ID Reference</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Cohort / Department</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Quota & Current Loans</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Fine Balance</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {filteredMembers.map((member) => {
                const isStudent = member.memberType === 'student';
                const hasOverdueFines = member.fineBalance > 0;
                const isAtQuota = member.currentIssuedCount >= member.issueLimit;

                return (
                  <tr key={member.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0"
                          style={{
                            backgroundColor: isStudent ? 'var(--color-secondary)' : 'var(--color-primary)',
                          }}
                        >
                          {member.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold block" style={{ color: 'var(--color-text)' }}>
                            {member.name}
                          </span>
                          <span className="text-[11px] text-slate-400 capitalize">
                            {member.memberType}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {member.admissionNoOrStaffId}
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {member.classSectionOrDept}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-semibold bg-black/5 dark:bg-white/5">
                        <span className={isAtQuota ? 'text-rose-600 font-bold' : 'text-teal-700'}>
                          {member.currentIssuedCount}
                        </span>
                        <span className="text-slate-400">/</span>
                        <span>{member.issueLimit} max</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center font-mono">
                      {hasOverdueFines ? (
                        <span className="text-rose-600 font-bold text-[11px]">
                          ₹{member.fineBalance.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">₹0.00</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                          member.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedMember(member)}
                          className="px-2.5 py-1 rounded text-[11px] font-semibold border hover:bg-black/5"
                          style={{ borderColor: 'var(--color-border)' }}
                        >
                          Dossier
                        </button>
                        <button
                          onClick={() => handleToggleStatus(member)}
                          className={`px-2 py-1 rounded text-[11px] font-semibold border ${
                            member.status === 'active'
                              ? 'text-rose-600 border-rose-200 hover:bg-rose-50'
                              : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                          }`}
                        >
                          {member.status === 'active' ? 'Suspend' : 'Reinstate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MEMBER DOSSIER MODAL */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-xl rounded-2xl border p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-start justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-teal-700">
                  Library Membership Dossier
                </span>
                <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                  {selectedMember.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedMember.admissionNoOrStaffId} · {selectedMember.classSectionOrDept}
                </p>
              </div>
              <button onClick={() => setSelectedMember(null)} className="p-1 rounded hover:bg-black/5">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-lg border bg-black/[0.02]" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-[10px] text-slate-400 block">Member Type</span>
                <span className="font-semibold capitalize">{selectedMember.memberType}</span>
              </div>
              <div className="p-2.5 rounded-lg border bg-black/[0.02]" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-[10px] text-slate-400 block">Borrow Limit</span>
                <span className="font-semibold">{selectedMember.issueLimit} Books</span>
              </div>
              <div className="p-2.5 rounded-lg border bg-black/[0.02]" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-[10px] text-slate-400 block">Active Loans</span>
                <span className="font-bold text-teal-700">{selectedMember.currentIssuedCount}</span>
              </div>
              <div className="p-2.5 rounded-lg border bg-black/[0.02]" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-[10px] text-slate-400 block">Outstanding Fine</span>
                <span className="font-bold text-rose-600">${selectedMember.fineBalance.toFixed(2)}</span>
              </div>
            </div>

            {/* Active & Historical Loans for this member */}
            <div className="border rounded-xl overflow-hidden mt-4" style={{ borderColor: 'var(--color-border)' }}>
              <div className="p-3 border-b bg-black/[0.02]" style={{ borderColor: 'var(--color-border)' }}>
                <h4 className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>
                  Active & Historical Loans
                </h4>
              </div>
              {memberLoans.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No active or past loans recorded for this member.
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b text-[10px] uppercase text-slate-400" style={{ borderColor: 'var(--color-border)' }}>
                      <th className="py-2 px-3">Title</th>
                      <th className="py-2 px-3">Issued</th>
                      <th className="py-2 px-3">Due</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                    {memberLoans.map((loan) => (
                      <tr key={loan.id}>
                        <td className="py-2 px-3 font-medium line-clamp-1">{loan.bookTitle}</td>
                        <td className="py-2 px-3 font-mono text-slate-500">{loan.issueDate}</td>
                        <td className="py-2 px-3 font-mono text-slate-500">{loan.dueDate}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                              loan.status === 'overdue'
                                ? 'bg-rose-100 text-rose-800'
                                : loan.status === 'returned'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {loan.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border hover:bg-black/5"
                style={{ borderColor: 'var(--color-border)' }}
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
