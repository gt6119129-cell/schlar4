import React, { useState } from 'react';
import { usePermissions } from '../../context/PermissionContext';
import { SCHLAR_ROLES } from '../../config/roles';
import {
  ShieldCheck,
  Search,
  RotateCcw,
  AlertTriangle,
  Check,
  X,
  Filter,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface PermissionManagerProps {
  onClose?: () => void;
}

export const PermissionManager: React.FC<PermissionManagerProps> = ({ onClose }) => {
  const {
    permissionRegistry,
    hasPermission,
    isPermissionOverridden,
    togglePermission,
    resetRoleToDefault,
    getEffectivePermissions,
  } = usePermissions();

  const [selectedRoleId, setSelectedRoleId] = useState<string>('admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const activeRole = SCHLAR_ROLES.find((r) => r.id === selectedRoleId) || SCHLAR_ROLES[0];
  const effectivePermissions = getEffectivePermissions(selectedRoleId);

  // Unique modules list
  const modules = Array.from(new Set(permissionRegistry.map((p) => p.module)));

  // Filter permissions
  const filteredPermissions = permissionRegistry.filter((p) => {
    const matchSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchModule = selectedModule === 'all' || p.module === selectedModule;
    return matchSearch && matchModule;
  });

  // Group by module
  const groupedByModule: Record<string, typeof permissionRegistry> = {};
  for (const perm of filteredPermissions) {
    if (!groupedByModule[perm.module]) {
      groupedByModule[perm.module] = [];
    }
    groupedByModule[perm.module].push(perm);
  }

  const handleToggle = (permId: string) => {
    const isGranted = effectivePermissions.includes(permId);
    togglePermission(selectedRoleId, permId, !isGranted);
  };

  const handleConfirmReset = () => {
    resetRoleToDefault(selectedRoleId);
    setResetConfirmOpen(false);
  };

  return (
    <div
      className="p-5 sm:p-7 rounded-2xl border transition-colors shadow-sm max-w-5xl mx-auto"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Title & Role Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b mb-6 gap-4" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-primary)',
              }}
            >
              RBAC Governance Engine
            </span>
            <span className="text-xs text-slate-500">Live Granular Permissions</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Role Permission Matrix
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage granular module capabilities, action scopes, and administrative overrides across all 10 roles.
          </p>
        </div>

        {/* Role Select Bar */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Target Role:</span>
          <select
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold rounded-lg border outline-none"
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            {SCHLAR_ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setResetConfirmOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border text-slate-600 dark:text-slate-300 hover:opacity-85"
            style={{ borderColor: 'var(--color-border)' }}
            title="Reset role permissions to default policy"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          {onClose && (
            <button onClick={onClose} className="p-1.5 rounded-lg border text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Role Summary Banner */}
      <div
        className="p-4 rounded-xl border mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
        style={{
          backgroundColor: 'var(--color-background)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shrink-0"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm block" style={{ color: 'var(--color-text)' }}>
              {activeRole.name} Permissions
            </span>
            <span className="text-[11px] text-slate-500">
              {effectivePermissions.length} of {permissionRegistry.length} system privileges active
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
            {effectivePermissions.length} Granted
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {permissionRegistry.length - effectivePermissions.length} Denied
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs w-full sm:w-64"
          style={{
            backgroundColor: 'var(--color-background)',
            borderColor: 'var(--color-border)',
          }}
        >
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search privileges..."
            className="w-full bg-transparent border-none outline-none text-xs"
            style={{ color: 'var(--color-text)' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-[10px] text-slate-400">
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-semibold text-slate-500 shrink-0">Module:</span>
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="px-2.5 py-1 text-xs rounded-lg border outline-none font-medium"
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <option value="all">All Modules ({permissionRegistry.length})</option>
            {modules.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Permissions Table Grouped by Module */}
      <div className="space-y-6">
        {Object.entries(groupedByModule).map(([moduleName, perms]) => (
          <div
            key={moduleName}
            className="rounded-xl border overflow-hidden transition-colors"
            style={{ borderColor: 'var(--color-border)' }}
          >
            {/* Group Header */}
            <div
              className="p-3 border-b flex items-center justify-between text-xs font-bold"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              <span>{moduleName}</span>
              <span className="text-[10px] font-normal text-slate-500">
                {perms.filter((p) => effectivePermissions.includes(p.id)).length} / {perms.length} enabled
              </span>
            </div>

            {/* Privileges in module */}
            <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {perms.map((perm) => {
                const isGranted = effectivePermissions.includes(perm.id);
                const isOverridden = isPermissionOverridden(selectedRoleId, perm.id);

                return (
                  <div
                    key={perm.id}
                    className="p-3 flex items-start justify-between gap-4 text-xs hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                          {perm.name}
                        </span>
                        <code className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/5 dark:bg-white/10 text-slate-500">
                          {perm.id}
                        </code>
                        {isOverridden && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                            Custom Override
                          </span>
                        )}
                        {perm.sensitivity === 'critical' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 border border-rose-300">
                            Critical
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        {perm.description} · <span className="font-semibold text-slate-600 dark:text-slate-400">Scope: {perm.scope}</span>
                      </p>
                    </div>

                    {/* Toggle Button */}
                    <button
                      onClick={() => handleToggle(perm.id)}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all shrink-0 ${
                        isGranted
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'border border-slate-300 dark:border-slate-700 text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {isGranted ? 'Granted' : 'Denied'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Reset Confirmation Modal */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="p-6 rounded-2xl border shadow-xl max-w-sm w-full transition-colors"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                  Reset {activeRole.name} Permissions?
                </h3>
                <p className="text-xs text-slate-500">
                  This will discard all custom overrides for {activeRole.name} and restore system defaults.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-3 py-1.5 text-xs font-bold text-white rounded-lg bg-amber-600 hover:bg-amber-700"
              >
                Yes, Reset Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
