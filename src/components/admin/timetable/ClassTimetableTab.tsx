import React, { useState, useMemo } from 'react';
import { useSchoolData } from '../../../context/SchoolDataContext';
import { DayOfWeek, TimetablePeriod } from '../../../types/school';
import { Printer, Download, Filter, Building2, Calendar, FileText } from 'lucide-react';

const WEEKDAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const ClassTimetableTab: React.FC = () => {
  const { sections, timetable, bellSchedule } = useSchoolData();
  const [selectedSectionId, setSelectedSectionId] = useState<string>(sections[0]?.id || '');

  const activeSection = useMemo(() => {
    return sections.find((s) => s.id === selectedSectionId) || sections[0];
  }, [sections, selectedSectionId]);

  const sectionLessons = useMemo(() => {
    if (!activeSection) return [];
    return timetable.filter((t) => t.sectionId === activeSection.id);
  }, [timetable, activeSection]);

  const scheduleMap = useMemo(() => {
    const map = new Map<string, TimetablePeriod>();
    sectionLessons.forEach((tt) => {
      map.set(`${tt.dayOfWeek}-${tt.periodNumber}`, tt);
    });
    return map;
  }, [sectionLessons]);

  // Subject distribution breakdown
  const subjectBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    sectionLessons.forEach((l) => {
      counts[l.subjectName] = (counts[l.subjectName] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [sectionLessons]);

  const handleExportCSV = () => {
    if (!activeSection) return;
    const rows = [
      ['Class', 'Section', 'Day', 'Period', 'Time', 'Subject', 'Teacher', 'Room'],
    ];

    sectionLessons.forEach((l) => {
      rows.push([
        activeSection.className,
        activeSection.name,
        l.dayOfWeek,
        `Period ${l.periodNumber}`,
        `${l.startTime} - ${l.endTime}`,
        l.subjectName,
        l.teacherName,
        l.room,
      ]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Timetable_${activeSection.className}_${activeSection.name}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Academic Management</span>
            <span>/</span>
            <span>Timetable</span>
            <span>/</span>
            <span style={{ color: 'var(--color-primary)' }}>Class Timetables</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1" style={{ color: 'var(--color-text)' }}>
            Classroom & Section Schedules
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Weekly instructional calendars, period breakdown, and printable rosters for all grades.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Timetable</span>
          </button>
        </div>
      </div>

      {/* Cohort Selector & Info Bar */}
      <div className="p-4 rounded-xl border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Select Class & Section</label>
            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="px-3 py-1.5 rounded-lg border text-xs font-bold"
              style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}
            >
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.className} · {sec.name} ({sec.room || 'General Room'})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Homeroom</span>
            <span className="font-bold font-mono" style={{ color: 'var(--color-text)' }}>
              {activeSection?.room || 'Unassigned'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Class Teacher</span>
            <span className="font-bold" style={{ color: 'var(--color-text)' }}>
              {activeSection?.classTeacherName || 'Not Assigned'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Weekly Periods</span>
            <span className="font-bold font-mono text-emerald-600">
              {sectionLessons.length} / 30 slots
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="rounded-xl border shadow-xs overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b bg-black/[0.02] dark:bg-white/[0.02]" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
                <th className="py-3 px-3 w-28 text-[11px] font-bold uppercase border-r text-center" style={{ borderColor: 'var(--color-border)' }}>
                  Period
                </th>
                {WEEKDAYS.map((day) => (
                  <th key={day} className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-center border-r last:border-r-0" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {[1, 2, 2.5, 3, 4, 4.5, 5, 6].map((periodNum) => {
                if (periodNum === 2.5) {
                  return (
                    <tr key="recess" className="bg-amber-500/5 text-amber-700 dark:text-amber-400 text-xs font-medium">
                      <td className="py-2 px-3 text-center border-r font-mono text-[10px]" style={{ borderColor: 'var(--color-border)' }}>
                        10:15 - 10:35
                      </td>
                      <td colSpan={5} className="py-2 px-4 text-center tracking-wide font-semibold">
                        ☕ Morning Break (20 min)
                      </td>
                    </tr>
                  );
                }

                if (periodNum === 4.5) {
                  return (
                    <tr key="lunch" className="bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                      <td className="py-2 px-3 text-center border-r font-mono text-[10px]" style={{ borderColor: 'var(--color-border)' }}>
                        12:20 - 13:05
                      </td>
                      <td colSpan={5} className="py-2 px-4 text-center tracking-wide font-semibold">
                        🥗 Lunch & Recreation (45 min)
                      </td>
                    </tr>
                  );
                }

                const bell = bellSchedule.find((b) => b.periodNumber === periodNum && b.type === 'lesson');
                const timeLabel = bell ? `${bell.startTime} - ${bell.endTime}` : `P${periodNum}`;

                return (
                  <tr key={`p-${periodNum}`}>
                    <td className="py-3 px-3 text-center border-r align-middle" style={{ borderColor: 'var(--color-border)' }}>
                      <span className="block font-bold text-xs" style={{ color: 'var(--color-text)' }}>Period {periodNum}</span>
                      <span className="block text-[10px] font-mono text-slate-400 mt-0.5">{timeLabel}</span>
                    </td>

                    {WEEKDAYS.map((day) => {
                      const slot = scheduleMap.get(`${day}-${periodNum}`);
                      return (
                        <td key={`${day}-${periodNum}`} className="p-2 border-r last:border-r-0 align-top h-24 w-1/5" style={{ borderColor: 'var(--color-border)' }}>
                          {slot ? (
                            <div className="h-full p-2.5 rounded-lg border flex flex-col justify-between shadow-2xs" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                              <div>
                                <div className="flex items-start justify-between gap-1 mb-1">
                                  <span className="font-bold text-xs line-clamp-1" style={{ color: 'var(--color-primary)' }}>
                                    {slot.subjectName}
                                  </span>
                                  <span className="text-[10px] font-mono font-medium px-1 rounded bg-black/5 dark:bg-white/10 text-slate-500 shrink-0">
                                    {slot.room}
                                  </span>
                                </div>
                                <span className="text-[11px] text-slate-500 block truncate">
                                  {slot.teacherName}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full rounded-lg border border-dashed flex items-center justify-center text-slate-300 dark:text-slate-700 text-xs font-mono">
                              —
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subject Distribution Breakdown Card */}
      <div className="p-4 rounded-xl border shadow-xs" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Weekly Subject Period Allocation
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {subjectBreakdown.map(([subName, count]) => (
            <div key={subName} className="p-3 rounded-lg border text-center" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
              <div className="text-xl font-bold font-mono" style={{ color: 'var(--color-text)' }}>{count}</div>
              <span className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{subName}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
