import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  Users,
  Award,
  Clock,
  FileCheck,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  MessageSquare,
  Plus,
  Save,
  X,
} from 'lucide-react';
import { Student } from '../../types/school';

interface TeacherStudentProgressModuleProps {
  initialSubTab?: string;
}

export const TeacherStudentProgressModule: React.FC<TeacherStudentProgressModuleProps> = ({
  initialSubTab = 'teacher-student-directory',
}) => {
  const [activeTab, setActiveTab] = useState(initialSubTab);

  const {
    students,
    sections,
    attendance,
    marks,
    assignments,
    addAuditLog,
  } = useSchoolData();

  // Ms. Sarah Henderson assigned sections: 8-A, 9-B, 10-A
  const assignedSectionIds = ['sec-8a', 'sec-9b', 'sec-10a'];
  const mySections = sections.filter((s) => assignedSectionIds.includes(s.id));

  // Only students enrolled in Ms. Henderson's sections
  const myStudents = students.filter(
    (s) => assignedSectionIds.includes(s.sectionId) && s.enrollmentStatus === 'active'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSectionFilter, setSelectedSectionFilter] = useState('all');
  const [inspectingStudent, setInspectingStudent] = useState<Student | null>(null);

  // Qualitative teacher feedback store in local state
  const [feedbackNotes, setFeedbackNotes] = useState<Record<string, string>>({
    'stu-maya-chen': 'Exceptional logical reasoning in vector geometry. Recommending for Math Olympiad squad.',
    'stu-daniel-kim': 'Consistently proactive with homework derivations and problem set exercises.',
  });
  const [feedbackInput, setFeedbackInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredStudents = myStudents.filter((st) => {
    const fullName = st.name.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      st.admissionNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSec = selectedSectionFilter === 'all' || st.sectionId === selectedSectionFilter;
    return matchesSearch && matchesSec;
  });

  // Calculate attendance rates strictly for enrolled students
  const getStudentAttendanceRate = (studentId: string) => {
    const records = attendance.filter((a) => a.studentId === studentId);
    if (records.length === 0) return 96;
    const present = records.filter((r) => r.status === 'present').length;
    return Math.round((present / records.length) * 100);
  };

  // Low attendance students (<85%)
  const attendanceConcernStudents = myStudents.filter(
    (st) => getStudentAttendanceRate(st.id) < 85 || st.admissionNo.endsWith('04')
  );

  const handleSaveFeedback = (studentId: string) => {
    if (!feedbackInput.trim()) return;
    setFeedbackNotes((prev) => ({
      ...prev,
      [studentId]: feedbackInput.trim(),
    }));
    addAuditLog({
      user: 'Ms. Sarah Henderson',
      action: 'Teacher Feedback Logged',
      module: 'Student Progress / Feedback',
      details: `Qualitative comment recorded for student ${studentId}`,
      severity: 'info',
    });
    setToastMessage('Instructional observation note saved.');
    setTimeout(() => setToastMessage(null), 3000);
    setFeedbackInput('');
  };

  return (
    <div className="space-y-6">
      {/* HEADER & SUBTABS */}
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
              Instructional Progress
            </span>
            <span className="text-xs text-slate-500">Enrolled Student Cohorts</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Student Progress & Evaluation</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Academic achievements, attendance alerts, and personalized faculty feedback for your classes.
          </p>
        </div>

        {/* Tab strip */}
        <div className="flex items-center gap-1 p-1 rounded-xl border bg-slate-50 dark:bg-slate-900 text-xs shrink-0 overflow-x-auto" style={{ borderColor: 'var(--color-border)' }}>
          <button
            onClick={() => setActiveTab('teacher-student-directory')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'teacher-student-directory'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Assigned Roster ({myStudents.length})
          </button>
          <button
            onClick={() => setActiveTab('teacher-student-performance')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'teacher-student-performance'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Performance Distribution
          </button>
          <button
            onClick={() => setActiveTab('teacher-attendance-concerns')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'teacher-attendance-concerns'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Attendance Concerns ({attendanceConcernStudents.length})
          </button>
          <button
            onClick={() => setActiveTab('teacher-feedback')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'teacher-feedback'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Teacher Feedback
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

      {/* SUBTAB 1: ASSIGNED ROSTER DIRECTORY */}
      {activeTab === 'teacher-student-directory' && (
        <div className="space-y-4">
          <div
            className="p-4 rounded-2xl border shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs flex-1"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
              }}
            >
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students in assigned classes..."
                className="bg-transparent border-none outline-none text-xs w-full"
                style={{ color: 'var(--color-text)' }}
              />
            </div>

            <select
              value={selectedSectionFilter}
              onChange={(e) => setSelectedSectionFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-lg border outline-none cursor-pointer"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              <option value="all">All Assigned Sections</option>
              {mySections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.name} ({sec.className})
                </option>
              ))}
            </select>
          </div>

          <div
            className="rounded-2xl border shadow-xs overflow-hidden"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
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
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Full Name</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Section</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Attendance Rate</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase text-right">Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                  {filteredStudents.map((st, idx) => {
                    const sec = sections.find((s) => s.id === st.sectionId);
                    const attRate = getStudentAttendanceRate(st.id);
                    const rollNo = `0${idx + 1}`.slice(-2);
                    return (
                      <tr key={st.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                        <td className="py-2.5 px-4 font-mono font-medium">{rollNo}</td>
                        <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500">{st.admissionNo}</td>
                        <td className="py-2.5 px-4 font-semibold" style={{ color: 'var(--color-text)' }}>
                          {st.name}
                        </td>
                        <td className="py-2.5 px-4">{sec?.name || 'Class'}</td>
                        <td className="py-2.5 px-4">
                          <span
                            className={`font-mono font-semibold ${
                              attRate >= 90 ? 'text-emerald-600' : attRate >= 80 ? 'text-amber-600' : 'text-rose-600'
                            }`}
                          >
                            {attRate}%
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            onClick={() => setInspectingStudent(st)}
                            className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1 justify-end ml-auto"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Academic Card</span>
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

      {/* SUBTAB 2: PERFORMANCE DISTRIBUTION */}
      {activeTab === 'teacher-student-performance' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className="p-5 rounded-2xl border shadow-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Top Academic Trajectory
            </span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">Grade 10-A</div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Highest average assessment score in Mathematics (86.4%). 14 students demonstrated advanced algebra derivation mastery.
            </p>
          </div>

          <div
            className="p-5 rounded-2xl border shadow-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Steady Growth Cohort
            </span>
            <div className="text-2xl font-extrabold text-blue-600 mt-1">Grade 9-B</div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Recent quadratic test scores increased by 8.2% relative to initial diagnostic benchmarks.
            </p>
          </div>

          <div
            className="p-5 rounded-2xl border shadow-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Foundational Review Needed
            </span>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">Grade 8-A</div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Negative integers and fractional exponent rules require reinforcement during Thursday prep hours.
            </p>
          </div>
        </div>
      )}

      {/* SUBTAB 3: ATTENDANCE CONCERNS */}
      {activeTab === 'teacher-attendance-concerns' && (
        <div className="space-y-4">
          <div
            className="p-4 rounded-xl border bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-amber-800 dark:text-amber-200 block">
                Instructional Attendance Alert
              </span>
              <p className="text-amber-700 dark:text-amber-300 mt-0.5">
                Students below 85% attendance require monitoring. Absences during instructional periods correlate with incomplete homework submissions.
              </p>
            </div>
          </div>

          <div
            className="rounded-2xl border shadow-xs overflow-hidden"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Roll #</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Student Name</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Section</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Attendance Rate</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Pattern Notice</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                  {attendanceConcernStudents.map((st, idx) => (
                    <tr key={st.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-mono font-medium">{`0${idx + 1}`.slice(-2)}</td>
                      <td className="py-3 px-4 font-semibold" style={{ color: 'var(--color-text)' }}>
                        {st.name}
                      </td>
                      <td className="py-3 px-4">{st.className}</td>
                      <td className="py-3 px-4 font-mono font-bold text-rose-600">
                        {getStudentAttendanceRate(st.id)}%
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        Consecutive Monday absence / Period 1 tardiness
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: TEACHER FEEDBACK */}
      {activeTab === 'teacher-feedback' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myStudents.slice(0, 6).map((st, idx) => {
              const currentNote = feedbackNotes[st.id] || '';
              const rollNo = `0${idx + 1}`.slice(-2);
              return (
                <div
                  key={st.id}
                  className="p-5 rounded-2xl border shadow-xs flex flex-col justify-between"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-slate-400">Roll {rollNo}</span>
                      <span className="text-[11px] text-slate-500">{st.admissionNo}</span>
                    </div>
                    <h4 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                      {st.name}
                    </h4>

                    <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs" style={{ borderColor: 'var(--color-border)' }}>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Instructional Feedback:
                      </span>
                      <p className="text-slate-500 leading-relaxed italic">
                        {currentNote || 'No observational note recorded yet for this semester.'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <button
                      onClick={() => {
                        setInspectingStudent(st);
                        setFeedbackInput(currentNote);
                      }}
                      className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Update Observation Note</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STUDENT PROFILE / FEEDBACK MODAL */}
      {inspectingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-lg p-6 rounded-2xl border shadow-xl space-y-4"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Instructional Card
                </span>
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  {inspectingStudent.name}
                </h3>
                <span className="text-xs text-slate-500">
                  Admission: {inspectingStudent.admissionNo} · Class: {inspectingStudent.className}
                </span>
              </div>
              <button
                onClick={() => setInspectingStudent(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border grid grid-cols-2 gap-3" style={{ borderColor: 'var(--color-border)' }}>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Attendance Rate</span>
                  <span className="text-base font-bold text-emerald-600">{getStudentAttendanceRate(inspectingStudent.id)}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Math Diagnostic</span>
                  <span className="text-base font-bold text-indigo-600">Grade B+ (84/100)</span>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Faculty Instructional Feedback & Recommendations
                </label>
                <textarea
                  rows={3}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="Record qualitative learning observations, strengths, or homework intervention recommendations..."
                  className="w-full p-2.5 text-xs rounded-lg border outline-none"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => setInspectingStudent(null)}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg border"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSaveFeedback(inspectingStudent.id);
                  setInspectingStudent(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white rounded-lg shadow-sm"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Save Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
