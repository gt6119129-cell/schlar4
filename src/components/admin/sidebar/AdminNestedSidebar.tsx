import React, { useState, useEffect, useMemo } from 'react';
import {
  AdminNavItem,
  ADMIN_NAVIGATION_SECTIONS,
} from '../../../config/adminNavigation';
import { usePermissions } from '../../../context/PermissionContext';
import {
  ChevronDown,
  ChevronRight,
  Search,
  LayoutDashboard,
  GraduationCap,
  BookOpenCheck,
  CalendarRange,
  Building2,
  Layers,
  BookMarked,
  CheckSquare,
  CalendarDays,
  Calendar,
  SlidersHorizontal,
  FileText,
  UserCheck,
  Building,
  AlertTriangle,
  Users,
  FileSpreadsheet,
  Plus,
  Bookmark,
  ArrowRightLeft,
  CheckCircle2,
  Archive,
  HeartHandshake,
  Award,
  CalendarCheck2,
  Clock,
  HelpCircle,
  CalendarClock,
  BadgeCheck,
  UserPlus,
  Receipt,
  CreditCard,
  AlertCircle,
  PieChart,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Lock,
  X,
} from 'lucide-react';

interface AdminNestedSidebarProps {
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  GraduationCap,
  BookOpenCheck,
  CalendarRange,
  Building2,
  Layers,
  BookMarked,
  CheckSquare,
  CalendarDays,
  Calendar,
  SlidersHorizontal,
  FileText,
  UserCheck,
  Building,
  AlertTriangle,
  Users,
  FileSpreadsheet,
  Plus,
  Bookmark,
  ArrowRightLeft,
  CheckCircle2,
  Archive,
  HeartHandshake,
  Award,
  CalendarCheck2,
  Clock,
  HelpCircle,
  CalendarClock,
  BadgeCheck,
  UserPlus,
  Receipt,
  CreditCard,
  AlertCircle,
  PieChart,
  Settings,
  ShieldAlert,
  ShieldCheck,
};

export const AdminNestedSidebar: React.FC<AdminNestedSidebarProps> = ({
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

  const toggleFolder = (folderId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  // Filter sections by search query if user types in search box
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return ADMIN_NAVIGATION_SECTIONS;
    const q = searchQuery.toLowerCase().trim();

    const filterItem = (item: AdminNavItem): AdminNavItem | null => {
      const matchSelf = item.label.toLowerCase().includes(q) || (item.description && item.description.toLowerCase().includes(q));
      if (item.children) {
        const filteredChildren = item.children
          .map(filterItem)
          .filter((c): c is AdminNavItem => c !== null);
        if (filteredChildren.length > 0 || matchSelf) {
          return {
            ...item,
            children: filteredChildren.length > 0 ? filteredChildren : item.children,
          };
        }
      }
      return matchSelf ? item : null;
    };

    return ADMIN_NAVIGATION_SECTIONS.map(filterItem).filter((s): s is AdminNavItem => s !== null);
  }, [searchQuery]);

  const renderIcon = (iconName?: string, className: string = 'w-4 h-4 shrink-0') => {
    const IconComp = (iconName && ICON_MAP[iconName]) || FileText;
    return <IconComp className={className} />;
  };

  // Recursive renderer for navigation items
  const renderNavNode = (item: AdminNavItem, depth: number = 0) => {
    const isFolder = item.isFolder && item.children && item.children.length > 0;
    const isExpanded = !!expandedFolders[item.id] || searchQuery.trim().length > 0;
    const isActive = activeTabId === item.id;
    const isPermitted = !item.requiredPermission || hasPermission('admin', item.requiredPermission);

    // If folder has children, check if any child is active
    const hasActiveChild = (node: AdminNavItem): boolean => {
      if (node.id === activeTabId) return true;
      if (node.children) return node.children.some(hasActiveChild);
      return false;
    };
    const childIsActive = isFolder && item.children ? item.children.some(hasActiveChild) : false;

    if (isFolder) {
      if (collapsed && !isMobile) {
        return (
          <div key={item.id} className="py-1">
            <button
              onClick={() => toggleFolder(item.id)}
              className={`w-full flex items-center justify-center p-2 rounded-lg text-xs transition-colors ${
                childIsActive ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              title={item.label}
            >
              {renderIcon(item.icon, 'w-4 h-4')}
            </button>
            {isExpanded && item.children && (
              <div className="space-y-1 mt-1 pl-1 border-l border-white/10">
                {item.children.map((child) => renderNavNode(child, depth + 1))}
              </div>
            )}
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
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors focus:outline-hidden focus:ring-2 focus:ring-white/40 ${
              childIsActive
                ? 'text-white bg-white/10'
                : 'text-white/80 hover:text-white hover:bg-white/5'
            }`}
            style={{ paddingLeft: `${Math.max(10, depth * 14 + 10)}px` }}
          >
            <div className="flex items-center gap-2 truncate">
              {renderIcon(item.icon, 'w-3.5 h-3.5 text-white/70')}
              <span className="truncate tracking-wide">{item.label}</span>
            </div>
            <button
              type="button"
              onClick={(e) => toggleFolder(item.id, e)}
              className="p-0.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors focus:outline-hidden focus:ring-2 focus:ring-white/40"
              aria-label={isExpanded ? `Collapse ${item.label}` : `Expand ${item.label}`}
              aria-expanded={isExpanded}
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {isExpanded && item.children && (
            <div className="mt-0.5 space-y-0.5">
              {item.children.map((child) => renderNavNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    // Leaf item
    if (collapsed && !isMobile) {
      return (
        <button
          key={item.id}
          onClick={() => {
            if (isPermitted) onSelectTab(item.id);
          }}
          disabled={!isPermitted}
          title={item.label}
          aria-label={item.label}
          aria-current={isActive ? 'page' : undefined}
          className={`w-full flex items-center justify-center p-2 rounded-lg text-xs transition-colors focus:outline-hidden focus:ring-2 focus:ring-white/40 ${
            isActive
              ? 'bg-white text-slate-900 font-bold shadow-sm'
              : isPermitted
              ? 'text-white/75 hover:text-white hover:bg-white/10'
              : 'text-white/30 cursor-not-allowed opacity-50'
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
          {renderIcon(item.icon, 'w-4 h-4')}
        </button>
      );
    }

    return (
      <button
        key={item.id}
        onClick={() => {
          if (isPermitted) {
            onSelectTab(item.id);
            if (isMobile && onCloseMobile) onCloseMobile();
          }
        }}
        disabled={!isPermitted}
        title={item.description}
        aria-label={item.label}
        aria-current={isActive ? 'page' : undefined}
        className={`w-full flex items-center justify-between py-1.5 pr-2 rounded-md text-xs transition-all text-left group focus:outline-hidden focus:ring-2 focus:ring-white/40 ${
          isActive
            ? 'bg-white text-slate-900 font-bold shadow-xs'
            : isPermitted
            ? 'text-white/80 hover:text-white hover:bg-white/10'
            : 'text-white/30 cursor-not-allowed opacity-50'
        }`}
        style={{
          paddingLeft: `${Math.max(12, depth * 14 + 14)}px`,
          ...(isActive
            ? {
                backgroundColor: '#FFFFFF',
                color: 'var(--color-primary)',
              }
            : {}),
        }}
      >
        <div className="flex items-center gap-2 truncate">
          {renderIcon(
            item.icon,
            `w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[var(--color-primary)]' : 'text-white/60 group-hover:text-white/90'}`
          )}
          <span className="truncate">{item.label}</span>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-1">
          {item.badge && (
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-white/20 text-white">
              {item.badge}
            </span>
          )}
          {!isPermitted && <Lock className="w-3 h-3 text-white/40" />}
        </div>
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full select-none">
      {/* Quick Filter Search inside Sidebar */}
      {(!collapsed || isMobile) && (
        <div className="px-3 pt-2 pb-1 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-white/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter menu..."
              className="w-full pl-8 pr-6 py-1.5 rounded-lg text-xs bg-white/10 text-white placeholder-white/40 border border-white/10 focus:outline-hidden focus:border-white/30 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-white/50 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Navigation Tree */}
      <nav 
        className="flex-1 overflow-y-auto px-2 py-2 space-y-1 custom-scrollbar focus:outline-hidden"
        role="navigation"
        aria-label="Admin Navigation"
      >
        {searchQuery.trim() ? (
          filteredSections.map((section) => renderNavNode(section, 0))
        ) : (
          <>
            {/* Direct Links Section */}
            {(!collapsed || isMobile) && (
              <div className="px-2 pt-1 pb-1 flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-white/50">
                <span>Direct Access</span>
                <span className="text-[9px] text-white/30">8 Links</span>
              </div>
            )}
            {filteredSections
              .filter((item) => !item.isFolder)
              .map((item) => renderNavNode(item, 0))}

            {/* Expandable Folders Section */}
            {(!collapsed || isMobile) && (
              <div className="px-2 pt-3 pb-1 flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-white/50 border-t border-white/10 mt-2">
                <span>Management Modules</span>
                <span className="text-[9px] text-white/30">7 Folders</span>
              </div>
            )}
            {collapsed && !isMobile && (
              <div className="my-2 border-t border-white/10" />
            )}
            {filteredSections
              .filter((item) => item.isFolder)
              .map((item) => renderNavNode(item, 0))}
          </>
        )}
      </nav>
    </div>
  );
};
