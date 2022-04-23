import { getStoreItem, matchPermissions, TPermissionName } from '@cromwell/core';
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { checkRoles, getPermissions } from './auth-roles-permissions';
import { TAuthUserInfo, TGraphQLContext, TRequestWithUser } from './types';

const checkRegisteredPermissions = (permissions: TPermissionName[]) => {
    if (!permissions?.length) return;
    const allPermissions = getPermissions();
    permissions.forEach(permission => {
        if (!allPermissions.find(p => p.name === permission))
            throw new HttpException(`Permission ${permission} is not registered. Use registerPermission helper from '@cromwell/core-backend'`, HttpStatus.FORBIDDEN)
    });
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (getStoreItem('cmsSettings')?.installed === false) return true;

        const request: TRequestWithUser = context.switchToHttp().getRequest();
        if (!request.user?.id) return false;

        await checkRoles();
        const permissions = this.reflector.get<TPermissionName[]>('permissions', context.getHandler());
        checkRegisteredPermissions(permissions);

        return matchPermissions(request.user, permissions);
    }
}

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

    if (!userInfo?.id || !userInfo?.roles?.length)
        throw new HttpException('Access denied', HttpStatus.UNAUTHORIZED);

    await checkRoles();

    if (!matchPermissions(userInfo, permissions)) throw new HttpException('Access denied', HttpStatus.FORBIDDEN);

    return true;
};