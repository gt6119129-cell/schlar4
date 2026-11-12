import React, { useMemo } from 'react';
import {
  Bus,
  MapPin,
  Users,
  Wrench,
  AlertTriangle,
  Clock,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Fuel,
} from 'lucide-react';
import {
  INITIAL_VEHICLES,
  INITIAL_DRIVERS,
  INITIAL_ROUTES,
  INITIAL_STUDENT_TRANSPORT_ASSIGNMENTS,
  INITIAL_BOARDING_RECORDS,
  INITIAL_TRANSPORT_INCIDENTS,
} from '../../data/initialTransportData';

interface TransportDashboardOverviewProps {
  onNavigateTab: (tabId: string) => void;
}

export const TransportDashboardOverview: React.FC<TransportDashboardOverviewProps> = ({
  onNavigateTab,
}) => {
  // Live statistics calculated from actual demo records
  const stats = useMemo(() => {
    const totalVehicles = INITIAL_VEHICLES.length;
    const activeVehicles = INITIAL_VEHICLES.filter((v) => v.operationalStatus === 'active').length;
    const maintenanceVehicles = INITIAL_VEHICLES.filter((v) => v.operationalStatus === 'maintenance').length;
    const totalRoutes = INITIAL_ROUTES.length;
    const totalDrivers = INITIAL_DRIVERS.filter((d) => d.dutyType === 'driver' && d.status === 'active').length;
    const totalAssignedStudents = INITIAL_STUDENT_TRANSPORT_ASSIGNMENTS.filter((a) => a.status === 'active').length;

    // Overall capacity utilization
    const totalActiveCapacity = INITIAL_ROUTES.reduce((acc, r) => acc + r.vehicleCapacity, 0);
    const totalPassengers = INITIAL_ROUTES.reduce((acc, r) => acc + r.assignedStudentCount, 0);
    const utilizationPercent = totalActiveCapacity > 0 ? ((totalPassengers / totalActiveCapacity) * 100).toFixed(1) : '0';

    return {
      totalVehicles,
      activeVehicles,
      maintenanceVehicles,
      totalRoutes,
      totalDrivers,
      totalAssignedStudents,
      totalActiveCapacity,
      totalPassengers,
      utilizationPercent,
    };
  }, []);

  // Document expiry & maintenance alerts
  const alerts = useMemo(() => {
    const list: { id: string; title: string; subtitle: string; severity: 'warning' | 'alert' }[] = [];

    // Bus #08 expired fitness
    list.push({
      id: 'alt-bus-08',
      title: 'Bus #08: Fitness Certificate Expired',
      subtitle: 'State road transport safety certification expired Oct 18, 2026. Vehicle currently held in maintenance.',
      severity: 'alert',
    });

    // Bus #04 insurance expiring soon
    list.push({
      id: 'alt-bus-04',
      title: 'Bus #04: Commercial Insurance Expiring Soon',
      subtitle: 'Policy renews Nov 20, 2026 (under 30 days remaining). Renewal quotation ready.',
      severity: 'warning',
    });

    // Driver Patrick Davis licence expiring
    list.push({
      id: 'alt-drv-davis',
      title: 'Driver Mr. Patrick Davis: Licence Renewal Due',
      subtitle: 'Commercial CDL Class B valid until Nov 28, 2026. Scheduled for eye examination.',
      severity: 'warning',
    });

    return list;
  }, []);

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div
        className="rounded-2xl p-6 sm:p-8 border shadow-sm relative overflow-hidden transition-colors"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border"
              style={{
                backgroundColor: 'var(--color-subtle-accent, rgba(0,0,0,0.04))',
                borderColor: 'var(--color-border)',
                color: 'var(--color-primary)',
              }}
            >
              <Bus className="w-3.5 h-3.5" />
              <span>Logistics & Fleet Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
              Transit Fleet Dispatch Hub
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Real-time route corridors, ordered stop schedules, vehicle safety compliance, passenger capacity controls, driver licensing, and fuel ledger management.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('transport-assignments')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-90 active:scale-95"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Users className="w-4 h-4" />
              <span>Assign Student</span>
            </button>
            <button
              onClick={() => onNavigateTab('routes')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold rounded-xl border hover:bg-black/5 active:scale-95"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
                backgroundColor: 'var(--color-surface)',
              }}
            >
              <MapPin className="w-4 h-4 text-teal-700" />
              <span>Routes</span>
            </button>
            <button
              onClick={() => onNavigateTab('transport-boarding')}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold rounded-xl border hover:opacity-85"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
                backgroundColor: 'var(--color-surface)',
              }}
            >
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Boarding Register</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Fleet in Service */}
        <div
          onClick={() => onNavigateTab('vehicles')}
          className="p-5 rounded-xl border shadow-xs transition-all hover:shadow-md cursor-pointer group flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Fleet Operations</span>
            <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
              <Bus className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black font-mono tracking-tight" style={{ color: 'var(--color-text)' }}>
              {stats.activeVehicles} / {stats.totalVehicles} <span className="text-xs font-normal text-slate-400">buses active</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {stats.maintenanceVehicles} vehicle in depot maintenance
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-teal-700 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <span>Manage fleet & road permits</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 2: Transit Corridors */}
        <div
          onClick={() => onNavigateTab('routes')}
          className="p-5 rounded-xl border shadow-xs transition-all hover:shadow-md cursor-pointer group flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Configured Routes</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black font-mono tracking-tight" style={{ color: 'var(--color-text)' }}>
              {stats.totalRoutes} <span className="text-xs font-normal text-slate-400">corridors</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Morning and afternoon scheduled service
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <span>Ordered stops & timing matrices</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 3: Capacity Utilization */}
        <div
          onClick={() => onNavigateTab('routes')}
          className="p-5 rounded-xl border shadow-xs transition-all hover:shadow-md cursor-pointer group flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Passenger Load</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black font-mono tracking-tight text-emerald-700">
              {stats.utilizationPercent}% <span className="text-xs font-normal text-slate-400">capacity</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {stats.totalPassengers} / {stats.totalActiveCapacity} seats allocated
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <span>Zero over-capacity violations</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 4: Operating Health */}
        <div
          onClick={() => onNavigateTab('vehicle-maintenance')}
          className="p-5 rounded-xl border shadow-xs transition-all hover:shadow-md cursor-pointer group flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Compliance & Alerts</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black font-mono tracking-tight text-amber-600">
              {alerts.length} <span className="text-xs font-normal text-slate-400">action items</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Expiring permits & maintenance due
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <span>Inspect compliance alerts</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* TWO COLUMNS: ALERTS & ACTIVE ROUTES ROSTER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1/3): Compliance & Expiry Alerts */}
        <div
          className="rounded-xl border p-5 shadow-xs flex flex-col justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b mb-3" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                  Document Compliance & Safety
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                {alerts.length} Warnings
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Automated triggers monitoring commercial insurance, fitness certifications, and driver licences.
            </p>

            <div className="space-y-2.5">
              {alerts.map((alt) => (
                <div
                  key={alt.id}
                  className={`p-3 rounded-lg border text-xs space-y-1 ${
                    alt.severity === 'alert'
                      ? 'bg-rose-50/50 border-rose-200 text-rose-950 dark:bg-rose-950/20 dark:text-rose-200'
                      : 'bg-amber-50/50 border-amber-200 text-amber-950 dark:bg-amber-950/20 dark:text-amber-200'
                  }`}
                >
                  <span className="font-bold block">{alt.title}</span>
                  <p className="text-[11px] opacity-80 leading-relaxed">{alt.subtitle}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('vehicle-maintenance')}
            className="w-full mt-4 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs font-semibold hover:bg-black/5 transition-colors"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <span>Open Maintenance & Document Vault</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Column (2/3): Route Corridors Roster */}
        <div
          className="lg:col-span-2 rounded-xl border shadow-xs overflow-hidden"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
            <div>
              <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                Active Transit Corridors & Capacity Health
              </h3>
              <p className="text-xs text-slate-500">
                Live allocation metrics against vehicle seating limits
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('routes')}
              className="text-xs font-semibold flex items-center gap-1 text-teal-700 hover:underline"
            >
              <span>View Route Directory</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

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
                  <th className="py-2.5 px-3 font-semibold text-[10px] uppercase">Route Corridor</th>
                  <th className="py-2.5 px-3 font-semibold text-[10px] uppercase">Assigned Bus</th>
                  <th className="py-2.5 px-3 font-semibold text-[10px] uppercase">Driver & Attendant</th>
                  <th className="py-2.5 px-3 font-semibold text-[10px] uppercase text-center">Timing (AM)</th>
                  <th className="py-2.5 px-3 font-semibold text-[10px] uppercase text-center">Load / Seats</th>
                  <th className="py-2.5 px-3 font-semibold text-[10px] uppercase text-right">Capacity %</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {INITIAL_ROUTES.map((route) => {
                  const utilization = ((route.assignedStudentCount / route.vehicleCapacity) * 100).toFixed(0);

                  return (
                    <tr key={route.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                      <td className="py-2.5 px-3">
                        <span className="font-bold block" style={{ color: 'var(--color-text)' }}>
                          {route.routeNumber}
                        </span>
                        <span className="text-[11px] text-slate-500 line-clamp-1">{route.name}</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-teal-700">
                        {route.assignedVehicleNumber}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold block">{route.assignedDriverName}</span>
                        {route.assignedAttendantName && (
                          <span className="text-[10px] text-slate-400">Attendant: {route.assignedAttendantName}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-[11px] text-slate-500">
                        {route.morningStartTime} – {route.morningEndTime}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono">
                        <span className="font-bold">{route.assignedStudentCount}</span>
                        <span className="text-slate-400"> / </span>
                        <span>{route.vehicleCapacity}</span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span
                          className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded ${
                            Number(utilization) >= 90
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {utilization}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
