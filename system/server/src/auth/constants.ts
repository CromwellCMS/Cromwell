import { TUserRole } from '@cromwell/core';
import cryptoRandomString from 'crypto-random-string';
import { FastifyRequest } from 'fastify';

export const authSettings = {
    accessSecret: process.env.JWT_ACCESS_TOKEN_SECRET ?? cryptoRandomString({ length: 8 }),
    refreshSecret: process.env.JWT_REFRESH_TOKEN_SECRET ?? cryptoRandomString({ length: 8 }),
    cookieSecret: process.env.COOKIE_SECRET ?? cryptoRandomString({ length: 8 }),

    /** 10 min by default */
    expirationAccessTime: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME ?? '600',

    /** 15 days by default */
    expirationRefreshTime: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME ?? '1296000',
    accessTokenCookieName: 'crw_access_token',
    refreshTokenCookieName: 'crw_refresh_token',
    maxTokensPerUser: parseInt(process.env.JWT_MAX_TOKENS_PER_USER ?? '20'),

    // approximate, for one server instance
    resetPasswordAttempts: 5,
    // 3 hours
    resetPasswordCodeExpirationAccessTime: 1000 * 60 * 60 * 3
}

export const bcryptSaltRounds = 10;

export type TAuthUserInfo = {
    id: string;
    email: string;
    role: TUserRole;
}

export type TTokenPayload = {
    sub: string;
    username: string;
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