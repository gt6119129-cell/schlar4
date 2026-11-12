import React, { useState, useEffect, useMemo } from 'react';
import { RECEPTIONIST_NAVIGATION } from '../../../config/receptionistNavigation';
import { usePermissions } from '../../../context/PermissionContext';
import {
  ChevronDown,
  ChevronRight,
  Search,
  LayoutDashboard,
  BadgeCheck,
  LogIn,
  Users,
  History,
  HelpCircle,
  ListFilter,
  CalendarClock,
  CalendarDays,
  Calendar,
  Clock,
  PhoneCall,
  PhoneIncoming,
  MessageSquareText,
  GraduationCap,
  Contact,
  Briefcase,
  FileCheck,
  FileText,
  FileSpreadsheet,
  X,
  Lock,
} from 'lucide-react';

interface ReceptionistNestedSidebarProps {
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  BadgeCheck,
  LogIn,
  Users,
  History,
  HelpCircle,
  ListFilter,
  CalendarClock,
  CalendarDays,
  Calendar,
  Clock,
  PhoneCall,
  PhoneIncoming,
  MessageSquareText,
  Search,
  GraduationCap,
  Contact,
  Briefcase,
  FileCheck,
  FileText,
  FileSpreadsheet,
};

export const ReceptionistNestedSidebar: React.FC<ReceptionistNestedSidebarProps> = ({
  activeTabId,
  onSelectTab,
  collapsed,
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

  // Filter items based on search query
  const filteredNavigation = useMemo(() => {
    if (!searchQuery.trim()) return RECEPTIONIST_NAVIGATION;
    const query = searchQuery.toLowerCase();

    return RECEPTIONIST_NAVIGATION.map((item) => {
      if (!item.isFolder) {
        const matches =
          item.label.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query));
        return matches ? item : null;
      }

      // If folder, check folder label or children
      const matchingChildren = (item.children || []).filter(
        (child) =>
          child.label.toLowerCase().includes(query) ||
          (child.description && child.description.toLowerCase().includes(query))
      );

      if (matchingChildren.length > 0) {
        return {
          ...item,
          children: matchingChildren,
        };
      }

      if (item.label.toLowerCase().includes(query)) {
        return item;
      }

      return null;
    }).filter(Boolean) as typeof RECEPTIONIST_NAVIGATION;
  }, [searchQuery]);

  return (
    <div className="flex flex-col h-full text-white/90 select-none">
      {/* Search Input in Sidebar */}
      {!collapsed && (
        <div className="p-3 pb-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-white/50" />
            <input
              type="text"
              placeholder="Search front office..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder-white/50 rounded-lg outline-none border border-white/10 transition-colors"
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

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1 scrollbar-thin scrollbar-thumb-white/20">
        {filteredNavigation.map((item) => {
          const IconComponent = (item.icon && ICON_MAP[item.icon]) || LayoutDashboard;
          const isAllowed = !item.requiredPermission || hasPermission('receptionist', item.requiredPermission);

          if (!item.isFolder) {
            const isActive = activeTabId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (isAllowed) {
                    onSelectTab(item.id);
                    if (isMobile && onCloseMobile) onCloseMobile();
                  }
                }}
                disabled={!isAllowed}
                title={collapsed ? item.label : item.description}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-white text-slate-900 font-bold shadow-sm'
                    : isAllowed
                    ? 'text-white/85 hover:text-white hover:bg-white/10'
                    : 'text-white/40 cursor-not-allowed opacity-50'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: '#FFFFFF',
                        color: 'var(--color-primary, #164E55)',
                      }
                    : {}
                }
              >
                <IconComponent className="w-4 h-4 shrink-0" />
                {!collapsed && (
                  <div className="flex-1 truncate">
                    <span className="truncate">{item.label}</span>
                  </div>
                )}
                {!collapsed && !isAllowed && <Lock className="w-3 h-3 text-white/40" />}
              </button>
            );
          }

          // FOLDER ITEM WITH SUBMENU
          const isExpanded = expandedFolders[item.id] || Boolean(searchQuery);
          const hasActiveChild = (item.children || []).some((c) => c.id === activeTabId);

          return (
            <div key={item.id} className="space-y-0.5">
              <button
                onClick={() => toggleFolder(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                  hasActiveChild
                    ? 'text-white font-bold bg-white/10'
                    : 'text-white/75 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <IconComponent className="w-4 h-4 shrink-0 text-white/70" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!collapsed && (
                  <div>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-white/50" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-white/50" />
                    )}
                  </div>
                )}
              </button>

              {/* Submenu Children */}
              {isExpanded && !collapsed && item.children && (
                <div className="ml-4 pl-2 border-l border-white/15 space-y-0.5 mt-0.5">
                  {item.children.map((child) => {
                    const ChildIcon = (child.icon && ICON_MAP[child.icon]) || LayoutDashboard;
                    const isChildAllowed =
                      !child.requiredPermission || hasPermission('receptionist', child.requiredPermission);
                    const isChildActive = activeTabId === child.id;

                    return (
                      <button
                        key={child.id}
                        onClick={() => {
                          if (isChildAllowed) {
                            onSelectTab(child.id);
                            if (isMobile && onCloseMobile) onCloseMobile();
                          }
                        }}
                        disabled={!isChildAllowed}
                        title={child.description}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium text-left transition-colors ${
                          isChildActive
                            ? 'bg-white text-slate-900 font-bold shadow-xs'
                            : isChildAllowed
                            ? 'text-white/80 hover:text-white hover:bg-white/10'
                            : 'text-white/30 cursor-not-allowed opacity-50'
                        }`}
                        style={
                          isChildActive
                            ? {
                                backgroundColor: '#FFFFFF',
                                color: 'var(--color-primary, #164E55)',
                              }
                            : {}
                        }
                      >
                        <div className="flex items-center gap-2 truncate">
                          <ChildIcon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{child.label}</span>
                        </div>
                        {!isChildAllowed && <Lock className="w-3 h-3 text-white/30" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Reception Desk Quick Status Indicator */}
      {!collapsed && (
        <div className="p-3 border-t border-white/10 text-[11px] text-white/70 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white/90">Main Desk Gate</span>
            <span className="inline-flex items-center gap-1 text-emerald-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Open & Active
            </span>
          </div>
          <div className="text-[10px] text-white/50">
            Emergency Dial: Ext. 100 / West Guard Post
          </div>
        </div>
      )}
    </div>
  );
};
