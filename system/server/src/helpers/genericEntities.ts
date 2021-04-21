import { TPluginEntity, TPluginEntityInput, TThemeEntity, TThemeEntityInput } from '@cromwell/core';
import {
    CmsEntity,
    createGenericEntity,
    InputCmsEntity,
    InputPluginEntity,
    InputThemeEntity,
    PluginEntity,
    ThemeEntity,
} from '@cromwell/core-backend';
import { Resolver } from 'type-graphql';

export const GenericTheme = createGenericEntity<TThemeEntity, TThemeEntityInput>('Theme', ThemeEntity, InputThemeEntity);
export const GenericPlugin = createGenericEntity<TPluginEntity, TPluginEntityInput>('Plugin', PluginEntity, InputPluginEntity);
export const GenericCms = createGenericEntity<CmsEntity, InputCmsEntity>('Cms', CmsEntity, InputCmsEntity);


@Resolver(ThemeEntity)
export class GenericThemeResolver extends GenericTheme.abstractResolver { }

@Resolver(PluginEntity)
export class GenericPluginResolver extends GenericPlugin.abstractResolver { }

@Resolver(CmsEntity)
export class GenericCmsResolver extends GenericCms.abstractResolver { }

