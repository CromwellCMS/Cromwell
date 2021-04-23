import { TCreateUser, TUser } from '@cromwell/core';
import { getLogger, User, UserRepository } from '@cromwell/core-backend';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { FastifyReply } from 'fastify';
import { getCustomRepository } from 'typeorm';
import cryptoRandomString from 'crypto-random-string';
import {
    bcryptSaltRounds,
    authSettings,
    TAuthUserInfo,
    TRequestWithUser,
    TTokenInfo,
    TTokenPayload,
} from '../auth/constants';
import { CmsService } from './cms.service';

const logger = getLogger('detailed');

export let authServiceInst: AuthService | undefined;

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService,
        private moduleRef: ModuleRef,
        private cmsService: CmsService,
    ) {
        authServiceInst = this;
    }

    async validateUser(email: string, pass: string): Promise<TUser | null> {

        const userRepository = getCustomRepository(UserRepository);

        try {
            const user = await userRepository.getUserByEmail(email);

            if (user) {
                const { password: passwordHash, ...result } = user;

                const isValid = await this.comparePassword(pass, passwordHash);
                if (isValid) return result;
            }
        } catch (e) {
            logger.error(e);
        }

        return null;
    }

    getUserById = (id: string) => getCustomRepository(UserRepository).getUserById(id);

    async signUpUser(data: TCreateUser, initiator?: TAuthUserInfo) {
        const userRepo = getCustomRepository(UserRepository);
        if (data?.role && data.role !== 'customer') {
            if (!initiator?.id || initiator.role !== 'administrator')
                throw new UnauthorizedException('No permissons to create this user');
        }
        return userRepo.createUser(data);
    }

    async resetUserPassword(email: string) {
        // const userRepo = getCustomRepository(UserRepository);
        // const user = await userRepo.getUserByEmail(email);
        // if (!user?.id) return false;

        // const newRandPass = await userRepo.hashPassword(cryptoRandomString({ length: 9 }));
        // user.password = newRandPass;
        // await user.save();

        // await this.cmsService.sendEmail('<p>Hello!</p>', [email]);

        return true;
    }

    async hashPassword(plain: string): Promise<string> {
        return bcrypt.hash(plain, bcryptSaltRounds);
    }

    async comparePassword(plain: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plain, hash);
    }

    payloadToUserInfo(payload: TTokenPayload): TAuthUserInfo {
        return {
            id: payload.sub,
            email: payload.username,
            role: payload.role,
        };
    }

    async generateAccessToken(user: TAuthUserInfo) {
        const payload: TTokenPayload = {
            username: user.email,
            sub: user.id,
            role: user.role,
        };

        const token = await this.jwtService.signAsync(payload, {
            secret: authSettings.accessSecret,
            expiresIn: authSettings.expirationAccessTime + 's'
        });

        return {
            token,
            maxAge: authSettings.expirationAccessTime + '',
            cookie: `${authSettings.accessTokenCookieName}=${token}; HttpOnly; Path=/; Max-Age=${authSettings.expirationAccessTime}`
        }
    }

    async generateRefreshToken(userInfo: TAuthUserInfo): Promise<TTokenInfo> {
        const payload: TTokenPayload = {
            username: userInfo.email,
            sub: userInfo.id,
            role: userInfo.role,
        };

        // Generate new token and save to DB
        const token = await this.jwtService.signAsync(payload, {
            secret: authSettings.refreshSecret,
            expiresIn: authSettings.expirationRefreshTime + 's'
        });

        return {
            token,
            maxAge: authSettings.expirationRefreshTime + '',
            cookie: `${authSettings.refreshTokenCookieName}=${token}; HttpOnly; Path=/; Max-Age=${authSettings.expirationRefreshTime}`
        }
    }

    async validateUserRefreshTokens(user: User): Promise<string[] | undefined> {
        if (user.refreshTokens) {
            // Validate all already created tokens and clear expired
            const userRefreshTokens: string[] = JSON.parse(user.refreshTokens);

            let validatedTokens = (await Promise.all(userRefreshTokens.map(async token => {
                const isValid = await this.validateRefreshToken(token);
                if (isValid) return token;
            }))).filter(Boolean) as string[];

            const maxTokensPerUser = authSettings.maxTokensPerUser;
            if (validatedTokens.length > maxTokensPerUser) {
                validatedTokens = validatedTokens.slice(validatedTokens.length - maxTokensPerUser, validatedTokens.length)
            }
            return validatedTokens;
        };
    }

    async saveRefreshToken(userInfo: TAuthUserInfo, newToken: string) {
        const user = await getCustomRepository(UserRepository).getUserById(userInfo.id);
        if (!user) {
            return;
        }
        const createdRefreshTokens: string[] = await this.validateUserRefreshTokens(user) ?? [];

        createdRefreshTokens.push(newToken);
        user.refreshTokens = JSON.stringify(createdRefreshTokens);
        await getCustomRepository(UserRepository).save(user);

    }

    async updateRefreshToken(userInfo: TAuthUserInfo, oldRefreshToken: string) {
        const user = await getCustomRepository(UserRepository).getUserById(userInfo.id);
        if (!user?.refreshTokens) {
            return;
        }

        const createdRefreshTokens: string[] =
            (await this.validateUserRefreshTokens(user) ?? []).filter(token => token !== oldRefreshToken);

        const newToken = await this.generateRefreshToken(userInfo);
        if (newToken) {
            createdRefreshTokens.push(newToken.token)
        }
        user.refreshTokens = JSON.stringify(createdRefreshTokens);
        await getCustomRepository(UserRepository).save(user);

        return newToken;
    }

    async removeRefreshTokens(userInfo: TAuthUserInfo) {
        const user = await getCustomRepository(UserRepository).getUserById(userInfo.id);
        if (!user) {
            return;
        }

        user.refreshTokens = null;
        await getCustomRepository(UserRepository).save(user);
    }

    async validateAccessToken(accessToken: string): Promise<TTokenPayload | undefined> {
        try {
            return await this.jwtService.verifyAsync<TTokenPayload>(accessToken, {
                secret: authSettings.accessSecret,
            });
        } catch (e) {
            // logger.error(e);
        }
    }

    async validateRefreshToken(refreshToken: string): Promise<TTokenPayload | undefined> {
        try {
            return await this.jwtService.verifyAsync<TTokenPayload>(refreshToken, {
                secret: authSettings.refreshSecret,
            });
        } catch (e) {
            // logger.error(e);
        }
    }

    async dbCheckRefreshToken(refreshToken: string, userInfo: TAuthUserInfo): Promise<boolean> {
        try {
            const user = await getCustomRepository(UserRepository).getUserById(userInfo.id);
            if (!user?.refreshTokens) {
                return false;
            }

            const refreshTokens: string[] = JSON.parse(user.refreshTokens);

            if (refreshTokens.includes(refreshToken))
                return true;

        } catch (e) {
            logger.error(e);
        }
        return false;
    }

    getCookiesForLogOut() {
        return [
            `${authSettings.accessTokenCookieName}=; HttpOnly; Path=/; Max-Age=0`,
            `${authSettings.refreshTokenCookieName}=; HttpOnly; Path=/; Max-Age=0`,
        ];
    }

    getDomainFromRequest(request: TRequestWithUser) {
        let domain;
        if (request.hostname.includes('localhost')) {
            domain = 'localhost';
        }
        return domain;
    }

    setAccessTokenCookie(response, request: TRequestWithUser, token: TTokenInfo) {
        response.setCookie(authSettings.accessTokenCookieName, token.token, {
            path: '/',
            maxAge: token.maxAge,
            httpOnly: true,
        });
    }

    setRefreshTokenCookie(response, request: TRequestWithUser, token: TTokenInfo) {
        response.setCookie(authSettings.refreshTokenCookieName, token.token, {
            path: '/',
            maxAge: token.maxAge,
            httpOnly: true,
        });
    }

    clearTokenCookies(response, request: TRequestWithUser) {
        response.clearCookie?.(authSettings.accessTokenCookieName, {
            path: '/',
            httpOnly: true,
            domain: this.getDomainFromRequest(request),
        });
        response.clearCookie?.(authSettings.refreshTokenCookieName, {
            path: '/',
            httpOnly: true,
            domain: this.getDomainFromRequest(request),
        });
    }

    async processRequest(request: TRequestWithUser, response: FastifyReply): Promise<TAuthUserInfo | null> {
        try {
            const accessToken = request?.cookies?.[authSettings.accessTokenCookieName];
            const refreshToken = request?.cookies?.[authSettings.refreshTokenCookieName];
            if (!accessToken && !refreshToken) return null;

            // Validate access token
            const accessTokenPayload = accessToken ? await this.validateAccessToken(accessToken) : undefined;
            if (accessTokenPayload) {
                request.user = this.payloadToUserInfo(accessTokenPayload)
                return request.user;
            }

            // If access token is expired, validate refresh token
            if (!refreshToken || refreshToken === '' || refreshToken === 'null')
                throw new UnauthorizedException('Refresh token is not set');

            const refreshTokenPayload = await this.validateRefreshToken(refreshToken);
            if (!refreshTokenPayload)
                throw new UnauthorizedException('Refresh token is not valid');

            const authUserInfo = this.payloadToUserInfo(refreshTokenPayload);

            // Check if token is in DB and was not blacklisted
            const isValid = await this.dbCheckRefreshToken(refreshToken, authUserInfo);
            if (!isValid)
                throw new UnauthorizedException('Refresh token is not valid');

            request.user = authUserInfo;

            // Create new access token
            const newAccessToken = await this.generateAccessToken(authUserInfo);

            // Update refresh token
            const newRefreshToken = await this.updateRefreshToken(authUserInfo, refreshToken);

            if (!newRefreshToken)
                throw new UnauthorizedException('Failed to update refresh token');

            this.setAccessTokenCookie(response, request, newAccessToken);
            this.setRefreshTokenCookie(response, request, newRefreshToken);

            return authUserInfo;

        } catch (err) {
            logger.log('JwtAuthGuard: ', err.message);
            this.clearTokenCookies(response, request);
        }
        return null;
    }


}
