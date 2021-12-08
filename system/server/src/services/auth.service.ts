import { sleep, TCreateUser } from '@cromwell/core';
import {
    bcryptSaltRounds,
    getAuthSettings,
    getEmailTemplate,
    getLogger,
    sendEmail,
    TAuthSettings,
    TAuthUserInfo,
    TRequestWithUser,
    TTokenInfo,
    TTokenPayload,
    User,
    UserRepository,
} from '@cromwell/core-backend';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from '@node-rs/bcrypt';
import cryptoRandomString from 'crypto-random-string';
import { FastifyReply } from 'fastify';
import { getCustomRepository } from 'typeorm';

import { LoginDto } from '../dto/login.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { UserDto } from '../dto/user.dto';
import { TLoginInfo } from '../helpers/constants';

const logger = getLogger();

export let authServiceInst: AuthService | undefined;

@Injectable()
export class AuthService {

    private resetPasswordAttempts: Record<string, {
        attempts: number;
        firstDate: Date;
    }> = {};

    private tokensDelimiter = '$$'
    private authSettings: TAuthSettings;

    constructor(
        private jwtService: JwtService,
    ) {
        authServiceInst = this;
        this.init();
    }

    private async init() {
        this.authSettings = await getAuthSettings();
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

    getUserById = (id: number) => getCustomRepository(UserRepository).getUserById(id);

    async logIn(input: LoginDto): Promise<TLoginInfo> {
        const user = await this.validateUser(input.email, input.password);

        if (!user) return null;

        const userInfo: TAuthUserInfo = {
            id: user.id,
            email: user.email,
            role: user.role ?? 'customer',
        }

        let validated: string[] = [];
        if (user.refreshTokens) {
            const tokens = user.refreshTokens.split(this.tokensDelimiter);

            validated = (await Promise.all(
                tokens.map(async token => {
                    const isValid = await this.validateRefreshToken(token);
                    if (isValid) return token;
                })))
                .filter(Boolean) as string[];
        }

        const refreshToken = validated[0] ?? (await this.generateRefreshToken(userInfo)).token;
        const accessToken = (await this.generateAccessToken(userInfo)).token;

        if (!validated.length) {
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
        if (data?.role && data.role !== 'customer') {
            if (!initiator?.id || initiator.role !== 'administrator')
                throw new UnauthorizedException('Denied. You have no permissions to create this type of user');
        }
        return this.createUser(data);
    }

    async createUser(data: TCreateUser) {
        if (!data.password) throw new HttpException('You must provide a password for the user', HttpStatus.BAD_REQUEST);
        const userRepo = getCustomRepository(UserRepository);
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
        if (!user?.id || !user.resetPasswordCode || !user.resetPasswordDate || !user.email)
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

            if (this.resetPasswordAttempts[user.email].attempts > this.authSettings.resetPasswordAttempts) {
                logger.warn('Exceeded reset password attempts');
                delete this.resetPasswordAttempts[user.email];
                await resetUserCode();
                throw new HttpException('Exceeded reset password attempts', HttpStatus.EXPECTATION_FAILED);
            }
        }

        if (user.resetPasswordDate.getTime() +
            this.authSettings.resetPasswordCodeExpirationAccessTime < new Date(Date.now()).getTime()) {
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
            secret: this.authSettings.accessSecret,
            expiresIn: this.authSettings.expirationAccessTime + 's'
        });

        return {
            token,
            maxAge: this.authSettings.expirationAccessTime + '',
            cookie: `${this.authSettings.accessTokenCookieName}=${token}; HttpOnly; Path=/; Max-Age=${this.authSettings.expirationAccessTime}`
        }
    }

    getAccessTokenInfo(token: string): TTokenInfo {
        return {
            token,
            maxAge: this.authSettings.expirationAccessTime + '',
            cookie: `${this.authSettings.accessTokenCookieName}=${token}; HttpOnly; Path=/; Max-Age=${this.authSettings.expirationAccessTime}`
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
            secret: this.authSettings.refreshSecret,
            expiresIn: this.authSettings.expirationRefreshTime + 's'
        });

        return {
            token,
            maxAge: this.authSettings.expirationRefreshTime + '',
            cookie: `${this.authSettings.refreshTokenCookieName}=${token}; HttpOnly; Path=/; Max-Age=${this.authSettings.expirationRefreshTime}`
        }
    }

    getRefreshTokenInfo(token: string): TTokenInfo {
        return {
            token,
            maxAge: this.authSettings.expirationRefreshTime + '',
            cookie: `${this.authSettings.refreshTokenCookieName}=${token}; HttpOnly; Path=/; Max-Age=${this.authSettings.expirationRefreshTime}`
        }
    }

    async saveRefreshToken(userInfo: TAuthUserInfo, newToken: string, user?: User) {
        if (!user) user = await getCustomRepository(UserRepository).getUserById(userInfo.id);
        if (!user) {
            return false;
        }
        let tokens = (user.refreshTokens ?? '').split(this.tokensDelimiter);
        tokens.push(newToken);
        if (tokens.length > 10) {
            tokens = tokens.slice(tokens.length - 10, tokens.length);
        }

        user.refreshTokens = tokens.join(this.tokensDelimiter)
        await getCustomRepository(UserRepository).save(user);
        return true;
    }

    async removeRefreshTokens(userInfo: TAuthUserInfo) {
        const user = await getCustomRepository(UserRepository).getUserById(userInfo.id);
        if (!user) {
            return;
        }
        user.refreshTokens = null;
        await getCustomRepository(UserRepository).save(user);
    }

    async updateRefreshToken(userInfo: TAuthUserInfo, user?: User) {
        const newToken = await this.generateRefreshToken(userInfo);
        const success = await this.saveRefreshToken(userInfo, newToken.token, user);
        if (success) return newToken;
    }

    async validateAccessToken(accessToken: string): Promise<TTokenPayload | undefined> {
        try {
            return await this.jwtService.verifyAsync<TTokenPayload>(accessToken, {
                secret: this.authSettings.accessSecret,
            });
        } catch (e) {
            // logger.error(e);
        }
    }

    async validateRefreshToken(refreshToken: string): Promise<TTokenPayload | undefined> {
        try {
            return await this.jwtService.verifyAsync<TTokenPayload>(refreshToken, {
                secret: this.authSettings.refreshSecret,
            });
        } catch (e) {
            logger.log(e);
        }
    }

    async dbCheckRefreshToken(refreshToken: string, userInfo: TAuthUserInfo): Promise<User | undefined> {
        try {
            const user = await getCustomRepository(UserRepository).getUserById(userInfo.id);
            if (!user?.refreshTokens) {
                return undefined;
            }

            const tokens = user.refreshTokens.split(this.tokensDelimiter);
            if (tokens.includes(refreshToken))
                return user;
        } catch (e) {
            logger.error(e);
        }
        return undefined;
    }

    getCookiesForLogOut() {
        return [
            `${this.authSettings.accessTokenCookieName}=; HttpOnly; Path=/; Max-Age=0`,
            `${this.authSettings.refreshTokenCookieName}=; HttpOnly; Path=/; Max-Age=0`,
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
        try {
            response.setCookie(this.authSettings.accessTokenCookieName, token.token, {
                path: '/',
                maxAge: token.maxAge,
                httpOnly: true,
            });
        } catch (error) {
            logger.error(error);
        }
    }

    setRefreshTokenCookie(response, request: TRequestWithUser, token: TTokenInfo) {
        try {
            response.setCookie(this.authSettings.refreshTokenCookieName, token.token, {
                path: '/',
                maxAge: token.maxAge,
                httpOnly: true,
            });
        } catch (error) {
            logger.error(error);
        }
    }

    clearTokenCookies(response, request: TRequestWithUser) {
        try {
            response.clearCookie(this.authSettings.accessTokenCookieName, {
                path: '/',
                httpOnly: true,
                domain: this.getDomainFromRequest(request),
            });
            response.clearCookie(this.authSettings.refreshTokenCookieName, {
                path: '/',
                httpOnly: true,
                domain: this.getDomainFromRequest(request),
            });
        } catch (error) {
            logger.error(error);
        }
    }

    async processRequest(request: TRequestWithUser, response: FastifyReply): Promise<TAuthUserInfo | null> {
        try {
            const authHeader = String(request?.headers?.['authorization'] ?? '');

            if (authHeader.startsWith('Service ')) {
                // Access by secret token from other services such as Renderer
                const serviceSecret = authHeader.substring(8, authHeader.length);
                if (serviceSecret === this.authSettings.serviceSecret) {
                    request.user = {
                        id: 111,
                        email: 'service',
                        role: 'administrator',
                    }
                    return request.user;
                }
            }

            let accessToken = request?.cookies?.[this.authSettings.accessTokenCookieName];
            const refreshToken = request?.cookies?.[this.authSettings.refreshTokenCookieName];

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
            if (!refreshToken || refreshToken === 'null')
                throw new UnauthorizedException('Refresh token is not set');

            const refreshTokenPayload = await this.validateRefreshToken(refreshToken);
            if (!refreshTokenPayload)
                throw new UnauthorizedException('Refresh token is not valid');

            const authUserInfo = this.payloadToUserInfo(refreshTokenPayload);

            // Check that token is in DB and was not blacklisted
            const validUser = await this.dbCheckRefreshToken(refreshToken, authUserInfo);
            if (!validUser)
                throw new UnauthorizedException('Refresh token is not valid');

            request.user = authUserInfo;

            // Create new access token
            const newAccessToken = await this.generateAccessToken(authUserInfo);

            // Update refresh token
            const newRefreshToken = await this.updateRefreshToken(authUserInfo, validUser);

            if (!newRefreshToken)
                throw new UnauthorizedException('Failed to update refresh token');

            this.setAccessTokenCookie(response, request, newAccessToken);
            this.setRefreshTokenCookie(response, request, newRefreshToken);

            return authUserInfo;

        } catch (err: any) {
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
                        this.authSettings.resetPasswordCodeExpirationAccessTime < new Date(Date.now()).getTime()) {
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
