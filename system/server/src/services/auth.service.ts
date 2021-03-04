import { TUser } from '@cromwell/core';
import { getLogger, User, UserRepository } from '@cromwell/core-backend';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { getCustomRepository } from 'typeorm';

import {
    bcryptSaltRounds,
    jwtConstants,
    TAuthUserInfo,
    TRequestWithUser,
    TTokenInfo,
    TTokenPayload,
} from '../auth/constants';

const logger = getLogger('detailed');

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService
    ) { }

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

    async hashPassword(plain: string): Promise<string> {
        return bcrypt.hash(plain, bcryptSaltRounds);
    }

    async comparePassword(plain: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plain, hash);
    }

    payloadToUserInfo(payload: TTokenPayload): TAuthUserInfo {
        return { id: payload.sub, email: payload.username };
    }

    async generateAccessToken(user: TAuthUserInfo) {
        const payload: TTokenPayload = { username: user.email, sub: user.id };

        const token = await this.jwtService.signAsync(payload, {
            secret: jwtConstants.accessSecret,
            expiresIn: jwtConstants.expirationAccessTime + 's'
        });

        return {
            token,
            maxAge: jwtConstants.expirationAccessTime + '',
            cookie: `${jwtConstants.accessTokenCookieName}=${token}; HttpOnly; Path=/; Max-Age=${jwtConstants.expirationAccessTime}`
        }
    }

    async generateRefreshToken(userInfo: TAuthUserInfo): Promise<TTokenInfo> {
        const payload: TTokenPayload = { username: userInfo.email, sub: userInfo.id };

        // Generate new token and save to DB
        const token = await this.jwtService.signAsync(payload, {
            secret: jwtConstants.refreshSecret,
            expiresIn: jwtConstants.expirationRefreshTime + 's'
        });

        return {
            token,
            maxAge: jwtConstants.expirationRefreshTime + '',
            cookie: `${jwtConstants.refreshTokenCookieName}=${token}; HttpOnly; Path=/; Max-Age=${jwtConstants.expirationRefreshTime}`
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

            const maxTokensPerUser = jwtConstants.maxTokensPerUser;
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
                secret: jwtConstants.accessSecret,
            });
        } catch (e) {
            // logger.error(e);
        }
    }

    async validateRefreshToken(refreshToken: string): Promise<TTokenPayload | undefined> {
        try {
            return await this.jwtService.verifyAsync<TTokenPayload>(refreshToken, {
                secret: jwtConstants.refreshSecret,
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
            `${jwtConstants.accessTokenCookieName}=; HttpOnly; Path=/; Max-Age=0`,
            `${jwtConstants.refreshTokenCookieName}=; HttpOnly; Path=/; Max-Age=0`,
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
        response.setCookie(jwtConstants.accessTokenCookieName, token.token, {
            path: '/',
            maxAge: token.maxAge,
            httpOnly: true,
        });
    }

    setRefreshTokenCookie(response, request: TRequestWithUser, token: TTokenInfo) {
        response.setCookie(jwtConstants.refreshTokenCookieName, token.token, {
            path: '/',
            maxAge: token.maxAge,
            httpOnly: true,
        });
    }

    clearTokenCookies(response, request: TRequestWithUser) {
        response.clearCookie?.(jwtConstants.accessTokenCookieName, {
            path: '/',
            httpOnly: true,
            domain: this.getDomainFromRequest(request),
        });
        response.clearCookie?.(jwtConstants.refreshTokenCookieName, {
            path: '/',
            httpOnly: true,
            domain: this.getDomainFromRequest(request),
        });
    }


}