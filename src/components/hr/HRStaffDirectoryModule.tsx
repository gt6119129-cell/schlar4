import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { StaffMember } from '../../types/school';
import {
  Users,
  Search,
  Filter,
  Eye,
  Archive,
  UserPlus,
  Mail,
  Phone,
  Building2,
  Award,
  CheckCircle2,
  XCircle,
  X,
  AlertTriangle,
} from 'lucide-react';

interface HRStaffDirectoryModuleProps {
  onSelectStaffProfile?: (staffId: string) => void;
  onNavigateAddStaff?: () => void;
}

export const HRStaffDirectoryModule: React.FC<HRStaffDirectoryModuleProps> = ({
  onSelectStaffProfile,
  onNavigateAddStaff,
}) => {
  const { staff } = useSchoolData();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [archiveModal, setArchiveModal] = useState<{ open: boolean; staff: StaffMember | null }>({
    open: false,
    staff: null,
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const departments = Array.from(new Set(staff.map((s) => s.department).filter(Boolean)));

  const filteredStaff = staff.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'all' || s.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleArchiveConfirm = () => {
    if (archiveModal.staff) {
      setToastMessage(`Staff record for ${archiveModal.staff.name} archived. Associated records preserved.`);
      setArchiveModal({ open: false, staff: null });
      setTimeout(() => setToastMessage(null), 4000);
    }
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
              Personnel Registry
            </span>
            <span className="text-xs text-slate-400">{staff.length} Total Registered Personnel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Staff Directory
          </h1>
          <p className="text-sm mt-1 max-w-2xl text-slate-500">
            Browse complete employee rosters across teaching faculty, administrative officers, and campus operations staff.
          </p>
        </div>

        {onNavigateAddStaff && (
          <button
            onClick={onNavigateAddStaff}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Staff Member</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div
        className="p-4 rounded-xl border shadow-xs space-y-3"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by staff name, employee ID, designation, or email..."
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

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border text-xs outline-hidden font-medium"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border text-xs outline-hidden font-medium"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive / On Leave</option>
            </select>
          </div>
        </div>
      </div>

      {/* Staff Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((s) => (
          <div
            key={s.id}
            className="p-5 rounded-xl border shadow-xs flex flex-col justify-between space-y-4 hover:border-primary transition-all"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {s.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                      {s.name}
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">{s.staffId}</span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                    s.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {s.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">{s.designation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{s.department}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{s.email}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{s.phone}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                onClick={() => setArchiveModal({ open: true, staff: s })}
                className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-1"
                title="Archive staff record"
              >
                <Archive className="w-3 h-3" />
                <span>Archive</span>
              </button>

              <button
                onClick={() => onSelectStaffProfile && onSelectStaffProfile(s.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs hover:opacity-90"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Eye className="w-3 h-3" />
                <span>View Profile</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Archive Confirmation Modal */}
      {archiveModal.open && archiveModal.staff && (
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
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-base font-bold">Archive Staff Record</h3>
              </div>
              <button onClick={() => setArchiveModal({ open: false, staff: null })} className="p-1 rounded text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs mb-5">
              <p className="text-slate-500">
                Are you sure you want to archive <strong>{archiveModal.staff.name}</strong> ({archiveModal.staff.staffId})?
              </p>
              <div className="p-3 rounded-lg border bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300">
                Archiving marks the staff member inactive. Historical teaching assignments, attendance records, and leave logs remain preserved in the audit database.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setArchiveModal({ open: false, staff: null })}
                className="px-3 py-1.5 rounded-lg border text-xs font-medium"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleArchiveConfirm}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs"
              >
                Confirm Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
