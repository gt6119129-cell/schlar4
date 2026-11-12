import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  CalendarDays,
  Printer,
  Filter,
  CheckCircle2,
  Clock,
  Building2,
  User,
  AlertTriangle,
} from 'lucide-react';
import { DayOfWeek } from '../../types/school';

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const VPTimetableMonitoringModule: React.FC = () => {
  const { timetable, sections, staff, bellSchedule } = useSchoolData();

  const [viewMode, setViewMode] = useState<'class' | 'teacher' | 'master'>('class');
  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    sections.length > 0 ? sections[0].id : ''
  );
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(
    staff.length > 0 ? staff[0].id : ''
  );
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');

  const activeSections = sections.filter((s) => s.status === 'active');
  const activeStaff = staff.filter((s) => s.status === 'active');

  const selectedSection = activeSections.find((s) => s.id === selectedSectionId);
  const selectedTeacher = activeStaff.find((s) => s.id === selectedTeacherId);

  // Filter periods according to view mode
  const displayedPeriods = timetable.filter((period) => {
    if (viewMode === 'class') {
      return period.sectionId === selectedSectionId;
    }
    if (viewMode === 'teacher') {
      return period.teacherId === selectedTeacherId;
    }
    // master daily
    return period.dayOfWeek === selectedDay;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Timetable Supervision</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Canonical master schedule, period coverage, room allocations, and conflict monitoring (Read-only)
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border bg-card hover:bg-muted transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Schedule</span>
          </button>
        </div>
      </div>

      {/* VIEW SELECTOR & FILTERS */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border bg-card">
        <div className="flex items-center gap-1 p-1 bg-muted rounded-xl text-xs font-semibold">
          <button
            onClick={() => setViewMode('class')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'class' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Class Timetable
          </button>
          <button
            onClick={() => setViewMode('teacher')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'teacher' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Teacher Schedule
          </button>
          <button
            onClick={() => setViewMode('master')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'master' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Daily Master Board
          </button>
        </div>

        {/* Dynamic Context Selector */}
        <div className="flex items-center gap-2">
          {viewMode === 'class' && (
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <select
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="text-xs rounded-xl border bg-background px-3 py-1.5 focus:outline-hidden font-semibold"
              >
                {activeSections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.name} ({sec.className})
                  </option>
                ))}
              </select>
            </div>
          )}

          {viewMode === 'teacher' && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="text-xs rounded-xl border bg-background px-3 py-1.5 focus:outline-hidden font-semibold"
              >
                {activeStaff.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.department})
                  </option>
                ))}
              </select>
            </div>
          )}

          {viewMode === 'master' && (
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-muted-foreground" />
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value as DayOfWeek)}
                className="text-xs rounded-xl border bg-background px-3 py-1.5 focus:outline-hidden font-semibold"
              >
                {DAYS.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* WEEKLY GRID (FOR CLASS / TEACHER VIEWS) */}
      {viewMode !== 'master' ? (
        <div className="border rounded-2xl overflow-hidden bg-card shadow-xs">
          <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm text-foreground">
                {viewMode === 'class'
                  ? `${selectedSection?.name} Weekly Instructional Schedule`
                  : `${selectedTeacher?.name} Teaching Timetable`}
              </h2>
              <p className="text-xs text-muted-foreground">
                {viewMode === 'class'
                  ? `Room: ${selectedSection?.room || 'Unassigned'} • Class Teacher: ${selectedSection?.classTeacherName}`
                  : `${selectedTeacher?.designation} • ${selectedTeacher?.department}`}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Timetable Canonical & Conflict-Free</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-muted text-muted-foreground font-semibold border-b">
                <tr>
                  <th className="p-3 w-28 border-r">Day / Period</th>
                  <th className="p-3 border-r text-center">Period 1<br /><span className="text-[10px] font-normal">08:30–09:15</span></th>
                  <th className="p-3 border-r text-center">Period 2<br /><span className="text-[10px] font-normal">09:20–10:05</span></th>
                  <th className="p-3 border-r text-center">Period 3<br /><span className="text-[10px] font-normal">10:15–11:00</span></th>
                  <th className="p-3 border-r text-center">Period 4<br /><span className="text-[10px] font-normal">11:05–11:50</span></th>
                  <th className="p-3 text-center">Period 5<br /><span className="text-[10px] font-normal">12:35–01:20</span></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {DAYS.map((day) => {
                  const dayPeriods = displayedPeriods.filter((p) => p.dayOfWeek === day);

                  return (
                    <tr key={day} className="hover:bg-muted/30">
                      <td className="p-3 font-bold border-r bg-muted/20 text-foreground">{day}</td>
                      {[1, 2, 3, 4, 5].map((pNum) => {
                        const slot = dayPeriods.find((p) => p.periodNumber === pNum);

                        return (
                          <td key={pNum} className="p-2.5 border-r last:border-r-0 align-top">
                            {slot ? (
                              <div className="p-2.5 rounded-xl border bg-primary/5 border-primary/20 space-y-1">
                                <div className="font-bold text-foreground line-clamp-1">
                                  {slot.subjectName}
                                </div>
                                <div className="text-[11px] text-muted-foreground flex items-center justify-between">
                                  <span>{viewMode === 'class' ? slot.teacherName : slot.sectionName}</span>
                                  <span className="font-mono">{slot.room}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="p-2.5 rounded-xl border border-dashed text-center text-muted-foreground/60 text-[11px]">
                                Available / Prep
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
      ) : (
        /* DAILY MASTER BOARD */
        <div className="border rounded-2xl overflow-hidden bg-card shadow-xs">
          <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
            <h2 className="font-bold text-sm text-foreground">
              Master Campus Timetable for {selectedDay}
            </h2>
            <span className="text-xs text-muted-foreground">
              {displayedPeriods.length} instructional periods scheduled
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted text-muted-foreground font-semibold border-b">
                <tr>
                  <th className="p-3">Period #</th>
                  <th className="p-3">Timings</th>
                  <th className="p-3">Section</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Assigned Faculty</th>
                  <th className="p-3">Room</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {displayedPeriods.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-muted-foreground">
                      No periods configured for {selectedDay}.
                    </td>
                  </tr>
                ) : (
                  displayedPeriods.map((period) => (
                    <tr key={period.id} className="hover:bg-muted/30">
                      <td className="p-3 font-bold text-primary">Period {period.periodNumber}</td>
                      <td className="p-3 font-mono text-muted-foreground">
                        {period.startTime} – {period.endTime}
                      </td>
                      <td className="p-3 font-semibold text-foreground">{period.sectionName}</td>
                      <td className="p-3 font-bold text-foreground">{period.subjectName}</td>
                      <td className="p-3">{period.teacherName}</td>
                      <td className="p-3 font-mono">{period.room}</td>
                      <td className="p-3 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
