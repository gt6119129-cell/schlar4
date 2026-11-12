import React, { useState, useMemo } from 'react';
import { RoleConfig, RoleNavItem } from '../../config/roles';
import { SchlarLogo } from '../brand/SchlarLogo';
import { useTheme } from '../../context/ThemeContext';
import { usePermissions } from '../../context/PermissionContext';
import { AccessDenied } from '../common/AccessDenied';
import { PermissionManager } from '../permissions/PermissionManager';
import { AdminDashboardOverview } from '../admin/AdminDashboardOverview';
import { ClassesSectionsModule } from '../admin/ClassesSectionsModule';
import { StudentsGuardiansModule } from '../admin/StudentsGuardiansModule';
import { StaffDirectoryModule } from '../admin/StaffDirectoryModule';
import { TimetableModule } from '../admin/TimetableModule';
import { AttendanceMonitoringModule } from '../admin/AttendanceMonitoringModule';
import { AdmissionsModule } from '../admin/AdmissionsModule';
import { FeesOverviewModule } from '../admin/FeesOverviewModule';
import { SchoolReportsModule } from '../admin/SchoolReportsModule';
import { SchoolSettingsModule } from '../admin/SchoolSettingsModule';
import { AcademicsOverviewModule } from '../admin/AcademicsOverviewModule';
import { AdminNestedSidebar } from '../admin/sidebar/AdminNestedSidebar';
import { ADMIN_NAVIGATION_SECTIONS, AdminNavItem } from '../../config/adminNavigation';
import { TimetableOverviewTab } from '../admin/timetable/TimetableOverviewTab';
import { TimetableBuilderTab } from '../admin/timetable/TimetableBuilderTab';
import { ClassTimetableTab } from '../admin/timetable/ClassTimetableTab';
import { TeacherTimetableTab } from '../admin/timetable/TeacherTimetableTab';
import { RoomTimetableTab } from '../admin/timetable/RoomTimetableTab';
import { TimetableConflictReportTab } from '../admin/timetable/TimetableConflictReportTab';
import { AdminActivityModule } from '../admin/AdminActivityModule';
import { VicePrincipalNestedSidebar } from '../viceprincipal/sidebar/VicePrincipalNestedSidebar';
import { VPDashboardOverview } from '../viceprincipal/VPDashboardOverview';
import { VPAcademicManagementModule } from '../viceprincipal/VPAcademicManagementModule';
import { VPTeacherCoordinationModule } from '../viceprincipal/VPTeacherCoordinationModule';
import { VPTimetableMonitoringModule } from '../viceprincipal/VPTimetableMonitoringModule';
import { VPAttendanceMonitoringModule } from '../viceprincipal/VPAttendanceMonitoringModule';
import { VPExaminationsModule } from '../viceprincipal/VPExaminationsModule';
import { VPStudentProgressModule } from '../viceprincipal/VPStudentProgressModule';
import { VPApprovalsModule } from '../viceprincipal/VPApprovalsModule';
import { VPReportsModule } from '../viceprincipal/VPReportsModule';
import { AccountantNestedSidebar } from '../accountant/sidebar/AccountantNestedSidebar';
import { AccountantDashboardOverview } from '../accountant/AccountantDashboardOverview';
import { AccountantCollectionOverviewModule } from '../accountant/AccountantCollectionOverviewModule';
import { AccountantOutstandingBalancesModule } from '../accountant/AccountantOutstandingBalancesModule';
import { AccountantFinancialReportsModule } from '../accountant/AccountantFinancialReportsModule';
import { AccountantActivityLogModule } from '../accountant/AccountantActivityLogModule';
import { AccountantFeeStructureModule } from '../accountant/AccountantFeeStructureModule';
import { AccountantStudentFeeRecordsModule } from '../accountant/AccountantStudentFeeRecordsModule';
import { AccountantAssignFeesModule } from '../accountant/AccountantAssignFeesModule';
import { AccountantConcessionsModule } from '../accountant/AccountantConcessionsModule';
import { AccountantRefundsAdjustmentsModule } from '../accountant/AccountantRefundsAdjustmentsModule';
import { AccountantCollectFeesModule } from '../accountant/AccountantCollectFeesModule';
import { AccountantReceiptsModule } from '../accountant/AccountantReceiptsModule';
import { AccountantReconciliationModule } from '../accountant/AccountantReconciliationModule';
import { HRNestedSidebar } from '../hr/sidebar/HRNestedSidebar';
import { HRDashboardOverview } from '../hr/HRDashboardOverview';
import { HRStaffDirectoryModule } from '../hr/HRStaffDirectoryModule';
import { HRStaffProfileModule } from '../hr/HRStaffProfileModule';
import { HRAddStaffModule } from '../hr/HRAddStaffModule';
import { HRDepartmentsModule } from '../hr/HRDepartmentsModule';
import { HRStaffAttendanceModule } from '../hr/HRStaffAttendanceModule';
import { HRLeaveManagementModule } from '../hr/HRLeaveManagementModule';
import { HRRecruitmentModule } from '../hr/HRRecruitmentModule';
import { HRDocumentsModule } from '../hr/HRDocumentsModule';
import { HRReportsModule } from '../hr/HRReportsModule';
// Librarian Workspace Components
import { LibrarianNestedSidebar } from '../librarian/sidebar/LibrarianNestedSidebar';
import { LibrarianDashboardOverview } from '../librarian/LibrarianDashboardOverview';
import { LibrarianCatalogueModule } from '../librarian/LibrarianCatalogueModule';
import { LibrarianCategoriesModule } from '../librarian/LibrarianCategoriesModule';
import { LibrarianInventoryModule } from '../librarian/LibrarianInventoryModule';
import { LibrarianMembersModule } from '../librarian/LibrarianMembersModule';
import { LibrarianIssueBookModule } from '../librarian/LibrarianIssueBookModule';
import { LibrarianReturnBookModule } from '../librarian/LibrarianReturnBookModule';
import { LibrarianRenewalsReservationsModule } from '../librarian/LibrarianRenewalsReservationsModule';
import { LibrarianFinesStockModule } from '../librarian/LibrarianFinesStockModule';
import { LibrarianReportsModule } from '../librarian/LibrarianReportsModule';
// Transport Manager Workspace Components
import { TransportNestedSidebar } from '../transport/sidebar/TransportNestedSidebar';
import { TransportDashboardOverview } from '../transport/TransportDashboardOverview';
import { TransportVehiclesModule } from '../transport/TransportVehiclesModule';
import { TransportDriversModule } from '../transport/TransportDriversModule';
import { TransportRoutesModule } from '../transport/TransportRoutesModule';
import { TransportAssignmentsModule } from '../transport/TransportAssignmentsModule';
import { TransportAttendanceModule } from '../transport/TransportAttendanceModule';
import { TransportMaintenanceModule } from '../transport/TransportMaintenanceModule';
import { TransportExpensesIncidentsModule } from '../transport/TransportExpensesIncidentsModule';
import { TransportReportsModule } from '../transport/TransportReportsModule';
// Receptionist / Front Office Workspace Components
import { ReceptionistNestedSidebar } from '../receptionist/sidebar/ReceptionistNestedSidebar';
import { ReceptionistDashboardOverview } from '../receptionist/ReceptionistDashboardOverview';
import { ReceptionistVisitorDeskModule } from '../receptionist/ReceptionistVisitorDeskModule';
import { ReceptionistVisitorDirectoryModule } from '../receptionist/ReceptionistVisitorDirectoryModule';
import { ReceptionistEnquiriesModule } from '../receptionist/ReceptionistEnquiriesModule';
import { ReceptionistAppointmentsModule } from '../receptionist/ReceptionistAppointmentsModule';
import { ReceptionistCommunicationsModule } from '../receptionist/ReceptionistCommunicationsModule';
import { ReceptionistRequestsModule } from '../receptionist/ReceptionistRequestsModule';
import { ReceptionistDirectoryLookupModule } from '../receptionist/ReceptionistDirectoryLookupModule';
import { ReceptionistDocumentsModule } from '../receptionist/ReceptionistDocumentsModule';
import { ReceptionistReportsModule } from '../receptionist/ReceptionistReportsModule';
import { ExamCoordinatorModule } from '../examcoordinator/ExamCoordinatorModule';
import { ResetDemoModal } from '../common/ResetDemoModal';
import {
  Search,
  Bell,
  ArrowLeft,
  ChevronRight,
  Filter,
  Download,
  Plus,
  RefreshCw,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  SlidersHorizontal,
  ChevronDown,
  LayoutDashboard,
  Building2,
  ShieldAlert,
  Settings,
  CalendarDays,
  Users,
  AlertTriangle,
  BookOpenCheck,
  CheckSquare,
  Award,
  FileCheck,
  Bookmark,
  HeartHandshake,
  CreditCard,
  Calendar,
  Receipt,
  FileSpreadsheet,
  PieChart,
  UserCheck,
  CalendarClock,
  UserPlus,
  Library,
  BookMarked,
  ScanLine,
  Laptop,
  Bus,
  MapPin,
  Wrench,
  Fuel,
  Building,
  BadgeCheck,
  HelpCircle,
  Mail,
  ClipboardCheck,
  CalendarRange,
  X,
  Menu,
  GraduationCap,
  Lock,
  ShieldCheck,
  User,
} from 'lucide-react';

interface SharedWorkspaceShellProps {
  role: RoleConfig;
  onExitWorkspace: () => void;
  onSwitchRole: (targetRole: RoleConfig) => void;
  allRoles: RoleConfig[];
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
}

const NAV_ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  LayoutDashboard,
  Building2,
  ShieldAlert,
  FileText,
  Settings,
  CalendarDays,
  Users,
  AlertTriangle,
  BookOpenCheck,
  CheckSquare,
  Award,
  FileCheck,
  Bookmark,
  HeartHandshake,
  CreditCard,
  Calendar,
  Receipt,
  FileSpreadsheet,
  PieChart,
  UserCheck,
  CalendarClock,
  UserPlus,
  Library,
  BookMarked,
  ScanLine,
  Clock,
  Laptop,
  Bus,
  MapPin,
  Wrench,
  Fuel,
  Building,
  BadgeCheck,
  HelpCircle,
  Mail,
  ClipboardCheck,
  CalendarRange,
  GraduationCap,
};

export const SharedWorkspaceShell: React.FC<SharedWorkspaceShellProps> = ({
  role,
  onExitWorkspace,
  onSwitchRole,
  allRoles,
  onOpenSearch,
  onOpenNotifications,
  unreadNotificationsCount,
}) => {
  const { activePalette } = useTheme();
  const { isNavAllowed, hasPermission } = usePermissions();

  // Active sub-module navigation tab
  const [activeTabId, setActiveTabId] = useState<string>('overview');

  // Sidebar toggle state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Search & Filter state for records table on overview
  const [tableSearch, setTableSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'pending'>('all');

  // State Completeness simulation toggles
  const [isLoading, setIsLoading] = useState(false);
  const [isEmptyState, setIsEmptyState] = useState(false);

  // Dropdown states
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showPermissionManager, setShowPermissionManager] = useState(false);
  const [newRecordModalOpen, setNewRecordModalOpen] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // Records state
  const [customRecords, setCustomRecords] = useState(role.sampleRecords);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newTag, setNewTag] = useState('Operations');

  // Filter navigation items by effective permissions
  const permittedNavItems = useMemo(() => {
    return role.navItems.filter((item) => isNavAllowed(role.id, item));
  }, [role, isNavAllowed]);

  const activeAdminItem = useMemo(() => {
    if (role.id !== 'admin') return null;
    const findItem = (items: AdminNavItem[]): AdminNavItem | null => {
      for (const item of items) {
        if (item.id === activeTabId) return item;
        if (item.children) {
          const found = findItem(item.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findItem(ADMIN_NAVIGATION_SECTIONS);
  }, [role.id, activeTabId]);

  const activeNavItem = role.navItems.find((item) => item.id === activeTabId) || role.navItems[0];

  const isCurrentTabPermitted = useMemo(() => {
    if (role.id === 'admin') {
      if (activeAdminItem?.requiredPermission) {
        return hasPermission('admin', activeAdminItem.requiredPermission);
      }
      return true;
    }
    return isNavAllowed(role.id, activeNavItem);
  }, [role.id, activeAdminItem, activeNavItem, isNavAllowed, hasPermission]);

  // Filtered table records for Overview
  const displayRecords = useMemo(() => {
    if (isEmptyState) return [];
    return customRecords.filter((rec) => {
      const matchSearch =
        rec.title.toLowerCase().includes(tableSearch.toLowerCase()) ||
        rec.subtitle.toLowerCase().includes(tableSearch.toLowerCase()) ||
        rec.tag.toLowerCase().includes(tableSearch.toLowerCase()) ||
        rec.id.toLowerCase().includes(tableSearch.toLowerCase());
      const matchStatus = statusFilter === 'all' || rec.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [customRecords, tableSearch, statusFilter, isEmptyState]);

  const handleSimulateRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newEntry = {
      id: `${role.id.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'New operational ledger entry',
      tag: newTag,
      status: 'active' as const,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    };
    setCustomRecords([newEntry, ...customRecords]);
    setNewTitle('');
    setNewSubtitle('');
    setNewRecordModalOpen(false);
    setIsEmptyState(false);
  };

  return (
    <div
      className="min-h-screen flex transition-colors"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
      }}
    >
      {/* DESKTOP SIDEBAR (240px - 280px) */}
      <aside
        className={`hidden md:flex flex-col justify-between shrink-0 transition-all duration-300 border-r z-20 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
        style={{
          backgroundColor: 'var(--color-sidebar)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-sidebar-text, #ffffff)',
        }}
      >
        <div className="flex flex-col min-h-0">
          {/* Sidebar Brand Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
            {!sidebarCollapsed ? (
              <SchlarLogo variant="sidebar" />
            ) : (
              <SchlarLogo variant="symbol" inverted />
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label="Toggle sidebar collapse"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Active Role Lockup Badge */}
          {!sidebarCollapsed ? (
            <div className="p-3 mx-3 mt-3 rounded-lg bg-white/10 border border-white/15">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-white/70">
                  {role.category}
                </span>
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                />
              </div>
              <div className="text-sm font-bold truncate text-white">
                {role.name}
              </div>
            </div>
          ) : (
            <div className="p-2 flex justify-center mt-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: 'var(--color-accent)' }}
                title={`Active Role: ${role.name}`}
              />
            </div>
          )}

          {/* Navigation Module Tabs (Filtered by Permission) */}
          {role.id === 'admin' ? (
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              <AdminNestedSidebar
                activeTabId={activeTabId}
                onSelectTab={(tabId) => {
                  setShowPermissionManager(false);
                  setActiveTabId(tabId);
                }}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
              />
            </div>
          ) : role.id === 'vice_principal' || role.id === 'vice-principal' ? (
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              <VicePrincipalNestedSidebar
                activeTabId={activeTabId}
                onSelectTab={(tabId) => {
                  setShowPermissionManager(false);
                  setActiveTabId(tabId);
                }}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
              />
            </div>
          ) : role.id === 'accountant' ? (
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              <AccountantNestedSidebar
                activeTabId={activeTabId}
                onSelectTab={(tabId) => {
                  setShowPermissionManager(false);
                  setActiveTabId(tabId);
                }}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
              />
            </div>
          ) : role.id === 'hr' || role.id === 'hr-manager' ? (
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              <HRNestedSidebar
                activeTabId={activeTabId}
                onSelectTab={(tabId) => {
                  setShowPermissionManager(false);
                  setActiveTabId(tabId);
                }}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
              />
            </div>
          ) : role.id === 'librarian' ? (
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              <LibrarianNestedSidebar
                activeTabId={activeTabId}
                onSelectTab={(tabId) => {
                  setShowPermissionManager(false);
                  setActiveTabId(tabId);
                }}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
              />
            </div>
          ) : role.id === 'transport-manager' || role.id === 'transport' ? (
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              <TransportNestedSidebar
                activeTabId={activeTabId}
                onSelectTab={(tabId) => {
                  setShowPermissionManager(false);
                  setActiveTabId(tabId);
                }}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
              />
            </div>
          ) : role.id === 'receptionist' ? (
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              <ReceptionistNestedSidebar
                activeTabId={activeTabId}
                onSelectTab={(tabId) => {
                  setShowPermissionManager(false);
                  setActiveTabId(tabId);
                }}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
              />
            </div>
          ) : (
            <nav className="p-3 space-y-1 overflow-y-auto flex-1 mt-2 max-h-[calc(100vh-270px)]">
              {!sidebarCollapsed && (
                <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-white/60 px-2 mb-2">
                  <span>Modules ({permittedNavItems.length})</span>
                  <span className="text-[9px] text-white/40">RBAC Filtered</span>
                </div>
              )}

              {role.navItems.map((item) => {
                const IconComp = NAV_ICON_MAP[item.icon] || LayoutDashboard;
                const isActive = activeTabId === item.id;
                const isAllowed = isNavAllowed(role.id, item);

                if (!isAllowed && sidebarCollapsed) return null;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setShowPermissionManager(false);
                      setActiveTabId(item.id);
                    }}
                    disabled={!isAllowed}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                      isActive && !showPermissionManager
                        ? 'bg-white text-slate-900 font-bold shadow-sm'
                        : isAllowed
                        ? 'text-white/85 hover:text-white hover:bg-white/10'
                        : 'text-white/30 cursor-not-allowed opacity-50'
                    }`}
                    style={
                      isActive && !showPermissionManager
                        ? {
                            backgroundColor: '#FFFFFF',
                            color: 'var(--color-primary)',
                          }
                        : {}
                    }
                  >
                    <div className="flex items-center gap-3 truncate">
                      <IconComp className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </div>
                    {!sidebarCollapsed && !isAllowed && (
                      <Lock className="w-3 h-3 text-white/40 shrink-0" />
                    )}
                  </button>
                );
              })}
            </nav>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/10 space-y-1 shrink-0">
          {hasPermission(role.id, 'permissions.manage') && (
            <button
              onClick={() => setShowPermissionManager(!showPermissionManager)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                showPermissionManager ? 'bg-white/25 text-white' : 'text-white/80 hover:text-white hover:bg-white/15'
              }`}
              title="Open Role Permissions Manager"
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Permission Matrix</span>}
            </button>
          )}

          <button
            onClick={onExitWorkspace}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-white/90 hover:text-white hover:bg-white/15 transition-colors"
            title="Return to Main Role Selection"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Role Selection</span>}
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER SIDEBAR */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div
            className="relative w-64 max-w-[80vw] h-full flex flex-col justify-between p-4 shadow-xl z-10"
            style={{
              backgroundColor: 'var(--color-sidebar)',
              color: 'var(--color-sidebar-text, #ffffff)',
            }}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <SchlarLogo variant="sidebar" />
                <button onClick={() => setMobileSidebarOpen(false)} className="p-1 rounded text-white/80">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4 p-2.5 rounded bg-white/10 border border-white/15">
                <span className="text-[10px] uppercase font-bold text-white/70 block">Active Role</span>
                <span className="text-sm font-bold text-white">{role.name}</span>
              </div>

              {role.id === 'admin' ? (
                <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
                  <AdminNestedSidebar
                    isMobile
                    activeTabId={activeTabId}
                    onSelectTab={(tabId) => {
                      setActiveTabId(tabId);
                      setShowPermissionManager(false);
                      setMobileSidebarOpen(false);
                    }}
                    collapsed={false}
                    onToggleCollapse={() => {}}
                    onCloseMobile={() => setMobileSidebarOpen(false)}
                  />
                </div>
              ) : role.id === 'vice_principal' || role.id === 'vice-principal' ? (
                <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
                  <VicePrincipalNestedSidebar
                    isMobile
                    activeTabId={activeTabId}
                    onSelectTab={(tabId) => {
                      setActiveTabId(tabId);
                      setShowPermissionManager(false);
                      setMobileSidebarOpen(false);
                    }}
                    collapsed={false}
                    onToggleCollapse={() => {}}
                    onCloseMobile={() => setMobileSidebarOpen(false)}
                  />
                </div>
              ) : role.id === 'accountant' ? (
                <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
                  <AccountantNestedSidebar
                    isMobile
                    activeTabId={activeTabId}
                    onSelectTab={(tabId) => {
                      setActiveTabId(tabId);
                      setShowPermissionManager(false);
                      setMobileSidebarOpen(false);
                    }}
                    collapsed={false}
                    onToggleCollapse={() => {}}
                    onCloseMobile={() => setMobileSidebarOpen(false)}
                  />
                </div>
              ) : role.id === 'hr' || role.id === 'hr-manager' ? (
                <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
                  <HRNestedSidebar
                    isMobile
                    activeTabId={activeTabId}
                    onSelectTab={(tabId) => {
                      setActiveTabId(tabId);
                      setShowPermissionManager(false);
                      setMobileSidebarOpen(false);
                    }}
                    collapsed={false}
                    onToggleCollapse={() => {}}
                    onCloseMobile={() => setMobileSidebarOpen(false)}
                  />
                </div>
              ) : role.id === 'librarian' ? (
                <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
                  <LibrarianNestedSidebar
                    isMobile
                    activeTabId={activeTabId}
                    onSelectTab={(tabId) => {
                      setActiveTabId(tabId);
                      setShowPermissionManager(false);
                      setMobileSidebarOpen(false);
                    }}
                    collapsed={false}
                    onToggleCollapse={() => {}}
                    onCloseMobile={() => setMobileSidebarOpen(false)}
                  />
                </div>
              ) : role.id === 'transport-manager' || role.id === 'transport' ? (
                <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
                  <TransportNestedSidebar
                    isMobile
                    activeTabId={activeTabId}
                    onSelectTab={(tabId) => {
                      setActiveTabId(tabId);
                      setShowPermissionManager(false);
                      setMobileSidebarOpen(false);
                    }}
                    collapsed={false}
                    onToggleCollapse={() => {}}
                    onCloseMobile={() => setMobileSidebarOpen(false)}
                  />
                </div>
              ) : role.id === 'receptionist' ? (
                <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
                  <ReceptionistNestedSidebar
                    isMobile
                    activeTabId={activeTabId}
                    onSelectTab={(tabId) => {
                      setActiveTabId(tabId);
                      setShowPermissionManager(false);
                      setMobileSidebarOpen(false);
                    }}
                    collapsed={false}
                    onToggleCollapse={() => {}}
                    onCloseMobile={() => setMobileSidebarOpen(false)}
                  />
                </div>
              ) : (
                <nav className="space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto">
                  {role.navItems.map((item) => {
                    const IconComp = NAV_ICON_MAP[item.icon] || LayoutDashboard;
                    const isActive = activeTabId === item.id && !showPermissionManager;
                    const isAllowed = isNavAllowed(role.id, item);

                    return (
                      <button
                        key={item.id}
                        disabled={!isAllowed}
                        onClick={() => {
                          setActiveTabId(item.id);
                          setShowPermissionManager(false);
                          setMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left ${
                          isActive
                            ? 'bg-white text-slate-900 font-bold'
                            : isAllowed
                            ? 'text-white/80 hover:bg-white/10'
                            : 'text-white/30 cursor-not-allowed opacity-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <IconComp className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {!isAllowed && <Lock className="w-3 h-3 text-white/40" />}
                      </button>
                    );
                  })}
                </nav>
              )}
            </div>

            <button
              onClick={() => {
                setMobileSidebarOpen(false);
                onExitWorkspace();
              }}
              className="flex items-center gap-2 p-2 rounded text-xs font-semibold text-white/90 hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Role Selection</span>
            </button>
          </div>
        </div>
      )}

      {/* MAIN VIEWPORT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP APPLICATION BAR */}
        <header
          className="h-16 px-4 sm:px-6 border-b flex items-center justify-between gap-4 sticky top-0 z-10 backdrop-blur-md transition-colors"
          style={{
            backgroundColor: 'rgba(var(--color-surface), 0.94)',
            borderColor: 'var(--color-border)',
          }}
        >
          {/* Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-md border"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              aria-label="Open mobile navigation"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 text-xs font-medium truncate text-slate-500">
              <span className="font-semibold" style={{ color: 'var(--color-text)' }}>SCHLAR</span>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <span>Workspaces</span>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <span className="font-semibold truncate" style={{ color: 'var(--color-text)' }}>
                {role.name}
              </span>
              <ChevronRight className="w-3.5 h-3.5 shrink-0 hidden sm:inline" />
              <span className="hidden sm:inline font-normal truncate">
                {showPermissionManager
                  ? 'Permission Matrix'
                  : role.id === 'admin'
                  ? activeAdminItem?.label || activeNavItem.label
                  : activeNavItem.label}
              </span>
            </div>
          </div>

          {/* Top Bar Zone 3: Global Search, Role Switcher, Notifications, Profile Menu */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Global Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
              }}
              title="Search modules and actions (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline-block text-[10px] font-mono px-1 rounded bg-black/5 dark:bg-white/10">
                ⌘K
              </kbd>
            </button>

            {/* Quick Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-colors hover:opacity-90"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
                aria-label="Switch role"
              >
                <span className="hidden sm:inline text-slate-400">Role:</span>
                <strong className="truncate max-w-[110px]">{role.name}</strong>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {roleSwitcherOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl border shadow-xl p-1 z-30 transition-colors animate-in fade-in"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <div className="p-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Switch to Workspace
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-0.5">
                    {allRoles.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          onSwitchRole(r);
                          setRoleSwitcherOpen(false);
                          setShowPermissionManager(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 text-xs rounded-md transition-colors flex items-center justify-between ${
                          r.id === role.id ? 'font-bold' : 'hover:opacity-80'
                        }`}
                        style={{
                          backgroundColor: r.id === role.id ? 'var(--color-background)' : 'transparent',
                          color: 'var(--color-text)',
                        }}
                      >
                        <span className="truncate">{r.name}</span>
                        {r.id === role.id && <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Button */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-md border transition-colors hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                />
              )}
            </button>

            {/* Profile Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-1.5 p-1.5 rounded-md border hover:opacity-90"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
                aria-label="User Profile Menu"
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  {role.name.substring(0, 2).toUpperCase()}
                </div>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {profileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 rounded-xl border shadow-xl p-1 z-30 transition-colors animate-in fade-in text-xs"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <div className="p-2 border-b mb-1" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="font-bold truncate" style={{ color: 'var(--color-text)' }}>
                      Demo Account ({role.name})
                    </div>
                    <div className="text-[10px] text-slate-400">SCHLAR Campus Operations</div>
                  </div>

                  {hasPermission(role.id, 'permissions.manage') && (
                    <button
                      onClick={() => {
                        setShowPermissionManager(true);
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2"
                      style={{ color: 'var(--color-text)' }}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                      <span>Permission Matrix</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowResetModal(true);
                      setProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-600 dark:text-amber-400 flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Benchmark Demo</span>
                  </button>

                  <button
                    onClick={() => {
                      onExitWorkspace();
                      setProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Exit to Role Selection</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* WORKSPACE PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* SHOW PERMISSION MANAGER IF TOGGLED */}
          {showPermissionManager ? (
            <PermissionManager onClose={() => setShowPermissionManager(false)} />
          ) : !isCurrentTabPermitted ? (
            /* ACCESS RESTRICTED GUARD */
            <AccessDenied
              requiredPermission={activeNavItem.requiredPermission}
              roleName={role.name}
              onReturnToOverview={() => setActiveTabId('overview')}
            />
          ) : activeTabId === 'overview' ? (
            role.id === 'admin' ? (
              <AdminDashboardOverview
                onNavigateTab={(tab) => setActiveTabId(tab)}
                onOpenAddStudent={() => setActiveTabId('students-guardians')}
                onOpenAddStaff={() => setActiveTabId('staff-directory')}
                onOpenAddClass={() => setActiveTabId('classes-sections')}
              />
            ) : role.id === 'vice_principal' || role.id === 'vice-principal' ? (
              <VPDashboardOverview onNavigateTab={(tab) => setActiveTabId(tab)} />
            ) : role.id === 'accountant' ? (
              <AccountantDashboardOverview onNavigateTab={(tab) => setActiveTabId(tab)} />
            ) : role.id === 'hr' || role.id === 'hr-manager' ? (
              <HRDashboardOverview onNavigateTab={(tab) => setActiveTabId(tab)} />
            ) : role.id === 'librarian' ? (
              <LibrarianDashboardOverview onNavigateTab={(tab) => setActiveTabId(tab)} />
            ) : role.id === 'transport-manager' || role.id === 'transport' ? (
              <TransportDashboardOverview onNavigateTab={(tab) => setActiveTabId(tab)} />
            ) : role.id === 'receptionist' ? (
              <ReceptionistDashboardOverview onNavigateTab={(tab) => setActiveTabId(tab)} />
            ) : role.id === 'exam-coordinator' || role.id === 'exam_coordinator' ? (
              <ExamCoordinatorModule initialTab={activeTabId} />
            ) : (
            /* OVERVIEW TAB FOR OTHER ROLES */
            <div>
              {/* Page Heading & Role Purpose */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded tracking-wide uppercase border"
                      style={{
                        backgroundColor: 'var(--color-subtle-accent, rgba(0,0,0,0.05))',
                        color: 'var(--color-primary)',
                        borderColor: 'var(--color-border)',
                      }}
                    >
                      {role.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      Route: {role.route}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
                    {role.name} Workspace
                  </h1>
                  <p className="text-sm mt-1 max-w-2xl leading-relaxed text-slate-500">
                    {role.description}
                  </p>
                </div>

                {/* Workspace Toolbar */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={handleSimulateRefresh}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border hover:opacity-85"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                    title="Simulate Data Refresh"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>

                  <button
                    onClick={() => setIsEmptyState(!isEmptyState)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-md border ${
                      isEmptyState ? 'bg-amber-100 text-amber-900 border-amber-300' : 'hover:opacity-85'
                    }`}
                    style={!isEmptyState ? {
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-secondary)',
                    } : {}}
                    title="Toggle Empty State View (QA Testing)"
                  >
                    {isEmptyState ? 'Populated View' : 'Test Empty State'}
                  </button>

                  <button
                    onClick={() => setNewRecordModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white rounded-md shadow-sm hover:opacity-90"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Record</span>
                  </button>
                </div>
              </div>

              {/* 4 KPI METRIC CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {role.mockStats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border transition-colors shadow-sm flex flex-col justify-between"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                    }}
                  >
                    <span className="text-xs font-medium text-slate-500 truncate">
                      {stat.label}
                    </span>

                    <div className="my-2">
                      <span
                        className="text-2xl font-extrabold tracking-tight font-mono tabular-nums"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {stat.value}
                      </span>
                    </div>

                    {stat.change && (
                      <div className="flex items-center gap-1 text-[11px] font-medium" style={{ color: 'var(--color-secondary)' }}>
                        <span>{stat.change}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* SECONDARY MODULE TAB BAR */}
              <div
                className="flex items-center gap-1 p-1 rounded-lg border w-fit mb-6 max-w-full overflow-x-auto"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                {permittedNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTabId(item.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                      activeTabId === item.id ? 'font-bold shadow-sm' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: activeTabId === item.id ? 'var(--color-background)' : 'transparent',
                      color: 'var(--color-text)',
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* SAMPLE RECORDS TABLE */}
              <div
                className="rounded-xl border transition-colors shadow-sm overflow-hidden"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div
                  className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <div>
                    <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                      {role.name} Operational Records & Task Ledger
                    </h3>
                    <p className="text-xs text-slate-500">
                      Standard workflow audit logs and active operations.
                    </p>
                  </div>

                  {/* Search and filter */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs"
                      style={{
                        backgroundColor: 'var(--color-background)',
                        borderColor: 'var(--color-border)',
                      }}
                    >
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={tableSearch}
                        onChange={(e) => setTableSearch(e.target.value)}
                        placeholder="Filter records..."
                        className="bg-transparent border-none outline-none text-xs w-32 sm:w-40"
                        style={{ color: 'var(--color-text)' }}
                      />
                    </div>

                    <div className="flex items-center gap-1 p-0.5 rounded border text-xs" style={{ borderColor: 'var(--color-border)' }}>
                      {(['all', 'active', 'pending', 'completed'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => setStatusFilter(st)}
                          className={`px-2 py-1 rounded capitalize text-[11px] font-medium ${
                            statusFilter === st ? 'bg-black/10 dark:bg-white/10 font-bold' : 'opacity-70'
                          }`}
                          style={{ color: 'var(--color-text)' }}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Table contents */}
                {isLoading ? (
                  <div className="p-8 space-y-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-1/2" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-2/3" />
                  </div>
                ) : displayRecords.length === 0 ? (
                  <div className="py-12 px-4 text-center">
                    <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--color-text)' }}>
                      No operational records found
                    </h4>
                    <p className="text-xs max-w-sm mx-auto mb-4 text-slate-500">
                      No records match the active search or the ledger has been cleared.
                    </p>
                    <button
                      onClick={() => {
                        setIsEmptyState(false);
                        setTableSearch('');
                        setStatusFilter('all');
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white rounded-lg shadow-sm"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      Reset Data View
                    </button>
                  </div>
                ) : (
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
                          <th className="py-3 px-4 font-semibold text-[10px] uppercase">Record ID</th>
                          <th className="py-3 px-4 font-semibold text-[10px] uppercase">Task / Item Title</th>
                          <th className="py-3 px-4 font-semibold text-[10px] uppercase">Category</th>
                          <th className="py-3 px-4 font-semibold text-[10px] uppercase">Status</th>
                          <th className="py-3 px-4 font-semibold text-[10px] uppercase text-right">Date Logged</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                        {displayRecords.map((item) => {
                          const statusColor =
                            item.status === 'completed'
                              ? 'var(--color-success)'
                              : item.status === 'pending'
                              ? 'var(--color-warning)'
                              : item.status === 'alert'
                              ? 'var(--color-error)'
                              : 'var(--color-primary)';

                          return (
                            <tr key={item.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                              <td className="py-3 px-4 font-mono font-medium tabular-nums" style={{ color: 'var(--color-secondary)' }}>
                                {item.id}
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-semibold block" style={{ color: 'var(--color-text)' }}>
                                  {item.title}
                                </span>
                                <span className="text-[11px] block mt-0.5 text-slate-500">
                                  {item.subtitle}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className="px-2 py-0.5 rounded text-[10px] font-medium border"
                                  style={{
                                    backgroundColor: 'var(--color-background)',
                                    borderColor: 'var(--color-border)',
                                    color: 'var(--color-text)',
                                  }}
                                >
                                  {item.tag}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: statusColor }} />
                                  <span className="capitalize font-medium text-[11px]" style={{ color: 'var(--color-text)' }}>
                                    {item.status}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right font-mono tabular-nums text-[11px] text-slate-500">
                                {item.date}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            )
          ) : role.id === 'admin' && (activeTabId === 'academics' || activeTabId === 'academics-overview' || activeTabId === 'academics-years-terms' || activeTabId === 'academics-folder') ? (
            <AcademicsOverviewModule onNavigateTab={(tab) => setActiveTabId(tab)} />
          ) : role.id === 'admin' && (activeTabId === 'classes-sections' || activeTabId === 'academics-classes' || activeTabId === 'academics-sections' || activeTabId === 'academics-subjects' || activeTabId === 'academics-assignments') ? (
            <ClassesSectionsModule />
          ) : role.id === 'admin' && activeTabId === 'academics-timetable-builder' ? (
            <TimetableBuilderTab />
          ) : role.id === 'admin' && activeTabId === 'academics-timetable-classes' ? (
            <ClassTimetableTab />
          ) : role.id === 'admin' && activeTabId === 'academics-timetable-teachers' ? (
            <TeacherTimetableTab />
          ) : role.id === 'admin' && activeTabId === 'academics-timetable-rooms' ? (
            <RoomTimetableTab />
          ) : role.id === 'admin' && activeTabId === 'academics-timetable-conflicts' ? (
            <TimetableConflictReportTab onNavigateTab={(tab) => setActiveTabId(tab)} />
          ) : role.id === 'admin' && (activeTabId === 'timetable' || activeTabId === 'academics-timetable-overview' || activeTabId === 'academics-timetable-folder') ? (
            <TimetableOverviewTab onNavigateTab={(tab) => setActiveTabId(tab)} />
          ) : role.id === 'admin' && activeTabId === 'students-attendance' ? (
            <AttendanceMonitoringModule />
          ) : role.id === 'admin' && (activeTabId === 'students-guardians' || activeTabId.startsWith('students-')) ? (
            <StudentsGuardiansModule />
          ) : role.id === 'admin' && (activeTabId === 'staff-directory' || activeTabId.startsWith('staff-')) ? (
            <StaffDirectoryModule />
          ) : role.id === 'admin' && (activeTabId === 'attendance' || activeTabId.startsWith('attendance-')) ? (
            <AttendanceMonitoringModule />
          ) : role.id === 'admin' && (activeTabId === 'admissions' || activeTabId.startsWith('admissions-')) ? (
            <AdmissionsModule onNavigateToStudent={() => setActiveTabId('students-all')} />
          ) : role.id === 'admin' && (activeTabId === 'fees-overview' || activeTabId.startsWith('fees-')) ? (
            <FeesOverviewModule />
          ) : role.id === 'admin' && (activeTabId === 'reports' || activeTabId.startsWith('reports-')) ? (
            <SchoolReportsModule />
          ) : role.id === 'admin' && (activeTabId === 'settings' || activeTabId.startsWith('config-')) ? (
            <SchoolSettingsModule initialTab={activeTabId.startsWith('config-') ? (activeTabId.replace('config-', '') as any) : 'profile'} />
          ) : role.id === 'admin' && (activeTabId === 'admin-activity' || activeTabId.startsWith('admin-activity-')) ? (
            <AdminActivityModule initialTab={activeTabId.replace('admin-activity-', '')} onNavigateTab={(tab) => setActiveTabId(tab)} />
          ) : (role.id === 'vice_principal' || role.id === 'vice-principal') && (activeTabId === 'academic-overview' || activeTabId === 'folder-academic' || activeTabId.startsWith('vp-classes') || activeTabId.startsWith('vp-subject') || activeTabId.startsWith('vp-syllabus') || activeTabId.startsWith('vp-academic-')) ? (
            <VPAcademicManagementModule initialSubTab={activeTabId} />
          ) : (role.id === 'vice_principal' || role.id === 'vice-principal') && (activeTabId === 'folder-teacher' || activeTabId.startsWith('vp-teacher') || activeTabId.startsWith('vp-assignment-completion')) ? (
            <VPTeacherCoordinationModule initialSubTab={activeTabId} />
          ) : (role.id === 'vice_principal' || role.id === 'vice-principal') && activeTabId === 'timetable' ? (
            <VPTimetableMonitoringModule />
          ) : (role.id === 'vice_principal' || role.id === 'vice-principal') && (activeTabId === 'attendance-monitoring' || activeTabId === 'vp-attendance-concerns') ? (
            <VPAttendanceMonitoringModule initialSubTab={activeTabId} />
          ) : (role.id === 'vice_principal' || role.id === 'vice-principal') && (activeTabId === 'folder-exams' || activeTabId.startsWith('vp-exam') || activeTabId.startsWith('vp-assessment') || activeTabId.startsWith('vp-marks') || activeTabId.startsWith('vp-result')) ? (
            <VPExaminationsModule initialSubTab={activeTabId} />
          ) : (role.id === 'vice_principal' || role.id === 'vice-principal') && (activeTabId === 'student-progress' || activeTabId === 'folder-support' || activeTabId.startsWith('vp-students') || activeTabId.startsWith('vp-academic-concerns') || activeTabId.startsWith('vp-intervention')) ? (
            <VPStudentProgressModule initialSubTab={activeTabId} />
          ) : (role.id === 'vice_principal' || role.id === 'vice-principal') && (activeTabId === 'folder-approvals' || activeTabId.startsWith('vp-pending-approvals') || activeTabId.startsWith('vp-completed-approvals') || activeTabId.startsWith('vp-rejected-approvals')) ? (
            <VPApprovalsModule initialSubTab={activeTabId} />
          ) : (role.id === 'vice_principal' || role.id === 'vice-principal') && (activeTabId === 'academic-reports' || activeTabId === 'folder-reports' || activeTabId.startsWith('vp-rep-')) ? (
            <VPReportsModule initialReportType={activeTabId} />
          ) : role.id === 'accountant' && activeTabId === 'acc-collection-overview' ? (
            <AccountantCollectionOverviewModule />
          ) : role.id === 'accountant' && activeTabId === 'outstanding-balances' ? (
            <AccountantOutstandingBalancesModule onNavigateToStudentAccount={() => setActiveTabId('student-fee-records')} />
          ) : role.id === 'accountant' && activeTabId === 'financial-reports' ? (
            <AccountantFinancialReportsModule />
          ) : role.id === 'accountant' && activeTabId === 'acc-activity-log' ? (
            <AccountantActivityLogModule />
          ) : role.id === 'accountant' && (activeTabId === 'fee-structure' || activeTabId === 'folder-fee-management') ? (
            <AccountantFeeStructureModule />
          ) : role.id === 'accountant' && activeTabId === 'student-fee-records' ? (
            <AccountantStudentFeeRecordsModule />
          ) : role.id === 'accountant' && activeTabId === 'acc-assign-fees' ? (
            <AccountantAssignFeesModule />
          ) : role.id === 'accountant' && activeTabId === 'concessions' ? (
            <AccountantConcessionsModule />
          ) : role.id === 'accountant' && activeTabId === 'acc-refunds-adjustments' ? (
            <AccountantRefundsAdjustmentsModule />
          ) : role.id === 'accountant' && (activeTabId === 'collect-record-fees' || activeTabId === 'folder-collections') ? (
            <AccountantCollectFeesModule />
          ) : role.id === 'accountant' && (activeTabId === 'payment-history' || activeTabId === 'receipts' || activeTabId === 'reversed-cancelled-tx') ? (
            <AccountantReceiptsModule />
          ) : role.id === 'accountant' && (activeTabId === 'reconciliation-overview' || activeTabId === 'unmatched-payments' || activeTabId === 'reconciliation-history' || activeTabId === 'folder-reconciliation') ? (
            <AccountantReconciliationModule />
          ) : (role.id === 'hr' || role.id === 'hr-manager') && (activeTabId === 'hr-staff-overview' || activeTabId === 'staff-directory' || activeTabId === 'hr-all-staff' || activeTabId === 'hr-archive' || activeTabId === 'folder-staff-records') ? (
            <HRStaffDirectoryModule onSelectStaffProfile={() => setActiveTabId('staff-profiles')} onNavigateAddStaff={() => setActiveTabId('hr-add-staff')} />
          ) : (role.id === 'hr' || role.id === 'hr-manager') && activeTabId === 'staff-profiles' ? (
            <HRStaffProfileModule onBackToDirectory={() => setActiveTabId('staff-directory')} />
          ) : (role.id === 'hr' || role.id === 'hr-manager') && activeTabId === 'hr-add-staff' ? (
            <HRAddStaffModule onSuccess={() => setActiveTabId('staff-directory')} />
          ) : (role.id === 'hr' || role.id === 'hr-manager') && (activeTabId === 'hr-departments' || activeTabId === 'hr-designations' || activeTabId === 'hr-employment-types') ? (
            <HRDepartmentsModule />
          ) : (role.id === 'hr' || role.id === 'hr-manager') && activeTabId === 'teacher-subject-assignments' ? (
            <ClassesSectionsModule />
          ) : (role.id === 'hr' || role.id === 'hr-manager') && (activeTabId === 'staff-attendance' || activeTabId === 'hr-staff-attendance' || activeTabId === 'hr-attendance-corrections' || activeTabId === 'folder-attendance-leave') ? (
            <HRStaffAttendanceModule onNavigateCorrections={() => setActiveTabId('hr-attendance-corrections')} />
          ) : (role.id === 'hr' || role.id === 'hr-manager') && (activeTabId === 'leave-management' || activeTabId.startsWith('hr-leave-')) ? (
            <HRLeaveManagementModule />
          ) : (role.id === 'hr' || role.id === 'hr-manager') && (activeTabId === 'folder-recruitment' || activeTabId.startsWith('hr-recruitment-') || activeTabId === 'hr-job-openings' || activeTabId === 'hr-candidates' || activeTabId === 'hr-interview-schedule' || activeTabId === 'hr-hiring-decisions') ? (
            <HRRecruitmentModule />
          ) : (role.id === 'hr' || role.id === 'hr-manager') && (activeTabId === 'folder-documents' || activeTabId === 'hr-staff-documents' || activeTabId === 'hr-document-categories' || activeTabId === 'hr-document-expiry') ? (
            <HRDocumentsModule />
          ) : (role.id === 'hr' || role.id === 'hr-manager') && (activeTabId === 'hr-reports' || activeTabId === 'folder-reports' || activeTabId.startsWith('hr-rep-')) ? (
            <HRReportsModule />
          ) : role.id === 'librarian' && activeTabId === 'book-catalogue' ? (
            <LibrarianCatalogueModule />
          ) : role.id === 'librarian' && activeTabId === 'book-inventory' ? (
            <LibrarianInventoryModule />
          ) : role.id === 'librarian' && (activeTabId === 'issue-books' || activeTabId === 'folder-circulation') ? (
            <LibrarianIssueBookModule />
          ) : role.id === 'librarian' && activeTabId === 'return-books' ? (
            <LibrarianReturnBookModule />
          ) : role.id === 'librarian' && activeTabId === 'reservations' ? (
            <LibrarianRenewalsReservationsModule />
          ) : role.id === 'librarian' && (activeTabId === 'overdue-books' || activeTabId === 'lib-stock-verification' || activeTabId === 'folder-management') ? (
            <LibrarianFinesStockModule />
          ) : role.id === 'librarian' && activeTabId === 'lib-members' ? (
            <LibrarianMembersModule />
          ) : role.id === 'librarian' && activeTabId === 'lib-categories' ? (
            <LibrarianCategoriesModule />
          ) : role.id === 'librarian' && activeTabId === 'library-reports' ? (
            <LibrarianReportsModule />
          ) : (role.id === 'transport-manager' || role.id === 'transport') && activeTabId === 'routes' ? (
            <TransportRoutesModule />
          ) : (role.id === 'transport-manager' || role.id === 'transport') && activeTabId === 'transport-assignments' ? (
            <TransportAssignmentsModule />
          ) : (role.id === 'transport-manager' || role.id === 'transport') && (activeTabId === 'vehicles' || activeTabId === 'folder-fleet') ? (
            <TransportVehiclesModule />
          ) : (role.id === 'transport-manager' || role.id === 'transport') && activeTabId === 'drivers' ? (
            <TransportDriversModule />
          ) : (role.id === 'transport-manager' || role.id === 'transport') && activeTabId === 'vehicle-maintenance' ? (
            <TransportMaintenanceModule />
          ) : (role.id === 'transport-manager' || role.id === 'transport') && (activeTabId === 'transport-boarding' || activeTabId === 'folder-operations') ? (
            <TransportAttendanceModule />
          ) : (role.id === 'transport-manager' || role.id === 'transport') && (activeTabId === 'transport-expenses' || activeTabId === 'transport-notices') ? (
            <TransportExpensesIncidentsModule />
          ) : (role.id === 'transport-manager' || role.id === 'transport') && activeTabId === 'transport-reports' ? (
            <TransportReportsModule />
          ) : role.id === 'receptionist' && (activeTabId === 'visitor-register' || activeTabId === 'visit-history' || activeTabId === 'folder-visitors') ? (
            <ReceptionistVisitorDeskModule />
          ) : role.id === 'receptionist' && activeTabId === 'visitor-directory' ? (
            <ReceptionistVisitorDirectoryModule />
          ) : role.id === 'receptionist' && (activeTabId === 'admissions-enquiries' || activeTabId === 'enquiry-followups' || activeTabId === 'folder-enquiries') ? (
            <ReceptionistEnquiriesModule />
          ) : role.id === 'receptionist' && (activeTabId === 'appointments' || activeTabId === 'appointment-history' || activeTabId === 'folder-appointments') ? (
            <ReceptionistAppointmentsModule />
          ) : role.id === 'receptionist' && (activeTabId === 'communications' || activeTabId === 'folder-communications') ? (
            <ReceptionistCommunicationsModule />
          ) : role.id === 'receptionist' && activeTabId === 'parent-enquiries' ? (
            <ReceptionistRequestsModule />
          ) : role.id === 'receptionist' && (activeTabId === 'reception-student-lookup' || activeTabId === 'reception-parent-lookup' || activeTabId === 'reception-staff-lookup' || activeTabId === 'folder-directory') ? (
            <ReceptionistDirectoryLookupModule />
          ) : role.id === 'receptionist' && (activeTabId === 'document-requests' || activeTabId === 'folder-documents') ? (
            <ReceptionistDocumentsModule />
          ) : role.id === 'receptionist' && activeTabId === 'front-office-records' ? (
            <ReceptionistReportsModule />
          ) : role.id === 'exam-coordinator' || role.id === 'exam_coordinator' ? (
            <ExamCoordinatorModule initialTab={activeTabId} />
          ) : (
            /* CONTEXTUAL MODULE PLACEHOLDER (FOR OTHER ROLES) */
            <div
              className="p-8 rounded-2xl border transition-colors shadow-sm max-w-3xl"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase mb-2" style={{ color: 'var(--color-primary)' }}>
                <span>{role.name} Workspace</span>
                <span>·</span>
                <span>Module {activeNavItem.id}</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--color-text)' }}>
                {activeNavItem.label}
              </h2>
              <p className="text-sm leading-relaxed mb-6 text-slate-500">
                {activeNavItem.description}. This module's navigation, role-based authorization guard
                {activeNavItem.requiredPermission && (
                  <>
                    {' '}
                    (enforced by <code className="font-mono text-xs px-1 py-0.5 rounded bg-black/5 dark:bg-white/10 text-slate-700 dark:text-slate-300">{activeNavItem.requiredPermission}</code>)
                  </>
                )}
                , and responsive data shell are active and synchronized with Greenfield International School operations.
              </p>

              {activeNavItem.plannedFeatures && (
                <div className="p-4 rounded-xl border bg-black/[0.02] dark:bg-white/[0.02] space-y-2 mb-6" style={{ borderColor: 'var(--color-border)' }}>
                  <span className="text-xs font-bold block" style={{ color: 'var(--color-text)' }}>
                    Planned Capabilities for {activeNavItem.label}:
                  </span>
                  <ul className="text-xs space-y-1 list-disc pl-5 text-slate-500">
                    {activeNavItem.plannedFeatures.map((feat, i) => (
                      <li key={i}>{feat}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTabId('overview')}
                  className="px-4 py-2 text-xs font-bold text-white rounded-lg shadow-sm"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  Return to Overview
                </button>

                <button
                  onClick={onOpenSearch}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg border text-slate-700 dark:text-slate-200"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  Search Permitted Modules
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* NEW RECORD MODAL */}
      {newRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <form
            onSubmit={handleCreateRecord}
            className="w-full max-w-md rounded-xl border p-6 shadow-xl transition-colors"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                  Add Record to {role.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setNewRecordModalOpen(false)}
                className="p-1 rounded hover:opacity-75"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Record Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Schedule Audit, Requisition Voucher"
                  className="w-full px-3 py-2 text-xs rounded border outline-none"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Description / Subtitle
                </label>
                <input
                  type="text"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  placeholder="Details regarding this record..."
                  className="w-full px-3 py-2 text-xs rounded border outline-none"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                  Category Tag
                </label>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded border outline-none"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  type="button"
                  onClick={() => setNewRecordModalOpen(false)}
                  className="px-3 py-1.5 font-medium rounded-lg border text-slate-500"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="px-4 py-1.5 font-bold text-white rounded-lg shadow-sm hover:opacity-95 disabled:opacity-50"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  Commit Record
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <ResetDemoModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
      />
    </div>
  );
};
