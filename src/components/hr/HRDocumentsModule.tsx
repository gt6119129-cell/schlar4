import React, { useState } from 'react';
import { INITIAL_STAFF_DOCUMENTS } from '../../data/initialHRData';
import { StaffDocumentRecord } from '../../types/hr';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Calendar,
  X,
  Plus,
} from 'lucide-react';

export const HRDocumentsModule: React.FC = () => {
  const [documents, setDocuments] = useState<StaffDocumentRecord[]>(INITIAL_STAFF_DOCUMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Valid' | 'Expiring Soon' | 'Expired'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.documentNumber && doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesCat = categoryFilter === 'all' || doc.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCat;
  });

  const expiringSoonCount = documents.filter((d) => d.status === 'Expiring Soon').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded tracking-wide uppercase border text-teal-700 bg-teal-50 dark:bg-teal-950/30"
              style={{ borderColor: 'var(--color-border)' }}
            >
              Institutional Compliance
            </span>
            <span className="text-xs text-slate-400">Credentials & Expiry Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Staff Documents
          </h1>
          <p className="text-sm mt-1 max-w-2xl text-slate-500">
            Maintain verified teaching credentials, state educator licenses, child safety background checks, and employment agreements.
          </p>
        </div>
      </div>

      {/* Compliance Expiry Alert Banner */}
      {expiringSoonCount > 0 && (
        <div className="p-4 rounded-xl border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="font-bold text-amber-900 dark:text-amber-200">
              {expiringSoonCount} Credential Document Expiring Within 30 Days
            </div>
            <p className="text-amber-700 dark:text-amber-300 mt-0.5">
              Mrs. Rebecca Hayes's Secondary English Professional License expires on 2026-11-09. State board renewal notification logged.
            </p>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div
        className="p-4 rounded-xl border shadow-xs flex flex-col sm:flex-row gap-3"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex-1 relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by staff name, credential title, or license number..."
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
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border text-xs outline-hidden font-medium"
          style={{
            backgroundColor: 'var(--color-background)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
        >
          <option value="all">All Document Categories</option>
          <option value="Teaching License">Teaching License</option>
          <option value="Academic Degree">Academic Degree</option>
          <option value="Background Verification">Background Verification</option>
          <option value="Contract & Appointment">Contract & Appointment</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 rounded-lg border text-xs outline-hidden font-medium"
          style={{
            backgroundColor: 'var(--color-background)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
        >
          <option value="all">All Verification Statuses</option>
          <option value="Valid">Valid</option>
          <option value="Expiring Soon">Expiring Soon (&lt; 30d)</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      {/* Documents Table */}
      <div
        className="rounded-xl border shadow-xs overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Faculty / Staff</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Category</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Credential Title</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Reference No</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Expiry Date</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-bold" style={{ color: 'var(--color-text)' }}>
                    {doc.staffName}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-black/5 dark:bg-white/10 text-slate-500">
                      {doc.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium" style={{ color: 'var(--color-text)' }}>
                    {doc.documentTitle}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                    {doc.documentNumber || '—'}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    {doc.expiryDate ? (
                      <span className={doc.status === 'Expiring Soon' ? 'text-amber-600 font-bold' : 'text-slate-500'}>
                        {doc.expiryDate}
                      </span>
                    ) : (
                      <span className="text-slate-400">Indefinite</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        doc.status === 'Valid'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : doc.status === 'Expiring Soon'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400'
                      }`}
                    >
                      {doc.status === 'Valid' ? (
                        <CheckCircle2 className="w-2.5 h-2.5" />
                      ) : (
                        <AlertTriangle className="w-2.5 h-2.5" />
                      )}
                      {doc.status}
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
