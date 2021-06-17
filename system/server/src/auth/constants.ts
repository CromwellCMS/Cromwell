import cryptoRandomString from 'crypto-random-string';
import { readCMSConfigSync } from '@cromwell/core-backend';

const cmsConfig = readCMSConfigSync();

export const isRandomSecret = !cmsConfig.accessTokenSecret;

export const authSettings = {
    accessSecret: cmsConfig.accessTokenSecret ?? cryptoRandomString({ length: 8, type: 'ascii-printable' }),
    refreshSecret: cmsConfig.refreshTokenSecret ?? cryptoRandomString({ length: 8, type: 'ascii-printable' }),
    cookieSecret: cmsConfig.cookieSecret ?? cryptoRandomString({ length: 8, type: 'url-safe' }),

    /** 10 min by default */
    expirationAccessTime: cmsConfig.accessTokenExpirationTime ?? 600,
    /** 15 days by default */
    expirationRefreshTime: cmsConfig.refreshTokenExpirationTime ?? 1296000,

    accessTokenCookieName: 'crw_access_token',
    refreshTokenCookieName: 'crw_refresh_token',
    maxTokensPerUser: parseInt(process.env.JWT_MAX_TOKENS_PER_USER ?? '20'),

    // approximate, for one server instance
    resetPasswordAttempts: 5,
    // 3 hours
    resetPasswordCodeExpirationAccessTime: 1000 * 60 * 60 * 3,
}

export const bcryptSaltRounds = 10;
