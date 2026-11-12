import React, { useState, useMemo } from 'react';
import {
  INITIAL_VISITORS,
  INITIAL_VISITS,
  INITIAL_FRONT_OFFICE_ENQUIRIES,
  INITIAL_APPOINTMENTS,
  INITIAL_CALL_LOGS,
  INITIAL_RECEPTION_REQUESTS,
  INITIAL_DOCUMENT_REQUESTS,
} from '../../data/initialReceptionData';
import {
  Users,
  LogIn,
  LogOut,
  HelpCircle,
  CalendarDays,
  PhoneCall,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Search,
  Plus,
  FileCheck,
  Building,
} from 'lucide-react';

interface ReceptionistDashboardOverviewProps {
  onNavigateTab: (tabId: string) => void;
}

export const ReceptionistDashboardOverview: React.FC<ReceptionistDashboardOverviewProps> = ({
  onNavigateTab,
}) => {
  const [visits, setVisits] = useState(INITIAL_VISITS);
  const [appointments] = useState(INITIAL_APPOINTMENTS);
  const [enquiries] = useState(INITIAL_FRONT_OFFICE_ENQUIRIES);
  const [calls] = useState(INITIAL_CALL_LOGS);
  const [requests] = useState(INITIAL_RECEPTION_REQUESTS);
  const [documents] = useState(INITIAL_DOCUMENT_REQUESTS);

  const [checkoutFeedback, setCheckoutFeedback] = useState<string | null>(null);

  // Today's date reference
  const today = '2026-10-22';

  // Derived metrics
  const activeVisitors = useMemo(() => {
    return visits.filter((v) => v.status === 'Checked In');
  }, [visits]);

  const todayVisits = useMemo(() => {
    return visits.filter((v) => v.date === today);
  }, [visits, today]);

  const expectedVisitors = useMemo(() => {
    return visits.filter((v) => v.date === today && v.status === 'Expected');
  }, [visits, today]);

  const todayAppointments = useMemo(() => {
    return appointments.filter((a) => a.date === today);
  }, [appointments, today]);

  const followUpsDue = useMemo(() => {
    return enquiries.filter(
      (e) => e.status === 'Follow-up Required' || (e.followUpDate && e.followUpDate <= today)
    );
  }, [enquiries, today]);

  const unresolvedRequests = useMemo(() => {
    return requests.filter((r) => r.status !== 'Resolved' && r.status !== 'Closed');
  }, [requests]);

  const handleQuickCheckout = (visitId: string, visitorName: string) => {
    setVisits((prev) =>
      prev.map((v) =>
        v.id === visitId
          ? {
              ...v,
              status: 'Checked Out',
              checkOutTime: new Date().toISOString(),
              checkoutNotes: 'Quick checkout completed at reception dashboard.',
            }
          : v
      )
    );
    setCheckoutFeedback(`Checked out ${visitorName} successfully.`);
    setTimeout(() => setCheckoutFeedback(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div
        className="p-6 rounded-2xl border text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary, #164E55) 0%, var(--color-secondary, #287B7A) 100%)',
          borderColor: 'transparent',
        }}
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-white/80 mb-1">
            <Building className="w-4 h-4 text-emerald-300" />
            <span>Front Office & Campus Reception Desk</span>
            <span>·</span>
            <span className="text-emerald-300 font-bold">Main Gate Security Terminal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Receptionist Command Center
          </h1>
          <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-2xl">
            Welcome, Campus Front Desk Officer. Real-time visitor gate control, parent consultation schedules, prospective student inquiries, and dispatch communications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('visitor-register')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-sm transition-all flex items-center gap-2"
          >
            <LogIn className="w-4 h-4 text-emerald-700" />
            <span>Check In Visitor</span>
          </button>
          <button
            onClick={() => onNavigateTab('admissions-enquiries')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/20 hover:bg-white/30 text-white transition-all flex items-center gap-2 border border-white/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Enquiry</span>
          </button>
          <button
            onClick={() => onNavigateTab('appointments')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/20 hover:bg-white/30 text-white transition-all flex items-center gap-2 border border-white/20"
          >
            <CalendarDays className="w-4 h-4" />
            <span>Schedule Appt</span>
          </button>
        </div>
      </div>

      {checkoutFeedback && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{checkoutFeedback}</span>
          </div>
          <button onClick={() => setCheckoutFeedback(null)} className="text-xs text-emerald-700 underline">
            Dismiss
          </button>
        </div>
      )}

      {/* METRIC TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          onClick={() => onNavigateTab('visitor-register')}
          className="p-4 rounded-xl border bg-white dark:bg-slate-900 cursor-pointer hover:shadow-md transition-all group"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>On Campus Now</span>
            <LogIn className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {activeVisitors.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Checked in & active
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('visitor-register')}
          className="p-4 rounded-xl border bg-white dark:bg-slate-900 cursor-pointer hover:shadow-md transition-all group"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Visitors Today</span>
            <Users className="w-4 h-4 text-cyan-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {todayVisits.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {todayVisits.filter((v) => v.status === 'Checked Out').length} departed
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('appointments')}
          className="p-4 rounded-xl border bg-white dark:bg-slate-900 cursor-pointer hover:shadow-md transition-all group"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Appointments</span>
            <CalendarDays className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {todayAppointments.length}
          </div>
          <div className="text-[11px] text-indigo-600 font-medium mt-1">
            {todayAppointments.filter((a) => a.status === 'In Meeting').length} currently in meeting
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('admissions-enquiries')}
          className="p-4 rounded-xl border bg-white dark:bg-slate-900 cursor-pointer hover:shadow-md transition-all group"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Pending Leads</span>
            <HelpCircle className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {enquiries.filter((e) => e.status !== 'Converted' && e.status !== 'Closed').length}
          </div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">
            {followUpsDue.length} follow-ups due
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('parent-enquiries')}
          className="p-4 rounded-xl border bg-white dark:bg-slate-900 cursor-pointer hover:shadow-md transition-all group"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Desk Tickets</span>
            <AlertTriangle className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {unresolvedRequests.length}
          </div>
          <div className="text-[11px] text-rose-600 font-medium mt-1">
            {unresolvedRequests.filter((r) => r.priority === 'Urgent' || r.priority === 'High').length} urgent
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('document-requests')}
          className="p-4 rounded-xl border bg-white dark:bg-slate-900 cursor-pointer hover:shadow-md transition-all group"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Doc Pickups</span>
            <FileCheck className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {documents.filter((d) => d.status === 'Ready for Collection').length}
          </div>
          <div className="text-[11px] text-teal-600 font-medium mt-1">
            Ready on shelf drawer
          </div>
        </div>
      </div>

      {/* QUICK WORKFLOW BAR */}
      <div
        className="p-3.5 rounded-xl border bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-slate-400" />
          Fast Front Desk Actions:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('visitor-register')}
            className="px-2.5 py-1.5 rounded-lg border hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-1.5"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <LogIn className="w-3.5 h-3.5 text-emerald-600" />
            Check-In Visitor
          </button>
          <button
            onClick={() => onNavigateTab('admissions-enquiries')}
            className="px-2.5 py-1.5 rounded-lg border hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-1.5"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            Admissions Enquiry
          </button>
          <button
            onClick={() => onNavigateTab('appointments')}
            className="px-2.5 py-1.5 rounded-lg border hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-1.5"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <CalendarDays className="w-3.5 h-3.5 text-indigo-600" />
            New Appointment
          </button>
          <button
            onClick={() => onNavigateTab('communications')}
            className="px-2.5 py-1.5 rounded-lg border hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-1.5"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
            Log Phone Call
          </button>
          <button
            onClick={() => onNavigateTab('reception-student-lookup')}
            className="px-2.5 py-1.5 rounded-lg border hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-1.5"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <Search className="w-3.5 h-3.5 text-teal-600" />
            Student / Parent Lookup
          </button>
          <button
            onClick={() => onNavigateTab('front-office-records')}
            className="px-2.5 py-1.5 rounded-lg border hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-1.5"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <Shield className="w-3.5 h-3.5 text-slate-600" />
            Daily Gate Register
          </button>
        </div>
      </div>

      {/* TWO COLUMN GRID: ACTIVE VISITORS & TODAY'S APPOINTMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: ACTIVE VISITORS ON CAMPUS */}
        <div
          className="lg:col-span-7 p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Visitors Currently on Campus ({activeVisitors.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time security gate badges assigned and verified. One-click check-out upon exit.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('visitor-register')}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                Full Desk <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {activeVisitors.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No active visitors currently checked in on campus.
              </div>
            ) : (
              <div className="space-y-3">
                {activeVisitors.map((visit) => (
                  <div
                    key={visit.id}
                    className="p-3.5 rounded-xl border bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-200">
                        {visit.badgeNumber.replace('PASS-', '#')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {visit.visitorName}
                          </span>
                          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {visit.visitorCategory}
                          </span>
                          {visit.groupSize > 1 && (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-800">
                              Party of {visit.groupSize}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          <strong>Host:</strong> {visit.hostStaffName} ({visit.department}) · <strong>Purpose:</strong> {visit.purpose}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-3">
                          <span>Checked in at {new Date(visit.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {visit.vehicleNumber && <span>Vehicle: {visit.vehicleNumber}</span>}
                          <span>Badge: {visit.badgeNumber}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleQuickCheckout(visit.id, visit.visitorName)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1.5"
                        title="Record Visitor Departure"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Check Out</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs text-slate-500" style={{ borderColor: 'var(--color-border)' }}>
            <span>
              Expected arrivals later today: <strong>{expectedVisitors.length} scheduled</strong>
            </span>
            <button
              onClick={() => onNavigateTab('visitor-directory')}
              className="text-teal-700 hover:underline font-semibold"
            >
              Browse Visitor Master Directory
            </button>
          </div>
        </div>

        {/* RIGHT: TODAY'S APPOINTMENTS SCHEDULE */}
        <div
          className="lg:col-span-5 p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-indigo-600" />
                  Today's Appointments ({todayAppointments.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Executive schedules: Principal, VP & Faculty rooms
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('appointments')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                Schedule <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {todayAppointments.map((apt) => {
                const isMeeting = apt.status === 'In Meeting';
                const isConfirmed = apt.status === 'Confirmed';
                const isScheduled = apt.status === 'Scheduled';

                return (
                  <div
                    key={apt.id}
                    className={`p-3 rounded-xl border transition-all text-xs ${
                      isMeeting
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-[11px] text-slate-700 dark:text-slate-300">
                        {apt.startTime} - {apt.endTime}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isMeeting
                            ? 'bg-emerald-600 text-white animate-pulse'
                            : isConfirmed
                            ? 'bg-indigo-100 text-indigo-800'
                            : isScheduled
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>

                    <div className="font-bold text-slate-900 dark:text-white">
                      {apt.title}
                    </div>

                    <div className="text-slate-600 dark:text-slate-400 mt-0.5">
                      Visitor: <strong>{apt.visitorName}</strong> · Host: <strong>{apt.hostStaffName}</strong>
                    </div>

                    <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                      <span>Venue: {apt.location}</span>
                      {apt.linkedVisitId && (
                        <span className="text-emerald-600 font-semibold">Pass Active</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t text-xs text-slate-500 text-center" style={{ borderColor: 'var(--color-border)' }}>
            <button
              onClick={() => onNavigateTab('appointments')}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Open Full Day Schedule & Conflict Checker
            </button>
          </div>
        </div>
      </div>

      {/* LOWER SECTION: CALL LOG & FRONT DESK TICKETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* RECENT CALL LOG */}
        <div
          className="p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-xs"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center justify-between pb-3 border-b mb-3" style={{ borderColor: 'var(--color-border)' }}>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-blue-600" />
                Recent Phone Inquiries & Dispatches
              </h3>
              <p className="text-[11px] text-slate-500">
                Incoming parent calls and school department transfers
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('communications')}
              className="text-xs text-blue-700 font-bold hover:underline"
            >
              View Log
            </button>
          </div>

          <div className="space-y-2">
            {calls.slice(0, 3).map((call) => (
              <div
                key={call.id}
                className="p-2.5 rounded-lg border bg-slate-50/50 dark:bg-slate-800/30 text-xs"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {call.callerName} ({call.direction})
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(call.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] line-clamp-1">
                  {call.summary}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                  <span>Category: {call.category}</span>
                  <span className={call.status === 'Resolved' ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>
                    {call.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FRONT DESK TICKETS & NOTICES */}
        <div
          className="p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-xs"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center justify-between pb-3 border-b mb-3" style={{ borderColor: 'var(--color-border)' }}>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Front Desk Requests & Lost & Found
              </h3>
              <p className="text-[11px] text-slate-500">
                Action tickets pending department or facility resolution
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('parent-enquiries')}
              className="text-xs text-rose-700 font-bold hover:underline"
            >
              All Requests
            </button>
          </div>

          <div className="space-y-2">
            {requests.slice(0, 3).map((req) => (
              <div
                key={req.id}
                className="p-2.5 rounded-lg border bg-slate-50/50 dark:bg-slate-800/30 text-xs"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-bold text-slate-500">
                      {req.requestNo}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {req.summary}
                    </span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    req.priority === 'Urgent'
                      ? 'bg-rose-100 text-rose-800'
                      : req.priority === 'High'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {req.priority}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Requester: {req.requesterName} ({req.requesterType}) · Assigned to: {req.assignedDepartment}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span>Category: {req.category}</span>
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    Status: {req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
