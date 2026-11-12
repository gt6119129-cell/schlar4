import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  INITIAL_JOB_OPENINGS,
  INITIAL_JOB_CANDIDATES,
  INITIAL_HR_DEPARTMENTS,
} from '../../data/initialHRData';
import { JobOpening, JobCandidate } from '../../types/hr';
import { StaffMember } from '../../types/school';
import {
  Briefcase,
  Users,
  Calendar,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  ArrowRight,
  UserCheck,
  Star,
  Clock,
  X,
  FileText,
} from 'lucide-react';

export const HRRecruitmentModule: React.FC = () => {
  const { staff } = useSchoolData();
  const [activeTab, setActiveTab] = useState<'openings' | 'candidates' | 'interviews' | 'hiring'>('openings');
  const [openings, setOpenings] = useState<JobOpening[]>(INITIAL_JOB_OPENINGS);
  const [candidates, setCandidates] = useState<JobCandidate[]>(INITIAL_JOB_CANDIDATES);
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Opening Modal
  const [isOpeningModalOpen, setIsOpeningModalOpen] = useState(false);
  const [openingTitle, setOpeningTitle] = useState('');
  const [openingDept, setOpeningDept] = useState('Sciences & STEM');
  const [openingCount, setOpeningCount] = useState(1);
  const [openingExp, setOpeningExp] = useState('2+ years teaching experience');

  // Hiring conversion modal
  const [hiringCandidate, setHiringCandidate] = useState<JobCandidate | null>(null);

  const handleStageChange = (candId: string, newStage: JobCandidate['stage']) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candId ? { ...c, stage: newStage } : c))
    );
    setToastMessage(`Candidate progression updated to "${newStage}".`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleConvertCandidateToStaff = () => {
    if (!hiringCandidate) return;

    const newStaff: StaffMember = {
      id: `staff-${Date.now()}`,
      staffId: `FAC-2026-${Math.floor(500 + Math.random() * 400)}`,
      name: hiringCandidate.name,
      designation: hiringCandidate.appliedRole,
      department: 'Sciences & STEM',
      email: hiringCandidate.email,
      phone: hiringCandidate.phone,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      assignedSubjects: [hiringCandidate.appliedRole.replace('Teacher', '').trim()],
      assignedSections: [
        { sectionId: 'sec-10a', sectionName: 'Section A', subject: hiringCandidate.appliedRole.replace('Teacher', '').trim() || 'General' },
      ],
    };

    staff.unshift(newStaff);

    // Update candidate stage to Hired
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === hiringCandidate.id
          ? { ...c, stage: 'Hired', convertedStaffId: newStaff.staffId }
          : c
      )
    );

    setHiringCandidate(null);
    setToastMessage(
      `Candidate ${hiringCandidate.name} hired and converted directly into active staff record (${newStaff.staffId})!`
    );
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleCreateOpening = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: JobOpening = {
      id: `job-${Date.now()}`,
      title: openingTitle,
      department: openingDept,
      designation: 'Faculty Teacher',
      employmentType: 'Full-Time Permanent',
      openingsCount: openingCount,
      experienceRequired: openingExp,
      postingDate: new Date().toISOString().split('T')[0],
      closingDate: '2026-12-15',
      status: 'Open',
      applicantsCount: 0,
    };
    setOpenings([newJob, ...openings]);
    setIsOpeningModalOpen(false);
    setOpeningTitle('');
    setToastMessage(`Job opening "${openingTitle}" published.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center gap-2.5 shadow-lg border border-slate-700 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded tracking-wide uppercase border text-teal-700 bg-teal-50 dark:bg-teal-950/30"
              style={{ borderColor: 'var(--color-border)' }}
            >
              Talent Acquisition
            </span>
            <span className="text-xs text-slate-400">Recruitment & Hiring Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Recruitment Management
          </h1>
          <p className="text-sm mt-1 max-w-2xl text-slate-500">
            Publish faculty vacancies, track candidates across hiring stages, schedule interviews, and seamlessly onboard hired candidates.
          </p>
        </div>

        <button
          onClick={() => setIsOpeningModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs hover:opacity-90"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Post New Vacancy</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b text-xs font-medium" style={{ borderColor: 'var(--color-border)' }}>
        {[
          { id: 'openings', label: `Active Openings (${openings.length})` },
          { id: 'candidates', label: `Applicant Pipeline (${candidates.length})` },
          { id: 'interviews', label: 'Interview Schedule' },
          { id: 'hiring', label: 'Hiring Decisions & Onboarding' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 border-b-2 font-bold transition-colors ${
              activeTab === tab.id
                ? 'border-primary'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
            style={{
              borderColor: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
              color: activeTab === tab.id ? 'var(--color-primary)' : undefined,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Openings */}
      {activeTab === 'openings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {openings.map((job) => (
            <div
              key={job.id}
              className="p-5 rounded-xl border shadow-xs flex flex-col justify-between space-y-3"
              style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 uppercase tracking-wider text-slate-500">
                      {job.department}
                    </span>
                    <h3 className="font-bold text-sm mt-1" style={{ color: 'var(--color-text)' }}>
                      {job.title}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                    {job.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-500">
                  <div>Experience: <strong className="text-slate-700 dark:text-slate-300">{job.experienceRequired}</strong></div>
                  <div>Open Positions: <strong>{job.openingsCount}</strong></div>
                  <div>Closing Date: <span className="font-mono">{job.closingDate}</span></div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t text-xs" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-slate-400 font-mono font-bold">
                  {job.applicantsCount} Total Applicants
                </span>
                <button
                  onClick={() => setActiveTab('candidates')}
                  className="text-xs font-semibold hover:underline flex items-center gap-1"
                  style={{ color: 'var(--color-primary)' }}
                >
                  <span>View Applicants</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Candidates */}
      {activeTab === 'candidates' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidates.map((cand) => (
              <div
                key={cand.id}
                className="p-5 rounded-xl border shadow-xs flex flex-col justify-between space-y-3"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <h3 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                        {cand.name}
                      </h3>
                      <div className="text-[11px] text-slate-400">{cand.appliedRole}</div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: cand.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed mb-3">
                    "{cand.notes}"
                  </p>

                  <div className="text-[11px] text-slate-400 space-y-1 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <div>Email: <span className="font-mono">{cand.email}</span> · Phone: {cand.phone}</div>
                    {cand.interviewDate && <div>Interview: <strong className="font-mono text-slate-700 dark:text-slate-300">{cand.interviewDate}</strong></div>}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Stage:</span>
                    <select
                      value={cand.stage}
                      onChange={(e) => handleStageChange(cand.id, e.target.value as any)}
                      className="px-2 py-0.5 rounded border text-[11px] font-bold outline-hidden"
                      style={{
                        backgroundColor: 'var(--color-background)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Screening">Screening</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer Sent">Offer Sent</option>
                      <option value="Hired">Hired</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  {cand.stage === 'Offer Sent' && (
                    <button
                      onClick={() => setHiringCandidate(cand)}
                      className="px-3 py-1 rounded text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs"
                    >
                      Convert to Staff
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Interviews */}
      {activeTab === 'interviews' && (
        <div
          className="p-6 rounded-xl border shadow-xs space-y-4"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <h3 className="text-sm font-bold pb-2 border-b" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
            Scheduled Candidate Interviews & Panel Assessments
          </h3>

          <div className="space-y-3">
            {candidates.filter((c) => c.interviewDate).map((cand) => (
              <div key={cand.id} className="p-3.5 rounded-lg border flex items-center justify-between text-xs" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="font-bold">{cand.name} — {cand.appliedRole}</div>
                    <div className="text-[11px] text-slate-400">Interview Slot: <strong className="font-mono text-slate-700 dark:text-slate-300">{cand.interviewDate}</strong></div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 font-bold text-[10px]">
                  Panel Scheduled
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Hiring Decisions & Onboarding */}
      {activeTab === 'hiring' && (
        <div
          className="p-6 rounded-xl border shadow-xs space-y-4"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <h3 className="text-sm font-bold pb-2 border-b" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
            Hired Candidates & Institutional Onboarding Ledger
          </h3>

          <div className="space-y-3">
            {candidates.filter((c) => c.stage === 'Hired' || c.convertedStaffId).length === 0 ? (
              <div className="p-6 rounded-lg border text-center text-slate-400 text-xs">
                No candidates marked as hired in this cycle yet. Move candidate to "Offer Sent" then click "Convert to Staff".
              </div>
            ) : (
              candidates.filter((c) => c.stage === 'Hired' || c.convertedStaffId).map((cand) => (
                <div key={cand.id} className="p-3.5 rounded-lg border flex items-center justify-between text-xs" style={{ borderColor: 'var(--color-border)' }}>
                  <div>
                    <div className="font-bold">{cand.name}</div>
                    <div className="text-[11px] text-slate-400">
                      Role: {cand.appliedRole} · Onboarded ID: <strong className="font-mono text-emerald-600">{cand.convertedStaffId || 'FAC-2026-ACTIVE'}</strong>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Active Employee</span>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Post Opening Modal */}
      {isOpeningModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-md rounded-2xl border shadow-2xl p-6 animate-in zoom-in-95 duration-150"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                <h3 className="text-base font-bold">Post New Faculty Vacancy</h3>
              </div>
              <button onClick={() => setIsOpeningModalOpen(false)} className="p-1 rounded text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOpening} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Job Opening Title *</label>
                <input
                  type="text"
                  value={openingTitle}
                  onChange={(e) => setOpeningTitle(e.target.value)}
                  placeholder="e.g. Senior AP Chemistry Faculty"
                  className="w-full px-3 py-2 rounded-lg border text-xs outline-hidden"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                  required
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Department</label>
                <select
                  value={openingDept}
                  onChange={(e) => setOpeningDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-xs outline-hidden font-medium"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                >
                  {INITIAL_HR_DEPARTMENTS.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Open Positions</label>
                  <input
                    type="number"
                    min="1"
                    value={openingCount}
                    onChange={(e) => setOpeningCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border text-xs outline-hidden font-mono"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Experience Level</label>
                  <input
                    type="text"
                    value={openingExp}
                    onChange={(e) => setOpeningExp(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-xs outline-hidden"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  type="button"
                  onClick={() => setIsOpeningModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border text-xs font-medium"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  Publish Vacancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Convert to Staff Confirmation Modal */}
      {hiringCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-md rounded-2xl border shadow-2xl p-6 animate-in zoom-in-95 duration-150"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold">Convert Candidate to Active Staff</h3>
              </div>
              <button onClick={() => setHiringCandidate(null)} className="p-1 rounded text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs mb-5">
              <p className="text-slate-500">
                Confirm institutional onboarding for <strong>{hiringCandidate.name}</strong> as <strong>{hiringCandidate.appliedRole}</strong>.
              </p>
              <div className="p-3 rounded-lg border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                This action will automatically generate an active employee ID and add them to the master staff directory, preserving their candidate dossier.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setHiringCandidate(null)}
                className="px-3 py-1.5 rounded-lg border text-xs font-medium"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConvertCandidateToStaff}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm & Onboard Staff</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
