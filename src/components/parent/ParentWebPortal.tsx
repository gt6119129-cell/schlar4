import React, { useState } from 'react';
import { RoleConfig } from '../../config/roles';
import { LinkedChild, DEMO_LINKED_CHILDREN } from '../../data/mockData';
import { SchlarLogo } from '../brand/SchlarLogo';
import {
  Users,
  CheckSquare,
  CalendarDays,
  FileCheck,
  Award,
  CreditCard,
  Bell,
  Mail,
  Settings,
  LayoutDashboard,
  ArrowLeft,
  Smartphone,
  ChevronDown,
  Check,
  Calendar,
  AlertCircle,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
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

interface ParentWebPortalProps {
  role: RoleConfig;
  onExitWorkspace: () => void;
  onSwitchToMobile: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
}

const PARENT_NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'my-children', label: 'My Children', icon: Users },
  { id: 'attendance', label: 'Attendance', icon: CheckSquare },
  { id: 'timetable', label: 'Timetable', icon: CalendarDays },
  { id: 'homework-assignments', label: 'Homework & Assignments', icon: FileCheck },
  { id: 'examinations-results', label: 'Examinations & Results', icon: Award },
  { id: 'fee-information', label: 'Fee Information', icon: CreditCard },
  { id: 'announcements', label: 'Announcements', icon: Bell },
  { id: 'messages', label: 'Messages', icon: Mail },
  { id: 'profile-settings', label: 'Profile & Settings', icon: Settings },
];

export const ParentWebPortal: React.FC<ParentWebPortalProps> = ({
  role,
  onExitWorkspace,
  onSwitchToMobile,
  onOpenSearch,
  onOpenNotifications,
  unreadNotificationsCount,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [children, setChildren] = useState<LinkedChild[]>(DEMO_LINKED_CHILDREN);
  const [selectedChildId, setSelectedChildId] = useState<string>(DEMO_LINKED_CHILDREN[0].id);
  const [childDropdownOpen, setChildDropdownOpen] = useState(false);

  const selectedChild = children.find((c) => c.id === selectedChildId) || children[0];

  return (
    <div
      className="min-h-screen flex transition-colors"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
      }}
    >
      {/* SIDEBAR NAVIGATION */}
      <aside
        className="hidden md:flex flex-col justify-between w-64 shrink-0 border-r z-20"
        style={{
          backgroundColor: 'var(--color-sidebar)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-sidebar-text, #ffffff)',
        }}
      >
        <div>
          {/* Logo Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
            <SchlarLogo variant="sidebar" />
          </div>

          {/* Role + Platform Badge */}
          <div className="p-3 mx-3 mt-3 rounded-lg bg-white/10 border border-white/15">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-white/70">
                Parent Workspace
              </span>
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase"
                style={{ backgroundColor: 'var(--color-accent)', color: '#FFFFFF' }}
              >
                Web Portal
              </span>
            </div>
            <div className="text-sm font-bold text-white">Family Guardian Portal</div>
          </div>

          {/* Child Switcher in Sidebar */}
          <div className="px-3 mt-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-white/60 block mb-1">
              Active Student Portfolio
            </span>
            <div className="relative">
              <button
                onClick={() => setChildDropdownOpen(!childDropdownOpen)}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-white/15 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0"
                    style={{ backgroundColor: 'var(--color-accent)', color: '#FFFFFF' }}
                  >
                    {selectedChild.avatarInitials}
                  </div>
                  <div className="text-left truncate">
                    <div className="truncate font-bold">{selectedChild.name}</div>
                    <div className="text-[10px] text-white/70">{selectedChild.grade} · {selectedChild.section}</div>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 shrink-0 text-white/70" />
              </button>

              {childDropdownOpen && (
                <div
                  className="absolute left-0 right-0 top-full mt-1 rounded-lg border shadow-xl p-1 z-30 animate-in fade-in"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  {children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => {
                        setSelectedChildId(child.id);
                        setChildDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-md text-xs transition-colors ${
                        child.id === selectedChild.id ? 'font-bold' : 'hover:opacity-80'
                      }`}
                      style={{
                        backgroundColor: child.id === selectedChild.id ? 'var(--color-background)' : 'transparent',
                        color: 'var(--color-text)',
                      }}
                    >
                      <div className="text-left">
                        <div className="font-semibold">{child.name}</div>
                        <div className="text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>
                          {child.grade} ({child.section})
                        </div>
                      </div>
                      {child.id === selectedChild.id && (
                        <Check className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 10 Navigation Items */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] mt-2">
            {PARENT_NAV_ITEMS.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                    isActive
                      ? 'bg-white text-slate-900 font-bold shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: '#FFFFFF',
                          color: 'var(--color-primary)',
                        }
                      : {}
                  }
                >
                  <IconComp className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Switch to Mobile + Return to Selection */}
        <div className="p-3 border-t border-white/10 space-y-1 shrink-0">
          <button
            onClick={onSwitchToMobile}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-white/90 hover:text-white hover:bg-white/15 transition-colors"
            title="Switch to Parent Mobile App Experience"
          >
            <Smartphone className="w-4 h-4 shrink-0" />
            <span>Switch to Mobile App</span>
          </button>

          <button
            onClick={onExitWorkspace}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-white/80 hover:text-white hover:bg-white/15 transition-colors"
            title="Return to Main Role Selection"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Role Selection</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP BAR */}
        <header
          className="h-16 px-4 sm:px-6 border-b flex items-center justify-between gap-4 sticky top-0 z-10 backdrop-blur-md transition-colors"
          style={{
            backgroundColor: 'rgba(var(--color-surface), 0.94)',
            borderColor: 'var(--color-border)',
          }}
        >
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs font-medium truncate" style={{ color: 'var(--color-text-secondary)' }}>
            <span className="font-semibold" style={{ color: 'var(--color-text)' }}>SCHLAR</span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span>Parent Portal</span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="font-semibold" style={{ color: 'var(--color-text)' }}>
              {selectedChild.name}
            </span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 hidden sm:inline" />
            <span className="hidden sm:inline capitalize">
              {PARENT_NAV_ITEMS.find((n) => n.id === activeTab)?.label || 'Overview'}
            </span>
          </div>

          {/* Quick Actions & Child Indicator */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Child Switcher Pill */}
            <div
              className="flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              <span>Child:</span>
              <span className="font-bold" style={{ color: 'var(--color-primary)' }}>
                {selectedChild.name}
              </span>
              <span className="text-[10px] text-slate-400">({selectedChild.grade})</span>
            </div>

            {/* Mobile App View Quick Switch Button */}
            <button
              onClick={onSwitchToMobile}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md border transition-colors hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-secondary)',
              }}
              title="Test Mobile App View"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile App</span>
            </button>

            {/* Notifications Button */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-md border transition-colors hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
              aria-label="Open notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                />
              )}
            </button>

            {/* Exit to Role Selection */}
            <button
              onClick={onExitWorkspace}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Roles</span>
            </button>
          </div>
        </header>

        {/* WORKSPACE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Child Header Card */}
              <div
                className="p-6 rounded-2xl border transition-colors shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-extrabold text-white shadow-sm shrink-0"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {selectedChild.avatarInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
                        {selectedChild.name}
                      </h1>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase border"
                        style={{
                          backgroundColor: 'var(--color-background)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-secondary)',
                        }}
                      >
                        Roll #{selectedChild.rollNumber}
                      </span>
                    </div>
                    <p className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                      {selectedChild.grade} · {selectedChild.section} · Homeroom: {selectedChild.homeroom} · Advisor: {selectedChild.classTeacher}
                    </p>
                  </div>
                </div>

                {/* Quick actions for parent */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className="px-3 py-2 text-xs font-semibold rounded-lg border hover:opacity-85 transition-opacity"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  >
                    Submit Leave Slip
                  </button>
                  <button
                    onClick={() => setActiveTab('fee-information')}
                    className="px-3.5 py-2 text-xs font-bold text-white rounded-lg shadow-sm hover:opacity-95 transition-opacity"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    View Tuition Statement
                  </button>
                </div>
              </div>

              {/* 4 Essential Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Attendance */}
                <div
                  className="p-4 rounded-xl border transition-colors shadow-sm flex flex-col justify-between"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <div className="flex items-center justify-between text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                    <span>Term Attendance</span>
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="my-2">
                    <span className="text-2xl font-extrabold font-mono tabular-nums" style={{ color: 'var(--color-text)' }}>
                      {selectedChild.attendancePercent}%
                    </span>
                  </div>
                  <span className="text-[11px] font-medium" style={{ color: 'var(--color-secondary)' }}>
                    {selectedChild.attendanceDays.present} of {selectedChild.attendanceDays.total} school days present
                  </span>
                </div>

                {/* 2. GPA & Academic Standing */}
                <div
                  className="p-4 rounded-xl border transition-colors shadow-sm flex flex-col justify-between"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <div className="flex items-center justify-between text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                    <span>Academic GPA</span>
                    <Award className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                  </div>
                  <div className="my-2">
                    <span className="text-2xl font-extrabold font-mono tabular-nums" style={{ color: 'var(--color-text)' }}>
                      {selectedChild.gpa}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-600">
                    Honors Standing (Top Decile)
                  </span>
                </div>

                {/* 3. Pending Homework */}
                <div
                  className="p-4 rounded-xl border transition-colors shadow-sm flex flex-col justify-between"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <div className="flex items-center justify-between text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                    <span>Active Homework</span>
                    <FileCheck className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div className="my-2">
                    <span className="text-2xl font-extrabold font-mono tabular-nums" style={{ color: 'var(--color-text)' }}>
                      {selectedChild.pendingHomeworkCount} Tasks Due
                    </span>
                  </div>
                  <span className="text-[11px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                    Next deadline: Tomorrow 08:30 AM
                  </span>
                </div>

                {/* 4. Tuition Status */}
                <div
                  className="p-4 rounded-xl border transition-colors shadow-sm flex flex-col justify-between"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <div className="flex items-center justify-between text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                    <span>Tuition Ledger</span>
                    <CreditCard className="w-4 h-4" style={{ color: 'var(--color-secondary)' }} />
                  </div>
                  <div className="my-2">
                    <span
                      className={`text-2xl font-extrabold font-mono tabular-nums ${
                        selectedChild.outstandingBalance === 0 ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {selectedChild.outstandingBalance === 0 ? '₹0.00' : `₹${selectedChild.outstandingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                    {selectedChild.tuitionStatus === 'Paid' ? 'Term 2 Cleared in Full' : 'Due by Nov 01, 2026'}
                  </span>
                </div>
              </div>

              {/* Split Content: Recent Homework & Upcoming Assessments */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Homework List */}
                <div
                  className="p-5 rounded-xl border transition-colors shadow-sm flex flex-col justify-between"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: 'var(--color-border)' }}>
                      <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                        <FileCheck className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                        <span>Recent Homework & Assignments ({selectedChild.name})</span>
                      </h3>
                      <button
                        onClick={() => setActiveTab('homework-assignments')}
                        className="text-xs font-semibold hover:underline"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        View All
                      </button>
                    </div>

                    <div className="space-y-3">
                      {selectedChild.recentHomework.map((hw) => (
                        <div
                          key={hw.id}
                          className="p-3 rounded-lg border flex items-center justify-between gap-3 text-xs"
                          style={{
                            backgroundColor: 'var(--color-background)',
                            borderColor: 'var(--color-border)',
                          }}
                        >
                          <div>
                            <span className="font-semibold block" style={{ color: 'var(--color-text)' }}>
                              {hw.title}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                              <span>{hw.subject}</span>
                              <span>·</span>
                              <span>Due {hw.dueDate}</span>
                            </div>
                          </div>

                          <div>
                            {hw.status === 'graded' ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
                                {hw.grade}
                              </span>
                            ) : hw.status === 'submitted' ? (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded text-slate-700 bg-slate-100 dark:bg-slate-800">
                                Submitted
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded text-amber-700 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
                                Action Needed
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Upcoming Assessments */}
                <div
                  className="p-5 rounded-xl border transition-colors shadow-sm flex flex-col justify-between"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: 'var(--color-border)' }}>
                      <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                        <Award className="w-4 h-4" style={{ color: 'var(--color-secondary)' }} />
                        <span>Upcoming Examinations & Tests</span>
                      </h3>
                      <button
                        onClick={() => setActiveTab('examinations-results')}
                        className="text-xs font-semibold hover:underline"
                        style={{ color: 'var(--color-secondary)' }}
                      >
                        Full Schedule
                      </button>
                    </div>

                    <div className="space-y-3">
                      {selectedChild.upcomingAssessments.map((asm) => (
                        <div
                          key={asm.id}
                          className="p-3 rounded-lg border flex items-center justify-between gap-3 text-xs"
                          style={{
                            backgroundColor: 'var(--color-background)',
                            borderColor: 'var(--color-border)',
                          }}
                        >
                          <div>
                            <span className="font-semibold block" style={{ color: 'var(--color-text)' }}>
                              {asm.title}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                              <span>{asm.subject}</span>
                              <span>·</span>
                              <span>{asm.room}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-mono font-bold text-xs" style={{ color: 'var(--color-primary)' }}>
                              {asm.date}
                            </span>
                            <span className="block text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>
                              Confirmed
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DEDICATED MODULE ROUTING */}
          {activeTab === 'my-children' ? (
            <ParentMyChildrenModule
              childrenList={children}
              selectedChildId={selectedChildId}
              onSelectChild={(id) => setSelectedChildId(id)}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          ) : activeTab === 'attendance' ? (
            <ParentAttendanceModule
              selectedChild={selectedChild}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          ) : activeTab === 'timetable' ? (
            <ParentTimetableModule selectedChild={selectedChild} />
          ) : activeTab === 'homework-assignments' ? (
            <ParentAssignmentsModule selectedChild={selectedChild} />
          ) : activeTab === 'examinations-results' ? (
            <ParentExamsResultsModule selectedChild={selectedChild} />
          ) : activeTab === 'fee-information' ? (
            <ParentFeeModule selectedChild={selectedChild} />
          ) : activeTab === 'announcements' ? (
            <ParentAnnouncementsModule selectedChildName={selectedChild.name} />
          ) : activeTab === 'messages' ? (
            <ParentEnquiriesModule
              childrenList={children}
              selectedChild={selectedChild}
            />
          ) : activeTab === 'profile-settings' ? (
            <ParentSettingsModule childrenList={children} />
          ) : null}
        </main>
      </div>
    </div>
  );
};
