import { getStoreItem, matchPermissions, TPermissionName } from '@cromwell/core';
import { HttpException, HttpStatus, SetMetadata } from '@nestjs/common';

import { checkRoles, getPermissions } from './auth-roles-permissions';
import { TAuthUserInfo, TGraphQLContext } from './types';

export const checkRegisteredPermissions = (permissions: TPermissionName[]) => {
  if (!permissions?.length) return;
  const allPermissions = getPermissions();
  permissions.forEach((permission) => {
    if (!allPermissions.find((p) => p.name === permission))
      throw new HttpException(
        `Permission ${permission} is not registered. Use registerPermission helper from '@cromwell/core-backend'`,
        HttpStatus.FORBIDDEN,
      );
  });
};

export const AuthGuard = ({
  permissions = [],
  customPermissions = [],
}: { permissions?: TPermissionName[]; customPermissions?: string[] } = {}): MethodDecorator =>
  SetMetadata('permissions', { permissions, customPermissions });

export const graphQlAuthChecker = async (
  options?: {
    root?: any;
    args?: Record<string, any>;
    context?: TGraphQLContext;
    info?: any;
  } | null,
  permissions?: TPermissionName[] | null,
) => {
  const { context } = options ?? {};
  if (!permissions || permissions.length === 0) return true;

  if (getStoreItem('cmsSettings')?.installed === false) return true;
  checkRegisteredPermissions(permissions);

  const userInfo: TAuthUserInfo | undefined = (context as TGraphQLContext)?.user;

  if (!userInfo?.id || !userInfo?.roles?.length) throw new HttpException('Access denied', HttpStatus.UNAUTHORIZED);

  await checkRoles();

  if (!matchPermissions(userInfo, permissions)) throw new HttpException('Access denied', HttpStatus.FORBIDDEN);

  return true;
};
