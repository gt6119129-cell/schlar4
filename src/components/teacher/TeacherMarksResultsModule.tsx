import React, { useState, useEffect } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  Award,
  CalendarDays,
  FileCheck,
  CheckSquare,
  ClipboardCheck,
  Save,
  Send,
  AlertCircle,
  CheckCircle2,
  Lock,
  Eye,
  Filter,
  Search,
  BookOpen,
} from 'lucide-react';
import { StudentMarkEntry, AssessmentTask } from '../../types/school';

interface TeacherMarksResultsModuleProps {
  initialSubTab?: string;
}

export const TeacherMarksResultsModule: React.FC<TeacherMarksResultsModuleProps> = ({
  initialSubTab = 'teacher-marks-entry',
}) => {
  const [activeTab, setActiveTab] = useState(initialSubTab);

  const {
    exams,
    assessmentTasks,
    marks,
    sections,
    students,
    saveMarksBatch,
    addAuditLog,
  } = useSchoolData();

  // Demo Teacher: Ms. Sarah Henderson
  const teacherId = 'staff-henderson';
  const assignedSectionIds = ['sec-8a', 'sec-9b', 'sec-10a'];
  const mySections = sections.filter((s) => assignedSectionIds.includes(s.id));

  // Assessments for Ms. Henderson
  const myTasks = assessmentTasks.filter((t) => t.teacherId === teacherId);

  // Selected task for marks entry
  const [selectedTaskId, setSelectedTaskId] = useState<string>(myTasks[0]?.id || '');
  const selectedTask = myTasks.find((t) => t.id === selectedTaskId) || myTasks[0];

  // Local draft marks state: { [studentId]: { marks: number | null, isAbsent: boolean, remarks: string } }
  const [draftMarks, setDraftMarks] = useState<
    Record<string, { score: string; isAbsent: boolean; remarks: string }>
  >({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Students in the selected task's section
  const targetStudents = selectedTask
    ? students.filter((s) => s.sectionId === selectedTask.sectionId && s.enrollmentStatus === 'active')
    : [];

  // Load existing saved marks for this task into draft state
  useEffect(() => {
    if (!selectedTask) return;
    const existing = marks.filter((m) => m.assessmentId === selectedTask.id);
    const map: Record<string, { score: string; isAbsent: boolean; remarks: string }> = {};

    targetStudents.forEach((st) => {
      const saved = existing.find((m) => m.studentId === st.id);
      if (saved) {
        map[st.id] = {
          score: saved.isAbsent || saved.marksObtained === null ? '' : String(saved.marksObtained),
          isAbsent: Boolean(saved.isAbsent),
          remarks: saved.teacherFeedback || '',
        };
      } else {
        map[st.id] = {
          score: '',
          isAbsent: false,
          remarks: '',
        };
      }
    });
    setDraftMarks(map);
    setValidationErrors({});
  }, [selectedTaskId, selectedTask?.id, marks]);

  const handleScoreChange = (studentId: string, val: string) => {
    const num = Number(val);
    const max = selectedTask?.maxMarks || 100;

    const errors = { ...validationErrors };
    if (val !== '' && (isNaN(num) || num < 0 || num > max)) {
      errors[studentId] = `Marks must be between 0 and ${max}`;
    } else {
      delete errors[studentId];
    }
    setValidationErrors(errors);

    setDraftMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        score: val,
        isAbsent: false,
      },
    }));
  };

  const handleToggleAbsent = (studentId: string) => {
    setDraftMarks((prev) => {
      const current = prev[studentId] || { score: '', isAbsent: false, remarks: '' };
      const nextAbsent = !current.isAbsent;
      return {
        ...prev,
        [studentId]: {
          ...current,
          isAbsent: nextAbsent,
          score: nextAbsent ? '' : current.score,
        },
      };
    });
  };

  const handleSaveDraft = () => {
    saveMarks(false);
  };

  const handleSubmitForReview = () => {
    // Validate that all students have either a valid score or are marked absent
    const errors: Record<string, string> = {};
    const max = selectedTask?.maxMarks || 100;

    targetStudents.forEach((st) => {
      const entry = draftMarks[st.id];
      if (!entry || (!entry.isAbsent && entry.score === '')) {
        errors[st.id] = 'Score or Absent mark is required';
      } else if (!entry.isAbsent) {
        const num = Number(entry.score);
        if (isNaN(num) || num < 0 || num > max) {
          errors[st.id] = `Marks must be between 0 and ${max}`;
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setToastMessage('Please resolve score validation errors before submitting for review.');
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    saveMarks(true);
  };

  const saveMarks = (submitForReview: boolean) => {
    if (!selectedTask) return;

    const entriesToSave = targetStudents.map((st) => {
      const entry = draftMarks[st.id] || { score: '0', isAbsent: false, remarks: '' };
      const numScore = entry.isAbsent ? null : Number(entry.score || 0);

      // Determine grade letter
      let grade = 'F';
      if (numScore !== null) {
        const pct = (numScore / selectedTask.maxMarks) * 100;
        if (pct >= 90) grade = 'A+';
        else if (pct >= 80) grade = 'A';
        else if (pct >= 70) grade = 'B';
        else if (pct >= 60) grade = 'C';
        else if (pct >= 50) grade = 'D';
      }

      return {
        studentId: st.id,
        studentName: st.name,
        marksObtained: numScore,
        isAbsent: entry.isAbsent,
        teacherFeedback: entry.remarks,
        grade: entry.isAbsent ? 'AB' : grade,
      };
    });

    saveMarksBatch(selectedTask.id, entriesToSave, submitForReview, teacherId);
    addAuditLog({
      user: 'Ms. Sarah Henderson',
      action: submitForReview ? 'Marks Submitted for Review' : 'Marks Draft Saved',
      module: 'Examinations / Grading',
      details: `Assessment "${selectedTask.subjectName} - ${selectedTask.sectionName}": ${entriesToSave.length} student scores recorded`,
      severity: 'info',
    });

    setToastMessage(
      submitForReview
        ? `Marks for "${selectedTask.subjectName} (${selectedTask.sectionName})" submitted to Vice Principal for moderation.`
        : `Draft marks saved successfully.`
    );
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER & TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-primary)',
              }}
            >
              Academic Assessment
            </span>
            <span className="text-xs text-slate-500">Grading & Evaluation Desk</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Examinations & Marks Entry</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Record assessment marks, monitor grading validation, and track moderation progress.
          </p>
        </div>

        {/* Subtab navigation */}
        <div className="flex items-center gap-1 p-1 rounded-xl border bg-slate-50 dark:bg-slate-900 text-xs shrink-0" style={{ borderColor: 'var(--color-border)' }}>
          <button
            onClick={() => setActiveTab('teacher-marks-entry')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'teacher-marks-entry' || activeTab === 'marks-results'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Marks Entry
          </button>
          <button
            onClick={() => setActiveTab('teacher-assessment-tasks')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'teacher-assessment-tasks'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            My Tasks ({myTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('teacher-exam-schedule')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'teacher-exam-schedule'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Exam Schedule
          </button>
          <button
            onClick={() => setActiveTab('teacher-results')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'teacher-results'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Results Status
          </button>
        </div>
      </div>

      {/* TOAST MESSAGE */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TAB 1: MARKS ENTRY WORKFLOW */}
      {(activeTab === 'teacher-marks-entry' || activeTab === 'marks-results') && (
        <div className="space-y-6">
          {/* TASK & COHORT SELECTOR */}
          <div
            className="p-4 rounded-2xl border shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Assessment Paper / Test Task
              </label>
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-lg border outline-none cursor-pointer"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                {myTasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.examName} · {t.subjectName} ({t.sectionName}) — Max: {t.maxMarks} pts [Status: {t.status}]
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Current Workflow State
              </label>
              <div className="px-3 py-2 rounded-lg border flex items-center justify-between text-xs font-semibold" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
                <span className="capitalize">{selectedTask?.status.replace('_', ' ') || 'scheduled'}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                    selectedTask?.status === 'published'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : selectedTask?.status === 'submitted'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : selectedTask?.status === 'reviewed'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {selectedTask?.status === 'published' ? 'Published' : selectedTask?.status === 'submitted' ? 'Under Review' : 'In Entry'}
                </span>
              </div>
            </div>
          </div>

          {/* SPREADSHEET MARKS ENTRY TABLE */}
          <div
            className="rounded-2xl border shadow-xs overflow-hidden"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                  Marks Evaluation Sheet — {selectedTask?.examName} ({selectedTask?.subjectName})
                </h3>
                <p className="text-xs text-slate-500">
                  Target Cohort: <strong>{selectedTask?.sectionName}</strong> · Maximum Marks: <strong>{selectedTask?.maxMarks}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveDraft}
                  className="px-3.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Draft</span>
                </button>

                <button
                  onClick={handleSubmitForReview}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-all hover:opacity-95"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit for Moderation</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr
                    className="border-b"
                    style={{
                      backgroundColor: 'var(--color-table-header, #f9fafb)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Roll #</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Admission ID</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Student Full Name</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase w-32">Score (/{selectedTask?.maxMarks})</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase text-center w-24">Absent?</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Evaluator Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                  {targetStudents.map((st, idx) => {
                    const entry = draftMarks[st.id] || { score: '', isAbsent: false, remarks: '' };
                    const hasError = validationErrors[st.id];
                    const rollNo = `0${idx + 1}`.slice(-2);

                    return (
                      <tr key={st.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                        <td className="py-2.5 px-4 font-mono font-medium">{rollNo}</td>
                        <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500">{st.admissionNo}</td>
                        <td className="py-2.5 px-4 font-semibold" style={{ color: 'var(--color-text)' }}>
                          {st.name}
                        </td>
                        <td className="py-2 px-4">
                          <input
                            type="number"
                            min={0}
                            max={selectedTask?.maxMarks || 100}
                            value={entry.isAbsent ? '' : entry.score}
                            disabled={entry.isAbsent}
                            placeholder={entry.isAbsent ? 'Absent' : '0.0'}
                            onChange={(e) => handleScoreChange(st.id, e.target.value)}
                            className={`w-24 px-2.5 py-1 text-xs font-mono font-semibold rounded-md border outline-none ${
                              hasError ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/20' : ''
                            } ${entry.isAbsent ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' : ''}`}
                            style={{
                              backgroundColor: entry.isAbsent ? undefined : 'var(--color-background)',
                              borderColor: hasError ? undefined : 'var(--color-border)',
                              color: 'var(--color-text)',
                            }}
                          />
                          {hasError && <span className="text-[10px] text-rose-500 block mt-0.5">{hasError}</span>}
                        </td>
                        <td className="py-2 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={entry.isAbsent}
                            onChange={() => handleToggleAbsent(st.id)}
                            className="w-4 h-4 rounded text-rose-600 cursor-pointer"
                          />
                        </td>
                        <td className="py-2 px-4">
                          <input
                            type="text"
                            value={entry.remarks}
                            onChange={(e) => {
                              const val = e.target.value;
                              setDraftMarks((prev) => ({
                                ...prev,
                                [st.id]: {
                                  ...prev[st.id],
                                  remarks: val,
                                },
                              }));
                            }}
                            placeholder="Optional feedback..."
                            className="w-full px-2 py-1 text-xs rounded border outline-none"
                            style={{
                              backgroundColor: 'var(--color-background)',
                              borderColor: 'var(--color-border)',
                              color: 'var(--color-text)',
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY ASSESSMENT TASKS */}
      {activeTab === 'teacher-assessment-tasks' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myTasks.map((task) => (
              <div
                key={task.id}
                className="p-5 rounded-2xl border shadow-xs flex flex-col justify-between"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold border"
                      style={{
                        backgroundColor: 'var(--color-background)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-primary)',
                      }}
                    >
                      {task.sectionName} · {task.subjectName}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        task.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : task.status === 'submitted'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                    {task.examName} ({task.subjectName})
                  </h3>
                  <div className="text-xs text-slate-500 mt-2 space-y-1">
                    <div>Assessment Date: <strong>{task.examDate} ({task.startTime})</strong></div>
                    <div>Max Marks: <strong>{task.maxMarks} Points</strong></div>
                    <div>Room / Hall: <strong>{task.room}</strong></div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
                  <button
                    onClick={() => {
                      setSelectedTaskId(task.id);
                      setActiveTab('teacher-marks-entry');
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <span>Open Marks Sheet</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EXAM SCHEDULE */}
      {activeTab === 'teacher-exam-schedule' && (
        <div className="space-y-4">
          <div
            className="rounded-2xl border shadow-xs overflow-hidden"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="p-4 border-b">
              <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                Official Examination Timetable & Invigilation Slots
              </h3>
              <p className="text-xs text-slate-500">
                Coordinated with Vice Principal and Examination Council
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr
                    className="border-b"
                    style={{
                      backgroundColor: 'var(--color-table-header, #f9fafb)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Exam Cycle</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Paper Date</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Class & Section</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Subject</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Room / Hall</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Duty</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                  {exams.map((ex) => (
                    <tr key={ex.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-semibold" style={{ color: 'var(--color-text)' }}>{ex.name}</td>
                      <td className="py-3 px-4 font-mono">{ex.startDate}</td>
                      <td className="py-3 px-4">Grade 8, 9, 10</td>
                      <td className="py-3 px-4">Mathematics</td>
                      <td className="py-3 px-4">Main Hall A</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                          Primary Examiner
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

      {/* TAB 4: RESULTS PUBLICATION STATUS */}
      {activeTab === 'teacher-results' && (
        <div className="space-y-4">
          <div
            className="p-6 rounded-2xl border shadow-xs max-w-2xl"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <Lock className="w-5 h-5" />
              <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                Result Publication Access Rule
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              In adherence to SCHLAR institutional governance, classroom teachers enter, moderate, and submit assessment marks. Official publication of semester report cards and public result broadcasts is strictly reserved for the <strong>Vice Principal</strong> and <strong>Principal's Office</strong>.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs space-y-2" style={{ borderColor: 'var(--color-border)' }}>
              <div className="font-semibold text-slate-700 dark:text-slate-300">
                Your Submitted Papers Status:
              </div>
              {myTasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{t.examName} ({t.sectionName})</span>
                  <span className="capitalize font-semibold">{t.status.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
