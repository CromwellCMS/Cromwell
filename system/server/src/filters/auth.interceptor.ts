import { getStoreItem, matchPermissions, TPermissionName } from '@cromwell/core';
import { checkRegisteredPermissions, TRequestWithUser } from '@cromwell/core-backend';
import { checkRoles } from '@cromwell/core-backend/dist/helpers/auth-roles-permissions';
import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler) {
    const activate = async () => {
      if (getStoreItem('cmsSettings')?.installed === false) return;

      const request: TRequestWithUser = context.switchToHttp().getRequest();

      const handler = context.getHandler();
      const data: { permissions?: TPermissionName[]; customPermissions?: string[] } = Reflect.getMetadata(
        'permissions',
        handler,
      );

      const permissions: TPermissionName[] = [
        ...(data?.permissions ?? []),
        ...(data?.customPermissions ?? []),
      ] as TPermissionName[];

      await checkRoles();

      if (permissions.length) {
        if (!request.user?.id || !request.user?.roles?.length)
          throw new HttpException('Access denied', HttpStatus.UNAUTHORIZED);

        checkRegisteredPermissions(permissions);

        if (!matchPermissions(request.user, permissions))
          throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
      }
    };

    await activate();
    return next.handle();
  }
}
