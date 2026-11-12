import React, { useState } from 'react';
import { RoleConfig } from '../../config/roles';
import { LinkedChild, DEMO_LINKED_CHILDREN } from '../../data/mockData';
import { useSchoolData } from '../../context/SchoolDataContext';
import { SchlarLogo } from '../brand/SchlarLogo';
import {
  Home,
  CheckSquare,
  FileCheck,
  Menu,
  ChevronDown,
  Check,
  Bell,
  Award,
  CreditCard,
  CalendarDays,
  Mail,
  Settings,
  ArrowLeft,
  Maximize2,
  Minimize2,
  AlertCircle,
  FileText,
  Clock,
  Users,
  Bus,
  BookOpen,
  MapPin,
} from 'lucide-react';
import { ParentMyChildrenModule } from './ParentMyChildrenModule';
import { ParentAttendanceModule } from './ParentAttendanceModule';
import { ParentTimetableModule } from './ParentTimetableModule';
import { ParentAssignmentsModule } from './ParentAssignmentsModule';
import { ParentExamsResultsModule } from './ParentExamsResultsModule';
import { ParentFeeModule } from './ParentFeeModule';
import { ParentAnnouncementsModule } from './ParentAnnouncementsModule';
import { ParentEnquiriesModule } from './ParentEnquiriesModule';
import { ParentSettingsModule } from './ParentSettingsModule';

interface ParentMobileShellProps {
  role: RoleConfig;
  onExitWorkspace: () => void;
  onSwitchToWeb?: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
}

type MobileTab =
  | 'home'
  | 'children'
  | 'attendance'
  | 'homework'
  | 'more'
  | 'timetable'
  | 'results'
  | 'fees'
  | 'announcements'
  | 'messages'
  | 'settings';

export const ParentMobileShell: React.FC<ParentMobileShellProps> = ({
  role,
  onExitWorkspace,
  onOpenNotifications,
  unreadNotificationsCount,
}) => {
  const [activeTab, setActiveTab] = useState<MobileTab>('home');
  const [children] = useState<LinkedChild[]>(DEMO_LINKED_CHILDREN);
  const [selectedChildId, setSelectedChildId] = useState<string>(DEMO_LINKED_CHILDREN[0].id);
  const [childMenuOpen, setChildMenuOpen] = useState(false);
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  const { students, getStudentTransportSummary, getStudentLibrarySummary, getStudentFeeLedger } = useSchoolData();

  const selectedChild = children.find((c) => c.id === selectedChildId) || children[0];
  const matchedStudent = students.find(
    (s) =>
      s.id === selectedChild.id ||
      s.name.toLowerCase() === selectedChild.name.toLowerCase()
  );

  const transportSummary = matchedStudent ? getStudentTransportSummary(matchedStudent.id) : null;
  const librarySummary = matchedStudent ? getStudentLibrarySummary(matchedStudent.id) : null;
  const feeLedger = matchedStudent ? getStudentFeeLedger(matchedStudent.id) : null;

  const appContent = (
    <div
      className="flex flex-col h-full overflow-hidden transition-colors"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
      }}
    >
      {/* COMPACT APP HEADER */}
      <header
        className="px-4 py-3 border-b flex items-center justify-between gap-3 shrink-0 backdrop-blur-md"
        style={{
          backgroundColor: 'rgba(var(--color-surface), 0.95)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center gap-2">
          <SchlarLogo variant="compact" />
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
            style={{
              backgroundColor: 'var(--color-subtle-accent, rgba(0,0,0,0.06))',
              color: 'var(--color-accent)',
            }}
          >
            Parent App
          </span>
        </div>

        {/* Child Selector in Header */}
        <div className="relative">
          <button
            onClick={() => setChildMenuOpen(!childMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold shadow-xs"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] text-white"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {selectedChild.avatarInitials}
            </div>
            <span className="font-bold truncate max-w-[100px]">{selectedChild.name}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {childMenuOpen && (
            <div
              className="absolute right-0 top-full mt-1.5 w-48 rounded-xl border shadow-xl p-1 z-40 animate-in fade-in"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="p-1.5 text-[9px] uppercase font-bold text-slate-400">
                Select Child
              </div>
              {children.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => {
                    setSelectedChildId(ch.id);
                    setChildMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs ${
                    ch.id === selectedChild.id ? 'font-bold' : 'hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: ch.id === selectedChild.id ? 'var(--color-background)' : 'transparent',
                    color: 'var(--color-text)',
                  }}
                >
                  <div className="text-left truncate">
                    <div className="truncate font-semibold">{ch.name}</div>
                    <div className="text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>
                      {ch.grade}
                    </div>
                  </div>
                  {ch.id === selectedChild.id && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Icon */}
        <button
          onClick={onOpenNotifications}
          className="relative p-1.5 rounded-full border text-slate-700 dark:text-slate-200"
          style={{ borderColor: 'var(--color-border)' }}
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span
              className="absolute top-0 right-0 w-2 h-2 rounded-full"
              style={{ backgroundColor: 'var(--color-accent)' }}
            />
          )}
        </button>
      </header>

      {/* SCROLLABLE MOBILE CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Student Header Card */}
            <div
              className="p-4 rounded-xl border transition-colors shadow-sm"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base text-white shadow-xs shrink-0"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  {selectedChild.avatarInitials}
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-extrabold truncate" style={{ color: 'var(--color-text)' }}>
                    {selectedChild.name}
                  </h2>
                  <p className="text-xs truncate" style={{ color: 'var(--color-text-secondary)' }}>
                    {selectedChild.grade} ({selectedChild.section}) · Roll #{selectedChild.rollNumber}
                  </p>
                  <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--color-primary)' }}>
                    Advisor: {selectedChild.classTeacher}
                  </p>
                </div>
              </div>

              {/* 3 Metrics Strip */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t text-center" style={{ borderColor: 'var(--color-border)' }}>
                <div>
                  <span className="text-[10px] uppercase font-bold block" style={{ color: 'var(--color-text-secondary)' }}>
                    Attendance
                  </span>
                  <span className="text-sm font-extrabold font-mono tabular-nums" style={{ color: 'var(--color-text)' }}>
                    {selectedChild.attendancePercent}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold block" style={{ color: 'var(--color-text-secondary)' }}>
                    Term GPA
                  </span>
                  <span className="text-sm font-extrabold font-mono tabular-nums" style={{ color: 'var(--color-text)' }}>
                    {selectedChild.gpa.split(' ')[0]}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold block" style={{ color: 'var(--color-text-secondary)' }}>
                    Tuition
                  </span>
                  <span
                    className={`text-sm font-extrabold font-mono tabular-nums ${
                      feeLedger
                        ? feeLedger.totalBalance === 0
                          ? 'text-emerald-600'
                          : 'text-amber-600'
                        : selectedChild.outstandingBalance === 0
                        ? 'text-emerald-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {feeLedger
                      ? feeLedger.totalBalance === 0
                        ? 'Paid'
                        : `₹${feeLedger.totalBalance.toLocaleString('en-IN')}`
                      : selectedChild.outstandingBalance === 0
                      ? 'Paid'
                      : `₹${selectedChild.outstandingBalance.toLocaleString('en-IN')}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Live Campus Transport Status Card */}
            {transportSummary && transportSummary.assignment && (
              <div
                className="p-3.5 rounded-xl border transition-colors shadow-xs"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div
                  className="flex items-center justify-between pb-2 border-b mb-2.5"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}
                    >
                      <Bus className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold block leading-tight truncate" style={{ color: 'var(--color-text)' }}>
                        {transportSummary.route?.routeNumber || 'Transit Shuttle'} · {transportSummary.vehicle?.registrationNumber || transportSummary.assignment.vehicleNumber}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate">
                        Stop: {transportSummary.assignment.pickupStopName}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                    Active Pass
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium">Pickup (Morning)</span>
                    <span className="font-bold font-mono" style={{ color: 'var(--color-text)' }}>
                      {transportSummary.assignment.morningPickupTime}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium">Dropoff (Evening)</span>
                    <span className="font-bold font-mono" style={{ color: 'var(--color-text)' }}>
                      {transportSummary.assignment.afternoonDropTime}
                    </span>
                  </div>
                </div>

                {transportSummary.driver && (
                  <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Driver: <strong>{transportSummary.driver.name}</strong></span>
                    <span className="font-mono text-[10px]">{transportSummary.driver.phone}</span>
                  </div>
                )}
              </div>
            )}

            {/* Live Library Borrowing Card */}
            {librarySummary && librarySummary.activeLoans.length > 0 && (
              <div
                className="p-3.5 rounded-xl border transition-colors shadow-xs"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div
                  className="flex items-center justify-between pb-2 border-b mb-2.5"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5' }}
                    >
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block leading-tight" style={{ color: 'var(--color-text)' }}>
                        Library Loans ({librarySummary.activeLoans.length})
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {librarySummary.overdueLoans.length > 0 ? (
                          <span className="text-rose-600 font-semibold">{librarySummary.overdueLoans.length} Overdue</span>
                        ) : (
                          'Active loan records'
                        )}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                    Card Active
                  </span>
                </div>

                <div className="space-y-1.5">
                  {librarySummary.activeLoans.map((loan) => (
                    <div
                      key={loan.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="font-semibold block truncate" style={{ color: 'var(--color-text)' }}>
                          {loan.bookTitle}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Acc: {loan.accessionNumber}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded shrink-0 ${
                          loan.status === 'overdue'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        Due {loan.dueDate}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Urgent Homework Section */}
            <div
              className="p-4 rounded-xl border transition-colors shadow-sm"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="flex items-center justify-between pb-2 border-b mb-3" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>
                  Homework Due Soon
                </span>
                <button
                  onClick={() => setActiveTab('homework')}
                  className="text-[11px] font-semibold hover:underline"
                  style={{ color: 'var(--color-primary)' }}
                >
                  View All ({selectedChild.recentHomework.length})
                </button>
              </div>

              <div className="space-y-2.5">
                {selectedChild.recentHomework.slice(0, 2).map((hw) => (
                  <div
                    key={hw.id}
                    className="p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                    }}
                  >
                    <div className="min-w-0">
                      <span className="font-semibold block truncate" style={{ color: 'var(--color-text)' }}>
                        {hw.title}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {hw.subject} · {hw.dueDate}
                      </span>
                    </div>
                    {hw.status === 'graded' ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {hw.grade}
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0">
                        Pending
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Assessment alert */}
            <div
              className="p-3.5 rounded-xl border transition-colors flex items-center gap-3"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'var(--color-subtle-accent, rgba(0,0,0,0.06))', color: 'var(--color-accent)' }}
              >
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold block truncate" style={{ color: 'var(--color-text)' }}>
                  {selectedChild.upcomingAssessments[0]?.title || 'Next Term Assessment'}
                </span>
                <span className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
                  {selectedChild.upcomingAssessments[0]?.date} · {selectedChild.upcomingAssessments[0]?.room}
                </span>
              </div>
            </div>

            {/* Quick Action Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => setActiveTab('attendance')}
                className="p-3 rounded-xl border text-left flex items-center gap-2.5 transition-colors shadow-xs"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="text-xs font-bold block" style={{ color: 'var(--color-text)' }}>
                    Attendance
                  </span>
                  <span className="text-[10px] text-slate-400">View logs</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('fees')}
                className="p-3 rounded-xl border text-left flex items-center gap-2.5 transition-colors shadow-xs"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <CreditCard className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                <div>
                  <span className="text-xs font-bold block" style={{ color: 'var(--color-text)' }}>
                    Tuition Fees
                  </span>
                  <span className="text-[10px] text-slate-400">Invoices & dues</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <ParentAttendanceModule
              selectedChild={selectedChild}
              onNavigateTab={(t) => setActiveTab(t as MobileTab)}
            />
          </div>
        )}

        {/* TAB 3: HOMEWORK */}
        {activeTab === 'homework' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <ParentAssignmentsModule selectedChild={selectedChild} />
          </div>
        )}

        {/* TAB 4: MORE MENU */}
        {activeTab === 'more' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-3">
                All School Modules
              </span>

              <div className="space-y-1">
                {[
                  { id: 'children', label: 'My Children Portfolio', icon: Users },
                  { id: 'timetable', label: 'Class Timetable', icon: CalendarDays },
                  { id: 'results', label: 'Examinations & Results', icon: Award },
                  { id: 'fees', label: 'Fee Information', icon: CreditCard },
                  { id: 'announcements', label: 'Announcements & Circulars', icon: Bell },
                  { id: 'messages', label: 'Teacher Messages & Enquiries', icon: Mail },
                  { id: 'settings', label: 'Parent Settings & Theme', icon: Settings },
                ].map((item) => {
                  const IconComp = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as MobileTab)}
                      className="w-full flex items-center justify-between p-3 rounded-lg text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      style={{ color: 'var(--color-text)' }}
                    >
                      <div className="flex items-center gap-3">
                        <IconComp className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-slate-400">›</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Role Switcher */}
            <div
              className="p-4 rounded-xl border space-y-2 text-xs"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >

              <button
                onClick={onExitWorkspace}
                className="w-full flex items-center justify-between p-2 rounded-lg font-semibold text-rose-600 hover:bg-rose-50"
              >
                <div className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Role Selection</span>
                </div>
                <span>›</span>
              </button>
            </div>
          </div>
        )}

        {/* SUB-SCREENS REACHED VIA MORE */}
        {['children', 'timetable', 'results', 'fees', 'announcements', 'messages', 'settings'].includes(activeTab) && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <button
              onClick={() => setActiveTab('more')}
              className="flex items-center gap-1.5 text-xs font-semibold"
              style={{ color: 'var(--color-primary)' }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Menu</span>
            </button>

            {activeTab === 'children' ? (
              <ParentMyChildrenModule
                childrenList={children}
                selectedChildId={selectedChildId}
                onSelectChild={(id) => setSelectedChildId(id)}
                onNavigateTab={(t) => setActiveTab(t as MobileTab)}
              />
            ) : activeTab === 'timetable' ? (
              <ParentTimetableModule selectedChild={selectedChild} />
            ) : activeTab === 'results' ? (
              <ParentExamsResultsModule selectedChild={selectedChild} />
            ) : activeTab === 'fees' ? (
              <ParentFeeModule selectedChild={selectedChild} />
            ) : activeTab === 'announcements' ? (
              <ParentAnnouncementsModule selectedChildName={selectedChild.name} />
            ) : activeTab === 'messages' ? (
              <ParentEnquiriesModule childrenList={children} selectedChild={selectedChild} />
            ) : activeTab === 'settings' ? (
              <ParentSettingsModule childrenList={children} />
            ) : null}
          </div>
        )}
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav
        aria-label="Parent app navigation"
        className="h-16 border-t px-2 flex items-center justify-around shrink-0 backdrop-blur-md"
        style={{
          backgroundColor: 'rgba(var(--color-surface), 0.98)',
          borderColor: 'var(--color-border)',
        }}
      >
        <button
          onClick={() => setActiveTab('home')}
          aria-label="Parent Home dashboard"
          aria-current={activeTab === 'home' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1.5 min-h-[48px] text-[10px] font-semibold transition-colors focus-visible:ring-2 rounded-lg ${
            activeTab === 'home' ? 'font-bold' : 'opacity-60 hover:opacity-100'
          }`}
          style={{ color: activeTab === 'home' ? 'var(--color-primary)' : 'var(--color-text)' }}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          aria-label="Child attendance history"
          aria-current={activeTab === 'attendance' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1.5 min-h-[48px] text-[10px] font-semibold transition-colors focus-visible:ring-2 rounded-lg ${
            activeTab === 'attendance' ? 'font-bold' : 'opacity-60 hover:opacity-100'
          }`}
          style={{ color: activeTab === 'attendance' ? 'var(--color-primary)' : 'var(--color-text)' }}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Attendance</span>
        </button>

        <button
          onClick={() => setActiveTab('homework')}
          aria-label="Homework and assignments"
          aria-current={activeTab === 'homework' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1.5 min-h-[48px] text-[10px] font-semibold transition-colors focus-visible:ring-2 rounded-lg ${
            activeTab === 'homework' ? 'font-bold' : 'opacity-60 hover:opacity-100'
          }`}
          style={{ color: activeTab === 'homework' ? 'var(--color-primary)' : 'var(--color-text)' }}
        >
          <FileCheck className="w-4 h-4" />
          <span>Homework</span>
        </button>

        <button
          onClick={() => setActiveTab('more')}
          aria-label="More school modules and settings"
          aria-current={activeTab === 'more' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1.5 min-h-[48px] text-[10px] font-semibold transition-colors focus-visible:ring-2 rounded-lg ${
            activeTab === 'more' ? 'font-bold' : 'opacity-60 hover:opacity-100'
          }`}
          style={{ color: activeTab === 'more' ? 'var(--color-primary)' : 'var(--color-text)' }}
        >
          <Menu className="w-4 h-4" />
          <span>More</span>
        </button>
      </nav>
    </div>
  );

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start py-2 sm:py-4 px-2 sm:px-4 transition-colors"
      style={{
        backgroundColor: 'var(--color-background)',
      }}
    >
      {/* Top Testing Bar */}
      <div className="w-full max-w-md flex items-center justify-between pb-2.5 mb-1.5 text-xs">
        <button
          onClick={onExitWorkspace}
          className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300 hover:opacity-80 py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Role Selection</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md border text-[11px] font-medium"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
            title={isPhoneFrame ? 'Expand to Full Viewport' : 'Show Phone Frame'}
          >
            {isPhoneFrame ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            <span>{isPhoneFrame ? 'Full Width' : 'Phone Frame'}</span>
          </button>

          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md"
            style={{
              backgroundColor: 'var(--color-subtle-accent, rgba(0,0,0,0.06))',
              color: 'var(--color-primary)',
            }}
          >
            Mobile-Only App
          </span>
        </div>
      </div>

      {/* Frame wrapper */}
      {isPhoneFrame ? (
        <div
          className="w-full max-w-[400px] sm:max-w-[390px] h-[calc(100vh-70px)] sm:h-[780px] rounded-2xl sm:rounded-[38px] border-2 sm:border-[8px] shadow-2xl overflow-hidden flex flex-col relative"
          style={{
            borderColor: '#242C38',
            backgroundColor: 'var(--color-background)',
          }}
        >
          {/* Dynamic Phone Speaker Notch */}
          <div className="hidden sm:flex w-32 h-4 bg-slate-900 rounded-b-xl mx-auto absolute top-0 left-1/2 -translate-x-1/2 z-50 items-center justify-center">
            <div className="w-10 h-1 bg-slate-700 rounded-full" />
          </div>
          <div className="flex-1 flex flex-col h-full pt-0 sm:pt-4">
            {appContent}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-xl h-[calc(100vh-70px)] sm:h-[84vh] rounded-2xl border shadow-xl overflow-hidden flex flex-col">
          {appContent}
        </div>
      )}
    </div>
  );
};
