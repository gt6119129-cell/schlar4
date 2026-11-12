import React, { useState } from 'react';
import { SCHLAR_ROLES, RoleConfig } from '../../config/roles';
import {
  ShieldCheck,
  GraduationCap,
  BookOpen,
  HeartHandshake,
  Receipt,
  UserCheck,
  Library,
  Bus,
  Building,
  ClipboardCheck,
  ArrowRight,
  Search,
  Monitor,
  Smartphone,
  Info,
} from 'lucide-react';

interface RoleSelectionGridProps {
  onSelectRole: (role: RoleConfig) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  ShieldCheck,
  GraduationCap,
  BookOpen,
  HeartHandshake,
  Receipt,
  UserCheck,
  Library,
  Bus,
  Building,
  ClipboardCheck,
};

export const RoleSelectionGrid: React.FC<RoleSelectionGridProps> = ({ onSelectRole }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRoles = SCHLAR_ROLES.filter((role) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      role.name.toLowerCase().includes(q) ||
      role.category.toLowerCase().includes(q) ||
      role.description.toLowerCase().includes(q)
    );
  });

  return (
    <section id="workspaces" className="py-12 sm:py-16 border-b transition-colors" style={{ borderColor: 'var(--color-border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Demo Mode Trust & Scope Indicator */}
        <div
          className="mb-8 p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" style={{ color: 'var(--color-secondary)' }} />
            <span style={{ color: 'var(--color-text-secondary)' }}>
              <strong>Demo Environment:</strong> Interactive frontend demonstration with deterministic local state.
              No live SMS, payments, or authentication servers connected.
            </span>
          </div>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase self-start sm:self-auto shrink-0"
            style={{
              backgroundColor: 'var(--color-subtle-accent, rgba(0,0,0,0.06))',
              color: 'var(--color-accent)',
            }}
          >
            Phase 2 Architecture Active
          </span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div
              className="text-xs font-semibold tracking-wider uppercase mb-1 transition-colors"
              style={{ color: 'var(--color-secondary)' }}
            >
              School Operations Workspaces
            </div>
            <h2
              className="text-2xl sm:text-3xl font-extrabold tracking-tight transition-colors"
              style={{ color: 'var(--color-text)' }}
            >
              Choose Your Workspace
            </h2>
            <p
              className="text-sm sm:text-base font-normal mt-1 max-w-xl transition-colors"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Select a role to explore relevant school-management tools. 10 specialized workspaces, including a dedicated Parent Mobile App and dual Teacher experiences.
            </p>
          </div>

          {/* Quick Filter Search */}
          <div className="w-full md:w-72 shrink-0">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <Search className="w-4 h-4 shrink-0 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 10 roles..."
                className="w-full bg-transparent border-none outline-none text-sm placeholder:opacity-50"
                style={{ color: 'var(--color-text)' }}
                aria-label="Filter role workspaces"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs px-1 text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 10 Role Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredRoles.map((role) => {
            const IconComponent = ICON_MAP[role.iconName] || ShieldCheck;
            const hasMobile = role.platforms.includes('mobile');

            return (
              <div
                key={role.id}
                tabIndex={0}
                role="button"
                onClick={() => onSelectRole(role)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectRole(role);
                  }
                }}
                className="group relative flex flex-col justify-between p-5 rounded-xl border text-left transition-all duration-200 cursor-pointer hover:shadow-md focus:outline-none focus-visible:ring-2"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div>
                  {/* Top card strip: Category + Icon + Platform Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span
                        className="text-[11px] font-medium tracking-tight truncate block mb-1"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {role.category}
                      </span>
                      {/* Platform label as specified in Part 4 */}
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase border"
                        style={{
                          backgroundColor: 'var(--color-background)',
                          borderColor: 'var(--color-border)',
                          color:
                            role.id === 'parent'
                              ? 'var(--color-accent)'
                              : role.id === 'teacher'
                              ? 'var(--color-secondary)'
                              : 'var(--color-text-secondary)',
                        }}
                      >
                        {role.id === 'parent' ? (
                          <>
                            <Smartphone className="w-2.5 h-2.5" />
                            <span>Mobile App Only</span>
                          </>
                        ) : role.id === 'teacher' ? (
                          <>
                            <Smartphone className="w-2.5 h-2.5" />
                            <span>Web + Mobile</span>
                          </>
                        ) : (
                          <>
                            <Monitor className="w-2.5 h-2.5" />
                            <span>Web Workspace</span>
                          </>
                        )}
                      </span>
                    </div>

                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-200 group-hover:scale-105"
                      style={{
                        backgroundColor: 'var(--color-background)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-primary)',
                      }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Role Name */}
                  <h3
                    className="text-lg font-bold tracking-tight mb-2 transition-colors"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {role.name}
                  </h3>

                  {/* Role Description */}
                  <p
                    className="text-xs leading-relaxed mb-4 line-clamp-3 text-slate-500"
                  >
                    {role.description}
                  </p>

                  {/* Key Modules preview */}
                  <div className="text-[11px] font-medium mb-4">
                    <div className="font-semibold text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--color-secondary)' }}>
                      {role.navItems.length} Operational Modules
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {role.navItems.slice(0, 3).map((mod, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded text-[10px] border"
                          style={{
                            backgroundColor: 'var(--color-background)',
                            borderColor: 'var(--color-border)',
                            color: 'var(--color-text)',
                          }}
                        >
                          {mod.label}
                        </span>
                      ))}
                      {role.navItems.length > 3 && (
                        <span className="text-[10px] self-center text-slate-400">
                          +{role.navItems.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div
                  className="pt-3 border-t flex items-center justify-between text-xs font-semibold transition-colors mt-2"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">
                    {role.id === 'parent'
                      ? 'Launch Mobile App'
                      : role.id === 'teacher'
                      ? 'Select Experience'
                      : 'Open Workspace'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {filteredRoles.length === 0 && (
          <div
            className="text-center py-12 rounded-xl border transition-colors"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              No roles found matching "{searchQuery}".
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 text-xs font-semibold underline"
              style={{ color: 'var(--color-primary)' }}
            >
              Reset Search
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
