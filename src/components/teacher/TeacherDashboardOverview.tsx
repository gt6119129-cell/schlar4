import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  Users,
  CheckSquare,
  CalendarDays,
  FileCheck,
  Award,
  Clock,
  ArrowRight,
  Plus,
  Bell,
  BookOpen,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface TeacherDashboardOverviewProps {
  onNavigateTab: (tabId: string) => void;
  onSelectClassForAttendance?: (sectionId: string) => void;
}

export const TeacherDashboardOverview: React.FC<TeacherDashboardOverviewProps> = ({
  onNavigateTab,
  onSelectClassForAttendance,
}) => {
  const {
    sections,
    students,
    timetable,
    attendance,
    assignments,
    assessmentTasks,
    announcements,
  } = useSchoolData();

  // Demo logged-in teacher is Ms. Sarah Henderson ('staff-henderson')
  const teacherId = 'staff-henderson';

  // Assigned sections for Ms. Henderson
  const assignedSectionIds = ['sec-8a', 'sec-9b', 'sec-10a'];
  const mySections = sections.filter((s) => assignedSectionIds.includes(s.id));

  // Today's scheduled periods for Ms. Henderson (Monday)
  const todayClasses = timetable.filter(
    (t) => t.teacherId === teacherId && t.dayOfWeek === 'Monday' && !t.isBreak
  );

  // Next scheduled class (first class of the day)
  const nextClass = todayClasses[0];

  // Attendance taken check for today (2026-10-19)
  const todayDate = '2026-10-19';
  const attendanceSessionsPending = mySections.filter((sec) => {
    const records = attendance.filter((a) => a.sectionId === sec.id && a.date === todayDate);
    return records.length === 0;
  });

  // Assignments needing grading
  const myAssignments = assignments.filter((a) => a.teacherId === teacherId);
  const pendingGradingCount = myAssignments.reduce(
    (acc, a) => acc + (a.submissionsCount - a.gradedCount),
    0
  );

  // Upcoming assessments for Ms. Henderson's subjects
  const myAssessments = assessmentTasks.filter((t) => t.teacherId === teacherId);

  // Recent announcements
  const recentAnnouncements = announcements.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* WELCOME BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Senior Faculty • Department of Mathematics</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome, Ms. Sarah Henderson</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Daily classroom instructional cockpit. Manage attendance registers, curriculum pacing, student assignments, and evaluation marks across your assigned teaching cohorts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('attendance')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center gap-2 shadow-sm"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Take Attendance</span>
            </button>
            <button
              onClick={() => onNavigateTab('assignments')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Assignment</span>
            </button>
          </div>
        </div>
      </div>

      {/* CORE KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Today's Schedule</span>
            <CalendarDays className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold">{todayClasses.length} Periods</div>
          <p className="text-xs text-muted-foreground mt-1">Scheduled instructional periods today</p>
        </div>

        <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Attendance Queue</span>
            <CheckSquare className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold">{attendanceSessionsPending.length} Pending</div>
          <p className="text-xs text-muted-foreground mt-1">Roll calls awaiting submission</p>
        </div>

        <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Grading Queue</span>
            <FileCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold">{pendingGradingCount} Submissions</div>
          <p className="text-xs text-muted-foreground mt-1">Homework awaiting evaluation</p>
        </div>

        <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Upcoming Tests</span>
            <Award className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-bold">{myAssessments.length} Assessments</div>
          <p className="text-xs text-muted-foreground mt-1">Scheduled in current cycle</p>
        </div>
      </div>

      {/* TWO COLUMN GRID: TODAY'S SCHEDULE & ACTION CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Schedule & Next Class & Assigned Cohorts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Class Focus Card */}
          {nextClass && (
            <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  NEXT UPCOMING CLASS
                </span>
                <span className="text-xs font-mono font-semibold text-primary">{nextClass.room}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {nextClass.sectionName} — {nextClass.subjectName}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Period {nextClass.periodNumber} • {nextClass.startTime} – {nextClass.endTime}
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab('attendance')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shrink-0"
                >
                  Start Roll Call
                </button>
              </div>
            </div>
          )}

          {/* Today's Classes Schedule */}
          <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-base">Today's Class Schedule</h2>
                <p className="text-xs text-muted-foreground">Instructional periods mapped for Monday</p>
              </div>
              <button
                onClick={() => onNavigateTab('my-timetable')}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                Weekly View <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {todayClasses.map((period) => (
                <div
                  key={period.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border bg-muted/40 hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                      P{period.periodNumber}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground">{period.subjectName}</div>
                      <div className="text-xs text-muted-foreground">
                        {period.sectionName} • {period.room}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-semibold text-foreground">
                      {period.startTime} – {period.endTime}
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      Scheduled
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Classes Quick Cards */}
          <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-base">My Assigned Classes</h2>
                <p className="text-xs text-muted-foreground">Cohorts under your instruction</p>
              </div>
              <button
                onClick={() => onNavigateTab('my-classes')}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Manage Classes →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {mySections.map((sec) => {
                const enrolledCount = students.filter(
                  (st) => st.sectionId === sec.id && st.enrollmentStatus === 'active'
                ).length;

                return (
                  <div
                    key={sec.id}
                    onClick={() => onNavigateTab('my-classes')}
                    className="p-4 rounded-xl border bg-muted/30 hover:bg-muted/60 cursor-pointer transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary">{sec.className}</span>
                      <span className="text-[11px] text-muted-foreground font-mono">{sec.room}</span>
                    </div>
                    <h4 className="font-bold text-sm text-foreground">{sec.name}</h4>
                    <div className="text-xs text-muted-foreground flex items-center justify-between pt-1 border-t">
                      <span>{enrolledCount || 28} Students</span>
                      <span className="font-semibold text-foreground">Mathematics</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Pending Actions & Notices */}
        <div className="space-y-6">
          {/* Attendance Awaiting Submission */}
          <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-base flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-500" />
                <span>Attendance Desk</span>
              </h2>
              {attendanceSessionsPending.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                  {attendanceSessionsPending.length} Due
                </span>
              )}
            </div>

            {attendanceSessionsPending.length === 0 ? (
              <div className="text-center py-4 text-xs text-muted-foreground">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                All assigned attendance registers for today are up to date!
              </div>
            ) : (
              <div className="space-y-2">
                {attendanceSessionsPending.map((sec) => (
                  <div
                    key={sec.id}
                    className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-foreground">{sec.name}</div>
                      <div className="text-[11px] text-muted-foreground">Morning Session • Oct 19</div>
                    </div>
                    <button
                      onClick={() => onNavigateTab('attendance')}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all"
                    >
                      Take
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assignments to Grade */}
          <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-base flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-indigo-500" />
                <span>Grading Queue</span>
              </h2>
              <button
                onClick={() => onNavigateTab('assignments')}
                className="text-xs font-semibold text-primary hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-2">
              {myAssignments.slice(0, 3).map((asgn) => (
                <div
                  key={asgn.id}
                  onClick={() => onNavigateTab('assignments')}
                  className="p-3 rounded-xl border bg-muted/40 hover:bg-muted/80 cursor-pointer transition-all space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">{asgn.title}</span>
                    <span className="text-[10px] text-muted-foreground">{asgn.sectionName}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>
                      {asgn.submissionsCount - asgn.gradedCount} to grade
                    </span>
                    <span>Due: {asgn.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* School Announcements */}
          <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-base flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Announcements</span>
              </h2>
              <button
                onClick={() => onNavigateTab('teacher-announcements')}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Circulars
              </button>
            </div>

            <div className="space-y-2">
              {recentAnnouncements.map((ann) => (
                <div key={ann.id} className="p-3 rounded-xl border bg-muted/20 space-y-1 text-xs">
                  <div className="font-bold text-foreground line-clamp-1">{ann.title}</div>
                  <p className="text-muted-foreground line-clamp-2 text-[11px]">{ann.content}</p>
                  <div className="text-[10px] text-muted-foreground pt-1 flex items-center justify-between">
                    <span>{ann.authorStaffName} ({ann.authorRole})</span>
                    <span>{ann.publishDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
