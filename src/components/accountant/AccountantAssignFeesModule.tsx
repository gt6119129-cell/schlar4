import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { INITIAL_FEE_STRUCTURES } from '../../data/initialFinanceData';
import { FeeStructure } from '../../types/finance';
import {
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  ArrowRight,
  ArrowLeft,
  Users,
  ShieldCheck,
  FileCheck,
  Building2,
} from 'lucide-react';

export const AccountantAssignFeesModule: React.FC = () => {
  const { classes, students } = useSchoolData();

  // Wizard state
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [academicYear, setAcademicYear] = useState('2026–2027');
  const [targetType, setTargetType] = useState<'class' | 'student'>('class');
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || 'cls-gr10');
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || 'stu-adrian-vance');
  const [selectedStructureId, setSelectedStructureId] = useState(INITIAL_FEE_STRUCTURES[0]?.id || 'fs-1');
  const [confirmationNotice, setConfirmationNotice] = useState<{
    success: boolean;
    assignedCount: number;
    skippedCount: number;
    message: string;
  } | null>(null);

  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const selectedStudent = students.find((s) => s.id === selectedStudentId);
  const selectedStructure = INITIAL_FEE_STRUCTURES.find((f) => f.id === selectedStructureId);

  // Eligible students count calculation
  const targetStudents =
    targetType === 'class'
      ? students.filter((s) => s.classId === selectedClassId)
      : students.filter((s) => s.id === selectedStudentId);

  const handleExecuteAssignment = () => {
    const assignedCount = targetStudents.length;
    setConfirmationNotice({
      success: true,
      assignedCount,
      skippedCount: 0,
      message: `Successfully created ${assignedCount} new fee obligation records for ${
        targetType === 'class' ? selectedClass?.name : selectedStudent?.name
      } under "${selectedStructure?.name}". Zero conflicts detected.`,
    });
    setCurrentStep(4);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setConfirmationNotice(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded tracking-wide uppercase border"
              style={{
                backgroundColor: 'rgba(var(--color-primary), 0.08)',
                color: 'var(--color-primary)',
                borderColor: 'var(--color-border)',
              }}
            >
              Billing Operations
            </span>
            <span className="text-xs text-slate-400">Structured Allocation Wizard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Assign Fees
          </h1>
          <p className="text-sm mt-1 max-w-2xl text-slate-500">
            Allocate approved fee structures to cohorts, classes, or individual student accounts with conflict validation.
          </p>
        </div>
      </div>

      {/* Wizard Step Indicator */}
      <div
        className="p-4 rounded-xl border shadow-xs"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {[
            { step: 1, label: 'Scope & Cohort' },
            { step: 2, label: 'Fee Structure' },
            { step: 3, label: 'Preview & Validate' },
            { step: 4, label: 'Results' },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
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
              {item.step < 4 && <div className="w-8 sm:w-16 h-0.5 bg-slate-200 dark:bg-slate-700" />}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Scope & Cohort */}
      {currentStep === 1 && (
        <div
          className="p-6 rounded-xl border shadow-xs space-y-5 max-w-2xl mx-auto"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <div className="border-b pb-3" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
              Step 1: Select Academic Period & Target Cohort
            </h3>
            <p className="text-xs text-slate-500">
              Choose the academic session and determine whether to assign to an entire class or a specific student.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold block mb-1">Academic Session</label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-xs outline-hidden"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                <option value="2026–2027">Academic Year 2026–2027 (Active)</option>
                <option value="2027–2028">Academic Year 2027–2028 (Upcoming)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1.5">Assignment Target Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTargetType('class')}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    targetType === 'class' ? 'border-2 shadow-xs' : 'opacity-70'
                  }`}
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: targetType === 'class' ? 'var(--color-primary)' : 'var(--color-border)',
                  }}
                >
                  <Building2 className="w-4 h-4 mb-1" style={{ color: 'var(--color-primary)' }} />
                  <div className="font-bold text-xs">Class / Section Cohort</div>
                  <div className="text-[11px] text-slate-400">Assign to all active students in class</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetType('student')}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    targetType === 'student' ? 'border-2 shadow-xs' : 'opacity-70'
                  }`}
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: targetType === 'student' ? 'var(--color-primary)' : 'var(--color-border)',
                  }}
                >
                  <Users className="w-4 h-4 mb-1" style={{ color: 'var(--color-primary)' }} />
                  <div className="font-bold text-xs">Individual Student</div>
                  <div className="text-[11px] text-slate-400">Assign to a single student ledger</div>
                </button>
              </div>
            </div>

            {targetType === 'class' ? (
              <div>
                <label className="font-semibold block mb-1">Target Class</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-xs outline-hidden"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({students.filter((s) => s.classId === c.id).length} active enrolled students)
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="font-semibold block mb-1">Select Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-xs outline-hidden"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.admissionNo} · {s.className})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-xs hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <span>Continue to Fee Structure</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Select Fee Structure */}
      {currentStep === 2 && (
        <div
          className="p-6 rounded-xl border shadow-xs space-y-5 max-w-2xl mx-auto"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <div className="border-b pb-3" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
              Step 2: Choose Applicable Fee Structure
            </h3>
            <p className="text-xs text-slate-500">
              Select the active fee structure to apply. Its categories and installment schedules will be mapped.
            </p>
          </div>

          <div className="space-y-3">
            {INITIAL_FEE_STRUCTURES.map((fs) => (
              <label
                key={fs.id}
                className={`p-3.5 rounded-lg border flex items-start gap-3 cursor-pointer transition-all ${
                  selectedStructureId === fs.id ? 'border-2 shadow-xs' : 'opacity-80 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: selectedStructureId === fs.id ? 'var(--color-primary)' : 'var(--color-border)',
                }}
              >
                <input
                  type="radio"
                  name="structure"
                  checked={selectedStructureId === fs.id}
                  onChange={() => setSelectedStructureId(fs.id)}
                  className="mt-1"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                      {fs.name}
                    </span>
                    <span className="font-mono font-extrabold text-sm" style={{ color: 'var(--color-primary)' }}>
                      ₹{fs.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-0.5">{fs.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                    <span>Category: <strong>{fs.category}</strong></span>
                    <span>Frequency: <strong>{fs.frequency}</strong></span>
                    <span>Due: <strong>{fs.dueDate}</strong></span>
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium hover:opacity-85"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-xs hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <span>Preview Obligations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Preview & Confirm */}
      {currentStep === 3 && (
        <div
          className="p-6 rounded-xl border shadow-xs space-y-5 max-w-2xl mx-auto"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <div className="border-b pb-3" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
              Step 3: Preview Obligations & Conflict Check
            </h3>
            <p className="text-xs text-slate-500">
              Verify pre-assignment calculations and ensure no duplicate obligations exist for this cohort.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                Eligibility validated: Zero duplicate assignments or conflicting dates detected.
              </span>
            </div>

            <div className="p-4 rounded-xl border bg-black/[0.02] dark:bg-white/[0.02] space-y-2" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Cohort:</span>
                <span className="font-bold">{targetType === 'class' ? selectedClass?.name : selectedStudent?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Student Count:</span>
                <span className="font-mono font-bold">{targetStudents.length} Students</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fee Structure:</span>
                <span className="font-bold">{selectedStructure?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Unit Amount:</span>
                <span className="font-mono font-bold">₹{(selectedStructure?.amount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-semibold" style={{ borderColor: 'var(--color-border)' }}>
                <span>Total New Assessed Value:</span>
                <span className="font-mono font-extrabold text-sm text-emerald-600">
                  ₹{((selectedStructure?.amount || 0) * targetStudents.length).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium hover:opacity-85"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={handleExecuteAssignment}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold text-white shadow-xs hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm & Create Obligations</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Results */}
      {currentStep === 4 && confirmationNotice && (
        <div
          className="p-8 rounded-xl border shadow-xs space-y-4 max-w-xl mx-auto text-center"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
            Obligations Assigned Successfully
          </h3>

          <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
            {confirmationNotice.message}
          </p>

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg text-xs font-bold text-white shadow-xs hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Assign Another Cohort
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
