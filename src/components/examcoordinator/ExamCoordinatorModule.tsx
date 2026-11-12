import React, { useState, useMemo } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { usePermissions } from '../../context/PermissionContext';
import { SchoolExam, AssessmentTask } from '../../types/school';
import {
  ClipboardCheck,
  CalendarDays,
  FileCheck,
  CheckSquare,
  Award,
  BadgeCheck,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  Eye,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Download,
  Printer,
  ChevronRight,
  X,
  BookOpen,
  Building,
  UserCheck,
  Layers,
  Send,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface ExamCoordinatorModuleProps {
  initialTab?: string;
}

export const ExamCoordinatorModule: React.FC<ExamCoordinatorModuleProps> = ({
  initialTab = 'overview',
}) => {
  const {
    exams,
    assessmentTasks,
    marks,
    classes,
    sections,
    subjects,
    staff,
    students,
    gradingScale,
    addExam,
    updateExam,
    addAssessmentTask,
    updateAssessmentTask,
    deleteAssessmentTask,
    publishAssessmentResults,
    addAuditLog,
  } = useSchoolData();

  const { hasPermission } = usePermissions();
  const canManageExams = hasPermission('exams.manage');
  const canPublishResults = hasPermission('results.publish');

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Selected exam cycle filter
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || 'exam-midterm-2026');

  // Search & filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');

  // Modals state
  const [addExamModalOpen, setAddExamModalOpen] = useState(false);
  const [editExamTarget, setEditExamTarget] = useState<SchoolExam | null>(null);

  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [editTaskTarget, setEditTaskTarget] = useState<AssessmentTask | null>(null);
  const [deleteTaskTarget, setDeleteTaskTarget] = useState<AssessmentTask | null>(null);

  // Hall Ticket inspection modal
  const [hallTicketStudent, setHallTicketStudent] = useState<any | null>(null);

  // Publish confirmation modal
  const [publishTargetTask, setPublishTargetTask] = useState<AssessmentTask | null>(null);
  const [dualAuthCode, setDualAuthCode] = useState('');
  const [dualAuthError, setDualAuthError] = useState('');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Currently selected exam cycle
  const currentExam = useMemo(() => {
    return exams.find((e) => e.id === selectedExamId) || exams[0];
  }, [exams, selectedExamId]);

  // Assessment tasks for current exam
  const currentTasks = useMemo(() => {
    return assessmentTasks.filter((t) => !selectedExamId || t.examId === selectedExamId);
  }, [assessmentTasks, selectedExamId]);

  // Form state for creating/editing an exam cycle
  const [examFormName, setExamFormName] = useState('');
  const [examFormYear, setExamFormYear] = useState('ay-2026');
  const [examFormStart, setExamFormStart] = useState('2026-11-14');
  const [examFormEnd, setExamFormEnd] = useState('2026-11-25');
  const [examFormStatus, setExamFormStatus] = useState<SchoolExam['status']>('upcoming');
  const [examFormError, setExamFormError] = useState<string | null>(null);

  // Form state for creating/editing assessment paper
  const [taskFormSubject, setTaskFormSubject] = useState(subjects[0]?.name || 'Mathematics');
  const [taskFormSectionId, setTaskFormSectionId] = useState(sections[0]?.id || 'sec-10a');
  const [taskFormTeacherId, setTaskFormTeacherId] = useState(staff[0]?.id || 'staff-henderson');
  const [taskFormMaxMarks, setTaskFormMaxMarks] = useState<number>(100);
  const [taskFormPassMarks, setTaskFormPassMarks] = useState<number>(40);
  const [taskFormDate, setTaskFormDate] = useState('2026-11-16');
  const [taskFormDuration, setTaskFormDuration] = useState<number>(90);
  const [taskFormRoom, setTaskFormRoom] = useState('Main Exam Hall A');
  const [taskFormWeightage, setTaskFormWeightage] = useState<number>(30);
  const [taskFormError, setTaskFormError] = useState<string | null>(null);

  // Open add exam modal
  const handleOpenAddExam = () => {
    setExamFormName('');
    setExamFormYear('ay-2026');
    setExamFormStart('2026-11-14');
    setExamFormEnd('2026-11-25');
    setExamFormStatus('upcoming');
    setExamFormError(null);
    setEditExamTarget(null);
    setAddExamModalOpen(true);
  };

  // Open edit exam modal
  const handleOpenEditExam = (exam: SchoolExam) => {
    setEditExamTarget(exam);
    setExamFormName(exam.name);
    setExamFormYear(exam.academicYearId);
    setExamFormStart(exam.startDate);
    setExamFormEnd(exam.endDate);
    setExamFormStatus(exam.status);
    setExamFormError(null);
    setAddExamModalOpen(true);
  };

  // Submit create or edit exam
  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examFormName.trim()) {
      setExamFormError('Please enter a valid examination title.');
      return;
    }
    if (new Date(examFormEnd) < new Date(examFormStart)) {
      setExamFormError('End date cannot precede the start date.');
      return;
    }

    if (editExamTarget) {
      const res = updateExam(editExamTarget.id, {
        name: examFormName.trim(),
        academicYearId: examFormYear,
        startDate: examFormStart,
        endDate: examFormEnd,
        status: examFormStatus,
      });
      if (res.isValid) {
        showToast('success', `Examination cycle "${examFormName}" updated.`);
        setAddExamModalOpen(false);
      } else {
        setExamFormError(res.message || 'Failed to update exam.');
      }
    } else {
      const res = addExam({
        name: examFormName.trim(),
        academicYearId: examFormYear,
        termId: 'term-1',
        termName: 'Term 1 (Fall Semester)',
        startDate: examFormStart,
        endDate: examFormEnd,
        status: examFormStatus,
      });
      if (res.isValid) {
        showToast('success', `New examination cycle "${examFormName}" scheduled.`);
        setAddExamModalOpen(false);
      } else {
        setExamFormError(res.message || 'Failed to schedule exam.');
      }
    }
  };

  // Open add paper modal
  const handleOpenAddTask = () => {
    setTaskFormSubject(subjects[0]?.name || 'Mathematics');
    setTaskFormSectionId(sections[0]?.id || 'sec-10a');
    setTaskFormTeacherId(staff[0]?.id || 'staff-henderson');
    setTaskFormMaxMarks(100);
    setTaskFormPassMarks(40);
    setTaskFormDate('2026-11-16');
    setTaskFormDuration(90);
    setTaskFormRoom('Main Exam Hall A');
    setTaskFormWeightage(30);
    setTaskFormError(null);
    setEditTaskTarget(null);
    setAddTaskModalOpen(true);
  };

  // Open edit paper modal
  const handleOpenEditTask = (task: AssessmentTask) => {
    setEditTaskTarget(task);
    setTaskFormSubject(task.subjectName);
    setTaskFormSectionId(task.sectionId);
    setTaskFormTeacherId(task.teacherId);
    setTaskFormMaxMarks(task.maxMarks);
    setTaskFormPassMarks(Math.round(task.maxMarks * 0.4));
    setTaskFormDate(task.examDate || '2026-11-16');
    setTaskFormDuration(task.durationMinutes || 90);
    setTaskFormRoom(task.room || 'Main Exam Hall A');
    setTaskFormWeightage(30);
    setTaskFormError(null);
    setAddTaskModalOpen(true);
  };

  // Submit create or edit paper
  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskFormMaxMarks <= 0) {
      setTaskFormError('Maximum marks must be greater than 0.');
      return;
    }
    if (taskFormPassMarks > taskFormMaxMarks || taskFormPassMarks < 0) {
      setTaskFormError(`Passing marks must be between 0 and ${taskFormMaxMarks}.`);
      return;
    }

    const sec = sections.find((s) => s.id === taskFormSectionId);
    const teacher = staff.find((s) => s.id === taskFormTeacherId);

    if (editTaskTarget) {
      const res = updateAssessmentTask(editTaskTarget.id, {
        subjectName: taskFormSubject,
        sectionId: taskFormSectionId,
        sectionName: sec?.name || '',
        classId: sec?.classId || '',
        className: sec?.className || '',
        teacherId: taskFormTeacherId,
        teacherName: teacher?.name || '',
        maxMarks: taskFormMaxMarks,
        examDate: taskFormDate,
        startTime: '09:00 AM',
        durationMinutes: taskFormDuration,
        room: taskFormRoom,
      });
      if (res.isValid) {
        showToast('success', `Assessment paper "${taskFormSubject}" updated.`);
        setAddTaskModalOpen(false);
      } else {
        setTaskFormError(res.message || 'Update failed.');
      }
    } else {
      const res = addAssessmentTask({
        examId: currentExam?.id || 'exam-midterm-2026',
        examName: currentExam?.name || 'Term Exam',
        subjectName: taskFormSubject,
        sectionId: taskFormSectionId,
        sectionName: sec?.name || '',
        classId: sec?.classId || '',
        className: sec?.className || '',
        teacherId: taskFormTeacherId,
        teacherName: teacher?.name || '',
        maxMarks: taskFormMaxMarks,
        status: 'scheduled',
        examDate: taskFormDate,
        startTime: '09:00 AM',
        durationMinutes: taskFormDuration,
        room: taskFormRoom,
      });
      if (res.isValid) {
        showToast('success', `Assessment paper "${taskFormSubject}" added to schedule.`);
        setAddTaskModalOpen(false);
      } else {
        setTaskFormError(res.message || 'Creation failed.');
      }
    }
  };

  // Handle delete task
  const handleConfirmDeleteTask = () => {
    if (!deleteTaskTarget) return;
    const res = deleteAssessmentTask(deleteTaskTarget.id);
    if (!res.isValid) {
      showToast('error', res.message || 'Cannot delete paper: Student marks have already been recorded.');
      setDeleteTaskTarget(null);
      return;
    }
    showToast('success', `Paper "${deleteTaskTarget.subjectName}" removed.`);
    setDeleteTaskTarget(null);
  };

  // Handle publish results
  const handleConfirmPublish = () => {
    if (!publishTargetTask) return;
    if (dualAuthCode.trim().toUpperCase() !== 'SCHLAR2026') {
      setDualAuthError('Please enter authorization token "SCHLAR2026" to confirm official release.');
      return;
    }

    publishAssessmentResults(publishTargetTask.id, publishTargetTask.examId);
    addAuditLog({
      user: 'Dr. Angela Vance',
      actorRole: 'Exam Coordinator',
      action: 'Results Published',
      module: 'Examinations',
      details: `Published official results for ${publishTargetTask.sectionName} ${publishTargetTask.subjectName} (${publishTargetTask.examId})`,
      severity: 'warning',
    });

    showToast('success', `Official results published for ${publishTargetTask.sectionName} - ${publishTargetTask.subjectName}. Report cards are live.`);
    setPublishTargetTask(null);
    setDualAuthCode('');
    setDualAuthError('');
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg border animate-in fade-in ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950 text-emerald-200 border-emerald-800'
              : 'bg-rose-950 text-rose-200 border-rose-800'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* MODULE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded tracking-wide uppercase border"
              style={{
                backgroundColor: 'var(--color-subtle-accent, rgba(0,0,0,0.05))',
                color: 'var(--color-primary)',
                borderColor: 'var(--color-border)',
              }}
            >
              Assessment & Controller of Examinations
            </span>
            <span className="text-xs text-slate-400">SCHLAR Exam Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Exam Coordinator Central
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Manage annual examination cycles, confidential paper custody, desk timetables, eligibility rosters, marks entry workflows, and authorized result publication.
          </p>
        </div>

        {/* Global Cycle Selector & Quick Action */}
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <CalendarDays className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="bg-transparent border-none outline-none font-semibold text-xs cursor-pointer"
              style={{ color: 'var(--color-text)' }}
            >
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} ({ex.termName || ex.academicYearId})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleOpenAddTask}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Paper</span>
          </button>
        </div>
      </div>

      {/* HORIZONTAL WORKFLOW TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b" style={{ borderColor: 'var(--color-border)' }}>
        {[
          { id: 'overview', label: 'Overview', icon: ClipboardCheck },
          { id: 'exam-calendar', label: 'Exam Calendar', icon: CalendarDays },
          { id: 'examination-setup', label: 'Assessment Papers', icon: FileCheck },
          { id: 'exam-timetable', label: 'Hall Timetable', icon: Clock },
          { id: 'exam-registrations', label: 'Hall Tickets & Eligibility', icon: BadgeCheck },
          { id: 'marks-workflow', label: 'Marks Workflow', icon: CheckSquare },
          { id: 'result-preparation', label: 'Result Moderation', icon: Award },
          { id: 'result-publication', label: 'Result Publication', icon: Lock },
          { id: 'exam-reports', label: 'Reports & Analytics', icon: Download },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                isActive
                  ? 'text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
              style={isActive ? { backgroundColor: 'var(--color-primary)' } : {}}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              className="p-4 rounded-xl border flex flex-col justify-between shadow-xs"
              style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Current Assessment Cycle</span>
              <div className="my-2">
                <span className="text-xl font-extrabold" style={{ color: 'var(--color-text)' }}>
                  {currentExam?.name || 'Term 1 Midterms'}
                </span>
                <span className="block text-xs text-slate-500 mt-0.5">
                  Window: {currentExam?.startDate} to {currentExam?.endDate}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded w-fit border border-emerald-300">
                Active Cycle
              </span>
            </div>

            <div
              className="p-4 rounded-xl border flex flex-col justify-between shadow-xs"
              style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Scheduled Exam Papers</span>
              <div className="my-2">
                <span className="text-2xl font-extrabold font-mono" style={{ color: 'var(--color-primary)' }}>
                  {currentTasks.length} Papers
                </span>
                <span className="block text-xs text-slate-500 mt-0.5">Across Grades 8, 9, 10</span>
              </div>
              <span className="text-[10px] text-slate-500">All venues verified roadworthy</span>
            </div>

            <div
              className="p-4 rounded-xl border flex flex-col justify-between shadow-xs"
              style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Hall Ticket Readiness</span>
              <div className="my-2">
                <span className="text-2xl font-extrabold font-mono text-emerald-600">
                  {students.filter((s) => s.enrollmentStatus === 'active').length} / {students.length}
                </span>
                <span className="block text-xs text-slate-500 mt-0.5">Active Cohort Cleared</span>
              </div>
              <span className="text-[10px] text-slate-500">Zero fee-block holds</span>
            </div>

            <div
              className="p-4 rounded-xl border flex flex-col justify-between shadow-xs"
              style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Results Published</span>
              <div className="my-2">
                <span className="text-2xl font-extrabold font-mono text-amber-600">
                  {currentTasks.filter((t) => t.status === 'published').length} / {currentTasks.length}
                </span>
                <span className="block text-xs text-slate-500 mt-0.5">Live on Parent Portal</span>
              </div>
              <span className="text-[10px] text-slate-500">Moderation in progress</span>
            </div>
          </div>

          {/* UPCOMING PAPERS TABLE */}
          <div
            className="p-5 rounded-2xl border space-y-4 shadow-sm"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
                  Active Examination Papers & Status
                </h3>
                <p className="text-xs text-slate-500">Scheduled testing units and faculty moderation progress</p>
              </div>
              <button
                onClick={() => setActiveTab('examination-setup')}
                className="text-xs font-semibold hover:underline"
                style={{ color: 'var(--color-primary)' }}
              >
                View All Papers →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <th className="py-2.5 px-3 font-semibold text-slate-400 text-[10px] uppercase">Subject & Class</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-400 text-[10px] uppercase">Venue & Duration</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-400 text-[10px] uppercase">Date & Period</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-400 text-[10px] uppercase">Assigned Faculty</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-400 text-[10px] uppercase">Max / Pass</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-400 text-[10px] uppercase text-right">Workflow Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                  {currentTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                      <td className="py-3 px-3">
                        <span className="font-bold block" style={{ color: 'var(--color-text)' }}>
                          {task.subjectName}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {task.className} · {task.sectionName}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold block">{task.room || 'Main Hall'}</span>
                        <span className="text-[11px] text-slate-400">90 Minutes</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-[11px] font-semibold">{task.examDate}</span>
                        <span className="block text-[10px] text-slate-400">09:00 AM - 10:30 AM</span>
                      </td>
                      <td className="py-3 px-3">
                        <span>{task.teacherName}</span>
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold">
                        {task.maxMarks} / <span className="text-emerald-600">{Math.round(task.maxMarks * 0.4)}</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            task.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : task.status === 'submitted'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {task.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EXAM CALENDAR */}
      {activeTab === 'exam-calendar' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                Annual Assessment Cycles & Term Windows
              </h2>
              <p className="text-xs text-slate-500">Official academic council approved examination schedules</p>
            </div>
            {canManageExams && (
              <button
                onClick={handleOpenAddExam}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm hover:opacity-90 w-fit"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Exam Cycle</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exams.map((ex) => {
              const examTaskCount = assessmentTasks.filter((t) => t.examId === ex.id).length;
              const isSelected = ex.id === selectedExamId;
              return (
                <div
                  key={ex.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isSelected ? 'ring-2' : ''
                  }`}
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {ex.termName || ex.academicYearId}
                      </span>
                      <h3 className="text-base font-bold mt-0.5" style={{ color: 'var(--color-text)' }}>
                        {ex.name}
                      </h3>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ex.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : ex.status === 'ongoing' || ex.status === 'marks_entry'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {ex.status}
                    </span>
                  </div>

                  <div className="my-4 space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {ex.startDate} → {ex.endDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>{examTaskCount} Assessment Papers Scheduled</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t text-xs" style={{ borderColor: 'var(--color-border)' }}>
                    <button
                      onClick={() => setSelectedExamId(ex.id)}
                      className="font-semibold text-xs hover:underline"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {isSelected ? '✓ Active View' : 'Select Cycle'}
                    </button>
                    {canManageExams && (
                      <button
                        onClick={() => handleOpenEditExam(ex)}
                        className="p-1 rounded text-slate-400 hover:text-slate-700"
                        title="Edit Exam Dates"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: EXAMINATION SETUP (ASSESSMENT PAPERS) */}
      {activeTab === 'examination-setup' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                Assessment Papers & Subject Specifications
              </h2>
              <p className="text-xs text-slate-500">
                Configuring papers for cycle: <strong>{currentExam?.name}</strong>
              </p>
            </div>
            {canManageExams && (
              <button
                onClick={handleOpenAddTask}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm hover:opacity-90 w-fit"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Paper</span>
              </button>
            )}
          </div>

          {/* PAPERS TABLE */}
          <div
            className="rounded-2xl border overflow-hidden shadow-sm"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b" style={{ backgroundColor: 'var(--color-table-header, rgba(0,0,0,0.02))', borderColor: 'var(--color-border)' }}>
                    <th className="py-2.5 px-3 font-semibold text-slate-400 text-[10px] uppercase">Subject Name</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-400 text-[10px] uppercase">Grade & Section</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-400 text-[10px] uppercase">Venue & Duration</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-400 text-[10px] uppercase">Exam Date</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-400 text-[10px] uppercase">Max Marks</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-400 text-[10px] uppercase">Passing Threshold</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-400 text-[10px] uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                  {currentTasks.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        No examination papers scheduled for this cycle yet.
                      </td>
                    </tr>
                  ) : (
                    currentTasks.map((t) => (
                      <tr key={t.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                        <td className="py-3 px-3 font-bold" style={{ color: 'var(--color-text)' }}>
                          {t.subjectName}
                        </td>
                        <td className="py-3 px-3">
                          {t.className} · {t.sectionName}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold block">{t.room || 'Main Hall A'}</span>
                          <span className="text-[10px] text-slate-400">90 min duration</span>
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold">
                          {t.examDate}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold">
                          {t.maxMarks}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-emerald-600">
                          {Math.round(t.maxMarks * 0.4)} (40%)
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {canManageExams && (
                              <button
                                onClick={() => handleOpenEditTask(t)}
                                className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 hover:text-slate-800"
                                title="Edit Paper"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {canManageExams && (
                              <button
                                onClick={() => setDeleteTaskTarget(t)}
                                className="p-1.5 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                                title="Delete Paper"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EXAM TIMETABLE & CONFLICTS */}
      {activeTab === 'exam-timetable' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
              Examination Hall Schedule & Clash Engine
            </h2>
            <p className="text-xs text-slate-500">
              Detects venue double-bookings and cohort exam overlaps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Main Exam Hall A', 'STEM Wing Hall B', 'Auditorium Center'].map((hall) => {
              const hallTasks = currentTasks.filter((t) => (t.room || 'Main Exam Hall A') === hall);
              return (
                <div
                  key={hall}
                  className="p-4 rounded-xl border space-y-3"
                  style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                >
                  <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                      <span className="font-bold text-xs" style={{ color: 'var(--color-text)' }}>
                        {hall}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Capacity: 120 Desks</span>
                  </div>

                  {hallTasks.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">No papers assigned to this hall</div>
                  ) : (
                    <div className="space-y-2">
                      {hallTasks.map((t) => (
                        <div
                          key={t.id}
                          className="p-2.5 rounded-lg border text-xs"
                          style={{
                            backgroundColor: 'var(--color-background)',
                            borderColor: 'var(--color-border)',
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold">{t.subjectName}</span>
                            <span className="font-mono text-[10px] text-slate-500">{t.examDate}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {t.className} · {t.sectionName} (Invigilator: {t.teacherName})
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: EXAM REGISTRATIONS & HALL TICKETS */}
      {activeTab === 'exam-registrations' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                Student Eligibility & Hall Ticket Generation
              </h2>
              <p className="text-xs text-slate-500">
                Official barcodes, desk numbers, and candidate passes
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search candidate name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1.5 rounded-lg border text-xs outline-none w-56"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              />
              <button
                onClick={() => showToast('success', 'Batch generated 2,480 hall tickets. Sent to printer spool.')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white hover:opacity-90 shadow-sm"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Batch Print All</span>
              </button>
            </div>
          </div>

          <div
            className="rounded-2xl border overflow-hidden shadow-sm"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b" style={{ backgroundColor: 'var(--color-table-header, rgba(0,0,0,0.02))', borderColor: 'var(--color-border)' }}>
                    <th className="py-2.5 px-3 font-semibold text-slate-400 text-[10px] uppercase">Candidate Name</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-400 text-[10px] uppercase">Admission ID</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-400 text-[10px] uppercase">Grade & Section</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-400 text-[10px] uppercase">Eligibility</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-400 text-[10px] uppercase">Assigned Desk</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-400 text-[10px] uppercase text-right">Hall Ticket Pass</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                  {students
                    .filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((s, idx) => (
                      <tr key={s.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                        <td className="py-2.5 px-3 font-bold" style={{ color: 'var(--color-text)' }}>
                          {s.name}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                          {s.admissionNo}
                        </td>
                        <td className="py-2.5 px-3">
                          {s.className} · {s.sectionName}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Eligible
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          Desk #{`00${idx + 1}`.slice(-3)}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => setHallTicketStudent({ ...s, deskNo: `Desk #00${idx + 1}`.slice(-3) })}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border hover:opacity-85"
                            style={{
                              backgroundColor: 'var(--color-background)',
                              borderColor: 'var(--color-border)',
                              color: 'var(--color-primary)',
                            }}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview Ticket</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: MARKS WORKFLOW */}
      {activeTab === 'marks-workflow' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                Teacher Marks Submission Desk
              </h2>
              <p className="text-xs text-slate-500">
                Track scoring completion across departments prior to moderation
              </p>
            </div>
            <button
              onClick={() => showToast('success', 'Automated reminders sent to teachers with pending mark entries.')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white hover:opacity-90 shadow-sm w-fit"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Reminders</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentTasks.map((task) => {
              const enteredMarks = marks.filter((m) => m.assessmentId === task.id);
              const secStudents = students.filter((s) => s.sectionId === task.sectionId);
              const progressPct = secStudents.length > 0 ? Math.round((enteredMarks.length / secStudents.length) * 100) : 0;
              return (
                <div
                  key={task.id}
                  className="p-4 rounded-xl border space-y-3"
                  style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                        {task.subjectName} ({task.className} - {task.sectionName})
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">Faculty Lead: {task.teacherName}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        task.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : task.status === 'submitted'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400 font-medium">Scoring Progress</span>
                      <span className="font-mono font-bold">{enteredMarks.length} / {secStudents.length} Students ({progressPct}%)</span>
                    </div>
                    <div className="w-full bg-black/10 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${progressPct}%`,
                          backgroundColor: progressPct === 100 ? 'var(--color-success, #10b981)' : 'var(--color-primary)',
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t text-xs" style={{ borderColor: 'var(--color-border)' }}>
                    <span className="text-slate-400 text-[11px]">Exam Date: {task.examDate}</span>
                    <button
                      onClick={() => showToast('success', `Direct ping sent to ${task.teacherName}.`)}
                      className="font-semibold text-xs hover:underline"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      Nudge Faculty
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 7: RESULT PREPARATION & MODERATION */}
      {activeTab === 'result-preparation' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
              Grading Scales & Statistical Moderation
            </h2>
            <p className="text-xs text-slate-500">
              Computed grade boundaries ratified by Academic Council
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="p-5 rounded-2xl border space-y-3"
              style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Institutional Grading Scale</h3>
              <div className="space-y-2">
                {gradingScale.map((scale, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg border text-xs"
                    style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold px-2 py-0.5 rounded text-white bg-slate-800 dark:bg-slate-700">
                        {scale.grade}
                      </span>
                      <span>{scale.description}</span>
                    </div>
                    <span className="font-mono font-semibold">
                      {scale.minScore}% – {scale.maxScore}% (GPA: {scale.gpa.toFixed(1)})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="p-5 rounded-2xl border space-y-3"
              style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Moderation Tools</h3>
              <p className="text-xs text-slate-500">
                Apply standard normal distribution curves or up to 2 grace marks for borderline student cohorts.
              </p>
              <div className="p-3 rounded-xl border bg-amber-50 dark:bg-amber-950/20 border-amber-300 text-amber-900 dark:text-amber-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Moderation policies require secondary sign-off from the Vice Principal before marks commit to statutory transcripts.
                </span>
              </div>
              <button
                onClick={() => showToast('success', 'Cohort distribution validated: 0 negative variance detected.')}
                className="w-full py-2 rounded-lg text-xs font-bold text-white hover:opacity-90"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Run Statistical Moderation Check
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: RESULT PUBLICATION */}
      {activeTab === 'result-publication' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
              Authorized Result Publication Console
            </h2>
            <p className="text-xs text-slate-500">
              Dual-authorization protocol to push validated report cards live to the Parent Mobile Shell
            </p>
          </div>

          <div className="space-y-3">
            {currentTasks.map((t) => {
              const isPublished = t.status === 'published';
              return (
                <div
                  key={t.id}
                  className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                        {t.subjectName} ({t.className} · {t.sectionName})
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isPublished
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isPublished ? 'Published & Live' : 'Unpublished (Draft/Review)'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Lead Faculty: {t.teacherName} · Evaluated: {t.maxMarks} max marks
                    </p>
                  </div>

                  <div>
                    {isPublished ? (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-300">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Available on Parent App</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setPublishTargetTask(t);
                          setDualAuthCode('');
                          setDualAuthError('');
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm hover:opacity-90"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Authorize & Publish</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 9: EXAM REPORTS */}
      {activeTab === 'exam-reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                Examination Analytics & Statutory Transcripts
              </h2>
              <p className="text-xs text-slate-500">Board accreditation packs and grade distributions</p>
            </div>
            <button
              onClick={() => showToast('success', 'Official Term Examination Summary exported to CSV.')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border hover:opacity-85"
              style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV Dossier</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className="p-4 rounded-xl border text-center space-y-2"
              style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <span className="text-xs text-slate-400 font-semibold uppercase">Overall Exam Pass Rate</span>
              <div className="text-3xl font-extrabold text-emerald-600 font-mono">98.4%</div>
              <p className="text-[11px] text-slate-500">+1.2% over previous academic year</p>
            </div>

            <div
              className="p-4 rounded-xl border text-center space-y-2"
              style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <span className="text-xs text-slate-400 font-semibold uppercase">Cohort Median Score</span>
              <div className="text-3xl font-extrabold text-blue-600 font-mono">84.2%</div>
              <p className="text-[11px] text-slate-500">Equivalent to Grade B+ / 3.4 GPA</p>
            </div>

            <div
              className="p-4 rounded-xl border text-center space-y-2"
              style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <span className="text-xs text-slate-400 font-semibold uppercase">Honors & Distinction</span>
              <div className="text-3xl font-extrabold text-amber-600 font-mono">142 Students</div>
              <p className="text-[11px] text-slate-500">Achieved GPA 3.8+ across all subjects</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT EXAM CYCLE */}
      {addExamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-md rounded-2xl border shadow-2xl p-5 space-y-4"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                {editExamTarget ? 'Edit Examination Cycle' : 'Schedule New Examination Cycle'}
              </h3>
              <button onClick={() => setAddExamModalOpen(false)} className="p-1 rounded text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {examFormError && (
              <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{examFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveExam} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Cycle Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Term 2 Final Examinations"
                  value={examFormName}
                  onChange={(e) => setExamFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Academic Year</label>
                <input
                  type="text"
                  value={examFormYear}
                  onChange={(e) => setExamFormYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={examFormStart}
                    onChange={(e) => setExamFormStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={examFormEnd}
                    onChange={(e) => setExamFormEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Status</label>
                <select
                  value={examFormStatus}
                  onChange={(e) => setExamFormStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  type="button"
                  onClick={() => setAddExamModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border text-slate-500 hover:text-slate-800"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg text-white font-bold"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  Save Cycle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT ASSESSMENT TASK */}
      {addTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-lg rounded-2xl border shadow-2xl p-5 space-y-4"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                {editTaskTarget ? 'Edit Assessment Paper' : 'Schedule Assessment Paper'}
              </h3>
              <button onClick={() => setAddTaskModalOpen(false)} className="p-1 rounded text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {taskFormError && (
              <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{taskFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveTask} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Subject *</label>
                  <select
                    value={taskFormSubject}
                    onChange={(e) => setTaskFormSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Target Class & Section *</label>
                  <select
                    value={taskFormSectionId}
                    onChange={(e) => setTaskFormSectionId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  >
                    {sections.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.className} - {sec.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Assigned Teacher Lead *</label>
                <select
                  value={taskFormTeacherId}
                  onChange={(e) => setTaskFormTeacherId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                  {staff.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Exam Date *</label>
                  <input
                    type="date"
                    required
                    value={taskFormDate}
                    onChange={(e) => setTaskFormDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Hall / Venue *</label>
                  <input
                    type="text"
                    required
                    value={taskFormRoom}
                    onChange={(e) => setTaskFormRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Max Marks *</label>
                  <input
                    type="number"
                    min="10"
                    max="200"
                    required
                    value={taskFormMaxMarks}
                    onChange={(e) => setTaskFormMaxMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Pass Marks *</label>
                  <input
                    type="number"
                    min="1"
                    max={taskFormMaxMarks}
                    required
                    value={taskFormPassMarks}
                    onChange={(e) => setTaskFormPassMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Weightage %</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={taskFormWeightage}
                    onChange={(e) => setTaskFormWeightage(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  type="button"
                  onClick={() => setAddTaskModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border text-slate-500 hover:text-slate-800"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg text-white font-bold"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  Save Paper
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: HALL TICKET PREVIEW */}
      {hallTicketStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-md rounded-2xl border shadow-2xl p-6 space-y-4 text-xs"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Official Candidate Pass</span>
                <h3 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                  Examination Hall Ticket
                </h3>
              </div>
              <button onClick={() => setHallTicketStudent(null)} className="p-1 rounded text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl border border-dashed flex items-center gap-4" style={{ borderColor: 'var(--color-border)' }}>
              <div className="w-14 h-16 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 text-[10px] shrink-0">
                PHOTO
              </div>
              <div className="space-y-1">
                <span className="font-bold text-sm block" style={{ color: 'var(--color-text)' }}>
                  {hallTicketStudent.name}
                </span>
                <div className="text-[11px] text-slate-400">
                  Admission: <strong className="font-mono text-slate-600 dark:text-slate-300">{hallTicketStudent.admissionNo}</strong>
                </div>
                <div className="text-[11px] text-slate-400">
                  Cohort: {hallTicketStudent.className} · {hallTicketStudent.sectionName}
                </div>
                <div className="text-[11px] font-bold text-emerald-600">
                  {hallTicketStudent.deskNo} · Main Hall A
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded bg-black/5 dark:bg-white/5 font-mono text-[10px] text-center tracking-widest text-slate-500">
              ||| | ||||| || |||| ||||| | ||| |||||
              <div className="text-[9px] mt-0.5">BARCODE TOKEN: {hallTicketStudent.id}-2026-EXAM</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                onClick={() => setHallTicketStudent(null)}
                className="px-3 py-1.5 rounded-lg border text-slate-500"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  showToast('success', `Hall Ticket for ${hallTicketStudent.name} printed.`);
                  setHallTicketStudent(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white font-bold"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Pass</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PUBLISH AUTHORIZATION CONFIRMATION */}
      {publishTargetTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-md rounded-2xl border shadow-2xl p-5 space-y-4 text-xs"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                  Authorize Result Publication
                </h3>
              </div>
              <button onClick={() => setPublishTargetTask(null)} className="p-1 rounded text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 text-amber-900 dark:text-amber-300 text-xs">
              You are about to officially publish results for <strong>{publishTargetTask.subjectName}</strong> ({publishTargetTask.sectionName}). Once published, report cards and grade rankings will be instantly visible to parents on the mobile app.
            </div>

            {dualAuthError && (
              <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{dualAuthError}</span>
              </div>
            )}

            <div>
              <label className="font-semibold block mb-1">
                Enter Authorization Code (Type "<strong>SCHLAR2026</strong>") *
              </label>
              <input
                type="text"
                placeholder="SCHLAR2026"
                value={dualAuthCode}
                onChange={(e) => setDualAuthCode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border outline-none font-mono uppercase text-xs"
                style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => setPublishTargetTask(null)}
                className="px-3 py-1.5 rounded-lg border text-slate-500 hover:text-slate-800"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPublish}
                className="px-3 py-1.5 rounded-lg text-white font-bold bg-amber-600 hover:bg-amber-700"
              >
                Confirm & Release Live
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deleteTaskTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-sm rounded-2xl border shadow-2xl p-5 space-y-4 text-xs"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-sm">Remove Assessment Paper?</h3>
            </div>
            <p className="text-slate-500">
              Are you sure you want to remove <strong>{deleteTaskTarget.subjectName}</strong> ({deleteTaskTarget.sectionName}) from the exam schedule?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                onClick={() => setDeleteTaskTarget(null)}
                className="px-3 py-1.5 rounded-lg border text-slate-500"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteTask}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700"
              >
                Remove Paper
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
