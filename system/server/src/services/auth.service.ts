import { sleep, TCreateUser, TUser } from '@cromwell/core';
import {
    getEmailTemplate,
    getLogger,
    sendEmail,
    TAuthUserInfo,
    TRequestWithUser,
    TTokenInfo,
    TTokenPayload,
    User,
    UserRepository,
} from '@cromwell/core-backend';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import cryptoRandomString from 'crypto-random-string';
import { FastifyReply } from 'fastify';
import { getCustomRepository } from 'typeorm';

import { authSettings, bcryptSaltRounds } from '../auth/constants';
import { ResetPasswordDto } from '../dto/reset-password.dto';

const logger = getLogger('detailed');

export let authServiceInst: AuthService | undefined;

@Injectable()
export class AuthService {

    private resetPasswordAttempts: Record<string, {
        attempts: number;
        firstDate: Date;
    }> = {};

    constructor(
        private jwtService: JwtService,
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

    async forgotUserPassword(email: string) {
        const userRepo = getCustomRepository(UserRepository);
        const user = await userRepo.getUserByEmail(email);
        if (!user?.id) throw new HttpException('Failed', HttpStatus.BAD_REQUEST);

        const secretCode = cryptoRandomString({ length: 6, type: 'numeric' });

        user.resetPasswordCode = secretCode;
        user.resetPasswordDate = new Date(Date.now());
        await user.save();

        const compiledMail = await getEmailTemplate('forgot-password.html', {
            resetCode: secretCode
        });
        if (compiledMail) {
            const success = await sendEmail([email], 'Forgot password', compiledMail);
            return success;
        }
        logger.error('forgot-password was not found');
        throw new HttpException('Failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    async resetUserPassword(input: ResetPasswordDto) {
        const userRepo = getCustomRepository(UserRepository);
        const user = await userRepo.getUserByEmail(input.email);
        if (!user?.id || !user.resetPasswordCode || !user.resetPasswordDate)
            throw new HttpException('Failed', HttpStatus.BAD_REQUEST);

        const resetUserCode = async () => {
            if (!user) return;
            user.resetPasswordDate = null;
            user.resetPasswordCode = null;
            await user.save();
        }

        if (!this.resetPasswordAttempts[user.email]) {
            this.resetPasswordAttempts[user.email] = {
                attempts: 1,
                firstDate: new Date(Date.now()),
            }
            this.memoryLeakChecker();
        } else {
            this.resetPasswordAttempts[user.email].attempts++;

            if (this.resetPasswordAttempts[user.email].attempts > authSettings.resetPasswordAttempts) {
                logger.warn('Exceeded reset password attempts');
                delete this.resetPasswordAttempts[user.email];
                await resetUserCode();
                throw new HttpException('Exceeded reset password attempts', HttpStatus.EXPECTATION_FAILED);
            }
        }

        if (user.resetPasswordDate.getTime() +
            authSettings.resetPasswordCodeExpirationAccessTime < new Date(Date.now()).getTime()) {
            logger.warn('Tried to reset password with expired code');
            await resetUserCode();
            throw new HttpException('Failed', HttpStatus.BAD_REQUEST);
        }

        if (input.code !== user.resetPasswordCode) {
            logger.warn('Tried to reset password with invalid code');
            throw new HttpException('Failed', HttpStatus.BAD_REQUEST);
        }

        user.password = await this.hashPassword(input.newPassword);
        await resetUserCode();
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
        }
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
            logger.log('processRequest: ', err.message);
            this.clearTokenCookies(response, request);
        }
        return null;
    }

    private isCheckerActive = false;

    async memoryLeakChecker() {
        if (this.isCheckerActive) return;
        this.isCheckerActive = true;

        const checkCycle = async () => {
            try {
                if (Object.keys(this.resetPasswordAttempts).filter(Boolean).length === 0) return;

                // remove old/expired resetPasswordAttempts from memory
                for (const email of Object.keys(this.resetPasswordAttempts)) {
                    if (this.resetPasswordAttempts[email].firstDate.getTime() +
                        authSettings.resetPasswordCodeExpirationAccessTime < new Date(Date.now()).getTime()) {
                        delete this.resetPasswordAttempts[email];
                    }
                }

            } catch (error) {
                logger.error(error);
            }

            await sleep(10);
            checkCycle();
        }

        checkCycle();
        this.isCheckerActive = false;
    }

}
