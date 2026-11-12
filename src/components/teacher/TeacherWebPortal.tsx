import React, { useState } from 'react';
import { RoleConfig } from '../../config/roles';
import { SchlarLogo } from '../brand/SchlarLogo';
import { useSchoolData } from '../../context/SchoolDataContext';
import { TeacherNestedSidebar } from './sidebar/TeacherNestedSidebar';
import { TeacherDashboardOverview } from './TeacherDashboardOverview';
import { TeacherMyClassesModule } from './TeacherMyClassesModule';
import { TeacherTimetableModule } from './TeacherTimetableModule';
import { TeacherAttendanceWorkflowModule } from './TeacherAttendanceWorkflowModule';
import { TeacherAssignmentsModule } from './TeacherAssignmentsModule';
import { TeacherMarksResultsModule } from './TeacherMarksResultsModule';
import { TeacherTeachingModule } from './TeacherTeachingModule';
import { TeacherStudentProgressModule } from './TeacherStudentProgressModule';
import { TeacherCommunicationModule } from './TeacherCommunicationModule';
import { TeacherAccountModule } from './TeacherAccountModule';
import {
  Smartphone,
  ArrowLeft,
  ChevronRight,
  Bell,
  Search,
  Menu,
  X,
  BookOpen,
} from 'lucide-react';

interface TeacherWebPortalProps {
  role: RoleConfig;
  onExitWorkspace: () => void;
  onSwitchToMobile: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
}

export const TeacherWebPortal: React.FC<TeacherWebPortalProps> = ({
  role,
  onExitWorkspace,
  onSwitchToMobile,
  onOpenSearch,
  onOpenNotifications,
  unreadNotificationsCount,
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const { sections } = useSchoolData();

  // Active Teacher: Ms. Sarah Henderson
  const assignedSectionIds = ['sec-8a', 'sec-9b', 'sec-10a'];
  const mySections = sections.filter((s) => assignedSectionIds.includes(s.id));

  return (
    <div
      className="min-h-screen flex transition-colors"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
      }}
    >
      {/* DESKTOP SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col justify-between shrink-0 border-r z-20 transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
        style={{
          backgroundColor: 'var(--color-sidebar)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-sidebar-text, #ffffff)',
        }}
      >
        <div className="flex-1 flex flex-col min-h-0">
          {/* Logo Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
            <SchlarLogo variant={sidebarCollapsed ? 'compact' : 'sidebar'} />
          </div>

          {/* Teacher Badge */}
          {!sidebarCollapsed && (
            <div className="p-3 mx-3 mt-3 rounded-lg bg-white/10 border border-white/15 shrink-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-white/70">
                  Teacher Workspace
                </span>
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase"
                  style={{ backgroundColor: 'var(--color-accent)', color: '#FFFFFF' }}
                >
                  Web Portal
                </span>
              </div>
              <div className="text-xs font-bold text-white truncate">Ms. Sarah Henderson</div>
              <div className="text-[10px] text-white/60 truncate">Mathematics Department</div>
            </div>
          )}

          {/* Nested Sidebar Navigation */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0 mt-2">
            <TeacherNestedSidebar
              activeTabId={activeTab}
              onSelectTab={(tabId) => setActiveTab(tabId)}
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/10 space-y-1 shrink-0">
          <button
            onClick={onSwitchToMobile}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-white/90 hover:text-white hover:bg-white/15 transition-colors"
            title="Switch to Mobile App View"
          >
            <Smartphone className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Switch to Mobile</span>}
          </button>

          <button
            onClick={onExitWorkspace}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-white/80 hover:text-white hover:bg-white/15 transition-colors"
            title="Return to Main Role Selection"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Role Selection</span>}
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div
            className="relative w-64 max-w-[80vw] h-full flex flex-col justify-between p-4 shadow-xl z-10"
            style={{
              backgroundColor: 'var(--color-sidebar)',
              color: 'var(--color-sidebar-text, #ffffff)',
            }}
          >
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <SchlarLogo variant="sidebar" />
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded text-white/80"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-2.5 rounded bg-white/10 border border-white/15 mb-2">
                <span className="text-[10px] uppercase font-bold text-white/70 block">Teacher Workspace</span>
                <span className="text-xs font-bold text-white">Ms. Sarah Henderson</span>
              </div>

              <div className="flex-1 overflow-y-auto">
                <TeacherNestedSidebar
                  isMobile
                  activeTabId={activeTab}
                  onSelectTab={(tabId) => {
                    setActiveTab(tabId);
                    setMobileDrawerOpen(false);
                  }}
                  collapsed={false}
                  onToggleCollapse={() => {}}
                  onCloseMobile={() => setMobileDrawerOpen(false)}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 space-y-1 shrink-0">
              <button
                onClick={onSwitchToMobile}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-white/90 hover:bg-white/15"
              >
                <Smartphone className="w-4 h-4 shrink-0" />
                <span>Switch to Mobile</span>
              </button>
              <button
                onClick={onExitWorkspace}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-white/80 hover:bg-white/15"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span>Exit Roles</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
          {/* Mobile hamburger + Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-1.5 rounded-md border"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              aria-label="Open navigation menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 text-xs font-medium truncate text-slate-500">
              <span className="font-semibold" style={{ color: 'var(--color-text)' }}>SCHLAR</span>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <span>Teacher Portal</span>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <span className="font-semibold truncate" style={{ color: 'var(--color-text)' }}>
                {activeTab.replace('teacher-', '').replace('-', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Quick Actions & Header Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Global search */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
              }}
              title="Quick Search (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search...</span>
            </button>

            {/* Switch to mobile preview */}
            <button
              onClick={onSwitchToMobile}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md border transition-colors hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-secondary)',
              }}
              title="Test Mobile Shell View"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile App</span>
            </button>

            {/* Notifications */}
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

        {/* WORKSPACE PAGE ROUTER */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'overview' ? (
            <TeacherDashboardOverview
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSelectClassForAttendance={() => setActiveTab('attendance')}
            />
          ) : activeTab === 'my-classes' ? (
            <TeacherMyClassesModule onNavigateTab={(tab) => setActiveTab(tab)} />
          ) : activeTab === 'my-timetable' ? (
            <TeacherTimetableModule />
          ) : activeTab === 'attendance' ? (
            <TeacherAttendanceWorkflowModule />
          ) : activeTab === 'assignments' ? (
            <TeacherAssignmentsModule />
          ) : activeTab === 'marks-results' ||
            activeTab.startsWith('teacher-exam-') ||
            activeTab.startsWith('teacher-marks-') ||
            activeTab === 'teacher-assessment-tasks' ||
            activeTab === 'teacher-results' ? (
            <TeacherMarksResultsModule initialSubTab={activeTab} />
          ) : activeTab === 'teaching-folder' ||
            activeTab === 'teacher-class-details' ||
            activeTab.startsWith('teacher-subject-') ||
            activeTab.startsWith('teacher-lesson-') ||
            activeTab.startsWith('teacher-syllabus-') ||
            activeTab.startsWith('teacher-resources') ? (
            <TeacherTeachingModule initialSubTab={activeTab} />
          ) : activeTab === 'student-progress-folder' ||
            activeTab.startsWith('teacher-student-') ||
            activeTab.startsWith('teacher-feedback') ||
            activeTab === 'teacher-attendance-concerns' ? (
            <TeacherStudentProgressModule initialSubTab={activeTab} />
          ) : activeTab === 'communication-folder' ||
            activeTab.startsWith('teacher-announcements') ||
            activeTab.startsWith('teacher-class-notices') ||
            activeTab.startsWith('teacher-messages') ? (
            <TeacherCommunicationModule initialSubTab={activeTab} />
          ) : activeTab === 'my-account-folder' ||
            activeTab.startsWith('teacher-my-') ||
            activeTab === 'teacher-preferences' ? (
            <TeacherAccountModule initialSubTab={activeTab} />
          ) : (
            <TeacherDashboardOverview
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSelectClassForAttendance={() => setActiveTab('attendance')}
            />
          )}
        </main>
      </div>
    </div>
  );
};
