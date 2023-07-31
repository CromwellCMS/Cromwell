import { TPluginEntityInput, TThemeEntityInput } from '@cromwell/core';
import { Resolver } from 'type-graphql';

import { CmsEntity } from '../models/entities/cms.entity';
import { DashboardEntity } from '../models/entities/dashboard-entity.entity';
import { PluginEntity } from '../models/entities/plugin.entity';
import { ThemeEntity } from '../models/entities/theme.entity';
import { PluginInput } from '../models/inputs/plugin.input';
import { createGenericEntity } from './create-generic-entity';

export const GenericTheme = createGenericEntity<ThemeEntity, TThemeEntityInput>('Theme', ThemeEntity);
export const GenericPlugin = createGenericEntity<PluginEntity, TPluginEntityInput>('Plugin', PluginEntity, PluginInput);
export const GenericCms = createGenericEntity<CmsEntity>('Cms', CmsEntity);
export const DashboardLayout = createGenericEntity<DashboardEntity>('Dashboard', DashboardEntity);

@Resolver(ThemeEntity)
export class GenericThemeResolver extends GenericTheme.abstractResolver {}

@Resolver(PluginEntity)
export class GenericPluginResolver extends GenericPlugin.abstractResolver {}
