import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { PermissionProvider } from './context/PermissionContext';
import { SchoolDataProvider } from './context/SchoolDataContext';
import { SCHLAR_ROLES, RoleConfig, PlatformType } from './config/roles';
import { ThemePalette, DesignTokens } from './types/theme';
import { INITIAL_NOTIFICATIONS, DemoNotification } from './data/mockData';
import { Header } from './components/common/Header';
import { WelcomeHero } from './components/landing/WelcomeHero';
import { RoleSelectionGrid } from './components/landing/RoleSelectionGrid';
import { ThemeGallery } from './components/themes/ThemeGallery';
import { ThemeCustomizer } from './components/themes/ThemeCustomizer';
import { ArchitectureSection } from './components/common/ArchitectureSection';
import { SharedWorkspaceShell } from './components/workspace/SharedWorkspaceShell';
import { PlatformSelectionModal } from './components/common/PlatformSelectionModal';
import { ParentMobileShell } from './components/parent/ParentMobileShell';
import { TeacherWebPortal } from './components/teacher/TeacherWebPortal';
import { TeacherMobileShell } from './components/teacher/TeacherMobileShell';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import {
  SavePaletteModal,
  ExportPaletteModal,
  ImportPaletteModal,
  RenamePaletteModal,
  DeleteConfirmModal,
} from './components/themes/CustomPaletteDialogs';
import { CheckCircle2 } from 'lucide-react';

function SchlarApp() {
  const {
    saveCustomPalette,
    renameCustomPalette,
    deleteCustomPalette,
    customPalettes,
    selectPalette,
    activePalette,
  } = useTheme();

  // Active role workspace state
  const [selectedRole, setSelectedRole] = useState<RoleConfig | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('web');

  // Platform selection modal for Parent & Teacher
  const [platformModalRole, setPlatformModalRole] = useState<RoleConfig | null>(null);

  // Active section for header highlighting on landing
  const [activeNavSection, setActiveNavSection] = useState<string>('workspaces');

  // Global Search modal
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState<DemoNotification[]>(INITIAL_NOTIFICATIONS);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  // Customizer target palette
  const [customizerTargetPalette, setCustomizerTargetPalette] = useState<ThemePalette | undefined>(undefined);

  // Modal dialog states
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [paletteToSaveDraft, setPaletteToSaveDraft] = useState<{
    name: string;
    tokens: DesignTokens;
    id?: string;
  } | null>(null);

  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [paletteToExport, setPaletteToExport] = useState<ThemePalette | null>(null);

  const [importModalOpen, setImportModalOpen] = useState(false);

  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [paletteToRename, setPaletteToRename] = useState<ThemePalette | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [paletteToDelete, setPaletteToDelete] = useState<ThemePalette | null>(null);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // 1. URL Hash routing synchronization
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (!hash) {
        setSelectedRole(null);
        return;
      }
      const params = new URLSearchParams(hash);
      const roleId = params.get('role');
      const platform = (params.get('platform') as PlatformType) || 'web';

      if (roleId) {
        const found = SCHLAR_ROLES.find((r) => r.id === roleId);
        if (found) {
          setSelectedRole(found);
          setSelectedPlatform(found.platforms.includes(platform) ? platform : 'web');
        } else {
          // Safe fallback for invalid role ID
          setSelectedRole(null);
          window.location.hash = '';
        }
      }
    };

    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  // Update hash when role/platform changes
  const updateRoute = (role: RoleConfig | null, platform: PlatformType = 'web') => {
    if (!role) {
      window.location.hash = '';
      setSelectedRole(null);
    } else {
      window.location.hash = `role=${role.id}&platform=${platform}`;
      setSelectedRole(role);
      setSelectedPlatform(platform);
    }
  };

  // Keyboard shortcut listener for Global Search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (selectedRole) {
          setSearchModalOpen((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRole]);

  // Handle clicking a role in the grid
  const handleSelectRoleFromGrid = (role: RoleConfig) => {
    if (role.id === 'parent') {
      // Prompt 9: Parent experience is strictly mobile-app-only
      updateRoute(role, 'mobile');
    } else if (role.id === 'teacher') {
      // Step 3 & 4 of Part 3.2: Show platform-selection screen for Teacher
      setPlatformModalRole(role);
    } else {
      // Other 8 roles: Open Web Workspace directly
      updateRoute(role, 'web');
    }
  };

  const handlePlatformSelected = (platform: PlatformType) => {
    if (platformModalRole) {
      updateRoute(platformModalRole, platform);
      setPlatformModalRole(null);
    }
  };

  // Notifications helpers
  const roleNotifications = selectedRole
    ? notifications.filter((n) => n.roleId === selectedRole.id)
    : notifications;

  const unreadCount = roleNotifications.filter((n) => !n.read).length;

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleMarkAllRead = () => {
    if (!selectedRole) return;
    setNotifications((prev) =>
      prev.map((n) => (n.roleId === selectedRole.id ? { ...n, read: true } : n))
    );
  };

  // Section scroll helpers on landing
  const scrollToSection = (sectionId: string) => {
    setActiveNavSection(sectionId);
    if (sectionId === 'welcome') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenCustomizer = (palette?: ThemePalette) => {
    setCustomizerTargetPalette(palette || activePalette);
    scrollToSection('customizer');
  };

  const handleSavePaletteRequest = (draft: { name: string; tokens: DesignTokens; id?: string }) => {
    setPaletteToSaveDraft(draft);
    setSaveModalOpen(true);
  };

  const handleConfirmSave = (name: string, tokens: DesignTokens, overwriteId?: string) => {
    const result = saveCustomPalette(name, tokens, overwriteId);
    if (result.success) {
      selectPalette(result.id);
      showToast(`Custom palette "${name}" successfully saved and activated.`);
    } else {
      showToast(result.error || 'Failed to save palette.');
    }
  };

  const handleExportPalette = (palette: ThemePalette) => {
    setPaletteToExport(palette);
    setExportModalOpen(true);
  };

  const handleRenamePalette = (palette: ThemePalette) => {
    setPaletteToRename(palette);
    setRenameModalOpen(true);
  };

  const handleConfirmRename = (id: string, newName: string) => {
    const result = renameCustomPalette(id, newName);
    if (result.success) {
      showToast(`Palette renamed to "${newName}".`);
    } else {
      showToast(result.error || 'Failed to rename palette.');
    }
  };

  const handleDeletePalette = (palette: ThemePalette) => {
    setPaletteToDelete(palette);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = (id: string) => {
    const result = deleteCustomPalette(id);
    if (result.success) {
      showToast('Custom palette deleted successfully.');
    } else {
      showToast(result.error || 'Failed to delete palette.');
    }
  };

  const handleImportSuccess = (palette: ThemePalette) => {
    const res = saveCustomPalette(palette.name, palette.tokens);
    if (res.success) {
      selectPalette(res.id);
      showToast(`Palette "${palette.name}" imported and applied.`);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col transition-colors selection:bg-slate-300 dark:selection:bg-slate-700"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
      }}
    >
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-2xl animate-in slide-in-from-bottom-5 duration-200 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* RENDER WORKSPACES OR MAIN LANDING */}
      {selectedRole ? (
        <>
          {/* 1. PARENT EXPERIENCE (Strictly Mobile-App-Only) */}
          {selectedRole.id === 'parent' ? (
            <ParentMobileShell
              role={selectedRole}
              onExitWorkspace={() => updateRoute(null)}
              onSwitchToWeb={() => {}}
              onOpenNotifications={() => setNotificationDrawerOpen(true)}
              unreadNotificationsCount={unreadCount}
            />
          ) : /* 2. TEACHER EXPERIENCES */
          selectedRole.id === 'teacher' ? (
            selectedPlatform === 'mobile' ? (
              <TeacherMobileShell
                role={selectedRole}
                onExitWorkspace={() => updateRoute(null)}
                onSwitchToWeb={() => updateRoute(selectedRole, 'web')}
                onOpenNotifications={() => setNotificationDrawerOpen(true)}
                unreadNotificationsCount={unreadCount}
              />
            ) : (
              <TeacherWebPortal
                role={selectedRole}
                onExitWorkspace={() => updateRoute(null)}
                onSwitchToMobile={() => updateRoute(selectedRole, 'mobile')}
                onOpenSearch={() => setSearchModalOpen(true)}
                onOpenNotifications={() => setNotificationDrawerOpen(true)}
                unreadNotificationsCount={unreadCount}
              />
            )
          ) : (
            /* 3. OTHER 8 WEB WORKSPACES */
            <SharedWorkspaceShell
              role={selectedRole}
              onExitWorkspace={() => updateRoute(null)}
              onSwitchRole={(targetRole) => {
                if (targetRole.id === 'parent') {
                  updateRoute(targetRole, 'mobile');
                } else if (targetRole.id === 'teacher') {
                  setPlatformModalRole(targetRole);
                } else {
                  updateRoute(targetRole, 'web');
                }
              }}
              allRoles={SCHLAR_ROLES}
              onOpenSearch={() => setSearchModalOpen(true)}
              onOpenNotifications={() => setNotificationDrawerOpen(true)}
              unreadNotificationsCount={unreadCount}
            />
          )}

          {/* Global Search Modal */}
          <GlobalSearchModal
            isOpen={searchModalOpen}
            onClose={() => setSearchModalOpen(false)}
            currentRole={selectedRole}
            onSelectNavItem={(navItemId) => {
              showToast(`Navigated to module: ${navItemId}`);
            }}
          />

          {/* Notifications Drawer */}
          <NotificationDrawer
            isOpen={notificationDrawerOpen}
            onClose={() => setNotificationDrawerOpen(false)}
            notifications={roleNotifications}
            onToggleRead={handleToggleRead}
            onMarkAllRead={handleMarkAllRead}
            currentRoleName={selectedRole.name}
          />
        </>
      ) : (
        /* MAIN LANDING & ROLE SELECTION */
        <>
          <Header
            activeSection={activeNavSection}
            onNavigateSection={scrollToSection}
          />

          <main className="flex-1">
            {/* 1. Welcome Hero */}
            <WelcomeHero
              onSelectRoleScroll={() => scrollToSection('workspaces')}
              onExploreThemesScroll={() => scrollToSection('themes')}
            />

            {/* 2. Choose Your Workspace (All 10 roles) */}
            <RoleSelectionGrid
              onSelectRole={handleSelectRoleFromGrid}
            />

            {/* 3. Choose Your Theme (12 Presets + Custom Palettes) */}
            <ThemeGallery
              onOpenCustomizer={handleOpenCustomizer}
              onExportPalette={handleExportPalette}
              onRenamePalette={handleRenamePalette}
              onDeletePalette={handleDeletePalette}
            />

            {/* 4. Customize Your Theme (Method A, B, C & Live Mini Preview) */}
            <ThemeCustomizer
              onSavePaletteRequest={handleSavePaletteRequest}
              targetPalette={customizerTargetPalette}
            />

            {/* 5. System Foundation & Architecture Section */}
            <ArchitectureSection />
          </main>

          {/* Clean Editorial Footer */}
          <footer
            className="border-t py-8 px-4 sm:px-6 lg:px-8 transition-colors"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                <strong style={{ color: 'var(--color-text)' }}>SCHLAR</strong>
                <span aria-hidden="true">·</span>
                <span>School Management Platform</span>
                <span aria-hidden="true">·</span>
                <span>Comprehensive School Architecture</span>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                <span>10 Roles</span>
                <span>·</span>
                <span>Web & Mobile Experiences</span>
                <span>·</span>
                <span>RBAC Engine</span>
                <span>·</span>
                <span>12 Palettes</span>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Platform Selection Modal for Parent & Teacher */}
      <PlatformSelectionModal
        isOpen={platformModalRole !== null}
        role={platformModalRole}
        onSelectPlatform={handlePlatformSelected}
        onCancel={() => setPlatformModalRole(null)}
      />

      {/* Custom Theme Modals (Preserved from Prompt 1) */}
      <SavePaletteModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        draft={paletteToSaveDraft}
        existingCustomPalettes={customPalettes}
        onConfirmSave={handleConfirmSave}
      />

      <ExportPaletteModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        palette={paletteToExport}
      />

      <ImportPaletteModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />

      <RenamePaletteModal
        isOpen={renameModalOpen}
        onClose={() => setRenameModalOpen(false)}
        palette={paletteToRename}
        onConfirmRename={handleConfirmRename}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        palette={paletteToDelete}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PermissionProvider>
        <SchoolDataProvider>
          <SchlarApp />
        </SchoolDataProvider>
      </PermissionProvider>
    </ThemeProvider>
  );
}
