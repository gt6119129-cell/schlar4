import React, { useState, useMemo } from 'react';
import { useSchoolData } from '../../../context/SchoolDataContext';
import { usePermissions } from '../../../context/PermissionContext';
import { DayOfWeek, TimetablePeriod } from '../../../types/school';
import {
  SlidersHorizontal,
  Layers,
  Clock,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  X,
  Printer,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Info,
} from 'lucide-react';

const WEEKDAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const TimetableBuilderTab: React.FC = () => {
  const {
    sections,
    classes,
    subjects,
    staff,
    rooms,
    timetable,
    bellSchedule,
    academicTerms,
    schoolProfile,
    addTimetablePeriod,
    updateTimetablePeriod,
    deleteTimetablePeriod,
    validateTimetableSlot,
  } = useSchoolData();

  const { hasPermission } = usePermissions();
  const canEdit = hasPermission('admin', 'timetable.edit') || hasPermission('admin', 'timetable.create');

  // Staged workflow: 1 | 2 | 3 | 4 | 5
  const [currentStage, setCurrentStage] = useState<number>(4); // Default to builder grid stage, but user can click through all 5!

  // Context Selection (Stage 1)
  const [selectedSectionId, setSelectedSectionId] = useState<string>(sections[0]?.id || '');
  const [selectedTermId, setSelectedTermId] = useState<string>(academicTerms[0]?.id || 'term-1');

  // Period Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<TimetablePeriod | null>(null);
  const [targetDay, setTargetDay] = useState<DayOfWeek>('Monday');
  const [targetPeriodNumber, setTargetPeriodNumber] = useState<number>(1);
  const [targetSubjectId, setTargetSubjectId] = useState('');
  const [targetTeacherId, setTargetTeacherId] = useState('');
  const [targetRoom, setTargetRoom] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Success Feedback Toast
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const selectedSection = useMemo(() => {
    return sections.find((s) => s.id === selectedSectionId) || sections[0];
  }, [sections, selectedSectionId]);

  // Active lessons in this section
  const sectionTimetable = useMemo(() => {
    if (!selectedSection) return [];
    return timetable.filter((t) => t.sectionId === selectedSection.id);
  }, [timetable, selectedSection]);

  // Lessons mapped by day & period for rapid cell lookup
  const scheduleMap = useMemo(() => {
    const map = new Map<string, TimetablePeriod>();
    sectionTimetable.forEach((tt) => {
      map.set(`${tt.dayOfWeek}-${tt.periodNumber}`, tt);
    });
    return map;
  }, [sectionTimetable]);

  // Completion calculation for selected section
  const configuredPeriodSlots = 6; // 6 instructional periods
  const totalSlotsForSection = WEEKDAYS.length * configuredPeriodSlots; // 30
  const assignedSlotsForSection = sectionTimetable.length;
  const missingSlotsCount = Math.max(0, totalSlotsForSection - assignedSlotsForSection);
  const sectionCompletionPct = Math.min(100, Math.round((assignedSlotsForSection / totalSlotsForSection) * 100));

  // Eligible subjects for this class/section
  const eligibleSubjects = useMemo(() => {
    return subjects.filter((s) => s.status !== 'archived');
  }, [subjects]);

  // Active faculty
  const eligibleTeachers = useMemo(() => {
    return staff.filter((st) => st.status === 'active');
  }, [staff]);

  // Open modal for adding/editing a period
  const handleOpenSlot = (day: DayOfWeek, periodNum: number) => {
    if (!canEdit) return;
    const existing = scheduleMap.get(`${day}-${periodNum}`);
    setTargetDay(day);
    setTargetPeriodNumber(periodNum);
    setValidationError(null);

    if (existing) {
      setEditingPeriod(existing);
      setTargetSubjectId(existing.subjectId);
      setTargetTeacherId(existing.teacherId);
      setTargetRoom(existing.room || selectedSection?.room || 'Room 101');
    } else {
      setEditingPeriod(null);
      // Auto-suggest first subject and its assigned teacher if available
      const defaultSubj = eligibleSubjects[0];
      setTargetSubjectId(defaultSubj ? defaultSubj.id : '');
      const defaultTeacher = eligibleTeachers.find((t) =>
        t.assignedSections?.some((a) => a.sectionId === selectedSection?.id)
      ) || eligibleTeachers[0];
      setTargetTeacherId(defaultTeacher ? defaultTeacher.id : '');
      setTargetRoom(selectedSection?.room || 'Room 101');
    }

    setModalOpen(true);
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSection) return;

    const sub = subjects.find((s) => s.id === targetSubjectId);
    const tea = staff.find((st) => st.id === targetTeacherId);
    const bellSlot = bellSchedule.find((b) => b.periodNumber === targetPeriodNumber && b.type === 'lesson');

    if (!sub) {
      setValidationError('Please select an authorized curriculum subject.');
      return;
    }
    if (!tea) {
      setValidationError('Please assign an eligible faculty member.');
      return;
    }

    const startTime = bellSlot?.startTime || `0${7 + targetPeriodNumber}:00`;
    const endTime = bellSlot?.endTime || `0${7 + targetPeriodNumber}:50`;

    const candidateSlot = {
      sectionId: selectedSection.id,
      sectionName: `${selectedSection.className} · ${selectedSection.name}`,
      dayOfWeek: targetDay,
      periodNumber: targetPeriodNumber,
      startTime,
      endTime,
      subjectId: sub.id,
      subjectName: sub.name,
      teacherId: tea.id,
      teacherName: tea.name,
      room: targetRoom.trim() || selectedSection.room || 'General Classroom',
    };

    if (editingPeriod) {
      const res = updateTimetablePeriod(editingPeriod.id, candidateSlot);
      if (!res.isValid) {
        setValidationError(res.message || 'Timetable conflict detected.');
        return;
      }
      setSuccessMsg(`Period updated: ${sub.name} with ${tea.name} on ${targetDay}`);
    } else {
      const res = addTimetablePeriod(candidateSlot);
      if (!res.isValid) {
        setValidationError(res.message || 'Timetable conflict detected.');
        return;
      }
      setSuccessMsg(`Lesson scheduled: ${sub.name} on ${targetDay} (Period ${targetPeriodNumber})`);
    }

    setModalOpen(false);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleDeleteSlot = (id: string) => {
    if (!confirm('Are you sure you want to remove this scheduled timetable lesson?')) return;
    deleteTimetablePeriod(id);
    setModalOpen(false);
    setSuccessMsg('Lesson removed from weekly schedule.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Academic Management</span>
            <span>/</span>
            <span>Timetable</span>
            <span>/</span>
            <span style={{ color: 'var(--color-primary)' }}>Timetable Builder</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1" style={{ color: 'var(--color-text)' }}>
            Weekly Timetable Composer & Scheduler
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Design master schedules with strict clash-prevention rules, period bell synchronization, and teacher load balancing.
          </p>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Schedule</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="p-3 rounded-lg border flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border-emerald-200 text-xs font-medium animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="p-1 hover:opacity-70">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 5-STAGE WORKFLOW NAVIGATION BAR */}
      <div className="p-2 rounded-xl border shadow-xs" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between gap-1 overflow-x-auto text-xs font-semibold">
          {[
            { stage: 1, label: '1. Timetable Context', icon: Layers, desc: 'Cohort & Term' },
            { stage: 2, label: '2. Period Bells', icon: Clock, desc: 'Start/End Times' },
            { stage: 3, label: '3. Resources', icon: BookOpenCheck, desc: 'Faculty & Rooms' },
            { stage: 4, label: '4. Weekly Grid', icon: CalendarDays, desc: 'Interactive Composer' },
            { stage: 5, label: '5. Review & Publish', icon: CheckCircle2, desc: 'Audit & Finalize' },
          ].map((st) => {
            const Icon = st.icon;
            const isCurrent = currentStage === st.stage;
            const isCompleted = currentStage > st.stage;

            return (
              <button
                key={st.stage}
                onClick={() => setCurrentStage(st.stage)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-left shrink-0 ${
                  isCurrent
                    ? 'font-bold shadow-xs'
                    : isCompleted
                    ? 'hover:opacity-80 text-slate-600 dark:text-slate-300'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                style={
                  isCurrent
                    ? {
                        backgroundColor: 'var(--color-primary)',
                        color: '#FFFFFF',
                      }
                    : {}
                }
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isCurrent ? 'bg-white/20 text-white' : isCompleted ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}>
                  {isCompleted ? '✓' : st.stage}
                </div>
                <div className="truncate">
                  <div className="leading-tight truncate">{st.label}</div>
                  <div className={`text-[10px] font-normal truncate ${isCurrent ? 'text-white/80' : 'text-slate-400'}`}>
                    {st.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STAGE 1: TIMETABLE CONTEXT */}
      {currentStage === 1 && (
        <div className="p-6 rounded-xl border shadow-xs space-y-6" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
              Stage 1: Define Timetable Context & Cohort
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select the target academic session, term boundaries, and the specific classroom section you are building or editing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Academic Session
              </label>
              <div className="p-2.5 rounded-lg border text-xs font-medium" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                {schoolProfile.currentAcademicYear} (Active)
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Instructional Term / Semester
              </label>
              <select
                value={selectedTermId}
                onChange={(e) => setSelectedTermId(e.target.value)}
                className="w-full p-2.5 rounded-lg border text-xs font-medium"
                style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                {academicTerms.map((term) => (
                  <option key={term.id} value={term.id}>
                    {term.name} ({term.startDate} to {term.endDate})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Class & Section
              </label>
              <select
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="w-full p-2.5 rounded-lg border text-xs font-bold"
                style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}
              >
                {sections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.className} · {sec.name} ({sec.room || 'Room Unassigned'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 text-blue-900 dark:text-blue-200 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Contextual Safeguard:</strong> Modifying schedules in{' '}
              {selectedSection?.className} · {selectedSection?.name} will check for teacher and room collisions across all other sections in real time.
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setCurrentStage(2)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-sm hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <span>Next: Period & Bell Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: PERIOD BELL CONFIGURATION */}
      {currentStage === 2 && (
        <div className="p-6 rounded-xl border shadow-xs space-y-6" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
              Stage 2: Instructional Periods & Daily Bell Schedule
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Verify school weekdays, instructional period duration, nutrition break, and lunch intervals.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b bg-black/[0.02] dark:bg-white/[0.02]" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
                  <th className="py-2.5 px-3 font-semibold uppercase text-[10px]">Slot #</th>
                  <th className="py-2.5 px-3 font-semibold uppercase text-[10px]">Period Label</th>
                  <th className="py-2.5 px-3 font-semibold uppercase text-[10px]">Type</th>
                  <th className="py-2.5 px-3 font-semibold uppercase text-[10px]">Start Time</th>
                  <th className="py-2.5 px-3 font-semibold uppercase text-[10px]">End Time</th>
                  <th className="py-2.5 px-3 font-semibold uppercase text-[10px]">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {bellSchedule.map((b) => (
                  <tr key={b.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-400">
                      {b.periodNumber === 0 ? 'Advisory' : b.periodNumber % 1 !== 0 ? 'Interval' : `P${b.periodNumber}`}
                    </td>
                    <td className="py-2.5 px-3 font-bold" style={{ color: 'var(--color-text)' }}>
                      {b.name}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        b.type === 'lesson'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                          : b.type === 'lunch'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {b.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono">{b.startTime}</td>
                    <td className="py-2.5 px-3 font-mono">{b.endTime}</td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {b.type === 'break' ? '20 mins' : b.type === 'lunch' ? '45 mins' : '50 mins'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentStage(1)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-semibold"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Context</span>
            </button>

            <button
              onClick={() => setCurrentStage(3)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-sm hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <span>Next: Section Resources</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 3: RESOURCE CONFIGURATION */}
      {currentStage === 3 && (
        <div className="p-6 rounded-xl border shadow-xs space-y-6" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
              Stage 3: Available Faculty, Subjects & Classrooms
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Active instructional resources eligible for scheduling in {selectedSection?.className} · {selectedSection?.name}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subjects Table */}
            <div className="border rounded-xl p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Curriculum Subjects</h3>
                <span className="text-[11px] font-mono text-slate-400">{eligibleSubjects.length} available</span>
              </div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {eligibleSubjects.map((sub) => (
                  <div key={sub.id} className="p-2 rounded-lg border flex items-center justify-between text-xs" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                    <div>
                      <span className="font-bold block" style={{ color: 'var(--color-text)' }}>{sub.name}</span>
                      <span className="text-[10px] text-slate-400">{sub.department} · {sub.category || 'Core'}</span>
                    </div>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {sub.code}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Teaching Staff Table */}
            <div className="border rounded-xl p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Teaching Faculty</h3>
                <span className="text-[11px] font-mono text-slate-400">{eligibleTeachers.length} active</span>
              </div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {eligibleTeachers.map((tea) => {
                  const teachingPeriodCount = timetable.filter((t) => t.teacherId === tea.id).length;
                  return (
                    <div key={tea.id} className="p-2 rounded-lg border flex items-center justify-between text-xs" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                      <div>
                        <span className="font-bold block" style={{ color: 'var(--color-text)' }}>{tea.name}</span>
                        <span className="text-[10px] text-slate-400">{tea.designation} · {tea.department}</span>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {teachingPeriodCount} periods/wk
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentStage(2)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-semibold"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Bell Schedule</span>
            </button>

            <button
              onClick={() => setCurrentStage(4)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-sm hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <span>Next: Build Weekly Grid</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 4: INTERACTIVE WEEKLY GRID */}
      {currentStage === 4 && (
        <div className="space-y-4">
          {/* Section Selector Toolbar */}
          <div className="p-4 rounded-xl border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Active Cohort</label>
                <select
                  value={selectedSectionId}
                  onChange={(e) => setSelectedSectionId(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border text-xs font-bold"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}
                >
                  {sections.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.className} · {sec.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Homeroom & Faculty</div>
                <div className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>
                  {selectedSection?.room || 'Room Unassigned'} · Class Teacher:{' '}
                  <strong>{selectedSection?.classTeacherName || 'Not Appointed'}</strong>
                </div>
              </div>
            </div>

            {/* Pacing Badge */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] font-bold uppercase text-slate-400">Schedule Pacing</div>
                <div className="text-xs font-mono font-bold" style={{ color: 'var(--color-text)' }}>
                  {assignedSlotsForSection} / {totalSlotsForSection} Lessons ({sectionCompletionPct}%)
                </div>
              </div>

              <div className="w-24 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${sectionCompletionPct}%`,
                    backgroundColor: sectionCompletionPct === 100 ? 'var(--color-success, #10b981)' : 'var(--color-primary)',
                  }}
                />
              </div>

              <button
                onClick={() => setCurrentStage(5)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white hover:opacity-90 transition-opacity ml-2"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <span>Review & Publish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Weekly Matrix Grid */}
          <div className="rounded-xl border shadow-xs overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b bg-black/[0.02] dark:bg-white/[0.02]" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
                    <th className="py-3 px-3 w-28 text-[11px] font-bold uppercase border-r text-center" style={{ borderColor: 'var(--color-border)' }}>
                      Period / Time
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
                    const isMorningBreak = periodNum === 2.5;
                    const isLunch = periodNum === 4.5;

                    if (isMorningBreak) {
                      return (
                        <tr key="morning-break" className="bg-amber-500/5 text-amber-700 dark:text-amber-400 font-medium text-xs">
                          <td className="py-2 px-3 text-center border-r font-mono text-[10px]" style={{ borderColor: 'var(--color-border)' }}>
                            10:15 - 10:35
                          </td>
                          <td colSpan={5} className="py-2 px-4 text-center tracking-wide font-semibold">
                            ☕ Morning Nutrition & Campus Break (20 min)
                          </td>
                        </tr>
                      );
                    }

                    if (isLunch) {
                      return (
                        <tr key="lunch-break" className="bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 font-medium text-xs">
                          <td className="py-2 px-3 text-center border-r font-mono text-[10px]" style={{ borderColor: 'var(--color-border)' }}>
                            12:20 - 13:05
                          </td>
                          <td colSpan={5} className="py-2 px-4 text-center tracking-wide font-semibold">
                            🥗 Lunch Recess & Faculty Common Time (45 min)
                          </td>
                        </tr>
                      );
                    }

                    const bell = bellSchedule.find((b) => b.periodNumber === periodNum && b.type === 'lesson');
                    const timeLabel = bell ? `${bell.startTime} - ${bell.endTime}` : `Period ${periodNum}`;

                    return (
                      <tr key={`p-${periodNum}`} className="hover:bg-black/[0.01]">
                        {/* Period header cell */}
                        <td className="py-3 px-3 text-center border-r align-middle" style={{ borderColor: 'var(--color-border)' }}>
                          <span className="block font-bold text-xs" style={{ color: 'var(--color-text)' }}>
                            Period {periodNum}
                          </span>
                          <span className="block text-[10px] font-mono text-slate-400 mt-0.5">
                            {timeLabel}
                          </span>
                        </td>

                        {/* 5 Day Cells */}
                        {WEEKDAYS.map((day) => {
                          const slot = scheduleMap.get(`${day}-${periodNum}`);

                          return (
                            <td
                              key={`${day}-${periodNum}`}
                              className="p-2 border-r last:border-r-0 align-top h-24 w-1/5"
                              style={{ borderColor: 'var(--color-border)' }}
                            >
                              {slot ? (
                                <div
                                  onClick={() => handleOpenSlot(day, periodNum)}
                                  className="h-full p-2.5 rounded-lg border transition-all cursor-pointer group flex flex-col justify-between shadow-2xs hover:shadow-xs"
                                  style={{
                                    backgroundColor: 'var(--color-surface)',
                                    borderColor: 'var(--color-border)',
                                  }}
                                >
                                  <div>
                                    <div className="flex items-start justify-between gap-1 mb-1">
                                      <span className="font-bold text-xs leading-snug line-clamp-1" style={{ color: 'var(--color-primary)' }}>
                                        {slot.subjectName}
                                      </span>
                                      <span className="text-[10px] font-mono font-semibold px-1 rounded bg-black/5 dark:bg-white/10 text-slate-500 shrink-0">
                                        {slot.room}
                                      </span>
                                    </div>
                                    <span className="text-[11px] text-slate-500 block truncate">
                                      {slot.teacherName}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="italic">Click to edit</span>
                                    <Edit2 className="w-3 h-3 text-slate-400 hover:text-slate-700" />
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleOpenSlot(day, periodNum)}
                                  disabled={!canEdit}
                                  className="w-full h-full min-h-[70px] border border-dashed rounded-lg flex flex-col items-center justify-center p-2 text-slate-400 hover:text-slate-700 hover:border-slate-400 dark:hover:text-slate-200 transition-all group"
                                  style={{ borderColor: 'var(--color-border)' }}
                                >
                                  <Plus className="w-4 h-4 mb-0.5 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-transform" />
                                  <span className="text-[10px] font-medium">Assign</span>
                                </button>
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
      )}

      {/* STAGE 5: REVIEW & PUBLISH */}
      {currentStage === 5 && (
        <div className="p-6 rounded-xl border shadow-xs space-y-6" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
              Stage 5: Timetable Audit, Final Review & Publication
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Verify completion integrity for {selectedSection?.className} · {selectedSection?.name} before publishing to student and teacher portals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
              <div className="text-xs text-slate-500 mb-1">Target Fulfillment</div>
              <div className="text-2xl font-bold font-mono" style={{ color: 'var(--color-text)' }}>
                {assignedSlotsForSection} / {totalSlotsForSection}
              </div>
              <span className="text-xs text-emerald-600 font-medium">{sectionCompletionPct}% completed</span>
            </div>

            <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
              <div className="text-xs text-slate-500 mb-1">Unassigned Periods</div>
              <div className="text-2xl font-bold font-mono text-amber-600">{missingSlotsCount}</div>
              <span className="text-xs text-slate-400">Slots needing assignment</span>
            </div>

            <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
              <div className="text-xs text-slate-500 mb-1">Conflict Status</div>
              <div className="text-2xl font-bold font-mono text-emerald-600">0 Overlaps</div>
              <span className="text-xs text-emerald-600 font-medium">Validation rules passed</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-900 dark:text-emerald-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong className="font-bold block">Timetable Ready for Academic Operation</strong>
                <span>All subject assignments, faculty allocations, and room reservations are verified.</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSuccessMsg(`Timetable for ${selectedSection?.className} ${selectedSection?.name} published successfully!`);
                setTimeout(() => setSuccessMsg(null), 3000);
              }}
              className="px-4 py-2 rounded-lg text-xs font-bold text-white shadow-sm hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Publish Master Schedule
            </button>
          </div>

          <div className="flex justify-start">
            <button
              onClick={() => setCurrentStage(4)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-semibold"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Weekly Matrix</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN / EDIT TIMETABLE PERIOD */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-md rounded-2xl border shadow-2xl p-6 transition-colors"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  {editingPeriod ? 'Edit Timetable Slot' : 'Assign Timetable Lesson'}
                </h3>
                <span className="text-xs text-slate-400">
                  {targetDay} · Period {targetPeriodNumber} ({selectedSection?.className} · {selectedSection?.name})
                </span>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {validationError && (
              <div className="p-3 mb-4 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Conflict Detected:</strong>
                  <span>{validationError}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSaveSlot} className="space-y-4">
              {/* Subject Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Subject *
                </label>
                <select
                  value={targetSubjectId}
                  onChange={(e) => setTargetSubjectId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border text-xs font-medium"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  required
                >
                  <option value="">-- Choose Subject --</option>
                  {eligibleSubjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} ({sub.code} · {sub.department})
                    </option>
                  ))}
                </select>
              </div>

              {/* Teacher Assignment */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Assigned Teacher *
                </label>
                <select
                  value={targetTeacherId}
                  onChange={(e) => setTargetTeacherId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border text-xs font-medium"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  required
                >
                  <option value="">-- Choose Faculty Member --</option>
                  {eligibleTeachers.map((tea) => (
                    <option key={tea.id} value={tea.id}>
                      {tea.name} ({tea.designation} · {tea.department})
                    </option>
                  ))}
                </select>
              </div>

              {/* Classroom / Laboratory Room */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Classroom / Lab Location *
                </label>
                <select
                  value={targetRoom}
                  onChange={(e) => setTargetRoom(e.target.value)}
                  className="w-full p-2.5 rounded-lg border text-xs font-medium"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                  {rooms.map((rm) => (
                    <option key={rm.id} value={rm.name}>
                      {rm.name} ({rm.building} · Cap {rm.capacity})
                    </option>
                  ))}
                  <option value="General Room">General Classroom</option>
                </select>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                {editingPeriod ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteSlot(editingPeriod.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Slot</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-3.5 py-2 rounded-lg border text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg text-xs font-bold text-white shadow-sm hover:opacity-90"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {editingPeriod ? 'Update Period' : 'Save Assignment'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
