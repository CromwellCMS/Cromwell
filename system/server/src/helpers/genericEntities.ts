import { InputPluginEntity, InputThemeEntity, PluginEntity, ThemeEntity } from '@cromwell/core-backend';
import { TThemeEntity, TThemeEntityInput, TPluginEntity, TPluginEntityInput } from '@cromwell/core';

import { createResolver } from './createResolver';

export const GenericTheme = createResolver<TThemeEntity, TThemeEntityInput>('Theme', 'theme', ThemeEntity, InputThemeEntity);
export const GenericPlugin = createResolver<TPluginEntity, TPluginEntityInput>('Plugin', 'plugin', PluginEntity, InputPluginEntity);