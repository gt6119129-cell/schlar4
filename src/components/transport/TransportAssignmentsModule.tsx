import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  X,
  Edit2,
  MapPin,
  Clock,
  Bus,
  UserPlus,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { StudentTransportAssignment, TransportServiceType, TransportAssignmentStatus } from '../../types/transport';
import { useSchoolData } from '../../context/SchoolDataContext';

export const TransportAssignmentsModule: React.FC = () => {
  const {
    students,
    studentTransportAssignments: assignments,
    transportRoutes: routes,
    assignStudentTransport,
    unassignStudentTransport,
    updateStudentTransportStatus,
  } = useSchoolData();

  const [searchQuery, setSearchQuery] = useState('');
  const [routeFilter, setRouteFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'assigned' | 'unassigned'>('assigned');

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<StudentTransportAssignment | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New assignment form state
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [selectedRouteId, setSelectedRouteId] = useState(routes[0]?.id || '');
  const [selectedPickupStopId, setSelectedPickupStopId] = useState('');
  const [selectedDropoffStopId, setSelectedDropoffStopId] = useState('');
  const [serviceType, setServiceType] = useState<TransportServiceType>('two-way');
  const [specialNotes, setSpecialNotes] = useState('');

  // Selected Route object
  const currentRoute = useMemo(() => {
    return routes.find((r) => r.id === selectedRouteId) || routes[0];
  }, [routes, selectedRouteId]);

  // Set default stops when route changes
  React.useEffect(() => {
    if (currentRoute && currentRoute.stops.length > 0) {
      setSelectedPickupStopId(currentRoute.stops[0].id);
      setSelectedDropoffStopId(currentRoute.stops[0].id);
    }
  }, [currentRoute]);

  // Students who do NOT have an active transport assignment
  const unassignedStudents = useMemo(() => {
    const assignedStudentIds = assignments
      .filter((a) => a.status === 'active')
      .map((a) => a.studentId);
    return students.filter((s) => !assignedStudentIds.includes(s.id));
  }, [assignments, students]);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const matchSearch =
        a.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.pickupStopName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchRoute = routeFilter === 'all' || a.routeId === routeFilter;

      return matchSearch && matchRoute;
    });
  }, [assignments, searchQuery, routeFilter]);

  const handleOpenAssignModal = (studentId?: string) => {
    if (studentId) {
      setSelectedStudentId(studentId);
    } else if (unassignedStudents.length > 0) {
      setSelectedStudentId(unassignedStudents[0].id);
    }
    setSelectedRouteId(routes[0]?.id || '');
    setServiceType('two-way');
    setSpecialNotes('');
    setIsAssignModalOpen(true);
  };

  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === selectedStudentId);
    const targetRoute = routes.find((r) => r.id === selectedRouteId);
    if (!student || !targetRoute) return;

    const pickupStop = targetRoute.stops.find((s) => s.id === selectedPickupStopId) || targetRoute.stops[0];
    const dropoffStop = targetRoute.stops.find((s) => s.id === selectedDropoffStopId) || pickupStop;

    const res = assignStudentTransport({
      studentId: student.id,
      routeId: targetRoute.id,
      pickupStopId: pickupStop.id,
      dropoffStopId: dropoffStop.id,
      serviceType,
      notes: specialNotes,
    });

    if (res.isValid) {
      setIsAssignModalOpen(false);
      setEditingAssignment(null);
      setFeedback({
        type: 'success',
        message: `Assigned ${student.name} (${student.className}) to ${targetRoute.routeNumber} at stop ${pickupStop.stopName}.`,
      });
    } else {
      setFeedback({
        type: 'error',
        message: res.message || 'Failed to allocate student to route.',
      });
    }

    setTimeout(() => setFeedback(null), 5000);
  };

  const handleToggleStatus = (assignment: StudentTransportAssignment) => {
    const nextStatus: TransportAssignmentStatus =
      assignment.status === 'active' ? 'suspended' : 'active';

    const res = updateStudentTransportStatus(assignment.id, nextStatus);
    if (res.isValid) {
      setFeedback({
        type: 'success',
        message: `Transport assignment for ${assignment.studentName} marked ${nextStatus}.`,
      });
    } else {
      setFeedback({
        type: 'error',
        message: res.message || 'Failed to update transport status.',
      });
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Student Transport Allocations & Rosters
          </h2>
          <p className="text-xs text-slate-500">
            Allocate student commuters to transit routes, validate vehicle seating capacity, and coordinate stop manifests.
          </p>
        </div>

        <button
          onClick={() => handleOpenAssignModal()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-90 self-start sm:self-auto"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <UserPlus className="w-4 h-4" />
          <span>Assign Student to Route</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between gap-2 animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TABS */}
      <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: 'var(--color-border)' }}>
        <button
          onClick={() => setActiveTab('assigned')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'assigned'
              ? 'bg-black/10 dark:bg-white/10 text-teal-800 dark:text-teal-300 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Active Transport Manifests ({assignments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('unassigned')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'unassigned'
              ? 'bg-black/10 dark:bg-white/10 text-teal-800 dark:text-teal-300 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Unallocated Students Pool ({unassignedStudents.length})</span>
        </button>
      </div>

      {/* ASSIGNED STUDENTS TAB */}
      {activeTab === 'assigned' && (
        <div className="space-y-4">
          {/* SEARCH & ROUTE FILTER */}
          <div
            className="p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs flex-1 max-w-md"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
              }}
            >
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search commuter by name, class, or stop..."
                className="w-full bg-transparent border-none outline-none text-xs"
                style={{ color: 'var(--color-text)' }}
              />
            </div>

            <select
              value={routeFilter}
              onChange={(e) => setRouteFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border text-xs outline-none"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              <option value="all">All Transit Corridors</option>
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.routeNumber}: {r.name}
                </option>
              ))}
            </select>
          </div>

          <div
            className="rounded-xl border shadow-xs overflow-hidden"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr
                    className="border-b"
                    style={{
                      backgroundColor: 'var(--color-table-header, #f9fafb)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase">Student Commuter</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase">Class & Cohort</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase">Assigned Route & Bus</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase">Designated Stop</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase">Service Mode</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Fee Status</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Status</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                  {filteredAssignments.map((asg) => (
                    <tr key={asg.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                      <td className="py-3 px-4">
                        <span className="font-bold block" style={{ color: 'var(--color-text)' }}>
                          {asg.studentName}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {asg.admissionNo} · {asg.guardianName}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        {asg.className} - {asg.sectionName}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold block truncate max-w-[170px]" style={{ color: 'var(--color-text)' }}>
                          {asg.routeName}
                        </span>
                        <span className="font-mono text-[10px] text-teal-700 font-bold block">
                          {asg.vehicleNumber}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="line-clamp-1">{asg.pickupStopName}</span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-400 block mt-0.5">
                          AM: {asg.morningPickupTime}
                        </span>
                      </td>

                      <td className="py-3 px-4 capitalize text-slate-600 dark:text-slate-400 text-[11px]">
                        {asg.serviceType}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                            asg.feeStatus === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {asg.feeStatus}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                            asg.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {asg.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingAssignment(asg);
                              setSelectedStudentId(asg.studentId);
                              setSelectedRouteId(asg.routeId);
                              setSelectedPickupStopId(asg.pickupStopId);
                              setSelectedDropoffStopId(asg.dropoffStopId);
                              setServiceType(asg.serviceType);
                              setSpecialNotes(asg.notes || '');
                              setIsAssignModalOpen(true);
                            }}
                            className="p-1.5 rounded hover:bg-black/5 text-slate-500"
                            title="Edit Assignment"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(asg)}
                            className={`px-2 py-1 rounded text-[10px] font-bold border ${
                              asg.status === 'active'
                                ? 'text-rose-600 border-rose-200 hover:bg-rose-50'
                                : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                            }`}
                          >
                            {asg.status === 'active' ? 'Suspend' : 'Resume'}
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
      )}

      {/* UNASSIGNED STUDENTS POOL */}
      {activeTab === 'unassigned' && (
        <div
          className="rounded-xl border shadow-xs overflow-hidden"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
            <div>
              <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                Registered Students Without Transport Allocations
              </h3>
              <p className="text-xs text-slate-500">
                Students commuting independently or awaiting school bus allocation
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-black/5">
              {unassignedStudents.length} Students
            </span>
          </div>

          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr
                className="border-b"
                style={{
                  backgroundColor: 'var(--color-table-header, #f9fafb)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Student Name</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Admission No</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Class & Section</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Guardian Phone</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {unassignedStudents.map((st) => (
                <tr key={st.id} className="hover:bg-black/[0.02]">
                  <td className="py-3 px-4 font-bold" style={{ color: 'var(--color-text)' }}>
                    {st.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">{st.admissionNo}</td>
                  <td className="py-3 px-4">{st.className} - {st.sectionName}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{st.guardianPhone}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenAssignModal(st.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      Allocate Route
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ASSIGNMENT MODAL WIZARD */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleSaveAssignment}
            className="w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-700" />
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  {editingAssignment ? 'Modify Transport Route' : 'Allocate Student to Transit Route'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setEditingAssignment(null);
                }}
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Select Student Commuter *</label>
                <select
                  disabled={!!editingAssignment}
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.className} - {s.admissionNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Transit Corridor & Bus *</label>
                <select
                  value={selectedRouteId}
                  onChange={(e) => setSelectedRouteId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border outline-none font-medium"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                >
                  {routes.map((r) => {
                    const remaining = r.vehicleCapacity - r.assignedStudentCount;
                    return (
                      <option key={r.id} value={r.id} disabled={remaining <= 0 && (!editingAssignment || editingAssignment.routeId !== r.id)}>
                        {r.routeNumber} ({r.assignedVehicleNumber}) — {remaining} seats available (${r.monthlyFee}/mo)
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Stop Pickers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Morning Pickup Stop *</label>
                  <select
                    value={selectedPickupStopId}
                    onChange={(e) => setSelectedPickupStopId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border outline-none text-xs"
                    style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                  >
                    {currentRoute.stops.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.stopName} ({s.morningPickupTime})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Afternoon Drop-off Stop *</label>
                  <select
                    value={selectedDropoffStopId}
                    onChange={(e) => setSelectedDropoffStopId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border outline-none text-xs"
                    style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                  >
                    {currentRoute.stops.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.stopName} ({s.afternoonDropTime})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Service Type *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['two-way', 'morning-only', 'afternoon-only'] as TransportServiceType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setServiceType(type)}
                      className={`py-2 px-2 rounded-lg border font-semibold capitalize text-center text-[11px] ${
                        serviceType === type ? 'bg-teal-700 text-white border-teal-700' : 'hover:bg-black/5'
                      }`}
                      style={serviceType !== type ? { borderColor: 'var(--color-border)' } : {}}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Special Pickup / Medical Instructions</label>
                <input
                  type="text"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g. Front booster seat, sibling companion on board"
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setEditingAssignment(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold border hover:bg-black/5"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {editingAssignment ? 'Save Changes' : 'Confirm Allocation'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
