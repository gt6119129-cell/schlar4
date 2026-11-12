import React, { useState } from 'react';
import { RoleConfig } from '../../config/roles';
import { TeacherClass, DEMO_TEACHER_CLASSES } from '../../data/mockData';
import { SchlarLogo } from '../brand/SchlarLogo';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  Home,
  Users,
  CheckSquare,
  Menu,
  ChevronDown,
  Check,
  Bell,
  Award,
  CalendarDays,
  FileCheck,
  Settings,
  ArrowLeft,
  Monitor,
  Maximize2,
  Minimize2,
  Clock,
  ClipboardCheck,
  BookOpenCheck,
  Plus,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  TrendingUp,
  Send,
  CheckCircle2,
  Volume2,
  VolumeX,
  Smartphone,
  BookOpen,
} from 'lucide-react';

interface TeacherMobileShellProps {
  role: RoleConfig;
  onExitWorkspace: () => void;
  onSwitchToWeb: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
}

type TeacherMobileTab =
  | 'home'
  | 'classes'
  | 'attendance'
  | 'more'
  | 'timetable'
  | 'assignments'
  | 'exams'
  | 'marks'
  | 'progress'
  | 'announcements'
  | 'settings';

export const TeacherMobileShell: React.FC<TeacherMobileShellProps> = ({
  role,
  onExitWorkspace,
  onSwitchToWeb,
  onOpenNotifications,
  unreadNotificationsCount,
}) => {
  const {
    assignments,
    addAssignment,
    exams,
    assessmentTasks,
    marks,
    saveMarksBatch,
    timetable,
    announcements,
    sections,
    students,
  } = useSchoolData();

  const [activeTab, setActiveTab] = useState<TeacherMobileTab>('home');
  const [classes, setClasses] = useState<TeacherClass[]>(DEMO_TEACHER_CLASSES);
  const [selectedClassId, setSelectedClassId] = useState<string>(DEMO_TEACHER_CLASSES[1].id); // Grade 9-B default
  const [classDropdownOpen, setClassDropdownOpen] = useState(false);
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Sub-screen states
  // Timetable
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');

  // Assignments
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'active' | 'closed'>('all');
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [newAssignTitle, setNewAssignTitle] = useState('');
  const [newAssignType, setNewAssignType] = useState<'Homework' | 'Project' | 'Quiz'>('Homework');
  const [newAssignDueDate, setNewAssignDueDate] = useState('2026-11-05');
  const [newAssignMaxMarks, setNewAssignMaxMarks] = useState<number>(20);
  const [newAssignInstructions, setNewAssignInstructions] = useState('');

  // Exams & Marks
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>('task-mid-9b-math');
  const [marksState, setMarksState] = useState<Record<string, { marks: number | null; isAbsent: boolean; feedback: string }>>({});

  // Announcements
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
  const [newAnnounceTitle, setNewAnnounceTitle] = useState('');
  const [newAnnounceAudience, setNewAnnounceAudience] = useState<'All School' | 'Faculty' | 'Class Parents'>('Class Parents');
  const [newAnnounceContent, setNewAnnounceContent] = useState('');

  // Settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pushReminders, setPushReminders] = useState(true);
  const [compactView, setCompactView] = useState(false);

  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  const handleUpdateStudentAttendance = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setClasses((prev) =>
      prev.map((cls) => {
        if (cls.id !== selectedClass.id) return cls;
        return {
          ...cls,
          students: cls.students.map((stu) => (stu.id === studentId ? { ...stu, attendanceToday: status } : stu)),
        };
      })
    );
  };

  const handleCommitAttendance = () => {
    setClasses((prev) =>
      prev.map((cls) => (cls.id === selectedClass.id ? { ...cls, attendanceTakenToday: true } : cls))
    );
    setSaveSuccessNotice(`Attendance for ${selectedClass.name} committed!`);
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  // Helper to handle assignment creation
  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignTitle.trim()) return;

    const matchedSection = sections.find((s) => s.id === (selectedClass.id === 'cls-9b' ? 'sec-9b' : selectedClass.id === 'cls-8a' ? 'sec-8a' : 'sec-10a')) || sections[0];

    const result = addAssignment({
      title: newAssignTitle.trim(),
      instructions: newAssignInstructions.trim() || 'Complete questions from textbook chapter review.',
      classId: matchedSection.classId,
      className: matchedSection.className,
      sectionId: matchedSection.id,
      sectionName: matchedSection.name,
      subjectName: selectedClass.subject,
      type: newAssignType,
      assignedDate: '2026-10-24',
      dueDate: newAssignDueDate,
      maxMarks: Number(newAssignMaxMarks) || 20,
      status: 'published',
      teacherId: 'staff-henderson',
      teacherName: 'Ms. Sarah Henderson',
      totalStudents: selectedClass.students.length,
    });

    if (result.isValid) {
      setSaveSuccessNotice(`Assignment "${newAssignTitle}" published to ${selectedClass.name}!`);
      setShowAddAssignment(false);
      setNewAssignTitle('');
      setNewAssignInstructions('');
      setTimeout(() => setSaveSuccessNotice(null), 3000);
    }
  };

  // Helper to handle marks entry saving
  const handleSaveMarks = () => {
    const entries = selectedClass.students.map((stu) => {
      const state = marksState[stu.id] || {
        marks: stu.lastExamGrade === 'A' ? 92 : stu.lastExamGrade === 'B+' ? 86 : stu.lastExamGrade === 'B' ? 78 : stu.lastExamGrade === 'C' ? 68 : 55,
        isAbsent: false,
        feedback: 'Good work',
      };
      return {
        studentId: stu.id,
        studentName: stu.name,
        marksObtained: state.isAbsent ? null : state.marks,
        isAbsent: state.isAbsent,
        teacherFeedback: state.feedback,
      };
    });

    const res = saveMarksBatch(selectedAssessmentId, entries, true, 'staff-henderson');
    if (res.isValid) {
      setSaveSuccessNotice(`Grades for ${selectedClass.name} saved and submitted!`);
      setTimeout(() => setSaveSuccessNotice(null), 3500);
    }
  };

  // Helper to broadcast announcement
  const handleBroadcastAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnounceTitle.trim() || !newAnnounceContent.trim()) return;
    setSaveSuccessNotice(`Notice "${newAnnounceTitle}" broadcast to ${newAnnounceAudience}!`);
    setShowAddAnnouncement(false);
    setNewAnnounceTitle('');
    setNewAnnounceContent('');
    setTimeout(() => setSaveSuccessNotice(null), 3500);
  };

  const appContent = (
    <div
      className="flex flex-col h-full overflow-hidden transition-colors"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
      }}
    >
      {/* COMPACT APP HEADER */}
      <header
        className="px-4 py-3 border-b flex items-center justify-between gap-3 shrink-0 backdrop-blur-md"
        style={{
          backgroundColor: 'rgba(var(--color-surface), 0.95)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center gap-2">
          <SchlarLogo variant="compact" />
          <span
            className="text-[9px] font-bold px-1.5 py-0.2 rounded uppercase"
            style={{
              backgroundColor: 'var(--color-subtle-accent, rgba(0,0,0,0.06))',
              color: 'var(--color-primary)',
            }}
          >
            Faculty App
          </span>
        </div>

        {/* Class Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setClassDropdownOpen(!classDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold shadow-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <span className="font-bold truncate max-w-[100px]">{selectedClass.name}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {classDropdownOpen && (
            <div
              className="absolute right-0 top-full mt-1.5 w-48 rounded-xl border shadow-xl p-1 z-40 animate-in fade-in"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="p-1.5 text-[9px] uppercase font-bold text-slate-400">
                Switch Class
              </div>
              {classes.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => {
                    setSelectedClassId(cls.id);
                    setClassDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs ${
                    cls.id === selectedClass.id ? 'font-bold' : 'hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: cls.id === selectedClass.id ? 'var(--color-background)' : 'transparent',
                    color: 'var(--color-text)',
                  }}
                >
                  <div className="text-left truncate">
                    <div className="truncate font-semibold">{cls.name}</div>
                    <div className="text-[10px] text-slate-400">{cls.subject}</div>
                  </div>
                  {cls.id === selectedClass.id && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Icon */}
        <button
          onClick={onOpenNotifications}
          className="relative p-1.5 rounded-full border text-slate-700 dark:text-slate-200"
          style={{ borderColor: 'var(--color-border)' }}
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span
              className="absolute top-0 right-0 w-2 h-2 rounded-full"
              style={{ backgroundColor: 'var(--color-accent)' }}
            />
          )}
        </button>
      </header>

      {/* SCROLLABLE MOBILE CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {saveSuccessNotice && (
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{saveSuccessNotice}</span>
          </div>
        )}

        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Next Class Up Hero Card */}
            <div
              className="p-4 rounded-xl border transition-colors shadow-sm"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-secondary)' }}>
                <span>Next Class Up</span>
                <span>{selectedClass.nextPeriodTime.split(' ')[0]} {selectedClass.nextPeriodTime.split(' ')[1]}</span>
              </div>

              <h2 className="text-lg font-extrabold" style={{ color: 'var(--color-text)' }}>
                {selectedClass.name} · {selectedClass.subject}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Location: <strong>{selectedClass.room}</strong> · <strong>{selectedClass.studentCount} students enrolled</strong>
              </p>

              {/* Status flag */}
              <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-slate-500">Attendance Status:</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${selectedClass.attendanceTakenToday ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {selectedClass.attendanceTakenToday ? 'Submitted' : 'Pending Roll Call'}
                </span>
              </div>

              {!selectedClass.attendanceTakenToday && (
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="w-full mt-3 py-2 text-xs font-bold text-white rounded-lg shadow-sm hover:opacity-95"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  Take {selectedClass.name} Attendance Now
                </button>
              )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className="p-3 rounded-xl border text-left"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Pending Papers
                </span>
                <span className="text-xl font-extrabold font-mono tabular-nums" style={{ color: 'var(--color-text)' }}>
                  18
                </span>
                <span className="text-[10px] text-slate-500 block truncate">Algebra Ch 4 Test</span>
              </div>

              <div
                className="p-3 rounded-xl border text-left"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Next Exam
                </span>
                <span className="text-xl font-extrabold font-mono tabular-nums" style={{ color: 'var(--color-text)' }}>
                  Oct 28
                </span>
                <span className="text-[10px] text-slate-500 block truncate">Vectors & Energy</span>
              </div>
            </div>

            {/* Teaching Schedule for Today */}
            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <span className="text-xs font-bold block mb-3" style={{ color: 'var(--color-text)' }}>
                Today's Instructional Roster
              </span>

              <div className="space-y-2">
                {classes.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-2.5 rounded-lg border text-xs flex items-center justify-between"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                    }}
                  >
                    <div>
                      <span className="font-semibold block" style={{ color: 'var(--color-text)' }}>
                        {cls.name} — {cls.subject}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {cls.nextPeriodTime} · {cls.room}
                      </span>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        cls.attendanceTakenToday ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {cls.attendanceTakenToday ? 'Done' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CLASSES */}
        {activeTab === 'classes' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--color-text)' }}>
                Assigned Class Cohorts
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                3 active classes assigned for Academic Year 2026-27
              </p>

              <div className="space-y-2.5">
                {classes.map((cls) => (
                  <div
                    key={cls.id}
                    onClick={() => {
                      setSelectedClassId(cls.id);
                      setActiveTab('attendance');
                    }}
                    className="p-3 rounded-xl border cursor-pointer hover:shadow-xs transition-all text-xs"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: cls.id === selectedClass.id ? 'var(--color-primary)' : 'var(--color-border)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                        {cls.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {cls.studentCount} students
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {cls.subject} · {cls.room}
                    </div>
                    <div className="mt-2 pt-2 border-t flex items-center justify-between text-[11px]" style={{ borderColor: 'var(--color-border)' }}>
                      <span>Tap to take attendance</span>
                      <span className="font-bold" style={{ color: 'var(--color-primary)' }}>›</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ATTENDANCE ROLL-CALL */}
        {activeTab === 'attendance' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                    Roll-Call: {selectedClass.name}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {selectedClass.subject} ({selectedClass.students.length} students)
                  </span>
                </div>

                <button
                  onClick={handleCommitAttendance}
                  className="px-3 py-1.5 text-xs font-bold text-white rounded-lg shadow-xs hover:opacity-95"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  Commit
                </button>
              </div>

              {/* Attendance Quick Legend */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pb-2 border-b mb-3" style={{ borderColor: 'var(--color-border)' }}>
                <span>Tap student mark:</span>
                <span className="space-x-1.5 font-bold">
                  <span className="text-emerald-600">P = Present</span>
                  <span className="text-amber-600">L = Late</span>
                  <span className="text-rose-600">A = Absent</span>
                  <span className="text-blue-600">E = Excused</span>
                </span>
              </div>

              {/* Student Roll Cards */}
              <div className="space-y-2">
                {selectedClass.students.map((stu) => (
                  <div
                    key={stu.id}
                    className="p-2.5 rounded-lg border flex items-center justify-between gap-2 text-xs"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                    }}
                  >
                    <div className="min-w-0">
                      <span className="font-semibold block truncate" style={{ color: 'var(--color-text)' }}>
                        #{stu.rollNo}. {stu.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Grade: {stu.lastExamGrade}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {(['present', 'late', 'absent', 'excused'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleUpdateStudentAttendance(stu.id, st)}
                          className={`w-7 h-7 rounded-md font-bold text-[11px] transition-colors ${
                            stu.attendanceToday === st
                              ? st === 'present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : st === 'late'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : st === 'absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-blue-600 text-white shadow-xs'
                              : 'border opacity-50 hover:opacity-100'
                          }`}
                        >
                          {st === 'present' ? '✓' : st === 'absent' ? 'X' : st === 'late' ? '⏱' : 'E'}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MORE MENU */}
        {activeTab === 'more' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-3">
                Faculty Modules
              </span>

              <div className="space-y-1">
                {[
                  { id: 'timetable', label: 'Teaching Timetable', icon: CalendarDays },
                  { id: 'assignments', label: 'Assignment Desks', icon: FileCheck },
                  { id: 'exams', label: 'Examinations', icon: ClipboardCheck },
                  { id: 'marks', label: 'Marks & Results', icon: Award },
                  { id: 'progress', label: 'Student Progress', icon: BookOpenCheck },
                  { id: 'announcements', label: 'Class Announcements', icon: Bell },
                  { id: 'settings', label: 'Faculty Profile & Settings', icon: Settings },
                ].map((item) => {
                  const IconComp = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as TeacherMobileTab)}
                      className="w-full flex items-center justify-between p-3 rounded-lg text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      style={{ color: 'var(--color-text)' }}
                    >
                      <div className="flex items-center gap-3">
                        <IconComp className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-slate-400">›</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Platform & Role Switchers */}
            <div
              className="p-4 rounded-xl border space-y-2 text-xs"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <button
                onClick={onSwitchToWeb}
                className="w-full flex items-center justify-between p-2 rounded-lg font-semibold border"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-slate-500" />
                  <span>Switch to Desktop Web Portal</span>
                </div>
                <span>›</span>
              </button>

              <button
                onClick={onExitWorkspace}
                className="w-full flex items-center justify-between p-2 rounded-lg font-semibold text-rose-600 hover:bg-rose-50"
              >
                <div className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Role Selection</span>
                </div>
                <span>›</span>
              </button>
            </div>
          </div>
        )}

        {/* SUB-SCREENS REACHED VIA MORE */}

        {/* 1. TIMETABLE */}
        {activeTab === 'timetable' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <button
                onClick={() => setActiveTab('more')}
                className="flex items-center gap-1.5 text-xs font-semibold mb-3 hover:opacity-80"
                style={{ color: 'var(--color-primary)' }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Menu</span>
              </button>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                    Instructional Timetable
                  </h3>
                  <span className="text-[11px] text-slate-500">Ms. Sarah Henderson · AY 2026-27</span>
                </div>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
                  style={{ backgroundColor: 'var(--color-subtle-accent, rgba(0,0,0,0.06))', color: 'var(--color-primary)' }}
                >
                  18 Periods / Wk
                </span>
              </div>

              {/* Day of Week Selector */}
              <div className="grid grid-cols-5 gap-1 p-1 rounded-lg border mb-4 text-center text-xs" style={{ borderColor: 'var(--color-border)' }}>
                {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const).map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`py-1.5 rounded text-[11px] font-semibold transition-all ${
                      selectedDay === day ? 'bg-black/10 dark:bg-white/10 font-bold shadow-xs' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ color: selectedDay === day ? 'var(--color-primary)' : 'var(--color-text)' }}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>

              {/* Periods for selected day */}
              <div className="space-y-2">
                {[
                  {
                    period: 'P1',
                    time: '08:30 - 09:15',
                    className: 'Grade 9-B',
                    classId: 'cls-9b',
                    subject: 'Mathematics',
                    room: 'Room 204',
                    status: 'Done',
                  },
                  {
                    period: 'P2',
                    time: '09:20 - 10:05',
                    className: 'Grade 8-A',
                    classId: 'cls-8a',
                    subject: 'Mathematics',
                    room: 'Room 108',
                    status: 'Active',
                  },
                  {
                    period: 'P3',
                    time: '10:15 - 11:00',
                    className: 'Faculty Prep',
                    classId: '',
                    subject: 'Lesson Planning & Prep',
                    room: 'Faculty Lounge',
                    status: 'Planning',
                  },
                  {
                    period: 'P4',
                    time: '11:15 - 12:00',
                    className: 'Grade 10-A',
                    classId: 'cls-10a',
                    subject: 'Mathematics',
                    room: 'Room 302',
                    status: 'Upcoming',
                  },
                  {
                    period: 'P5',
                    time: '12:45 - 01:30',
                    className: 'Grade 9-B',
                    classId: 'cls-9b',
                    subject: 'Algebra Lab',
                    room: 'Computer Lab 2',
                    status: 'Upcoming',
                  },
                ].map((slot, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border text-xs flex items-center justify-between gap-2"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-xs px-1.5 py-1 rounded bg-black/5 dark:bg-white/5" style={{ color: 'var(--color-primary)' }}>
                        {slot.period}
                      </span>
                      <div>
                        <div className="font-bold" style={{ color: 'var(--color-text)' }}>
                          {slot.className} {slot.subject && `· ${slot.subject}`}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {slot.time} · {slot.room}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          slot.status === 'Done'
                            ? 'bg-emerald-100 text-emerald-800'
                            : slot.status === 'Active'
                            ? 'bg-blue-100 text-blue-800 animate-pulse'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {slot.status}
                      </span>

                      {slot.classId && (
                        <button
                          onClick={() => {
                            setSelectedClassId(slot.classId);
                            setActiveTab('attendance');
                          }}
                          className="px-2 py-1 text-[10px] font-bold text-white rounded shadow-xs"
                          style={{ backgroundColor: 'var(--color-primary)' }}
                          title="Take Attendance"
                        >
                          Roll-Call
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. ASSIGNMENTS */}
        {activeTab === 'assignments' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setActiveTab('more')}
                  className="flex items-center gap-1.5 text-xs font-semibold hover:opacity-80"
                  style={{ color: 'var(--color-primary)' }}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  onClick={() => setShowAddAssignment(!showAddAssignment)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white rounded-lg shadow-xs hover:opacity-95"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddAssignment ? 'Close Form' : 'New Assignment'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                  Active Homework & Tasks
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">{selectedClass.name}</span>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 mb-3 text-xs">
                {(['all', 'active', 'closed'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setAssignmentFilter(f)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize transition-all border ${
                      assignmentFilter === f
                        ? 'bg-black/10 dark:bg-white/10'
                        : 'opacity-60'
                    }`}
                    style={{
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Inline Create Assignment Form */}
              {showAddAssignment && (
                <form
                  onSubmit={handleCreateAssignment}
                  className="p-3.5 rounded-xl border mb-4 space-y-2.5 animate-in slide-in-from-top-2"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-primary)',
                  }}
                >
                  <div className="text-xs font-bold" style={{ color: 'var(--color-primary)' }}>
                    Publish New Homework to {selectedClass.name}
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      Assignment Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chapter 4 Quadratic Formula Exercises"
                      value={newAssignTitle}
                      onChange={(e) => setNewAssignTitle(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border outline-none"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                        Type
                      </label>
                      <select
                        value={newAssignType}
                        onChange={(e) => setNewAssignType(e.target.value as any)}
                        className="w-full px-2 py-1.5 text-xs rounded-lg border outline-none"
                        style={{
                          backgroundColor: 'var(--color-surface)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text)',
                        }}
                      >
                        <option value="Homework">Homework</option>
                        <option value="Quiz">Quiz</option>
                        <option value="Project">Project</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={newAssignDueDate}
                        onChange={(e) => setNewAssignDueDate(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs rounded-lg border outline-none"
                        style={{
                          backgroundColor: 'var(--color-surface)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text)',
                        }}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                        Max Marks
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="100"
                        value={newAssignMaxMarks}
                        onChange={(e) => setNewAssignMaxMarks(Number(e.target.value))}
                        className="w-full px-2 py-1.5 text-xs rounded-lg border outline-none"
                        style={{
                          backgroundColor: 'var(--color-surface)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text)',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      Instructions & Student Guidelines
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Solve questions 1-15 on page 112. Show complete working steps."
                      value={newAssignInstructions}
                      onChange={(e) => setNewAssignInstructions(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border outline-none"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddAssignment(false)}
                      className="px-2.5 py-1 text-xs font-semibold rounded border"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs font-bold text-white rounded shadow-xs"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      Publish Assignment
                    </button>
                  </div>
                </form>
              )}

              {/* Assignment Cards List */}
              <div className="space-y-2">
                {assignments
                  .filter((a) => {
                    if (assignmentFilter === 'active') return a.status === 'published';
                    if (assignmentFilter === 'closed') return a.status === 'closed';
                    return true;
                  })
                  .slice(0, 5)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-lg border text-xs space-y-1.5"
                      style={{
                        backgroundColor: 'var(--color-background)',
                        borderColor: 'var(--color-border)',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold truncate max-w-[200px]" style={{ color: 'var(--color-text)' }}>
                          {task.title}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            task.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {task.type}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center justify-between">
                        <span>Due: {task.dueDate}</span>
                        <span className="font-mono font-semibold">{task.maxMarks} marks</span>
                      </div>

                      {/* Submissions Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                          <span>Submissions</span>
                          <span>
                            {task.submissionsCount} / {task.totalStudents} ({Math.round((task.submissionsCount / (task.totalStudents || 1)) * 100)}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min(100, Math.round((task.submissionsCount / (task.totalStudents || 1)) * 100))}%`,
                              backgroundColor: 'var(--color-primary)',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. EXAMINATIONS */}
        {activeTab === 'exams' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <button
                onClick={() => setActiveTab('more')}
                className="flex items-center gap-1.5 text-xs font-semibold mb-3 hover:opacity-80"
                style={{ color: 'var(--color-primary)' }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Menu</span>
              </button>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                    School Examinations
                  </h3>
                  <span className="text-[11px] text-slate-500">Scheduled Assessment Windows</span>
                </div>
                <button
                  onClick={() => setActiveTab('marks')}
                  className="px-2.5 py-1 text-xs font-bold text-white rounded-lg shadow-xs"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  Grade Entry Sheet
                </button>
              </div>

              {/* Active Exam Terms */}
              <div className="space-y-2 mb-4">
                {exams.map((ex) => (
                  <div
                    key={ex.id}
                    className="p-3 rounded-lg border text-xs"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                        {ex.name}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                        {ex.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center justify-between">
                      <span>Term: {ex.termName}</span>
                      <span>{ex.startDate} – {ex.endDate}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Assessment Tasks list */}
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Faculty Assessment Tasks
              </div>

              <div className="space-y-2">
                {assessmentTasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    className="p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                    }}
                  >
                    <div>
                      <span className="font-bold block" style={{ color: 'var(--color-text)' }}>
                        {task.className} · {task.subjectName}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {task.examDate} · Max {task.maxMarks} pts · {task.room}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedAssessmentId(task.id);
                        setActiveTab('marks');
                      }}
                      className="px-2 py-1 text-[11px] font-bold text-white rounded shadow-xs"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      Enter Marks
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. MARKS ENTRY */}
        {activeTab === 'marks' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setActiveTab('more')}
                  className="flex items-center gap-1.5 text-xs font-semibold hover:opacity-80"
                  style={{ color: 'var(--color-primary)' }}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  onClick={handleSaveMarks}
                  className="px-3 py-1.5 text-xs font-bold text-white rounded-lg shadow-xs hover:opacity-95"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  Save & Commit
                </button>
              </div>

              <div className="mb-3">
                <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                  Marks & Grade Entry
                </h3>
                <span className="text-[11px] text-slate-500">{selectedClass.name} · {selectedClass.subject}</span>
              </div>

              {/* Assessment Task Selector */}
              <div className="mb-3">
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Active Assessment Task
                </label>
                <select
                  value={selectedAssessmentId}
                  onChange={(e) => setSelectedAssessmentId(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border outline-none font-semibold"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                >
                  <option value="task-mid-9b-math">Midterm Exam (Max: 100)</option>
                  <option value="task-quiz-9b-algebra">Algebra Quiz 1 (Max: 20)</option>
                  <option value="task-proj-9b-stats">Statistics Mini-Project (Max: 30)</option>
                </select>
              </div>

              {/* Live Metric Strip */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg border mb-3 text-center" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Class Avg</span>
                  <span className="text-xs font-extrabold font-mono" style={{ color: 'var(--color-primary)' }}>84.6%</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Top Score</span>
                  <span className="text-xs font-extrabold font-mono text-emerald-600">98 / 100</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Pass Rate</span>
                  <span className="text-xs font-extrabold font-mono text-blue-600">95.8%</span>
                </div>
              </div>

              {/* Student Grading Roster */}
              <div className="space-y-2">
                {selectedClass.students.map((stu) => {
                  const defaultMark = stu.lastExamGrade === 'A' ? 92 : stu.lastExamGrade === 'B+' ? 86 : stu.lastExamGrade === 'B' ? 78 : stu.lastExamGrade === 'C' ? 68 : 55;
                  const currentScore = marksState[stu.id]?.marks ?? defaultMark;
                  const isAbsent = marksState[stu.id]?.isAbsent ?? false;

                  return (
                    <div
                      key={stu.id}
                      className="p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2"
                      style={{
                        backgroundColor: 'var(--color-background)',
                        borderColor: 'var(--color-border)',
                      }}
                    >
                      <div className="min-w-0">
                        <span className="font-semibold block truncate" style={{ color: 'var(--color-text)' }}>
                          #{stu.rollNo}. {stu.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Prior Grade: {stu.lastExamGrade}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <label className="flex items-center gap-1 text-[10px] text-slate-400">
                          <input
                            type="checkbox"
                            checked={isAbsent}
                            onChange={(e) => {
                              setMarksState((prev) => ({
                                ...prev,
                                [stu.id]: {
                                  marks: e.target.checked ? null : currentScore,
                                  isAbsent: e.target.checked,
                                  feedback: prev[stu.id]?.feedback || 'Excused',
                                },
                              }));
                            }}
                          />
                          <span>Abs</span>
                        </label>

                        <input
                          type="number"
                          disabled={isAbsent}
                          min="0"
                          max="100"
                          value={isAbsent ? '' : currentScore}
                          onChange={(e) => {
                            const val = e.target.value === '' ? null : Number(e.target.value);
                            setMarksState((prev) => ({
                              ...prev,
                              [stu.id]: {
                                marks: val,
                                isAbsent: false,
                                feedback: prev[stu.id]?.feedback || 'Standard assessment',
                              },
                            }));
                          }}
                          className={`w-14 px-2 py-1 text-center font-mono font-bold text-xs rounded border outline-none ${
                            isAbsent ? 'opacity-40 bg-slate-200' : ''
                          }`}
                          style={{
                            backgroundColor: 'var(--color-surface)',
                            borderColor: 'var(--color-border)',
                            color: 'var(--color-text)',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 5. STUDENT PROGRESS */}
        {activeTab === 'progress' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <button
                onClick={() => setActiveTab('more')}
                className="flex items-center gap-1.5 text-xs font-semibold mb-3 hover:opacity-80"
                style={{ color: 'var(--color-primary)' }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Menu</span>
              </button>

              <div className="mb-3">
                <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                  Cohort Progress: {selectedClass.name}
                </h3>
                <span className="text-[11px] text-slate-500">Academic & Attendance Pacing</span>
              </div>

              {/* Progress Highlights */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="p-3 rounded-lg border text-left" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Class Attendance</span>
                  <span className="text-lg font-extrabold font-mono" style={{ color: 'var(--color-primary)' }}>95.4%</span>
                  <span className="text-[10px] text-emerald-600 block font-semibold">+1.2% this term</span>
                </div>

                <div className="p-3 rounded-lg border text-left" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Grade Average</span>
                  <span className="text-lg font-extrabold font-mono text-emerald-600">3.48 GPA</span>
                  <span className="text-[10px] text-slate-500 block">Grade B+ Median</span>
                </div>
              </div>

              {/* At-Risk Intervention Alert */}
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-xs mb-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <span className="font-bold block">Academic Support Alert</span>
                  <span>1 student (Roll #4) recommended for after-school quadratic equations booster.</span>
                </div>
              </div>

              {/* Student Roster Status */}
              <div className="space-y-1.5">
                {selectedClass.students.map((stu) => (
                  <div
                    key={stu.id}
                    className="p-2.5 rounded-lg border text-xs flex items-center justify-between"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                    }}
                  >
                    <div>
                      <span className="font-semibold block" style={{ color: 'var(--color-text)' }}>
                        {stu.name}
                      </span>
                      <span className="text-[10px] text-slate-500">Roll #{stu.rollNo} · 96% Present</span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        stu.lastExamGrade.startsWith('A')
                          ? 'bg-emerald-100 text-emerald-800'
                          : stu.lastExamGrade.startsWith('B')
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      Grade {stu.lastExamGrade}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setActiveTab('more')}
                  className="flex items-center gap-1.5 text-xs font-semibold hover:opacity-80"
                  style={{ color: 'var(--color-primary)' }}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  onClick={() => setShowAddAnnouncement(!showAddAnnouncement)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white rounded-lg shadow-xs hover:opacity-95"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddAnnouncement ? 'Close' : 'Post Notice'}</span>
                </button>
              </div>

              <div className="mb-3">
                <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                  Class Circulars & Notices
                </h3>
                <span className="text-[11px] text-slate-500">Broadcast updates to parents & classes</span>
              </div>

              {/* Compose Announcement Drawer */}
              {showAddAnnouncement && (
                <form
                  onSubmit={handleBroadcastAnnouncement}
                  className="p-3.5 rounded-xl border mb-4 space-y-2.5 animate-in slide-in-from-top-2"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-primary)',
                  }}
                >
                  <div className="text-xs font-bold" style={{ color: 'var(--color-primary)' }}>
                    Compose Class Notice
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      Notice Heading
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mathematics Calculator Requirements for Friday"
                      value={newAnnounceTitle}
                      onChange={(e) => setNewAnnounceTitle(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border outline-none"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      Target Audience
                    </label>
                    <select
                      value={newAnnounceAudience}
                      onChange={(e) => setNewAnnounceAudience(e.target.value as any)}
                      className="w-full px-2 py-1.5 text-xs rounded-lg border outline-none"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                    >
                      <option value="Class Parents">{selectedClass.name} Parents & Guardians</option>
                      <option value="Faculty">All Mathematics Faculty</option>
                      <option value="All School">Campus Wide Circular</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      Notice Message
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Please ensure your student brings a scientific calculator (Casio fx-82 or equivalent) for our graphing workshop."
                      value={newAnnounceContent}
                      onChange={(e) => setNewAnnounceContent(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border outline-none"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddAnnouncement(false)}
                      className="px-2.5 py-1 text-xs font-semibold rounded border"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs font-bold text-white rounded shadow-xs"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      Broadcast Notice
                    </button>
                  </div>
                </form>
              )}

              {/* Feed of Live Circulars */}
              <div className="space-y-2">
                {announcements.slice(0, 4).map((ann) => (
                  <div
                    key={ann.id}
                    className="p-3 rounded-lg border text-xs space-y-1"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold" style={{ color: 'var(--color-text)' }}>
                        {ann.title}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          ann.priority === 'urgent'
                            ? 'bg-rose-100 text-rose-800'
                            : ann.priority === 'important'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {ann.priority}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {ann.content}
                    </p>
                    <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
                      <span>Audience: {ann.targetAudience}</span>
                      <span>{ann.publishDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 7. SETTINGS & FACULTY PROFILE */}
        {activeTab === 'settings' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <button
                onClick={() => setActiveTab('more')}
                className="flex items-center gap-1.5 text-xs font-semibold mb-3 hover:opacity-80"
                style={{ color: 'var(--color-primary)' }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Menu</span>
              </button>

              <div className="mb-4">
                <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                  Faculty Profile & Settings
                </h3>
                <span className="text-[11px] text-slate-500">Greenfield International School Faculty App</span>
              </div>

              {/* Profile Card */}
              <div
                className="p-3.5 rounded-xl border mb-4 text-xs space-y-2"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: 'var(--color-primary)' }}>
                    SH
                  </div>
                  <div>
                    <span className="font-extrabold text-sm block" style={{ color: 'var(--color-text)' }}>
                      Ms. Sarah Henderson
                    </span>
                    <span className="text-[11px] text-slate-500">
                      STF-2024-004 · Mathematics Department
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t text-[11px] space-y-1 text-slate-500" style={{ borderColor: 'var(--color-border)' }}>
                  <div>Email: <strong>sarah.henderson@greenfield.edu</strong></div>
                  <div>Assigned Classes: <strong>Grade 8-A, Grade 9-B, Grade 10-A</strong></div>
                  <div>Weekly Load: <strong>18 periods instructional, 4 periods prep</strong></div>
                </div>
              </div>

              {/* Preferences Toggles */}
              <div className="space-y-2 mb-4 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                  <div>
                    <span className="font-semibold block" style={{ color: 'var(--color-text)' }}>
                      Attendance Chime
                    </span>
                    <span className="text-[10px] text-slate-400">Play tone when roll-call is marked</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                  <div>
                    <span className="font-semibold block" style={{ color: 'var(--color-text)' }}>
                      Roll-Call Push Reminders
                    </span>
                    <span className="text-[10px] text-slate-400">Alert 5 mins before period ends</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushReminders}
                    onChange={(e) => setPushReminders(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                  <div>
                    <span className="font-semibold block" style={{ color: 'var(--color-text)' }}>
                      Compact Student View
                    </span>
                    <span className="text-[10px] text-slate-400">Denser student roster display</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={compactView}
                    onChange={(e) => setCompactView(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600"
                  />
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="space-y-2">
                <button
                  onClick={onSwitchToWeb}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-white rounded-lg shadow-xs hover:opacity-95"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Switch to Desktop Web Portal</span>
                </button>

                <button
                  onClick={onExitWorkspace}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-rose-600 rounded-lg border border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Role Selection</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav
        aria-label="Teacher mobile navigation"
        className="h-16 border-t px-2 flex items-center justify-around shrink-0 backdrop-blur-md"
        style={{
          backgroundColor: 'rgba(var(--color-surface), 0.98)',
          borderColor: 'var(--color-border)',
        }}
      >
        <button
          onClick={() => setActiveTab('home')}
          aria-label="Faculty Home overview"
          aria-current={activeTab === 'home' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1.5 min-h-[48px] text-[10px] font-semibold transition-colors focus-visible:ring-2 rounded-lg ${
            activeTab === 'home' ? 'font-bold' : 'opacity-60 hover:opacity-100'
          }`}
          style={{ color: activeTab === 'home' ? 'var(--color-primary)' : 'var(--color-text)' }}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('classes')}
          aria-label="Assigned classes"
          aria-current={activeTab === 'classes' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1.5 min-h-[48px] text-[10px] font-semibold transition-colors focus-visible:ring-2 rounded-lg ${
            activeTab === 'classes' ? 'font-bold' : 'opacity-60 hover:opacity-100'
          }`}
          style={{ color: activeTab === 'classes' ? 'var(--color-primary)' : 'var(--color-text)' }}
        >
          <Users className="w-4 h-4" />
          <span>Classes</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          aria-label="Attendance roll call"
          aria-current={activeTab === 'attendance' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1.5 min-h-[48px] text-[10px] font-semibold transition-colors focus-visible:ring-2 rounded-lg ${
            activeTab === 'attendance' ? 'font-bold' : 'opacity-60 hover:opacity-100'
          }`}
          style={{ color: activeTab === 'attendance' ? 'var(--color-primary)' : 'var(--color-text)' }}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Roll-Call</span>
        </button>

        <button
          onClick={() => setActiveTab('more')}
          aria-label="More teacher workflows"
          aria-current={activeTab === 'more' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1.5 min-h-[48px] text-[10px] font-semibold transition-colors focus-visible:ring-2 rounded-lg ${
            activeTab === 'more' ? 'font-bold' : 'opacity-60 hover:opacity-100'
          }`}
          style={{ color: activeTab === 'more' ? 'var(--color-primary)' : 'var(--color-text)' }}
        >
          <Menu className="w-4 h-4" />
          <span>More</span>
        </button>
      </nav>
    </div>
  );

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start py-2 sm:py-4 px-2 sm:px-4 transition-colors"
      style={{
        backgroundColor: 'var(--color-background)',
      }}
    >
      {/* Top Testing Controls */}
      <div className="w-full max-w-md flex items-center justify-between pb-2.5 mb-1.5 text-xs">
        <button
          onClick={onExitWorkspace}
          className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300 hover:opacity-80 py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Role Selection</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md border text-[11px] font-medium"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
            title={isPhoneFrame ? 'Expand to Full Viewport' : 'Show Phone Frame'}
          >
            {isPhoneFrame ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            <span>{isPhoneFrame ? 'Full Width' : 'Phone Frame'}</span>
          </button>

          <button
            onClick={onSwitchToWeb}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold text-white shadow-xs hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Monitor className="w-3 h-3" />
            <span>Launch Web Portal</span>
          </button>
        </div>
      </div>

      {/* Frame wrapper */}
      {isPhoneFrame ? (
        <div
          className="w-full max-w-[400px] sm:max-w-[390px] h-[calc(100vh-70px)] sm:h-[780px] rounded-2xl sm:rounded-[38px] border-2 sm:border-[8px] shadow-2xl overflow-hidden flex flex-col relative"
          style={{
            borderColor: '#242C38',
            backgroundColor: 'var(--color-background)',
          }}
        >
          {/* Dynamic Phone Speaker Notch */}
          <div className="hidden sm:flex w-32 h-4 bg-slate-900 rounded-b-xl mx-auto absolute top-0 left-1/2 -translate-x-1/2 z-50 items-center justify-center">
            <div className="w-10 h-1 bg-slate-700 rounded-full" />
          </div>
          <div className="flex-1 flex flex-col h-full pt-1 sm:pt-2">
            {appContent}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-xl h-[calc(100vh-70px)] sm:h-[84vh] rounded-2xl border shadow-xl overflow-hidden flex flex-col">
          {appContent}
        </div>
      )}
    </div>
  );
};
