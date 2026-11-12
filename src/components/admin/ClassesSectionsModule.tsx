import React, { useState, useMemo } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { usePermissions } from '../../context/PermissionContext';
import { ClassGrade, Section } from '../../types/school';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Users,
  Edit2,
  Archive,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  X,
  DoorOpen,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';

export const ClassesSectionsModule: React.FC = () => {
  const {
    classes,
    sections,
    students,
    staff,
    addClass,
    updateClass,
    archiveClass,
    addSection,
    updateSection,
    archiveSection,
    schoolProfile,
  } = useSchoolData();

  const { hasPermission } = usePermissions();

  const canCreateClass = hasPermission('students.create');
  const canEditClass = hasPermission('students.edit');
  const canArchiveClass = hasPermission('students.archive');

  // Search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'active' | 'archived' | 'all'>('active');
  const [expandedClassId, setExpandedClassId] = useState<string | null>(null);

  // Modals state
  const [addClassModalOpen, setAddClassModalOpen] = useState(false);
  const [editClassTarget, setEditClassTarget] = useState<ClassGrade | null>(null);
  const [archiveClassTarget, setArchiveClassTarget] = useState<ClassGrade | null>(null);

  const [addSectionModalOpen, setAddSectionModalOpen] = useState(false);
  const [addSectionParentClassId, setAddSectionParentClassId] = useState<string>('');
  const [editSectionTarget, setEditSectionTarget] = useState<Section | null>(null);
  const [archiveSectionTarget, setArchiveSectionTarget] = useState<Section | null>(null);

  // View enrolled students modal
  const [rosterSection, setRosterSection] = useState<Section | null>(null);

  // Feedback toast / error
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [bannerSuccess, setBannerSuccess] = useState<string | null>(null);

  const showNotification = (successMsg?: string, errorMsg?: string) => {
    if (successMsg) {
      setBannerSuccess(successMsg);
      setBannerError(null);
      setTimeout(() => setBannerSuccess(null), 4000);
    }
    if (errorMsg) {
      setBannerError(errorMsg);
      setBannerSuccess(null);
    }
  };

  // Filter classes
  const filteredClasses = useMemo(() => {
    return classes.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [classes, searchTerm, statusFilter]);

  // Active staff for teacher assignments
  const activeStaff = useMemo(() => staff.filter((s) => s.status === 'active'), [staff]);

  // Handle Class Creation
  const handleSaveClass = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('className') as HTMLInputElement).value;
    const description = (form.elements.namedItem('classDesc') as HTMLInputElement).value;

    const result = addClass({
      name,
      description,
      academicYearId: schoolProfile.currentAcademicYear,
    });

    if (result.isValid) {
      showNotification(`Class "${name}" successfully created.`);
      setAddClassModalOpen(false);
    } else {
      showNotification(undefined, result.message);
    }
  };

  // Handle Class Update
  const handleUpdateClass = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editClassTarget) return;
    const form = e.currentTarget;
    const name = (form.elements.namedItem('editClassName') as HTMLInputElement).value;
    const description = (form.elements.namedItem('editClassDesc') as HTMLInputElement).value;

    const result = updateClass(editClassTarget.id, {
      name,
      description,
    });

    if (result.isValid) {
      showNotification(`Class "${name}" updated.`);
      setEditClassTarget(null);
    } else {
      showNotification(undefined, result.message);
    }
  };

  // Handle Class Archival
  const handleConfirmArchiveClass = () => {
    if (!archiveClassTarget) return;
    const result = archiveClass(archiveClassTarget.id);
    if (result.isValid) {
      showNotification(`Class "${archiveClassTarget.name}" archived.`);
      setArchiveClassTarget(null);
    } else {
      showNotification(undefined, result.message);
    }
  };

  // Handle Section Creation
  const handleSaveSection = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('sectionName') as HTMLInputElement).value;
    const classId = (form.elements.namedItem('classId') as HTMLSelectElement).value;
    const teacherId = (form.elements.namedItem('teacherId') as HTMLSelectElement).value;
    const capacity = parseInt((form.elements.namedItem('capacity') as HTMLInputElement).value, 10);
    const room = (form.elements.namedItem('room') as HTMLInputElement).value;

    const result = addSection({
      name,
      classId,
      classTeacherId: teacherId || undefined,
      capacity: capacity || 30,
      room: room || 'Standard Room',
      academicYearId: schoolProfile.currentAcademicYear,
    });

    if (result.isValid) {
      showNotification(`Section "${name}" added to cohort.`);
      setAddSectionModalOpen(false);
    } else {
      showNotification(undefined, result.message);
    }
  };

  // Handle Section Update
  const handleUpdateSection = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editSectionTarget) return;
    const form = e.currentTarget;
    const name = (form.elements.namedItem('editSecName') as HTMLInputElement).value;
    const teacherId = (form.elements.namedItem('editTeacherId') as HTMLSelectElement).value;
    const capacity = parseInt((form.elements.namedItem('editCapacity') as HTMLInputElement).value, 10);
    const room = (form.elements.namedItem('editRoom') as HTMLInputElement).value;

    const result = updateSection(editSectionTarget.id, {
      name,
      classTeacherId: teacherId || undefined,
      capacity: capacity || 30,
      room: room || 'Standard Room',
    });

    if (result.isValid) {
      showNotification(`Section "${name}" updated.`);
      setEditSectionTarget(null);
    } else {
      showNotification(undefined, result.message);
    }
  };

  // Handle Section Archival
  const handleConfirmArchiveSection = () => {
    if (!archiveSectionTarget) return;
    const result = archiveSection(archiveSectionTarget.id);
    if (result.isValid) {
      showNotification(`Section "${archiveSectionTarget.name}" archived.`);
      setArchiveSectionTarget(null);
    } else {
      showNotification(undefined, result.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner Feedback */}
      {bannerSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{bannerSuccess}</span>
          </div>
          <button onClick={() => setBannerSuccess(null)} className="p-1 hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {bannerError && (
        <div className="p-3.5 rounded-xl bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">{bannerError}</span>
          </div>
          <button onClick={() => setBannerError(null)} className="p-1 hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Classes & Sections Architecture
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure academic grade cohorts, division sections, room capacities, and assigned class teachers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canCreateClass && (
            <>
              <button
                onClick={() => setAddClassModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg shadow-xs hover:opacity-95"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Class</span>
              </button>

              <button
                onClick={() => {
                  setAddSectionParentClassId(classes[0]?.id || '');
                  setAddSectionModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border hover:opacity-90"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                <Plus className="w-3.5 h-3.5 text-slate-400" />
                <span>Add Section</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div
        className="p-3 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border w-full sm:w-64"
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: 'var(--color-border)',
            }}
          >
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search classes or descriptions..."
              className="bg-transparent border-none outline-none text-xs w-full"
              style={{ color: 'var(--color-text)' }}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-600">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-slate-400 text-[11px] font-medium">Status:</span>
          <div className="flex items-center gap-1 p-0.5 rounded border" style={{ borderColor: 'var(--color-border)' }}>
            {(['active', 'archived', 'all'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded capitalize text-[11px] font-medium transition-colors ${
                  statusFilter === st ? 'font-bold shadow-xs' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: statusFilter === st ? 'var(--color-background)' : 'transparent',
                  color: 'var(--color-text)',
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Class List & Accordion Sections */}
      <div className="space-y-3">
        {filteredClasses.length === 0 ? (
          <div
            className="p-12 text-center rounded-xl border text-slate-400 text-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-700 dark:text-slate-200">No classes found</p>
            <p className="text-slate-500 mt-1">Try adjusting your search criteria or create a new class.</p>
          </div>
        ) : (
          filteredClasses.map((cls) => {
            const classSections = sections.filter((s) => s.classId === cls.id);
            const isExpanded = expandedClassId === cls.id;
            const totalEnrolled = students.filter(
              (st) => st.classId === cls.id && st.enrollmentStatus === 'active'
            ).length;

            return (
              <div
                key={cls.id}
                className="rounded-xl border shadow-xs overflow-hidden transition-all"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                {/* Class Row Header */}
                <div
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer hover:bg-black/[0.015] dark:hover:bg-white/[0.015] transition-colors"
                  onClick={() => setExpandedClassId(isExpanded ? null : cls.id)}
                >
                  <div className="flex items-center gap-3">
                    <button
                      className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-transform"
                      aria-label="Toggle section list"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base" style={{ color: 'var(--color-text)' }}>
                          {cls.name}
                        </span>
                        <span
                          className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase border ${
                            cls.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                              : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {cls.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{cls.description || 'General grade level'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs shrink-0" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-3 text-slate-500 font-mono">
                      <span>
                        <strong style={{ color: 'var(--color-text)' }}>{classSections.length}</strong> Sections
                      </span>
                      <span>·</span>
                      <span>
                        <strong style={{ color: 'var(--color-text)' }}>{totalEnrolled}</strong> Students
                      </span>
                    </div>

                    {/* Class Action Buttons */}
                    <div className="flex items-center gap-1">
                      {canCreateClass && cls.status === 'active' && (
                        <button
                          onClick={() => {
                            setAddSectionParentClassId(cls.id);
                            setAddSectionModalOpen(true);
                          }}
                          className="px-2.5 py-1 text-[11px] font-medium rounded border hover:opacity-90 flex items-center gap-1"
                          style={{
                            backgroundColor: 'var(--color-background)',
                            borderColor: 'var(--color-border)',
                            color: 'var(--color-text)',
                          }}
                          title="Add Section to this class"
                        >
                          <Plus className="w-3 h-3" />
                          <span className="hidden sm:inline">Add Section</span>
                        </button>
                      )}

                      {canEditClass && (
                        <button
                          onClick={() => setEditClassTarget(cls)}
                          className="p-1.5 rounded border hover:opacity-85"
                          style={{
                            borderColor: 'var(--color-border)',
                            color: 'var(--color-text)',
                          }}
                          title="Edit Class details"
                        >
                          <Edit2 className="w-3 h-3 text-slate-400" />
                        </button>
                      )}

                      {canArchiveClass && cls.status === 'active' && (
                        <button
                          onClick={() => setArchiveClassTarget(cls)}
                          className="p-1.5 rounded border hover:bg-rose-50 text-rose-600 hover:border-rose-200"
                          style={{ borderColor: 'var(--color-border)' }}
                          title="Archive Class"
                        >
                          <Archive className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Sections Grid / Table */}
                {isExpanded && (
                  <div
                    className="border-t p-4"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                        Sections in {cls.name}
                      </span>
                      {canCreateClass && cls.status === 'active' && (
                        <button
                          onClick={() => {
                            setAddSectionParentClassId(cls.id);
                            setAddSectionModalOpen(true);
                          }}
                          className="text-[11px] font-bold flex items-center gap-1 hover:underline"
                          style={{ color: 'var(--color-primary)' }}
                        >
                          <Plus className="w-3 h-3" />
                          <span>Create New Section</span>
                        </button>
                      )}
                    </div>

                    {classSections.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">
                        No sections created yet for {cls.name}. Click "Add Section" to create Section A.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {classSections.map((sec) => {
                          const secStudents = students.filter(
                            (st) => st.sectionId === sec.id && st.enrollmentStatus === 'active'
                          );
                          const capPercent = Math.round((secStudents.length / sec.capacity) * 100);

                          return (
                            <div
                              key={sec.id}
                              className="p-3.5 rounded-lg border shadow-xs transition-colors flex flex-col justify-between"
                              style={{
                                backgroundColor: 'var(--color-surface)',
                                borderColor: 'var(--color-border)',
                              }}
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <h4 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                                        {sec.name}
                                      </h4>
                                      <span
                                        className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                          sec.status === 'active'
                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                            : 'bg-slate-200 text-slate-600'
                                        }`}
                                      >
                                        {sec.status}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                                      <DoorOpen className="w-3 h-3" />
                                      <span>{sec.room || 'Room TBD'}</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    {canEditClass && (
                                      <button
                                        onClick={() => setEditSectionTarget(sec)}
                                        className="p-1 rounded hover:bg-black/5 text-slate-400 hover:text-slate-700"
                                        title="Edit Section"
                                      >
                                        <Edit2 className="w-3 h-3" />
                                      </button>
                                    )}
                                    {canArchiveClass && sec.status === 'active' && (
                                      <button
                                        onClick={() => setArchiveSectionTarget(sec)}
                                        className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                                        title="Archive Section"
                                      >
                                        <Archive className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Class Teacher Assignment */}
                                <div
                                  className="p-2 rounded border mb-3 text-xs"
                                  style={{
                                    backgroundColor: 'var(--color-background)',
                                    borderColor: 'var(--color-border)',
                                  }}
                                >
                                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase font-semibold">
                                    <UserCheck className="w-3 h-3" />
                                    <span>Class Teacher</span>
                                  </div>
                                  <div className="font-bold text-xs truncate mt-0.5" style={{ color: 'var(--color-text)' }}>
                                    {sec.classTeacherName || (
                                      <span className="text-amber-600 font-normal italic">Unassigned (Click Edit)</span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div>
                                {/* Capacity Pacing Bar */}
                                <div className="space-y-1 mb-3">
                                  <div className="flex justify-between text-[11px] font-mono">
                                    <span className="text-slate-400">Roster Capacity</span>
                                    <span className="font-bold" style={{ color: 'var(--color-text)' }}>
                                      {secStudents.length} / {sec.capacity} ({capPercent}%)
                                    </span>
                                  </div>
                                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all ${
                                        capPercent >= 90 ? 'bg-amber-500' : 'bg-emerald-500'
                                      }`}
                                      style={{ width: `${Math.min(capPercent, 100)}%` }}
                                    />
                                  </div>
                                </div>

                                <button
                                  onClick={() => setRosterSection(sec)}
                                  className="w-full py-1.5 px-2.5 rounded text-[11px] font-semibold border flex items-center justify-center gap-1 hover:opacity-90"
                                  style={{
                                    backgroundColor: 'var(--color-surface)',
                                    borderColor: 'var(--color-border)',
                                    color: 'var(--color-primary)',
                                  }}
                                >
                                  <Users className="w-3 h-3" />
                                  <span>View Enrolled Students ({secStudents.length})</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* MODAL: ADD CLASS */}
      {addClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleSaveClass}
            className="w-full max-w-md rounded-xl border p-6 shadow-xl space-y-4 text-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  Create Academic Class
                </h3>
              </div>
              <button type="button" onClick={() => setAddClassModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Class / Grade Name *
              </label>
              <input
                name="className"
                type="text"
                required
                placeholder="e.g. Grade 5, Grade 7"
                className="w-full px-3 py-2 text-xs rounded border outline-none"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Cohort Description / Focus
              </label>
              <textarea
                name="classDesc"
                rows={2}
                placeholder="e.g. Primary Foundation Upper Cohort"
                className="w-full px-3 py-2 text-xs rounded border outline-none resize-none"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            <div className="pt-3 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => setAddClassModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border text-slate-500 font-medium"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 font-bold text-white rounded-lg shadow-xs hover:opacity-95"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Create Class
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: EDIT CLASS */}
      {editClassTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleUpdateClass}
            className="w-full max-w-md rounded-xl border p-6 shadow-xl space-y-4 text-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  Edit Class: {editClassTarget.name}
                </h3>
              </div>
              <button type="button" onClick={() => setEditClassTarget(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Class / Grade Name *
              </label>
              <input
                name="editClassName"
                defaultValue={editClassTarget.name}
                type="text"
                required
                className="w-full px-3 py-2 text-xs rounded border outline-none"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Cohort Description
              </label>
              <textarea
                name="editClassDesc"
                defaultValue={editClassTarget.description}
                rows={2}
                className="w-full px-3 py-2 text-xs rounded border outline-none resize-none"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            <div className="pt-3 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => setEditClassTarget(null)}
                className="px-3 py-1.5 rounded-lg border text-slate-500 font-medium"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 font-bold text-white rounded-lg shadow-xs hover:opacity-95"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ARCHIVE CLASS SAFEGUARD */}
      {archiveClassTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-md rounded-xl border p-6 shadow-xl space-y-4 text-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center gap-3 text-rose-600">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  Archive Class: {archiveClassTarget.name}?
                </h3>
                <p className="text-slate-500 text-xs">Integrity and safeguard verification</p>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Archiving this class will retire it from new enrollment pickers. SCHLAR safeguards prohibit archiving if active students are enrolled.
            </p>

            <div className="pt-3 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => setArchiveClassTarget(null)}
                className="px-3 py-1.5 rounded-lg border text-slate-500 font-medium"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmArchiveClass}
                className="px-4 py-1.5 font-bold text-white rounded-lg bg-rose-600 shadow-xs hover:bg-rose-700"
              >
                Confirm Archival
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD SECTION */}
      {addSectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleSaveSection}
            className="w-full max-w-md rounded-xl border p-6 shadow-xl space-y-4 text-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  Create Cohort Section
                </h3>
              </div>
              <button type="button" onClick={() => setAddSectionModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Parent Class *
              </label>
              <select
                name="classId"
                defaultValue={addSectionParentClassId}
                required
                className="w-full px-3 py-2 text-xs rounded border outline-none"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                {classes
                  .filter((c) => c.status === 'active')
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Section Name *
              </label>
              <input
                name="sectionName"
                type="text"
                required
                placeholder="e.g. Section A, Section B"
                className="w-full px-3 py-2 text-xs rounded border outline-none"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Assign Class Teacher
              </label>
              <select
                name="teacherId"
                className="w-full px-3 py-2 text-xs rounded border outline-none"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                <option value="">-- None (Assign Later) --</option>
                {activeStaff.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.department})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Capacity (Students)
                </label>
                <input
                  name="capacity"
                  type="number"
                  defaultValue={30}
                  min={1}
                  max={60}
                  className="w-full px-3 py-2 text-xs rounded border outline-none font-mono"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Room Assignment
                </label>
                <input
                  name="room"
                  type="text"
                  defaultValue="Room 201"
                  className="w-full px-3 py-2 text-xs rounded border outline-none"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>
            </div>

            <div className="pt-3 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => setAddSectionModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border text-slate-500 font-medium"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 font-bold text-white rounded-lg shadow-xs hover:opacity-95"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Create Section
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: EDIT SECTION */}
      {editSectionTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleUpdateSection}
            className="w-full max-w-md rounded-xl border p-6 shadow-xl space-y-4 text-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  Edit Section: {editSectionTarget.name}
                </h3>
              </div>
              <button type="button" onClick={() => setEditSectionTarget(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Section Name *
              </label>
              <input
                name="editSecName"
                defaultValue={editSectionTarget.name}
                type="text"
                required
                className="w-full px-3 py-2 text-xs rounded border outline-none"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Class Teacher
              </label>
              <select
                name="editTeacherId"
                defaultValue={editSectionTarget.classTeacherId || ''}
                className="w-full px-3 py-2 text-xs rounded border outline-none"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                <option value="">-- None (Unassigned) --</option>
                {activeStaff.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.department})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Capacity (Students)
                </label>
                <input
                  name="editCapacity"
                  type="number"
                  defaultValue={editSectionTarget.capacity}
                  min={1}
                  max={60}
                  className="w-full px-3 py-2 text-xs rounded border outline-none font-mono"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Room Assignment
                </label>
                <input
                  name="editRoom"
                  type="text"
                  defaultValue={editSectionTarget.room}
                  className="w-full px-3 py-2 text-xs rounded border outline-none"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>
            </div>

            <div className="pt-3 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => setEditSectionTarget(null)}
                className="px-3 py-1.5 rounded-lg border text-slate-500 font-medium"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 font-bold text-white rounded-lg shadow-xs hover:opacity-95"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ARCHIVE SECTION SAFEGUARD */}
      {archiveSectionTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-md rounded-xl border p-6 shadow-xl space-y-4 text-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center gap-3 text-rose-600">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  Archive {archiveSectionTarget.className} · {archiveSectionTarget.name}?
                </h3>
                <p className="text-slate-500 text-xs">Section Archival Verification</p>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Archiving this section will prevent new timetable slots and attendance roll calls. The system requires that any active students be reassigned before archival completes.
            </p>

            <div className="pt-3 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => setArchiveSectionTarget(null)}
                className="px-3 py-1.5 rounded-lg border text-slate-500 font-medium"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmArchiveSection}
                className="px-4 py-1.5 font-bold text-white rounded-lg bg-rose-600 shadow-xs hover:bg-rose-700"
              >
                Confirm Archival
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW ENROLLED STUDENTS ROSTER */}
      {rosterSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-2xl rounded-xl border shadow-xl flex flex-col max-h-[85vh] text-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  {rosterSection.className} · {rosterSection.name} Student Roster
                </h3>
                <p className="text-slate-500 text-xs">
                  Class Teacher: {rosterSection.classTeacherName || 'Unassigned'} · Room: {rosterSection.room}
                </p>
              </div>
              <button onClick={() => setRosterSection(null)} className="p-1 hover:opacity-75">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-4">
              {(() => {
                const secStudents = students.filter(
                  (st) => st.sectionId === rosterSection.id && st.enrollmentStatus === 'active'
                );

                if (secStudents.length === 0) {
                  return (
                    <div className="py-8 text-center text-slate-400">
                      No active students currently enrolled in this section.
                    </div>
                  );
                }

                return (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr
                        className="border-b"
                        style={{
                          backgroundColor: 'var(--color-background)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        <th className="py-2 px-3 font-semibold text-[10px] uppercase">Adm No</th>
                        <th className="py-2 px-3 font-semibold text-[10px] uppercase">Student Name</th>
                        <th className="py-2 px-3 font-semibold text-[10px] uppercase">Gender</th>
                        <th className="py-2 px-3 font-semibold text-[10px] uppercase">Guardian</th>
                        <th className="py-2 px-3 font-semibold text-[10px] uppercase text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                      {secStudents.map((st) => (
                        <tr key={st.id} className="hover:bg-black/[0.02]">
                          <td className="py-2.5 px-3 font-mono text-slate-500">{st.admissionNo}</td>
                          <td className="py-2.5 px-3 font-semibold" style={{ color: 'var(--color-text)' }}>
                            {st.name}
                          </td>
                          <td className="py-2.5 px-3 text-slate-500">{st.gender}</td>
                          <td className="py-2.5 px-3 text-slate-500">{st.guardianName} ({st.guardianRelationship})</td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}
            </div>

            <div className="p-3 border-t flex justify-end" style={{ borderColor: 'var(--color-border)' }}>
              <button
                onClick={() => setRosterSection(null)}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg border text-slate-600"
                style={{ borderColor: 'var(--color-border)' }}
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
