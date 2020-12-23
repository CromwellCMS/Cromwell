import { InputPluginEntity, InputThemeEntity, PluginEntity, ThemeEntity, CmsEntity } from '@cromwell/core-backend';
import { TThemeEntity, TThemeEntityInput, TPluginEntity, TPluginEntityInput, TCmsEntity  } from '@cromwell/core';

import { createResolver } from './createResolver';

export const GenericTheme = createResolver<TThemeEntity, TThemeEntityInput>('Theme', 'theme', ThemeEntity, InputThemeEntity);
export const GenericPlugin = createResolver<TPluginEntity, TPluginEntityInput>('Plugin', 'plugin', PluginEntity, InputPluginEntity);
export const GenericCms = createResolver<TCmsEntity>('Cms', 'cms', CmsEntity);