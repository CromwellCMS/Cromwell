import { sleep, TCreateUser } from '@cromwell/core';
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

import { LoginDto } from '../dto/login.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { UserDto } from '../dto/user.dto';
import { TLoginInfo } from '../helpers/constants';
import { authSettings, bcryptSaltRounds } from '../helpers/settings';

const logger = getLogger();

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

    async validateUser(email: string, pass: string): Promise<User | null> {
        const userRepository = getCustomRepository(UserRepository);

        try {
            const user = await userRepository.getUserByEmail(email);

            if (user) {
                const isValid = await this.comparePassword(pass, user.password);
                if (isValid) return user;
            }
        } catch (e) {
            logger.error(e);
        }

        return null;
    }

    getUserById = (id: string) => getCustomRepository(UserRepository).getUserById(id);

    async logIn(input: LoginDto): Promise<TLoginInfo> {
        const user = await this.validateUser(input.email, input.password);

        if (!user) return null;

        const userInfo: TAuthUserInfo = {
            id: user.id,
            email: user.email,
            role: user.role ?? 'customer',
        }

        if (user.refreshToken) {
            const isValid = await this.validateRefreshToken(user.refreshToken);
            if (!isValid) user.refreshToken = null;
        }

        const refreshToken = user.refreshToken ?? (await this.generateRefreshToken(userInfo)).token;
        const accessToken = (await this.generateAccessToken(userInfo)).token;

        if (!user.refreshToken) {
            await this.saveRefreshToken(userInfo, refreshToken);
        }

        return {
            accessToken,
            refreshToken,
            userInfo,
            userDto: new UserDto().parseUser(user),
        }
    }

    async signUpUser(data: TCreateUser, initiator?: TAuthUserInfo) {
        const userRepo = getCustomRepository(UserRepository);
        if (data?.role && data.role !== 'customer') {
            if (!initiator?.id || initiator.role !== 'administrator')
                throw new UnauthorizedException('Denied. You have no permissions to create this type of user');
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

        const compiledMail = await getEmailTemplate('forgot-password.hbs', {
            resetCode: secretCode
        });
        if (!compiledMail) {
            logger.error('forgot-password.hbs template was not found');
            throw new HttpException('forgot-password.hbs template was not found', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return await sendEmail([email], 'Forgot password', compiledMail);
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

    getAccessTokenInfo(token: string): TTokenInfo {
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

    getRefreshTokenInfo(token: string): TTokenInfo {
        return {
            token,
            maxAge: authSettings.expirationRefreshTime + '',
            cookie: `${authSettings.refreshTokenCookieName}=${token}; HttpOnly; Path=/; Max-Age=${authSettings.expirationRefreshTime}`
        }
    }

    async saveRefreshToken(userInfo: TAuthUserInfo, newToken: string) {
        const user = await getCustomRepository(UserRepository).getUserById(userInfo.id);
        if (!user) {
            return;
        }
        user.refreshToken = newToken;
        await getCustomRepository(UserRepository).save(user);
    }

    async removeRefreshToken(userInfo: TAuthUserInfo) {
        const user = await getCustomRepository(UserRepository).getUserById(userInfo.id);
        if (!user) {
            return;
        }
        user.refreshToken = null;
        await getCustomRepository(UserRepository).save(user);
    }

    async updateRefreshToken(userInfo: TAuthUserInfo) {
        const user = await getCustomRepository(UserRepository).getUserById(userInfo.id);
        if (!user) {
            return;
        }
        const newToken = await this.generateRefreshToken(userInfo);

        user.refreshToken = newToken.token;
        await getCustomRepository(UserRepository).save(user);
        return newToken;
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
            if (!user?.refreshToken) {
                return false;
            }

            if (user.refreshToken === refreshToken)
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
            const authHeader = String(request?.headers?.['authorization'] ?? '');

            if (authHeader.startsWith('Service ')) {
                // Access by secret token from other services such as Renderer
                const serviceSecret = authHeader.substring(8, authHeader.length);
                if (serviceSecret === authSettings.serviceSecret) {
                    request.user = {
                        id: 'service',
                        email: 'service',
                        role: 'administrator',
                    }
                    return request.user;
                }
            }

            let accessToken = request?.cookies?.[authSettings.accessTokenCookieName];
            const refreshToken = request?.cookies?.[authSettings.refreshTokenCookieName];

            if (!accessToken) {
                if (authHeader.startsWith('Bearer ')) {
                    accessToken = authHeader.substring(7, authHeader.length);
                }
            }

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
            const newRefreshToken = await this.updateRefreshToken(authUserInfo);

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
