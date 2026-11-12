import React, { useMemo, useState } from 'react';
import { useSchoolData } from '../../../context/SchoolDataContext';
import { AlertTriangle, CheckCircle2, Trash2, ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react';

interface ConflictItem {
  id: string;
  type: 'Teacher Double-Booking' | 'Section Lesson Overlap' | 'Room Collision';
  day: string;
  period: number;
  time: string;
  primaryEntry: {
    id: string;
    sectionName: string;
    subjectName: string;
    teacherName: string;
    room: string;
  };
  conflictingEntry: {
    id: string;
    sectionName: string;
    subjectName: string;
    teacherName: string;
    room: string;
  };
  explanation: string;
}

interface TimetableConflictReportTabProps {
  onNavigateTab?: (tabId: string) => void;
}

export const TimetableConflictReportTab: React.FC<TimetableConflictReportTabProps> = ({ onNavigateTab }) => {
  const { timetable, deleteTimetablePeriod } = useSchoolData();
  const [resolvedMsg, setResolvedMsg] = useState<string | null>(null);

  // Scan all timetable entries for conflicts
  const conflicts: ConflictItem[] = useMemo(() => {
    const list: ConflictItem[] = [];
    const teacherMap = new Map<string, typeof timetable[0]>();
    const sectionMap = new Map<string, typeof timetable[0]>();
    const roomMap = new Map<string, typeof timetable[0]>();

    timetable.forEach((entry) => {
      // 1. Teacher Check
      const teacherKey = `${entry.dayOfWeek}-${entry.periodNumber}-${entry.teacherId}`;
      if (teacherMap.has(teacherKey)) {
        const prev = teacherMap.get(teacherKey)!;
        list.push({
          id: `tc-${entry.id}-${prev.id}`,
          type: 'Teacher Double-Booking',
          day: entry.dayOfWeek,
          period: entry.periodNumber,
          time: `${entry.startTime} - ${entry.endTime}`,
          primaryEntry: {
            id: prev.id,
            sectionName: prev.sectionName,
            subjectName: prev.subjectName,
            teacherName: prev.teacherName,
            room: prev.room,
          },
          conflictingEntry: {
            id: entry.id,
            sectionName: entry.sectionName,
            subjectName: entry.subjectName,
            teacherName: entry.teacherName,
            room: entry.room,
          },
          explanation: `${entry.teacherName} is scheduled to teach concurrently in two different classrooms (${prev.sectionName} in ${prev.room} AND ${entry.sectionName} in ${entry.room}).`,
        });
      } else {
        teacherMap.set(teacherKey, entry);
      }

      // 2. Section Check
      const sectionKey = `${entry.dayOfWeek}-${entry.periodNumber}-${entry.sectionId}`;
      if (sectionMap.has(sectionKey)) {
        const prev = sectionMap.get(sectionKey)!;
        list.push({
          id: `sc-${entry.id}-${prev.id}`,
          type: 'Section Lesson Overlap',
          day: entry.dayOfWeek,
          period: entry.periodNumber,
          time: `${entry.startTime} - ${entry.endTime}`,
          primaryEntry: {
            id: prev.id,
            sectionName: prev.sectionName,
            subjectName: prev.subjectName,
            teacherName: prev.teacherName,
            room: prev.room,
          },
          conflictingEntry: {
            id: entry.id,
            sectionName: entry.sectionName,
            subjectName: entry.subjectName,
            teacherName: entry.teacherName,
            room: entry.room,
          },
          explanation: `${entry.sectionName} has two simultaneous subjects scheduled in the same period (${prev.subjectName} with ${prev.teacherName} AND ${entry.subjectName} with ${entry.teacherName}).`,
        });
      } else {
        sectionMap.set(sectionKey, entry);
      }

      // 3. Room Check
      if (entry.room && entry.room !== 'General Room') {
        const roomKey = `${entry.dayOfWeek}-${entry.periodNumber}-${entry.room.toLowerCase()}`;
        if (roomMap.has(roomKey)) {
          const prev = roomMap.get(roomKey)!;
          list.push({
            id: `rc-${entry.id}-${prev.id}`,
            type: 'Room Collision',
            day: entry.dayOfWeek,
            period: entry.periodNumber,
            time: `${entry.startTime} - ${entry.endTime}`,
            primaryEntry: {
              id: prev.id,
              sectionName: prev.sectionName,
              subjectName: prev.subjectName,
              teacherName: prev.teacherName,
              room: prev.room,
            },
            conflictingEntry: {
              id: entry.id,
              sectionName: entry.sectionName,
              subjectName: entry.subjectName,
              teacherName: entry.teacherName,
              room: entry.room,
            },
            explanation: `Room "${entry.room}" is double-booked for ${prev.sectionName} (${prev.subjectName}) and ${entry.sectionName} (${entry.subjectName}).`,
          });
        } else {
          roomMap.set(roomKey, entry);
        }
      }
    });

    return list;
  }, [timetable]);

  const handleResolveConflict = (entryIdToRemove: string) => {
    deleteTimetablePeriod(entryIdToRemove);
    setResolvedMsg('Conflicting timetable period removed. Re-run validation to verify clean schedule.');
    setTimeout(() => setResolvedMsg(null), 3000);
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
            <span style={{ color: 'var(--color-primary)' }}>Conflict Report</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1" style={{ color: 'var(--color-text)' }}>
            Schedule Conflict Diagnostic & Audit
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time constraint analyzer detecting overlapping lessons, teacher double-assignments, and room collisions.
          </p>
        </div>

        {onNavigateTab && (
          <button
            onClick={() => onNavigateTab('academics-timetable-builder')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm hover:opacity-90 self-start sm:self-auto"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <span>Open Timetable Builder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {resolvedMsg && (
        <div className="p-3 rounded-lg border bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border-emerald-200 text-xs font-medium">
          {resolvedMsg}
        </div>
      )}

      {/* Zero Conflicts State */}
      {conflicts.length === 0 ? (
        <div className="p-10 rounded-2xl border text-center shadow-xs space-y-4" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
              All Timetable Constraints Satisfied
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              No overlapping teacher assignments, section collisions, or double-booked rooms were detected across any of the {timetable.length} scheduled periods.
            </p>
          </div>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% Validation Integrity
            </span>
          </div>
        </div>
      ) : (
        /* Conflicts List */
        <div className="space-y-4">
          <div className="p-3 rounded-lg border bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-800 dark:text-rose-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                <strong>{conflicts.length} Active Schedule Conflicts</strong> detected. Resolve collisions to prevent classroom disruptions.
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {conflicts.map((conf) => (
              <div
                key={conf.id}
                className="p-5 rounded-xl border shadow-xs transition-colors"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b mb-3" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200">
                      {conf.type}
                    </span>
                    <span className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>
                      {conf.day} · Period {conf.period}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">({conf.time})</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                  {conf.explanation}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Slot A */}
                  <div className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-900/50" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Entry A</div>
                    <div className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                      {conf.primaryEntry.subjectName}
                    </div>
                    <div className="text-slate-500 mt-0.5">
                      {conf.primaryEntry.sectionName} · {conf.primaryEntry.teacherName} ({conf.primaryEntry.room})
                    </div>
                    <button
                      onClick={() => handleResolveConflict(conf.primaryEntry.id)}
                      className="mt-3 flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove Entry A</span>
                    </button>
                  </div>

                  {/* Slot B */}
                  <div className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-900/50" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Entry B (Conflicting)</div>
                    <div className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                      {conf.conflictingEntry.subjectName}
                    </div>
                    <div className="text-slate-500 mt-0.5">
                      {conf.conflictingEntry.sectionName} · {conf.conflictingEntry.teacherName} ({conf.conflictingEntry.room})
                    </div>
                    <button
                      onClick={() => handleResolveConflict(conf.conflictingEntry.id)}
                      className="mt-3 flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove Entry B</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
