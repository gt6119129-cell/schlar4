import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  X,
  Edit2,
  ShieldCheck,
  Calendar,
  Briefcase,
  Phone,
  Mail,
} from 'lucide-react';
import { TransportDriver } from '../../types/transport';
import { INITIAL_DRIVERS, INITIAL_VEHICLES, INITIAL_ROUTES } from '../../data/initialTransportData';

export const TransportDriversModule: React.FC = () => {
  const [drivers, setDrivers] = useState<TransportDriver[]>(INITIAL_DRIVERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [dutyFilter, setDutyFilter] = useState<'all' | 'driver' | 'attendant'>('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<TransportDriver | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dutyType: 'driver' as 'driver' | 'attendant',
    licenceNumber: '',
    licenceClass: 'Commercial CDL Class B (Passenger)',
    licenceExpiry: '2028-06-30',
    assignedVehicleId: '',
    medicalFitnessValidUntil: '2027-06-30',
    yearsExperience: 5,
    notes: '',
  });

  const filteredDrivers = useMemo(() => {
    return drivers.filter((d) => {
      const matchSearch =
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.licenceNumber && d.licenceNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (d.assignedRouteName && d.assignedRouteName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchDuty = dutyFilter === 'all' || d.dutyType === dutyFilter;

      return matchSearch && matchDuty;
    });
  }, [drivers, searchQuery, dutyFilter]);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      phone: '+1 (555) 789-22',
      email: '',
      dutyType: 'driver',
      licenceNumber: `CDL-MA-${Math.floor(100000 + Math.random() * 900000)}`,
      licenceClass: 'Commercial CDL Class B (Passenger)',
      licenceExpiry: '2028-06-30',
      assignedVehicleId: '',
      medicalFitnessValidUntil: '2027-06-30',
      yearsExperience: 5,
      notes: '',
    });
    setIsAddModalOpen(true);
  };

  const handleSaveDriver = (e: React.FormEvent) => {
    e.preventDefault();

    const vehicle = INITIAL_VEHICLES.find((v) => v.id === formData.assignedVehicleId);

    if (editingDriver) {
      setDrivers(
        drivers.map((d) =>
          d.id === editingDriver.id
            ? {
                ...d,
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                dutyType: formData.dutyType,
                licenceNumber: formData.licenceNumber,
                licenceClass: formData.licenceClass,
                licenceExpiry: formData.licenceExpiry,
                assignedVehicleId: formData.assignedVehicleId,
                assignedVehicleReg: vehicle ? `${vehicle.registrationNumber} (${vehicle.vehicleNumber})` : '',
                medicalFitnessValidUntil: formData.medicalFitnessValidUntil,
                yearsExperience: Number(formData.yearsExperience),
                notes: formData.notes,
              }
            : d
        )
      );
      setEditingDriver(null);
      setFeedback({
        type: 'success',
        message: `Updated crew profile for ${formData.name}.`,
      });
    } else {
      const newD: TransportDriver = {
        id: `drv-${Date.now()}`,
        staffId: `STAFF-TRN-${Math.floor(20 + Math.random() * 80)}`,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        dutyType: formData.dutyType,
        licenceNumber: formData.licenceNumber,
        licenceClass: formData.licenceClass,
        licenceExpiry: formData.licenceExpiry,
        status: 'active',
        assignedVehicleId: formData.assignedVehicleId,
        assignedVehicleReg: vehicle ? `${vehicle.registrationNumber} (${vehicle.vehicleNumber})` : '',
        medicalFitnessValidUntil: formData.medicalFitnessValidUntil,
        backgroundCheckPassed: true,
        yearsExperience: Number(formData.yearsExperience),
        notes: formData.notes,
      };

      setDrivers([newD, ...drivers]);
      setIsAddModalOpen(false);
      setFeedback({
        type: 'success',
        message: `Registered ${formData.dutyType === 'driver' ? 'commercial driver' : 'transit attendant'} ${formData.name}.`,
      });
    }

    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Drivers & Transport Attendants
          </h2>
          <p className="text-xs text-slate-500">
            Commercial CDL driver licensing, conductor duty rosters, background clearances, and route vehicle assignments.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-90 self-start sm:self-auto"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Crew Member</span>
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
            placeholder="Search driver by name, CDL licence, or route..."
            className="w-full bg-transparent border-none outline-none text-xs"
            style={{ color: 'var(--color-text)' }}
          />
        </div>

        <div className="flex items-center gap-1 p-0.5 rounded-lg border text-xs" style={{ borderColor: 'var(--color-border)' }}>
          {(['all', 'driver', 'attendant'] as const).map((duty) => (
            <button
              key={duty}
              onClick={() => setDutyFilter(duty)}
              className={`px-3 py-1 rounded capitalize text-[11px] font-medium transition-colors ${
                dutyFilter === duty ? 'bg-black/10 dark:bg-white/10 font-bold' : 'opacity-70'
              }`}
              style={{ color: 'var(--color-text)' }}
            >
              {duty}s
            </button>
          ))}
        </div>
      </div>

      {/* DRIVERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDrivers.map((driver) => {
          const isDriver = driver.dutyType === 'driver';
          const isExpiringSoon = driver.licenceExpiry && new Date(driver.licenceExpiry) < new Date('2026-12-01');

          return (
            <div
              key={driver.id}
              className="p-5 rounded-xl border shadow-xs transition-colors flex flex-col justify-between"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white"
                      style={{
                        backgroundColor: isDriver ? 'var(--color-primary)' : 'var(--color-secondary)',
                      }}
                    >
                      {driver.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold block" style={{ color: 'var(--color-text)' }}>
                        {driver.name}
                      </span>
                      <span className="text-[10px] text-slate-400 capitalize">
                        {driver.dutyType} · {driver.yearsExperience} yrs exp
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                      driver.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100'
                    }`}
                  >
                    {driver.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {driver.licenceNumber ? (
                    <div className="p-2.5 rounded-lg border bg-black/[0.02] space-y-0.5" style={{ borderColor: 'var(--color-border)' }}>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-400">Licence:</span>
                        <strong className="font-mono text-teal-700">{driver.licenceNumber}</strong>
                      </div>
                      <div className="text-[10px] text-slate-500">{driver.licenceClass}</div>
                      <div className={`text-[10px] font-mono ${isExpiringSoon ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                        Valid Thru: {driver.licenceExpiry} {isExpiringSoon && '(Renewal Soon)'}
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 italic">Transit Attendant (Non-Driving Crew)</div>
                  )}

                  <div className="pt-2 text-[11px] space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{driver.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{driver.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-[11px] font-medium text-slate-500 truncate max-w-[170px]">
                  {driver.assignedVehicleReg || 'No Assigned Bus'}
                </span>
                <button
                  onClick={() => {
                    setEditingDriver(driver);
                    setFormData({
                      name: driver.name,
                      phone: driver.phone,
                      email: driver.email,
                      dutyType: driver.dutyType,
                      licenceNumber: driver.licenceNumber || '',
                      licenceClass: driver.licenceClass || '',
                      licenceExpiry: driver.licenceExpiry || '',
                      assignedVehicleId: driver.assignedVehicleId || '',
                      medicalFitnessValidUntil: driver.medicalFitnessValidUntil || '',
                      yearsExperience: driver.yearsExperience,
                      notes: driver.notes || '',
                    });
                  }}
                  className="p-1.5 rounded hover:bg-black/5 text-slate-500"
                  title="Edit Crew Record"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD/EDIT CREW MODAL */}
      {(isAddModalOpen || editingDriver) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleSaveDriver}
            className="w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-teal-700" />
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  {editingDriver ? 'Edit Transport Crew Record' : 'Add Transport Crew Member'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingDriver(null);
                }}
                className="p-1 rounded hover:bg-black/5"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Mr. Robert Gallagher"
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Crew Duty *</label>
                  <select
                    value={formData.dutyType}
                    onChange={(e) => setFormData({ ...formData, dutyType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                  >
                    <option value="driver">Commercial Driver</option>
                    <option value="attendant">Transit Attendant</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Years Experience</label>
                  <input
                    type="number"
                    value={formData.yearsExperience}
                    onChange={(e) => setFormData({ ...formData, yearsExperience: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@schlar.edu"
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                  />
                </div>
              </div>

              {formData.dutyType === 'driver' && (
                <>
                  <div>
                    <label className="font-semibold block mb-1">CDL Licence Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.licenceNumber}
                      onChange={(e) => setFormData({ ...formData, licenceNumber: e.target.value })}
                      placeholder="e.g. CDL-MA-992140"
                      className="w-full px-3 py-2 rounded-lg border outline-none font-mono"
                      style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Licence Expiry Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.licenceExpiry}
                      onChange={(e) => setFormData({ ...formData, licenceExpiry: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border outline-none font-mono"
                      style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                    />
                  </div>
                </>
              )}

              <div>
                <label className="font-semibold block mb-1">Assigned Vehicle</label>
                <select
                  value={formData.assignedVehicleId}
                  onChange={(e) => setFormData({ ...formData, assignedVehicleId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                >
                  <option value="">Unassigned / Pool Reserve</option>
                  {INITIAL_VEHICLES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.vehicleNumber} ({v.registrationNumber}) — {v.seatingCapacity} seats
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingDriver(null);
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
                Save Crew Record
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
