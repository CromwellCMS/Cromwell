import { getStoreItem, TAuthRole, TUserRole } from '@cromwell/core';
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';


export type TAuthUserInfo = {
    id: number;
    email?: string | null;
    role: TUserRole;
}

export type TTokenPayload = {
    sub: number;
    username?: string | null;
    role: TUserRole;
}

export type TRequestWithUser = FastifyRequest & {
    user: TAuthUserInfo;
    cookies: any;
}

export type TTokenInfo = {
    token: string;
    maxAge: string;
    cookie: string;
}

export type TGraphQLContext = {
    user?: TAuthUserInfo;
}

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
    options?: {
        root?: any;
        args?: Record<string, any>;
        context?: TGraphQLContext;
        info?: any;
    } | null,
    roles?: TAuthRole[] | null,
) => {
    const { root, args, context, info } = options ?? {};
    if (!roles || roles.length === 0) return true;
    if (getStoreItem('cmsSettings')?.installed === false) return true;

    const userInfo: TAuthUserInfo | undefined = (context as TGraphQLContext)?.user;

    if (!userInfo?.id || !userInfo?.role)
        throw new HttpException('Access denied', HttpStatus.UNAUTHORIZED);

    if (!matchRoles(userInfo, roles, args?.id)) throw new HttpException('Access denied', HttpStatus.FORBIDDEN);

    return true;
};

const matchRoles = (user?: TAuthUserInfo, roles?: TAuthRole[] | null, entityId?: string): boolean => {
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