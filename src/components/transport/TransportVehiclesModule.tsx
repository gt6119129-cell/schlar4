import React, { useState, useMemo } from 'react';
import {
  Bus,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  X,
  Edit2,
  Wrench,
  ShieldCheck,
  Calendar,
  Truck,
} from 'lucide-react';
import { Vehicle, VehicleType, VehicleOperationalStatus } from '../../types/transport';
import { INITIAL_VEHICLES, INITIAL_ROUTES, INITIAL_DRIVERS } from '../../data/initialTransportData';

export const TransportVehiclesModule: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    registrationNumber: '',
    vehicleNumber: '',
    type: 'Standard Bus' as VehicleType,
    makeModel: '',
    seatingCapacity: 40,
    operationalStatus: 'active' as VehicleOperationalStatus,
    assignedRouteId: '',
    assignedDriverId: '',
    insuranceExpiry: '2027-06-30',
    fitnessExpiry: '2027-06-30',
    permitExpiry: '2027-08-31',
    pollutionExpiry: '2027-05-31',
    fuelType: 'Diesel' as 'Diesel' | 'CNG' | 'Electric' | 'Hybrid',
    notes: '',
  });

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchSearch =
        v.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.makeModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.assignedRouteName && v.assignedRouteName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus = statusFilter === 'all' || v.operationalStatus === statusFilter;
      const matchType = typeFilter === 'all' || v.type === typeFilter;

      return matchSearch && matchStatus && matchType;
    });
  }, [vehicles, searchQuery, statusFilter, typeFilter]);

  const handleOpenAdd = () => {
    setFormData({
      registrationNumber: '',
      vehicleNumber: `Bus #${Math.floor(10 + Math.random() * 90)}`,
      type: 'Standard Bus',
      makeModel: 'Blue Bird Vision (2024)',
      seatingCapacity: 40,
      operationalStatus: 'active',
      assignedRouteId: '',
      assignedDriverId: '',
      insuranceExpiry: '2027-06-30',
      fitnessExpiry: '2027-06-30',
      permitExpiry: '2027-08-31',
      pollutionExpiry: '2027-05-31',
      fuelType: 'Diesel',
      notes: '',
    });
    setIsAddModalOpen(true);
  };

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent assigning inactive or maintenance vehicle to active route
    if (
      formData.operationalStatus !== 'active' &&
      formData.assignedRouteId &&
      formData.assignedRouteId !== ''
    ) {
      setFeedback({
        type: 'error',
        message: 'Cannot assign a vehicle marked inactive or under maintenance to an active transit route.',
      });
      return;
    }

    const route = INITIAL_ROUTES.find((r) => r.id === formData.assignedRouteId);
    const driver = INITIAL_DRIVERS.find((d) => d.id === formData.assignedDriverId);

    if (editingVehicle) {
      setVehicles(
        vehicles.map((v) =>
          v.id === editingVehicle.id
            ? {
                ...v,
                registrationNumber: formData.registrationNumber,
                vehicleNumber: formData.vehicleNumber,
                type: formData.type,
                makeModel: formData.makeModel,
                seatingCapacity: Number(formData.seatingCapacity),
                operationalStatus: formData.operationalStatus,
                assignedRouteId: formData.assignedRouteId,
                assignedRouteName: route?.name || '',
                assignedDriverId: formData.assignedDriverId,
                assignedDriverName: driver?.name || '',
                insuranceExpiry: formData.insuranceExpiry,
                fitnessExpiry: formData.fitnessExpiry,
                permitExpiry: formData.permitExpiry,
                pollutionExpiry: formData.pollutionExpiry,
                fuelType: formData.fuelType,
                notes: formData.notes,
              }
            : v
        )
      );
      setEditingVehicle(null);
      setFeedback({
        type: 'success',
        message: `Updated vehicle ${formData.vehicleNumber} (${formData.registrationNumber}) records.`,
      });
    } else {
      const newVeh: Vehicle = {
        id: `veh-${Date.now()}`,
        registrationNumber: formData.registrationNumber,
        vehicleNumber: formData.vehicleNumber,
        type: formData.type,
        makeModel: formData.makeModel,
        seatingCapacity: Number(formData.seatingCapacity),
        operationalStatus: formData.operationalStatus,
        assignedRouteId: formData.assignedRouteId,
        assignedRouteName: route?.name || '',
        assignedDriverId: formData.assignedDriverId,
        assignedDriverName: driver?.name || '',
        purchaseDate: new Date().toISOString().split('T')[0],
        insuranceExpiry: formData.insuranceExpiry,
        fitnessExpiry: formData.fitnessExpiry,
        permitExpiry: formData.permitExpiry,
        pollutionExpiry: formData.pollutionExpiry,
        lastServiceDate: new Date().toISOString().split('T')[0],
        nextServiceDue: '2026-12-30',
        odometerKm: 500,
        fuelType: formData.fuelType,
        notes: formData.notes,
      };

      setVehicles([newVeh, ...vehicles]);
      setIsAddModalOpen(false);
      setFeedback({
        type: 'success',
        message: `Registered vehicle ${formData.vehicleNumber} into fleet registry.`,
      });
    }

    setTimeout(() => setFeedback(null), 5000);
  };

  const isDocumentExpiringSoon = (expiryDate: string) => {
    const exp = new Date(expiryDate).getTime();
    const now = new Date('2026-10-22').getTime();
    const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
    return { isExpired: diffDays < 0, isExpiringSoon: diffDays >= 0 && diffDays <= 45, days: diffDays };
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Fleet Vehicle Registry & Road Compliance
          </h2>
          <p className="text-xs text-slate-500">
            Registered transit coaches, mini-buses, passenger vans, seating capacity limits, and statutory document tracking.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-90 self-start sm:self-auto"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
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
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* FILTER BAR */}
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
            placeholder="Search by registration number, bus label, or make..."
            className="w-full bg-transparent border-none outline-none text-xs"
            style={{ color: 'var(--color-text)' }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border text-xs outline-none"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <option value="all">All Operational Statuses</option>
            <option value="active">Active Service</option>
            <option value="maintenance">Under Maintenance</option>
            <option value="standby">Standby / Spare</option>
            <option value="out-of-service">Out of Service</option>
          </select>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border text-xs outline-none"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <option value="all">All Vehicle Types</option>
            <option value="Standard Bus">Standard Bus</option>
            <option value="Mini-Bus">Mini-Bus</option>
            <option value="Van">Passenger Van</option>
          </select>
        </div>
      </div>

      {/* VEHICLES TABLE */}
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
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Vehicle & Reg No</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Make & Model</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Seating Capacity</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Route & Crew</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Document Expiry</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {filteredVehicles.map((veh) => {
                const insCheck = isDocumentExpiringSoon(veh.insuranceExpiry);
                const fitCheck = isDocumentExpiringSoon(veh.fitnessExpiry);
                const hasWarning = insCheck.isExpiringSoon || insCheck.isExpired || fitCheck.isExpired || fitCheck.isExpiringSoon;

                return (
                  <tr key={veh.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                    <td className="py-3 px-4">
                      <span className="font-bold text-sm block" style={{ color: 'var(--color-text)' }}>
                        {veh.vehicleNumber}
                      </span>
                      <span className="font-mono text-[11px] text-teal-700 font-semibold block">
                        {veh.registrationNumber}
                      </span>
                      <span className="text-[10px] text-slate-400 capitalize">{veh.type} · {veh.fuelType}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-700 dark:text-slate-300 block">{veh.makeModel}</span>
                      <span className="font-mono text-[10px] text-slate-400">Odo: {veh.odometerKm.toLocaleString()} km</span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-mono font-bold text-xs bg-black/5 dark:bg-white/5">
                        {veh.seatingCapacity} seats
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {veh.assignedRouteName ? (
                        <>
                          <span className="font-semibold block truncate max-w-[180px]" style={{ color: 'var(--color-text)' }}>
                            {veh.assignedRouteName}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            Driver: {veh.assignedDriverName || 'Unassigned'}
                          </span>
                        </>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">No Active Route (Spare)</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-0.5 text-[10px] font-mono">
                        <div className={fitCheck.isExpired ? 'text-rose-600 font-bold' : fitCheck.isExpiringSoon ? 'text-amber-600 font-semibold' : 'text-slate-500'}>
                          Fitness: {veh.fitnessExpiry} {fitCheck.isExpired && '(EXPIRED!)'}
                        </div>
                        <div className={insCheck.isExpiringSoon ? 'text-amber-600 font-semibold' : 'text-slate-500'}>
                          Insurance: {veh.insuranceExpiry} {insCheck.isExpiringSoon && '(Expiring Soon)'}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                          veh.operationalStatus === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : veh.operationalStatus === 'maintenance'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {veh.operationalStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setEditingVehicle(veh);
                          setFormData({
                            registrationNumber: veh.registrationNumber,
                            vehicleNumber: veh.vehicleNumber,
                            type: veh.type,
                            makeModel: veh.makeModel,
                            seatingCapacity: veh.seatingCapacity,
                            operationalStatus: veh.operationalStatus,
                            assignedRouteId: veh.assignedRouteId || '',
                            assignedDriverId: veh.assignedDriverId || '',
                            insuranceExpiry: veh.insuranceExpiry,
                            fitnessExpiry: veh.fitnessExpiry,
                            permitExpiry: veh.permitExpiry,
                            pollutionExpiry: veh.pollutionExpiry,
                            fuelType: veh.fuelType,
                            notes: veh.notes || '',
                          });
                        }}
                        className="p-1.5 rounded hover:bg-black/5 text-slate-500 hover:text-slate-700"
                        title="Edit Vehicle & Compliance"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT VEHICLE MODAL */}
      {(isAddModalOpen || editingVehicle) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleSaveVehicle}
            className="w-full max-w-xl rounded-2xl border p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-teal-700" />
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  {editingVehicle ? 'Edit Vehicle Records' : 'Add Vehicle to Fleet'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingVehicle(null);
                }}
                className="p-1 rounded hover:bg-black/5"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Registration Plate Number *</label>
                <input
                  type="text"
                  required
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  placeholder="e.g. MA-SCH-8850"
                  className="w-full px-3 py-2 rounded-lg border outline-none font-mono"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Fleet Call Sign / Label *</label>
                <input
                  type="text"
                  required
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                  placeholder="e.g. Bus #05"
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Vehicle Classification</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as VehicleType })}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                >
                  <option value="Standard Bus">Standard Bus (36–48 seats)</option>
                  <option value="Mini-Bus">Mini-Bus (20–28 seats)</option>
                  <option value="Van">Passenger Van (12–16 seats)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Seating Capacity (Students) *</label>
                <input
                  type="number"
                  required
                  min="8"
                  max="70"
                  value={formData.seatingCapacity}
                  onChange={(e) => setFormData({ ...formData, seatingCapacity: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border outline-none font-bold"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold block mb-1">Make & Model</label>
                <input
                  type="text"
                  value={formData.makeModel}
                  onChange={(e) => setFormData({ ...formData, makeModel: e.target.value })}
                  placeholder="e.g. Thomas Built Saf-T-Liner C2 (2023)"
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Operational Status</label>
                <select
                  value={formData.operationalStatus}
                  onChange={(e) => setFormData({ ...formData, operationalStatus: e.target.value as VehicleOperationalStatus })}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                >
                  <option value="active">Active Service</option>
                  <option value="maintenance">Under Maintenance</option>
                  <option value="standby">Standby (Reserve)</option>
                  <option value="out-of-service">Out of Service</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Assigned Corridor Route</label>
                <select
                  value={formData.assignedRouteId}
                  onChange={(e) => setFormData({ ...formData, assignedRouteId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                >
                  <option value="">None / Standby</option>
                  {INITIAL_ROUTES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.routeNumber} ({r.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Fitness Certificate Expiry *</label>
                <input
                  type="date"
                  required
                  value={formData.fitnessExpiry}
                  onChange={(e) => setFormData({ ...formData, fitnessExpiry: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border outline-none font-mono"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Commercial Insurance Expiry *</label>
                <input
                  type="date"
                  required
                  value={formData.insuranceExpiry}
                  onChange={(e) => setFormData({ ...formData, insuranceExpiry: e.target.value })}
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
                  setEditingVehicle(null);
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
                {editingVehicle ? 'Save Vehicle Updates' : 'Add to Fleet'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
