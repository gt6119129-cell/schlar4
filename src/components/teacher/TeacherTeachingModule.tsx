import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  BookOpen,
  Building2,
  BookMarked,
  FileText,
  Bookmark,
  Library,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Calendar,
  Save,
  Download,
  Check,
  Edit3,
} from 'lucide-react';
import { LessonPlan, SyllabusTopic } from '../../types/school';

interface TeacherTeachingModuleProps {
  initialSubTab?: string;
}

export const TeacherTeachingModule: React.FC<TeacherTeachingModuleProps> = ({
  initialSubTab = 'teacher-class-details',
}) => {
  const [activeTab, setActiveTab] = useState(initialSubTab);

  const {
    sections,
    students,
    subjects,
    syllabus,
    lessonPlans,
    addLessonPlan,
    updateSyllabusTopic,
    addAuditLog,
  } = useSchoolData();

  // Demo Teacher: Ms. Sarah Henderson
  const teacherId = 'staff-henderson';
  const assignedSectionIds = ['sec-8a', 'sec-9b', 'sec-10a'];
  const mySections = sections.filter((s) => assignedSectionIds.includes(s.id));

  // Lesson plan authoring state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [planTitle, setPlanTitle] = useState('');
  const [planSectionId, setPlanSectionId] = useState(mySections[0]?.id || 'sec-9b');
  const [planDate, setPlanDate] = useState('2026-10-22');
  const [planObjectives, setPlanObjectives] = useState('');
  const [planResources, setPlanResources] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Lesson plans for Ms. Henderson
  const myLessonPlans = lessonPlans.filter((l) => l.teacherId === teacherId);

  // Syllabus topics for Mathematics (filtered for teacher)
  const mathSyllabus = syllabus.filter((s) => s.subjectName === 'Mathematics');

  const handleSaveLessonPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planTitle.trim() || !planObjectives.trim()) return;

    const targetSec = mySections.find((s) => s.id === planSectionId);
    const newPlan: Omit<LessonPlan, 'id'> = {
      teacherId,
      teacherName: 'Ms. Sarah Henderson',
      sectionId: planSectionId,
      sectionName: targetSec?.name || 'Class',
      classId: targetSec?.classId || 'class-9',
      className: targetSec?.className || 'Grade 9',
      subjectName: 'Mathematics',
      plannedDate: planDate,
      topic: planTitle.trim(),
      learningObjectives: planObjectives.trim(),
      resources: planResources.trim() || 'Textbook Ch. 4, Geogebra Simulator',
      status: 'approved',
    };

    addLessonPlan(newPlan);
    addAuditLog({
      user: 'Ms. Sarah Henderson',
      action: 'Lesson Plan Created',
      module: 'Curriculum / Planning',
      details: `Authored lesson plan "${newPlan.topic}" for ${newPlan.sectionName}`,
      severity: 'info',
    });

    setToastMessage(`Lesson plan "${newPlan.topic}" successfully registered.`);
    setTimeout(() => setToastMessage(null), 3500);
    setCreateModalOpen(false);
    setPlanTitle('');
    setPlanObjectives('');
    setPlanResources('');
  };

  const handleIncrementProgress = (topic: SyllabusTopic) => {
    const nextCompleted = Math.min(topic.totalLessons, topic.completedLessons + 1);
    const nextStatus = nextCompleted === topic.totalLessons ? 'completed' : 'in_progress';
    updateSyllabusTopic(topic.id, {
      completedLessons: nextCompleted,
      status: nextStatus,
    });
    setToastMessage(`Updated "${topic.topicTitle}" progress to ${nextCompleted}/${topic.totalLessons} lessons.`);
    setTimeout(() => setToastMessage(null), 3000);
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
              Instructional Suite
            </span>
            <span className="text-xs text-slate-500">Curriculum & Teaching Materials</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Teaching & Curriculum Delivery</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Lesson planning, chapter pacing records, courseware materials, and teaching aids.
          </p>
        </div>

        {/* Tab strip */}
        <div className="flex items-center gap-1 p-1 rounded-xl border bg-slate-50 dark:bg-slate-900 text-xs shrink-0 overflow-x-auto" style={{ borderColor: 'var(--color-border)' }}>
          <button
            onClick={() => setActiveTab('teacher-class-details')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'teacher-class-details'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Class Details
          </button>
          <button
            onClick={() => setActiveTab('teacher-lesson-plans')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'teacher-lesson-plans'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Lesson Plans ({myLessonPlans.length})
          </button>
          <button
            onClick={() => setActiveTab('teacher-syllabus-progress')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'teacher-syllabus-progress'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Syllabus Pacing
          </button>
          <button
            onClick={() => setActiveTab('teacher-subject-materials')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'teacher-subject-materials'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Subject Materials
          </button>
          <button
            onClick={() => setActiveTab('teacher-resources')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'teacher-resources'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Teaching Resources
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

      {/* SUBTAB 1: CLASS DETAILS */}
      {activeTab === 'teacher-class-details' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mySections.map((sec) => {
            const secStudents = students.filter(
              (s) => s.sectionId === sec.id && s.enrollmentStatus === 'active'
            );
            return (
              <div
                key={sec.id}
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
                      {sec.className}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Room {sec.room || '204'}</span>
                  </div>

                  <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                    {sec.name}
                  </h3>
                  <div className="text-xs text-slate-500 mt-2 space-y-1">
                    <div>Enrolled Strength: <strong>{secStudents.length} Students</strong></div>
                    <div>Instructional Subject: <strong>Mathematics</strong></div>
                    <div>Weekly Allotment: <strong>5 Periods</strong></div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t flex items-center justify-between text-xs" style={{ borderColor: 'var(--color-border)' }}>
                  <span className="text-slate-500">Class Advisory: Active</span>
                  <span className="font-semibold text-emerald-600">Good Standing</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUBTAB 2: LESSON PLANS */}
      {activeTab === 'teacher-lesson-plans' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
              Instructional Lesson Plans Register
            </h3>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Plus className="w-4 h-4" />
              <span>Draft Lesson Plan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myLessonPlans.map((plan) => (
              <div
                key={plan.id}
                className="p-5 rounded-2xl border shadow-xs"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold border"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-primary)',
                    }}
                  >
                    {plan.sectionName} · {plan.subjectName}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{plan.plannedDate}</span>
                </div>

                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  {plan.topic}
                </h3>

                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="font-semibold block text-slate-700 dark:text-slate-300">
                      Learning Objectives:
                    </span>
                    <p className="text-slate-500 mt-0.5 leading-relaxed">{plan.learningObjectives}</p>
                  </div>
                  <div>
                    <span className="font-semibold block text-slate-700 dark:text-slate-300">
                      Pedagogical Aids & Resources:
                    </span>
                    <p className="text-slate-500 mt-0.5">{plan.resources}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: SYLLABUS PACING */}
      {activeTab === 'teacher-syllabus-progress' && (
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
                Mathematics Curriculum Delivery Pacing
              </h3>
              <p className="text-xs text-slate-500">
                Track lesson progress per topic and register delivery completion for administrative review.
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
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Topic / Chapter</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Class</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Pacing</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Status</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">VP Review</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                  {mathSyllabus.map((top) => {
                    const pct = Math.round((top.completedLessons / top.totalLessons) * 100);
                    return (
                      <tr key={top.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                        <td className="py-3 px-4 font-semibold" style={{ color: 'var(--color-text)' }}>
                          {top.topicTitle}
                        </td>
                        <td className="py-3 px-4">{top.className}</td>
                        <td className="py-3 px-4 w-44">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-mono">{top.completedLessons} / {top.totalLessons}</span>
                            <span className="font-bold">{pct}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${pct}%`, backgroundColor: 'var(--color-primary)' }}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              top.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {top.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {top.vpReviewed ? (
                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>Signed off</span>
                            </span>
                          ) : (
                            <span className="text-slate-400">Pending review</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleIncrementProgress(top)}
                            disabled={top.completedLessons >= top.totalLessons}
                            className="px-2.5 py-1 text-[11px] font-semibold border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-40"
                            style={{ borderColor: 'var(--color-border)' }}
                          >
                            +1 Lesson Taught
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

      {/* SUBTAB 4: SUBJECT MATERIALS */}
      {activeTab === 'teacher-subject-materials' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="p-5 rounded-2xl border shadow-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <BookMarked className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                Grade 9 & 10 Mathematics Textbook Curriculum
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Standard core curriculum covering Algebraic Expressions, Geometry theorems, Coordinate Proofs, Trigonometric Ratios, and Statistical Distribution.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs space-y-1.5" style={{ borderColor: 'var(--color-border)' }}>
              <div className="font-semibold text-slate-700 dark:text-slate-300">Prescribed Reference:</div>
              <div className="text-slate-500">Cambridge IGCSE & CBSE Integrated Math Series, 2026 Edition</div>
              <div className="text-slate-500">Digital companion portal enabled for homework problem sets</div>
            </div>
          </div>

          <div
            className="p-5 rounded-2xl border shadow-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Library className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                Laboratory Experiment Modules
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Interactive physical manipulatives: Trigonometric clinometers, geometric dissection proofs, and dynamic probability dice simulations.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs space-y-1.5" style={{ borderColor: 'var(--color-border)' }}>
              <div className="font-semibold text-slate-700 dark:text-slate-300">Lab Venue:</div>
              <div className="text-slate-500">Mathematics Demonstration Room (Lab 204)</div>
              <div className="text-slate-500">Reserved every Thursday Period 4 for Grade 9-B</div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: TEACHING RESOURCES */}
      {activeTab === 'teacher-resources' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Trigonometry Formula Reference Sheet',
                desc: 'Comprehensive reference of Pythagorean identities, sine/cosine laws, and standard angle tables.',
                format: 'PDF Document · 2 Pages',
              },
              {
                title: 'Graph Paper Coordinate Grid Templates',
                desc: 'Standard printable Cartesian grid templates for parabola plotting and linear equation systems.',
                format: 'Printable Sheet · 4 Grids',
              },
              {
                title: 'Rubric for Mathematical Proofs & Derivations',
                desc: 'Structured rubric evaluating logic justification, step completeness, and conclusion notation.',
                format: 'Grading Rubric · 20 Points',
              },
            ].map((res, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border shadow-xs flex flex-col justify-between"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div>
                  <h4 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                    {res.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{res.desc}</p>
                </div>
                <div className="pt-4 mt-4 border-t flex items-center justify-between text-xs" style={{ borderColor: 'var(--color-border)' }}>
                  <span className="text-[11px] text-slate-400">{res.format}</span>
                  <button
                    onClick={() => {
                      setToastMessage(`Downloaded "${res.title}" teaching aid.`);
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE LESSON PLAN MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleSaveLessonPlan}
            className="w-full max-w-md p-6 rounded-2xl border shadow-xl space-y-4"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="border-b pb-3">
              <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                Draft New Lesson Plan
              </h3>
              <p className="text-xs text-slate-500">Record instructional objectives and resources.</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Topic / Lesson Title
                </label>
                <input
                  type="text"
                  value={planTitle}
                  onChange={(e) => setPlanTitle(e.target.value)}
                  placeholder="e.g. Solving Quadratic Equations by Factoring"
                  className="w-full px-3 py-2 text-xs rounded-lg border outline-none"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                    Cohort Section
                  </label>
                  <select
                    value={planSectionId}
                    onChange={(e) => setPlanSectionId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border outline-none cursor-pointer"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                  >
                    {mySections.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                    Planned Date
                  </label>
                  <input
                    type="date"
                    value={planDate}
                    onChange={(e) => setPlanDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border outline-none"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Learning Objectives
                </label>
                <textarea
                  rows={3}
                  value={planObjectives}
                  onChange={(e) => setPlanObjectives(e.target.value)}
                  placeholder="Students will be able to identify roots, factor trinomials, and verify solutions..."
                  className="w-full p-2.5 text-xs rounded-lg border outline-none"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                  required
                />
              </div>

              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Pedagogical Aids & Resources
                </label>
                <input
                  type="text"
                  value={planResources}
                  onChange={(e) => setPlanResources(e.target.value)}
                  placeholder="Textbook Ch. 4, Interactive Geogebra, Graph Worksheets"
                  className="w-full px-3 py-2 text-xs rounded-lg border outline-none"
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
                onClick={() => setCreateModalOpen(false)}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg border"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white rounded-lg shadow-sm"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Register Lesson Plan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
