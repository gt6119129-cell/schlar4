import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Search,
  Calendar,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Bus,
  Users,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { TransportBoardingRecord, BoardingStatus } from '../../types/transport';
import {
  INITIAL_BOARDING_RECORDS,
  INITIAL_ROUTES,
  INITIAL_STUDENT_TRANSPORT_ASSIGNMENTS,
} from '../../data/initialTransportData';

export const TransportAttendanceModule: React.FC = () => {
  const [selectedRouteId, setSelectedRouteId] = useState(INITIAL_ROUTES[0]?.id || '');
  const [selectedService, setSelectedService] = useState<'morning' | 'afternoon'>('morning');
  const [selectedDate, setSelectedDate] = useState('2026-10-22');
  const [searchQuery, setSearchQuery] = useState('');

  // Roster state
  const [records, setRecords] = useState<TransportBoardingRecord[]>(INITIAL_BOARDING_RECORDS);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentRoute = useMemo(() => {
    return INITIAL_ROUTES.find((r) => r.id === selectedRouteId) || INITIAL_ROUTES[0];
  }, [selectedRouteId]);

  // Students assigned to this route
  const assignedCommuters = useMemo(() => {
    return INITIAL_STUDENT_TRANSPORT_ASSIGNMENTS.filter(
      (a) => a.routeId === selectedRouteId && a.status === 'active'
    );
  }, [selectedRouteId]);

  // Merge with existing boarding records or default to 'unmarked'
  const roster = useMemo(() => {
    return assignedCommuters.map((student) => {
      const existing = records.find(
        (r) =>
          r.studentId === student.studentId &&
          r.routeId === selectedRouteId &&
          r.serviceType === selectedService &&
          r.date === selectedDate
      );

      if (existing) {
        return existing;
      }

      // Default to UNMARKED (Distinguished from absent!)
      const unmarkedRecord: TransportBoardingRecord = {
        id: `brd-${student.studentId}-${selectedService}`,
        date: selectedDate,
        routeId: selectedRouteId,
        routeName: currentRoute.name,
        serviceType: selectedService,
        studentId: student.studentId,
        studentName: student.studentName,
        className: `${student.className}-${student.sectionName}`,
        stopName: student.pickupStopName,
        status: 'unmarked',
      };
      return unmarkedRecord;
    });
  }, [assignedCommuters, records, selectedRouteId, selectedService, selectedDate, currentRoute]);

  const filteredRoster = useMemo(() => {
    return roster.filter((r) => {
      if (!searchQuery) return true;
      return (
        r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.stopName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [roster, searchQuery]);

  // Metrics
  const metrics = useMemo(() => {
    const total = roster.length;
    const boarded = roster.filter((r) => r.status === 'boarded').length;
    const absent = roster.filter((r) => r.status === 'absent').length;
    const unmarked = roster.filter((r) => r.status === 'unmarked').length;
    return { total, boarded, absent, unmarked };
  }, [roster]);

  const handleSetStatus = (studentId: string, status: BoardingStatus) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const existingIndex = records.findIndex(
      (r) =>
        r.studentId === studentId &&
        r.routeId === selectedRouteId &&
        r.serviceType === selectedService &&
        r.date === selectedDate
    );

    if (existingIndex >= 0) {
      const updated = [...records];
      updated[existingIndex] = {
        ...updated[existingIndex],
        status,
        markedAt: nowTime,
        markedBy: 'Transport Conductor',
      };
      setRecords(updated);
    } else {
      const student = assignedCommuters.find((s) => s.studentId === studentId);
      if (!student) return;
      const newRec: TransportBoardingRecord = {
        id: `brd-${studentId}-${Date.now()}`,
        date: selectedDate,
        routeId: selectedRouteId,
        routeName: currentRoute.name,
        serviceType: selectedService,
        studentId,
        studentName: student.studentName,
        className: `${student.className}-${student.sectionName}`,
        stopName: student.pickupStopName,
        status,
        markedAt: nowTime,
        markedBy: 'Transport Conductor',
      };
      setRecords([...records, newRec]);
    }
  };

  const handleMarkAllBoarded = () => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updated = [...records];

    assignedCommuters.forEach((student) => {
      const idx = updated.findIndex(
        (r) =>
          r.studentId === student.studentId &&
          r.routeId === selectedRouteId &&
          r.serviceType === selectedService &&
          r.date === selectedDate
      );
      if (idx >= 0) {
        updated[idx] = { ...updated[idx], status: 'boarded', markedAt: nowTime };
      } else {
        updated.push({
          id: `brd-${student.studentId}-${Date.now()}`,
          date: selectedDate,
          routeId: selectedRouteId,
          routeName: currentRoute.name,
          serviceType: selectedService,
          studentId: student.studentId,
          studentName: student.studentName,
          className: `${student.className}-${student.sectionName}`,
          stopName: student.pickupStopName,
          status: 'boarded',
          markedAt: nowTime,
          markedBy: 'Transport Conductor',
        });
      }
    });

    setRecords(updated);
    setFeedback(`Marked all ${assignedCommuters.length} commuters on ${currentRoute.routeNumber} as boarded.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Bus Boarding & Transport Attendance
          </h2>
          <p className="text-xs text-slate-500">
            Route-wise student manifest roll calls for morning pickup and afternoon return drops.
          </p>
        </div>

        <button
          onClick={handleMarkAllBoarded}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-90 self-start sm:self-auto"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Mark All Boarded</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl border bg-emerald-50 text-emerald-800 border-emerald-200 text-xs font-medium animate-in fade-in">
          {feedback}
        </div>
      )}

      {/* SERVICE & ROUTE SELECTOR CONTROLS */}
      <div
        className="p-4 rounded-xl border grid grid-cols-1 sm:grid-cols-3 gap-3 shadow-xs"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div>
          <label className="font-semibold block mb-1 text-xs">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg border outline-none text-xs font-mono"
            style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
          />
        </div>

        <div>
          <label className="font-semibold block mb-1 text-xs">Transit Corridor</label>
          <select
            value={selectedRouteId}
            onChange={(e) => setSelectedRouteId(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg border outline-none text-xs"
            style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
          >
            {INITIAL_ROUTES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.routeNumber} ({r.assignedVehicleNumber})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold block mb-1 text-xs">Service Run</label>
          <div className="grid grid-cols-2 gap-1 p-0.5 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
            <button
              onClick={() => setSelectedService('morning')}
              className={`py-1 text-xs font-semibold rounded capitalize transition-colors ${
                selectedService === 'morning' ? 'bg-teal-700 text-white font-bold' : 'hover:bg-black/5'
              }`}
            >
              Morning Inbound
            </button>
            <button
              onClick={() => setSelectedService('afternoon')}
              className={`py-1 text-xs font-semibold rounded capitalize transition-colors ${
                selectedService === 'afternoon' ? 'bg-teal-700 text-white font-bold' : 'hover:bg-black/5'
              }`}
            >
              Afternoon Outbound
            </button>
          </div>
        </div>
      </div>

      {/* METRIC COUNTERS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border bg-black/[0.02] text-center" style={{ borderColor: 'var(--color-border)' }}>
          <span className="text-[11px] text-slate-400 block font-medium">Assigned Commuters</span>
          <span className="text-xl font-bold font-mono">{metrics.total}</span>
        </div>
        <div className="p-3.5 rounded-xl border bg-emerald-50/50 border-emerald-200 text-center">
          <span className="text-[11px] text-emerald-700 block font-bold">Boarded</span>
          <span className="text-xl font-bold font-mono text-emerald-800">{metrics.boarded}</span>
        </div>
        <div className="p-3.5 rounded-xl border bg-rose-50/50 border-rose-200 text-center">
          <span className="text-[11px] text-rose-700 block font-bold">Absent / Not Boarded</span>
          <span className="text-xl font-bold font-mono text-rose-800">{metrics.absent}</span>
        </div>
        <div className="p-3.5 rounded-xl border bg-slate-100 dark:bg-slate-800 text-center" style={{ borderColor: 'var(--color-border)' }}>
          <span className="text-[11px] text-slate-500 block font-medium">Unmarked</span>
          <span className="text-xl font-bold font-mono text-slate-700 dark:text-slate-300">{metrics.unmarked}</span>
        </div>
      </div>

      {/* BOARDING ROSTER TABLE */}
      <div
        className="rounded-xl border shadow-xs overflow-hidden"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ borderColor: 'var(--color-border)' }}>
          <div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
              Passenger Boarding Manifest: {currentRoute.routeNumber} ({currentRoute.assignedVehicleNumber})
            </h3>
            <p className="text-xs text-slate-500">
              Driver: {currentRoute.assignedDriverName} · Attendant: {currentRoute.assignedAttendantName || 'None'}
            </p>
          </div>

          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs"
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: 'var(--color-border)',
            }}
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter passengers..."
              className="bg-transparent border-none outline-none text-xs w-36"
              style={{ color: 'var(--color-text)' }}
            />
          </div>
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
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Passenger Student</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Class</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Designated Stop</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase">Recorded At</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Check-in Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {filteredRoster.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No students currently assigned to this transit route corridor.
                  </td>
                </tr>
              ) : (
                filteredRoster.map((item) => (
                  <tr key={item.studentId} className="hover:bg-black/[0.02]">
                    <td className="py-3 px-4 font-bold" style={{ color: 'var(--color-text)' }}>
                      {item.studentName}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{item.className}</td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      {item.stopName}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {item.markedAt || 'Pending roll call'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                          item.status === 'boarded'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'absent'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleSetStatus(item.studentId, 'boarded')}
                          className={`px-3 py-1 rounded text-[11px] font-bold ${
                            item.status === 'boarded'
                              ? 'bg-emerald-700 text-white'
                              : 'border border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          Boarded
                        </button>
                        <button
                          onClick={() => handleSetStatus(item.studentId, 'absent')}
                          className={`px-3 py-1 rounded text-[11px] font-bold ${
                            item.status === 'absent'
                              ? 'bg-rose-700 text-white'
                              : 'border border-rose-300 text-rose-700 hover:bg-rose-50'
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
