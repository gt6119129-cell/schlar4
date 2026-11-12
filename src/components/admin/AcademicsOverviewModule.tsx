import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  GraduationCap,
  BookOpen,
  Layers,
  Award,
  CheckCircle2,
  Calendar,
  Building,
  Users,
} from 'lucide-react';

export const AcademicsOverviewModule: React.FC<{ onNavigateTab: (tabId: string) => void }> = ({
  onNavigateTab,
}) => {
  const { classes, sections, subjects, staff, schoolProfile } = useSchoolData();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div
        className="p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'var(--color-background)' }}
          >
            <GraduationCap className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
          </div>
          <div>
            <h3 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
              Curriculum Framework & Academic Standards
            </h3>
            <p className="text-slate-500 text-xs">
              {schoolProfile.name} · {schoolProfile.currentAcademicYear} · {schoolProfile.currentTerm}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('classes-sections')}
            className="px-3 py-1.5 rounded-lg border text-xs font-semibold hover:opacity-90"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          >
            Manage Cohorts
          </button>
          <button
            onClick={() => onNavigateTab('timetable')}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Master Timetable
          </button>
        </div>
      </div>

      {/* 3 Academic Milestone Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div
          className="p-4 rounded-xl border shadow-xs"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-400">Term 1 Instructional Progress</span>
            <span className="font-mono font-bold text-emerald-600">68% Complete</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full w-[68%]" />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Week 7 of 12 before Mid-Term Examinations</p>
        </div>

        <div
          className="p-4 rounded-xl border shadow-xs"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-400">Accredited Subject Offerings</span>
            <span className="font-mono font-bold" style={{ color: 'var(--color-text)' }}>
              {subjects.length} Core Disciplines
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full w-[100%]" />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">STEM, Humanities, Languages, Fine Arts</p>
        </div>

        <div
          className="p-4 rounded-xl border shadow-xs"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-400">Active Faculty Leaders</span>
            <span className="font-mono font-bold" style={{ color: 'var(--color-text)' }}>
              {staff.filter((s) => s.status === 'active').length} Certified Instructors
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full w-[94%]" />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">All departments staffed for AY 2026-27</p>
        </div>
      </div>

      {/* Subject Offerings Master Catalog */}
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
              Accredited Subject Catalog
            </h3>
            <p className="text-xs text-slate-500">
              Departmental disciplines and subject codes
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr
                className="border-b"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Subject Code</th>
                <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Discipline Title</th>
                <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Department</th>
                <th className="py-2.5 px-4 font-semibold text-[10px] uppercase text-right">Instructional Status</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {subjects.map((sub) => (
                <tr key={sub.id} className="hover:bg-black/[0.015]">
                  <td className="py-3 px-4 font-mono font-semibold" style={{ color: 'var(--color-secondary)' }}>
                    {sub.code}
                  </td>
                  <td className="py-3 px-4 font-bold" style={{ color: 'var(--color-text)' }}>
                    {sub.name}
                  </td>
                  <td className="py-3 px-4 text-slate-500">{sub.department}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Accredited</span>
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
