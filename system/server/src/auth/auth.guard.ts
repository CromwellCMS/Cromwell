import { getStoreItem, TAuthRole } from '@cromwell/core';
import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TAuthUserInfo, TRequestWithUser, TGraphQLContext } from './constants';

export const Roles = (...roles: TAuthRole[]) => SetMetadata('roles', roles);

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (getStoreItem('cmsSettings')?.installed === false) return true;

        const request: TRequestWithUser = context.switchToHttp().getRequest();
        if (!request.user?.id) return false;

        const roles = this.reflector.get<TAuthRole[]>('roles', context.getHandler());
        return matchRoles(request.user, roles);
    }
}

export const graphQlAuthChecker = (
    { root, args, context, info },
    roles: TAuthRole[],
) => {
    if (getStoreItem('cmsSettings')?.installed === false) return true;

    const userInfo: TAuthUserInfo | undefined = (context as TGraphQLContext)?.user;
    return matchRoles(userInfo, roles, args?.id);
};

const matchRoles = (user?: TAuthUserInfo, roles?: TAuthRole[], entityId?: string): boolean => {
    if (!roles || roles.length === 0) return true;
    if (!user?.id) return false;
    if (user.role === 'administrator') return true;

    if (roles.includes('all')) return true;

    if (roles.includes('guest')) {
        if (user.role === 'guest') return true;
    }
    if (roles.includes('author')) {
        if (user.role === 'author') return true;
    }
    if (roles.includes('customer')) {
        if (user.role === 'customer') return true;
    }
    if (roles.includes('self') && entityId) {
        if (user.id + '' === entityId + '') return true;
    }
    return false;
}