import { Role } from './types';

export type Permission =
  | 'dashboard.view'
  | 'inventory.view'
  | 'inventory.manage'
  | 'inventory.issue'
  | 'inventory.receipt'
  | 'inventory.edit_master'
  | 'inventory.delete'
  | 'prediction.view'
  | 'prediction.run'
  | 'analytics.view'
  | 'analytics.system_wide'
  | 'redistribution.view'
  | 'redistribution.request'
  | 'redistribution.approve'
  | 'redistribution.manage'
  | 'alerts.view'
  | 'alerts.manage'
  | 'reports.view'
  | 'reports.export'
  | 'facilities.view'
  | 'facilities.manage'
  | 'users.view'
  | 'users.manage';

export interface RoleInfo {
  role: Role;
  label: string;
  badge: string;
  description: string;
  scope: string;
  badgeColor: string;
  borderBadge: string;
}

export const ROLE_INFO: Record<string, RoleInfo> = {
  [Role.ADMIN]: {
    role: Role.ADMIN,
    label: 'System Admin (Full Access)',
    badge: 'System Admin',
    description: 'System-wide administration, user management, and complete platform control.',
    scope: 'All Facilities (Global Network)',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    borderBadge: 'border-purple-500'
  },
  [Role.HOSPITAL_HEAD]: {
    role: Role.HOSPITAL_HEAD,
    label: 'Hospital Head (Executive View)',
    badge: 'Hospital Head',
    description: 'Executive monitoring, stockout governance, and inter-facility redistribution approvals.',
    scope: 'Hospital A (Executive Hub)',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    borderBadge: 'border-teal-500'
  },
  [Role.SUPERVISOR]: {
    role: Role.SUPERVISOR,
    label: 'Pharmacy Supervisor',
    badge: 'Pharmacy Supervisor',
    description: 'Medicine inventory management, stockout predictions, and supply transfer requests.',
    scope: 'Hospital A Central Pharmacy',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    borderBadge: 'border-blue-500'
  },
  [Role.PHARMACIST]: {
    role: Role.PHARMACIST,
    label: 'Dispensary Pharmacist',
    badge: 'Dispensary Pharmacist',
    description: 'Day-to-day medicine dispensing, stock transactions, and local shortage alerts.',
    scope: 'Dispensary Unit #1 (Outpatient)',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    borderBadge: 'border-emerald-500'
  }
};

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  [Role.ADMIN]: [
    'dashboard.view',
    'inventory.view',
    'inventory.manage',
    'inventory.issue',
    'inventory.receipt',
    'inventory.edit_master',
    'inventory.delete',
    'prediction.view',
    'prediction.run',
    'analytics.view',
    'analytics.system_wide',
    'redistribution.view',
    'redistribution.request',
    'redistribution.approve',
    'redistribution.manage',
    'alerts.view',
    'alerts.manage',
    'reports.view',
    'reports.export',
    'facilities.view',
    'facilities.manage',
    'users.view',
    'users.manage',
  ],
  [Role.HOSPITAL_HEAD]: [
    'dashboard.view',
    'inventory.view',
    'prediction.view',
    'analytics.view',
    'analytics.system_wide',
    'redistribution.view',
    'redistribution.approve',
    'alerts.view',
    'reports.view',
    'reports.export',
    'facilities.view',
  ],
  [Role.SUPERVISOR]: [
    'dashboard.view',
    'inventory.view',
    'inventory.manage',
    'inventory.issue',
    'inventory.receipt',
    'prediction.view',
    'prediction.run',
    'analytics.view',
    'redistribution.view',
    'redistribution.request',
    'alerts.view',
    'alerts.manage',
    'reports.view',
    'reports.export',
    'facilities.view',
  ],
  [Role.PHARMACIST]: [
    'dashboard.view',
    'inventory.view',
    'inventory.issue',
    'inventory.receipt',
    'prediction.view',
    'alerts.view',
    'reports.view',
    'reports.export',
  ],
};

export const normalizeRole = (role?: Role | string): Role => {
  if (!role) return Role.PHARMACIST;
  const lower = String(role).toLowerCase();
  if (lower.includes('admin')) return Role.ADMIN;
  if (lower.includes('head')) return Role.HOSPITAL_HEAD;
  if (lower.includes('supervisor')) return Role.SUPERVISOR;
  if (lower.includes('pharmacist') || lower.includes('technician')) return Role.PHARMACIST;
  return Role.PHARMACIST;
};

export const hasPermission = (role: Role | string | undefined, permission: Permission): boolean => {
  if (!role) return false;
  const normalized = normalizeRole(role);
  return ROLE_PERMISSIONS[normalized]?.includes(permission) ?? false;
};

export const getRoleInfo = (role?: Role | string): RoleInfo => {
  const normalized = normalizeRole(role);
  return ROLE_INFO[normalized] || ROLE_INFO[Role.PHARMACIST];
};
