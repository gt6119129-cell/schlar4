import React, { useState, useMemo } from 'react';
import { useSchoolData } from '../../../context/SchoolDataContext';
import { DayOfWeek, TimetablePeriod } from '../../../types/school';
import { UserCheck, Printer, Download, Clock, BookOpen, Layers } from 'lucide-react';

const WEEKDAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const TeacherTimetableTab: React.FC = () => {
  const { staff, timetable, bellSchedule } = useSchoolData();

  const teachers = useMemo(() => {
    return staff.filter((s) => s.status === 'active');
  }, [staff]);

  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teachers[0]?.id || '');

  const activeTeacher = useMemo(() => {
    return teachers.find((t) => t.id === selectedTeacherId) || teachers[0];
  }, [teachers, selectedTeacherId]);

  const teacherLessons = useMemo(() => {
    if (!activeTeacher) return [];
    return timetable.filter((t) => t.teacherId === activeTeacher.id);
  }, [timetable, activeTeacher]);

  const scheduleMap = useMemo(() => {
    const map = new Map<string, TimetablePeriod>();
    teacherLessons.forEach((tt) => {
      map.set(`${tt.dayOfWeek}-${tt.periodNumber}`, tt);
    });
    return map;
  }, [teacherLessons]);

  const totalPeriodsPossible = 30; // 5 days * 6 periods
  const assignedCount = teacherLessons.length;
  const freePeriodsCount = totalPeriodsPossible - assignedCount;

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
            <span style={{ color: 'var(--color-primary)' }}>Teacher Timetables</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1" style={{ color: 'var(--color-text)' }}>
            Faculty Teaching Schedules & Workload
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit individual teacher instructional timetables, monitor free planning periods, and balance faculty load.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm hover:opacity-90 self-start sm:self-auto"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Teacher Schedule</span>
        </button>
      </div>

      {/* Teacher Selector Toolbar */}
      <div className="p-4 rounded-xl border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Select Faculty Member</label>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="px-3 py-1.5 rounded-lg border text-xs font-bold"
              style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}
            >
              {teachers.map((tea) => (
                <option key={tea.id} value={tea.id}>
                  {tea.name} ({tea.designation} · {tea.department})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Department</span>
            <span className="font-bold" style={{ color: 'var(--color-text)' }}>
              {activeTeacher?.department}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Weekly Load</span>
            <span className="font-bold font-mono text-emerald-600">
              {assignedCount} periods / wk
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Prep / Free Periods</span>
            <span className="font-bold font-mono text-blue-600">
              {freePeriodsCount} periods / wk
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
                        ☕ Faculty Nutrition Break (20 min)
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
                        🥗 Staff Lunch Interval (45 min)
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
                                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 block truncate">
                                  {slot.sectionName}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full rounded-lg bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
                              Free Planning
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
    </div>
  );
};
