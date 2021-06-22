import { TPluginEntityInput, TThemeEntityInput } from '@cromwell/core';
import { CmsEntity, createGenericEntity, PluginEntity, PluginInput, ThemeEntity } from '@cromwell/core-backend';
import { Resolver } from 'type-graphql';

export const GenericTheme = createGenericEntity<ThemeEntity, TThemeEntityInput>('Theme', ThemeEntity);
export const GenericPlugin = createGenericEntity<PluginEntity, TPluginEntityInput>('Plugin', PluginEntity, PluginInput);
export const GenericCms = createGenericEntity<CmsEntity>('Cms', CmsEntity);


@Resolver(ThemeEntity)
export class GenericThemeResolver extends GenericTheme.abstractResolver { }

@Resolver(PluginEntity)
export class GenericPluginResolver extends GenericPlugin.abstractResolver { }
