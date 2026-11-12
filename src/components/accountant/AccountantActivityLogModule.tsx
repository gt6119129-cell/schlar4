import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  User,
  CreditCard,
  RotateCcw,
  Award,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface ActivityLogItem {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: 'Fee Recorded' | 'Concession Approved' | 'Structure Modified' | 'Adjustment Processed' | 'Receipt Reprints';
  entity: string;
  amount?: number;
  details: string;
}

const INITIAL_FINANCIAL_LOGS: ActivityLogItem[] = [
  {
    id: 'log-01',
    timestamp: '2026-10-21 09:15 AM',
    actor: 'Lead Bursar',
    role: 'Accountant',
    action: 'Fee Recorded',
    entity: 'Student: Maya Chen (Grade 8)',
    amount: 2880,
    details: 'Recorded cleared wire payment against Middle School Core Tuition. Generated receipt REC-2026-0041.',
  },
  {
    id: 'log-02',
    timestamp: '2026-10-20 02:40 PM',
    actor: 'Dr. Arthur Sterling',
    role: 'Principal',
    action: 'Concession Approved',
    entity: 'Student: Adrian Vance (Grade 10)',
    amount: 360,
    details: 'Authorized 10% Merit Scholarship concession for Academic Olympiad qualification.',
  },
  {
    id: 'log-03',
    timestamp: '2026-10-19 11:30 AM',
    actor: 'Finance Director',
    role: 'Accountant',
    action: 'Structure Modified',
    entity: 'Fee Structure: STEM Physics & Robotics Lab Fee',
    details: 'Updated consumable fee schedule effective date to 2026-09-01. Historical assessed obligations preserved.',
  },
  {
    id: 'log-04',
    timestamp: '2026-10-18 04:10 PM',
    actor: 'Lead Bursar',
    role: 'Accountant',
    action: 'Adjustment Processed',
    entity: 'Student: Maya Chen',
    amount: 120,
    details: 'Uniform sizing exchange ledger credit processed after bursar review.',
  },
  {
    id: 'log-05',
    timestamp: '2026-10-17 10:20 AM',
    actor: 'Front Desk Bursar',
    role: 'Accountant',
    action: 'Receipt Reprints',
    entity: 'Receipt: REC-2026-0038',
    details: 'Reprinted official guardian receipt copy upon parent desk request.',
  },
];

export const AccountantActivityLogModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = INITIAL_FINANCIAL_LOGS.filter((log) => {
    const matchesSearch =
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesSearch && matchesAction;
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
              Security & Audit Trail
            </span>
            <span className="text-xs text-slate-400">Compliance Log</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Financial Activity Log
          </h1>
          <p className="text-sm mt-1 max-w-2xl text-slate-500">
            Immutable audit record of fee collections, fee assignments, concession approvals, and ledger adjustments.
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
            placeholder="Search audit trail by actor, student, or details..."
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
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border text-xs outline-hidden font-medium"
          style={{
            backgroundColor: 'var(--color-background)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
        >
          <option value="all">All Audit Actions</option>
          <option value="Fee Recorded">Fee Recorded</option>
          <option value="Concession Approved">Concession Approved</option>
          <option value="Structure Modified">Structure Modified</option>
          <option value="Adjustment Processed">Adjustment Processed</option>
          <option value="Receipt Reprints">Receipt Reprints</option>
        </select>
      </div>

      {/* Activity Timeline List */}
      <div
        className="rounded-xl border shadow-xs divide-y overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        {filteredLogs.map((item) => (
          <div key={item.id} className="p-4 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: 'rgba(var(--color-primary), 0.1)',
                    color: 'var(--color-primary)',
                  }}
                >
                  {item.action}
                </span>
                <span className="font-bold text-xs" style={{ color: 'var(--color-text)' }}>
                  {item.entity}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">{item.timestamp}</span>
            </div>

            <p className="text-xs text-slate-500 mb-2 leading-relaxed">{item.details}</p>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <User className="w-3 h-3 text-slate-400" />
                <span>Authorized by: <strong className="font-semibold text-slate-600 dark:text-slate-300">{item.actor}</strong> ({item.role})</span>
              </div>
              {item.amount && (
                <span className="font-mono font-bold text-xs" style={{ color: 'var(--color-primary)' }}>
                  Amount: ₹{item.amount.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
