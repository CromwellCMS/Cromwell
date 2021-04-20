import { getStoreItem, TUserRole } from '@cromwell/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { TAuthUserInfo, TRequestWithUser } from './constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (getStoreItem('cmsSettings')?.installed === false) return true;

        const request: TRequestWithUser = context.switchToHttp().getRequest();
        if (request.user?.id) return true;
        return false;
    }
}

export const graphQlAuthChecker = (
    { root, args, context, info },
    roles: TUserRole[],
) => {
    if (getStoreItem('cmsSettings')?.installed === false) return true;

    const userInfo: TAuthUserInfo | undefined = context?.user;
    if (roles && roles.length > 0) {
        if (roles.includes('administrator')) {
            if (userInfo?.role !== 'administrator') return false;
        }
    }
    return true;
};