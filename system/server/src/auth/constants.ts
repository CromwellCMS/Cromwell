import cryptoRandomString from 'crypto-random-string';

export const isRandomSecret = !process.env.JWT_ACCESS_TOKEN_SECRET;

export const authSettings = {
    accessSecret: process.env.JWT_ACCESS_TOKEN_SECRET ?? cryptoRandomString({ length: 8, type: 'ascii-printable' }),
    refreshSecret: process.env.JWT_REFRESH_TOKEN_SECRET ?? cryptoRandomString({ length: 8, type: 'ascii-printable' }),
    cookieSecret: process.env.COOKIE_SECRET ?? cryptoRandomString({ length: 8, type: 'ascii-printable' }),
    actionsSecret: process.env.ACTIONS_SECRET ?? cryptoRandomString({ length: 16, type: 'ascii-printable' }),

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
    resetPasswordCodeExpirationAccessTime: 1000 * 60 * 60 * 3,
}

export const bcryptSaltRounds = 10;
