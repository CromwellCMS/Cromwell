import { setStoreItem, systemPackages, TCmsConfig, TCmsInfo, TCmsSettings } from '@cromwell/core';
import fs from 'fs-extra';

import { CmsEntity } from '../models/entities/cms.entity';
import { defaultCmsConfig } from './constants';
import { getLogger } from './logger';
import { getCmsConfigPath, getCmsConfigPathSync, getModulePackage } from './paths';

const getEnvConfig = () => {
  return JSON.parse(
    JSON.stringify({
      apiUrl: process.env.API_URL,
      adminUrl: process.env.ADMIN_URL,
      frontendUrl: process.env.FRONTEND_URL,
      centralServerUrl: process.env.CCS_URL,
    } as TCmsConfig),
  );
};

/**
 * Read CMS config from file in [project root]/cmsconfig.json, saves it into the store and returns
 */
export const readCMSConfigSync = (path?: string): TCmsConfig => {
  const logger = getLogger();
  const configPath = path ?? getCmsConfigPathSync();
  let customConfig;
  if (fs.pathExistsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8', flag: 'r' }));
      if (config && typeof config === 'object') customConfig = config;
    } catch (e) {
      logger.error('Failed to read CMS config at: ' + configPath + e, 'Error');
    }
  }
  return Object.assign({}, defaultCmsConfig, customConfig, getEnvConfig());
};

/**
 * Read CMS config from file in [project root]/cmsconfig.json, saves it into the store and returns
 */
export const readCMSConfig = async (path?: string): Promise<TCmsConfig> => {
  const logger = getLogger();
  const configPath = path ?? (await getCmsConfigPath());
  let customConfig;
  if (await fs.pathExists(configPath)) {
    try {
      const config: TCmsConfig | undefined = await fs.readJSON(configPath);
      if (config && typeof config === 'object') customConfig = config;
    } catch (e) {
      logger.error(e);
    }
  }
  const merged = Object.assign({}, defaultCmsConfig, customConfig, getEnvConfig());
  merged.defaultSettings = Object.assign({}, defaultCmsConfig?.defaultSettings, customConfig?.defaultSettings);
  return merged;
};

export const getCmsEntity = async (): Promise<CmsEntity> => {
  const entity = await CmsEntity.findOne();
  if (entity) return entity;

  // Probably CMS was launched for the first time and no settings persist in DB.
  // Create settings record
  const config = await readCMSConfig();
  const newEntity = Object.assign(new CmsEntity(), config?.defaultSettings);
  await newEntity.save();
  return newEntity;
};

let cmsConfig: TCmsConfig | undefined = undefined;

export const getCmsConfig = async (): Promise<TCmsConfig> => {
  if (!cmsConfig) cmsConfig = await readCMSConfig();
  return cmsConfig;
};

export const getCmsSettings = async (): Promise<TCmsSettings> => {
  // Read cmsconfig.json only once
  if (!cmsConfig) cmsConfig = await readCMSConfig();

  // Update info from DB on each call
  const entity = await getCmsEntity();
  const settings: TCmsSettings = Object.assign(
    {},
    {
      ...(cmsConfig.defaultSettings?.publicSettings ?? {}),
      ...(cmsConfig.defaultSettings?.adminSettings ?? {}),
      ...(cmsConfig.defaultSettings?.internalSettings ?? {}),
    },
    {
      ...(entity.publicSettings ?? {}),
      ...(entity.adminSettings ?? {}),
      ...(entity.internalSettings ?? {}),
    },
    cmsConfig,
    {
      redirects: [...(entity.publicSettings?.redirects ?? []), ...(cmsConfig?.redirects ?? [])],
      rewrites: [...(entity.publicSettings?.rewrites ?? []), ...(cmsConfig?.rewrites ?? [])],
    },
  );
  delete settings.defaultSettings;

  setStoreItem('cmsSettings', settings);
  return settings;
};

export const getCmsInfo = async (): Promise<TCmsInfo> => {
  const info = {
    packages: {},
  };

  for (const pckgName of systemPackages) {
    const pckg = await getModulePackage(pckgName);
    if (pckg?.name) {
      info.packages[pckg.name] = pckg.version;
    }
  }

  return info;
};
