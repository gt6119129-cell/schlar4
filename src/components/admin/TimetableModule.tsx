import React, { useState, useMemo } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { usePermissions } from '../../context/PermissionContext';
import { TimetablePeriod, DayOfWeek } from '../../types/school';
import {
  CalendarDays,
  Clock,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  X,
  Building,
  UserCheck,
  BookOpen,
  DoorOpen,
  Calendar,
} from 'lucide-react';

const WEEKDAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const PERIOD_TIMES: { period: number; start: string; end: string; isBreak?: boolean; label?: string }[] = [
  { period: 1, start: '08:30 AM', end: '09:15 AM' },
  { period: 2, start: '09:20 AM', end: '10:05 AM' },
  { period: 0, start: '10:05 AM', end: '10:20 AM', isBreak: true, label: 'Morning Recess' },
  { period: 3, start: '10:20 AM', end: '11:05 AM' },
  { period: 4, start: '11:10 AM', end: '11:55 AM' },
  { period: -1, start: '11:55 AM', end: '12:40 PM', isBreak: true, label: 'Lunch Break' },
  { period: 5, start: '12:40 PM', end: '01:25 PM' },
];

export const TimetableModule: React.FC = () => {
  const {
    sections,
    subjects,
    staff,
    timetable,
    addTimetablePeriod,
    updateTimetablePeriod,
    deleteTimetablePeriod,
    validateTimetableSlot,
  } = useSchoolData();

  const { hasPermission } = usePermissions();
  const canEditTimetable = hasPermission('timetable.create');

  // Active section selection
  const activeSections = useMemo(() => sections.filter((s) => s.status === 'active'), [sections]);
  const [selectedSectionId, setSelectedSectionId] = useState<string>(activeSections[0]?.id || 'sec-10a');
  const [activeDay, setActiveDay] = useState<DayOfWeek>('Monday');

  // Modals state
  const [slotModalOpen, setSlotModalOpen] = useState(false);
  const [slotToEdit, setSlotToEdit] = useState<TimetablePeriod | null>(null);
  const [prefilledDay, setPrefilledDay] = useState<DayOfWeek>('Monday');
  const [prefilledPeriodNumber, setPrefilledPeriodNumber] = useState<number>(1);

  // Deletion confirmation
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<TimetablePeriod | null>(null);

  // Conflict feedback
  const [bannerSuccess, setBannerSuccess] = useState<string | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(null);

  const showNotification = (success?: string, error?: string) => {
    if (success) {
      setBannerSuccess(success);
      setBannerError(null);
      setTimeout(() => setBannerSuccess(null), 4500);
    }
    if (error) {
      setBannerError(error);
      setBannerSuccess(null);
    }
  };

  const selectedSection = useMemo(() => {
    return sections.find((s) => s.id === selectedSectionId) || activeSections[0];
  }, [sections, selectedSectionId, activeSections]);

  const activeStaff = useMemo(() => staff.filter((st) => st.status === 'active'), [staff]);

  // Timetable entries for selected section
  const sectionTimetable = useMemo(() => {
    return timetable.filter((tt) => tt.sectionId === selectedSection?.id);
  }, [timetable, selectedSection]);

  // Open modal for new slot
  const handleOpenAddSlot = (day: DayOfWeek, periodNum: number) => {
    setSlotToEdit(null);
    setPrefilledDay(day);
    setPrefilledPeriodNumber(periodNum);
    setSlotModalOpen(true);
  };

  // Open modal for editing slot
  const handleOpenEditSlot = (slot: TimetablePeriod) => {
    setSlotToEdit(slot);
    setPrefilledDay(slot.dayOfWeek);
    setPrefilledPeriodNumber(slot.periodNumber);
    setSlotModalOpen(true);
  };

  // Save Slot (Add or Update)
  const handleSaveSlot = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSection) return;

    const form = e.currentTarget;
    const subjectId = (form.elements.namedItem('subjectId') as HTMLSelectElement).value;
    const teacherId = (form.elements.namedItem('teacherId') as HTMLSelectElement).value;
    const room = (form.elements.namedItem('room') as HTMLInputElement).value;
    const dayOfWeek = (form.elements.namedItem('dayOfWeek') as HTMLSelectElement).value as DayOfWeek;
    const periodNumber = parseInt((form.elements.namedItem('periodNumber') as HTMLSelectElement).value, 10);

    const subjectObj = subjects.find((s) => s.id === subjectId);
    const teacherObj = staff.find((st) => st.id === teacherId);

    if (!subjectObj || !teacherObj) {
      showNotification(undefined, 'Invalid subject or teacher selection.');
      return;
    }

    const timeSlot = PERIOD_TIMES.find((pt) => pt.period === periodNumber) || {
      start: '08:30 AM',
      end: '09:15 AM',
    };

    const slotPayload: Omit<TimetablePeriod, 'id'> = {
      sectionId: selectedSection.id,
      sectionName: `${selectedSection.className} · ${selectedSection.name}`,
      dayOfWeek,
      periodNumber,
      startTime: timeSlot.start,
      endTime: timeSlot.end,
      subjectId: subjectObj.id,
      subjectName: subjectObj.name,
      teacherId: teacherObj.id,
      teacherName: teacherObj.name,
      room: room || selectedSection.room,
    };

    if (slotToEdit) {
      const res = updateTimetablePeriod(slotToEdit.id, slotPayload);
      if (res.isValid) {
        showNotification(`Period ${periodNumber} (${subjectObj.name}) updated.`);
        setSlotModalOpen(false);
      } else {
        showNotification(undefined, res.message);
      }
    } else {
      const res = addTimetablePeriod(slotPayload);
      if (res.isValid) {
        showNotification(`Period ${periodNumber} (${subjectObj.name}) added to ${selectedSection.className} ${selectedSection.name}.`);
        setSlotModalOpen(false);
      } else {
        showNotification(undefined, res.message);
      }
    }
  };

  // Delete Period
  const handleConfirmDelete = () => {
    if (!deleteConfirmTarget) return;
    deleteTimetablePeriod(deleteConfirmTarget.id);
    showNotification(`Period ${deleteConfirmTarget.periodNumber} (${deleteConfirmTarget.subjectName}) removed.`);
    setDeleteConfirmTarget(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner Feedback */}
      {bannerSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{bannerSuccess}</span>
          </div>
          <button onClick={() => setBannerSuccess(null)} className="p-1 hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {bannerError && (
        <div className="p-3.5 rounded-xl bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <div>
              <span className="font-bold block">Scheduling Conflict Detected:</span>
              <span>{bannerError}</span>
            </div>
          </div>
          <button onClick={() => setBannerError(null)} className="p-1 hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header and Section Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Academic Master Timetable
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Weekly instructional schedule with automatic teacher double-booking and room collision conflict detection.
          </p>
        </div>

        {/* Section Picker */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Cohort Section:</span>
          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="px-3 py-1.5 rounded-lg border font-bold text-xs outline-none"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            {activeSections.map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.className} · {sec.name} (Room: {sec.room})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Day of Week Selector */}
      <div
        className="p-2 rounded-xl border flex items-center justify-between gap-2 overflow-x-auto text-xs"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center gap-1.5 w-full">
          {WEEKDAYS.map((day) => {
            const countForDay = sectionTimetable.filter((t) => t.dayOfWeek === day).length;
            const isDayActive = activeDay === day;

            return (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-2 ${
                  isDayActive ? 'shadow-xs' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isDayActive ? 'var(--color-background)' : 'transparent',
                  color: 'var(--color-text)',
                }}
              >
                <span>{day}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-black/5 dark:bg-white/10">
                  {countForDay} periods
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Periods Grid View */}
      <div
        className="rounded-xl border shadow-xs overflow-hidden"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
            <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
              {selectedSection?.className} · {selectedSection?.name} Schedule for {activeDay}
            </h3>
          </div>

          <div className="text-[11px] text-slate-400">
            Class Teacher: <strong style={{ color: 'var(--color-text)' }}>{selectedSection?.classTeacherName || 'Unassigned'}</strong>
          </div>
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {PERIOD_TIMES.map((slot, index) => {
            if (slot.isBreak) {
              return (
                <div
                  key={`break-${index}`}
                  className="py-2.5 px-6 flex items-center justify-between text-xs font-semibold text-slate-400 border-dashed"
                  style={{ backgroundColor: 'var(--color-background)' }}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{slot.label}</span>
                  </div>
                  <span className="font-mono text-[11px]">{slot.start} – {slot.end}</span>
                </div>
              );
            }

            // Find scheduled period for this day and slot.period
            const scheduled = sectionTimetable.find(
              (tt) => tt.dayOfWeek === activeDay && tt.periodNumber === slot.period
            );

            return (
              <div
                key={`period-${slot.period}`}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-black/[0.015] dark:hover:bg-white/[0.015] transition-colors"
              >
                {/* Time & Period Index */}
                <div className="flex items-center gap-3 w-44 shrink-0">
                  <div
                    className="w-7 h-7 rounded-lg border font-mono font-bold flex items-center justify-center text-xs"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                  >
                    P{slot.period}
                  </div>
                  <div>
                    <span className="font-bold text-xs" style={{ color: 'var(--color-text)' }}>
                      Period {slot.period}
                    </span>
                    <span className="text-[11px] text-slate-400 block font-mono">
                      {slot.start} – {slot.end}
                    </span>
                  </div>
                </div>

                {/* Period Subject & Assigned Teacher */}
                <div className="flex-1 min-w-0">
                  {scheduled ? (
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                          {scheduled.subjectName}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-semibold border"
                          style={{
                            backgroundColor: 'var(--color-background)',
                            borderColor: 'var(--color-border)',
                            color: 'var(--color-text)',
                          }}
                        >
                          {scheduled.room}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <UserCheck className="w-3.5 h-3.5" style={{ color: 'var(--color-secondary)' }} />
                        <span>Faculty Instructor: <strong>{scheduled.teacherName}</strong></span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-400 text-xs italic flex items-center gap-1.5">
                      <span>Free Period / Unscheduled</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {scheduled ? (
                    canEditTimetable && (
                      <>
                        <button
                          onClick={() => handleOpenEditSlot(scheduled)}
                          className="p-1.5 rounded border hover:opacity-85 text-slate-500"
                          style={{ borderColor: 'var(--color-border)' }}
                          title="Edit slot"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmTarget(scheduled)}
                          className="p-1.5 rounded border hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                          style={{ borderColor: 'var(--color-border)' }}
                          title="Clear slot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )
                  ) : (
                    canEditTimetable && (
                      <button
                        onClick={() => handleOpenAddSlot(activeDay, slot.period)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold hover:opacity-90"
                        style={{
                          backgroundColor: 'var(--color-background)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-primary)',
                        }}
                      >
                        <Plus className="w-3 h-3" />
                        <span>Assign Period</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL: ADD / EDIT TIMETABLE SLOT */}
      {slotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleSaveSlot}
            className="w-full max-w-md rounded-xl border p-6 shadow-xl space-y-4 text-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  {slotToEdit ? 'Modify Timetable Allocation' : 'Schedule Timetable Slot'}
                </h3>
              </div>
              <button type="button" onClick={() => setSlotModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Day of Week *
                </label>
                <select
                  name="dayOfWeek"
                  defaultValue={prefilledDay}
                  className="w-full px-3 py-2 text-xs rounded border outline-none font-semibold"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                >
                  {WEEKDAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Period Slot *
                </label>
                <select
                  name="periodNumber"
                  defaultValue={prefilledPeriodNumber}
                  className="w-full px-3 py-2 text-xs rounded border outline-none font-semibold"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                >
                  {[1, 2, 3, 4, 5].map((p) => {
                    const info = PERIOD_TIMES.find((pt) => pt.period === p);
                    return (
                      <option key={p} value={p}>
                        Period {p} ({info?.start} - {info?.end})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Instructional Subject *
              </label>
              <select
                name="subjectId"
                defaultValue={slotToEdit?.subjectId || subjects[0]?.id}
                required
                className="w-full px-3 py-2 text-xs rounded border outline-none"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.code} · {sub.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Faculty Instructor *
              </label>
              <select
                name="teacherId"
                defaultValue={slotToEdit?.teacherId || activeStaff[0]?.id}
                required
                className="w-full px-3 py-2 text-xs rounded border outline-none"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                {activeStaff.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.department})
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                SCHLAR conflict engine validates teacher availability across all classes.
              </span>
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Classroom / Lab Assignment
              </label>
              <input
                name="room"
                defaultValue={slotToEdit?.room || selectedSection?.room || 'Room 204'}
                type="text"
                required
                className="w-full px-3 py-2 text-xs rounded border outline-none"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            <div className="pt-3 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => setSlotModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border text-slate-500 font-medium"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 font-bold text-white rounded-lg shadow-xs hover:opacity-95"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Save Period
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-sm rounded-xl border p-6 shadow-xl space-y-4 text-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                Remove Period {deleteConfirmTarget.periodNumber}?
              </h3>
            </div>

            <p className="text-slate-600 dark:text-slate-300">
              Are you sure you want to unschedule <strong>{deleteConfirmTarget.subjectName}</strong> ({deleteConfirmTarget.teacherName}) from {deleteConfirmTarget.dayOfWeek} Period {deleteConfirmTarget.periodNumber}?
            </p>

            <div className="pt-3 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--color-border)' }}>
              <button
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-3 py-1.5 rounded-lg border text-slate-500 font-medium"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 font-bold text-white rounded-lg bg-rose-600 shadow-xs hover:bg-rose-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
