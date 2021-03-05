import { getLogger } from '@cromwell/core-backend';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { AuthService } from '../services/auth.service';
import { jwtConstants } from './constants';

const logger = getLogger('detailed');

@Injectable()
export class JwtAuthGuard implements CanActivate {

    constructor(
        private readonly authService: AuthService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const response: FastifyReply = context.switchToHttp().getResponse();

        try {
            // Validate access token
            const accessToken = request?.cookies?.[jwtConstants.accessTokenCookieName];
            const accessTokenPayload = accessToken ? await this.authService.validateAccessToken(accessToken) : undefined;
            if (accessTokenPayload) {
                request.user = this.authService.payloadToUserInfo(accessTokenPayload)
                return true;
            }

            // If access token is expired, validate refresh token
            const refreshToken = request?.cookies?.[jwtConstants.refreshTokenCookieName];
            if (!refreshToken || refreshToken === '' || refreshToken === 'null')
                throw new UnauthorizedException('Refresh token is not set');

            const refreshTokenPayload = await this.authService.validateRefreshToken(refreshToken);
            if (!refreshTokenPayload)
                throw new UnauthorizedException('Refresh token is not valid');

            const authUserInfo = this.authService.payloadToUserInfo(refreshTokenPayload);

            // Check if token is in DB and was not blacklisted
            const isValid = await this.authService.dbCheckRefreshToken(refreshToken, authUserInfo);
            if (!isValid)
                throw new UnauthorizedException('Refresh token is not valid');


            request.user = authUserInfo;

            // Create new access token
            const newAccessToken = await this.authService.generateAccessToken(authUserInfo);

            // Update refresh token
            const newRefreshToken = await this.authService.updateRefreshToken(authUserInfo, refreshToken);

            if (!newRefreshToken)
                throw new UnauthorizedException('Failed to update refresh token');

            this.authService.setAccessTokenCookie(response, request, newAccessToken);
            this.authService.setRefreshTokenCookie(response, request, newRefreshToken);

            return true;

        } catch (err) {
            logger.log('JwtAuthGuard: ', err.message);
            this.authService.clearTokenCookies(response, request);

            return false;
        }
    }



}
