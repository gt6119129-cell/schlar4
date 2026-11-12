import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  CalendarDays,
  Printer,
  Clock,
  Building2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { DayOfWeek } from '../../types/school';

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const TeacherTimetableModule: React.FC = () => {
  const { timetable } = useSchoolData();
  const teacherId = 'staff-henderson';

  const [activeDay, setActiveDay] = useState<DayOfWeek>('Monday');

  // Filter periods strictly for Ms. Sarah Henderson
  const myPeriods = timetable.filter((t) => t.teacherId === teacherId);
  const todayPeriods = myPeriods.filter((t) => t.dayOfWeek === activeDay);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Teaching Timetable</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Weekly instructional schedule, period hours, assigned classrooms, and prep windows
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold border bg-card hover:bg-muted transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Schedule</span>
        </button>
      </div>

      {/* DAY TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {DAYS.map((day) => {
          const isCurrent = day === 'Monday';
          const isSelected = day === activeDay;
          const count = myPeriods.filter((p) => p.dayOfWeek === day && !p.isBreak).length;

          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-card border hover:bg-muted text-muted-foreground'
              }`}
            >
              <span>{day}</span>
              {isCurrent && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${isSelected ? 'bg-primary-foreground/20 text-white' : 'bg-primary/10 text-primary'}`}>
                  TODAY
                </span>
              )}
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isSelected ? 'bg-primary-foreground/20 text-white' : 'bg-muted text-foreground'}`}>
                {count} periods
              </span>
            </button>
          );
        })}
      </div>

      {/* DAILY SCHEDULE TIMELINE FOR ACTIVE DAY */}
      <div className="border rounded-2xl overflow-hidden bg-card shadow-xs">
        <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" />
            <h2 className="font-bold text-sm text-foreground">Teaching Timeline for {activeDay}</h2>
          </div>
          <span className="text-xs text-muted-foreground">Standard Period Duration: 45 Mins</span>
        </div>

        <div className="p-5 space-y-3">
          {[1, 2, 3, 4, 5].map((periodNum) => {
            const period = todayPeriods.find((p) => p.periodNumber === periodNum);

            if (period) {
              return (
                <div
                  key={periodNum}
                  className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center shrink-0">
                      P{periodNum}
                    </div>
                    <div>
                      <div className="text-base font-bold text-foreground">{period.subjectName}</div>
                      <div className="text-xs text-muted-foreground">
                        Class: <strong className="text-foreground">{period.sectionName}</strong> • Room: <strong className="text-foreground">{period.room}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-xs font-mono font-bold text-foreground">
                      {period.startTime} – {period.endTime}
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      Active Teaching Period
                    </span>
                  </div>
                </div>
              );
            }

            // Morning Break between period 2 and 3
            if (periodNum === 3) {
              return (
                <React.Fragment key="break">
                  <div className="p-3 rounded-xl border border-dashed border-amber-300 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/20 flex items-center justify-between text-xs text-amber-900 dark:text-amber-300">
                    <span className="font-semibold flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      Morning Nutrition & Advisory Break
                    </span>
                    <span className="font-mono">10:05 AM – 10:15 AM</span>
                  </div>

                  <div className="p-4 rounded-xl border border-dashed bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted font-bold text-sm flex items-center justify-center shrink-0">
                        P{periodNum}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">Department Office Hours / Lesson Prep</div>
                        <div className="text-[11px] text-muted-foreground">Math Resource Center (Room 204)</div>
                      </div>
                    </div>
                    <span className="font-mono text-xs">10:15 AM – 11:00 AM</span>
                  </div>
                </React.Fragment>
              );
            }

            return (
              <div
                key={periodNum}
                className="p-4 rounded-xl border border-dashed bg-muted/20 flex items-center justify-between text-xs text-muted-foreground"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted font-bold text-sm flex items-center justify-center shrink-0">
                    P{periodNum}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Free Period / Grading & Planning</div>
                    <div className="text-[11px] text-muted-foreground">Available for student consultation</div>
                  </div>
                </div>
                <span className="font-mono text-xs">Unscheduled</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
