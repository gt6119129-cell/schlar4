import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { INITIAL_HR_DEPARTMENTS, INITIAL_HR_DESIGNATIONS } from '../../data/initialHRData';
import { StaffMember } from '../../types/school';
import {
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Building2,
  Award,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  X,
} from 'lucide-react';

interface HRAddStaffModuleProps {
  onSuccess?: () => void;
}

export const HRAddStaffModule: React.FC<HRAddStaffModuleProps> = ({ onSuccess }) => {
  const { staff } = useSchoolData();

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [staffId, setStaffId] = useState(`FAC-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [department, setDepartment] = useState('Mathematics');
  const [designation, setDesignation] = useState('Faculty Teacher');
  const [joinDate, setJoinDate] = useState(new Date().toISOString().split('T')[0]);
  const [assignedSubjects, setAssignedSubjects] = useState('Mathematics, Algebra');
  const [formError, setFormError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleNextStep1 = () => {
    if (!name.trim()) {
      setFormError('Please enter the staff member full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid institution email address.');
      return;
    }
    setFormError(null);
    setCurrentStep(2);
  };

  const handleNextStep2 = () => {
    // Check duplicate ID
    const exists = staff.some((s) => s.staffId.toLowerCase() === staffId.toLowerCase());
    if (exists) {
      setFormError(`Employee ID "${staffId}" is already assigned to an existing staff member.`);
      return;
    }
    setFormError(null);
    setCurrentStep(3);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newStaff: StaffMember = {
      id: `staff-${Date.now()}`,
      staffId,
      name,
      designation,
      department,
      email,
      phone: phone || '+1 (555) 000-0000',
      status: 'active',
      joinDate,
      assignedSubjects: assignedSubjects.split(',').map((s) => s.trim()).filter(Boolean),
      assignedSections: [
        { sectionId: 'sec-10a', sectionName: 'Section A', subject: assignedSubjects.split(',')[0]?.trim() || 'General' },
      ],
    };

    // Push into demo records
    staff.unshift(newStaff);

    setSuccessNotice(`Staff member "${name}" registered with ID ${staffId} in the ${department} department.`);
    setTimeout(() => {
      if (onSuccess) onSuccess();
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded tracking-wide uppercase border text-teal-700 bg-teal-50 dark:bg-teal-950/30"
              style={{ borderColor: 'var(--color-border)' }}
            >
              Onboarding & Talent Entry
            </span>
            <span className="text-xs text-slate-400">Staff Registration Workflow</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Add Staff Member
          </h1>
          <p className="text-sm mt-1 max-w-2xl text-slate-500">
            Register new academic faculty, administrative officers, and campus personnel with validated role attributes.
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div
        className="p-4 rounded-xl border shadow-xs max-w-2xl mx-auto"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center justify-between">
          {[
            { step: 1, label: 'Personal & Contact' },
            { step: 2, label: 'Department & Role' },
            { step: 3, label: 'Assignments & Confirm' },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep === item.step
                    ? 'text-white'
                    : currentStep > item.step
                    ? 'bg-emerald-600 text-white'
                    : 'bg-black/10 dark:bg-white/10 text-slate-400'
                }`}
                style={currentStep === item.step ? { backgroundColor: 'var(--color-primary)' } : {}}
              >
                {currentStep > item.step ? <CheckCircle2 className="w-4 h-4" /> : item.step}
              </div>
              <span
                className={`text-xs hidden sm:inline ${
                  currentStep === item.step ? 'font-bold' : 'text-slate-400'
                }`}
                style={currentStep === item.step ? { color: 'var(--color-text)' } : {}}
              >
                {item.label}
              </span>
              {item.step < 3 && <div className="w-12 sm:w-20 h-0.5 bg-slate-200 dark:bg-slate-700" />}
            </div>
          ))}
        </div>
      </div>

      {/* Step Container Form */}
      <div
        className="p-6 rounded-xl border shadow-xs max-w-2xl mx-auto space-y-5"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        {formError && (
          <div className="p-3 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {successNotice && (
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-2 text-xs font-semibold animate-in zoom-in-95">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Step 1: Personal & Contact */}
        {currentStep === 1 && (
          <div className="space-y-4 text-xs">
            <div className="border-b pb-2" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                Step 1: Personal & Contact Details
              </h3>
            </div>

            <div>
              <label className="font-semibold block mb-1">Full Legal Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Jennifer Adams"
                className="w-full px-3 py-2 rounded-lg border text-xs outline-hidden"
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
                <label className="font-semibold block mb-1">Institutional Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. j.adams@schlar.edu"
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
                <label className="font-semibold block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 789-1122"
                  className="w-full px-3 py-2 rounded-lg border text-xs outline-hidden"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={handleNextStep1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-xs"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <span>Continue to Role & Department</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Department & Role */}
        {currentStep === 2 && (
          <div className="space-y-4 text-xs">
            <div className="border-b pb-2" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                Step 2: Department & Designation Assignment
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">Unique Employee ID *</label>
                <input
                  type="text"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-xs font-mono font-bold outline-hidden"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                  required
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Campus Join Date</label>
                <input
                  type="date"
                  value={joinDate}
                  onChange={(e) => setJoinDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-xs outline-hidden"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-xs outline-hidden font-medium"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                {INITIAL_HR_DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1">Official Designation</label>
              <select
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-xs outline-hidden font-medium"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                {INITIAL_HR_DESIGNATIONS.map((des) => (
                  <option key={des.id} value={des.title}>
                    {des.title} ({des.level})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep2}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-xs"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <span>Continue to Assignments</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Assignments & Confirmation */}
        {currentStep === 3 && (
          <form onSubmit={handleFinalSubmit} className="space-y-4 text-xs">
            <div className="border-b pb-2" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                Step 3: Academic Assignments & Confirmation
              </h3>
            </div>

            <div>
              <label className="font-semibold block mb-1">Assigned Subjects (comma-separated)</label>
              <input
                type="text"
                value={assignedSubjects}
                onChange={(e) => setAssignedSubjects(e.target.value)}
                placeholder="e.g. Mathematics, Calculus, Statistics"
                className="w-full px-3 py-2 rounded-lg border text-xs outline-hidden"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            <div className="p-3.5 rounded-lg border bg-black/[0.02] dark:bg-white/[0.02] space-y-1.5" style={{ borderColor: 'var(--color-border)' }}>
              <div className="font-bold text-xs" style={{ color: 'var(--color-text)' }}>
                Summary of New Personnel Record:
              </div>
              <div className="text-[11px] text-slate-500">Name: <strong className="text-slate-800 dark:text-slate-200">{name}</strong></div>
              <div className="text-[11px] text-slate-500">ID: <strong className="font-mono text-slate-800 dark:text-slate-200">{staffId}</strong></div>
              <div className="text-[11px] text-slate-500">Department: <strong className="text-slate-800 dark:text-slate-200">{department}</strong></div>
              <div className="text-[11px] text-slate-500">Designation: <strong className="text-slate-800 dark:text-slate-200">{designation}</strong></div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold text-white shadow-xs hover:opacity-90"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Register Staff Member</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
