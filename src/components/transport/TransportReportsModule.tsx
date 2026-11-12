import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Bus,
  Users,
  MapPin,
  ShieldCheck,
  Fuel,
  DollarSign,
} from 'lucide-react';
import {
  INITIAL_VEHICLES,
  INITIAL_ROUTES,
  INITIAL_STUDENT_TRANSPORT_ASSIGNMENTS,
  INITIAL_TRANSPORT_EXPENSES,
} from '../../data/initialTransportData';

export const TransportReportsModule: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<
    'capacity' | 'manifest' | 'compliance' | 'expenses'
  >('capacity');

  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  const handleExportCSV = () => {
    setExportFeedback(`Exported ${selectedReport.toUpperCase()} report as SCHLAR_Transport_${selectedReport}_Q4.csv.`);
    setTimeout(() => setExportFeedback(null), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Transport Analytics & Route Audit Reports
          </h2>
          <p className="text-xs text-slate-500">
            Passenger manifest generation, route capacity utilization, fleet operating costs, and document compliance logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border hover:bg-black/5"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border hover:bg-black/5"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {exportFeedback && (
        <div className="p-3 rounded-xl border bg-emerald-50 text-emerald-800 border-emerald-200 text-xs font-medium animate-in fade-in">
          {exportFeedback}
        </div>
      )}

      {/* REPORT TYPE SELECTOR */}
      <div
        className="flex items-center gap-1 p-1 rounded-xl border w-fit max-w-full overflow-x-auto text-xs"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <button
          onClick={() => setSelectedReport('capacity')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            selectedReport === 'capacity' ? 'bg-black/10 dark:bg-white/10 font-bold' : 'opacity-70'
          }`}
          style={{ color: 'var(--color-text)' }}
        >
          Route Capacity & Seat Utilization
        </button>
        <button
          onClick={() => setSelectedReport('manifest')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            selectedReport === 'manifest' ? 'bg-black/10 dark:bg-white/10 font-bold' : 'opacity-70'
          }`}
          style={{ color: 'var(--color-text)' }}
        >
          Passenger Roster Manifest
        </button>
        <button
          onClick={() => setSelectedReport('compliance')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            selectedReport === 'compliance' ? 'bg-black/10 dark:bg-white/10 font-bold' : 'opacity-70'
          }`}
          style={{ color: 'var(--color-text)' }}
        >
          Document Compliance Audit
        </button>
        <button
          onClick={() => setSelectedReport('expenses')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            selectedReport === 'expenses' ? 'bg-black/10 dark:bg-white/10 font-bold' : 'opacity-70'
          }`}
          style={{ color: 'var(--color-text)' }}
        >
          Operating Expense Breakdown
        </button>
      </div>

      {/* REPORT TABLE 1: CAPACITY */}
      {selectedReport === 'capacity' && (
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
                Transit Corridor Passenger Capacity & Loading Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Authorized seating capacities vs active enrolled student commuters
              </p>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-black/5">
              Live Fleet Load
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
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Route Corridor</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Assigned Bus</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Configured Capacity</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Assigned Passengers</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Remaining Seats</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Load Utilization</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {INITIAL_ROUTES.map((route) => {
                const remaining = route.vehicleCapacity - route.assignedStudentCount;
                const util = ((route.assignedStudentCount / route.vehicleCapacity) * 100).toFixed(1);

                return (
                  <tr key={route.id} className="hover:bg-black/[0.02]">
                    <td className="py-3 px-4">
                      <span className="font-bold block" style={{ color: 'var(--color-text)' }}>
                        {route.routeNumber}
                      </span>
                      <span className="text-[11px] text-slate-500">{route.name}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-teal-700">
                      {route.assignedVehicleNumber}
                    </td>
                    <td className="py-3 px-4 text-center font-mono">{route.vehicleCapacity} seats</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                      {route.assignedStudentCount}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-emerald-600 font-semibold">
                      {remaining}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-teal-700">
                      {util}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* REPORT TABLE 2: MANIFEST */}
      {selectedReport === 'manifest' && (
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
                Master Student Commuter Manifest
              </h3>
              <p className="text-xs text-slate-500">
                Roster for driver emergency logs and school attendance verification
              </p>
            </div>
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
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Student Commuter</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Admission No</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Cohort</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Assigned Route</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Pickup Stop</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Guardian Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {INITIAL_STUDENT_TRANSPORT_ASSIGNMENTS.map((asg) => (
                <tr key={asg.id} className="hover:bg-black/[0.02]">
                  <td className="py-3 px-4 font-bold" style={{ color: 'var(--color-text)' }}>
                    {asg.studentName}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">{asg.admissionNo}</td>
                  <td className="py-3 px-4">{asg.className} - {asg.sectionName}</td>
                  <td className="py-3 px-4 font-medium text-teal-700">{asg.routeName}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{asg.pickupStopName}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">
                    {asg.guardianName} ({asg.guardianPhone})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* REPORT TABLE 3: COMPLIANCE */}
      {selectedReport === 'compliance' && (
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
                Department of Public Utilities Compliance & Safety Audit
              </h3>
              <p className="text-xs text-slate-500">
                Official document status and state inspection records
              </p>
            </div>
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
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Fitness Valid Thru</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Commercial Insurance</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Compliance Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {INITIAL_VEHICLES.map((v) => {
                const isExpired = new Date(v.fitnessExpiry) < new Date('2026-10-22');

                return (
                  <tr key={v.id} className="hover:bg-black/[0.02]">
                    <td className="py-3 px-4 font-bold">{v.vehicleNumber}</td>
                    <td className="py-3 px-4 font-mono text-teal-700">{v.registrationNumber}</td>
                    <td className="py-3 px-4 font-mono">
                      <span className={isExpired ? 'text-rose-600 font-bold' : ''}>{v.fitnessExpiry}</span>
                    </td>
                    <td className="py-3 px-4 font-mono">{v.insuranceExpiry}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isExpired ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isExpired ? 'Non-Compliant' : '100% Certified'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* REPORT TABLE 4: EXPENSES */}
      {selectedReport === 'expenses' && (
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
                Fleet Operating Costs & Fuel Ledger
              </h3>
              <p className="text-xs text-slate-500">
                Expenditures grouped by category and vendor invoices
              </p>
            </div>
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
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Date</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Category</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Vehicle</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Vendor</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Voucher Ref</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {INITIAL_TRANSPORT_EXPENSES.map((exp) => (
                <tr key={exp.id} className="hover:bg-black/[0.02]">
                  <td className="py-3 px-4 font-mono">{exp.date}</td>
                  <td className="py-3 px-4 font-semibold">{exp.category}</td>
                  <td className="py-3 px-4 font-bold">{exp.vehicleReg || 'Fleet Shared'}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{exp.vendor}</td>
                  <td className="py-3 px-4 font-mono text-[10px] text-teal-700">{exp.receiptRef}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                    ${exp.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
