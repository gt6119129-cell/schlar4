import React, { useState, useEffect, useMemo } from 'react';
import { AdminNavItem } from '../../../config/adminNavigation';
import { TEACHER_NAVIGATION } from '../../../config/teacherNavigation';
import { usePermissions } from '../../../context/PermissionContext';
import {
  ChevronDown,
  ChevronRight,
  Search,
  LayoutDashboard,
  Users,
  CalendarDays,
  CheckSquare,
  FileCheck,
  Award,
  BookOpen,
  Building2,
  BookMarked,
  FileText,
  Bookmark,
  Library,
  BookOpenCheck,
  Clock,
  ClipboardCheck,
  Bell,
  Mail,
  Settings,
  UserCheck,
  X,
} from 'lucide-react';

interface TeacherNestedSidebarProps {
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  Users,
  CalendarDays,
  CheckSquare,
  FileCheck,
  Award,
  BookOpen,
  Building2,
  BookMarked,
  FileText,
  Bookmark,
  Library,
  BookOpenCheck,
  Clock,
  ClipboardCheck,
  Bell,
  Mail,
  Settings,
  UserCheck,
};

export const TeacherNestedSidebar: React.FC<TeacherNestedSidebarProps> = ({
  activeTabId,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  isMobile,
  onCloseMobile,
}) => {
  const { hasPermission } = usePermissions();
  const [searchQuery, setSearchQuery] = useState('');

  // Keep track of which folders are expanded - all closed by default
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  // Filter sections by search query and permission
  const filterItem = (item: AdminNavItem): AdminNavItem | null => {
    if (item.requiredPermission && !hasPermission(item.requiredPermission)) {
      return null;
    }

    if (!searchQuery.trim()) {
      return item;
    }

    const query = searchQuery.toLowerCase();
    const matchesSelf =
      item.label.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query));

    if (item.children && item.children.length > 0) {
      const filteredChildren = item.children
        .map(filterItem)
        .filter((child): child is AdminNavItem => child !== null);

      if (filteredChildren.length > 0 || matchesSelf) {
        return {
          ...item,
          children: filteredChildren,
        };
      }
      return null;
    }

    return matchesSelf ? item : null;
  };

  const filteredSections = useMemo(() => {
    return TEACHER_NAVIGATION.map(filterItem).filter(
      (item): item is AdminNavItem => item !== null
    );
  }, [searchQuery, hasPermission]);

  // Check if an item or any descendant is active
  const isItemOrChildActive = (item: AdminNavItem): boolean => {
    if (item.id === activeTabId) return true;
    if (item.children) {
      return item.children.some(isItemOrChildActive);
    }
    return false;
  };

  const renderNavNode = (item: AdminNavItem, depth = 0) => {
    const isFolder = item.isFolder || (item.children && item.children.length > 0);
    const isExpanded = !!expandedFolders[item.id];
    const isDirectActive = activeTabId === item.id;
    const childIsActive = !isDirectActive && isItemOrChildActive(item);
    const IconComponent = item.icon ? ICON_MAP[item.icon] || LayoutDashboard : LayoutDashboard;

    if (isFolder) {
      if (collapsed) {
        return (
          <div key={item.id} className="relative group mb-1">
            <button
              onClick={() => toggleFolder(item.id)}
              className={`w-full flex items-center justify-center p-2 rounded-lg transition-all focus:ring-2 focus:ring-white/40 focus:outline-hidden ${
                childIsActive
                  ? 'bg-white/20 text-white font-bold'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              title={item.label}
              aria-label={item.label}
              aria-expanded={isExpanded}
            >
              <IconComponent className="w-5 h-5" />
            </button>
            <div className="absolute left-full ml-2 top-0 px-2 py-1 bg-slate-900 text-white text-xs rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-slate-700">
              {item.label}
            </div>
          </div>
        );
      }

      return (
        <div key={item.id} className="mb-1 select-none">
          <div
            onClick={() => toggleFolder(item.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFolder(item.id);
              }
            }}
            aria-expanded={isExpanded}
            aria-label={`${item.label} folder`}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all focus:ring-2 focus:ring-white/40 focus:outline-hidden ${
              childIsActive
                ? 'text-white bg-white/15'
                : 'text-white/75 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <IconComponent
                className={`w-4 h-4 shrink-0 transition-colors ${
                  childIsActive ? 'text-white' : 'text-white/60'
                }`}
              />
              <span className="truncate tracking-wide">{item.label}</span>
              {item.badge !== undefined && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                  {item.badge}
                </span>
              )}
            </div>
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(item.id);
              }}
              className="p-1 rounded-sm hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              aria-label={isExpanded ? `Collapse ${item.label}` : `Expand ${item.label}`}
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {isExpanded && item.children && (
            <div className="mt-0.5 ml-3 pl-2.5 border-l border-white/15 space-y-0.5">
              {item.children.map((child) => renderNavNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    // Leaf direct link or subpage item
    if (collapsed) {
      return (
        <div key={item.id} className="relative group mb-1">
          <button
            onClick={() => {
              onSelectTab(item.id);
              if (isMobile && onCloseMobile) onCloseMobile();
            }}
            className={`w-full flex items-center justify-center p-2 rounded-lg transition-all focus:ring-2 focus:ring-white/40 focus:outline-hidden ${
              isDirectActive
                ? 'bg-white text-slate-900 font-bold shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            title={item.label}
            aria-label={item.label}
            aria-current={isDirectActive ? 'page' : undefined}
          >
            <IconComponent className="w-5 h-5" />
          </button>
          <div className="absolute left-full ml-2 top-0 px-2 py-1 bg-slate-900 text-white text-xs rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-slate-700">
            {item.label}
          </div>
        </div>
      );
    }

    return (
      <button
        key={item.id}
        onClick={() => {
          onSelectTab(item.id);
          if (isMobile && onCloseMobile) onCloseMobile();
        }}
        aria-current={isDirectActive ? 'page' : undefined}
        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left focus:ring-2 focus:ring-white/40 focus:outline-hidden ${
          isDirectActive
            ? 'bg-white text-slate-900 font-bold shadow-xs'
            : 'text-white/80 hover:text-white hover:bg-white/10'
        }`}
        style={
          isDirectActive
            ? {
                backgroundColor: '#FFFFFF',
                color: 'var(--color-primary)',
              }
            : undefined
        }
      >
        <div className="flex items-center gap-2 min-w-0">
          <IconComponent
            className={`w-4 h-4 shrink-0 ${
              isDirectActive ? 'text-primary' : 'text-white/60'
            }`}
          />
          <span className="truncate">{item.label}</span>
        </div>
        {item.badge !== undefined && (
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              isDirectActive
                ? 'bg-primary/20 text-primary'
                : 'bg-white/20 text-white'
            }`}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full select-none">
      {/* Search Input for Expanded Sidebar */}
      {!collapsed && (
        <div className="p-2.5 pb-1">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search classroom modules..."
              className="w-full pl-8 pr-7 py-1.5 bg-white/10 border border-white/15 rounded-lg text-xs text-white placeholder-white/40 focus:outline-hidden focus:ring-2 focus:ring-white/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Navigation Tree */}
      <nav
        className="flex-1 overflow-y-auto px-2 py-2 space-y-1 custom-scrollbar focus:outline-hidden"
        role="navigation"
        aria-label="Teacher Navigation"
      >
        {searchQuery.trim() ? (
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-white/50 px-2 py-1">
              Search Results ({filteredSections.length})
            </div>
            {filteredSections.map((section) => renderNavNode(section, 0))}
          </div>
        ) : (
          <>
            {/* DIRECT ACCESS (Direct links — no submenu) */}
            <div className="space-y-0.5">
              {!collapsed && (
                <div className="text-[10px] uppercase font-bold tracking-wider text-white/50 px-2.5 pt-1 pb-1">
                  Daily Classroom Links
                </div>
              )}
              {filteredSections
                .filter((sec) => !sec.isFolder && (!sec.children || sec.children.length === 0))
                .map((item) => renderNavNode(item, 0))}
            </div>

            {/* DIVIDER */}
            <div className="my-2 border-t border-white/10 mx-2" />

            {/* MANAGEMENT MODULES (Expandable folders) */}
            <div className="space-y-0.5">
              {!collapsed && (
                <div className="text-[10px] uppercase font-bold tracking-wider text-white/50 px-2.5 pt-1 pb-1 flex items-center justify-between">
                  <span>Teaching & Records</span>
                  <span className="text-[9px] text-white/40 font-normal">Folders</span>
                </div>
              )}
              {filteredSections
                .filter((sec) => sec.isFolder || (sec.children && sec.children.length > 0))
                .map((folder) => renderNavNode(folder, 0))}
            </div>
          </>
        )}
      </nav>
    </div>
  );
};
