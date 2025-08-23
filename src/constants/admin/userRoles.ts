export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const ROLE_CONFIG = {
  [USER_ROLES.ADMIN]: {
    label: 'Administrador',
    color: 'bg-red-500/20 text-red-400 border-red-300/30',
    icon: '👑',
    description: 'Acceso completo al sistema',
    permissions: ['read', 'write', 'delete', 'admin']
  },
  [USER_ROLES.USER]: {
    label: 'Usuario',
    color: 'bg-blue-500/20 text-blue-400 border-blue-300/30',
    icon: '👤',
    description: 'Acceso limitado al sistema',
    permissions: ['read', 'write']
  }
} as const;

export const ROLE_OPTIONS = [
  { value: USER_ROLES.ADMIN, label: ROLE_CONFIG[USER_ROLES.ADMIN].label, color: ROLE_CONFIG[USER_ROLES.ADMIN].color, icon: ROLE_CONFIG[USER_ROLES.ADMIN].icon },
  { value: USER_ROLES.USER, label: ROLE_CONFIG[USER_ROLES.USER].label, color: ROLE_CONFIG[USER_ROLES.USER].color, icon: ROLE_CONFIG[USER_ROLES.USER].icon }
];

export const getRoleInfo = (role: UserRole) => {
  return ROLE_CONFIG[role] || ROLE_CONFIG[USER_ROLES.USER];
};
