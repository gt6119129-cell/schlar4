import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Search,
  Plus,
  Clock,
  Bus,
  Users,
  CheckCircle2,
  AlertTriangle,
  X,
  Edit2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { TransportRoute, RouteStop } from '../../types/transport';
import { useSchoolData } from '../../context/SchoolDataContext';

export const TransportRoutesModule: React.FC = () => {
  const {
    transportRoutes: routes,
    transportVehicles: vehicles,
    transportDrivers: drivers,
    addTransportRoute,
    updateTransportRoute,
    deleteTransportRoute,
  } = useSchoolData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<TransportRoute | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<TransportRoute | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    routeNumber: '',
    name: '',
    description: '',
    assignedVehicleId: vehicles[0]?.id || '',
    assignedDriverId: drivers[0]?.id || '',
    assignedAttendantId: '',
    morningStartTime: '07:15 AM',
    morningEndTime: '08:10 AM',
    afternoonStartTime: '03:30 PM',
    afternoonEndTime: '04:20 PM',
    monthlyFee: 140,
  });

  const filteredRoutes = useMemo(() => {
    return routes.filter((r) => {
      if (!searchQuery) return true;
      return (
        r.routeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.stops.some((s) => s.stopName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [routes, searchQuery]);

  const handleOpenAdd = () => {
    setFormData({
      routeNumber: `Route R-0${routes.length + 1}`,
      name: '',
      description: '',
      assignedVehicleId: vehicles[0]?.id || '',
      assignedDriverId: drivers[0]?.id || '',
      assignedAttendantId: '',
      morningStartTime: '07:15 AM',
      morningEndTime: '08:10 AM',
      afternoonStartTime: '03:30 PM',
      afternoonEndTime: '04:20 PM',
      monthlyFee: 140,
    });
    setIsAddModalOpen(true);
  };

  const handleSaveRoute = (e: React.FormEvent) => {
    e.preventDefault();
    const vehicle = vehicles.find((v) => v.id === formData.assignedVehicleId);
    const driver = drivers.find((d) => d.id === formData.assignedDriverId);
    const attendant = drivers.find((d) => d.id === formData.assignedAttendantId);

    if (editingRoute) {
      const res = updateTransportRoute(editingRoute.id, {
        routeNumber: formData.routeNumber,
        name: formData.name,
        description: formData.description,
        assignedVehicleId: formData.assignedVehicleId,
        assignedVehicleNumber: vehicle?.vehicleNumber || editingRoute.assignedVehicleNumber,
        vehicleCapacity: vehicle?.seatingCapacity || editingRoute.vehicleCapacity,
        assignedDriverId: formData.assignedDriverId,
        assignedDriverName: driver?.name || editingRoute.assignedDriverName,
        assignedAttendantId: formData.assignedAttendantId,
        assignedAttendantName: attendant?.name,
        morningStartTime: formData.morningStartTime,
        morningEndTime: formData.morningEndTime,
        afternoonStartTime: formData.afternoonStartTime,
        afternoonEndTime: formData.afternoonEndTime,
        monthlyFee: Number(formData.monthlyFee),
      });

      if (res.isValid) {
        setEditingRoute(null);
        setFeedback({ type: 'success', message: `Updated route ${formData.routeNumber}.` });
      } else {
        setFeedback({ type: 'error', message: res.message || 'Failed to update route.' });
        return;
      }
    } else {
      const defaultStops: RouteStop[] = [
        {
          id: `stp-${Date.now()}-1`,
          stopName: 'First District Pickup Stop',
          sequenceOrder: 1,
          morningPickupTime: formData.morningStartTime,
          afternoonDropTime: formData.afternoonEndTime,
          landmark: 'Main Boulevard Junction',
          studentCount: 0,
        },
        {
          id: `stp-${Date.now()}-2`,
          stopName: 'Central Square Transit Stop',
          sequenceOrder: 2,
          morningPickupTime: '07:35 AM',
          afternoonDropTime: '03:55 PM',
          landmark: 'Community Center Plaza',
          studentCount: 0,
        },
        {
          id: `stp-${Date.now()}-3`,
          stopName: 'SCHLAR Main Campus Depot',
          sequenceOrder: 3,
          morningPickupTime: formData.morningEndTime,
          afternoonDropTime: formData.afternoonStartTime,
          landmark: 'Central Bus Terminal',
          studentCount: 0,
        },
      ];

      const res = addTransportRoute({
        routeNumber: formData.routeNumber,
        name: formData.name,
        description: formData.description,
        status: 'active',
        assignedVehicleId: formData.assignedVehicleId,
        assignedVehicleNumber: vehicle?.vehicleNumber || 'Bus #01',
        vehicleCapacity: vehicle?.seatingCapacity || 40,
        assignedDriverId: formData.assignedDriverId,
        assignedDriverName: driver?.name || 'Assigned Driver',
        assignedAttendantId: formData.assignedAttendantId,
        assignedAttendantName: attendant?.name,
        stops: defaultStops,
        totalStops: defaultStops.length,
        morningStartTime: formData.morningStartTime,
        morningEndTime: formData.morningEndTime,
        afternoonStartTime: formData.afternoonStartTime,
        afternoonEndTime: formData.afternoonEndTime,
        monthlyFee: Number(formData.monthlyFee),
      });

      if (res.isValid) {
        setIsAddModalOpen(false);
        setFeedback({ type: 'success', message: `Configured new transit corridor ${formData.routeNumber}.` });
      } else {
        setFeedback({ type: 'error', message: res.message || 'Failed to create route.' });
        return;
      }
    }

    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Transit Corridors & Stop Directories
          </h2>
          <p className="text-xs text-slate-500">
            Ordered stop sequences, morning pickup and afternoon drop timetables, vehicle capacity, and driver dispatch.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-90 self-start sm:self-auto"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Plus className="w-4 h-4" />
          <span>New Route Corridor</span>
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
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SEARCH BAR */}
      <div
        className="p-3 rounded-xl border flex items-center gap-2 shadow-xs"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search corridors, route numbers, or designated stops..."
          className="w-full bg-transparent border-none outline-none text-xs"
          style={{ color: 'var(--color-text)' }}
        />
      </div>

      {/* ROUTES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRoutes.map((route) => {
          const remainingSeats = route.vehicleCapacity - route.assignedStudentCount;
          const utilizationPercent = ((route.assignedStudentCount / route.vehicleCapacity) * 100).toFixed(0);
          const isHighLoad = Number(utilizationPercent) >= 90;

          return (
            <div
              key={route.id}
              className="p-5 rounded-2xl border shadow-xs transition-colors space-y-4 flex flex-col justify-between"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                      {route.routeNumber}
                    </span>
                    <h3 className="text-base font-bold mt-1" style={{ color: 'var(--color-text)' }}>
                      {route.name}
                    </h3>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                    ₹{route.monthlyFee.toLocaleString('en-IN')}/mo
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  {route.description}
                </p>

                {/* Assigned bus & crew */}
                <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl border bg-black/[0.02]" style={{ borderColor: 'var(--color-border)' }}>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Assigned Bus</span>
                    <strong className="text-teal-700">{route.assignedVehicleNumber}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Driver</span>
                    <strong className="text-slate-800 dark:text-slate-200">{route.assignedDriverName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">AM Window</span>
                    <span className="font-mono text-[11px]">{route.morningStartTime} – {route.morningEndTime}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">PM Window</span>
                    <span className="font-mono text-[11px]">{route.afternoonStartTime} – {route.afternoonEndTime}</span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="mt-4 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Passenger Seating Allocation:</span>
                    <span className="font-mono font-bold">
                      {route.assignedStudentCount} / {route.vehicleCapacity} seats ({remainingSeats} left)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isHighLoad ? 'bg-amber-500' : 'bg-teal-600'
                      }`}
                      style={{ width: `${Math.min(100, Number(utilizationPercent))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-slate-500 font-medium text-[11px]">
                  {route.stops.length} ordered stops
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedRoute(route)}
                    className="px-3 py-1.5 rounded-lg border font-semibold hover:bg-black/5 flex items-center gap-1.5"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <span>View Stop Sequence</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      setEditingRoute(route);
                      setFormData({
                        routeNumber: route.routeNumber,
                        name: route.name,
                        description: route.description,
                        assignedVehicleId: route.assignedVehicleId,
                        assignedDriverId: route.assignedDriverId,
                        assignedAttendantId: route.assignedAttendantId || '',
                        morningStartTime: route.morningStartTime,
                        morningEndTime: route.morningEndTime,
                        afternoonStartTime: route.afternoonStartTime,
                        afternoonEndTime: route.afternoonEndTime,
                        monthlyFee: route.monthlyFee,
                      });
                    }}
                    className="p-1.5 rounded hover:bg-black/5 text-slate-500"
                    title="Edit Route"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* VIEW ORDERED STOPS MODAL */}
      {selectedRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-start justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <span className="font-mono text-xs font-bold text-teal-700">
                  {selectedRoute.routeNumber}
                </span>
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  {selectedRoute.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Vehicle: {selectedRoute.assignedVehicleNumber} · Driver: {selectedRoute.assignedDriverName}
                </p>
              </div>
              <button onClick={() => setSelectedRoute(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Stops Timeline */}
            <div className="space-y-4 py-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Ordered Stop Sequence ({selectedRoute.stops.length} stops)
              </h4>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-teal-500/30">
                {selectedRoute.stops.map((stop, idx) => (
                  <div key={stop.id} className="relative">
                    <div className="absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-teal-600 bg-white flex items-center justify-center text-[9px] font-bold text-teal-800">
                      {idx + 1}
                    </div>
                    <div className="p-3 rounded-xl border bg-black/[0.02] text-xs space-y-1" style={{ borderColor: 'var(--color-border)' }}>
                      <div className="flex items-center justify-between font-bold">
                        <span style={{ color: 'var(--color-text)' }}>{stop.stopName}</span>
                        <span className="font-mono text-[10px] text-teal-700">{stop.morningPickupTime}</span>
                      </div>
                      {stop.landmark && (
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{stop.landmark}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t" style={{ borderColor: 'var(--color-border)' }}>
                        <span>AM Pickup: {stop.morningPickupTime}</span>
                        <span>PM Drop-off: {stop.afternoonDropTime}</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{stop.studentCount} Assigned</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                onClick={() => setSelectedRoute(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border hover:bg-black/5"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT ROUTE MODAL */}
      {(isAddModalOpen || editingRoute) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleSaveRoute}
            className="w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                {editingRoute ? 'Edit Transit Corridor' : 'Create New Route Corridor'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingRoute(null);
                }}
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Route Identifier *</label>
                <input
                  type="text"
                  required
                  value={formData.routeNumber}
                  onChange={(e) => setFormData({ ...formData, routeNumber: e.target.value })}
                  placeholder="e.g. Route R-05"
                  className="w-full px-3 py-2 rounded-lg border outline-none font-mono"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Monthly Fare (₹ INR) *</label>
                <input
                  type="number"
                  required
                  value={formData.monthlyFee}
                  onChange={(e) => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border outline-none font-mono font-bold"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold block mb-1">Corridor Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Quincy & Braintree Coastal Express"
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Neighborhood transit coverage notes..."
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Assigned Fleet Vehicle *</label>
                <select
                  value={formData.assignedVehicleId}
                  onChange={(e) => setFormData({ ...formData, assignedVehicleId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.vehicleNumber} ({v.seatingCapacity} seats)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Assigned Commercial Driver *</label>
                <select
                  value={formData.assignedDriverId}
                  onChange={(e) => setFormData({ ...formData, assignedDriverId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                >
                  {drivers.filter((d) => d.dutyType === 'driver').map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.licenceNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Morning Departs Campus</label>
                <input
                  type="text"
                  value={formData.morningStartTime}
                  onChange={(e) => setFormData({ ...formData, morningStartTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border outline-none font-mono"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Morning Arrives Campus</label>
                <input
                  type="text"
                  value={formData.morningEndTime}
                  onChange={(e) => setFormData({ ...formData, morningEndTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border outline-none font-mono"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingRoute(null);
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
                Save Corridor
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
