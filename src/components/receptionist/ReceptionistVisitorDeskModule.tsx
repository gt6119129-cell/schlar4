import React, { useState, useMemo } from 'react';
import {
  VisitRecord,
  VisitorCategory,
} from '../../types/reception';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  LogIn,
  LogOut,
  Search,
  Filter,
  Plus,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Car,
  Users,
  Shield,
  Building,
  UserCheck,
  X,
  FileText,
} from 'lucide-react';

export const ReceptionistVisitorDeskModule: React.FC = () => {
  const {
    visits,
    visitors,
    checkInVisitor,
    checkOutVisitor,
  } = useSchoolData();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'Checked In' | 'all'>('Checked In');

  // Modals
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [selectedPassToPrint, setSelectedPassToPrint] = useState<VisitRecord | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Check-in Form State
  const [newVisitForm, setNewVisitForm] = useState({
    existingVisitorId: '',
    visitorName: '',
    category: 'Parent/Guardian' as VisitorCategory,
    phone: '',
    organization: '',
    purpose: '',
    hostStaffName: 'Dr. Arthur Pendelton',
    hostStaffId: 'staff-pendelton',
    department: 'Executive Administration',
    groupSize: 1,
    vehicleNumber: '',
  });

  const activeVisits = useMemo(() => {
    return visits.filter((v) => {
      const matchSearch =
        v.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.hostStaffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.vehicleNumber && v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory = categoryFilter === 'all' || v.visitorCategory === categoryFilter;
      const matchStatus = statusFilter === 'all' || v.status === statusFilter;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [visits, searchQuery, categoryFilter, statusFilter]);

  // When selecting an existing visitor from dropdown
  const handleSelectExistingVisitor = (visitorId: string) => {
    if (!visitorId) {
      setNewVisitForm((prev) => ({
        ...prev,
        existingVisitorId: '',
        visitorName: '',
        phone: '',
        organization: '',
      }));
      return;
    }

    const found = visitors.find((v) => v.id === visitorId);
    if (found) {
      setNewVisitForm((prev) => ({
        ...prev,
        existingVisitorId: found.id,
        visitorName: found.fullName,
        category: found.category,
        phone: found.phone,
        organization: found.organization || '',
        vehicleNumber: found.vehicleNumber || '',
      }));
    }
  };

  const handlePerformCheckIn = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newVisitForm.visitorName.trim() || !newVisitForm.purpose.trim()) {
      setFeedback({ type: 'error', message: 'Please provide visitor name and purpose of visit.' });
      return;
    }

    // Guard: Prevent double check-in for an already active visitor
    const isAlreadyCheckedIn = visits.some(
      (v) =>
        v.status === 'Checked In' &&
        v.visitorName.toLowerCase() === newVisitForm.visitorName.trim().toLowerCase()
    );

    if (isAlreadyCheckedIn) {
      setFeedback({
        type: 'error',
        message: `${newVisitForm.visitorName} is already checked in and has an active gate pass on campus.`,
      });
      return;
    }

    const res = checkInVisitor({
      visitorName: newVisitForm.visitorName.trim(),
      category: newVisitForm.category,
      phone: newVisitForm.phone.trim() || '+1 (555) 000-0000',
      organization: newVisitForm.organization.trim() || undefined,
      purpose: newVisitForm.purpose.trim(),
      hostStaffId: newVisitForm.hostStaffId,
      hostStaffName: newVisitForm.hostStaffName,
      department: newVisitForm.department,
      groupSize: Number(newVisitForm.groupSize) || 1,
      vehicleNumber: newVisitForm.vehicleNumber.trim() || undefined,
    });

    if (res.isValid && res.visit) {
      setIsCheckInModalOpen(false);
      setSelectedPassToPrint(res.visit);
      setFeedback({
        type: 'success',
        message: `Checked in ${res.visit.visitorName} successfully with Badge ${res.visit.badgeNumber}.`,
      });
    } else {
      setFeedback({
        type: 'error',
        message: res.message || 'Failed to check in visitor.',
      });
    }
  };

  const handlePerformCheckOut = (visitId: string, visitorName: string) => {
    const res = checkOutVisitor(visitId);
    if (res.isValid) {
      setFeedback({
        type: 'success',
        message: `${visitorName} has been checked out. Badge surrendered and logged to departure register.`,
      });
    } else {
      setFeedback({
        type: 'error',
        message: res.message || 'Failed to check out visitor.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-teal-700 dark:text-teal-400 mb-1">
            <Shield className="w-4 h-4" />
            <span>Campus Gate Pass & Active Visitor Register</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Active Visitor Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time on-campus badge tracking, security verification, and single-click check-outs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCheckInModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-sm transition-all flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Check In New Visitor</span>
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

      {/* FILTER & SEARCH CONTROLS */}
      <div
        className="p-4 rounded-xl border bg-white dark:bg-slate-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[220px] flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search visitor, badge (e.g. PASS-448), host, vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none text-xs"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none text-xs"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <option value="all">All Categories</option>
              <option value="Parent/Guardian">Parents & Guardians</option>
              <option value="Prospective Parent">Prospective Parents</option>
              <option value="Vendor/Supplier">Vendors & Suppliers</option>
              <option value="Delivery Personnel">Delivery / Courier</option>
              <option value="Guest/Invited Speaker">Guest Speakers / Auditors</option>
              <option value="Service Provider">Service Providers</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none text-xs"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <option value="Checked In">Currently Checked In Only</option>
              <option value="all">All Statuses (Including Departed)</option>
            </select>
          </div>
        </div>

        <div className="text-slate-500 font-medium">
          Showing <strong>{activeVisits.length}</strong> records
        </div>
      </div>

      {/* ACTIVE VISITORS ROSTER */}
      <div
        className="rounded-2xl border bg-white dark:bg-slate-900 shadow-xs overflow-hidden"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Campus Security Gate Log
            </span>
          </div>
          <div className="text-xs text-slate-500">
            Current Date: <strong>October 22, 2026</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b" style={{ borderColor: 'var(--color-border)' }}>
              <tr>
                <th className="px-4 py-3">Badge & Pass #</th>
                <th className="px-4 py-3">Visitor Name & Category</th>
                <th className="px-4 py-3">Host Staff / Dept</th>
                <th className="px-4 py-3">Purpose of Visit</th>
                <th className="px-4 py-3">Check-In Time</th>
                <th className="px-4 py-3">Vehicle & Party</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {activeVisits.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No matching visitor records found.
                  </td>
                </tr>
              ) : (
                activeVisits.map((visit) => {
                  const isCheckedIn = visit.status === 'Checked In';

                  return (
                    <tr
                      key={visit.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono font-bold text-teal-700 dark:text-teal-400">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800">
                            {visit.badgeNumber}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {visit.visitorName}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>{visit.visitorCategory}</span>
                          {visit.organization && (
                            <>
                              <span>·</span>
                              <span className="italic">{visit.organization}</span>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {visit.hostStaffName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {visit.department}
                        </div>
                      </td>

                      <td className="px-4 py-3 max-w-[220px]">
                        <span className="line-clamp-2 text-slate-600 dark:text-slate-300">
                          {visit.purpose}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-mono text-[11px]">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>
                            {new Date(visit.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {visit.checkOutTime && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Out: {new Date(visit.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 text-slate-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-400" />
                          <span>Party of {visit.groupSize}</span>
                        </div>
                        {visit.vehicleNumber ? (
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                            <Car className="w-3 h-3 text-slate-400" />
                            <span>{visit.vehicleNumber}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400">Walk-in</span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isCheckedIn
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                              : visit.status === 'Expected'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {visit.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedPassToPrint(visit)}
                            className="p-1.5 rounded-lg border hover:bg-slate-100 text-slate-600 dark:text-slate-300"
                            title="Print Visitor Pass Badge"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {isCheckedIn && (
                            <button
                              onClick={() => handlePerformCheckOut(visit.id, visit.visitorName)}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1"
                              title="Process Checkout"
                            >
                              <LogOut className="w-3.5 h-3.5" />
                              <span>Check Out</span>
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

      {/* CHECK-IN MODAL */}
      {isCheckInModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-xl rounded-2xl border bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="p-4 border-b flex items-center justify-between bg-teal-800 text-white">
              <div className="flex items-center gap-2">
                <LogIn className="w-5 h-5 text-emerald-300" />
                <h3 className="text-base font-bold">Register & Check In Visitor</h3>
              </div>
              <button
                onClick={() => setIsCheckInModalOpen(false)}
                className="p-1 rounded text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePerformCheckIn} className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* SELECT RECURRING OR NEW */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Returning Visitor Quick Select (Optional)
                </label>
                <select
                  value={newVisitForm.existingVisitorId}
                  onChange={(e) => handleSelectExistingVisitor(e.target.value)}
                  className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <option value="">-- Or enter new visitor below --</option>
                  {visitors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.fullName} ({v.category} · {v.organization || 'Individual'})
                    </option>
                  ))}
                </select>
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
                    value={newVisitForm.visitorName}
                    onChange={(e) => setNewVisitForm({ ...newVisitForm, visitorName: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Visitor Category *
                  </label>
                  <select
                    value={newVisitForm.category}
                    onChange={(e) => setNewVisitForm({ ...newVisitForm, category: e.target.value as any })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <option value="Parent/Guardian">Parent or Guardian</option>
                    <option value="Prospective Parent">Prospective Parent</option>
                    <option value="Vendor/Supplier">Vendor / Supplier</option>
                    <option value="Delivery Personnel">Delivery / Courier Personnel</option>
                    <option value="Guest/Invited Speaker">Guest / Invited Speaker / Auditor</option>
                    <option value="Service Provider">Service Provider / Maintenance</option>
                    <option value="Former Student">Former Student / Alumni</option>
                    <option value="Other">Other Category</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={newVisitForm.phone}
                    onChange={(e) => setNewVisitForm({ ...newVisitForm, phone: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Organization / Company (If applicable)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Scholastic Books / FedEx"
                    value={newVisitForm.organization}
                    onChange={(e) => setNewVisitForm({ ...newVisitForm, organization: e.target.value })}
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
                    value={newVisitForm.hostStaffId}
                    onChange={(e) => {
                      const staffMap: Record<string, { name: string; dept: string }> = {
                        'staff-pendelton': { name: 'Dr. Arthur Pendelton', dept: 'Executive Administration' },
                        'staff-vance': { name: 'Dr. Marcus Vance', dept: 'Academic Coordination & VP' },
                        'staff-henderson': { name: 'Ms. Sarah Henderson', dept: 'English & Library Wing' },
                        'staff-rostova': { name: 'Ms. Elena Rostova', dept: 'Science & Admissions' },
                        'staff-miller': { name: 'Mr. David Miller', dept: 'Primary Wing' },
                      };
                      const sel = staffMap[e.target.value] || { name: 'Dr. Arthur Pendelton', dept: 'General Office' };
                      setNewVisitForm({
                        ...newVisitForm,
                        hostStaffId: e.target.value,
                        hostStaffName: sel.name,
                        department: sel.dept,
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
                    Department / Venue
                  </label>
                  <input
                    type="text"
                    value={newVisitForm.department}
                    onChange={(e) => setNewVisitForm({ ...newVisitForm, department: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Purpose of Campus Visit *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Consultation regarding Robotics Tournament sponsorship or Science Lab inspection"
                  value={newVisitForm.purpose}
                  onChange={(e) => setNewVisitForm({ ...newVisitForm, purpose: e.target.value })}
                  className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                  style={{ borderColor: 'var(--color-border)' }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Number in Party (Group Size)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={25}
                    value={newVisitForm.groupSize}
                    onChange={(e) => setNewVisitForm({ ...newVisitForm, groupSize: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Vehicle Plate # (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MA-EV-2024"
                    value={newVisitForm.vehicleNumber}
                    onChange={(e) => setNewVisitForm({ ...newVisitForm, vehicleNumber: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  type="button"
                  onClick={() => setIsCheckInModalOpen(false)}
                  className="px-4 py-2 rounded-lg border text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-xs flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Issue Pass & Check In</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE PASS MODAL */}
      {selectedPassToPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-md rounded-2xl border bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-700" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Visitor Pass Badge
                </h3>
              </div>
              <button
                onClick={() => setSelectedPassToPrint(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* BADGE CARD CONTENT */}
            <div className="p-5 rounded-2xl border-2 border-teal-800 bg-slate-50 text-slate-900 space-y-3 font-sans">
              <div className="text-center border-b pb-2 border-slate-200">
                <div className="text-[10px] font-black uppercase tracking-widest text-teal-800">
                  SCHLAR International Academy
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Official Campus Visitor Authorization
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Visitor Pass ID</div>
                  <div className="text-xl font-black font-mono text-teal-900">
                    {selectedPassToPrint.badgeNumber}
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-teal-800 text-white font-bold text-xs">
                  {selectedPassToPrint.visitorCategory}
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
                <div>
                  <span className="text-slate-400 font-medium text-[10px] block">VISITOR NAME:</span>
                  <span className="text-base font-extrabold text-slate-900">
                    {selectedPassToPrint.visitorName}
                  </span>
                </div>
                {selectedPassToPrint.organization && (
                  <div>
                    <span className="text-slate-400 font-medium text-[10px] block">ORGANIZATION:</span>
                    <span className="font-semibold text-slate-700">
                      {selectedPassToPrint.organization}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-slate-400 font-medium text-[10px] block">HOST & DEPARTMENT:</span>
                  <span className="font-bold text-slate-800">
                    {selectedPassToPrint.hostStaffName} ({selectedPassToPrint.department})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium text-[10px] block">PURPOSE:</span>
                  <span className="text-slate-600 text-[11px] line-clamp-2">
                    {selectedPassToPrint.purpose}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                <span>Date: <strong>{selectedPassToPrint.date}</strong></span>
                <span>Time: <strong>{new Date(selectedPassToPrint.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></span>
              </div>

              <div className="text-[9px] text-slate-400 text-center border-t pt-2 border-slate-200">
                Notice: Wear this badge prominently at all times while on school grounds. Surrender pass at Main Reception Gate prior to exiting.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedPassToPrint(null)}
                className="px-4 py-2 rounded-lg border text-slate-600 hover:bg-slate-100 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Pass Badge</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
