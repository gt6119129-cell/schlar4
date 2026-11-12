import React, { useState, useMemo } from 'react';
import {
  Fuel,
  AlertTriangle,
  Search,
  Plus,
  DollarSign,
  CheckCircle2,
  X,
  FileText,
  Calendar,
  ShieldAlert,
  SlidersHorizontal,
} from 'lucide-react';
import { TransportExpense, TransportIncident, ExpenseCategory } from '../../types/transport';
import {
  INITIAL_TRANSPORT_EXPENSES,
  INITIAL_TRANSPORT_INCIDENTS,
  INITIAL_VEHICLES,
  INITIAL_ROUTES,
} from '../../data/initialTransportData';

export const TransportExpensesIncidentsModule: React.FC = () => {
  const [expenses, setExpenses] = useState<TransportExpense[]>(INITIAL_TRANSPORT_EXPENSES);
  const [incidents, setIncidents] = useState<TransportIncident[]>(INITIAL_TRANSPORT_INCIDENTS);
  const [activeTab, setActiveTab] = useState<'expenses' | 'incidents'>('expenses');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New Expense Modal
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    category: 'Fuel' as ExpenseCategory,
    vehicleId: INITIAL_VEHICLES[0]?.id || '',
    amount: 150,
    vendor: 'Sunoco Commercial Diesel Fleet Depot',
    description: '',
    receiptRef: '',
  });

  // New Incident Modal
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [incidentForm, setIncidentForm] = useState({
    category: 'Route Detour / Traffic' as const,
    severity: 'low' as const,
    vehicleId: INITIAL_VEHICLES[0]?.id || '',
    routeId: INITIAL_ROUTES[0]?.id || '',
    description: '',
    affectedStudentsCount: 10,
    actionTaken: '',
  });

  // Derived expense total
  const totalExpenseAmount = useMemo(() => {
    return expenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (!searchQuery) return true;
      return (
        e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.vehicleReg && e.vehicleReg.toLowerCase().includes(searchQuery.toLowerCase())) ||
        e.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [expenses, searchQuery]);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      if (!searchQuery) return true;
      return (
        inc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.vehicleReg.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [incidents, searchQuery]);

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const vehicle = INITIAL_VEHICLES.find((v) => v.id === expenseForm.vehicleId);

    const newExp: TransportExpense = {
      id: `exp-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      category: expenseForm.category,
      vehicleId: expenseForm.vehicleId,
      vehicleReg: vehicle ? `${vehicle.registrationNumber} (${vehicle.vehicleNumber})` : undefined,
      amount: Number(expenseForm.amount),
      vendor: expenseForm.vendor,
      description: expenseForm.description,
      receiptRef: expenseForm.receiptRef || `RCPT-FLT-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentStatus: 'paid',
      recordedBy: 'Transport Manager',
    };

    setExpenses([newExp, ...expenses]);
    setIsExpenseModalOpen(false);
    setFeedback({
      type: 'success',
      message: `Recorded ${expenseForm.category} expense of ₹${Number(expenseForm.amount).toFixed(2)}.`,
    });
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleSaveIncident = (e: React.FormEvent) => {
    e.preventDefault();
    const vehicle = INITIAL_VEHICLES.find((v) => v.id === incidentForm.vehicleId);
    const route = INITIAL_ROUTES.find((r) => r.id === incidentForm.routeId);

    const newInc: TransportIncident = {
      id: `inc-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      vehicleId: incidentForm.vehicleId,
      vehicleReg: vehicle?.registrationNumber || 'Fleet Vehicle',
      routeId: incidentForm.routeId,
      routeName: route?.name || 'Assigned Corridor',
      driverName: route?.assignedDriverName || 'Route Driver',
      category: incidentForm.category,
      severity: incidentForm.severity,
      description: incidentForm.description,
      affectedStudentsCount: Number(incidentForm.affectedStudentsCount),
      actionTaken: incidentForm.actionTaken,
      followUpRequired: incidentForm.severity !== 'low',
      status: 'resolved',
      reportedBy: 'Transport Manager',
    };

    setIncidents([newInc, ...incidents]);
    setIsIncidentModalOpen(false);
    setFeedback({
      type: 'success',
      message: `Safety incident log recorded and filed under ${incidentForm.category}.`,
    });
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Operating Expenses & Safety Incident Register
          </h2>
          <p className="text-xs text-slate-500">
            Fuel logs, vendor invoices, roadside incident tracking, detour logging, and safety circulars.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'expenses' ? (
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-90 self-start sm:self-auto"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Plus className="w-4 h-4" />
              <span>Record Expense / Fuel</span>
            </button>
          ) : (
            <button
              onClick={() => setIsIncidentModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-90 self-start sm:self-auto"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Log Safety Incident</span>
            </button>
          )}
        </div>
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
          onClick={() => setActiveTab('expenses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'expenses'
              ? 'bg-black/10 dark:bg-white/10 text-teal-800 dark:text-teal-300 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Fuel className="w-4 h-4" />
          <span>Fleet Operating Expenses (Total: ${totalExpenseAmount.toFixed(2)})</span>
        </button>

        <button
          onClick={() => setActiveTab('incidents')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'incidents'
              ? 'bg-black/10 dark:bg-white/10 text-teal-800 dark:text-teal-300 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Safety Incident Register ({incidents.length})</span>
        </button>
      </div>

      {/* EXPENSES TAB */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
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
              placeholder="Search expenses by vendor, category, or bus..."
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
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Date & Receipt</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Category</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Fleet Vehicle</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Vendor / Payee</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Description</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-black/[0.02]">
                    <td className="py-3 px-4">
                      <span className="font-mono text-slate-500 block">{exp.date}</span>
                      <span className="font-mono text-[10px] text-teal-700 font-bold">{exp.receiptRef}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/5">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold">{exp.vehicleReg || 'Fleet Shared'}</td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{exp.vendor}</td>
                    <td className="py-3 px-4 text-slate-500">{exp.description}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                      ₹{exp.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INCIDENTS TAB */}
      {activeTab === 'incidents' && (
        <div className="space-y-4">
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
              placeholder="Search incidents..."
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
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Incident & Time</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Category</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Vehicle & Route</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase">Description & Action</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Severity</th>
                  <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {filteredIncidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-black/[0.02]">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold block">{inc.date}</span>
                      <span className="font-mono text-[10px] text-slate-400">{inc.time}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      {inc.category}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold block">{inc.vehicleReg}</span>
                      <span className="text-[10px] text-slate-500">{inc.routeName} ({inc.driverName})</span>
                    </td>
                    <td className="py-3 px-4 max-w-sm">
                      <p className="text-slate-700 dark:text-slate-300 leading-snug">{inc.description}</p>
                      <p className="text-[11px] text-teal-700 dark:text-teal-400 mt-1 font-medium">
                        Action: {inc.actionTaken}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          inc.severity === 'high'
                            ? 'bg-rose-100 text-rose-800'
                            : inc.severity === 'medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {inc.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 capitalize">
                        {inc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RECORD EXPENSE MODAL */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleSaveExpense}
            className="w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <Fuel className="w-5 h-5 text-teal-700" />
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  Record Fleet Expense / Fuel
                </h3>
              </div>
              <button type="button" onClick={() => setIsExpenseModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Expense Category *</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                >
                  <option value="Fuel">Fuel (Diesel / CNG Refuel)</option>
                  <option value="Repairs">Repairs & Parts</option>
                  <option value="Scheduled Maintenance">Scheduled Maintenance</option>
                  <option value="Insurance">Insurance Premiums</option>
                  <option value="Permits & Taxes">Permits & Statutory Taxes</option>
                  <option value="Safety Equipment">Safety Equipment & Supplies</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Fleet Vehicle</label>
                <select
                  value={expenseForm.vehicleId}
                  onChange={(e) => setExpenseForm({ ...expenseForm, vehicleId: e.target.value })}
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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Amount (₹ INR) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border outline-none font-mono font-bold"
                    style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Receipt / Invoice Ref</label>
                  <input
                    type="text"
                    value={expenseForm.receiptRef}
                    onChange={(e) => setExpenseForm({ ...expenseForm, receiptRef: e.target.value })}
                    placeholder="e.g. RCPT-SUN-7722"
                    className="w-full px-3 py-2 rounded-lg border outline-none font-mono"
                    style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Vendor / Payee *</label>
                <input
                  type="text"
                  required
                  value={expenseForm.vendor}
                  onChange={(e) => setExpenseForm({ ...expenseForm, vendor: e.target.value })}
                  placeholder="e.g. Sunoco Commercial Fleet Depot"
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Description</label>
                <input
                  type="text"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  placeholder="e.g. 52.4 gallons ultra-low sulfur diesel"
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => setIsExpenseModalOpen(false)}
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
                Save Expense
              </button>
            </div>
          </form>
        </div>
      )}

      {/* RECORD INCIDENT MODAL */}
      {isIncidentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleSaveIncident}
            className="w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  Log Safety Incident / Detour
                </h3>
              </div>
              <button type="button" onClick={() => setIsIncidentModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Incident Category *</label>
                <select
                  value={incidentForm.category}
                  onChange={(e) => setIncidentForm({ ...incidentForm, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                >
                  <option value="Route Detour / Traffic">Route Detour / Severe Traffic Delay</option>
                  <option value="Minor Mechanical Delay">Minor Mechanical / Tire Issue</option>
                  <option value="Minor Scrape / Collision">Minor Scrape / Collision</option>
                  <option value="Medical / First Aid">Medical / Student First Aid on Board</option>
                  <option value="Disciplinary / Behavioral">Disciplinary / Behavioral Incident</option>
                  <option value="Weather Delay">Weather & Road Hazard Delay</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Corridor Route *</label>
                  <select
                    value={incidentForm.routeId}
                    onChange={(e) => setIncidentForm({ ...incidentForm, routeId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                  >
                    {INITIAL_ROUTES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.routeNumber}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Severity</label>
                  <select
                    value={incidentForm.severity}
                    onChange={(e) => setIncidentForm({ ...incidentForm, severity: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                  >
                    <option value="low">Low (Standard logging)</option>
                    <option value="medium">Medium (Supervisor review)</option>
                    <option value="high">High (Immediate notice)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Incident Narrative *</label>
                <textarea
                  required
                  rows={2}
                  value={incidentForm.description}
                  onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })}
                  placeholder="Exact description of location, road condition, and events..."
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Action Taken & Dispatch Resolution *</label>
                <textarea
                  required
                  rows={2}
                  value={incidentForm.actionTaken}
                  onChange={(e) => setIncidentForm({ ...incidentForm, actionTaken: e.target.value })}
                  placeholder="Driver response, alternate corridor taken, communications issued..."
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => setIsIncidentModalOpen(false)}
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
                File Safety Log
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
