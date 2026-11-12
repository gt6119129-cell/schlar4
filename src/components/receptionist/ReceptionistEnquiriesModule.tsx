import React, { useState, useMemo } from 'react';
import { INITIAL_FRONT_OFFICE_ENQUIRIES } from '../../data/initialReceptionData';
import {
  FrontOfficeEnquiry,
  EnquirySource,
  EnquiryStatus,
} from '../../types/reception';
import {
  HelpCircle,
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  Calendar,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  BookOpen,
  MessageSquare,
  X,
  FileText,
} from 'lucide-react';

export const ReceptionistEnquiriesModule: React.FC = () => {
  const [enquiries, setEnquiries] = useState<FrontOfficeEnquiry[]>(INITIAL_FRONT_OFFICE_ENQUIRIES);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [classFilter, setClassFilter] = useState<string>('all');

  // Modals & Drawers
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedEnquiryForAction, setSelectedEnquiryForAction] = useState<FrontOfficeEnquiry | null>(null);
  const [convertEnquiryTarget, setConvertEnquiryTarget] = useState<FrontOfficeEnquiry | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New Enquiry Form
  const [formData, setFormData] = useState({
    parentName: '',
    studentName: '',
    phone: '',
    email: '',
    academicYear: 'AY 2026-2027',
    interestedClassName: 'Grade 8',
    interestedClassId: 'cls-gr8',
    source: 'Walk-in' as EnquirySource,
    details: '',
    assignedStaffName: 'Ms. Elena Rostova',
    assignedStaffId: 'staff-rostova',
    followUpDate: '2026-10-24',
    internalNotes: '',
  });

  // Follow-up interaction form
  const [followUpNote, setFollowUpNote] = useState('');
  const [updatedStatus, setUpdatedStatus] = useState<EnquiryStatus>('Contacted');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('2026-10-26');

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      const matchSearch =
        e.enquiryNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.studentName && e.studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        e.phone.includes(searchQuery) ||
        (e.email && e.email.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus = statusFilter === 'all' || e.status === statusFilter;
      const matchSource = sourceFilter === 'all' || e.source === sourceFilter;
      const matchClass = classFilter === 'all' || e.interestedClassName === classFilter;

      return matchSearch && matchStatus && matchSource && matchClass;
    });
  }, [enquiries, searchQuery, statusFilter, sourceFilter, classFilter]);

  const handleCreateEnquiry = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.parentName.trim() || !formData.phone.trim()) {
      setFeedback({ type: 'error', message: 'Parent name and contact phone are required.' });
      return;
    }

    const nextIdNum = Math.floor(108 + Math.random() * 20);
    const newEnquiry: FrontOfficeEnquiry = {
      id: `enq-fo-${Date.now()}`,
      enquiryNo: `ENQ-2026-${nextIdNum}`,
      enquiryDate: '2026-10-22',
      parentName: formData.parentName.trim(),
      studentName: formData.studentName.trim() || undefined,
      phone: formData.phone.trim(),
      email: formData.email.trim() || undefined,
      academicYear: formData.academicYear,
      interestedClassId: formData.interestedClassId,
      interestedClassName: formData.interestedClassName,
      source: formData.source,
      details: formData.details.trim() || 'General admission information inquiry.',
      assignedStaffId: formData.assignedStaffId,
      assignedStaffName: formData.assignedStaffName,
      followUpDate: formData.followUpDate,
      status: 'New',
      internalNotes: formData.internalNotes.trim() || undefined,
      isConverted: false,
      activityLog: [
        {
          id: `log-${Date.now()}`,
          date: '2026-10-22',
          note: `Intake lead recorded by Front Desk Receptionist (${formData.source}).`,
          author: 'Receptionist',
          action: 'Created',
        },
      ],
    };

    setEnquiries((prev) => [newEnquiry, ...prev]);
    setIsNewModalOpen(false);
    setFormData({
      parentName: '',
      studentName: '',
      phone: '',
      email: '',
      academicYear: 'AY 2026-2027',
      interestedClassName: 'Grade 8',
      interestedClassId: 'cls-gr8',
      source: 'Walk-in',
      details: '',
      assignedStaffName: 'Ms. Elena Rostova',
      assignedStaffId: 'staff-rostova',
      followUpDate: '2026-10-24',
      internalNotes: '',
    });
    setFeedback({
      type: 'success',
      message: `Enquiry ${newEnquiry.enquiryNo} logged and assigned to ${newEnquiry.assignedStaffName}.`,
    });
  };

  const handleAddFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiryForAction || !followUpNote.trim()) return;

    setEnquiries((prev) =>
      prev.map((item) => {
        if (item.id === selectedEnquiryForAction.id) {
          const updatedLog = [
            ...item.activityLog,
            {
              id: `log-${Date.now()}`,
              date: '2026-10-22',
              note: followUpNote.trim(),
              author: 'Receptionist',
              action: updatedStatus,
            },
          ];

          return {
            ...item,
            status: updatedStatus,
            followUpDate: nextFollowUpDate,
            activityLog: updatedLog,
          };
        }
        return item;
      })
    );

    setFeedback({
      type: 'success',
      message: `Follow-up note appended to ${selectedEnquiryForAction.enquiryNo}. Status updated to ${updatedStatus}.`,
    });
    setSelectedEnquiryForAction(null);
    setFollowUpNote('');
  };

  const handleConfirmConversion = () => {
    if (!convertEnquiryTarget) return;

    if (convertEnquiryTarget.isConverted) {
      setFeedback({ type: 'error', message: 'This lead has already been converted to an admission file.' });
      setConvertEnquiryTarget(null);
      return;
    }

    const assignedAdmissionFile = `ADM-2026-${Math.floor(100 + Math.random() * 900)}`;

    setEnquiries((prev) =>
      prev.map((e) =>
        e.id === convertEnquiryTarget.id
          ? {
              ...e,
              status: 'Converted',
              isConverted: true,
              convertedStudentId: assignedAdmissionFile,
              activityLog: [
                ...e.activityLog,
                {
                  id: `log-${Date.now()}`,
                  date: '2026-10-22',
                  note: `Eligible inquiry officially converted into Admissions Office workflow under dossier #${assignedAdmissionFile}.`,
                  author: 'Receptionist & Admissions Desk',
                  action: 'Converted',
                },
              ],
            }
          : e
      )
    );

    setFeedback({
      type: 'success',
      message: `Lead ${convertEnquiryTarget.enquiryNo} converted to Admissions File #${assignedAdmissionFile} successfully.`,
    });
    setConvertEnquiryTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-teal-700 dark:text-teal-400 mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Prospective Family Intake & Admissions Inquiries</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Enquiries & Leads Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Log walk-ins, phone prospectus requests, tour bookings, and counselor follow-up schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-sm transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Record New Enquiry</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium flex items-center justify-between border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-xs underline">
            Dismiss
          </button>
        </div>
      )}

      {/* FILTER BAR */}
      <div
        className="p-4 rounded-xl border bg-white dark:bg-slate-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[220px] flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by lead #, parent name, student, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none text-xs"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none text-xs"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Follow-up Required">Follow-up Required</option>
              <option value="Visit Scheduled">Visit Scheduled</option>
              <option value="Converted">Converted to Admission</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none text-xs"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <option value="all">All Sources</option>
              <option value="Walk-in">Walk-in</option>
              <option value="Phone">Phone</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none text-xs"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <option value="all">All Cohorts</option>
              <option value="Grade 4">Grade 4</option>
              <option value="Grade 6">Grade 6</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
            </select>
          </div>
        </div>

        <div className="text-slate-500 font-medium">
          Showing <strong>{filteredEnquiries.length}</strong> inquiries
        </div>
      </div>

      {/* ENQUIRY TABLE */}
      <div
        className="rounded-2xl border bg-white dark:bg-slate-900 shadow-xs overflow-hidden"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b" style={{ borderColor: 'var(--color-border)' }}>
              <tr>
                <th className="px-4 py-3">Enquiry #</th>
                <th className="px-4 py-3">Parent & Student</th>
                <th className="px-4 py-3">Interested Class</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Assigned Counselor</th>
                <th className="px-4 py-3">Follow-Up Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No admissions inquiries match current filters.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enq) => {
                  const isConverted = enq.status === 'Converted';
                  const isFollowUpDue = enq.status === 'Follow-up Required' || (enq.followUpDate && enq.followUpDate <= '2026-10-22');

                  return (
                    <tr
                      key={enq.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono font-bold text-teal-800 dark:text-teal-300">
                        {enq.enquiryNo}
                        <div className="text-[10px] text-slate-400 font-normal">
                          {enq.enquiryDate}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {enq.parentName}
                        </div>
                        {enq.studentName && (
                          <div className="text-[11px] text-slate-500">
                            Child: <strong>{enq.studentName}</strong>
                          </div>
                        )}
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>{enq.phone}</span>
                          {enq.email && <span>· {enq.email}</span>}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {enq.interestedClassName}
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {enq.academicYear}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {enq.source}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {enq.assignedStaffName}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        {enq.followUpDate ? (
                          <div className={`flex items-center gap-1 font-mono text-[11px] ${
                            isFollowUpDue && !isConverted ? 'text-amber-600 font-bold' : 'text-slate-500'
                          }`}>
                            <Calendar className="w-3 h-3" />
                            <span>{enq.followUpDate}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[10px]">None set</span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isConverted
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : enq.status === 'Visit Scheduled'
                              ? 'bg-indigo-100 text-indigo-800'
                              : isFollowUpDue
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {enq.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedEnquiryForAction(enq);
                              setUpdatedStatus(enq.status);
                            }}
                            className="px-2.5 py-1 rounded-lg border text-teal-700 hover:bg-teal-50 font-bold flex items-center gap-1"
                            title="Add Follow-up note or change status"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>Follow Up</span>
                          </button>

                          {!isConverted && enq.status !== 'Closed' && (
                            <button
                              onClick={() => setConvertEnquiryTarget(enq)}
                              className="px-2 py-1 rounded-lg text-emerald-700 hover:bg-emerald-50 border border-emerald-200 font-bold flex items-center gap-1"
                              title="Transition eligible enquiry to formal Admissions File"
                            >
                              <UserCheck className="w-3 h-3" />
                              <span>Convert</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD NEW ENQUIRY MODAL */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-xl rounded-2xl border bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="p-4 border-b flex items-center justify-between bg-teal-800 text-white">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-300" />
                <h3 className="text-base font-bold">Record Prospective Lead / Enquiry</h3>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-1 rounded text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEnquiry} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Parent / Guardian Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Gregory House"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Student / Child Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Caleb House"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+1 (555) 678-9900"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. ghouse@memorialhealth.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Interested Class *
                  </label>
                  <select
                    value={formData.interestedClassName}
                    onChange={(e) => {
                      const idMap: Record<string, string> = {
                        'Grade 4': 'cls-gr4',
                        'Grade 6': 'cls-gr6',
                        'Grade 8': 'cls-gr8',
                        'Grade 9': 'cls-gr9',
                        'Grade 10': 'cls-gr10',
                      };
                      setFormData({
                        ...formData,
                        interestedClassName: e.target.value,
                        interestedClassId: idMap[e.target.value] || 'cls-gr8',
                      });
                    }}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <option value="Grade 4">Grade 4 (Primary)</option>
                    <option value="Grade 6">Grade 6 (Middle)</option>
                    <option value="Grade 8">Grade 8 (Middle)</option>
                    <option value="Grade 9">Grade 9 (Secondary)</option>
                    <option value="Grade 10">Grade 10 (Secondary)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Enquiry Source *
                  </label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <option value="Walk-in">Walk-in Visit</option>
                    <option value="Phone">Telephone Query</option>
                    <option value="Website">Website Prospectus</option>
                    <option value="Referral">Family Referral</option>
                    <option value="School Event">Open House / Fair</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Follow-Up Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Enquiry Details & Parent Request
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Relocating from Seattle in January. Inquired regarding science labs and AP curriculum."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                  style={{ borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Assigned Admissions Counselor
                </label>
                <select
                  value={formData.assignedStaffId}
                  onChange={(e) => {
                    const cMap: Record<string, string> = {
                      'staff-rostova': 'Ms. Elena Rostova',
                      'staff-miller': 'Mr. David Miller',
                      'staff-henderson': 'Ms. Sarah Henderson',
                      'staff-vance': 'Dr. Marcus Vance',
                    };
                    setFormData({
                      ...formData,
                      assignedStaffId: e.target.value,
                      assignedStaffName: cMap[e.target.value] || 'Admissions Counselor',
                    });
                  }}
                  className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <option value="staff-rostova">Ms. Elena Rostova (Admissions Lead / Science)</option>
                  <option value="staff-miller">Mr. David Miller (Primary Coordinator)</option>
                  <option value="staff-henderson">Ms. Sarah Henderson (Middle School Head)</option>
                  <option value="staff-vance">Dr. Marcus Vance (Vice Principal)</option>
                </select>
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-lg border text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-xs"
                >
                  Save & Log Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOLLOW UP DRAWER */}
      {selectedEnquiryForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-xl rounded-2xl border bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                  Follow-up Action Desk
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {selectedEnquiryForAction.enquiryNo} · {selectedEnquiryForAction.parentName}
                </h3>
                <div className="text-xs text-slate-500">
                  Phone: {selectedEnquiryForAction.phone} · Target: {selectedEnquiryForAction.interestedClassName}
                </div>
              </div>
              <button
                onClick={() => setSelectedEnquiryForAction(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PREVIOUS ACTIVITY LOG */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                Activity & Touchpoint History
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto p-3 rounded-xl border bg-slate-50 dark:bg-slate-800/40 text-xs">
                {selectedEnquiryForAction.activityLog.map((log) => (
                  <div key={log.id} className="pb-2 border-b border-slate-200 dark:border-slate-700 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{log.date} · <strong>{log.author}</strong></span>
                      <span className="font-semibold text-teal-700">{log.action}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-[11px] mt-0.5">
                      {log.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* APPEND NEW FOLLOW UP */}
            <form onSubmit={handleAddFollowUp} className="space-y-3 pt-2 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Add New Follow-Up Note *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Conducted phone follow-up with parent. Shared Grade 8 syllabus overview and invited for open house."
                  value={followUpNote}
                  onChange={(e) => setFollowUpNote(e.target.value)}
                  className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                  style={{ borderColor: 'var(--color-border)' }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Update Status
                  </label>
                  <select
                    value={updatedStatus}
                    onChange={(e) => setUpdatedStatus(e.target.value as any)}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <option value="Contacted">Contacted</option>
                    <option value="Follow-up Required">Follow-up Required</option>
                    <option value="Visit Scheduled">Visit Scheduled</option>
                    <option value="Information Shared">Information Shared</option>
                    <option value="Closed">Closed / Not Interested</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Next Follow-up Due Date
                  </label>
                  <input
                    type="date"
                    value={nextFollowUpDate}
                    onChange={(e) => setNextFollowUpDate(e.target.value)}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  type="button"
                  onClick={() => setSelectedEnquiryForAction(null)}
                  className="px-4 py-2 rounded-lg border text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-xs"
                >
                  Record Follow-Up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONVERT CONFIRMATION MODAL */}
      {convertEnquiryTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-md rounded-2xl border bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4 text-xs"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Convert to Admission File?
                </h3>
                <p className="text-xs text-slate-500">
                  Enquiry #{convertEnquiryTarget.enquiryNo} · {convertEnquiryTarget.parentName}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1 text-slate-600 dark:text-slate-300">
              <div>Student / Ward: <strong>{convertEnquiryTarget.studentName || 'Prospective Applicant'}</strong></div>
              <div>Cohort: <strong>{convertEnquiryTarget.interestedClassName} ({convertEnquiryTarget.academicYear})</strong></div>
              <div>Parent Phone: <strong>{convertEnquiryTarget.phone}</strong></div>
            </div>

            <p className="text-slate-500 text-[11px] leading-relaxed">
              This action will link this inquiry to the formal Admissions Workflow, assign a permanent file number, and notify the Admissions Counselor. This conversion action is logged into the student's audit trail.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                onClick={() => setConvertEnquiryTarget(null)}
                className="px-4 py-2 rounded-lg border text-slate-600 hover:bg-slate-100 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmConversion}
                className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-xs"
              >
                Confirm Conversion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
