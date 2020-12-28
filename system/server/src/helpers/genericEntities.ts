import { TCmsEntity, TPluginEntity, TPluginEntityInput, TThemeEntity, TThemeEntityInput, TCmsEntityInput } from '@cromwell/core';
import { CmsEntity, InputPluginEntity, InputThemeEntity, PluginEntity, ThemeEntity, InputCmsEntity } from '@cromwell/core-backend';
import { Resolver } from 'type-graphql';

import { createGenericEntity } from './createResolver';


export const GenericTheme = createGenericEntity<TThemeEntity, TThemeEntityInput>('Theme', 'theme', ThemeEntity, InputThemeEntity);
export const GenericPlugin = createGenericEntity<TPluginEntity, TPluginEntityInput>('Plugin', 'plugin', PluginEntity, InputPluginEntity);
export const GenericCms = createGenericEntity<TCmsEntity, TCmsEntityInput>('Cms', 'cms', CmsEntity, InputCmsEntity);


@Resolver(ThemeEntity)
export class GenericThemeResolver extends GenericTheme.abstractResolver { }

@Resolver(PluginEntity)
export class GenericPluginResolver extends GenericPlugin.abstractResolver { }

@Resolver(CmsEntity)
export class GenericCmsResolver extends GenericCms.abstractResolver { }