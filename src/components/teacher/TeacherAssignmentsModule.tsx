import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  FileCheck,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Eye,
  Trash2,
  ChevronRight,
  ArrowLeft,
  Users,
  Award,
  BookOpen,
  Check,
  X,
} from 'lucide-react';
import { SchoolAssignment } from '../../types/school';

export const TeacherAssignmentsModule: React.FC = () => {
  const {
    assignments,
    sections,
    students,
    addAssignment,
    updateAssignment,
    addAuditLog,
  } = useSchoolData();

  // Demo teacher is Ms. Sarah Henderson
  const teacherId = 'staff-henderson';
  const assignedSectionIds = ['sec-8a', 'sec-9b', 'sec-10a'];
  const mySections = sections.filter((s) => assignedSectionIds.includes(s.id));

  // Current view state: 'list' | 'create' | 'details' | 'edit'
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'details' | 'edit'>('list');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'closed'>('all');

  // Form state for Create / Edit
  const [formTitle, setFormTitle] = useState('');
  const [formInstructions, setFormInstructions] = useState('');
  const [formSectionId, setFormSectionId] = useState(mySections[0]?.id || 'sec-9b');
  const [formType, setFormType] = useState<'Homework' | 'Project' | 'Quiz' | 'Lab Report' | 'Essay'>('Homework');
  const [formAssignedDate, setFormAssignedDate] = useState('2026-10-19');
  const [formDueDate, setFormDueDate] = useState('2026-10-26');
  const [formMaxMarks, setFormMaxMarks] = useState<number>(20);
  const [formStatus, setFormStatus] = useState<'draft' | 'published' | 'closed'>('published');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter assignments strictly for Ms. Henderson
  const myAssignments = assignments.filter((a) => a.teacherId === teacherId);

  const filteredAssignments = myAssignments.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subjectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSection = sectionFilter === 'all' || a.sectionId === sectionFilter;
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesSection && matchesStatus;
  });

  const selectedAssignment = myAssignments.find((a) => a.id === selectedAssignmentId);

  const handleOpenCreate = () => {
    setFormTitle('');
    setFormInstructions('');
    setFormSectionId(mySections[0]?.id || 'sec-9b');
    setFormType('Homework');
    setFormAssignedDate('2026-10-19');
    setFormDueDate('2026-10-26');
    setFormMaxMarks(20);
    setFormStatus('published');
    setFormErrors({});
    setViewMode('create');
  };

  const handleOpenEdit = (assign: SchoolAssignment) => {
    setSelectedAssignmentId(assign.id);
    setFormTitle(assign.title);
    setFormInstructions(assign.instructions);
    setFormSectionId(assign.sectionId);
    setFormType(assign.type);
    setFormAssignedDate(assign.assignedDate);
    setFormDueDate(assign.dueDate);
    setFormMaxMarks(assign.maxMarks);
    setFormStatus(assign.status);
    setFormErrors({});
    setViewMode('edit');
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formTitle.trim()) errors.title = 'Assignment title is required.';
    if (!formInstructions.trim()) errors.instructions = 'Instructions are required.';
    if (!formDueDate) errors.dueDate = 'Due date is required.';
    if (formDueDate < formAssignedDate) {
      errors.dueDate = 'Due date cannot be earlier than assigned date.';
    }
    if (formMaxMarks <= 0) errors.maxMarks = 'Maximum marks must be greater than 0.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const targetSec = mySections.find((s) => s.id === formSectionId);
    const newAssign: SchoolAssignment = {
      id: `assign-${Date.now()}`,
      title: formTitle.trim(),
      instructions: formInstructions.trim(),
      sectionId: formSectionId,
      sectionName: targetSec?.name || 'Class',
      classId: targetSec?.classId || 'class-9',
      className: targetSec?.className || 'Grade 9',
      subjectName: 'Mathematics',
      teacherId,
      teacherName: 'Ms. Sarah Henderson',
      type: formType,
      assignedDate: formAssignedDate,
      dueDate: formDueDate,
      maxMarks: Number(formMaxMarks),
      status: formStatus,
      submissionsCount: 0,
      totalStudents: 28,
      gradedCount: 0,
    };

    addAssignment(newAssign);
    addAuditLog({
      user: 'Ms. Sarah Henderson',
      action: 'Assignment Created',
      module: 'Assignments / Instruction',
      details: `"${newAssign.title}" dispatched for ${newAssign.sectionName} (${newAssign.type}, Max: ${newAssign.maxMarks} pts)`,
      severity: 'info',
    });

    setToastMessage(`Assignment "${newAssign.title}" successfully created and saved.`);
    setTimeout(() => setToastMessage(null), 3500);
    setViewMode('list');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !selectedAssignment) return;

    const targetSec = mySections.find((s) => s.id === formSectionId);
    updateAssignment(selectedAssignment.id, {
      title: formTitle.trim(),
      instructions: formInstructions.trim(),
      sectionId: formSectionId,
      sectionName: targetSec?.name || selectedAssignment.sectionName,
      type: formType,
      assignedDate: formAssignedDate,
      dueDate: formDueDate,
      maxMarks: Number(formMaxMarks),
      status: formStatus,
    });

    addAuditLog({
      user: 'Ms. Sarah Henderson',
      action: 'Assignment Updated',
      module: 'Assignments / Instruction',
      details: `Modified assignment "${formTitle}" for ${targetSec?.name}`,
      severity: 'info',
    });

    setToastMessage(`Assignment "${formTitle}" successfully updated.`);
    setTimeout(() => setToastMessage(null), 3500);
    setViewMode('list');
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
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
              Mathematics Department
            </span>
            <span className="text-xs text-slate-500">Coursework & Homework Dispatch</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Assignments Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create homework tasks, inspect submission quotas, grade student papers, and review rubrics.
          </p>
        </div>

        {viewMode === 'list' && (
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-all hover:opacity-95 shrink-0"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Plus className="w-4 h-4" />
            <span>Create Assignment</span>
          </button>
        )}

        {viewMode !== 'list' && (
          <button
            onClick={() => setViewMode('list')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900 shrink-0"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Assignments</span>
          </button>
        )}
      </div>

      {/* TOAST MESSAGE */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* VIEW: LIST */}
      {viewMode === 'list' && (
        <>
          {/* SEARCH & FILTERS */}
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
                placeholder="Search assignments by topic or keyword..."
                className="bg-transparent border-none outline-none text-xs w-full"
                style={{ color: 'var(--color-text)' }}
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
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
                    {sec.name}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 text-xs font-semibold rounded-lg border outline-none cursor-pointer"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* ASSIGNMENTS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAssignments.length === 0 ? (
              <div
                className="col-span-full py-12 text-center border rounded-2xl p-6"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <FileCheck className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                  No assignments found
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  No homework or coursework matches your active filter. Click "Create Assignment" to dispatch a new task.
                </p>
              </div>
            ) : (
              filteredAssignments.map((assign) => {
                const submissionRate =
                  assign.submissionsCount > 0
                    ? Math.round((assign.gradedCount / assign.submissionsCount) * 100)
                    : 0;

                return (
                  <div
                    key={assign.id}
                    className="p-5 rounded-2xl border shadow-xs transition-all hover:shadow-sm flex flex-col justify-between"
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
                          {assign.sectionName} · {assign.type}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            assign.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : assign.status === 'draft'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {assign.status}
                        </span>
                      </div>

                      <h3 className="text-base font-bold line-clamp-1" style={{ color: 'var(--color-text)' }}>
                        {assign.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {assign.instructions}
                      </p>

                      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t text-xs text-slate-500" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Due: <strong>{assign.dueDate}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-slate-400" />
                          <span>Max: <strong>{assign.maxMarks} Pts</strong></span>
                        </div>
                      </div>

                      {/* Submissions bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-slate-500">Grading Progress</span>
                          <span className="font-semibold" style={{ color: 'var(--color-text)' }}>
                            {assign.gradedCount} / {assign.submissionsCount} Graded
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${submissionRate}%`,
                              backgroundColor: 'var(--color-primary)',
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-5 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
                      <button
                        onClick={() => {
                          setSelectedAssignmentId(assign.id);
                          setViewMode('details');
                        }}
                        className="text-xs font-semibold flex items-center gap-1 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Papers</span>
                      </button>

                      <button
                        onClick={() => handleOpenEdit(assign)}
                        className="px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
                        style={{ borderColor: 'var(--color-border)' }}
                      >
                        <Edit3 className="w-3 h-3 text-slate-500" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* VIEW: CREATE OR EDIT FORM */}
      {(viewMode === 'create' || viewMode === 'edit') && (
        <form
          onSubmit={viewMode === 'create' ? handleSaveCreate : handleSaveEdit}
          className="p-6 rounded-2xl border shadow-xs space-y-5 max-w-2xl"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="border-b pb-3">
            <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
              {viewMode === 'create' ? 'Author New Assignment' : 'Edit Coursework Task'}
            </h2>
            <p className="text-xs text-slate-500">
              Only classes and subjects within your instructional allocation are permissible.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Assignment Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Chapter 4 Quadratic Equations Problem Set"
                className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                  formErrors.title ? 'border-rose-500' : ''
                }`}
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: formErrors.title ? undefined : 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
              {formErrors.title && <span className="text-rose-500 text-[11px] mt-0.5 block">{formErrors.title}</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Assigned Section <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formSectionId}
                  onChange={(e) => setFormSectionId(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-lg border outline-none cursor-pointer"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                >
                  {mySections.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.name} ({sec.className})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Assignment Category
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-lg border outline-none cursor-pointer"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                >
                  <option value="Homework">Homework</option>
                  <option value="Project">Project</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Lab Report">Lab Report</option>
                  <option value="Essay">Essay</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Assigned Date
                </label>
                <input
                  type="date"
                  value={formAssignedDate}
                  onChange={(e) => setFormAssignedDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-lg border outline-none"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Due Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={formDueDate}
                  onChange={(e) => setFormDueDate(e.target.value)}
                  className={`w-full px-3 py-2 text-xs font-semibold rounded-lg border outline-none ${
                    formErrors.dueDate ? 'border-rose-500' : ''
                  }`}
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: formErrors.dueDate ? undefined : 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
                {formErrors.dueDate && <span className="text-rose-500 text-[11px] mt-0.5 block">{formErrors.dueDate}</span>}
              </div>

              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Maximum Marks
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={formMaxMarks}
                  onChange={(e) => setFormMaxMarks(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-lg border outline-none"
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
                Instructions & Rubric Guidelines <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={formInstructions}
                onChange={(e) => setFormInstructions(e.target.value)}
                placeholder="Detail the problem exercises, submission formatting, and grading expectations..."
                className={`w-full p-2.5 text-xs rounded-lg border outline-none ${
                  formErrors.instructions ? 'border-rose-500' : ''
                }`}
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: formErrors.instructions ? undefined : 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
              {formErrors.instructions && <span className="text-rose-500 text-[11px] mt-0.5 block">{formErrors.instructions}</span>}
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Publication Status
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="pubStatus"
                    value="published"
                    checked={formStatus === 'published'}
                    onChange={() => setFormStatus('published')}
                  />
                  <span>Published (Visible to students)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="pubStatus"
                    value="draft"
                    checked={formStatus === 'draft'}
                    onChange={() => setFormStatus('draft')}
                  />
                  <span>Save as Draft</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="px-4 py-2 text-xs font-semibold rounded-xl border"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white rounded-xl shadow-sm"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {viewMode === 'create' ? 'Save & Dispatch Assignment' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      {/* VIEW: DETAILS / SUBMISSION DESK */}
      {viewMode === 'details' && selectedAssignment && (
        <div className="space-y-6">
          <div
            className="p-6 rounded-2xl border shadow-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <span
                  className="px-2.5 py-0.5 rounded text-[10px] font-bold border"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-primary)',
                  }}
                >
                  {selectedAssignment.sectionName} · {selectedAssignment.type}
                </span>
                <h2 className="text-xl font-bold mt-1.5" style={{ color: 'var(--color-text)' }}>
                  {selectedAssignment.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>Assigned: <strong>{selectedAssignment.assignedDate}</strong></span>
                  <span>·</span>
                  <span>Due: <strong>{selectedAssignment.dueDate}</strong></span>
                  <span>·</span>
                  <span>Max Marks: <strong>{selectedAssignment.maxMarks} pts</strong></span>
                </div>
              </div>

              <button
                onClick={() => handleOpenEdit(selectedAssignment)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 shrink-0"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit Assignment</span>
              </button>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Instructions & Rubric
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {selectedAssignment.instructions}
              </p>
            </div>
          </div>

          {/* SIMULATED SUBMISSION ROSTER */}
          <div
            className="rounded-2xl border shadow-xs overflow-hidden"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                Student Submission Ledger ({selectedAssignment.sectionName})
              </h3>
              <span className="text-xs text-slate-500">
                {selectedAssignment.gradedCount} of {selectedAssignment.submissionsCount} submissions graded
              </span>
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
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Student Name</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Status</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Score (Max: {selectedAssignment.maxMarks})</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                  {students
                    .filter((s) => s.sectionId === selectedAssignment.sectionId)
                    .slice(0, 10)
                    .map((st, idx) => {
                      const isGraded = idx < selectedAssignment.gradedCount;
                      const score = isGraded ? Math.round(selectedAssignment.maxMarks * (0.8 + (idx % 3) * 0.08)) : '-';
                      return (
                        <tr key={st.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                          <td className="py-2.5 px-4 font-mono">{`0${idx + 1}`.slice(-2)}</td>
                          <td className="py-2.5 px-4 font-semibold" style={{ color: 'var(--color-text)' }}>
                            {st.name}
                          </td>
                          <td className="py-2.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isGraded
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              }`}
                            >
                              {isGraded ? 'Graded' : 'Awaiting Review'}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 font-mono font-semibold" style={{ color: 'var(--color-primary)' }}>
                            {score}
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <button className="text-[11px] font-bold text-indigo-600 hover:underline">
                              {isGraded ? 'Review Paper' : 'Grade Submission'}
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
    </div>
  );
};
