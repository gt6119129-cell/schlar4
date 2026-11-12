import React, { useState, useMemo } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { usePermissions } from '../../context/PermissionContext';
import { AdmissionEnquiry, AdmissionStatus } from '../../types/school';
import {
  Inbox,
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  Edit2,
  Eye,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  Calendar,
  Building,
  UserCheck,
  Check,
} from 'lucide-react';

const ADMISSION_STATUSES: AdmissionStatus[] = [
  'New',
  'Contacted',
  'Follow-up Required',
  'Application Received',
  'Under Review',
  'Accepted',
  'Rejected',
  'Enrolled',
];

export const AdmissionsModule: React.FC<{ onNavigateToStudent?: (studentId: string) => void }> = ({
  onNavigateToStudent,
}) => {
  const {
    admissions,
    classes,
    sections,
    staff,
    addAdmissionEnquiry,
    updateAdmissionEnquiry,
    convertEnquiryToStudent,
    schoolProfile,
  } = useSchoolData();

  const { hasPermission } = usePermissions();

  const canManageAdmissions = hasPermission('admissions.manage');
  const canConvertStudent = hasPermission('students.create');

  // Search & filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdmissionEnquiry | null>(null);
  const [viewDetailTarget, setViewDetailTarget] = useState<AdmissionEnquiry | null>(null);
  const [convertTarget, setConvertTarget] = useState<AdmissionEnquiry | null>(null);

  // Conversion wizard form state
  const [conversionSectionId, setConversionSectionId] = useState<string>('');
  const [conversionAdmissionNo, setConversionAdmissionNo] = useState<string>('');

  // Notifications
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

  const activeClasses = useMemo(() => classes.filter((c) => c.status === 'active'), [classes]);
  const activeStaff = useMemo(() => staff.filter((s) => s.status === 'active'), [staff]);

  // Filtered Admissions
  const filteredAdmissions = useMemo(() => {
    return admissions.filter((e) => {
      const matchSearch =
        e.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.enquiryNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.guardianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.guardianPhone.includes(searchTerm);
      const matchStatus = selectedStatusFilter === 'all' || e.status === selectedStatusFilter;
      const matchClass = selectedClassFilter === 'all' || e.intendedClassId === selectedClassFilter;
      return matchSearch && matchStatus && matchClass;
    });
  }, [admissions, searchTerm, selectedStatusFilter, selectedClassFilter]);

  // Pipeline counts
  const totalEnquiries = admissions.length;
  const newCount = admissions.filter((a) => a.status === 'New').length;
  const inProgressCount = admissions.filter(
    (a) => a.status === 'Contacted' || a.status === 'Follow-up Required' || a.status === 'Application Received'
  ).length;
  const underReviewCount = admissions.filter((a) => a.status === 'Under Review').length;
  const acceptedCount = admissions.filter((a) => a.status === 'Accepted').length;
  const enrolledCount = admissions.filter((a) => a.status === 'Enrolled').length;

  // Handle Create Enquiry Submit
  const handleSaveEnquiry = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const applicantName = (form.elements.namedItem('applicantName') as HTMLInputElement).value;
    const dob = (form.elements.namedItem('dob') as HTMLInputElement).value;
    const gender = (form.elements.namedItem('gender') as HTMLSelectElement).value as any;
    const intendedClassId = (form.elements.namedItem('classId') as HTMLSelectElement).value;
    const guardianName = (form.elements.namedItem('guardianName') as HTMLInputElement).value;
    const guardianRelationship = (form.elements.namedItem('guardianRel') as HTMLInputElement).value;
    const guardianPhone = (form.elements.namedItem('guardianPhone') as HTMLInputElement).value;
    const guardianEmail = (form.elements.namedItem('guardianEmail') as HTMLInputElement).value;
    const guardianAddress = (form.elements.namedItem('guardianAddress') as HTMLInputElement).value;
    const source = (form.elements.namedItem('source') as HTMLInputElement).value;
    const assignedStaffId = (form.elements.namedItem('staffId') as HTMLSelectElement).value;
    const followUpDate = (form.elements.namedItem('followUpDate') as HTMLInputElement).value;
    const notes = (form.elements.namedItem('notes') as HTMLTextAreaElement).value;

    const matchedClass = classes.find((c) => c.id === intendedClassId);
    const matchedStaff = staff.find((s) => s.id === assignedStaffId);

    const result = addAdmissionEnquiry({
      applicantName,
      dateOfBirth: dob,
      gender,
      intendedClassId,
      intendedClassName: matchedClass?.name || 'Class',
      guardianName,
      guardianRelationship,
      guardianPhone,
      guardianEmail,
      guardianAddress,
      source: source || 'Campus Walk-in',
      assignedStaffId: assignedStaffId || undefined,
      assignedStaffName: matchedStaff?.name || undefined,
      enquiryDate: new Date().toISOString().split('T')[0],
      followUpDate: followUpDate || undefined,
      status: 'New',
      notes,
    });

    if (result.isValid) {
      showNotification(`Enquiry for applicant "${applicantName}" successfully created.`);
      setCreateModalOpen(false);
    } else {
      showNotification(undefined, result.message);
    }
  };

  // Handle Edit Enquiry Submit
  const handleUpdateEnquiry = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editTarget) return;

    const form = e.currentTarget;
    const applicantName = (form.elements.namedItem('editApplicantName') as HTMLInputElement).value;
    const status = (form.elements.namedItem('editStatus') as HTMLSelectElement).value as AdmissionStatus;
    const followUpDate = (form.elements.namedItem('editFollowUp') as HTMLInputElement).value;
    const notes = (form.elements.namedItem('editNotes') as HTMLTextAreaElement).value;
    const assignedStaffId = (form.elements.namedItem('editStaffId') as HTMLSelectElement).value;

    const matchedStaff = staff.find((s) => s.id === assignedStaffId);

    const result = updateAdmissionEnquiry(editTarget.id, {
      applicantName,
      status,
      followUpDate: followUpDate || undefined,
      notes,
      assignedStaffId: assignedStaffId || undefined,
      assignedStaffName: matchedStaff?.name || undefined,
    });

    if (result.isValid) {
      showNotification(`Enquiry #${editTarget.enquiryNo} updated.`);
      setEditTarget(null);
    } else {
      showNotification(undefined, result.message);
    }
  };

  // Open Conversion Wizard
  const handleOpenConversionModal = (enquiry: AdmissionEnquiry) => {
    setConvertTarget(enquiry);
    // Find default section in intended class
    const validSections = sections.filter((s) => s.classId === enquiry.intendedClassId && s.status === 'active');
    setConversionSectionId(validSections[0]?.id || '');
    setConversionAdmissionNo(`SCH-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  // Execute Conversion
  const handleExecuteConversion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertTarget) return;

    if (!conversionSectionId) {
      showNotification(undefined, 'Target section must be selected.');
      return;
    }

    const result = convertEnquiryToStudent(convertTarget.id, {
      admissionNo: conversionAdmissionNo,
      sectionId: conversionSectionId,
      admissionDate: new Date().toISOString().split('T')[0],
      gender: convertTarget.gender,
    });

    if (result.isValid) {
      showNotification(`Applicant "${convertTarget.applicantName}" successfully converted to active enrolled student!`);
      setConvertTarget(null);
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
            Admissions & Enrollment Pipeline
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Prospective student enquiries, evaluation workflow, and atomic admission-to-student conversion.
          </p>
        </div>

        {canManageAdmissions && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg shadow-xs hover:opacity-95"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Admission Enquiry</span>
          </button>
        )}
      </div>

      {/* Pipeline Status Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <button
          onClick={() => setSelectedStatusFilter('all')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedStatusFilter === 'all' ? 'ring-2 ring-slate-400' : ''
          }`}
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <span className="text-slate-400 text-[10px] font-bold uppercase">Total Pipeline</span>
          <div className="text-xl font-extrabold font-mono tabular-nums mt-1" style={{ color: 'var(--color-text)' }}>
            {totalEnquiries}
          </div>
          <span className="text-[10px] text-slate-400 mt-1">All applications</span>
        </button>

        <button
          onClick={() => setSelectedStatusFilter('New')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedStatusFilter === 'New' ? 'ring-2 ring-slate-400' : ''
          }`}
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <span className="text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase">New</span>
          <div className="text-xl font-extrabold font-mono tabular-nums mt-1" style={{ color: 'var(--color-text)' }}>
            {newCount}
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Awaiting first touch</span>
        </button>

        <button
          onClick={() => setSelectedStatusFilter('Under Review')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedStatusFilter === 'Under Review' ? 'ring-2 ring-slate-400' : ''
          }`}
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <span className="text-amber-600 text-[10px] font-bold uppercase">Under Review</span>
          <div className="text-xl font-extrabold font-mono tabular-nums text-amber-600 mt-1">
            {underReviewCount}
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Evaluation & transcripts</span>
        </button>

        <button
          onClick={() => setSelectedStatusFilter('Accepted')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedStatusFilter === 'Accepted' ? 'ring-2 ring-emerald-500' : ''
          }`}
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <span className="text-emerald-600 text-[10px] font-bold uppercase">Accepted</span>
          <div className="text-xl font-extrabold font-mono tabular-nums text-emerald-600 mt-1">
            {acceptedCount}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1">Ready for Enrollment</span>
        </button>

        <button
          onClick={() => setSelectedStatusFilter('Enrolled')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedStatusFilter === 'Enrolled' ? 'ring-2 ring-indigo-500' : ''
          }`}
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <span className="text-indigo-600 text-[10px] font-bold uppercase">Converted</span>
          <div className="text-xl font-extrabold font-mono tabular-nums text-indigo-600 mt-1">
            {enrolledCount}
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Enrolled in classes</span>
        </button>

        <button
          onClick={() => setSelectedStatusFilter('Follow-up Required')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedStatusFilter === 'Follow-up Required' ? 'ring-2 ring-slate-400' : ''
          }`}
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <span className="text-slate-400 text-[10px] font-bold uppercase">In Progress</span>
          <div className="text-xl font-extrabold font-mono tabular-nums mt-1" style={{ color: 'var(--color-text)' }}>
            {inProgressCount}
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Campus tours & calls</span>
        </button>
      </div>

      {/* Search & Class Filter */}
      <div
        className="p-3 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border w-full md:w-80"
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
            placeholder="Search applicant name, #, guardian..."
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
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border outline-none text-xs"
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <option value="all">All Cohort Targets</option>
            {activeClasses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border outline-none text-xs"
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <option value="all">All Statuses</option>
            {ADMISSION_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Admissions Pipeline Table */}
      <div
        className="rounded-xl border shadow-xs overflow-hidden"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        {filteredAdmissions.length === 0 ? (
          <div className="py-12 px-4 text-center text-xs text-slate-400">
            <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-700 dark:text-slate-200">No admission enquiries found</p>
            <p className="text-slate-500 mt-1">Try adjusting search criteria or create a new enquiry record.</p>
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
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Enquiry ID</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Applicant Name</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Target Grade</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Guardian & Contact</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Assigned Staff</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Pipeline Status</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {filteredAdmissions.map((enq) => (
                  <tr key={enq.id} className="hover:bg-black/[0.015] dark:hover:bg-white/[0.015] transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-500">
                      {enq.enquiryNo}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setViewDetailTarget(enq)}
                        className="font-bold text-left hover:underline block"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {enq.applicantName}
                      </button>
                      <span className="text-[11px] text-slate-400 font-mono">Date: {enq.enquiryDate}</span>
                    </td>
                    <td className="py-3 px-4 font-medium" style={{ color: 'var(--color-text)' }}>
                      {enq.intendedClassName}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold block" style={{ color: 'var(--color-text)' }}>
                        {enq.guardianName}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{enq.guardianPhone}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-medium">
                      {enq.assignedStaffName || <span className="text-slate-400 italic">Unassigned</span>}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          enq.status === 'Accepted'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : enq.status === 'Under Review'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : enq.status === 'Enrolled'
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                            : enq.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Direct Convert Button for Accepted */}
                        {enq.status === 'Accepted' && canConvertStudent && (
                          <button
                            onClick={() => handleOpenConversionModal(enq)}
                            className="px-2.5 py-1 text-[11px] font-bold text-white rounded-md shadow-xs hover:opacity-95 flex items-center gap-1"
                            style={{ backgroundColor: 'var(--color-accent)' }}
                            title="Convert accepted applicant into enrolled student"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Convert to Student</span>
                          </button>
                        )}

                        <button
                          onClick={() => setViewDetailTarget(enq)}
                          className="p-1 rounded text-slate-400 hover:opacity-85"
                          title="View Enquiry Dossier"
                          style={{ color: 'var(--color-primary)' }}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {canManageAdmissions && enq.status !== 'Enrolled' && (
                          <button
                            onClick={() => setEditTarget(enq)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700"
                            title="Edit Enquiry details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
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

      {/* MODAL: NEW ENQUIRY */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleSaveEnquiry}
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
                  Register New Admission Enquiry
                </h3>
              </div>
              <button type="button" onClick={() => setCreateModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Applicant Full Name *
                </label>
                <input
                  name="applicantName"
                  type="text"
                  required
                  placeholder="e.g. Liam Fitzpatrick"
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
                  Intended Class Cohort *
                </label>
                <select
                  name="classId"
                  required
                  className="w-full px-3 py-2 text-xs rounded border outline-none font-semibold"
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
                  Date of Birth
                </label>
                <input
                  name="dob"
                  type="date"
                  defaultValue="2012-08-10"
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
                  Gender
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
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Guardian Name *
                </label>
                <input
                  name="guardianName"
                  type="text"
                  required
                  placeholder="e.g. Fiona Fitzpatrick"
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
                  Guardian Relationship
                </label>
                <input
                  name="guardianRel"
                  type="text"
                  defaultValue="Mother"
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
                  Guardian Phone *
                </label>
                <input
                  name="guardianPhone"
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
                  Guardian Email
                </label>
                <input
                  name="guardianEmail"
                  type="email"
                  placeholder="fiona@example.com"
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
                  Enquiry Source
                </label>
                <input
                  name="source"
                  type="text"
                  defaultValue="Campus Open House"
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
                  Assign Faculty Officer
                </label>
                <select
                  name="staffId"
                  className="w-full px-3 py-2 text-xs rounded border outline-none"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                >
                  <option value="">-- None (General Admissions Pool) --</option>
                  {activeStaff.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.department})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Application Notes & Transcript Summary
              </label>
              <textarea
                name="notes"
                rows={2}
                placeholder="Prior school records, recommendation letters, tour requests..."
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
                onClick={() => setCreateModalOpen(false)}
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
                Register Enquiry
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: EDIT ENQUIRY & STATUS TRANSITION */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleUpdateEnquiry}
            className="w-full max-w-md rounded-xl border p-6 shadow-xl space-y-4 text-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  Update Enquiry: {editTarget.enquiryNo}
                </h3>
                <p className="text-slate-500 text-xs">Applicant: {editTarget.applicantName}</p>
              </div>
              <button type="button" onClick={() => setEditTarget(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Applicant Name
              </label>
              <input
                name="editApplicantName"
                defaultValue={editTarget.applicantName}
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
                Pipeline Status *
              </label>
              <select
                name="editStatus"
                defaultValue={editTarget.status}
                className="w-full px-3 py-2 text-xs rounded border outline-none font-bold"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                {ADMISSION_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Assigned Staff Officer
              </label>
              <select
                name="editStaffId"
                defaultValue={editTarget.assignedStaffId || ''}
                className="w-full px-3 py-2 text-xs rounded border outline-none"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                <option value="">-- None (Admissions Pool) --</option>
                {activeStaff.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Follow-up Date
              </label>
              <input
                name="editFollowUp"
                defaultValue={editTarget.followUpDate || ''}
                type="date"
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
                Interview / Progress Notes
              </label>
              <textarea
                name="editNotes"
                defaultValue={editTarget.notes}
                rows={3}
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
                onClick={() => setEditTarget(null)}
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
                Update Status
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: VIEW DETAILS */}
      {viewDetailTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-lg rounded-xl border p-6 shadow-xl space-y-4 text-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <span className="font-mono text-[10px] text-slate-400">Enquiry #{viewDetailTarget.enquiryNo}</span>
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  {viewDetailTarget.applicantName}
                </h3>
              </div>
              <button onClick={() => setViewDetailTarget(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                  <span className="text-[10px] text-slate-400 uppercase">Target Cohort</span>
                  <div className="font-bold text-xs" style={{ color: 'var(--color-text)' }}>
                    {viewDetailTarget.intendedClassName}
                  </div>
                </div>

                <div className="p-2.5 rounded border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                  <span className="text-[10px] text-slate-400 uppercase">Status</span>
                  <div className="font-bold text-xs" style={{ color: 'var(--color-primary)' }}>
                    {viewDetailTarget.status}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg border space-y-1.5" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Guardian Details</span>
                <div className="font-semibold" style={{ color: 'var(--color-text)' }}>
                  {viewDetailTarget.guardianName} ({viewDetailTarget.guardianRelationship})
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                  <span>Phone: {viewDetailTarget.guardianPhone}</span>
                  <span>·</span>
                  <span>Email: {viewDetailTarget.guardianEmail}</span>
                </div>
              </div>

              {viewDetailTarget.notes && (
                <div className="p-3 rounded-lg border text-xs" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Dossier Notes
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 italic">{viewDetailTarget.notes}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
              {viewDetailTarget.status === 'Accepted' && canConvertStudent ? (
                <button
                  onClick={() => {
                    setViewDetailTarget(null);
                    handleOpenConversionModal(viewDetailTarget);
                  }}
                  className="px-3 py-1.5 font-bold text-white rounded-lg shadow-xs flex items-center gap-1.5"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Convert to Student</span>
                </button>
              ) : (
                <div />
              )}

              <button
                onClick={() => setViewDetailTarget(null)}
                className="px-4 py-1.5 rounded-lg border text-slate-600 font-semibold"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADMISSION-TO-STUDENT CONVERSION WIZARD */}
      {convertTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleExecuteConversion}
            className="w-full max-w-lg rounded-xl border p-6 shadow-xl space-y-4 text-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  Atomic Admission Conversion Wizard
                </h3>
              </div>
              <button type="button" onClick={() => setConvertTarget(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="p-3 rounded-lg border bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Accepted Applicant Confirmed</span>
              </div>
              <p className="text-[11px]">
                Converting <strong>{convertTarget.applicantName}</strong> into an enrolled student will atomically create a permanent student record, link legal guardian <strong>{convertTarget.guardianName}</strong>, and transition this enquiry status to <strong>Enrolled</strong>.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Intended Class
                </label>
                <input
                  type="text"
                  disabled
                  value={convertTarget.intendedClassName}
                  className="w-full px-3 py-2 text-xs rounded border outline-none font-semibold opacity-70"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Target Section Allocation *
                </label>
                <select
                  value={conversionSectionId}
                  onChange={(e) => setConversionSectionId(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded border outline-none font-bold"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                >
                  {sections
                    .filter((s) => s.classId === convertTarget.intendedClassId && s.status === 'active')
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (Room: {s.room})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Assigned Admission Number * (Unique)
              </label>
              <input
                type="text"
                value={conversionAdmissionNo}
                onChange={(e) => setConversionAdmissionNo(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs rounded border outline-none font-mono"
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
                onClick={() => setConvertTarget(null)}
                className="px-3 py-1.5 rounded-lg border text-slate-500 font-medium"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 font-bold text-white rounded-lg shadow-xs hover:opacity-95"
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                Execute Enrollment Conversion
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
