import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
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
} from 'lucide-react';
import { AssessmentTask } from '../../types/school';

interface VPExaminationsModuleProps {
  initialSubTab?: string;
}

export const VPExaminationsModule: React.FC<VPExaminationsModuleProps> = ({
  initialSubTab = 'vp-exam-overview',
}) => {
  const [activeTab, setActiveTab] = useState(initialSubTab);
  const [selectedExamId, setSelectedExamId] = useState<string>('exam-midterm-2026');
  const [inspectingTaskId, setInspectingTaskId] = useState<string | null>(null);
  const [publishToast, setPublishToast] = useState<string | null>(null);

  const { exams, assessmentTasks, marks, publishAssessmentResults } = useSchoolData();

  const selectedExam = exams.find((e) => e.id === selectedExamId) || exams[0];
  const examTasks = assessmentTasks.filter((t) => t.examId === selectedExam?.id);

  const inspectingTask = assessmentTasks.find((t) => t.id === inspectingTaskId);
  const taskMarks = inspectingTaskId ? marks.filter((m) => m.assessmentId === inspectingTaskId) : [];

  const handlePublish = (taskId: string) => {
    publishAssessmentResults(taskId, selectedExam?.id);
    setPublishToast('Official results authorized and published. Report cards are now accessible.');
    setTimeout(() => setPublishToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {publishToast && (
        <div className="p-3 rounded-xl bg-emerald-950 text-emerald-200 border border-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{publishToast}</span>
        </div>
      )}

      {/* MODULE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Examinations Oversight</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Examination cycles, assessment schedules, faculty marks entry monitoring, and official result publication
          </p>
        </div>

        {/* SUB-TABS */}
        <div className="flex items-center gap-1 p-1 bg-muted rounded-xl text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('vp-exam-overview')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'vp-exam-overview' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('vp-exam-schedule')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'vp-exam-schedule' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Schedule
          </button>
          <button
            onClick={() => setActiveTab('vp-marks-monitoring')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'vp-marks-monitoring' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Marks Entry Monitoring
          </button>
          <button
            onClick={() => setActiveTab('vp-result-review')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'vp-result-review' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Result Review
          </button>
          <button
            onClick={() => setActiveTab('vp-result-publication')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'vp-result-publication' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Publication Status
          </button>
        </div>
      </div>

      {/* ACTIVE EXAM CYCLE SELECTOR */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl border bg-card">
        <div className="flex items-center gap-3">
          <ClipboardCheck className="w-5 h-5 text-primary shrink-0" />
          <div>
            <div className="text-xs text-muted-foreground font-medium">Active Evaluation Cycle:</div>
            <div className="text-sm font-bold text-foreground">{selectedExam?.name}</div>
          </div>
        </div>

        <select
          value={selectedExamId}
          onChange={(e) => setSelectedExamId(e.target.value)}
          className="text-xs rounded-xl border bg-background px-3 py-2 focus:outline-hidden font-semibold"
        >
          {exams.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.name} ({ex.status.toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      {/* 1. EXAM OVERVIEW VIEW */}
      {activeTab === 'vp-exam-overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-2">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Total Assessment Tasks</span>
              <div className="text-2xl font-bold text-primary">{examTasks.length} Papers</div>
              <p className="text-xs text-muted-foreground">Administered across all grades</p>
            </div>

            <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-2">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Marks Entries Submitted</span>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {examTasks.filter((t) => t.status === 'submitted' || t.status === 'reviewed' || t.status === 'published').length} / {examTasks.length}
              </div>
              <p className="text-xs text-muted-foreground">Gradebooks ready for moderation</p>
            </div>

            <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-2">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Cycle Status</span>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {selectedExam?.status.toUpperCase()}
              </div>
              <p className="text-xs text-muted-foreground">Window: {selectedExam?.startDate} to {selectedExam?.endDate}</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. EXAM SCHEDULE VIEW */}
      {activeTab === 'vp-exam-schedule' && (
        <div className="border rounded-2xl overflow-hidden bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted text-muted-foreground font-semibold border-b">
                <tr>
                  <th className="p-3">Exam Date & Time</th>
                  <th className="p-3">Section</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Invigilator / Teacher</th>
                  <th className="p-3">Hall / Room</th>
                  <th className="p-3 text-center">Duration</th>
                  <th className="p-3 text-right">Max Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {examTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-muted/30">
                    <td className="p-3 font-semibold text-foreground">
                      <div>{task.examDate}</div>
                      <div className="text-muted-foreground text-[11px] font-mono">{task.startTime}</div>
                    </td>
                    <td className="p-3 font-bold text-foreground">{task.sectionName}</td>
                    <td className="p-3 font-semibold text-primary">{task.subjectName}</td>
                    <td className="p-3">{task.teacherName}</td>
                    <td className="p-3 font-mono">{task.room}</td>
                    <td className="p-3 text-center">{task.durationMinutes} mins</td>
                    <td className="p-3 text-right font-bold">{task.maxMarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. MARKS ENTRY MONITORING VIEW */}
      {activeTab === 'vp-marks-monitoring' && (
        <div className="space-y-4">
          <div className="border rounded-2xl overflow-hidden bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted text-muted-foreground font-semibold border-b">
                  <tr>
                    <th className="p-3">Assessment Paper</th>
                    <th className="p-3">Section</th>
                    <th className="p-3">Assigned Faculty</th>
                    <th className="p-3">Evaluated Students</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {examTasks.map((task) => {
                    const taskMarksCount = marks.filter((m) => m.assessmentId === task.id).length;

                    return (
                      <tr key={task.id} className="hover:bg-muted/30">
                        <td className="p-3 font-bold text-foreground">{task.subjectName}</td>
                        <td className="p-3 font-semibold">{task.sectionName}</td>
                        <td className="p-3 text-muted-foreground">{task.teacherName}</td>
                        <td className="p-3 font-semibold">
                          {taskMarksCount > 0 ? `${taskMarksCount} students graded` : 'Pending input'}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              task.status === 'reviewed' || task.status === 'published'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : task.status === 'submitted'
                                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {task.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setInspectingTaskId(task.id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-colors flex items-center gap-1 ml-auto"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect Marks</span>
                          </button>
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

      {/* 4. RESULT REVIEW & MODERATION VIEW */}
      {activeTab === 'vp-result-review' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border bg-muted/30 text-xs text-muted-foreground flex items-center gap-3">
            <Award className="w-5 h-5 text-primary shrink-0" />
            <div>
              <strong>Gradebook Moderation Protocol</strong>: Review student score curves and individual teacher feedback before signing off for official publication.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examTasks.map((task) => {
              const entries = marks.filter((m) => m.assessmentId === task.id);
              const validMarks = entries.filter((e) => e.marksObtained !== null).map((e) => e.marksObtained as number);
              const avg = validMarks.length > 0 ? Math.round(validMarks.reduce((a, b) => a + b, 0) / validMarks.length) : 0;

              return (
                <div key={task.id} className="p-5 rounded-2xl border bg-card shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary">{task.sectionName}</span>
                    <span className="text-xs font-semibold text-muted-foreground">Class Average: <strong className="text-foreground">{avg}/{task.maxMarks}</strong></span>
                  </div>
                  <h3 className="text-base font-bold text-foreground">{task.subjectName}</h3>
                  <div className="text-xs text-muted-foreground">Evaluator: {task.teacherName}</div>

                  <div className="flex items-center justify-between pt-2 border-t text-xs">
                    <span className="text-muted-foreground">{entries.length} student scores entered</span>
                    <button
                      onClick={() => setInspectingTaskId(task.id)}
                      className="text-primary font-semibold hover:underline"
                    >
                      Audit Score Roster →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. RESULT PUBLICATION STATUS VIEW */}
      {activeTab === 'vp-result-publication' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                <span>Publication Lock & Official Authorization</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Results remain confidential until authorized by the Vice Principal. Publishing unlocks student report cards.
              </p>
            </div>
          </div>

          <div className="border rounded-2xl overflow-hidden bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted text-muted-foreground font-semibold border-b">
                  <tr>
                    <th className="p-3">Class & Section</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Marks Entries</th>
                    <th className="p-3">Current Status</th>
                    <th className="p-3 text-right">Authorization</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {examTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-muted/30">
                      <td className="p-3 font-bold text-foreground">{task.sectionName}</td>
                      <td className="p-3 font-semibold">{task.subjectName}</td>
                      <td className="p-3 text-muted-foreground">{task.teacherName}</td>
                      <td className="p-3">
                        {task.status === 'published' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                            <Unlock className="w-3.5 h-3.5" />
                            PUBLISHED & RELEASED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                            <Lock className="w-3.5 h-3.5" />
                            LOCKED (PRE-PUBLICATION)
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {task.status !== 'published' ? (
                          <button
                            onClick={() => handlePublish(task.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
                          >
                            Authorize & Publish
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground font-semibold">Published</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* INSPECT MARKS ROSTER MODAL */}
      {inspectingTaskId && inspectingTask && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-card border rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b">
              <div>
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  <span>{inspectingTask.sectionName} — {inspectingTask.subjectName} Marks Roster</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Evaluator: {inspectingTask.teacherName} • Max Marks: {inspectingTask.maxMarks}
                </p>
              </div>
              <button
                onClick={() => setInspectingTaskId(null)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {taskMarks.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  No student marks entered yet for this assessment.
                </div>
              ) : (
                <div className="border rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted font-semibold text-muted-foreground border-b">
                      <tr>
                        <th className="p-2.5">Roll</th>
                        <th className="p-2.5">Student Name</th>
                        <th className="p-2.5 text-center">Score</th>
                        <th className="p-2.5 text-center">Grade</th>
                        <th className="p-2.5">Teacher Feedback</th>
                        <th className="p-2.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {taskMarks.map((m) => (
                        <tr key={m.id} className="hover:bg-muted/30">
                          <td className="p-2.5 font-mono text-muted-foreground">{m.rollNo || '—'}</td>
                          <td className="p-2.5 font-bold text-foreground">{m.studentName}</td>
                          <td className="p-2.5 text-center font-bold text-foreground">
                            {m.isAbsent ? <span className="text-rose-500">Absent</span> : `${m.marksObtained}/${m.maxMarks}`}
                          </td>
                          <td className="p-2.5 text-center font-bold text-primary">{m.grade || '—'}</td>
                          <td className="p-2.5 text-muted-foreground text-[11px] max-w-xs truncate">{m.teacherFeedback || '—'}</td>
                          <td className="p-2.5 text-right font-medium text-[11px]">{m.status.toUpperCase()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
              <div className="text-xs text-muted-foreground">
                Total graded: <strong>{taskMarks.length} students</strong>
              </div>
              <button
                onClick={() => setInspectingTaskId(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-muted hover:bg-muted/80"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
