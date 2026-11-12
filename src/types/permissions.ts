export type PermissionAction =
  | 'view'
  | 'create'
  | 'edit'
  | 'archive'
  | 'approve'
  | 'publish'
  | 'export'
  | 'manage';

export type PermissionScope =
  | 'school-wide'
  | 'assigned-class'
  | 'linked-child'
  | 'department'
  | 'global';

export type SensitivityLevel = 'standard' | 'elevated' | 'critical';

export interface PermissionDefinition {
  id: string;
  name: string;
  module: string;
  action: PermissionAction;
  description: string;
  scope: PermissionScope;
  sensitivity: SensitivityLevel;
  requiresApproval?: boolean;
}

export type RolePermissionsMap = Record<string, string[]>;

export interface PermissionOverride {
  roleId: string;
  grantedPermissions: string[];
  revokedPermissions: string[];
  updatedAt: number;
}
