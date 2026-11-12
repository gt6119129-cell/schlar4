import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { INITIAL_HR_DEPARTMENTS } from '../../data/initialHRData';
import { HRDepartment } from '../../types/hr';
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Users,
  Edit3,
  X,
  ShieldAlert,
} from 'lucide-react';

export const HRDepartmentsModule: React.FC = () => {
  const { staff } = useSchoolData();
  const [departments, setDepartments] = useState<HRDepartment[]>(INITIAL_HR_DEPARTMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<HRDepartment | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [headName, setHeadName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredDepts = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingDept(null);
    setName('');
    setCode('');
    setHeadName('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dept: HRDepartment) => {
    setEditingDept(dept);
    setName(dept.name);
    setCode(dept.code);
    setHeadName(dept.headOfDepartmentName || '');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      setFormError('Department name and code are required.');
      return;
    }

    if (editingDept) {
      setDepartments((prev) =>
        prev.map((d) =>
          d.id === editingDept.id
            ? { ...d, name, code, headOfDepartmentName: headName }
            : d
        )
      );
      setToastMessage(`Department "${name}" updated successfully.`);
    } else {
      const newDept: HRDepartment = {
        id: `dept-${Date.now()}`,
        name,
        code: code.toUpperCase(),
        headOfDepartmentName: headName || undefined,
        staffCount: 0,
        status: 'active',
      };
      setDepartments([newDept, ...departments]);
      setToastMessage(`New department "${name}" created.`);
    }

    setIsModalOpen(false);
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
              Academic & Operational Units
            </span>
            <span className="text-xs text-slate-400">Institutional Organization</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Departments
          </h1>
          <p className="text-sm mt-1 max-w-2xl text-slate-500">
            Define academic disciplines, assign department heads, and monitor faculty distribution across institutional departments.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs hover:opacity-90"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Search */}
      <div
        className="p-4 rounded-xl border shadow-xs"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search departments by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border text-xs outline-hidden"
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDepts.map((d) => {
          // Count assigned staff
          const actualStaffCount = staff.filter((s) => s.department === d.name).length || d.staffCount;
          return (
            <div
              key={d.id}
              className="p-5 rounded-xl border shadow-xs flex flex-col justify-between space-y-4 hover:border-primary transition-all"
              style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                      style={{
                        backgroundColor: 'rgba(var(--color-primary), 0.1)',
                        color: 'var(--color-primary)',
                      }}
                    >
                      {d.code}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                        {d.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-mono">CODE: {d.code}</span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                    Active
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <div>
                    Head of Department: <strong className="text-slate-700 dark:text-slate-300">{d.headOfDepartmentName || 'Pending Appointment'}</strong>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Users className="w-3.5 h-3.5" />
                    <span>{actualStaffCount} Assigned Faculty & Staff</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  onClick={() => handleOpenEdit(d)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold border hover:bg-black/5 dark:hover:bg-white/5"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Department</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Department Modal */}
      {isModalOpen && (
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
                <Building2 className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                <h3 className="text-base font-bold">
                  {editingDept ? 'Edit Department' : 'Create New Department'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {formError && (
                <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                  {formError}
                </div>
              )}

              <div>
                <label className="font-semibold block mb-1">Department Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Computer Science & AI"
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
                <label className="font-semibold block mb-1">Short Department Code *</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. CS"
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
                <label className="font-semibold block mb-1">Head of Department (Lead Faculty)</label>
                <input
                  type="text"
                  value={headName}
                  onChange={(e) => setHeadName(e.target.value)}
                  placeholder="e.g. Dr. Arthur Sterling"
                  className="w-full px-3 py-2 rounded-lg border text-xs outline-hidden"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
                  {editingDept ? 'Save Changes' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
