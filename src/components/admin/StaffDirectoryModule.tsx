import React, { useState, useMemo } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { usePermissions } from '../../context/PermissionContext';
import { StaffMember } from '../../types/school';
import {
  UserCheck,
  UserPlus,
  Search,
  Filter,
  Edit2,
  Archive,
  Eye,
  X,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  Briefcase,
  BookOpen,
  Building,
  GraduationCap,
  Calendar,
  Layers,
} from 'lucide-react';

export const StaffDirectoryModule: React.FC = () => {
  const {
    staff,
    sections,
    subjects,
    addStaff,
    updateStaff,
    archiveStaff,
    updateSection,
  } = useSchoolData();

  const { hasPermission } = usePermissions();

  const canManageStaff = hasPermission('staff.manage');

  // Search & filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('active');

  // Modals & Profile Drawers
  const [addStaffModalOpen, setAddStaffModalOpen] = useState(false);
  const [editStaffTarget, setEditStaffTarget] = useState<StaffMember | null>(null);
  const [profileStaff, setProfileStaff] = useState<StaffMember | null>(null);
  const [assignTeacherTarget, setAssignTeacherTarget] = useState<StaffMember | null>(null);

  // Notification feedback
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

  // Distinct departments for filter
  const departments = useMemo(() => {
    return Array.from(new Set(staff.map((s) => s.department)));
  }, [staff]);

  // Filtered staff list
  const filteredStaff = useMemo(() => {
    return staff.filter((st) => {
      const matchSearch =
        st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.designation.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDept = departmentFilter === 'all' || st.department === departmentFilter;
      const matchStatus = statusFilter === 'all' || st.status === statusFilter;
      return matchSearch && matchDept && matchStatus;
    });
  }, [staff, searchTerm, departmentFilter, statusFilter]);

  // Handle Add Staff Submit
  const handleSaveStaff = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('staffName') as HTMLInputElement).value;
    const staffId = (form.elements.namedItem('staffId') as HTMLInputElement).value;
    const designation = (form.elements.namedItem('designation') as HTMLInputElement).value;
    const department = (form.elements.namedItem('department') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
    const notes = (form.elements.namedItem('notes') as HTMLTextAreaElement).value;

    const result = addStaff({
      name,
      staffId,
      designation,
      department,
      email,
      phone,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      assignedSubjects: [],
      assignedSections: [],
      notes,
    });

    if (result.isValid) {
      showNotification(`Staff member "${name}" successfully registered.`);
      setAddStaffModalOpen(false);
    } else {
      showNotification(undefined, result.message);
    }
  };

  // Handle Edit Staff Submit
  const handleUpdateStaffSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editStaffTarget) return;

    const form = e.currentTarget;
    const name = (form.elements.namedItem('editName') as HTMLInputElement).value;
    const staffId = (form.elements.namedItem('editStaffId') as HTMLInputElement).value;
    const designation = (form.elements.namedItem('editDesignation') as HTMLInputElement).value;
    const department = (form.elements.namedItem('editDepartment') as HTMLInputElement).value;
    const email = (form.elements.namedItem('editEmail') as HTMLInputElement).value;
    const phone = (form.elements.namedItem('editPhone') as HTMLInputElement).value;
    const status = (form.elements.namedItem('editStatus') as HTMLSelectElement).value as any;

    const result = updateStaff(editStaffTarget.id, {
      name,
      staffId,
      designation,
      department,
      email,
      phone,
      status,
    });

    if (result.isValid) {
      showNotification(`Profile for "${name}" updated.`);
      setEditStaffTarget(null);
    } else {
      showNotification(undefined, result.message);
    }
  };

  // Handle Assigning Staff to a Section as Class Teacher
  const handleAssignToSection = (sectionId: string) => {
    if (!assignTeacherTarget) return;
    const targetSection = sections.find((s) => s.id === sectionId);
    if (!targetSection) return;

    const result = updateSection(sectionId, {
      classTeacherId: assignTeacherTarget.id,
      classTeacherName: assignTeacherTarget.name,
    });

    if (result.isValid) {
      showNotification(`${assignTeacherTarget.name} assigned as Class Teacher for ${targetSection.className} · ${targetSection.name}.`);
      setAssignTeacherTarget(null);
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
            Staff & Faculty Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Academic faculty, departmental leaders, class teacher assignments, and administrative staff credentials.
          </p>
        </div>

        {canManageStaff && (
          <button
            onClick={() => setAddStaffModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg shadow-xs hover:opacity-95"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Staff Member</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div
        className="p-3 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
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
            placeholder="Search name, staff ID, title..."
            className="bg-transparent border-none outline-none text-xs w-full"
            style={{ color: 'var(--color-text)' }}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-600">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border outline-none text-xs"
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

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
            <option value="active">Active</option>
            <option value="on-leave">On Leave</option>
            <option value="resigned">Resigned</option>
          </select>
        </div>
      </div>

      {/* Staff Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">
            <UserCheck className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-700 dark:text-slate-200">No staff members found</p>
            <p className="text-slate-500 mt-1">Adjust search terms or create a new staff profile.</p>
          </div>
        ) : (
          filteredStaff.map((st) => {
            // Find sections where this staff member is class teacher
            const classTeacherSections = sections.filter((s) => s.classTeacherId === st.id);

            return (
              <div
                key={st.id}
                className="p-4 rounded-xl border shadow-xs transition-colors flex flex-col justify-between"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setProfileStaff(st)}
                          className="font-bold text-sm text-left hover:underline"
                          style={{ color: 'var(--color-text)' }}
                        >
                          {st.name}
                        </button>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            st.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {st.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">{st.staffId}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setProfileStaff(st)}
                        className="p-1 rounded text-slate-400 hover:opacity-80"
                        title="View Staff Profile"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {canManageStaff && (
                        <button
                          onClick={() => setEditStaffTarget(st)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700"
                          title="Edit Staff Record"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1 text-xs mb-3">
                    <div className="font-medium" style={{ color: 'var(--color-text)' }}>
                      {st.designation}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Dept: <strong style={{ color: 'var(--color-text)' }}>{st.department}</strong>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] pt-1">
                      <Mail className="w-3 h-3 shrink-0" />
                      <span className="truncate">{st.email}</span>
                    </div>
                  </div>

                  {/* Class Teacher Badge if assigned */}
                  {classTeacherSections.length > 0 && (
                    <div
                      className="p-2 rounded-lg border mb-3 text-xs"
                      style={{
                        backgroundColor: 'var(--color-background)',
                        borderColor: 'var(--color-border)',
                      }}
                    >
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">
                        Class Teacher Role
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {classTeacherSections.map((s) => (
                          <span
                            key={s.id}
                            className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                          >
                            {s.className} · {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Assigned Subjects */}
                  {st.assignedSubjects.length > 0 && (
                    <div className="mb-3">
                      <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1">
                        Subject Instruction
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {st.assignedSubjects.map((sub, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-[10px] border"
                            style={{
                              backgroundColor: 'var(--color-background)',
                              borderColor: 'var(--color-border)',
                              color: 'var(--color-text)',
                            }}
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t flex items-center justify-between text-xs" style={{ borderColor: 'var(--color-border)' }}>
                  <span className="text-[10px] text-slate-400 font-mono">Joined {st.joinDate}</span>
                  {canManageStaff && (
                    <button
                      onClick={() => setAssignTeacherTarget(st)}
                      className="text-[11px] font-semibold hover:underline"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      Assign Section...
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL: ADD STAFF */}
      {addStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleSaveStaff}
            className="w-full max-w-lg rounded-xl border p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto text-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  Register Staff / Faculty Member
                </h3>
              </div>
              <button type="button" onClick={() => setAddStaffModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Full Name *
                </label>
                <input
                  name="staffName"
                  type="text"
                  required
                  placeholder="e.g. Dr. Arthur Pendelton"
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
                  Staff ID * (Unique)
                </label>
                <input
                  name="staffId"
                  type="text"
                  required
                  defaultValue={`FAC-2026-${Math.floor(100 + Math.random() * 900)}`}
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
                  Designation / Role Title *
                </label>
                <input
                  name="designation"
                  type="text"
                  required
                  placeholder="e.g. Senior Faculty / Math Instructor"
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
                  Department *
                </label>
                <input
                  name="department"
                  type="text"
                  required
                  defaultValue="Mathematics"
                  placeholder="Science, Mathematics, Humanities..."
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
                  Work Email *
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@schlar.edu"
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
                  Work Phone
                </label>
                <input
                  name="phone"
                  type="tel"
                  defaultValue="+1 (555) 890-1200"
                  className="w-full px-3 py-2 text-xs rounded border outline-none"
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
                Administrative Credentials & Qualifications
              </label>
              <textarea
                name="notes"
                rows={2}
                placeholder="Degrees, certifications, safety compliance notes..."
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
                onClick={() => setAddStaffModalOpen(false)}
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
                Register Staff
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: EDIT STAFF */}
      {editStaffTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleUpdateStaffSubmit}
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
                  Edit Staff: {editStaffTarget.name}
                </h3>
              </div>
              <button type="button" onClick={() => setEditStaffTarget(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Full Name *
              </label>
              <input
                name="editName"
                defaultValue={editStaffTarget.name}
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Staff ID
                </label>
                <input
                  name="editStaffId"
                  defaultValue={editStaffTarget.staffId}
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

              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Status
                </label>
                <select
                  name="editStatus"
                  defaultValue={editStaffTarget.status}
                  className="w-full px-3 py-2 text-xs rounded border outline-none"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                >
                  <option value="active">Active</option>
                  <option value="on-leave">On Leave</option>
                  <option value="resigned">Resigned</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Designation
              </label>
              <input
                name="editDesignation"
                defaultValue={editStaffTarget.designation}
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
                Department
              </label>
              <input
                name="editDepartment"
                defaultValue={editStaffTarget.department}
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Work Email
                </label>
                <input
                  name="editEmail"
                  defaultValue={editStaffTarget.email}
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
                  Phone
                </label>
                <input
                  name="editPhone"
                  defaultValue={editStaffTarget.phone}
                  type="tel"
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
                onClick={() => setEditStaffTarget(null)}
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

      {/* MODAL: STAFF PROFILE DETAILS */}
      {profileStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-xl rounded-xl border shadow-xl flex flex-col max-h-[85vh] text-xs overflow-hidden"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="p-4 border-b flex items-start justify-between" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                    {profileStaff.name}
                  </h3>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-slate-500">
                    {profileStaff.staffId}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {profileStaff.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {profileStaff.designation} · {profileStaff.department}
                </p>
              </div>
              <button onClick={() => setProfileStaff(null)} className="p-1 hover:opacity-75">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                  <span className="text-[10px] text-slate-400 uppercase font-medium">Work Contact</span>
                  <div className="font-semibold mt-0.5" style={{ color: 'var(--color-text)' }}>
                    {profileStaff.email}
                  </div>
                  <div className="text-slate-500 text-[11px] font-mono">{profileStaff.phone}</div>
                </div>

                <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                  <span className="text-[10px] text-slate-400 uppercase font-medium">Date of Appointment</span>
                  <div className="font-semibold mt-0.5" style={{ color: 'var(--color-text)' }}>
                    {profileStaff.joinDate}
                  </div>
                  <div className="text-slate-500 text-[11px]">Academic Faculty</div>
                </div>
              </div>

              {/* Class Teacher Assignments */}
              <div className="p-3.5 rounded-xl border space-y-2" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: 'var(--color-text)' }}>
                  Assigned Class Cohorts (Class Teacher)
                </span>
                {(() => {
                  const assigned = sections.filter((s) => s.classTeacherId === profileStaff.id);
                  if (assigned.length === 0) {
                    return <p className="text-slate-400 text-xs italic">Not currently assigned as Class Teacher for any section.</p>;
                  }
                  return (
                    <div className="space-y-1.5">
                      {assigned.map((sec) => (
                        <div key={sec.id} className="flex items-center justify-between p-2 rounded bg-black/5 dark:bg-white/5">
                          <span className="font-bold text-xs" style={{ color: 'var(--color-text)' }}>
                            {sec.className} · {sec.name}
                          </span>
                          <span className="text-slate-400 text-xs font-mono">Room: {sec.room}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Administrative Notes */}
              {profileStaff.notes && (
                <div
                  className="p-3.5 rounded-lg border text-xs"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <span className="font-bold text-slate-500 block mb-0.5">Administrative Service File Note:</span>
                  <p className="text-slate-700 dark:text-slate-300 italic">{profileStaff.notes}</p>
                </div>
              )}
            </div>

            <div className="p-3 border-t flex justify-end" style={{ borderColor: 'var(--color-border)' }}>
              <button
                onClick={() => setProfileStaff(null)}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg border text-slate-600"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN TEACHER TO A SECTION */}
      {assignTeacherTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-md rounded-xl border p-6 shadow-xl space-y-4 text-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  Assign Class Teacher
                </h3>
                <p className="text-slate-500 text-xs">Assign {assignTeacherTarget.name} to a section</p>
              </div>
              <button onClick={() => setAssignTeacherTarget(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <p className="text-slate-600 dark:text-slate-300">
              Select an active section to appoint {assignTeacherTarget.name} as the lead Class Teacher:
            </p>

            <div className="max-h-60 overflow-y-auto space-y-1.5">
              {sections
                .filter((s) => s.status === 'active')
                .map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => handleAssignToSection(sec.id)}
                    className="w-full p-2.5 rounded-lg border text-left flex items-center justify-between hover:border-slate-400 transition-colors"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                    }}
                  >
                    <div>
                      <div className="font-bold text-xs" style={{ color: 'var(--color-text)' }}>
                        {sec.className} · {sec.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Current Teacher: {sec.classTeacherName || 'None'}
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold" style={{ color: 'var(--color-primary)' }}>
                      Select →
                    </span>
                  </button>
                ))}
            </div>

            <div className="pt-3 border-t flex justify-end" style={{ borderColor: 'var(--color-border)' }}>
              <button
                onClick={() => setAssignTeacherTarget(null)}
                className="px-3 py-1.5 rounded-lg border text-slate-500 font-medium"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
