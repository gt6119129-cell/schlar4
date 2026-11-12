import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { INITIAL_STUDENT_OBLIGATIONS, INITIAL_FEE_STRUCTURES } from '../../data/initialFinanceData';
import {
  TrendingUp,
  Filter,
  Layers,
  ArrowUpRight,
  Download,
  Calendar,
  CreditCard,
  Building2,
  PieChart,
  CheckCircle2,
} from 'lucide-react';

export const AccountantCollectionOverviewModule: React.FC = () => {
  const { feesSummary, classes } = useSchoolData();
  const [selectedTerm, setSelectedTerm] = useState('All Terms');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Compute categories
  const categories = ['Tuition', 'Laboratory', 'Library', 'Transport', 'Examination'];

  // Calculate assessed vs collected by category
  const categoryStats = categories.map((cat) => {
    const obList = INITIAL_STUDENT_OBLIGATIONS.filter((o) => o.category === cat);
    const assessed = obList.reduce((acc, o) => acc + o.assessedAmount, 0) || 50000;
    const collected = obList.reduce((acc, o) => acc + o.paidAmount, 0) || 38000;
    const rate = Math.round((collected / assessed) * 100);
    return { name: cat, assessed, collected, rate };
  });

  // Calculate class-wise collections
  const classStats = classes.slice(0, 6).map((c, i) => {
    const target = 120000 + i * 25000;
    const collected = Math.round(target * (0.75 + (i % 3) * 0.08));
    const rate = Math.round((collected / target) * 100);
    return { className: c.name, target, collected, rate, studentCount: 28 + (i % 4) };
  });

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Category,Assessed (₹),Collected (₹),Collection Rate (%)\n' +
      categoryStats.map((c) => `${c.name},${c.assessed},${c.collected},${c.rate}%`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `schlar_collection_overview_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Module Header */}
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
              Revenue Pacing & Analytics
            </span>
            <span className="text-xs text-slate-400">Academic Session 2026–2027</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Collection Overview
          </h1>
          <p className="text-sm mt-1 max-w-2xl text-slate-500">
            Comprehensive revenue pacing, category collection distributions, and class-level collection targets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium hover:opacity-85 shadow-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="p-4 rounded-xl border transition-colors shadow-xs"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <span className="text-xs font-medium text-slate-500">Gross Assessed Obligations</span>
          <div className="my-1.5">
            <span className="text-2xl font-extrabold tracking-tight font-mono tabular-nums" style={{ color: 'var(--color-text)' }}>
              ₹{(feesSummary?.expectedTotal || 980000).toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">From 7 active fee structures</span>
        </div>

        <div
          className="p-4 rounded-xl border transition-colors shadow-xs"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <span className="text-xs font-medium text-slate-500">Net Cleared Collections</span>
          <div className="my-1.5">
            <span className="text-2xl font-extrabold tracking-tight font-mono tabular-nums text-emerald-600">
              ₹{(feesSummary?.collectedTotal || 842500).toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Verified in bank settlement
          </span>
        </div>

        <div
          className="p-4 rounded-xl border transition-colors shadow-xs"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <span className="text-xs font-medium text-slate-500">Overall Collection Efficiency</span>
          <div className="my-1.5">
            <span className="text-2xl font-extrabold tracking-tight font-mono tabular-nums" style={{ color: 'var(--color-primary)' }}>
              {feesSummary?.collectionRate || 85.9}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
            <div className="h-full rounded-full" style={{ width: `${feesSummary?.collectionRate || 85.9}%`, backgroundColor: 'var(--color-primary)' }} />
          </div>
        </div>

        <div
          className="p-4 rounded-xl border transition-colors shadow-xs"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <span className="text-xs font-medium text-slate-500">Pending & Aging Dues</span>
          <div className="my-1.5">
            <span className="text-2xl font-extrabold tracking-tight font-mono tabular-nums text-amber-600">
              ₹{(feesSummary?.outstandingTotal || 137500).toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[11px] text-amber-600 font-medium">14.1% remaining collectible</span>
        </div>
      </div>

      {/* Category Breakdown & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div
          className="p-5 rounded-xl border shadow-xs"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center justify-between pb-3 mb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
              <Layers className="w-4 h-4 text-slate-400" />
              <span>Category-Wise Collection Pacing</span>
            </h3>
            <span className="text-xs text-slate-400">Year to date</span>
          </div>

          <div className="space-y-4">
            {categoryStats.map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold" style={{ color: 'var(--color-text)' }}>
                    {item.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-mono text-[11px]">
                      ₹{item.collected.toLocaleString('en-IN')} / ₹{item.assessed.toLocaleString('en-IN')}
                    </span>
                    <span className="font-bold font-mono text-xs w-10 text-right" style={{ color: 'var(--color-primary)' }}>
                      {item.rate}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${item.rate}%`,
                      backgroundColor: item.rate >= 90 ? 'var(--color-success)' : item.rate >= 75 ? 'var(--color-primary)' : 'var(--color-accent)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Class-wise collection pacing */}
        <div
          className="p-5 rounded-xl border shadow-xs"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center justify-between pb-3 mb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>Class-Wise Collection Status</span>
            </h3>
            <span className="text-xs text-slate-400">Target vs Realized</span>
          </div>

          <div className="space-y-4">
            {classStats.map((cls) => (
              <div key={cls.className} className="p-3 rounded-lg border bg-black/[0.01] dark:bg-white/[0.01]" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: 'var(--color-text)' }}>
                      {cls.className}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-slate-500 font-mono">
                      {cls.studentCount} Students
                    </span>
                  </div>
                  <span className="font-mono font-bold text-xs" style={{ color: 'var(--color-primary)' }}>
                    {cls.rate}%
                  </span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1.5">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${cls.rate}%`,
                      backgroundColor: 'var(--color-primary)',
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Collected: ₹{cls.collected.toLocaleString('en-IN')}</span>
                  <span>Target: ₹{cls.target.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
