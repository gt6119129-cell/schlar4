import React, { useState, useMemo } from 'react';
import {
  INITIAL_VISITS,
  INITIAL_FRONT_OFFICE_ENQUIRIES,
  INITIAL_APPOINTMENTS,
  INITIAL_CALL_LOGS,
  INITIAL_COURIERS,
} from '../../data/initialReceptionData';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Filter,
  Users,
  Building,
  CheckCircle2,
  Clock,
  PieChart,
  BarChart,
  Shield,
  HelpCircle,
  PhoneCall,
  Package,
} from 'lucide-react';

export const ReceptionistReportsModule: React.FC = () => {
  const [reportType, setReportType] = useState<'daily-register' | 'category-breakdown' | 'enquiries-source' | 'appointments-audit'>('daily-register');
  const [selectedDate, setSelectedDate] = useState('2026-10-22');

  const todayVisits = useMemo(() => {
    return INITIAL_VISITS.filter((v) => v.date === selectedDate);
  }, [selectedDate]);

  // Derived metrics
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    INITIAL_VISITS.forEach((v) => {
      counts[v.visitorCategory] = (counts[v.visitorCategory] || 0) + 1;
    });
    return counts;
  }, []);

  const enquirySourceStats = useMemo(() => {
    const counts: Record<string, number> = {};
    INITIAL_FRONT_OFFICE_ENQUIRIES.forEach((e) => {
      counts[e.source] = (counts[e.source] || 0) + 1;
    });
    return counts;
  }, []);

  const appointmentStatusStats = useMemo(() => {
    const counts: Record<string, number> = {};
    INITIAL_APPOINTMENTS.forEach((a) => {
      counts[a.status] = (counts[a.status] || 0) + 1;
    });
    return counts;
  }, []);

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (reportType === 'daily-register') {
      csvContent += 'Date,Badge,Visitor Name,Category,Organization,Host Staff,Department,Purpose,Check In,Check Out,Status\n';
      todayVisits.forEach((v) => {
        csvContent += `"${v.date}","${v.badgeNumber}","${v.visitorName}","${v.visitorCategory}","${v.organization || ''}","${v.hostStaffName}","${v.department}","${v.purpose}","${v.checkInTime}","${v.checkOutTime || ''}","${v.status}"\n`;
      });
    } else if (reportType === 'enquiries-source') {
      csvContent += 'Enquiry No,Parent,Child,Class,Source,Assigned Staff,Status,Date\n';
      INITIAL_FRONT_OFFICE_ENQUIRIES.forEach((e) => {
        csvContent += `"${e.enquiryNo}","${e.parentName}","${e.studentName || ''}","${e.interestedClassName}","${e.source}","${e.assignedStaffName}","${e.status}","${e.enquiryDate}"\n`;
      });
    } else {
      csvContent += 'Appointment ID,Title,Visitor,Host,Date,Start,End,Status\n';
      INITIAL_APPOINTMENTS.forEach((a) => {
        csvContent += `"${a.id}","${a.title}","${a.visitorName}","${a.hostStaffName}","${a.date}","${a.startTime}","${a.endTime}","${a.status}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `schlar_${reportType}_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-teal-700 dark:text-teal-400 mb-1">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Front Office Operational Registers & Security Audits</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Daily Register & Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Audit logs for campus gate access, inquiry conversions, appointment fulfillment, and dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl text-xs font-bold border hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-2"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-sm transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* REPORT TYPE SELECTOR & DATE BAR */}
      <div
        className="p-4 rounded-xl border bg-white dark:bg-slate-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setReportType('daily-register')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              reportType === 'daily-register'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Daily Gate Register
          </button>
          <button
            onClick={() => setReportType('category-breakdown')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              reportType === 'category-breakdown'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Visitor Demographics
          </button>
          <button
            onClick={() => setReportType('enquiries-source')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              reportType === 'enquiries-source'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Enquiry Channel Analysis
          </button>
          <button
            onClick={() => setReportType('appointments-audit')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              reportType === 'appointments-audit'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Appointment Performance
          </button>
        </div>

        {reportType === 'daily-register' && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Register Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-2.5 py-1 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold outline-none text-xs"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>
        )}
      </div>

      {/* REPORT CONTENT: DAILY REGISTER */}
      {reportType === 'daily-register' && (
        <div
          className="rounded-2xl border bg-white dark:bg-slate-900 shadow-xs overflow-hidden"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Official Campus Gate Pass Entry & Exit Register
              </h2>
              <div className="text-xs text-slate-500 mt-0.5">
                Date: <strong>{selectedDate}</strong> · Total check-ins logged: <strong>{todayVisits.length}</strong>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
              Verified by Campus Security
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b" style={{ borderColor: 'var(--color-border)' }}>
                <tr>
                  <th className="px-4 py-3">Pass #</th>
                  <th className="px-4 py-3">Visitor Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Host Staff & Room</th>
                  <th className="px-4 py-3">Purpose</th>
                  <th className="px-4 py-3">Check-In</th>
                  <th className="px-4 py-3">Check-Out</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {todayVisits.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-mono font-bold text-teal-800 dark:text-teal-300">
                      {v.badgeNumber}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                      {v.visitorName}
                      {v.organization && (
                        <div className="text-[10px] font-normal text-slate-400">
                          {v.organization}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {v.visitorCategory}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {v.hostStaffName}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {v.department}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-[200px] text-slate-600 dark:text-slate-300 truncate">
                      {v.purpose}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500 whitespace-nowrap">
                      {new Date(v.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500 whitespace-nowrap">
                      {v.checkOutTime
                        ? new Date(v.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        v.status === 'Checked In'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT CONTENT: CATEGORY BREAKDOWN */}
      {reportType === 'category-breakdown' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-xs"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-4">
              Visitor Category Distribution (All Time)
            </h3>
            <div className="space-y-3">
              {Object.entries(categoryStats).map(([cat, count]) => {
                const pct = Math.round((count / INITIAL_VISITS.length) * 100);
                return (
                  <div key={cat} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {cat}
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-teal-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className="p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-xs space-y-3 text-xs"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Campus Security Audit Highlights
            </h3>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2 text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between">
                <span>Total Historical Visits Logged:</span>
                <strong className="text-slate-900 dark:text-white font-mono">{INITIAL_VISITS.length}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Unique Registered Visitors:</span>
                <strong className="text-slate-900 dark:text-white font-mono">7 Profiles</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Recurring Parents Proportion:</span>
                <strong className="text-slate-900 dark:text-white font-mono">42.8%</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Pass Surrender / Checkout Rate:</span>
                <strong className="text-emerald-700 font-bold font-mono">100% on departure</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORT CONTENT: ENQUIRIES SOURCE */}
      {reportType === 'enquiries-source' && (
        <div
          className="p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-xs"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-4">
            Admissions Leads Acquisition Channels
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {Object.entries(enquirySourceStats).map(([src, count]) => (
              <div
                key={src}
                className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-800/40 text-center"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="text-xs font-semibold text-slate-500 mb-1">{src}</div>
                <div className="text-2xl font-black text-teal-800 dark:text-teal-300">{count}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Leads recorded</div>
              </div>
            ))}
          </div>

          <div className="text-xs text-slate-500">
            Intake leads converted to formal admissions dossiers: <strong>1 lead (Hannah Zhang - Grade 9)</strong>.
          </div>
        </div>
      )}

      {/* REPORT CONTENT: APPOINTMENTS AUDIT */}
      {reportType === 'appointments-audit' && (
        <div
          className="p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-xs space-y-4"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Appointment Fulfillment & Punctuality Ledger
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {Object.entries(appointmentStatusStats).map(([status, count]) => (
              <div
                key={status}
                className="p-3.5 rounded-xl border bg-slate-50 dark:bg-slate-800/40"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="text-[11px] text-slate-500">{status}</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">{count}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
