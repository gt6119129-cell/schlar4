import React, { useState, useMemo } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { usePermissions } from '../../context/PermissionContext';
import { Student, Guardian } from '../../types/school';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  ArrowUpDown,
  MoreVertical,
  Edit2,
  Archive,
  Eye,
  X,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Clock,
  BookOpen,
  MapPin,
  HeartHandshake,
  ShieldAlert,
  RotateCcw,
} from 'lucide-react';

export const StudentsGuardiansModule: React.FC = () => {
  const {
    students,
    guardians,
    classes,
    sections,
    attendance,
    timetable,
    addStudent,
    updateStudent,
    archiveStudent,
    restoreStudent,
    addGuardian,
    updateGuardian,
    schoolProfile,
  } = useSchoolData();

  const { hasPermission } = usePermissions();

  const canCreateStudent = hasPermission('students.create');
  const canEditStudent = hasPermission('students.edit');
  const canArchiveStudent = hasPermission('students.archive');

  // Active sub-tab: 'students' or 'guardians'
  const [activeSubTab, setActiveSubTab] = useState<'students' | 'guardians'>('students');

  // Search & Filter state for students
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [selectedSectionFilter, setSelectedSectionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [sortBy, setSortBy] = useState<'name' | 'admissionNo' | 'date'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals & Drawers state
  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [editStudentTarget, setEditStudentTarget] = useState<Student | null>(null);
  const [profileStudent, setProfileStudent] = useState<Student | null>(null);
  const [archiveStudentTarget, setArchiveStudentTarget] = useState<Student | null>(null);

  // Guardian search & modals
  const [guardianSearchTerm, setGuardianSearchTerm] = useState('');
  const [editGuardianTarget, setEditGuardianTarget] = useState<Guardian | null>(null);

  // Banner notification
  const [bannerSuccess, setBannerSuccess] = useState<string | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(null);

  const showNotification = (success?: string, error?: string) => {
    if (success) {
      setBannerSuccess(success);
      setBannerError(null);
      setTimeout(() => setBannerSuccess(null), 4000);
    }
    if (error) {
      setBannerError(error);
      setBannerSuccess(null);
    }
  };

  // Filtered & Sorted Students
  const filteredStudents = useMemo(() => {
    return students
      .filter((st) => {
        const matchesSearch =
          st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          st.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          st.guardianName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass = selectedClassFilter === 'all' || st.classId === selectedClassFilter;
        const matchesSection = selectedSectionFilter === 'all' || st.sectionId === selectedSectionFilter;
        const matchesStatus = statusFilter === 'all' || st.enrollmentStatus === statusFilter;
        return matchesSearch && matchesClass && matchesSection && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else if (sortBy === 'admissionNo') {
          return sortOrder === 'asc'
            ? a.admissionNo.localeCompare(b.admissionNo)
            : b.admissionNo.localeCompare(a.admissionNo);
        } else {
          return sortOrder === 'asc'
            ? a.admissionDate.localeCompare(b.admissionDate)
            : b.admissionDate.localeCompare(a.admissionDate);
        }
      });
  }, [students, searchTerm, selectedClassFilter, selectedSectionFilter, statusFilter, sortBy, sortOrder]);

  // Filtered Guardians
  const filteredGuardians = useMemo(() => {
    return guardians.filter((g) => {
      const match =
        g.name.toLowerCase().includes(guardianSearchTerm.toLowerCase()) ||
        g.email.toLowerCase().includes(guardianSearchTerm.toLowerCase()) ||
        g.phone.includes(guardianSearchTerm);
      return match;
    });
  }, [guardians, guardianSearchTerm]);

  // Dynamic sections available when filtering or creating
  const activeClasses = useMemo(() => classes.filter((c) => c.status === 'active'), [classes]);
  const activeSections = useMemo(() => sections.filter((s) => s.status === 'active'), [sections]);

  // Form state for Add Student
  const [formClassId, setFormClassId] = useState<string>(activeClasses[0]?.id || '');
  const [guardianLinkType, setGuardianLinkType] = useState<'existing' | 'new'>('existing');
  const [selectedGuardianId, setSelectedGuardianId] = useState<string>(guardians[0]?.id || '');

  // Sections matching selected formClassId
  const availableFormSections = useMemo(
    () => activeSections.filter((s) => s.classId === formClassId),
    [activeSections, formClassId]
  );

  // Handle Add Student Submit
  const handleSaveStudent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('studentName') as HTMLInputElement).value;
    const admissionNo = (form.elements.namedItem('admissionNo') as HTMLInputElement).value;
    const dateOfBirth = (form.elements.namedItem('dob') as HTMLInputElement).value;
    const gender = (form.elements.namedItem('gender') as HTMLSelectElement).value as any;
    const sectionId = (form.elements.namedItem('sectionId') as HTMLSelectElement).value;

    let guardianId = '';
    let guardianName = '';
    let guardianRelationship = '';
    let guardianPhone = '';
    let guardianEmail = '';

    if (guardianLinkType === 'existing') {
      const matchedG = guardians.find((g) => g.id === selectedGuardianId);
      if (matchedG) {
        guardianId = matchedG.id;
        guardianName = matchedG.name;
        guardianRelationship = matchedG.relationship;
        guardianPhone = matchedG.phone;
        guardianEmail = matchedG.email;
      }
    } else {
      guardianName = (form.elements.namedItem('newGuardianName') as HTMLInputElement).value;
      guardianRelationship = (form.elements.namedItem('newGuardianRel') as HTMLInputElement).value;
      guardianPhone = (form.elements.namedItem('newGuardianPhone') as HTMLInputElement).value;
      guardianEmail = (form.elements.namedItem('newGuardianEmail') as HTMLInputElement).value;
    }

    const targetSection = sections.find((s) => s.id === sectionId);
    if (!targetSection) {
      showNotification(undefined, 'Selected section is invalid.');
      return;
    }

    const result = addStudent({
      name,
      admissionNo,
      dateOfBirth,
      gender,
      classId: formClassId,
      className: targetSection.className,
      sectionId,
      sectionName: targetSection.name,
      academicYearId: schoolProfile.currentAcademicYear,
      guardianId: guardianId || undefined as any,
      guardianName,
      guardianRelationship,
      guardianPhone,
      guardianEmail,
      enrollmentStatus: 'active',
      admissionDate: new Date().toISOString().split('T')[0],
    });

    if (result.isValid) {
      showNotification(`Student "${name}" successfully registered into ${targetSection.className} · ${targetSection.name}.`);
      setAddStudentModalOpen(false);
    } else {
      showNotification(undefined, result.message);
    }
  };

  // Handle Edit Student Submit
  const handleUpdateStudentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editStudentTarget) return;

    const form = e.currentTarget;
    const name = (form.elements.namedItem('editName') as HTMLInputElement).value;
    const admissionNo = (form.elements.namedItem('editAdmNo') as HTMLInputElement).value;
    const classId = (form.elements.namedItem('editClassId') as HTMLSelectElement).value;
    const sectionId = (form.elements.namedItem('editSectionId') as HTMLSelectElement).value;
    const status = (form.elements.namedItem('editStatus') as HTMLSelectElement).value as any;

    const result = updateStudent(editStudentTarget.id, {
      name,
      admissionNo,
      classId,
      sectionId,
      enrollmentStatus: status,
    });

    if (result.isValid) {
      showNotification(`Student record for "${name}" updated.`);
      setEditStudentTarget(null);
    } else {
      showNotification(undefined, result.message);
    }
  };

  // Handle Archive Student
  const handleConfirmArchiveStudent = () => {
    if (!archiveStudentTarget) return;
    const result = archiveStudent(archiveStudentTarget.id);
    if (result.isValid) {
      showNotification(`Student "${archiveStudentTarget.name}" marked as transferred / archived.`);
      setArchiveStudentTarget(null);
    } else {
      showNotification(undefined, result.message);
    }
  };

  // Handle Update Guardian
  const handleUpdateGuardianSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editGuardianTarget) return;

    const form = e.currentTarget;
    const name = (form.elements.namedItem('gName') as HTMLInputElement).value;
    const phone = (form.elements.namedItem('gPhone') as HTMLInputElement).value;
    const email = (form.elements.namedItem('gEmail') as HTMLInputElement).value;
    const address = (form.elements.namedItem('gAddress') as HTMLInputElement).value;

    updateGuardian(editGuardianTarget.id, {
      name,
      phone,
      email,
      address,
    });

    showNotification(`Guardian profile for "${name}" updated.`);
    setEditGuardianTarget(null);
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

      {/* Header and Sub-Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Students & Guardians Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Enrolled student roster, admission demographic archives, and separately modeled legal guardian linkages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub Tab Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-lg border text-xs" style={{ borderColor: 'var(--color-border)' }}>
            <button
              onClick={() => setActiveSubTab('students')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeSubTab === 'students' ? 'font-bold shadow-xs' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: activeSubTab === 'students' ? 'var(--color-background)' : 'transparent',
                color: 'var(--color-text)',
              }}
            >
              Students ({students.length})
            </button>
            <button
              onClick={() => setActiveSubTab('guardians')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeSubTab === 'guardians' ? 'font-bold shadow-xs' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: activeSubTab === 'guardians' ? 'var(--color-background)' : 'transparent',
                color: 'var(--color-text)',
              }}
            >
              Guardians ({guardians.length})
            </button>
          </div>

          {canCreateStudent && activeSubTab === 'students' && (
            <button
              onClick={() => {
                setFormClassId(activeClasses[0]?.id || '');
                setAddStudentModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg shadow-xs hover:opacity-95"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Enroll Student</span>
            </button>
          )}
        </div>
      </div>

      {activeSubTab === 'students' ? (
        /* STUDENTS DIRECTORY VIEW */
        <div className="space-y-4">
          {/* Search, Class, Section, and Status Filters */}
          <div
            className="p-3.5 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            {/* Search Input */}
            <div
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border w-full md:w-72"
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
                placeholder="Search name, adm #, guardian..."
                className="bg-transparent border-none outline-none text-xs w-full"
                style={{ color: 'var(--color-text)' }}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-600">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
              {/* Class Filter */}
              <select
                value={selectedClassFilter}
                onChange={(e) => {
                  setSelectedClassFilter(e.target.value);
                  setSelectedSectionFilter('all');
                }}
                className="px-2.5 py-1.5 rounded-lg border outline-none text-xs"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                <option value="all">All Classes</option>
                {activeClasses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Section Filter */}
              <select
                value={selectedSectionFilter}
                onChange={(e) => setSelectedSectionFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border outline-none text-xs"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                <option value="all">All Sections</option>
                {sections
                  .filter((s) => selectedClassFilter === 'all' || s.classId === selectedClassFilter)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.className} - {s.name}
                    </option>
                  ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border outline-none text-xs"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="transferred">Transferred / Archived</option>
                <option value="graduated">Graduated</option>
              </select>
            </div>
          </div>

          {/* Student Table */}
          <div
            className="rounded-xl border shadow-xs overflow-hidden"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            {filteredStudents.length === 0 ? (
              <div className="py-12 px-4 text-center text-xs text-slate-400">
                <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="font-semibold text-slate-700 dark:text-slate-200">No students match current filter</p>
                <p className="text-slate-500 mt-1">Try clearing filters or search parameters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
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
                      <th
                        className="py-3 px-4 font-semibold text-[10px] uppercase cursor-pointer hover:underline"
                        onClick={() => {
                          if (sortBy === 'admissionNo') {
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortBy('admissionNo');
                            setSortOrder('asc');
                          }
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <span>Adm No</span>
                          <ArrowUpDown className="w-3 h-3 opacity-60" />
                        </div>
                      </th>
                      <th
                        className="py-3 px-4 font-semibold text-[10px] uppercase cursor-pointer hover:underline"
                        onClick={() => {
                          if (sortBy === 'name') {
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortBy('name');
                            setSortOrder('asc');
                          }
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <span>Student Name</span>
                          <ArrowUpDown className="w-3 h-3 opacity-60" />
                        </div>
                      </th>
                      <th className="py-3 px-4 font-semibold text-[10px] uppercase">Class & Section</th>
                      <th className="py-3 px-4 font-semibold text-[10px] uppercase">Linked Guardian</th>
                      <th className="py-3 px-4 font-semibold text-[10px] uppercase">Status</th>
                      <th
                        className="py-3 px-4 font-semibold text-[10px] uppercase cursor-pointer hover:underline"
                        onClick={() => {
                          if (sortBy === 'date') {
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortBy('date');
                            setSortOrder('asc');
                          }
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <span>Admission Date</span>
                          <ArrowUpDown className="w-3 h-3 opacity-60" />
                        </div>
                      </th>
                      <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                    {filteredStudents.map((st) => (
                      <tr key={st.id} className="hover:bg-black/[0.015] dark:hover:bg-white/[0.015] transition-colors">
                        <td className="py-3 px-4 font-mono font-medium text-slate-500">
                          {st.admissionNo}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setProfileStudent(st)}
                            className="font-bold text-left hover:underline block"
                            style={{ color: 'var(--color-text)' }}
                          >
                            {st.name}
                          </button>
                          <span className="text-[11px] text-slate-400">DOB: {st.dateOfBirth} · {st.gender}</span>
                        </td>
                        <td className="py-3 px-4 font-medium" style={{ color: 'var(--color-text)' }}>
                          {st.className} · {st.sectionName}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold block" style={{ color: 'var(--color-text)' }}>
                            {st.guardianName}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {st.guardianRelationship} · {st.guardianPhone}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              st.enrollmentStatus === 'active'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {st.enrollmentStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                          {st.admissionDate}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setProfileStudent(st)}
                              className="p-1 rounded hover:opacity-80"
                              title="View Student Profile"
                              style={{ color: 'var(--color-primary)' }}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            {canEditStudent && (
                              <button
                                onClick={() => setEditStudentTarget(st)}
                                className="p-1 rounded text-slate-400 hover:text-slate-700"
                                title="Edit Student Record"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {canArchiveStudent && st.enrollmentStatus === 'active' && (
                              <button
                                onClick={() => setArchiveStudentTarget(st)}
                                className="p-1 rounded text-slate-400 hover:text-rose-600"
                                title="Archive / Transfer Student"
                              >
                                <Archive className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {canArchiveStudent && st.enrollmentStatus !== 'active' && (
                              <button
                                onClick={() => {
                                  const res = restoreStudent(st.id);
                                  if (res.isValid) {
                                    showNotification(`Student "${st.name}" restored to active status.`);
                                  } else {
                                    showNotification(undefined, res.message);
                                  }
                                }}
                                className="p-1 rounded text-emerald-600 hover:text-emerald-700"
                                title="Restore / Reactivate Student"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* GUARDIANS DIRECTORY VIEW */
        <div className="space-y-4">
          <div
            className="p-3.5 rounded-xl border flex items-center justify-between text-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border w-full sm:w-80"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
              }}
            >
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={guardianSearchTerm}
                onChange={(e) => setGuardianSearchTerm(e.target.value)}
                placeholder="Search guardian name, phone, email..."
                className="bg-transparent border-none outline-none text-xs w-full"
                style={{ color: 'var(--color-text)' }}
              />
            </div>

            <div className="text-slate-500 font-mono text-[11px]">
              Showing {filteredGuardians.length} Registered Guardians
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredGuardians.map((g) => {
              const children = students.filter((s) => s.guardianId === g.id || g.linkedStudentIds.includes(s.id));

              return (
                <div
                  key={g.id}
                  className="p-4 rounded-xl border shadow-xs transition-colors flex flex-col justify-between"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                          {g.name}
                        </h4>
                        <span className="text-[11px] text-slate-500 font-medium">{g.relationship}</span>
                      </div>
                      <button
                        onClick={() => setEditGuardianTarget(g)}
                        className="p-1 rounded text-slate-400 hover:text-slate-700"
                        title="Edit Guardian Contact"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1 text-xs text-slate-500 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{g.phone || 'No phone recorded'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{g.email || 'No email recorded'}</span>
                      </div>
                      {g.address && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{g.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Linked Children Badges */}
                  <div
                    className="p-2.5 rounded-lg border text-xs"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                    }}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Linked Children ({children.length})
                    </div>
                    {children.length === 0 ? (
                      <span className="text-[11px] text-slate-400 italic">No students linked currently</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => setProfileStudent(child)}
                            className="px-2 py-0.5 rounded text-[11px] font-semibold border hover:underline"
                            style={{
                              backgroundColor: 'var(--color-surface)',
                              borderColor: 'var(--color-border)',
                              color: 'var(--color-primary)',
                            }}
                          >
                            {child.name} ({child.className})
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: ADD STUDENT */}
      {addStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleSaveStudent}
            className="w-full max-w-xl rounded-xl border p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto text-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  Enroll New Student Record
                </h3>
              </div>
              <button type="button" onClick={() => setAddStudentModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Section 1: Student Information */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                1. Student Identity & Cohort
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                    Student Full Name *
                  </label>
                  <input
                    name="studentName"
                    type="text"
                    required
                    placeholder="e.g. Julian Henderson"
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
                    Admission Number * (Unique)
                  </label>
                  <input
                    name="admissionNo"
                    type="text"
                    required
                    defaultValue={`SCH-2026-${Math.floor(1000 + Math.random() * 9000)}`}
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
                    Date of Birth *
                  </label>
                  <input
                    name="dob"
                    type="date"
                    required
                    defaultValue="2012-05-15"
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
                    Gender *
                  </label>
                  <select
                    name="gender"
                    className="w-full px-3 py-2 text-xs rounded border outline-none"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                    Grade / Class *
                  </label>
                  <select
                    value={formClassId}
                    onChange={(e) => setFormClassId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border outline-none"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                  >
                    {activeClasses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                    Section *
                  </label>
                  <select
                    name="sectionId"
                    required
                    className="w-full px-3 py-2 text-xs rounded border outline-none"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                  >
                    {availableFormSections.length === 0 ? (
                      <option value="">No active sections in this class</option>
                    ) : (
                      availableFormSections.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} (Room: {s.room}, Teacher: {s.classTeacherName || 'None'})
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Guardian Information */}
            <div className="pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  2. Legal Guardian Linkage
                </h4>
                <div className="flex items-center gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setGuardianLinkType('existing')}
                    className={`px-2 py-0.5 rounded ${
                      guardianLinkType === 'existing' ? 'font-bold bg-black/10 dark:bg-white/10' : 'text-slate-400'
                    }`}
                  >
                    Link Existing
                  </button>
                  <button
                    type="button"
                    onClick={() => setGuardianLinkType('new')}
                    className={`px-2 py-0.5 rounded ${
                      guardianLinkType === 'new' ? 'font-bold bg-black/10 dark:bg-white/10' : 'text-slate-400'
                    }`}
                  >
                    Create New Guardian
                  </button>
                </div>
              </div>

              {guardianLinkType === 'existing' ? (
                <div>
                  <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                    Select Registered Guardian *
                  </label>
                  <select
                    value={selectedGuardianId}
                    onChange={(e) => setSelectedGuardianId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border outline-none"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                  >
                    {guardians.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} ({g.relationship}) · {g.phone}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                      Guardian Full Name *
                    </label>
                    <input
                      name="newGuardianName"
                      type="text"
                      required
                      placeholder="e.g. Richard Henderson"
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
                      Relationship to Student *
                    </label>
                    <input
                      name="newGuardianRel"
                      type="text"
                      required
                      defaultValue="Mother"
                      placeholder="Mother, Father, Legal Guardian"
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
                      Phone Contact *
                    </label>
                    <input
                      name="newGuardianPhone"
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
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
                      Email Address *
                    </label>
                    <input
                      name="newGuardianEmail"
                      type="email"
                      required
                      placeholder="guardian@example.com"
                      className="w-full px-3 py-2 text-xs rounded border outline-none"
                      style={{
                        backgroundColor: 'var(--color-background)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => setAddStudentModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border text-slate-500 font-medium"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={availableFormSections.length === 0}
                className="px-4 py-1.5 font-bold text-white rounded-lg shadow-xs hover:opacity-95 disabled:opacity-50"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Commit Enrollment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: EDIT STUDENT */}
      {editStudentTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleUpdateStudentSubmit}
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
                  Edit Student: {editStudentTarget.name}
                </h3>
              </div>
              <button type="button" onClick={() => setEditStudentTarget(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Student Name *
              </label>
              <input
                name="editName"
                defaultValue={editStudentTarget.name}
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
                Admission Number *
              </label>
              <input
                name="editAdmNo"
                defaultValue={editStudentTarget.admissionNo}
                type="text"
                required
                className="w-full px-3 py-2 text-xs rounded border outline-none font-mono"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Class
                </label>
                <select
                  name="editClassId"
                  defaultValue={editStudentTarget.classId}
                  className="w-full px-3 py-2 text-xs rounded border outline-none"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                >
                  {activeClasses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Section
                </label>
                <select
                  name="editSectionId"
                  defaultValue={editStudentTarget.sectionId}
                  className="w-full px-3 py-2 text-xs rounded border outline-none"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                >
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.className} - {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Enrollment Status
              </label>
              <select
                name="editStatus"
                defaultValue={editStudentTarget.enrollmentStatus}
                className="w-full px-3 py-2 text-xs rounded border outline-none"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="transferred">Transferred</option>
                <option value="graduated">Graduated</option>
              </select>
            </div>

            <div className="pt-3 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => setEditStudentTarget(null)}
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
                Save Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL / DRAWER: STUDENT PROFILE */}
      {profileStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-2xl rounded-xl border shadow-xl flex flex-col max-h-[88vh] text-xs overflow-hidden"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            {/* Header */}
            <div className="p-4 border-b flex items-start justify-between" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                    {profileStudent.name}
                  </h3>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                    {profileStudent.admissionNo}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {profileStudent.enrollmentStatus}
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-0.5">
                  {profileStudent.className} · {profileStudent.sectionName} · Cohort AY 2026-27
                </p>
              </div>
              <button onClick={() => setProfileStudent(null)} className="p-1 hover:opacity-75">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Profile Tabs Content */}
            <div className="overflow-y-auto flex-1 p-5 space-y-5">
              {/* Personal & Academic Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                  <span className="text-[10px] text-slate-400 font-medium uppercase">Date of Birth</span>
                  <div className="font-bold text-xs mt-0.5" style={{ color: 'var(--color-text)' }}>
                    {profileStudent.dateOfBirth}
                  </div>
                </div>

                <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                  <span className="text-[10px] text-slate-400 font-medium uppercase">Gender</span>
                  <div className="font-bold text-xs mt-0.5" style={{ color: 'var(--color-text)' }}>
                    {profileStudent.gender}
                  </div>
                </div>

                <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                  <span className="text-[10px] text-slate-400 font-medium uppercase">Admission Date</span>
                  <div className="font-bold text-xs mt-0.5" style={{ color: 'var(--color-text)' }}>
                    {profileStudent.admissionDate}
                  </div>
                </div>

                <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                  <span className="text-[10px] text-slate-400 font-medium uppercase">Cumulative GPA</span>
                  <div className="font-bold text-xs mt-0.5" style={{ color: 'var(--color-text)' }}>
                    {profileStudent.gpa || '3.80'}
                  </div>
                </div>
              </div>

              {/* Legal Guardian Card */}
              <div className="p-4 rounded-xl border space-y-2" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                  <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text)' }}>
                    Legal Guardian Information
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px]">Name & Relationship:</span>
                    <div className="font-semibold" style={{ color: 'var(--color-text)' }}>
                      {profileStudent.guardianName} ({profileStudent.guardianRelationship})
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Contact Phone:</span>
                    <div className="font-mono text-slate-600 dark:text-slate-300">
                      {profileStudent.guardianPhone}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Contact Email:</span>
                    <div className="text-slate-600 dark:text-slate-300 truncate">
                      {profileStudent.guardianEmail}
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendance & Timetable Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Attendance Summary */}
                <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text)' }}>
                      Attendance Summary
                    </h4>
                  </div>
                  {(() => {
                    const studentAtt = attendance.filter((a) => a.studentId === profileStudent.id);
                    if (studentAtt.length === 0) {
                      return <p className="text-slate-400 text-xs">No attendance marks logged for current term.</p>;
                    }
                    const present = studentAtt.filter((a) => a.status === 'present').length;
                    const late = studentAtt.filter((a) => a.status === 'late').length;
                    const absent = studentAtt.filter((a) => a.status === 'absent').length;

                    return (
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Present Sessions:</span>
                          <span className="font-bold text-emerald-600">{present}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Late Arrivals:</span>
                          <span className="font-bold text-amber-600">{late}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Absent Days:</span>
                          <span className="font-bold text-rose-600">{absent}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Section Timetable Preview */}
                <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                    <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text)' }}>
                      Section Timetable Slots
                    </h4>
                  </div>
                  {(() => {
                    const secSlots = timetable.filter((tt) => tt.sectionId === profileStudent.sectionId);
                    return (
                      <div className="text-xs space-y-1">
                        <p className="text-slate-500">
                          {secSlots.length} instructional periods scheduled weekly for {profileStudent.sectionName}.
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {Array.from(new Set(secSlots.map((s) => s.subjectName))).map((subj, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded text-[10px] font-semibold border"
                              style={{
                                backgroundColor: 'var(--color-background)',
                                borderColor: 'var(--color-border)',
                                color: 'var(--color-text)',
                              }}
                            >
                              {subj}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Administrative Notes */}
              {profileStudent.notes && (
                <div
                  className="p-3.5 rounded-lg border text-xs"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <span className="font-bold text-slate-500 block mb-0.5">Faculty Administrative Note:</span>
                  <p className="text-slate-700 dark:text-slate-300 italic">{profileStudent.notes}</p>
                </div>
              )}
            </div>

            <div className="p-3 border-t flex justify-end" style={{ borderColor: 'var(--color-border)' }}>
              <button
                onClick={() => setProfileStudent(null)}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg border text-slate-600"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ARCHIVE STUDENT */}
      {archiveStudentTarget && (
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
                  Archive / Transfer Student: {archiveStudentTarget.name}?
                </h3>
                <p className="text-slate-500 text-xs">Record preservation safeguard</p>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Archiving marks this student as transferred. In compliance with school ERP rules, historical attendance, grade, and fee records remain permanently intact in the system.
            </p>

            <div className="pt-3 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => setArchiveStudentTarget(null)}
                className="px-3 py-1.5 rounded-lg border text-slate-500 font-medium"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmArchiveStudent}
                className="px-4 py-1.5 font-bold text-white rounded-lg bg-rose-600 shadow-xs hover:bg-rose-700"
              >
                Confirm Archival
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT GUARDIAN */}
      {editGuardianTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleUpdateGuardianSubmit}
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
                  Edit Guardian: {editGuardianTarget.name}
                </h3>
              </div>
              <button type="button" onClick={() => setEditGuardianTarget(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Guardian Full Name *
              </label>
              <input
                name="gName"
                defaultValue={editGuardianTarget.name}
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
                Phone Contact *
              </label>
              <input
                name="gPhone"
                defaultValue={editGuardianTarget.phone}
                type="tel"
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
                Email Address *
              </label>
              <input
                name="gEmail"
                defaultValue={editGuardianTarget.email}
                type="email"
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
                Residential Address
              </label>
              <input
                name="gAddress"
                defaultValue={editGuardianTarget.address}
                type="text"
                className="w-full px-3 py-2 text-xs rounded border outline-none"
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
                onClick={() => setEditGuardianTarget(null)}
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
                Save Guardian Details
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
