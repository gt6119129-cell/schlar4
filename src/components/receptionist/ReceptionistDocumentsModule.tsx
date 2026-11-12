import React, { useState, useMemo } from 'react';
import { INITIAL_DOCUMENT_REQUESTS } from '../../data/initialReceptionData';
import { INITIAL_STUDENTS } from '../../data/initialSchoolData';
import {
  DocumentRequestRecord,
  DocumentType,
  DocumentRequestStatus,
} from '../../types/reception';
import {
  FileCheck,
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
  Shield,
  Layers,
} from 'lucide-react';

export const ReceptionistDocumentsModule: React.FC = () => {
  const [requests, setRequests] = useState<DocumentRequestRecord[]>(INITIAL_DOCUMENT_REQUESTS);

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [selectedDocForAction, setSelectedDocForAction] = useState<DocumentRequestRecord | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New Document Request Form
  const [formData, setFormData] = useState({
    studentId: 'stu-maya-chen',
    studentName: 'Maya Chen',
    studentClass: 'Grade 8 - Section A',
    requesterName: 'Mrs. Li Chen',
    requesterRelationship: 'Mother',
    requesterPhone: '+91 98450 23488',
    documentType: 'Bonafide Certificate' as DocumentType,
    purpose: '',
    assignedDepartment: 'Principal Office & Admissions',
    officialFeePaid: 100,
    remarks: '',
  });

  // Status Update Form
  const [statusUpdate, setStatusUpdate] = useState<DocumentRequestStatus>('Ready for Collection');
  const [statusRemarks, setStatusRemarks] = useState('');

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchSearch =
        r.requestNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.purpose.toLowerCase().includes(searchQuery.toLowerCase());

      const matchType = typeFilter === 'all' || r.documentType === typeFilter;
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;

      return matchSearch && matchType && matchStatus;
    });
  }, [requests, searchQuery, typeFilter, statusFilter]);

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.studentName || !formData.purpose.trim()) {
      setFeedback({ type: 'error', message: 'Student and purpose are required.' });
      return;
    }

    const nextIdNum = Math.floor(45 + Math.random() * 20);
    const newDoc: DocumentRequestRecord = {
      id: `doc-${Date.now()}`,
      requestNo: `DOC-2026-0${nextIdNum}`,
      studentId: formData.studentId,
      studentName: formData.studentName,
      studentClass: formData.studentClass,
      requesterName: formData.requesterName.trim() || formData.studentName,
      requesterRelationship: formData.requesterRelationship,
      requesterPhone: formData.requesterPhone.trim() || '+1 (555) 000-0000',
      documentType: formData.documentType,
      purpose: formData.purpose.trim(),
      requestDate: '2026-10-22',
      assignedDepartment: formData.assignedDepartment,
      status: 'Submitted',
      officialFeePaid: formData.officialFeePaid,
      remarks: formData.remarks.trim() || 'Logged at Front Desk. Referred to authorized office.',
    };

    setRequests((prev) => [newDoc, ...prev]);
    setIsNewRequestModalOpen(false);
    setFeedback({
      type: 'success',
      message: `Document request ${newDoc.requestNo} (${newDoc.documentType}) registered and routed to ${newDoc.assignedDepartment}.`,
    });
  };

  const handleSaveStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocForAction) return;

    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedDocForAction.id
          ? {
              ...r,
              status: statusUpdate,
              remarks: statusRemarks.trim() || r.remarks,
            }
          : r
      )
    );

    setFeedback({
      type: 'success',
      message: `Document #${selectedDocForAction.requestNo} status updated to "${statusUpdate}".`,
    });
    setSelectedDocForAction(null);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-teal-700 dark:text-teal-400 mb-1">
            <FileCheck className="w-4 h-4" />
            <span>Front Desk Document Request & Collection Counter</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Document & Certificate Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Log Bonafide certificate inquiries, duplicate fee receipts, and study verification packets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewRequestModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-sm transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Document Request</span>
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

      {/* COMPLIANCE DISCLAIMER */}
      <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 text-xs flex items-start gap-3">
        <Shield className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold">Statutory Compliance Rule:</strong> Reception staff log and coordinate the collection of requested certificates. Official seal embossed generation, academic validation, and signed authorizations remain strictly restricted to the Principal, Vice Principal, and Finance Office.
        </div>
      </div>

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
              placeholder="Search request #, student name, requester, purpose..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none text-xs"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none text-xs"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <option value="all">All Document Types</option>
              <option value="Bonafide Certificate">Bonafide Certificate</option>
              <option value="Study & Conduct Certificate">Study & Conduct Certificate</option>
              <option value="Fee Receipt Duplicate">Fee Receipt Duplicate</option>
              <option value="Grade Card Attestation">Grade Card Attestation</option>
              <option value="Transfer Certificate (TC) Enquiry">Transfer Certificate (TC)</option>
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
              <option value="Ready for Collection">Ready for Collection (At Desk)</option>
              <option value="Under Review">Under Review</option>
              <option value="Referred to Department">Referred to Department</option>
              <option value="Completed">Completed / Handed Over</option>
              <option value="Submitted">Submitted</option>
            </select>
          </div>
        </div>

        <div className="text-slate-500 font-medium">
          Requests: <strong>{filteredRequests.length}</strong>
        </div>
      </div>

      {/* DOCUMENT REQUESTS TABLE */}
      <div
        className="rounded-2xl border bg-white dark:bg-slate-900 shadow-xs overflow-hidden"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b" style={{ borderColor: 'var(--color-border)' }}>
              <tr>
                <th className="px-4 py-3">Request #</th>
                <th className="px-4 py-3">Student & Cohort</th>
                <th className="px-4 py-3">Document Type</th>
                <th className="px-4 py-3">Requester & Purpose</th>
                <th className="px-4 py-3">Routing Dept</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {filteredRequests.map((doc) => {
                const isReady = doc.status === 'Ready for Collection';
                const isCompleted = doc.status === 'Completed';

                return (
                  <tr key={doc.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-mono font-bold text-teal-800 dark:text-teal-300">
                      {doc.requestNo}
                      <div className="text-[10px] text-slate-400 font-normal">
                        {doc.requestDate}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {doc.studentName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {doc.studentClass}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {doc.documentType}
                      </div>
                      {doc.officialFeePaid !== undefined && (
                        <div className="text-[10px] text-emerald-600 font-medium">
                          Fee: ₹{doc.officialFeePaid} paid
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 max-w-[220px]">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {doc.requesterName} ({doc.requesterRelationship})
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">
                        {doc.purpose}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {doc.assignedDepartment}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isReady
                            ? 'bg-teal-100 text-teal-800 animate-pulse'
                            : isCompleted
                            ? 'bg-slate-100 text-slate-700'
                            : doc.status === 'Under Review'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {doc.status}
                      </span>
                      {doc.remarks && (
                        <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 italic">
                          {doc.remarks}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedDocForAction(doc);
                          setStatusUpdate(doc.status);
                          setStatusRemarks(doc.remarks || '');
                        }}
                        className="px-2.5 py-1 rounded-lg border text-teal-700 hover:bg-teal-50 font-bold"
                      >
                        Update Desk Status
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW DOCUMENT REQUEST MODAL */}
      {isNewRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-lg rounded-2xl border bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="p-4 border-b flex items-center justify-between bg-teal-800 text-white">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-300" />
                <h3 className="text-base font-bold">New Certificate / Document Request</h3>
              </div>
              <button
                onClick={() => setIsNewRequestModalOpen(false)}
                className="p-1 rounded text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Enrolled Student *
                </label>
                <select
                  value={formData.studentId}
                  onChange={(e) => {
                    const found = INITIAL_STUDENTS.find((s) => s.id === e.target.value);
                    if (found) {
                      setFormData({
                        ...formData,
                        studentId: found.id,
                        studentName: found.name,
                        studentClass: `${found.className} - ${found.sectionName}`,
                        requesterName: found.guardianName || found.name,
                        requesterRelationship: found.guardianRelationship || 'Guardian',
                        requesterPhone: found.guardianPhone || '+1 (555) 000-0000',
                      });
                    }
                  }}
                  className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none font-bold"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  {INITIAL_STUDENTS.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.className} - {st.sectionName}) · {st.admissionNo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Document Requested *
                  </label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => {
                      const type = e.target.value as DocumentType;
                      let dept = 'Principal Office & Admissions';
                      let fee = 100;
                      if (type === 'Fee Receipt Duplicate') {
                        dept = 'Finance & Accounts';
                        fee = 0;
                      } else if (type === 'Study & Conduct Certificate') {
                        dept = 'Academic Affairs & Vice Principal';
                        fee = 150;
                      }
                      setFormData({
                        ...formData,
                        documentType: type,
                        assignedDepartment: dept,
                        officialFeePaid: fee,
                      });
                    }}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <option value="Bonafide Certificate">Bonafide Certificate (₹100)</option>
                    <option value="Study & Conduct Certificate">Study & Conduct Certificate (₹150)</option>
                    <option value="Fee Receipt Duplicate">Fee Receipt Duplicate (₹0)</option>
                    <option value="Grade Card Attestation">Grade Card Attestation (₹100)</option>
                    <option value="Transfer Certificate (TC) Enquiry">Transfer Certificate (TC) Enquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Routing Department
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.assignedDepartment}
                    className="w-full p-2 rounded-lg border bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 outline-none cursor-not-allowed"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Requester Name
                  </label>
                  <input
                    type="text"
                    value={formData.requesterName}
                    onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Relationship to Student
                  </label>
                  <input
                    type="text"
                    value={formData.requesterRelationship}
                    onChange={(e) => setFormData({ ...formData, requesterRelationship: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Purpose / External Agency *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Passport renewal / Visa application / Youth Orchestra tour"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                  style={{ borderColor: 'var(--color-border)' }}
                />
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
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE STATUS MODAL */}
      {selectedDocForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-lg rounded-2xl border bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto text-xs"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                  Update Collection Status
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {selectedDocForAction.requestNo} · {selectedDocForAction.studentName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDocForAction(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatusUpdate} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Lifecycle Status
                </label>
                <select
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value as any)}
                  className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none font-bold"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <option value="Under Review">Under Review (Authorized office processing)</option>
                  <option value="Ready for Collection">Ready for Collection (Kept at Front Desk shelf)</option>
                  <option value="Completed">Completed (Handed over to parent/student)</option>
                  <option value="Referred to Department">Referred to Department</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Collection Location / Shelf Remarks
                </label>
                <input
                  type="text"
                  placeholder="e.g. Signed and embossed. Staged in Front Desk Pickup Shelf Drawer #4."
                  value={statusRemarks}
                  onChange={(e) => setStatusRemarks(e.target.value)}
                  className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                  style={{ borderColor: 'var(--color-border)' }}
                />
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  type="button"
                  onClick={() => setSelectedDocForAction(null)}
                  className="px-4 py-2 rounded-lg border text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-xs"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
