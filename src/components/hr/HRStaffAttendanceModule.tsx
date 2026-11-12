import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { INITIAL_STAFF_ATTENDANCE } from '../../data/initialHRData';
import { StaffAttendanceLog } from '../../types/hr';
import {
  CheckSquare,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Edit3,
  X,
  FileCheck,
} from 'lucide-react';

interface HRStaffAttendanceModuleProps {
  onNavigateCorrections?: () => void;
}

export const HRStaffAttendanceModule: React.FC<HRStaffAttendanceModuleProps> = ({
  onNavigateCorrections,
}) => {
  const { staff } = useSchoolData();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceLogs, setAttendanceLogs] = useState<StaffAttendanceLog[]>(INITIAL_STAFF_ATTENDANCE);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick punch modal
  const [editModal, setEditModal] = useState<{ open: boolean; log: StaffAttendanceLog | null }>({
    open: false,
    log: null,
  });

  const departments = Array.from(new Set(staff.map((s) => s.department).filter(Boolean)));

  // Combine staff with today's attendance logs
  const rosterWithAttendance = staff.map((s) => {
    const existingLog = attendanceLogs.find((l) => l.staffId === s.id);
    return {
      staff: s,
      log: existingLog || {
        id: `gen-${s.id}`,
        staffId: s.id,
        staffName: s.name,
        department: s.department,
        designation: s.designation,
        date: selectedDate,
        status: s.status === 'active' ? ('present' as const) : ('on_leave' as const),
        checkInTime: s.status === 'active' ? '07:45 AM' : undefined,
        checkOutTime: s.status === 'active' ? '04:15 PM' : undefined,
        session: 'Full Day' as const,
      },
    };
  });

  const filteredRoster = rosterWithAttendance.filter(({ staff: s, log }) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.staffId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'all' || s.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  // Calculate metrics
  const presentCount = rosterWithAttendance.filter((r) => r.log.status === 'present').length;
  const lateCount = rosterWithAttendance.filter((r) => r.log.status === 'late').length;
  const onLeaveCount = rosterWithAttendance.filter((r) => r.log.status === 'on_leave').length;

  const handleUpdateStatus = (staffId: string, newStatus: StaffAttendanceLog['status']) => {
    setAttendanceLogs((prev) => {
      const idx = prev.findIndex((l) => l.staffId === staffId);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], status: newStatus };
        return updated;
      } else {
        const s = staff.find((x) => x.id === staffId);
        return [
          ...prev,
          {
            id: `att-${Date.now()}`,
            staffId,
            staffName: s?.name || '',
            department: s?.department || '',
            designation: s?.designation || '',
            date: selectedDate,
            status: newStatus,
            session: 'Full Day',
          },
        ];
      }
    });

    setToastMessage(`Attendance status updated for staff member.`);
    setTimeout(() => setToastMessage(null), 3000);
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
              Time & Punctuality
            </span>
            <span className="text-xs text-slate-400">Campus Check-In Register</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Staff Attendance
          </h1>
          <p className="text-sm mt-1 max-w-2xl text-slate-500">
            Real-time daily presence tracking, check-in punch verification, and leave cross-referencing.
          </p>
        </div>

        {onNavigateCorrections && (
          <button
            onClick={onNavigateCorrections}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold hover:opacity-85 shadow-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Attendance Corrections</span>
          </button>
        )}
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border shadow-xs" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <span className="text-xs font-medium text-slate-400">Faculty & Staff Present</span>
          <div className="my-1.5 text-2xl font-bold font-mono text-emerald-600">
            {presentCount} / {staff.length}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">
            {Math.round((presentCount / (staff.length || 1)) * 100)}% attendance rate
          </span>
        </div>

        <div className="p-4 rounded-xl border shadow-xs" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <span className="text-xs font-medium text-slate-400">Late Arrivals</span>
          <div className="my-1.5 text-2xl font-bold font-mono text-amber-600">
            {lateCount}
          </div>
          <span className="text-[11px] text-slate-400">Recorded after 08:00 AM bell</span>
        </div>

        <div className="p-4 rounded-xl border shadow-xs" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <span className="text-xs font-medium text-slate-400">On Approved Leave</span>
          <div className="my-1.5 text-2xl font-bold font-mono" style={{ color: 'var(--color-primary)' }}>
            {onLeaveCount}
          </div>
          <span className="text-[11px] text-slate-400">Substitutes notified</span>
        </div>
      </div>

      {/* Filters and Date Bar */}
      <div
        className="p-4 rounded-xl border shadow-xs space-y-3"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search faculty by name or staff ID..."
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
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-none outline-hidden text-xs"
                style={{ color: 'var(--color-text)' }}
              />
            </div>

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
              <option value="present">Present</option>
              <option value="late">Late Arrival</option>
              <option value="on_leave">On Leave</option>
              <option value="absent">Absent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div
        className="rounded-xl border shadow-xs overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Staff Member</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Department & Role</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Check-In</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Check-Out</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Quick Mark</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {filteredRoster.map(({ staff: s, log }) => (
                <tr key={s.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold" style={{ color: 'var(--color-text)' }}>
                      {s.name}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">{s.staffId}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium">{s.designation}</div>
                    <div className="text-[10px] text-slate-400">{s.department}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                    {log.checkInTime || '—'}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                    {log.checkOutTime || '—'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold capitalize ${
                        log.status === 'present'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : log.status === 'late'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400'
                      }`}
                    >
                      {log.status === 'present' && <CheckCircle2 className="w-2.5 h-2.5" />}
                      {log.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleUpdateStatus(s.id, 'present')}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          log.status === 'present' ? 'bg-emerald-600 text-white border-emerald-600' : 'hover:bg-emerald-50'
                        }`}
                        title="Mark Present"
                      >
                        P
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(s.id, 'late')}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          log.status === 'late' ? 'bg-amber-600 text-white border-amber-600' : 'hover:bg-amber-50'
                        }`}
                        title="Mark Late"
                      >
                        L
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(s.id, 'on_leave')}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          log.status === 'on_leave' ? 'bg-slate-700 text-white border-slate-700' : 'hover:bg-slate-100'
                        }`}
                        title="Mark On Leave"
                      >
                        LV
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
