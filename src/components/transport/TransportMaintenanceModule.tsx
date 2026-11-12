import React, { useState } from 'react';
import {
  Wrench,
  Search,
  Plus,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  X,
  FileText,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { VehicleMaintenanceRecord, MaintenanceStatus } from '../../types/transport';
import {
  INITIAL_MAINTENANCE_RECORDS,
  INITIAL_VEHICLES,
} from '../../data/initialTransportData';

export const TransportMaintenanceModule: React.FC = () => {
  const [records, setRecords] = useState<VehicleMaintenanceRecord[]>(INITIAL_MAINTENANCE_RECORDS);
  const [activeTab, setActiveTab] = useState<'service-logs' | 'compliance-vault'>('service-logs');
  const [searchQuery, setSearchQuery] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    vehicleId: INITIAL_VEHICLES[0]?.id || '',
    maintenanceType: 'Routine Service' as const,
    serviceDate: new Date().toISOString().split('T')[0],
    workshopName: 'Boston Metro Fleet Services',
    cost: 450,
    odometerReading: 35000,
    description: '',
    partsReplaced: '',
    nextServiceDueKm: 40000,
    nextServiceDueDate: '2026-12-30',
    invoiceRef: '',
  });

  const filteredRecords = records.filter((r) => {
    if (!searchQuery) return true;
    return (
      r.vehicleReg.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.workshopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.maintenanceType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSaveMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    const vehicle = INITIAL_VEHICLES.find((v) => v.id === formData.vehicleId);
    if (!vehicle) return;

    const newRecord: VehicleMaintenanceRecord = {
      id: `mnt-${Date.now()}`,
      vehicleId: vehicle.id,
      vehicleReg: `${vehicle.registrationNumber} (${vehicle.vehicleNumber})`,
      maintenanceType: formData.maintenanceType,
      serviceDate: formData.serviceDate,
      workshopName: formData.workshopName,
      cost: Number(formData.cost),
      odometerReading: Number(formData.odometerReading),
      description: formData.description,
      partsReplaced: formData.partsReplaced,
      nextServiceDueKm: Number(formData.nextServiceDueKm),
      nextServiceDueDate: formData.nextServiceDueDate,
      status: 'completed',
      invoiceRef: formData.invoiceRef || `INV-FLT-${Math.floor(1000 + Math.random() * 9000)}`,
      approvedBy: 'Transport Manager',
    };

    setRecords([newRecord, ...records]);
    setIsAddModalOpen(false);
    setFeedback({
      type: 'success',
      message: `Logged preventive maintenance for ${vehicle.vehicleNumber}. Updated next service interval to ${formData.nextServiceDueDate}.`,
    });
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Fleet Maintenance & Safety Compliance
          </h2>
          <p className="text-xs text-slate-500">
            Preventive service schedules, workshop repair orders, pneumatic brake audits, and roadworthiness compliance.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-90 self-start sm:self-auto"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Plus className="w-4 h-4" />
          <span>Log Service Work Order</span>
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

      {/* TABS */}
      <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: 'var(--color-border)' }}>
        <button
          onClick={() => setActiveTab('service-logs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'service-logs'
              ? 'bg-black/10 dark:bg-white/10 text-teal-800 dark:text-teal-300 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Workshop Service Orders ({records.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('compliance-vault')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'compliance-vault'
              ? 'bg-black/10 dark:bg-white/10 text-teal-800 dark:text-teal-300 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Statutory Document & Road Permit Matrix</span>
        </button>
      </div>

      {activeTab === 'service-logs' && (
        <div className="space-y-4">
          {/* SEARCH */}
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
              placeholder="Search work orders by bus, workshop, or service description..."
              className="w-full bg-transparent border-none outline-none text-xs"
              style={{ color: 'var(--color-text)' }}
            />
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
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase">Service Work Order</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase">Fleet Vehicle</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase">Workshop / Provider</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase">Service Details</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Cost</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase">Next Due</th>
                    <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                  {filteredRecords.map((item) => (
                    <tr key={item.id} className="hover:bg-black/[0.02]">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-teal-700 block">
                          {item.invoiceRef || item.id}
                        </span>
                        <span className="text-[10px] text-slate-400">{item.serviceDate}</span>
                      </td>

                      <td className="py-3 px-4 font-bold" style={{ color: 'var(--color-text)' }}>
                        {item.vehicleReg}
                      </td>

                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        {item.workshopName}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold block">{item.maintenanceType}</span>
                        <span className="text-[11px] text-slate-500 line-clamp-1">{item.description}</span>
                        {item.partsReplaced && (
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Parts: {item.partsReplaced}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                        ₹{item.cost.toFixed(2)}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                        {item.nextServiceDueDate}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                            item.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'compliance-vault' && (
        <div
          className="rounded-xl border shadow-xs overflow-hidden"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
              Statutory Fleet Document Expiry Register
            </h3>
            <p className="text-xs text-slate-500">
              Commercial insurance, fitness certificates, road permits, and pollution certificates across active fleet
            </p>
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
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Vehicle</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Registration</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Fitness Certificate</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Commercial Insurance</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Road Permit</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Roadworthy Status</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {INITIAL_VEHICLES.map((v) => {
                const isFitnessExpired = new Date(v.fitnessExpiry) < new Date('2026-10-22');
                const isInsuranceExpiring = new Date(v.insuranceExpiry) < new Date('2026-12-01');

                return (
                  <tr key={v.id} className="hover:bg-black/[0.02]">
                    <td className="py-3 px-4 font-bold" style={{ color: 'var(--color-text)' }}>
                      {v.vehicleNumber}
                    </td>
                    <td className="py-3 px-4 font-mono text-teal-700">{v.registrationNumber}</td>
                    <td className="py-3 px-4 font-mono">
                      <span className={isFitnessExpired ? 'text-rose-600 font-bold' : ''}>
                        {v.fitnessExpiry} {isFitnessExpired && '(EXPIRED)'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className={isInsuranceExpiring ? 'text-amber-600 font-bold' : ''}>
                        {v.insuranceExpiry} {isInsuranceExpiring && '(Due Soon)'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{v.permitExpiry}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          isFitnessExpired
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isFitnessExpired ? 'Non-Compliant' : 'Roadworthy'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* LOG SERVICE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleSaveMaintenance}
            className="w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-teal-700" />
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  Log Fleet Service Order
                </h3>
              </div>
              <button type="button" onClick={() => setIsAddModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Select Fleet Vehicle *</label>
                <select
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                >
                  {INITIAL_VEHICLES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.vehicleNumber} ({v.registrationNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Service Type *</label>
                <select
                  value={formData.maintenanceType}
                  onChange={(e) => setFormData({ ...formData, maintenanceType: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                >
                  <option value="Routine Service">Routine Preventive Service</option>
                  <option value="Brake Inspection">Brake Inspection & Pads</option>
                  <option value="Tire Replacement">Tire Replacement & Balancing</option>
                  <option value="Engine Repair">Engine & Transmission Overhaul</option>
                  <option value="Safety Inspection">Annual Safety Inspection</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Authorized Workshop *</label>
                <input
                  type="text"
                  required
                  value={formData.workshopName}
                  onChange={(e) => setFormData({ ...formData, workshopName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Repair Cost (₹ INR) *</label>
                <input
                  type="number"
                  required
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border outline-none font-mono font-bold"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold block mb-1">Work Description *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail work performed, oil grades used, diagnostic error codes resolved..."
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Next Service Due Date</label>
                <input
                  type="date"
                  value={formData.nextServiceDueDate}
                  onChange={(e) => setFormData({ ...formData, nextServiceDueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border outline-none font-mono"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Invoice / Receipt Ref</label>
                <input
                  type="text"
                  value={formData.invoiceRef}
                  onChange={(e) => setFormData({ ...formData, invoiceRef: e.target.value })}
                  placeholder="e.g. INV-BMF-9942"
                  className="w-full px-3 py-2 rounded-lg border outline-none font-mono"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
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
                Save Work Order
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
