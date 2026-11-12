import React, { useState, useEffect } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { FeeStructure, FeeCategory, FeeFrequency } from '../../types/finance';
import {
  SlidersHorizontal,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Edit3,
  X,
  Calendar,
  Layers,
  Save,
  ShieldAlert,
} from 'lucide-react';

const STORAGE_KEY_FEE_STRUCTURES = 'schlar_fee_structures_v1';

const INITIAL_FEE_STRUCTURES: FeeStructure[] = [
  {
    id: 'fs-1',
    name: 'Senior High School Core Tuition (Grades 10–12)',
    academicYear: '2026–2027',
    classIds: ['cls-gr10', 'cls-gr11', 'cls-gr12'],
    classNameList: ['Grade 10', 'Grade 11', 'Grade 12'],
    category: 'Tuition',
    amount: 3600,
    frequency: 'Annual',
    dueDate: '2026-11-01',
    effectiveFrom: '2026-09-01',
    status: 'active',
    description: 'Comprehensive senior secondary instructional framework, faculty mentoring, and examination access.',
  },
  {
    id: 'fs-2',
    name: 'Middle School Standard Tuition (Grades 7–9)',
    academicYear: '2026–2027',
    classIds: ['cls-gr7', 'cls-gr8', 'cls-gr9'],
    classNameList: ['Grade 7', 'Grade 8', 'Grade 9'],
    category: 'Tuition',
    amount: 3200,
    frequency: 'Annual',
    dueDate: '2026-11-01',
    effectiveFrom: '2026-09-01',
    status: 'active',
    description: 'Middle school academic syllabus, homeroom guidance, and formative testing series.',
  },
  {
    id: 'fs-3',
    name: 'Primary Elementary Tuition (Grades 1–6)',
    academicYear: '2026–2027',
    classIds: ['cls-gr1', 'cls-gr2', 'cls-gr3', 'cls-gr4', 'cls-gr5', 'cls-gr6'],
    classNameList: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'],
    category: 'Tuition',
    amount: 2400,
    frequency: 'Annual',
    dueDate: '2026-11-01',
    effectiveFrom: '2026-09-01',
    status: 'active',
    description: 'Elementary foundation program, literacy modules, and developmental art instruction.',
  },
  {
    id: 'fs-4',
    name: 'STEM Physics & Robotics Lab Consumables Fee',
    academicYear: '2026–2027',
    classIds: ['cls-gr8', 'cls-gr9', 'cls-gr10', 'cls-gr11', 'cls-gr12'],
    classNameList: ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    category: 'Laboratory',
    amount: 450,
    frequency: 'Annual',
    dueDate: '2026-10-15',
    effectiveFrom: '2026-09-01',
    status: 'active',
    description: 'Specialized lab apparatus, electronic components, microcontrollers, and chemicals.',
  },
  {
    id: 'fs-5',
    name: 'Digital Library & Campus Network License',
    academicYear: '2026–2027',
    classIds: ['cls-gr7', 'cls-gr8', 'cls-gr9', 'cls-gr10', 'cls-gr11', 'cls-gr12'],
    classNameList: ['All Secondary Grades'],
    category: 'Library',
    amount: 220,
    frequency: 'Annual',
    dueDate: '2026-10-15',
    effectiveFrom: '2026-09-01',
    status: 'active',
    description: 'JSTOR journal access, digital textbook subscriptions, and fiber WiFi infrastructure.',
  },
  {
    id: 'fs-6',
    name: 'Metropolitan Transit Zone A Shuttle Pass',
    academicYear: '2026–2027',
    classIds: ['cls-all'],
    classNameList: ['All Registered Routes'],
    category: 'Transport',
    amount: 600,
    frequency: 'Termly',
    dueDate: '2026-11-15',
    effectiveFrom: '2026-09-01',
    status: 'active',
    description: 'Daily morning and afternoon bus service with GPS tracking and security supervisor.',
  },
];

export const AccountantFeeStructureModule: React.FC = () => {
  const { classes, feeStructures: structures, addFeeStructure, updateFeeStructure } = useSchoolData();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStructure, setEditingStructure] = useState<FeeStructure | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formAcademicYear, setFormAcademicYear] = useState('2026–2027');
  const [formCategory, setFormCategory] = useState<FeeCategory>('Tuition');
  const [formAmount, setFormAmount] = useState<number>(1000);
  const [formFrequency, setFormFrequency] = useState<FeeFrequency>('Annual');
  const [formDueDate, setFormDueDate] = useState('');
  const [formEffectiveFrom, setFormEffectiveFrom] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formClasses, setFormClasses] = useState<string[]>([]);
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const openCreateModal = () => {
    setEditingStructure(null);
    setFormName('');
    setFormAcademicYear('2026–2027');
    setFormCategory('Tuition');
    setFormAmount(1200);
    setFormFrequency('Annual');
    setFormDueDate('2026-11-01');
    setFormEffectiveFrom('2026-09-01');
    setFormDescription('');
    setFormClasses(['cls-gr8']);
    setFormFeedback(null);
    setShowModal(true);
  };

  const openEditModal = (fs: FeeStructure) => {
    setEditingStructure(fs);
    setFormName(fs.name);
    setFormAcademicYear(fs.academicYear);
    setFormCategory(fs.category);
    setFormAmount(fs.amount);
    setFormFrequency(fs.frequency);
    setFormDueDate(fs.dueDate);
    setFormEffectiveFrom(fs.effectiveFrom);
    setFormDescription(fs.description || '');
    setFormClasses(fs.classIds);
    setFormFeedback(null);
    setShowModal(true);
  };

  const handleSaveStructure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormFeedback({ type: 'error', message: 'Fee structure title is required.' });
      return;
    }
    if (formAmount <= 0) {
      setFormFeedback({ type: 'error', message: 'Fee amount must be greater than zero.' });
      return;
    }
    if (!formDueDate) {
      setFormFeedback({ type: 'error', message: 'Due date is required.' });
      return;
    }

    const classNames = formClasses.map(
      (cid) => classes.find((c) => c.id === cid)?.name || cid
    );

    if (editingStructure) {
      // Edit existing
      const res = updateFeeStructure(editingStructure.id, {
        name: formName.trim(),
        academicYear: formAcademicYear,
        category: formCategory,
        amount: formAmount,
        frequency: formFrequency,
        dueDate: formDueDate,
        effectiveFrom: formEffectiveFrom,
        description: formDescription.trim(),
        classIds: formClasses,
        classNameList: classNames,
      });

      if (res.isValid) {
        setFormFeedback({
          type: 'success',
          message: 'Fee structure updated successfully. Existing historical obligations are preserved.',
        });
      } else {
        setFormFeedback({ type: 'error', message: res.message || 'Failed to update fee structure.' });
        return;
      }
    } else {
      // Create new
      const res = addFeeStructure({
        name: formName.trim(),
        academicYear: formAcademicYear,
        category: formCategory,
        amount: formAmount,
        frequency: formFrequency,
        dueDate: formDueDate,
        effectiveFrom: formEffectiveFrom,
        description: formDescription.trim(),
        classIds: formClasses,
        classNameList: classNames,
        status: 'active',
      });

      if (res.isValid) {
        setFormFeedback({
          type: 'success',
          message: 'New fee structure registered successfully.',
        });
      } else {
        setFormFeedback({ type: 'error', message: res.message || 'Failed to register fee structure.' });
        return;
      }
    }

    setTimeout(() => {
      setShowModal(false);
      setFormFeedback(null);
    }, 1200);
  };

  const toggleStatus = (id: string) => {
    const fs = structures.find((s) => s.id === id);
    if (!fs) return;
    const nextStatus = fs.status === 'active' ? 'inactive' : 'active';
    updateFeeStructure(id, { status: nextStatus as any });
  };

  const filteredStructures = structures.filter((fs) => {
    if (filterCategory !== 'all' && fs.category.toLowerCase() !== filterCategory.toLowerCase()) {
      return false;
    }
    if (
      searchQuery &&
      !fs.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !fs.category.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1"
            style={{ color: 'var(--color-secondary)' }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Financial Configuration</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Fee Structure Management
          </h1>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            Configure institutional tuition rates, laboratory charges, and installment frequencies.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white rounded-lg shadow-sm hover:opacity-95 transition-opacity self-start sm:self-auto"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Plus className="w-4 h-4" />
          <span>New Fee Structure</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="p-4 rounded-xl border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'Tuition', 'Laboratory', 'Library', 'Transport', 'Extracurricular'] as const).map((cat) => {
            const isSelected = filterCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors capitalize ${
                  isSelected ? 'text-white' : 'border hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                style={{
                  backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent',
                  borderColor: 'var(--color-border)',
                  color: isSelected ? '#FFFFFF' : 'var(--color-text)',
                }}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search fee structures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border text-xs"
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
        </div>
      </div>

      {/* Fee Structures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStructures.map((fs) => (
          <div
            key={fs.id}
            className="p-5 rounded-2xl border shadow-xs hover:shadow-md transition-all space-y-3"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded border"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-secondary)',
                    }}
                  >
                    {fs.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    {fs.academicYear} · {fs.frequency}
                  </span>
                </div>
                <h3 className="font-extrabold text-sm" style={{ color: 'var(--color-text)' }}>
                  {fs.name}
                </h3>
              </div>

              <div className="text-right">
                <span
                  className="text-lg font-mono font-extrabold block"
                  style={{ color: 'var(--color-primary)' }}
                >
                  ₹{fs.amount.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 block">{fs.frequency}</span>
              </div>
            </div>

            {fs.description && (
              <p className="text-xs text-slate-500 leading-relaxed">
                {fs.description}
              </p>
            )}

            <div
              className="p-2.5 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] text-xs flex flex-wrap items-center justify-between gap-2"
            >
              <span className="text-slate-500">
                Cohorts: <strong className="text-slate-700 dark:text-slate-200">{fs.classNameList.join(', ')}</strong>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Due: {fs.dueDate}
              </span>
            </div>

            <div
              className="pt-2 border-t flex items-center justify-between text-xs"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <button
                onClick={() => toggleStatus(fs.id)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  fs.status === 'active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {fs.status === 'active' ? 'Active Matrix' : 'Deactivated'}
              </button>

              <button
                onClick={() => openEditModal(fs)}
                className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300 hover:underline"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Matrix</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create / Edit Fee Structure */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-lg rounded-2xl border shadow-2xl p-6 animate-in zoom-in-95 duration-150 space-y-4"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <h3 className="text-base font-extrabold" style={{ color: 'var(--color-text)' }}>
                  {editingStructure ? 'Edit Fee Structure' : 'Create New Fee Structure'}
                </h3>
                <span className="text-xs text-slate-500">
                  Defines standard assessed rates across selected student cohorts.
                </span>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formFeedback && (
              <div
                className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                  formFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {formFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{formFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSaveStructure} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Fee Structure Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Secondary Physics Lab Consumables"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2 rounded-lg border text-xs"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Fee Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as FeeCategory)}
                    className="w-full p-2 rounded-lg border text-xs"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                  >
                    <option value="Tuition">Tuition</option>
                    <option value="Admission">Admission</option>
                    <option value="Laboratory">Laboratory</option>
                    <option value="Library">Library</option>
                    <option value="Transport">Transport</option>
                    <option value="Extracurricular">Extracurricular</option>
                    <option value="Facility">Facility</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Assessed Amount (₹ INR) *</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={formAmount}
                    onChange={(e) => setFormAmount(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg border text-xs font-mono font-bold"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Billing Frequency *</label>
                  <select
                    value={formFrequency}
                    onChange={(e) => setFormFrequency(e.target.value as FeeFrequency)}
                    className="w-full p-2 rounded-lg border text-xs"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                  >
                    <option value="Annual">Annual</option>
                    <option value="Termly">Termly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="One-Time">One-Time</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Standard Due Date *</label>
                  <input
                    type="date"
                    required
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full p-2 rounded-lg border text-xs"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Description / Policy Details</label>
                <textarea
                  rows={2}
                  placeholder="Notes regarding late fees, installment options, or required materials..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-2 rounded-lg border text-xs"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>

              <div
                className="p-3 rounded-lg border bg-black/[0.015] text-[11px] text-slate-500"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Modifying this matrix preserves historical obligations already issued to enrolled students.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-2 rounded-lg border text-xs font-semibold"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingStructure ? 'Save Changes' : 'Create Structure'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
