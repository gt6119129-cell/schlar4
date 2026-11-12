import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  Users,
  Search,
  BookOpen,
  CalendarDays,
  CheckSquare,
  FileCheck,
  Award,
  ChevronRight,
  ArrowLeft,
  Clock,
  User,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface TeacherMyClassesModuleProps {
  onNavigateTab?: (tabId: string) => void;
}

export const TeacherMyClassesModule: React.FC<TeacherMyClassesModuleProps> = ({ onNavigateTab }) => {
  const { sections, students, timetable, attendance, assignments, assessmentTasks } = useSchoolData();

  // Ms. Sarah Henderson assigned sections:
  const assignedSectionIds = ['sec-8a', 'sec-9b', 'sec-10a'];
  const mySections = sections.filter((s) => assignedSectionIds.includes(s.id));

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [classSubTab, setClassSubTab] = useState<'overview' | 'students' | 'attendance' | 'assignments' | 'assessments' | 'timetable'>('overview');

  const filteredSections = mySections.filter((sec) =>
    sec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedSection = mySections.find((s) => s.id === selectedSectionId);

  // Scoped class data
  const classStudents = selectedSection
    ? students.filter((st) => st.sectionId === selectedSection.id && st.enrollmentStatus === 'active')
    : [];

  const classAssignments = selectedSection
    ? assignments.filter((a) => a.sectionId === selectedSection.id)
    : [];

  const classAssessments = selectedSection
    ? assessmentTasks.filter((t) => t.sectionId === selectedSection.id)
    : [];

  const classTimetable = selectedSection
    ? timetable.filter((t) => t.sectionId === selectedSection.id)
    : [];

  const todayDate = '2026-10-19';
  const classAttendanceToday = selectedSection
    ? attendance.filter((a) => a.sectionId === selectedSection.id && a.date === todayDate)
    : [];

  return (
    <div className="space-y-6">
      {/* If viewing a specific class workspace */}
      {selectedSection ? (
        <div className="space-y-6">
          {/* CLASS HEADER & BACK BUTTON */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedSectionId(null)}
                className="p-2 rounded-xl border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title="Back to Assigned Classes"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight">{selectedSection.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
                    {selectedSection.className}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Subject: Mathematics • Room: {selectedSection.room} • Capacity: {classStudents.length} / {selectedSection.capacity} students
                </p>
              </div>
            </div>

            {/* CLASS WORKSPACE SUB-TABS */}
            <div className="flex items-center gap-1 p-1 bg-muted rounded-xl text-xs font-semibold overflow-x-auto">
              <button
                onClick={() => setClassSubTab('overview')}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                  classSubTab === 'overview' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setClassSubTab('students')}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                  classSubTab === 'students' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Students ({classStudents.length})
              </button>
              <button
                onClick={() => setClassSubTab('attendance')}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                  classSubTab === 'attendance' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Attendance
              </button>
              <button
                onClick={() => setClassSubTab('assignments')}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                  classSubTab === 'assignments' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Assignments ({classAssignments.length})
              </button>
              <button
                onClick={() => setClassSubTab('assessments')}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                  classSubTab === 'assessments' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Assessments
              </button>
              <button
                onClick={() => setClassSubTab('timetable')}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                  classSubTab === 'timetable' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Timetable
              </button>
            </div>
          </div>

          {/* 1. OVERVIEW SUBTAB */}
          {classSubTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border bg-card shadow-xs">
                  <span className="text-xs text-muted-foreground font-semibold">Active Roster</span>
                  <div className="mt-1 text-2xl font-bold text-foreground">{classStudents.length} Students</div>
                  <p className="text-[11px] text-muted-foreground">Class section enrollment</p>
                </div>
                <div className="p-4 rounded-xl border bg-card shadow-xs">
                  <span className="text-xs text-muted-foreground font-semibold">Today's Attendance</span>
                  <div className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {classAttendanceToday.length > 0 ? 'Recorded' : 'Pending'}
                  </div>
                  <p className="text-[11px] text-muted-foreground">Morning roll call register</p>
                </div>
                <div className="p-4 rounded-xl border bg-card shadow-xs">
                  <span className="text-xs text-muted-foreground font-semibold">Active Homework</span>
                  <div className="mt-1 text-2xl font-bold text-primary">{classAssignments.length} Assigned</div>
                  <p className="text-[11px] text-muted-foreground">Open homework briefs</p>
                </div>
                <div className="p-4 rounded-xl border bg-card shadow-xs">
                  <span className="text-xs text-muted-foreground font-semibold">Class Median</span>
                  <div className="mt-1 text-2xl font-bold text-foreground">3.82 GPA</div>
                  <p className="text-[11px] text-muted-foreground">Subject performance curve</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-3">
                <h3 className="font-bold text-sm text-foreground">Teaching Quick Actions for {selectedSection.name}</h3>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => setClassSubTab('attendance')}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center gap-1.5"
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span>Take Class Attendance</span>
                  </button>
                  <button
                    onClick={() => setClassSubTab('assignments')}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-1.5"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Create Assignment</span>
                  </button>
                  <button
                    onClick={() => setClassSubTab('students')}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border bg-card hover:bg-muted text-foreground transition-all flex items-center gap-1.5"
                  >
                    <Users className="w-4 h-4" />
                    <span>Inspect Student Profiles</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. STUDENTS ROSTER SUBTAB */}
          {classSubTab === 'students' && (
            <div className="border rounded-2xl overflow-hidden bg-card shadow-xs">
              <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                <h2 className="font-bold text-sm text-foreground">{selectedSection.name} Enrolled Students</h2>
                <span className="text-xs text-muted-foreground">{classStudents.length} Students</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted text-muted-foreground font-semibold border-b">
                    <tr>
                      <th className="p-3">Admission No</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Gender</th>
                      <th className="p-3">Subject GPA</th>
                      <th className="p-3">Guardian Contact</th>
                      <th className="p-3 text-right">Academic Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {classStudents.map((st) => (
                      <tr key={st.id} className="hover:bg-muted/30">
                        <td className="p-3 font-mono text-muted-foreground">{st.admissionNo}</td>
                        <td className="p-3 font-bold text-foreground">{st.name}</td>
                        <td className="p-3">{st.gender}</td>
                        <td className="p-3 font-bold text-primary">{st.gpa || '3.75'}</td>
                        <td className="p-3 text-muted-foreground">{st.guardianName} ({st.guardianPhone})</td>
                        <td className="p-3 text-right text-muted-foreground truncate max-w-xs">{st.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. ATTENDANCE SUBTAB */}
          {classSubTab === 'attendance' && (
            <div className="p-6 rounded-2xl border bg-card shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-base">Class Attendance Register</h2>
                  <p className="text-xs text-muted-foreground">Roll call taking and historical attendance for {selectedSection.name}</p>
                </div>
                {onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('attendance')}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center gap-1.5"
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span>Launch Full Roll Call Terminal</span>
                  </button>
                )}
              </div>

              <div className="p-4 rounded-xl border bg-muted/30 text-xs">
                {classAttendanceToday.length > 0 ? (
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Attendance for today (Oct 19, 2026) has already been submitted.</span>
                  </div>
                ) : (
                  <div className="text-amber-600 dark:text-amber-400 font-semibold">
                    Attendance register for today has not yet been submitted. Click Launch Full Roll Call Terminal above to take attendance.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. ASSIGNMENTS SUBTAB */}
          {classSubTab === 'assignments' && (
            <div className="border rounded-2xl overflow-hidden bg-card shadow-xs">
              <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                <h2 className="font-bold text-sm text-foreground">Homework & Project Assignments</h2>
                <span className="text-xs text-muted-foreground">{classAssignments.length} Assignments</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted text-muted-foreground font-semibold border-b">
                    <tr>
                      <th className="p-3">Title</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Due Date</th>
                      <th className="p-3">Submissions</th>
                      <th className="p-3">Graded</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {classAssignments.map((a) => (
                      <tr key={a.id} className="hover:bg-muted/30">
                        <td className="p-3 font-bold text-foreground">{a.title}</td>
                        <td className="p-3 text-muted-foreground">{a.type}</td>
                        <td className="p-3 font-mono">{a.dueDate}</td>
                        <td className="p-3 font-semibold">{a.submissionsCount}/{a.totalStudents}</td>
                        <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">{a.gradedCount} graded</td>
                        <td className="p-3 text-right">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                            {a.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. ASSESSMENTS SUBTAB */}
          {classSubTab === 'assessments' && (
            <div className="border rounded-2xl overflow-hidden bg-card shadow-xs">
              <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                <h2 className="font-bold text-sm text-foreground">Scheduled Assessments & Tests</h2>
              </div>
              <div className="p-4 space-y-2">
                {classAssessments.map((t) => (
                  <div key={t.id} className="p-3.5 rounded-xl border bg-muted/30 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-foreground text-sm">{t.subjectName}</div>
                      <div className="text-xs text-muted-foreground">
                        {t.examName} • {t.examDate} at {t.startTime} • Room {t.room}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                      {t.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. TIMETABLE SUBTAB */}
          {classSubTab === 'timetable' && (
            <div className="border rounded-2xl overflow-hidden bg-card shadow-xs">
              <div className="p-4 border-b bg-muted/30">
                <h2 className="font-bold text-sm text-foreground">{selectedSection.name} Periods</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted text-muted-foreground font-semibold border-b">
                    <tr>
                      <th className="p-3">Day</th>
                      <th className="p-3">Period</th>
                      <th className="p-3">Timings</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Teacher</th>
                      <th className="p-3 text-right">Room</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {classTimetable.map((period) => (
                      <tr key={period.id} className="hover:bg-muted/30">
                        <td className="p-3 font-bold text-foreground">{period.dayOfWeek}</td>
                        <td className="p-3 font-semibold text-primary">Period {period.periodNumber}</td>
                        <td className="p-3 font-mono">{period.startTime} – {period.endTime}</td>
                        <td className="p-3 font-bold text-foreground">{period.subjectName}</td>
                        <td className="p-3">{period.teacherName}</td>
                        <td className="p-3 text-right font-mono">{period.room}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ASSIGNED CLASSES DIRECTORY */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">My Assigned Classes</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Instructional cohorts assigned to Ms. Sarah Henderson
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search assigned cohorts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-card focus:outline-hidden focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filteredSections.map((sec) => {
              const enrolledCount = students.filter(
                (st) => st.sectionId === sec.id && st.enrollmentStatus === 'active'
              ).length;
              const hasAttendanceToday = attendance.some(
                (a) => a.sectionId === sec.id && a.date === todayDate
              );

              return (
                <div
                  key={sec.id}
                  onClick={() => setSelectedSectionId(sec.id)}
                  className="p-6 rounded-2xl border bg-card hover:shadow-lg hover:border-primary/40 cursor-pointer transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                        {sec.className}
                      </span>
                      <span className="text-xs font-mono font-medium text-muted-foreground">{sec.room}</span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-foreground">{sec.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">Teaching Subject: <strong>Mathematics</strong></p>
                    </div>

                    <div className="p-3 rounded-xl bg-muted/40 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Class Size:</span>
                        <span className="font-bold text-foreground">{enrolledCount || 28} Students</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Today's Attendance:</span>
                        <span
                          className={`font-semibold ${
                            hasAttendanceToday ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {hasAttendanceToday ? 'Submitted' : 'Pending Roll Call'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t flex items-center justify-between text-xs font-semibold text-primary">
                    <span>Open Class Workspace</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
