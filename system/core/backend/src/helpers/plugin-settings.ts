import { TPluginEntity } from '@cromwell/core';
import { HttpException, HttpStatus } from '@nestjs/common';
import { getCustomRepository } from 'typeorm';

import { GenericPlugin } from './generic-entities';
import { getLogger } from './logger';

export const findPlugin = async (pluginName: string): Promise<TPluginEntity | undefined> => {
  const pluginRepo = getCustomRepository(GenericPlugin.repository);
  try {
    return await pluginRepo.findOne({
      where: {
        name: pluginName,
      },
    });
  } catch (error) {
    getLogger().error(error);
  }
};

export const savePlugin = (plugin: TPluginEntity): Promise<TPluginEntity> => {
  const pluginRepo = getCustomRepository(GenericPlugin.repository);
  return pluginRepo.save(plugin);
};

export const getPluginSettings = async <T>(pluginName: string): Promise<T | undefined> => {
  const plugin = await findPlugin(pluginName);

  if (!plugin) {
    getLogger().error(`getPluginSettings: Plugin ${pluginName} not found`);
    return;
  }

  let defaultSettings;
  let settings;
  try {
    if (plugin.defaultSettings) defaultSettings = JSON.parse(plugin.defaultSettings);
  } catch (e) {
    getLogger(false).error(e);
  }
  try {
    if (plugin.settings) settings = JSON.parse(plugin.settings);
  } catch (e) {
    getLogger(false).error(e);
  }

  return Object.assign({}, defaultSettings, settings);
};

export const savePluginSettings = async (pluginName: string, input: any) => {
  const plugin = await findPlugin(pluginName);

  if (!plugin) {
    throw new HttpException(`Plugin ${pluginName} was not found`, HttpStatus.NOT_FOUND);
  }

  plugin.settings = typeof input === 'string' ? input : JSON.stringify(input);
  await savePlugin(plugin);
  return true;
};
