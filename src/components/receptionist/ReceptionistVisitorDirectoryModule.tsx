import React, { useState, useMemo } from 'react';
import {
  INITIAL_VISITORS,
  INITIAL_VISITS,
} from '../../data/initialReceptionData';
import {
  VisitorIdentity,
  VisitRecord,
  VisitorCategory,
  IdProofType,
} from '../../types/reception';
import {
  Users,
  Search,
  Plus,
  Filter,
  History,
  Phone,
  Mail,
  Car,
  Shield,
  Clock,
  CheckCircle2,
  X,
  Edit2,
  Building,
} from 'lucide-react';

export const ReceptionistVisitorDirectoryModule: React.FC = () => {
  const [visitors, setVisitors] = useState<VisitorIdentity[]>(INITIAL_VISITORS);
  const [visits] = useState<VisitRecord[]>(INITIAL_VISITS);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modals
  const [isAddVisitorModalOpen, setIsAddVisitorModalOpen] = useState(false);
  const [selectedVisitorForHistory, setSelectedVisitorForHistory] = useState<VisitorIdentity | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // New Visitor Form State
  const [visitorForm, setVisitorForm] = useState({
    fullName: '',
    category: 'Parent/Guardian' as VisitorCategory,
    organization: '',
    phone: '',
    email: '',
    idProofType: 'Driver License' as IdProofType,
    idProofNumber: '',
    vehicleNumber: '',
    notes: '',
  });

  const filteredVisitors = useMemo(() => {
    return visitors.filter((v) => {
      const matchSearch =
        v.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.phone.includes(searchQuery) ||
        (v.email && v.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (v.organization && v.organization.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (v.idProofNumber && v.idProofNumber.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory = categoryFilter === 'all' || v.category === categoryFilter;

      return matchSearch && matchCategory;
    });
  }, [visitors, searchQuery, categoryFilter]);

  const handleCreateVisitor = (e: React.FormEvent) => {
    e.preventDefault();

    if (!visitorForm.fullName.trim() || !visitorForm.phone.trim()) {
      return;
    }

    const newVisitor: VisitorIdentity = {
      id: `vis-${Date.now()}`,
      fullName: visitorForm.fullName.trim(),
      category: visitorForm.category,
      organization: visitorForm.organization.trim() || undefined,
      phone: visitorForm.phone.trim(),
      email: visitorForm.email.trim() || undefined,
      idProofType: visitorForm.idProofType,
      idProofNumber: visitorForm.idProofNumber.trim() || undefined,
      vehicleNumber: visitorForm.vehicleNumber.trim() || undefined,
      totalVisitsCount: 0,
      notes: visitorForm.notes.trim() || undefined,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setVisitors((prev) => [newVisitor, ...prev]);
    setIsAddVisitorModalOpen(false);
    setVisitorForm({
      fullName: '',
      category: 'Parent/Guardian',
      organization: '',
      phone: '',
      email: '',
      idProofType: 'Driver License',
      idProofNumber: '',
      vehicleNumber: '',
      notes: '',
    });
    setFeedback(`Registered ${newVisitor.fullName} into the visitor identity directory.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const getVisitsForVisitor = (visitorId: string, visitorName: string) => {
    return visits.filter(
      (v) =>
        v.visitorId === visitorId ||
        v.visitorName.toLowerCase() === visitorName.toLowerCase()
    );
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-teal-700 dark:text-teal-400 mb-1">
            <Users className="w-4 h-4" />
            <span>Master Visitor Identity & History Directory</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Visitor Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Verified identity records for recurring parents, contractors, vendors, delivery agents, and guest speakers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddVisitorModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-sm transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Visitor Profile</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-xs underline">
            Dismiss
          </button>
        </div>
      )}

      {/* FILTER & SEARCH */}
      <div
        className="p-4 rounded-xl border bg-white dark:bg-slate-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px] flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search visitor name, phone, organization, or ID proof..."
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
              <option value="Delivery Personnel">Delivery Personnel</option>
              <option value="Guest/Invited Speaker">Guest Speakers / Auditors</option>
              <option value="Service Provider">Service Providers</option>
            </select>
          </div>
        </div>

        <div className="text-slate-500 font-medium">
          Registered Visitors: <strong>{filteredVisitors.length}</strong>
        </div>
      </div>

      {/* DIRECTORY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVisitors.map((v) => {
          const userVisits = getVisitsForVisitor(v.id, v.fullName);

          return (
            <div
              key={v.id}
              className="p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {v.fullName}
                    </h3>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span className="font-semibold text-teal-700 dark:text-teal-400">
                        {v.category}
                      </span>
                      {v.organization && (
                        <>
                          <span>·</span>
                          <span className="truncate max-w-[150px]">{v.organization}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {userVisits.length} visits
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{v.phone}</span>
                  </div>
                  {v.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{v.email}</span>
                    </div>
                  )}
                  {v.vehicleNumber && (
                    <div className="flex items-center gap-2">
                      <Car className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Vehicle: {v.vehicleNumber}</span>
                    </div>
                  )}
                  {v.idProofType && v.idProofType !== 'None' && (
                    <div className="flex items-center gap-2 text-[11px]">
                      <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{v.idProofType}: {v.idProofNumber || 'Verified on file'}</span>
                    </div>
                  )}
                  {v.notes && (
                    <p className="text-[11px] text-slate-500 italic mt-1 line-clamp-2">
                      "{v.notes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  Registered: {v.createdAt}
                </span>
                <button
                  onClick={() => setSelectedVisitorForHistory(v)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold text-teal-700 hover:text-teal-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-colors flex items-center gap-1.5"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Visit History ({userVisits.length})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD VISITOR PROFILE MODAL */}
      {isAddVisitorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-lg rounded-2xl border bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="p-4 border-b flex items-center justify-between bg-teal-800 text-white">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-300" />
                <h3 className="text-base font-bold">Register New Visitor Profile</h3>
              </div>
              <button
                onClick={() => setIsAddVisitorModalOpen(false)}
                className="p-1 rounded text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVisitor} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thomas Lawson"
                  value={visitorForm.fullName}
                  onChange={(e) => setVisitorForm({ ...visitorForm, fullName: e.target.value })}
                  className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                  style={{ borderColor: 'var(--color-border)' }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Visitor Category *
                  </label>
                  <select
                    value={visitorForm.category}
                    onChange={(e) => setVisitorForm({ ...visitorForm, category: e.target.value as any })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <option value="Parent/Guardian">Parent or Guardian</option>
                    <option value="Prospective Parent">Prospective Parent</option>
                    <option value="Vendor/Supplier">Vendor / Supplier</option>
                    <option value="Delivery Personnel">Delivery Personnel</option>
                    <option value="Guest/Invited Speaker">Guest Speaker / Auditor</option>
                    <option value="Service Provider">Service Provider</option>
                    <option value="Former Student">Former Student / Alumni</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Organization / Company
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lawson & Associates Financial"
                    value={visitorForm.organization}
                    onChange={(e) => setVisitorForm({ ...visitorForm, organization: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+1 (555) 432-8765"
                    value={visitorForm.phone}
                    onChange={(e) => setVisitorForm({ ...visitorForm, phone: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. tlawson@lawsonfin.com"
                    value={visitorForm.email}
                    onChange={(e) => setVisitorForm({ ...visitorForm, email: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    ID Proof Document
                  </label>
                  <select
                    value={visitorForm.idProofType}
                    onChange={(e) => setVisitorForm({ ...visitorForm, idProofType: e.target.value as any })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <option value="Driver License">Driver's License</option>
                    <option value="Passport">Passport</option>
                    <option value="National ID">State / National ID</option>
                    <option value="Company ID">Company Employee Badge</option>
                    <option value="None">None Verified</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    ID Document #
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. DL-MA-33109"
                    value={visitorForm.idProofNumber}
                    onChange={(e) => setVisitorForm({ ...visitorForm, idProofNumber: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Vehicle License Plate # (If driving)
                </label>
                <input
                  type="text"
                  placeholder="e.g. MA-SED-4421"
                  value={visitorForm.vehicleNumber}
                  onChange={(e) => setVisitorForm({ ...visitorForm, vehicleNumber: e.target.value })}
                  className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                  style={{ borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Internal Reception Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Parent of Beatrice Lawson (Gr 9A). Approved visitor."
                  value={visitorForm.notes}
                  onChange={(e) => setVisitorForm({ ...visitorForm, notes: e.target.value })}
                  className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none"
                  style={{ borderColor: 'var(--color-border)' }}
                />
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  type="button"
                  onClick={() => setIsAddVisitorModalOpen(false)}
                  className="px-4 py-2 rounded-lg border text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-xs"
                >
                  Save Visitor Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VISITOR VISIT HISTORY DRAWER / MODAL */}
      {selectedVisitorForHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-2xl rounded-2xl border bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                  Individual Visit Ledger
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {selectedVisitorForHistory.fullName}
                </h3>
                <div className="text-xs text-slate-500">
                  {selectedVisitorForHistory.category} · Phone: {selectedVisitorForHistory.phone}
                </div>
              </div>
              <button
                onClick={() => setSelectedVisitorForHistory(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {getVisitsForVisitor(selectedVisitorForHistory.id, selectedVisitorForHistory.fullName).length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  No recorded visits for this visitor profile yet.
                </div>
              ) : (
                getVisitsForVisitor(selectedVisitorForHistory.id, selectedVisitorForHistory.fullName).map((visit) => (
                  <div
                    key={visit.id}
                    className="p-3.5 rounded-xl border bg-slate-50 dark:bg-slate-800/50 space-y-1.5"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-teal-800 dark:text-teal-300">
                          {visit.badgeNumber}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {visit.date}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          visit.status === 'Checked In'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {visit.status}
                      </span>
                    </div>

                    <div className="text-slate-700 dark:text-slate-300 font-medium">
                      Host: <strong>{visit.hostStaffName}</strong> ({visit.department})
                    </div>

                    <div className="text-slate-600 dark:text-slate-400 text-[11px]">
                      Purpose: {visit.purpose}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                      <span>In: {new Date(visit.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {visit.checkOutTime && (
                        <span>Out: {new Date(visit.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      )}
                      {visit.checkoutNotes && (
                        <span className="italic text-slate-500">"{visit.checkoutNotes}"</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                onClick={() => setSelectedVisitorForHistory(null)}
                className="px-4 py-2 rounded-lg border text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
