import React from 'react';
import { useSchoolData } from '../../../context/SchoolDataContext';
import {
  CalendarDays,
  SlidersHorizontal,
  FileText,
  UserCheck,
  Building,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface TimetableOverviewTabProps {
  onNavigateTab: (tabId: string) => void;
}

export const TimetableOverviewTab: React.FC<TimetableOverviewTabProps> = ({ onNavigateTab }) => {
  const { timetable, sections, staff, rooms } = useSchoolData();

  const totalPeriodsPossible = sections.length * 5 * 6; // 5 days, 6 periods per day
  const assignedPeriodsCount = timetable.length;
  const emptySlotsCount = Math.max(0, totalPeriodsPossible - assignedPeriodsCount);
  const completionPercentage = totalPeriodsPossible > 0 ? Math.round((assignedPeriodsCount / totalPeriodsPossible) * 100) : 0;

  // Conflict calculation
  const conflictItems = React.useMemo(() => {
    const list: { type: string; details: string; entryId: string }[] = [];
    const teacherMap = new Map<string, typeof timetable[0]>();
    const sectionMap = new Map<string, typeof timetable[0]>();
    const roomMap = new Map<string, typeof timetable[0]>();

    timetable.forEach((entry) => {
      const teacherKey = `${entry.dayOfWeek}-${entry.periodNumber}-${entry.teacherId}`;
      if (teacherMap.has(teacherKey)) {
        const prev = teacherMap.get(teacherKey)!;
        list.push({
          type: 'Teacher Clash',
          details: `${entry.teacherName} double-booked across ${prev.sectionName} and ${entry.sectionName} on ${entry.dayOfWeek} P${entry.periodNumber}`,
          entryId: entry.id,
        });
      } else {
        teacherMap.set(teacherKey, entry);
      }

      const sectionKey = `${entry.dayOfWeek}-${entry.periodNumber}-${entry.sectionId}`;
      if (sectionMap.has(sectionKey)) {
        const prev = sectionMap.get(sectionKey)!;
        list.push({
          type: 'Section Overlap',
          details: `${entry.sectionName} has concurrent lessons: ${prev.subjectName} and ${entry.subjectName} on ${entry.dayOfWeek} P${entry.periodNumber}`,
          entryId: entry.id,
        });
      } else {
        sectionMap.set(sectionKey, entry);
      }

      if (entry.room && entry.room !== 'General Room') {
        const roomKey = `${entry.dayOfWeek}-${entry.periodNumber}-${entry.room.toLowerCase()}`;
        if (roomMap.has(roomKey)) {
          const prev = roomMap.get(roomKey)!;
          list.push({
            type: 'Room Double-Booking',
            details: `Room "${entry.room}" assigned simultaneously to ${prev.sectionName} and ${entry.sectionName}`,
            entryId: entry.id,
          });
        } else {
          roomMap.set(roomKey, entry);
        }
      }
    });

    return list;
  }, [timetable]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Academic Management</span>
            <span>/</span>
            <span style={{ color: 'var(--color-primary)' }}>Timetable Overview</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1" style={{ color: 'var(--color-text)' }}>
            Timetable Operations & Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Campus-wide instructional scheduling, section period completion, conflict audits, and resource allocation.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('academics-timetable-builder')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-sm hover:opacity-90 transition-opacity self-start sm:self-auto"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Launch Timetable Builder</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border shadow-xs" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Assigned Lessons</span>
            <CalendarDays className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black font-mono" style={{ color: 'var(--color-text)' }}>
            {assignedPeriodsCount}
            <span className="text-xs font-normal text-slate-400 ml-1.5">/ {totalPeriodsPossible} slots</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>{completionPercentage}% Target Fulfilled</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border shadow-xs" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Unscheduled Slots</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-600">
            {emptySlotsCount}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Open periods awaiting teacher assignment
          </div>
        </div>

        <div className="p-4 rounded-xl border shadow-xs" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Active Conflicts</span>
            <AlertTriangle className={`w-4 h-4 ${conflictItems.length > 0 ? 'text-rose-500' : 'text-emerald-500'}`} />
          </div>
          <div className={`text-2xl font-black font-mono ${conflictItems.length > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {conflictItems.length}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {conflictItems.length === 0 ? 'All slot constraints satisfied' : 'Overlaps require immediate resolution'}
          </div>
        </div>

        <div className="p-4 rounded-xl border shadow-xs" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Scheduled Resources</span>
            <Building className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black font-mono" style={{ color: 'var(--color-text)' }}>
            {sections.length} <span className="text-xs font-normal text-slate-400">Sec · {staff.filter(s => s.assignedSubjects?.length > 0).length} Faculty</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Across {rooms.length} facilities and lab spaces
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
          Dedicated Timetable Workspaces
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => onNavigateTab('academics-timetable-builder')}
            className="p-4 rounded-xl border hover:shadow-md transition-all cursor-pointer group"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>Timetable Builder</h3>
            <p className="text-xs text-slate-500 mt-1">
              Step-by-step interactive workflow: configure period bell timing, map subjects, assign teachers, and validate weekly grids.
            </p>
          </div>

          <div
            onClick={() => onNavigateTab('academics-timetable-classes')}
            className="p-4 rounded-xl border hover:shadow-md transition-all cursor-pointer group"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                <FileText className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>Class Timetables</h3>
            <p className="text-xs text-slate-500 mt-1">
              Inspect section-by-section weekly calendars. Switch between Grade 8, 9, 10 cohorts, review teacher tags, and print schedule rosters.
            </p>
          </div>

          <div
            onClick={() => onNavigateTab('academics-timetable-teachers')}
            className="p-4 rounded-xl border hover:shadow-md transition-all cursor-pointer group"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                <UserCheck className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>Teacher Timetables</h3>
            <p className="text-xs text-slate-500 mt-1">
              Audit faculty weekly workloads, view teaching periods across all grades, locate free planning hours, and prevent overload.
            </p>
          </div>

          <div
            onClick={() => onNavigateTab('academics-timetable-rooms')}
            className="p-4 rounded-xl border hover:shadow-md transition-all cursor-pointer group"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                <Building className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>Room Timetables</h3>
            <p className="text-xs text-slate-500 mt-1">
              View science laboratories, computer suites, auditorium, and classroom booking occupancy heatmaps to avoid double-bookings.
            </p>
          </div>

          <div
            onClick={() => onNavigateTab('academics-timetable-conflicts')}
            className="p-4 rounded-xl border hover:shadow-md transition-all cursor-pointer group"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${conflictItems.length > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--color-text)' }}>
              <span>Conflict Report</span>
              {conflictItems.length > 0 && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-500 text-white">
                  {conflictItems.length}
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Automated conflict scanner identifying teacher double-bookings, simultaneous section slots, and classroom resource collisions.
            </p>
          </div>
        </div>
      </div>

      {/* Section-Wise Schedule Completion Matrix */}
      <div className="rounded-xl border shadow-xs overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
          <div>
            <h2 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
              Section Schedule Completion Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status of lesson allocation across every active section in the academic cohort.
            </p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200">
            {sections.length} Sections Configured
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b bg-black/[0.02] dark:bg-white/[0.02]" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
                <th className="py-2.5 px-4 font-semibold uppercase text-[10px]">Class & Section</th>
                <th className="py-2.5 px-4 font-semibold uppercase text-[10px]">Homeroom</th>
                <th className="py-2.5 px-4 font-semibold uppercase text-[10px]">Class Teacher</th>
                <th className="py-2.5 px-4 font-semibold uppercase text-[10px]">Periods Assigned</th>
                <th className="py-2.5 px-4 font-semibold uppercase text-[10px]">Completion Progress</th>
                <th className="py-2.5 px-4 font-semibold uppercase text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {sections.map((sec) => {
                const assigned = timetable.filter((tt) => tt.sectionId === sec.id).length;
                const totalTarget = 30; // 5 days * 6 periods
                const pct = Math.min(100, Math.round((assigned / totalTarget) * 100));

                return (
                  <tr key={sec.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-bold" style={{ color: 'var(--color-text)' }}>
                      {sec.className} · {sec.name}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {sec.room || 'Unassigned'}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {sec.classTeacherName || <span className="text-amber-500 italic">Not Assigned</span>}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium">
                      {assigned} / {totalTarget}
                    </td>
                    <td className="py-3 px-4 w-48">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: pct === 100 ? 'var(--color-success, #10b981)' : 'var(--color-primary)',
                            }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-bold w-10 text-right">{pct}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onNavigateTab('academics-timetable-builder')}
                        className="px-2.5 py-1 rounded text-xs font-semibold border hover:opacity-80 transition-opacity"
                        style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                      >
                        Edit in Builder
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
