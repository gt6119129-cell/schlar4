import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { DEFAULT_ROLE_PERMISSIONS, PERMISSION_REGISTRY } from '../config/permissions';
import { RoleNavItem } from '../config/roles';

const STORAGE_KEY_OVERRIDES = 'schlar_permission_overrides_v1';

interface PermissionContextValue {
  hasPermission: (roleIdOrPermissionId: string, maybePermissionId?: string) => boolean;
  isNavAllowed: (roleId: string, navItem: RoleNavItem) => boolean;
  getEffectivePermissions: (roleId: string) => string[];
  isPermissionOverridden: (roleId: string, permissionId: string) => boolean;
  togglePermission: (roleId: string, permissionId: string, granted: boolean) => void;
  resetRoleToDefault: (roleId: string) => void;
  resetAllToDefaults: () => void;
  permissionRegistry: typeof PERMISSION_REGISTRY;
}

const PermissionContext = createContext<PermissionContextValue | null>(null);

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Overrides map: roleId -> { granted: string[], revoked: string[] }
  const [overrides, setOverrides] = useState<Record<string, { granted: string[]; revoked: string[] }>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_OVERRIDES);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load permission overrides from localStorage:', e);
    }
    return {};
  });

  // Save overrides to localStorage
  const saveOverrides = (newOverrides: Record<string, { granted: string[]; revoked: string[] }>) => {
    setOverrides(newOverrides);
    try {
      localStorage.setItem(STORAGE_KEY_OVERRIDES, JSON.stringify(newOverrides));
    } catch (e) {
      console.warn('Failed to persist permission overrides:', e);
    }
  };

  const getEffectivePermissions = (roleId: string): string[] => {
    const defaults = DEFAULT_ROLE_PERMISSIONS[roleId] || [];
    const roleOverride = overrides[roleId];
    if (!roleOverride) return defaults;

    // Remove revoked, add granted
    const active = defaults.filter((p) => !roleOverride.revoked.includes(p));
    for (const g of roleOverride.granted) {
      if (!active.includes(g)) {
        active.push(g);
      }
    }
    return active;
  };

  const hasPermission = (roleIdOrPermissionId: string, maybePermissionId?: string): boolean => {
    const roleId = maybePermissionId ? roleIdOrPermissionId : 'admin';
    const permissionId = maybePermissionId ? maybePermissionId : roleIdOrPermissionId;

    if (!roleId || !permissionId) return false;
    const effective = getEffectivePermissions(roleId);
    return effective.includes(permissionId);
  };

  const isNavAllowed = (roleId: string, navItem: RoleNavItem): boolean => {
    if (!navItem.requiredPermission) return true;
    return hasPermission(roleId, navItem.requiredPermission);
  };

  const isPermissionOverridden = (roleId: string, permissionId: string): boolean => {
    const roleOverride = overrides[roleId];
    if (!roleOverride) return false;
    return roleOverride.granted.includes(permissionId) || roleOverride.revoked.includes(permissionId);
  };

  const togglePermission = (roleId: string, permissionId: string, granted: boolean) => {
    const defaults = DEFAULT_ROLE_PERMISSIONS[roleId] || [];
    const isDefaultGranted = defaults.includes(permissionId);

    const currentRoleOverride = overrides[roleId] || { granted: [], revoked: [] };
    let newGranted = [...currentRoleOverride.granted];
    let newRevoked = [...currentRoleOverride.revoked];

    if (granted) {
      // User wants permission granted
      newRevoked = newRevoked.filter((p) => p !== permissionId);
      if (!isDefaultGranted && !newGranted.includes(permissionId)) {
        newGranted.push(permissionId);
      }
    } else {
      // User wants permission revoked
      newGranted = newGranted.filter((p) => p !== permissionId);
      if (isDefaultGranted && !newRevoked.includes(permissionId)) {
        newRevoked.push(permissionId);
      }
    }

    const updated = {
      ...overrides,
      [roleId]: { granted: newGranted, revoked: newRevoked },
    };
    saveOverrides(updated);
  };

  const resetRoleToDefault = (roleId: string) => {
    const updated = { ...overrides };
    delete updated[roleId];
    saveOverrides(updated);
  };

  const resetAllToDefaults = () => {
    saveOverrides({});
  };

  return (
    <PermissionContext.Provider
      value={{
        hasPermission,
        isNavAllowed,
        getEffectivePermissions,
        isPermissionOverridden,
        togglePermission,
        resetRoleToDefault,
        resetAllToDefaults,
        permissionRegistry: PERMISSION_REGISTRY,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = (): PermissionContextValue => {
  const ctx = useContext(PermissionContext);
  if (!ctx) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return ctx;
};
