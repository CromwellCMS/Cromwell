import { TPackageCromwellConfig, TThemeConfig, TThemeEntity } from '@cromwell/core';
import { getCustomRepository } from 'typeorm';

import { GenericTheme } from './generic-entities';
import { getLogger } from './logger';


export const findTheme = (themeName: string): Promise<TThemeEntity | undefined> => {
    const themeRepo = getCustomRepository(GenericTheme.repository);
    return themeRepo.findOne({
        where: {
            name: themeName
        }
    });
}

export type TAllThemeConfigs = {
    themeConfig: TThemeConfig | null;
    userConfig: TThemeConfig | null;
    themeInfo: TPackageCromwellConfig | null;
}

/**
 * Get currently active Theme's configs from DB
 * @param themeName specify Theme to get config from, otherwise it will return from an active theme
 */
export const getThemeConfigs = async (themeName: string): Promise<TAllThemeConfigs> => {
    let themeConfig: TThemeConfig | null = null,
        userConfig: TThemeConfig | null = null,
        themeInfo: TPackageCromwellConfig | null = null;

    if (!themeName) {
        throw new Error('getThemeConfigs: !cmsSettings?.themeName')
    }

    let theme;
    try {
        theme = await findTheme(themeName);
    } catch (error) {
        getLogger().error(error);
    }

    if (!theme) {
        getLogger().error(`Current theme ${themeName} was not registered in DB`);
    }

    try {
        if (theme?.defaultSettings) themeConfig = JSON.parse(theme.defaultSettings);
    } catch (e) {
        getLogger(false).error(e);
    }
    try {
        if (theme?.settings) userConfig = JSON.parse(theme.settings);
    } catch (e) {
        getLogger(false).error(e);
    }

    try {
        if (theme?.moduleInfo) themeInfo = JSON.parse(theme.moduleInfo);
    } catch (e) {
        getLogger(false).error(e);
    }

    return {
        themeConfig,
        userConfig,
        themeInfo
    }
}
