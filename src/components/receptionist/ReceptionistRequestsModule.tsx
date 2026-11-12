import React, { useState, useMemo } from 'react';
import { INITIAL_RECEPTION_REQUESTS } from '../../data/initialReceptionData';
import {
  ReceptionRequest,
  RequestCategory,
  RequestPriority,
  RequestStatus,
} from '../../types/reception';
import {
  MessageSquareText,
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
  FileText,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const ReceptionistRequestsModule: React.FC = () => {
  const [requests, setRequests] = useState<ReceptionRequest[]>(INITIAL_RECEPTION_REQUESTS);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Modals
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [selectedRequestForResolution, setSelectedRequestForResolution] = useState<ReceptionRequest | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New Request Form
  const [formData, setFormData] = useState({
    category: 'Lost & Found' as RequestCategory,
    requesterName: '',
    requesterPhone: '',
    requesterType: 'Parent' as 'Parent' | 'Student' | 'Staff' | 'Visitor',
    summary: '',
    description: '',
    assignedDepartment: 'Campus Facilities & Security',
    assignedStaffName: 'Security Desk',
    priority: 'Medium' as RequestPriority,
    followUpDate: '2026-10-23',
  });

  // Resolution Form
  const [resolutionStatus, setResolutionStatus] = useState<RequestStatus>('Resolved');
  const [resolutionNote, setResolutionNote] = useState('');

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchSearch =
        r.requestNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchCategory = categoryFilter === 'all' || r.category === categoryFilter;
      const matchPriority = priorityFilter === 'all' || r.priority === priorityFilter;

      return matchSearch && matchStatus && matchCategory && matchPriority;
    });
  }, [requests, searchQuery, statusFilter, categoryFilter, priorityFilter]);

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.requesterName.trim() || !formData.summary.trim()) {
      setFeedback({ type: 'error', message: 'Requester name and summary are required.' });
      return;
    }

    const nextNum = Math.floor(83 + Math.random() * 20);
    const newReq: ReceptionRequest = {
      id: `req-${Date.now()}`,
      requestNo: `REQ-2026-0${nextNum}`,
      date: '2026-10-22',
      category: formData.category,
      requesterName: formData.requesterName.trim(),
      requesterPhone: formData.requesterPhone.trim() || '+1 (555) 000-0000',
      requesterType: formData.requesterType,
      summary: formData.summary.trim(),
      description: formData.description.trim() || formData.summary.trim(),
      assignedDepartment: formData.assignedDepartment,
      assignedStaffName: formData.assignedStaffName,
      priority: formData.priority,
      status: 'New',
      followUpDate: formData.followUpDate,
      history: [
        {
          timestamp: new Date().toISOString(),
          action: 'Created',
          note: `Desk request logged at reception desk (${formData.category}).`,
          actor: 'Receptionist',
        },
      ],
    };

    setRequests((prev) => [newReq, ...prev]);
    setIsNewRequestModalOpen(false);
    setFeedback({
      type: 'success',
      message: `Request ${newReq.requestNo} recorded and routed to ${newReq.assignedDepartment}.`,
    });
  };

  const handleSaveResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestForResolution || !resolutionNote.trim()) return;

    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequestForResolution.id
          ? {
              ...r,
              status: resolutionStatus,
              resolutionNotes: resolutionNote.trim(),
              history: [
                ...r.history,
                {
                  timestamp: new Date().toISOString(),
                  action: resolutionStatus,
                  note: resolutionNote.trim(),
                  actor: 'Receptionist Desk',
                },
              ],
            }
          : r
      )
    );

    setFeedback({
      type: 'success',
      message: `Request ${selectedRequestForResolution.requestNo} updated to status "${resolutionStatus}".`,
    });
    setSelectedRequestForResolution(null);
    setResolutionNote('');
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-teal-700 dark:text-teal-400 mb-1">
            <MessageSquareText className="w-4 h-4" />
            <span>Front Desk Service Requests & Parent Concern Register</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Reception Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Log lost and found inquiries, student RFID card replacements, facility maintenance alerts, and teacher consultations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewRequestModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-sm transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Reception Request</span>
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

      {/* FILTER BAR */}
      <div
        className="p-4 rounded-xl border bg-white dark:bg-slate-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[220px] flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search request #, requester, or summary..."
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
              <option value="Teacher Meeting Request">Teacher Meeting</option>
              <option value="Lost & Found">Lost & Found</option>
              <option value="Bus Pass / ID Reissue">Bus Pass / RFID Reissue</option>
              <option value="Campus Maintenance">Campus Maintenance</option>
              <option value="Department Inquiry">Department Inquiry</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none text-xs"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Waiting for Response">Waiting for Response</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none text-xs"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <option value="all">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="text-slate-500 font-medium">
          Showing <strong>{filteredRequests.length}</strong> tickets
        </div>
      </div>

      {/* REQUESTS LIST */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center border rounded-2xl bg-white dark:bg-slate-900 text-slate-400 text-xs">
            No reception requests found matching criteria.
          </div>
        ) : (
          filteredRequests.map((req) => {
            const isResolved = req.status === 'Resolved' || req.status === 'Closed';

            return (
              <div
                key={req.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs ${
                  isResolved
                    ? 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200 opacity-80'
                    : req.priority === 'Urgent'
                    ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-xs'
                }`}
                style={{ borderColor: isResolved ? undefined : 'var(--color-border)' }}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-teal-800 dark:text-teal-300">
                      {req.requestNo}
                    </span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {req.summary}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        req.priority === 'Urgent'
                          ? 'bg-rose-100 text-rose-800'
                          : req.priority === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {req.priority}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isResolved
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                    {req.description}
                  </p>

                  <div className="flex items-center gap-4 text-[10px] text-slate-400 flex-wrap pt-1">
                    <span>Requester: <strong>{req.requesterName}</strong> ({req.requesterType})</span>
                    <span>Phone: {req.requesterPhone}</span>
                    <span>Assigned Dept: <strong>{req.assignedDepartment}</strong></span>
                    {req.followUpDate && <span>Follow-up: {req.followUpDate}</span>}
                  </div>

                  {req.resolutionNotes && (
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-[11px] mt-1">
                      <strong>Resolution:</strong> {req.resolutionNotes}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => {
                      setSelectedRequestForResolution(req);
                      setResolutionStatus(req.status);
                    }}
                    className="px-3 py-1.5 rounded-lg border text-teal-700 hover:bg-teal-50 font-bold"
                  >
                    Update / Resolve
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* NEW REQUEST MODAL */}
      {isNewRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-lg rounded-2xl border bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="p-4 border-b flex items-center justify-between bg-teal-800 text-white">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-300" />
                <h3 className="text-base font-bold">Create Reception Desk Ticket</h3>
              </div>
              <button
                onClick={() => setIsNewRequestModalOpen(false)}
                className="p-1 rounded text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Request Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <option value="Lost & Found">Lost & Found Property</option>
                    <option value="Bus Pass / ID Reissue">Bus Pass / RFID Reissue</option>
                    <option value="Teacher Meeting Request">Teacher Meeting Request</option>
                    <option value="Campus Maintenance">Campus Maintenance Alert</option>
                    <option value="Parent Concern">Parent Concern / Grievance</option>
                    <option value="Department Inquiry">Department Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Urgent">Urgent Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Requester Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Chen"
                    value={formData.requesterName}
                    onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Requester Role
                  </label>
                  <select
                    value={formData.requesterType}
                    onChange={(e) => setFormData({ ...formData, requesterType: e.target.value as any })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <option value="Student">Student</option>
                    <option value="Parent">Parent / Guardian</option>
                    <option value="Staff">Faculty / Staff</option>
                    <option value="Visitor">Visitor / Contractor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  placeholder="+1 (555) 234-8891"
                  value={formData.requesterPhone}
                  onChange={(e) => setFormData({ ...formData, requesterPhone: e.target.value })}
                  className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                  style={{ borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Brief Summary *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RFID Transit Card cracked; temporary pass requested"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                  style={{ borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Detailed Description & Action Needed
                </label>
                <textarea
                  rows={2}
                  placeholder="Full background details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                  style={{ borderColor: 'var(--color-border)' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Assign To Department
                  </label>
                  <select
                    value={formData.assignedDepartment}
                    onChange={(e) => setFormData({ ...formData, assignedDepartment: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <option value="Campus Facilities & Security">Campus Facilities & Security</option>
                    <option value="Transport & Logistics">Transport & Logistics</option>
                    <option value="Academic Faculty">Academic Faculty</option>
                    <option value="Finance & Accounts">Finance & Accounts</option>
                    <option value="Admissions & Student Affairs">Admissions & Student Affairs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Follow-Up Date
                  </label>
                  <input
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  type="button"
                  onClick={() => setIsNewRequestModalOpen(false)}
                  className="px-4 py-2 rounded-lg border text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-xs"
                >
                  Save Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESOLUTION DRAWER / MODAL */}
      {selectedRequestForResolution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-lg rounded-2xl border bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto text-xs"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                  Update Ticket Status
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {selectedRequestForResolution.requestNo} · {selectedRequestForResolution.summary}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRequestForResolution(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResolution} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Change Status
                </label>
                <select
                  value={resolutionStatus}
                  onChange={(e) => setResolutionStatus(e.target.value as any)}
                  className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none font-bold"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <option value="In Progress">In Progress (Under investigation)</option>
                  <option value="Waiting for Response">Waiting for Department Response</option>
                  <option value="Resolved">Resolved (Action completed)</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Resolution Remarks & Notes *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Security staff inspected Science Lab 3 and retrieved calculator. Staged at front desk for student collection."
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                  style={{ borderColor: 'var(--color-border)' }}
                />
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  type="button"
                  onClick={() => setSelectedRequestForResolution(null)}
                  className="px-4 py-2 rounded-lg border text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-xs"
                >
                  Save Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
