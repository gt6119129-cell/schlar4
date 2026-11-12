import React, { useState, useEffect, useMemo } from 'react';
import { AdminNavItem } from '../../../config/adminNavigation';
import { ACCOUNTANT_NAVIGATION } from '../../../config/accountantNavigation';
import { usePermissions } from '../../../context/PermissionContext';
import {
  ChevronDown,
  ChevronRight,
  Search,
  LayoutDashboard,
  TrendingUp,
  AlertTriangle,
  FileSpreadsheet,
  History,
  SlidersHorizontal,
  Layers,
  Users,
  UserPlus,
  Award,
  RotateCcw,
  CreditCard,
  PlusCircle,
  CheckCircle2,
  Receipt,
  XCircle,
  Scale,
  CheckSquare,
  HelpCircle,
  FileText,
  X,
} from 'lucide-react';

interface AccountantNestedSidebarProps {
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  TrendingUp,
  AlertTriangle,
  FileSpreadsheet,
  History,
  SlidersHorizontal,
  Layers,
  Users,
  UserPlus,
  Award,
  RotateCcw,
  CreditCard,
  PlusCircle,
  CheckCircle2,
  Receipt,
  XCircle,
  Scale,
  CheckSquare,
  HelpCircle,
  FileText,
};

export const AccountantNestedSidebar: React.FC<AccountantNestedSidebarProps> = ({
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

  // Filter items based on search and permissions
  const filteredNavigation = useMemo(() => {
    return ACCOUNTANT_NAVIGATION.map((item) => {
      if (item.isFolder && item.children) {
        const allowedChildren = item.children.filter((child) => {
          if (child.requiredPermission && !hasPermission(child.requiredPermission)) {
            return false;
          }
          if (!searchQuery) return true;
          return (
            child.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            child.description?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        });

        return {
          ...item,
          children: allowedChildren,
          isVisible:
            allowedChildren.length > 0 ||
            (!searchQuery &&
              (!item.requiredPermission || hasPermission(item.requiredPermission))),
        };
      } else {
        const isPermitted =
          !item.requiredPermission || hasPermission(item.requiredPermission);
        const matchesSearch =
          !searchQuery ||
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return {
          ...item,
          isVisible: isPermitted && matchesSearch,
        };
      }
    }).filter((item) => item.isVisible);
  }, [hasPermission, searchQuery]);

  return (
    <div className="flex flex-col h-full select-none text-xs">
      {/* Search Input (When not collapsed) */}
      {!collapsed && (
        <div className="px-3 pt-2 pb-2 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="text"
              placeholder="Filter fee modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/15 focus:border-white/30 text-white placeholder-white/50 text-xs transition-colors outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 py-1">
        {filteredNavigation.map((item) => {
          if (item.isFolder && item.children) {
            const isExpanded = expandedFolders[item.id] || searchQuery.length > 0;
            const hasActiveChild = item.children.some(
              (c) => c.id === activeTabId || activeTabId.startsWith(`${c.id}-`)
            );
            const FolderIcon = (item.icon && ICON_MAP[item.icon]) || SlidersHorizontal;

            return (
              <div key={item.id} className="space-y-0.5">
                {/* Folder Header */}
                <button
                  onClick={() => toggleFolder(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg font-semibold transition-colors group ${
                    hasActiveChild
                      ? 'text-white bg-white/15'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FolderIcon className="w-4 h-4 shrink-0 text-white/90" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!collapsed && (
                    <div className="shrink-0 text-white/60 group-hover:text-white">
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </div>
                  )}
                </button>

                {/* Submenu Children */}
                {isExpanded && !collapsed && (
                  <div className="pl-6 pr-1 space-y-0.5 border-l border-white/15 ml-4 my-0.5">
                    {item.children.map((child) => {
                      const isChildActive =
                        activeTabId === child.id ||
                        activeTabId.startsWith(`${child.id}-`);
                      const ChildIcon = (child.icon && ICON_MAP[child.icon]) || CreditCard;

                      return (
                        <button
                          key={child.id}
                          onClick={() => {
                            onSelectTab(child.id);
                            if (isMobile && onCloseMobile) onCloseMobile();
                          }}
                          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md font-medium text-left transition-all ${
                            isChildActive
                              ? 'bg-white text-slate-900 font-bold shadow-xs'
                              : 'text-white/70 hover:text-white hover:bg-white/10'
                          }`}
                          style={
                            isChildActive
                              ? {
                                  backgroundColor: '#FFFFFF',
                                  color: 'var(--color-primary)',
                                }
                              : {}
                          }
                          title={child.description}
                        >
                          <ChildIcon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{child.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Direct Link
          const isActive =
            activeTabId === item.id || activeTabId.startsWith(`${item.id}-`);
          const ItemIcon = (item.icon && ICON_MAP[item.icon]) || LayoutDashboard;

          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                if (isMobile && onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg font-medium transition-all text-left ${
                isActive
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
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
              title={collapsed ? item.label : item.description}
            >
              <ItemIcon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
