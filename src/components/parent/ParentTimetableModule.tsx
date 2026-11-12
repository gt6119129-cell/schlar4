import React, { useState } from 'react';
import { LinkedChild } from '../../data/mockData';
import { useSchoolData } from '../../context/SchoolDataContext';
import { DayOfWeek } from '../../types/school';
import {
  CalendarDays,
  Clock,
  BookOpen,
  MapPin,
  User,
  Coffee,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface ParentTimetableModuleProps {
  selectedChild: LinkedChild;
}

const DAYS_OF_WEEK: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const ParentTimetableModule: React.FC<ParentTimetableModuleProps> = ({
  selectedChild,
}) => {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const { timetable, sections } = useSchoolData();

  // Find the student's section
  const childSection = sections.find(
    (s) =>
      s.className.toLowerCase() === selectedChild.grade.toLowerCase() &&
      s.name.toLowerCase() === selectedChild.section.toLowerCase()
  );
  const sectionId = childSection?.id || (selectedChild.grade.includes('8') ? 'sec-8a' : 'sec-4b');

  // Filter periods for this child's section
  const sectionTimetable = timetable.filter((t) => t.sectionId === sectionId);
  const dayPeriods = sectionTimetable.filter((t) => t.dayOfWeek === selectedDay);

  // Fallback demo schedule if sectionTimetable is empty
  const periodsToShow =
    dayPeriods.length > 0
      ? dayPeriods
      : [
          {
            id: 'demo-p1',
            dayOfWeek: selectedDay,
            startTime: '08:30',
            endTime: '09:15',
            subjectName: selectedChild.grade.includes('8') ? 'Core Mathematics' : 'Arithmetic & Numbers',
            teacherName: selectedChild.grade.includes('8') ? 'Ms. Sarah Henderson' : 'Mr. David Miller',
            room: selectedChild.homeroom.split('(')[0],
            isBreak: false,
          },
          {
            id: 'demo-p2',
            dayOfWeek: selectedDay,
            startTime: '09:20',
            endTime: '10:05',
            subjectName: selectedChild.grade.includes('8') ? 'Physics & Mechanics' : 'General Science & Nature',
            teacherName: selectedChild.grade.includes('8') ? 'Dr. Marcus Vance' : 'Mr. David Miller',
            room: selectedChild.grade.includes('8') ? 'STEM Lab 3' : 'Room 112',
            isBreak: false,
          },
          {
            id: 'demo-break1',
            dayOfWeek: selectedDay,
            startTime: '10:05',
            endTime: '10:25',
            subjectName: 'Morning Recess & Nutrition Break',
            teacherName: 'Campus Supervision',
            room: 'Courtyard & Dining Hall',
            isBreak: true,
          },
          {
            id: 'demo-p3',
            dayOfWeek: selectedDay,
            startTime: '10:25',
            endTime: '11:10',
            subjectName: selectedChild.grade.includes('8') ? 'English Literature & Composition' : 'Reading & Literacy',
            teacherName: selectedChild.grade.includes('8') ? 'Mr. David Miller' : 'Ms. Elena Rostova',
            room: selectedChild.homeroom.split('(')[0],
            isBreak: false,
          },
          {
            id: 'demo-p4',
            dayOfWeek: selectedDay,
            startTime: '11:15',
            endTime: '12:00',
            subjectName: selectedChild.grade.includes('8') ? 'World History & Civics' : 'Social Studies & Geography',
            teacherName: selectedChild.grade.includes('8') ? 'Mr. Roberto Alvarez' : 'Mr. David Miller',
            room: selectedChild.homeroom.split('(')[0],
            isBreak: false,
          },
          {
            id: 'demo-lunch',
            dayOfWeek: selectedDay,
            startTime: '12:00',
            endTime: '12:45',
            subjectName: 'Lunch & Student Commons Period',
            teacherName: 'Staff Duty',
            room: 'Dining Commons',
            isBreak: true,
          },
          {
            id: 'demo-p5',
            dayOfWeek: selectedDay,
            startTime: '12:50',
            endTime: '01:35',
            subjectName: selectedChild.grade.includes('8') ? 'Visual Fine Arts & Studio' : 'Art Studio & Crafts',
            teacherName: 'Ms. Clara Oswald',
            room: 'Fine Arts Studio 1',
            isBreak: false,
          },
          {
            id: 'demo-p6',
            dayOfWeek: selectedDay,
            startTime: '01:40',
            endTime: '02:25',
            subjectName: 'Physical Education & Athletics',
            teacherName: 'Coach Jason Taylor',
            room: 'Field House Gymnasium',
            isBreak: false,
          },
        ];

  return (
    <div className="space-y-3 animate-in fade-in duration-150">
      {/* Overview Card */}
      <div
        className="p-4 rounded-xl border shadow-xs"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Weekly Timetable
            </span>
            <span className="text-sm font-extrabold" style={{ color: 'var(--color-text)' }}>
              {selectedChild.name} · {selectedChild.grade} ({selectedChild.section})
            </span>
          </div>

          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: 'var(--color-subtle-accent, rgba(0,0,0,0.06))',
              color: 'var(--color-primary)',
            }}
          >
            Advisor: {selectedChild.classTeacher}
          </span>
        </div>

        {/* Day Selector Pills */}
        <div className="grid grid-cols-5 gap-1 p-1 rounded-lg border text-center text-xs" style={{ borderColor: 'var(--color-border)' }}>
          {DAYS_OF_WEEK.map((day) => {
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`py-1.5 rounded text-[11px] font-bold transition-all ${
                  isSelected
                    ? 'bg-black/10 dark:bg-white/10 shadow-xs'
                    : 'opacity-65 hover:opacity-100'
                }`}
                style={{ color: isSelected ? 'var(--color-primary)' : 'var(--color-text)' }}
              >
                <span>{day.slice(0, 3)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Period Cards List */}
      <div className="space-y-2">
        {periodsToShow.map((period, idx) => {
          const isBreak = period.isBreak;
          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 shadow-xs ${
                isBreak
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-dashed border-amber-300 dark:border-amber-800'
                  : ''
              }`}
              style={
                !isBreak
                  ? {
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                    }
                  : undefined
              }
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-lg flex flex-col items-center justify-center shrink-0 font-bold ${
                    isBreak
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                      : 'bg-black/5 dark:bg-white/5'
                  }`}
                  style={!isBreak ? { color: 'var(--color-primary)' } : undefined}
                >
                  {isBreak ? (
                    <Coffee className="w-4 h-4" />
                  ) : (
                    <>
                      <span className="text-[8px] uppercase text-slate-400">P</span>
                      <span className="text-xs leading-none">{idx + 1}</span>
                    </>
                  )}
                </div>

                <div className="min-w-0">
                  <span
                    className={`font-bold block truncate text-xs ${
                      isBreak ? 'text-amber-900 dark:text-amber-200' : ''
                    }`}
                    style={!isBreak ? { color: 'var(--color-text)' } : undefined}
                  >
                    {period.subjectName}
                  </span>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5 truncate">
                    <span className="font-mono font-medium">{period.startTime}–{period.endTime}</span>
                    {!isBreak && (
                      <>
                        <span>·</span>
                        <span className="truncate">{period.teacherName}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Room Badge */}
              <span
                className="font-mono text-[10px] px-2 py-0.5 rounded border shrink-0"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                {period.room}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
