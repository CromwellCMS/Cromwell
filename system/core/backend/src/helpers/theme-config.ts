import { TCmsSettings, TPackageCromwellConfig, TThemeConfig, TThemeEntity } from '@cromwell/core';
import { getCustomRepository } from 'typeorm';

import { getCmsSettings } from './cms-settings';
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
    cmsSettings: TCmsSettings | undefined;
    themeInfo: TPackageCromwellConfig | null;
}

/**
 * Get currently active Theme's configs from DB
 */
export const getThemeConfigs = async (): Promise<TAllThemeConfigs> => {
    let themeConfig: TThemeConfig | null = null,
        userConfig: TThemeConfig | null = null,
        themeInfo: TPackageCromwellConfig | null = null;

    const cmsSettings = await getCmsSettings();
    if (!cmsSettings?.themeName) {
        throw new Error('getThemeConfigs: !cmsSettings?.themeName')
    }

    let theme;
    try {
        theme = await findTheme(cmsSettings.themeName);
    } catch (error) {
        getLogger().error(error);
    }

    if (!theme) {
        getLogger().error(`Current theme ${cmsSettings?.themeName} was not registered in DB`);
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
        cmsSettings,
        themeInfo
    }
}
