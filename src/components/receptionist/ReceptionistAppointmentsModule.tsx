import React, { useState, useMemo } from 'react';
import { INITIAL_APPOINTMENTS } from '../../data/initialReceptionData';
import {
  FrontOfficeAppointment,
  AppointmentStatus,
  VisitorCategory,
} from '../../types/reception';
import {
  CalendarDays,
  Clock,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  User,
  Building,
  Check,
  X,
  Calendar,
  AlertCircle,
  LogIn,
} from 'lucide-react';

export const ReceptionistAppointmentsModule: React.FC = () => {
  const [appointments, setAppointments] = useState<FrontOfficeAppointment[]>(INITIAL_APPOINTMENTS);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-22');
  const [viewMode, setViewMode] = useState<'day' | 'list'>('day');

  // Modals
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New Appointment Form
  const [formData, setFormData] = useState({
    title: '',
    visitorName: '',
    visitorPhone: '',
    visitorEmail: '',
    visitorCategory: 'Parent/Guardian' as VisitorCategory,
    hostStaffId: 'staff-pendelton',
    hostStaffName: 'Dr. Arthur Pendelton',
    department: 'Executive Administration',
    purpose: '',
    date: '2026-10-22',
    startTime: '10:00',
    endTime: '10:45',
    location: 'Principal Office',
    notes: '',
  });

  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const matchDate = viewMode === 'day' ? a.date === selectedDate : true;

      const matchSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.hostStaffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.purpose.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'all' || a.status === statusFilter;

      return matchDate && matchSearch && matchStatus;
    });
  }, [appointments, viewMode, selectedDate, searchQuery, statusFilter]);

  // Conflict detection
  const checkStaffConflict = (staffId: string, date: string, start: string, end: string, excludeId?: string) => {
    return appointments.find((a) => {
      if (excludeId && a.id === excludeId) return false;
      if (a.hostStaffId !== staffId || a.date !== date) return false;
      if (a.status === 'Cancelled' || a.status === 'Completed' || a.status === 'No Show') return false;

      // Overlap logic: start < a.endTime && end > a.startTime
      return start < a.endTime && end > a.startTime;
    });
  };

  const handleScheduleAppointment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.visitorName.trim()) {
      setFeedback({ type: 'error', message: 'Title and visitor name are required.' });
      return;
    }

    if (formData.endTime <= formData.startTime) {
      setFeedback({ type: 'error', message: 'End time must be after start time.' });
      return;
    }

    // Check conflict
    const conflict = checkStaffConflict(
      formData.hostStaffId,
      formData.date,
      formData.startTime,
      formData.endTime
    );

    if (conflict) {
      setFeedback({
        type: 'error',
        message: `Scheduling Conflict: ${formData.hostStaffName} already has an appointment ("${conflict.title}" from ${conflict.startTime} to ${conflict.endTime}) on this date.`,
      });
      return;
    }

    const nextId = `apt-${Date.now()}`;
    const newApt: FrontOfficeAppointment = {
      id: nextId,
      title: formData.title.trim(),
      visitorName: formData.visitorName.trim(),
      visitorPhone: formData.visitorPhone.trim() || '+1 (555) 000-0000',
      visitorEmail: formData.visitorEmail.trim() || undefined,
      visitorCategory: formData.visitorCategory,
      hostStaffId: formData.hostStaffId,
      hostStaffName: formData.hostStaffName,
      department: formData.department,
      purpose: formData.purpose.trim() || formData.title.trim(),
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.location.trim() || 'Executive Conference Room',
      status: 'Confirmed',
      notes: formData.notes.trim() || undefined,
      createdBy: 'Receptionist Desk',
    };

    setAppointments((prev) => [newApt, ...prev]);
    setIsScheduleModalOpen(false);
    setFeedback({
      type: 'success',
      message: `Appointment scheduled for ${newApt.visitorName} with ${newApt.hostStaffName} on ${newApt.date} at ${newApt.startTime}.`,
    });
  };

  const handleUpdateStatus = (aptId: string, newStatus: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === aptId ? { ...a, status: newStatus } : a))
    );
    setFeedback({
      type: 'success',
      message: `Appointment status updated to "${newStatus}".`,
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-teal-700 dark:text-teal-400 mb-1">
            <CalendarDays className="w-4 h-4" />
            <span>Executive & Faculty Campus Appointments</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Appointment Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Coordination for Principal, Vice Principal, Department Heads, and Parent Consultations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border flex items-center gap-1 text-xs font-bold" style={{ borderColor: 'var(--color-border)' }}>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'day'
                  ? 'bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-200 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Day Schedule
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-200 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All Appointments
            </button>
          </div>

          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-sm transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Appointment</span>
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

      {/* FILTER & DATE CONTROLS */}
      <div
        className="p-4 rounded-xl border bg-white dark:bg-slate-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {viewMode === 'day' && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-700" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold outline-none text-xs"
                style={{ borderColor: 'var(--color-border)' }}
              />
            </div>
          )}

          <div className="relative min-w-[220px] flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, visitor, host staff, purpose..."
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
              <option value="Confirmed">Confirmed</option>
              <option value="In Meeting">In Meeting</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="No Show">No Show</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="text-slate-500 font-medium">
          Showing <strong>{filteredAppointments.length}</strong> appointments
        </div>
      </div>

      {/* APPOINTMENT CARDS / SCHEDULE LIST */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <div className="p-12 text-center border rounded-2xl bg-white dark:bg-slate-900 text-slate-400 text-xs">
            No appointments scheduled for the selected parameters.
          </div>
        ) : (
          filteredAppointments.map((apt) => {
            const isMeeting = apt.status === 'In Meeting';
            const isCompleted = apt.status === 'Completed';
            const isCancelled = apt.status === 'Cancelled' || apt.status === 'No Show';

            return (
              <div
                key={apt.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs ${
                  isMeeting
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                    : isCompleted
                    ? 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 opacity-75'
                    : isCancelled
                    ? 'bg-rose-50/40 border-rose-200 opacity-60'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-xs'
                }`}
                style={{ borderColor: isMeeting ? undefined : 'var(--color-border)' }}
              >
                <div className="flex items-start gap-4">
                  {/* TIME BADGE */}
                  <div className="w-24 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-center shrink-0 border border-slate-200 dark:border-slate-700">
                    <div className="font-mono font-black text-xs text-slate-900 dark:text-white">
                      {apt.startTime}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      to {apt.endTime}
                    </div>
                    <div className="text-[9px] uppercase font-bold text-teal-700 dark:text-teal-400 mt-1">
                      {apt.date}
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {apt.title}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isMeeting
                            ? 'bg-emerald-600 text-white animate-pulse'
                            : apt.status === 'Confirmed'
                            ? 'bg-indigo-100 text-indigo-800'
                            : apt.status === 'Completed'
                            ? 'bg-slate-200 text-slate-700'
                            : apt.status === 'No Show' || apt.status === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>

                    <div className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5 flex-wrap">
                      <span>Visitor: <strong>{apt.visitorName}</strong> ({apt.visitorCategory})</span>
                      <span>·</span>
                      <span>Host: <strong>{apt.hostStaffName}</strong> ({apt.department})</span>
                    </div>

                    <div className="text-slate-500 text-[11px]">
                      Purpose: {apt.purpose}
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {apt.location}
                      </span>
                      <span>Phone: {apt.visitorPhone}</span>
                      {apt.notes && <span className="italic text-slate-500">"{apt.notes}"</span>}
                    </div>
                  </div>
                </div>

                {/* STATUS BUTTONS */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center flex-wrap">
                  {!isCompleted && !isCancelled && (
                    <>
                      {apt.status !== 'In Meeting' && (
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'In Meeting')}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold flex items-center gap-1"
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          <span>Start Meeting</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleUpdateStatus(apt.id, 'Completed')}
                        className="px-2.5 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 font-bold flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Conclude</span>
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(apt.id, 'No Show')}
                        className="px-2 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700 font-medium"
                        title="Mark No-Show"
                      >
                        No-Show
                      </button>
                    </>
                  )}

                  {isCompleted && (
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Session Concluded
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* SCHEDULE APPOINTMENT MODAL */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-xl rounded-2xl border bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="p-4 border-b flex items-center justify-between bg-teal-800 text-white">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-emerald-300" />
                <h3 className="text-base font-bold">Schedule Executive / Faculty Appointment</h3>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1 rounded text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleAppointment} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Appointment Title / Agenda *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior High STEM Curriculum Accreditation Review"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                  style={{ borderColor: 'var(--color-border)' }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Visitor Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Angela Cooper"
                    value={formData.visitorName}
                    onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Visitor Category
                  </label>
                  <select
                    value={formData.visitorCategory}
                    onChange={(e) => setFormData({ ...formData, visitorCategory: e.target.value as any })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <option value="Parent/Guardian">Parent or Guardian</option>
                    <option value="Prospective Parent">Prospective Parent</option>
                    <option value="Vendor/Supplier">Vendor / Supplier</option>
                    <option value="Guest/Invited Speaker">Guest Speaker / Auditor</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (555) 819-3320"
                    value={formData.visitorPhone}
                    onChange={(e) => setFormData({ ...formData, visitorPhone: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. a.cooper@nesab.org"
                    value={formData.visitorEmail}
                    onChange={(e) => setFormData({ ...formData, visitorEmail: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Host Staff Member *
                  </label>
                  <select
                    value={formData.hostStaffId}
                    onChange={(e) => {
                      const staffMap: Record<string, { name: string; dept: string; loc: string }> = {
                        'staff-pendelton': { name: 'Dr. Arthur Pendelton', dept: 'Executive Administration', loc: 'Principal Office (Room 301)' },
                        'staff-vance': { name: 'Dr. Marcus Vance', dept: 'Academic Coordination & VP', loc: 'Vice Principal Office (Room 201)' },
                        'staff-henderson': { name: 'Ms. Sarah Henderson', dept: 'Humanities & English', loc: 'Room 204' },
                        'staff-rostova': { name: 'Ms. Elena Rostova', dept: 'Science & Admissions', loc: 'Science Lab 3' },
                        'staff-miller': { name: 'Mr. David Miller', dept: 'Primary Wing', loc: 'Room 112' },
                      };
                      const sel = staffMap[e.target.value] || { name: 'Dr. Arthur Pendelton', dept: 'Executive Administration', loc: 'Principal Office' };
                      setFormData({
                        ...formData,
                        hostStaffId: e.target.value,
                        hostStaffName: sel.name,
                        department: sel.dept,
                        location: sel.loc,
                      });
                    }}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <option value="staff-pendelton">Dr. Arthur Pendelton (Principal)</option>
                    <option value="staff-vance">Dr. Marcus Vance (Vice Principal)</option>
                    <option value="staff-henderson">Ms. Sarah Henderson (Head of English)</option>
                    <option value="staff-rostova">Ms. Elena Rostova (Admissions / STEM)</option>
                    <option value="staff-miller">Mr. David Miller (Grade 4 Lead)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Meeting Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    End Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Purpose & Meeting Scope
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Audit of AP chemistry lab compliance and consultation regarding student research grants."
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                  style={{ borderColor: 'var(--color-border)' }}
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-[11px] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  The scheduling engine will automatically check the host staff's calendar and warn if a time conflict or overlapping booking is detected.
                </span>
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-lg border text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-xs"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
