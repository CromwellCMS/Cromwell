import { readCMSConfigSync } from './cms-settings';
import cryptoRandomString from 'crypto-random-string';
import cacache from 'cacache';
import { getServerCachePath } from './paths';

export const bcryptSaltRounds = 10;

export type TAuthSettings = {
    accessSecret: string;
    refreshSecret: string;
    cookieSecret: string;
    serviceSecret: string;
    expirationAccessTime: number;
    expirationRefreshTime: number;
    accessTokenCookieName: string;
    refreshTokenCookieName: string;
    maxTokensPerUser: number;
    resetPasswordAttempts: number;
    resetPasswordCodeExpirationAccessTime: number;
}

let authSettings: TAuthSettings;

export const getAuthSettings = async (options?: {
    serverCachePath?: string
}): Promise<TAuthSettings> => {
    if (authSettings) return authSettings;

    const cmsConfig = readCMSConfigSync();
    const serverCachePath = options?.serverCachePath ?? getServerCachePath();

    let cachedSettings: TAuthSettings | undefined = undefined;
    try {
        let cachedData: any = await cacache.get(serverCachePath, 'auth_settings');
        cachedData = JSON.parse(cachedData.data.toString());
        if (cachedData?.accessSecret) {
            cachedSettings = cachedData;
        }
    } catch (error) { }

    // If secret keys weren't specified in the config, they will be randomly generated
    authSettings = {
        accessSecret: cmsConfig.accessTokenSecret ?? cachedSettings?.accessSecret ?? cryptoRandomString({ length: 8, type: 'ascii-printable' }),
        refreshSecret: cmsConfig.refreshTokenSecret ?? cachedSettings?.refreshSecret ?? cryptoRandomString({ length: 8, type: 'ascii-printable' }),
        cookieSecret: cmsConfig.cookieSecret ?? cachedSettings?.cookieSecret ?? cryptoRandomString({ length: 8, type: 'url-safe' }),
        serviceSecret: cmsConfig.serviceSecret ?? cachedSettings?.serviceSecret ?? cryptoRandomString({ length: 16, type: 'url-safe' }),

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

    // Save settings into the file cache, so random keys won't be generated 
    // on every launch, otherwise it'll cause log-out for all users
    await cacache.put(serverCachePath, 'auth_settings', JSON.stringify(authSettings));

    return authSettings;
}
