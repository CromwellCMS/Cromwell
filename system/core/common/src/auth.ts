import { TPermissionName } from './types/data';
import { TRole } from './types/entities';

export const matchPermissions = (
  user?: { roles?: TRole[] | null },
  permissions?: (TPermissionName | string)[] | null,
): boolean => {
  if (!permissions?.length) return true;
  if (!user?.roles?.length) return false;

  let match = false;
  for (const role of user.roles) {
    if (!role?.name || !role.permissions?.length) continue;
    if (role.permissions.includes('all')) {
      match = true;
    }

    if (permissions.some((p) => role.permissions && role.permissions.includes(p as TPermissionName))) {
      match = true;
    }
  }
  return match;
};
