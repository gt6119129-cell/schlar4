import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  GraduationCap,
  Users,
  CalendarDays,
  CheckSquare,
  Award,
  AlertTriangle,
  Clock,
  ArrowRight,
  ClipboardCheck,
  TrendingUp,
  FileCheck,
  Building2,
  CheckCircle2,
} from 'lucide-react';

interface VPDashboardOverviewProps {
  onNavigateTab: (tabId: string) => void;
}

export const VPDashboardOverview: React.FC<VPDashboardOverviewProps> = ({ onNavigateTab }) => {
  const {
    classes,
    sections,
    staff,
    students,
    timetable,
    attendance,
    exams,
    assessmentTasks,
    syllabus,
    approvals,
    interventions,
  } = useSchoolData();

  // Metrics derived from canonical demo data
  const totalClasses = classes.filter((c) => c.status === 'active').length;
  const totalSections = sections.filter((s) => s.status === 'active').length;
  const facultyMembers = staff.filter((s) => s.status === 'active');
  const teacherCount = facultyMembers.length;

  // Real Attendance calculation
  const totalAttendanceRecords = attendance.length;
  const presentCount = attendance.filter((a) => a.status === 'present').length;
  const attendanceRate = totalAttendanceRecords > 0 ? Math.round((presentCount / totalAttendanceRecords) * 100) : 96;

  // Timetable metrics
  const activePeriods = timetable.filter((t) => !t.isBreak).length;
  const mondayPeriods = timetable.filter((t) => t.dayOfWeek === 'Monday' && !t.isBreak).length;

  // Syllabus progress
  const totalLessonsPlanned = syllabus.reduce((acc, s) => acc + s.totalLessons, 0);
  const totalLessonsDone = syllabus.reduce((acc, s) => acc + s.completedLessons, 0);
  const syllabusRate = totalLessonsPlanned > 0 ? Math.round((totalLessonsDone / totalLessonsPlanned) * 100) : 78;

  // Pending Approvals
  const pendingApprovals = approvals.filter((a) => a.status === 'pending');

  // Flagged students
  const activeInterventions = interventions.filter((i) => i.status === 'open' || i.status === 'in_progress');

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Vice Principal • Academic Operations</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Academic Oversight & Instructional Health</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Real-time monitoring of curriculum pacing, timetable fulfillment, teacher coordination, and academic intervention workflows across all grade levels.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('vp-pending-approvals')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center gap-2 shadow-sm"
            >
              <Clock className="w-4 h-4" />
              <span>Pending Approvals ({pendingApprovals.length})</span>
            </button>
            <button
              onClick={() => onNavigateTab('timetable')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 flex items-center gap-2"
            >
              <CalendarDays className="w-4 h-4" />
              <span>Inspect Timetable</span>
            </button>
          </div>
        </div>
      </div>

      {/* CORE KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Cohort Scope</span>
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold">{totalClasses} Grades</div>
          <p className="text-xs text-muted-foreground mt-1">{totalSections} active class sections supervised</p>
        </div>

        <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Faculty Roster</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold">{teacherCount} Teachers</div>
          <p className="text-xs text-muted-foreground mt-1">100% scheduled period coverage</p>
        </div>

        <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Syllabus Pacing</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-bold">{syllabusRate}%</div>
          <p className="text-xs text-muted-foreground mt-1">{totalLessonsDone}/{totalLessonsPlanned} curriculum units completed</p>
        </div>

        <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Attendance Rate</span>
            <CheckSquare className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold">{attendanceRate}%</div>
          <p className="text-xs text-muted-foreground mt-1">Campus instructional average</p>
        </div>
      </div>

      {/* TWO COLUMN GRID: TODAY'S SCHEDULE & PENDING WORKFLOWS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Timetable & Examinations Pacing */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Period Timetable Overview */}
          <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-base">Today's Master Schedule Pacing</h2>
                <p className="text-xs text-muted-foreground">Monday periods assigned across science and humanities wings</p>
              </div>
              <button
                onClick={() => onNavigateTab('timetable')}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                Full Grid <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {timetable.slice(0, 5).map((period) => (
                <div
                  key={period.id}
                  className="flex items-center justify-between p-3 rounded-xl border bg-muted/40 hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                      P{period.periodNumber}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{period.subjectName}</div>
                      <div className="text-xs text-muted-foreground">
                        {period.sectionName} • {period.room}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-foreground">{period.teacherName}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {period.startTime} – {period.endTime}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Examinations & Assessment Tasks */}
          <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-base">Examination & Assessment Progress</h2>
                <p className="text-xs text-muted-foreground">Current evaluation cycle and marks moderation tracking</p>
              </div>
              <button
                onClick={() => onNavigateTab('vp-exam-overview')}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                Exam Center <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {assessmentTasks.slice(0, 4).map((task) => (
                <div key={task.id} className="p-3.5 rounded-xl border bg-muted/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary">{task.sectionName}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        task.status === 'reviewed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : task.status === 'submitted'
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                      }`}
                    >
                      {task.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm font-semibold">{task.subjectName}</div>
                  <div className="text-xs text-muted-foreground flex items-center justify-between">
                    <span>{task.teacherName}</span>
                    <span>Max: {task.maxMarks} Marks</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right col: Pending Approvals & At-Risk Students */}
        <div className="space-y-6">
          {/* Action Required: Approvals Queue */}
          <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Pending Approvals</span>
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                {pendingApprovals.length}
              </span>
            </div>

            {pendingApprovals.length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                All submitted academic requests have been processed.
              </div>
            ) : (
              <div className="space-y-2.5">
                {pendingApprovals.map((appr) => (
                  <div
                    key={appr.id}
                    onClick={() => onNavigateTab('vp-pending-approvals')}
                    className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100/50 dark:hover:bg-amber-950/40 cursor-pointer transition-all"
                  >
                    <div className="text-xs font-bold text-amber-900 dark:text-amber-300">
                      {appr.type}
                    </div>
                    <div className="text-xs font-semibold text-foreground mt-0.5 line-clamp-1">
                      {appr.title}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1 flex items-center justify-between">
                      <span>{appr.requestedByStaffName}</span>
                      <span>{appr.submissionDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => onNavigateTab('vp-pending-approvals')}
              className="w-full py-2 text-xs font-semibold text-center border rounded-lg hover:bg-muted transition-colors"
            >
              Open Approvals Desk
            </button>
          </div>

          {/* Students Requiring Intervention */}
          <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Interventions ({activeInterventions.length})</span>
              </h2>
              <button
                onClick={() => onNavigateTab('vp-students-attention')}
                className="text-xs text-primary font-semibold hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              {activeInterventions.map((intv) => (
                <div
                  key={intv.id}
                  onClick={() => onNavigateTab('vp-interventions')}
                  className="p-3 rounded-xl border bg-muted/40 hover:bg-muted/80 cursor-pointer transition-all space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">{intv.studentName}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
                        intv.severity === 'high' || intv.severity === 'critical'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {intv.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{intv.description}</p>
                  <div className="text-[11px] text-muted-foreground flex items-center justify-between pt-1">
                    <span>Mentor: {intv.responsibleStaffName}</span>
                    <span>Due: {intv.followUpDate}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateTab('vp-interventions')}
              className="w-full py-2 text-xs font-semibold text-center border rounded-lg hover:bg-muted transition-colors"
            >
              Log New Academic Intervention
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
