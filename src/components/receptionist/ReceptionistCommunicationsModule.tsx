import React, { useState, useMemo } from 'react';
import {
  INITIAL_CALL_LOGS,
  INITIAL_COURIERS,
} from '../../data/initialReceptionData';
import {
  CallLogRecord,
  CourierPackage,
  CallDirection,
  CallCategory,
} from '../../types/reception';
import {
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  Package,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Building,
  Check,
  X,
  Mail,
  Send,
  Calendar,
} from 'lucide-react';

export const ReceptionistCommunicationsModule: React.FC = () => {
  const [calls, setCalls] = useState<CallLogRecord[]>(INITIAL_CALL_LOGS);
  const [couriers, setCouriers] = useState<CourierPackage[]>(INITIAL_COURIERS);

  const [activeTab, setActiveTab] = useState<'calls' | 'couriers'>('calls');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [directionFilter, setDirectionFilter] = useState<string>('all');

  // Modals
  const [isLogCallModalOpen, setIsLogCallModalOpen] = useState(false);
  const [isLogCourierModalOpen, setIsLogCourierModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New Call Form
  const [callForm, setCallForm] = useState({
    direction: 'Incoming' as CallDirection,
    callerName: '',
    phone: '',
    category: 'Parent Query' as CallCategory,
    relatedStudentName: '',
    purpose: '',
    summary: '',
    assignedStaffName: 'Mr. David Miller',
    assignedStaffId: 'staff-miller',
    followUpRequired: false,
    followUpDate: '2026-10-23',
    status: 'Resolved' as 'Resolved' | 'Pending Follow-up' | 'Transferred' | 'Escalated',
  });

  // New Courier Form
  const [courierForm, setCourierForm] = useState({
    consignmentNo: '',
    courierCompany: 'FedEx Express',
    senderName: '',
    senderOrganization: '',
    recipientStaffId: 'staff-pendelton',
    recipientStaffName: 'Dr. Arthur Pendelton',
    department: 'Executive Administration',
    packageType: 'Document Envelope' as 'Document Envelope' | 'Parcel Box' | 'Registered Letter' | 'Textbook Package',
  });

  const filteredCalls = useMemo(() => {
    return calls.filter((c) => {
      const matchSearch =
        c.callerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        c.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.relatedStudentName && c.relatedStudentName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory = categoryFilter === 'all' || c.category === categoryFilter;
      const matchDirection = directionFilter === 'all' || c.direction === directionFilter;

      return matchSearch && matchCategory && matchDirection;
    });
  }, [calls, searchQuery, categoryFilter, directionFilter]);

  const filteredCouriers = useMemo(() => {
    return couriers.filter((k) => {
      return (
        k.consignmentNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.recipientStaffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.senderOrganization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.courierCompany.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [couriers, searchQuery]);

  const handleCreateCall = (e: React.FormEvent) => {
    e.preventDefault();

    if (!callForm.callerName.trim() || !callForm.summary.trim()) {
      setFeedback({ type: 'error', message: 'Caller name and summary are required.' });
      return;
    }

    const nextId = `call-${Date.now()}`;
    const newCall: CallLogRecord = {
      id: nextId,
      dateTime: new Date().toISOString(),
      direction: callForm.direction,
      callerName: callForm.callerName.trim(),
      phone: callForm.phone.trim() || '+1 (555) 000-0000',
      category: callForm.category,
      relatedStudentName: callForm.relatedStudentName.trim() || undefined,
      purpose: callForm.purpose.trim() || callForm.category,
      summary: callForm.summary.trim(),
      assignedStaffId: callForm.assignedStaffId,
      assignedStaffName: callForm.assignedStaffName,
      followUpRequired: callForm.followUpRequired,
      followUpDate: callForm.followUpRequired ? callForm.followUpDate : undefined,
      status: callForm.status,
    };

    setCalls((prev) => [newCall, ...prev]);
    setIsLogCallModalOpen(false);
    setFeedback({
      type: 'success',
      message: `Call with ${newCall.callerName} recorded successfully in communications register.`,
    });
  };

  const handleCreateCourier = (e: React.FormEvent) => {
    e.preventDefault();

    if (!courierForm.consignmentNo.trim() || !courierForm.senderName.trim()) {
      setFeedback({ type: 'error', message: 'Consignment number and sender details required.' });
      return;
    }

    const nextId = `cou-${Date.now()}`;
    const newCourier: CourierPackage = {
      id: nextId,
      consignmentNo: courierForm.consignmentNo.trim(),
      courierCompany: courierForm.courierCompany,
      senderName: courierForm.senderName.trim(),
      senderOrganization: courierForm.senderOrganization.trim() || courierForm.senderName.trim(),
      recipientStaffId: courierForm.recipientStaffId,
      recipientStaffName: courierForm.recipientStaffName,
      department: courierForm.department,
      receivedDate: '2026-10-22',
      receivedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      packageType: courierForm.packageType,
      status: 'Received at Front Desk',
    };

    setCouriers((prev) => [newCourier, ...prev]);
    setIsLogCourierModalOpen(false);
    setFeedback({
      type: 'success',
      message: `Courier consignment ${newCourier.consignmentNo} logged for ${newCourier.recipientStaffName}.`,
    });
  };

  const handleMarkCollected = (courierId: string) => {
    setCouriers((prev) =>
      prev.map((c) =>
        c.id === courierId
          ? {
              ...c,
              status: 'Collected by Recipient',
              collectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : c
      )
    );
    setFeedback({ type: 'success', message: 'Package marked as handed over & collected.' });
  };

  const handleResolveCallFollowup = (callId: string) => {
    setCalls((prev) =>
      prev.map((c) => (c.id === callId ? { ...c, status: 'Resolved', followUpRequired: false } : c))
    );
    setFeedback({ type: 'success', message: 'Follow-up marked resolved.' });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-teal-700 dark:text-teal-400 mb-1">
            <PhoneCall className="w-4 h-4" />
            <span>Front Office Telephony & Inward Dispatch Registry</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Communications Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Record telephone messages, urgent parent callbacks, and physical postal consignments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border flex items-center gap-1 text-xs font-bold" style={{ borderColor: 'var(--color-border)' }}>
            <button
              onClick={() => setActiveTab('calls')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'calls'
                  ? 'bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-200 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Phone Calls ({calls.length})
            </button>
            <button
              onClick={() => setActiveTab('couriers')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'couriers'
                  ? 'bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-200 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Postal / Courier ({couriers.length})
            </button>
          </div>

          {activeTab === 'calls' ? (
            <button
              onClick={() => setIsLogCallModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-sm transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Log Phone Call</span>
            </button>
          ) : (
            <button
              onClick={() => setIsLogCourierModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-sm transition-all flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              <span>Log Inward Courier</span>
            </button>
          )}
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

      {/* CALL LOG TAB */}
      {activeTab === 'calls' && (
        <div className="space-y-4">
          {/* SEARCH & FILTERS */}
          <div
            className="p-4 rounded-xl border bg-white dark:bg-slate-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative min-w-[220px] flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search caller name, phone number, summary..."
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
                  <option value="Parent Query">Parent Query</option>
                  <option value="Emergency/Urgent">Emergency / Urgent</option>
                  <option value="Admissions Inquiry">Admissions Inquiry</option>
                  <option value="Transport Query">Transport Query</option>
                  <option value="Fee Inquiry">Fee Inquiry</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={directionFilter}
                  onChange={(e) => setDirectionFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none text-xs"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <option value="all">Incoming & Outgoing</option>
                  <option value="Incoming">Incoming Only</option>
                  <option value="Outgoing">Outgoing Only</option>
                </select>
              </div>
            </div>

            <div className="text-slate-500 font-medium">
              Calls: <strong>{filteredCalls.length}</strong>
            </div>
          </div>

          {/* CALLS LIST */}
          <div className="space-y-3">
            {filteredCalls.map((call) => {
              const isIncoming = call.direction === 'Incoming';
              const isResolved = call.status === 'Resolved';

              return (
                <div
                  key={call.id}
                  className="p-4 rounded-2xl border bg-white dark:bg-slate-900 shadow-xs hover:shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      isIncoming
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {isIncoming ? <PhoneIncoming className="w-4 h-4" /> : <PhoneOutgoing className="w-4 h-4" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {call.callerName}
                        </span>
                        <span className="font-mono text-slate-400 text-[11px]">
                          ({call.phone})
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {call.category}
                        </span>
                      </div>

                      <p className="text-slate-700 dark:text-slate-300 text-[11px]">
                        {call.summary}
                      </p>

                      <div className="flex items-center gap-4 text-[10px] text-slate-400 pt-1">
                        <span>Time: {new Date(call.dateTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        {call.relatedStudentName && (
                          <span>Student: <strong>{call.relatedStudentName}</strong></span>
                        )}
                        {call.assignedStaffName && (
                          <span>Referred to: <strong>{call.assignedStaffName}</strong></span>
                        )}
                        {call.followUpDate && (
                          <span className="text-amber-600 font-semibold">
                            Follow-up Due: {call.followUpDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold ${
                        isResolved
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {call.status}
                    </span>

                    {!isResolved && (
                      <button
                        onClick={() => handleResolveCallFollowup(call.id)}
                        className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 font-bold"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* COURIER PACKAGES TAB */}
      {activeTab === 'couriers' && (
        <div className="space-y-4">
          <div
            className="rounded-2xl border bg-white dark:bg-slate-900 shadow-xs overflow-hidden"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
              <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Inward Courier & Registered Mail Dispatches
              </div>
              <div className="text-xs text-slate-500">
                Front desk package reception point
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <tr>
                    <th className="px-4 py-3">Consignment #</th>
                    <th className="px-4 py-3">Carrier & Type</th>
                    <th className="px-4 py-3">Sender</th>
                    <th className="px-4 py-3">Recipient Staff / Dept</th>
                    <th className="px-4 py-3">Arrival Time</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                  {filteredCouriers.map((c) => {
                    const isCollected = c.status === 'Collected by Recipient';

                    return (
                      <tr key={c.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3 font-mono font-bold text-teal-800 dark:text-teal-300">
                          {c.consignmentNo}
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {c.courierCompany}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {c.packageType}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800 dark:text-slate-200">
                            {c.senderName}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {c.senderOrganization}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-800 dark:text-slate-200">
                            {c.recipientStaffName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {c.department}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                          {c.receivedDate} at {c.receivedTime}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isCollected
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          {!isCollected && (
                            <button
                              onClick={() => handleMarkCollected(c.id)}
                              className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 font-bold"
                            >
                              Confirm Handover
                            </button>
                          )}
                          {isCollected && (
                            <span className="text-[10px] text-slate-400">
                              Collected {c.collectedAt}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* LOG CALL MODAL */}
      {isLogCallModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-lg rounded-2xl border bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="p-4 border-b flex items-center justify-between bg-teal-800 text-white">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-emerald-300" />
                <h3 className="text-base font-bold">Record Phone Call Entry</h3>
              </div>
              <button
                onClick={() => setIsLogCallModalOpen(false)}
                className="p-1 rounded text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCall} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Call Direction
                  </label>
                  <select
                    value={callForm.direction}
                    onChange={(e) => setCallForm({ ...callForm, direction: e.target.value as any })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <option value="Incoming">Incoming Call</option>
                    <option value="Outgoing">Outgoing Call</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={callForm.category}
                    onChange={(e) => setCallForm({ ...callForm, category: e.target.value as any })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <option value="Parent Query">Parent Query</option>
                    <option value="Admissions Inquiry">Admissions Inquiry</option>
                    <option value="Emergency/Urgent">Emergency / Urgent</option>
                    <option value="Transport Query">Transport Query</option>
                    <option value="Fee Inquiry">Fee Inquiry</option>
                    <option value="Vendor/Supplier">Vendor / Supplier</option>
                    <option value="General Information">General Information</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Caller / Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mrs. Li Chen"
                    value={callForm.callerName}
                    onChange={(e) => setCallForm({ ...callForm, callerName: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (555) 234-8891"
                    value={callForm.phone}
                    onChange={(e) => setCallForm({ ...callForm, phone: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Related Student Ward (If applicable)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Leo Chen (Grade 4B)"
                  value={callForm.relatedStudentName}
                  onChange={(e) => setCallForm({ ...callForm, relatedStudentName: e.target.value })}
                  className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                  style={{ borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Call Notes & Summary *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Early pickup notification for dental appointment at 1:30 PM. Grandfather will arrive at West Gate."
                  value={callForm.summary}
                  onChange={(e) => setCallForm({ ...callForm, summary: e.target.value })}
                  className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                  style={{ borderColor: 'var(--color-border)' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Status
                  </label>
                  <select
                    value={callForm.status}
                    onChange={(e) => setCallForm({ ...callForm, status: e.target.value as any })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <option value="Resolved">Resolved</option>
                    <option value="Pending Follow-up">Pending Follow-up</option>
                    <option value="Transferred">Transferred to Dept</option>
                    <option value="Escalated">Escalated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Follow-Up Date
                  </label>
                  <input
                    type="date"
                    value={callForm.followUpDate}
                    onChange={(e) => setCallForm({ ...callForm, followUpDate: e.target.value, followUpRequired: true })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  type="button"
                  onClick={() => setIsLogCallModalOpen(false)}
                  className="px-4 py-2 rounded-lg border text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-xs"
                >
                  Save Call Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOG COURIER MODAL */}
      {isLogCourierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-lg rounded-2xl border bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="p-4 border-b flex items-center justify-between bg-teal-800 text-white">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-300" />
                <h3 className="text-base font-bold">Log Inward Courier / Mail Delivery</h3>
              </div>
              <button
                onClick={() => setIsLogCourierModalOpen(false)}
                className="p-1 rounded text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourier} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Consignment / Tracking # *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FX-99214-BOS"
                    value={courierForm.consignmentNo}
                    onChange={(e) => setCourierForm({ ...courierForm, consignmentNo: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none font-mono"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Courier Company
                  </label>
                  <select
                    value={courierForm.courierCompany}
                    onChange={(e) => setCourierForm({ ...courierForm, courierCompany: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <option value="FedEx Express">FedEx Express</option>
                    <option value="UPS Worldwide">UPS Worldwide</option>
                    <option value="USPS Registered">USPS (Registered Mail)</option>
                    <option value="DHL Express">DHL Express</option>
                    <option value="Local Courier">Local School Courier</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Sender Name / Agency *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. State Education Board"
                    value={courierForm.senderName}
                    onChange={(e) => setCourierForm({ ...courierForm, senderName: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Sender Organization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Department of Education"
                    value={courierForm.senderOrganization}
                    onChange={(e) => setCourierForm({ ...courierForm, senderOrganization: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Recipient Staff Member *
                  </label>
                  <select
                    value={courierForm.recipientStaffId}
                    onChange={(e) => {
                      const staffMap: Record<string, { name: string; dept: string }> = {
                        'staff-pendelton': { name: 'Dr. Arthur Pendelton', dept: 'Executive Administration' },
                        'staff-vance': { name: 'Dr. Marcus Vance', dept: 'Academic Coordination' },
                        'staff-henderson': { name: 'Ms. Sarah Henderson', dept: 'School Library' },
                        'staff-rostova': { name: 'Ms. Elena Rostova', dept: 'Science & Robotics' },
                      };
                      const s = staffMap[e.target.value] || { name: 'Dr. Arthur Pendelton', dept: 'Executive' };
                      setCourierForm({
                        ...courierForm,
                        recipientStaffId: e.target.value,
                        recipientStaffName: s.name,
                        department: s.dept,
                      });
                    }}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <option value="staff-pendelton">Dr. Arthur Pendelton (Principal)</option>
                    <option value="staff-vance">Dr. Marcus Vance (Vice Principal)</option>
                    <option value="staff-henderson">Ms. Sarah Henderson (Library / English)</option>
                    <option value="staff-rostova">Ms. Elena Rostova (Science Labs)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Package Type
                  </label>
                  <select
                    value={courierForm.packageType}
                    onChange={(e) => setCourierForm({ ...courierForm, packageType: e.target.value as any })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <option value="Document Envelope">Document Envelope</option>
                    <option value="Parcel Box">Parcel Box</option>
                    <option value="Registered Letter">Registered Letter</option>
                    <option value="Textbook Package">Textbook Package</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  type="button"
                  onClick={() => setIsLogCourierModalOpen(false)}
                  className="px-4 py-2 rounded-lg border text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-xs"
                >
                  Save Inward Courier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
