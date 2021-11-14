import { TPagedList, TPagedParams, TPluginEntityInput } from '@cromwell/core';
import { EntityRepository } from 'typeorm';

import { PluginEntity } from '../models/entities/plugin.entity';
import { getLogger } from '../helpers/logger';
import { checkEntitySlug, handleBaseInput } from '../helpers/base-queries';
import { BaseRepository } from './base.repository';

const logger = getLogger();

@EntityRepository(PluginEntity)
export class PluginRepository extends BaseRepository<PluginEntity> {

    constructor() {
        super(PluginEntity)
    }

    async getPlugins(params: TPagedParams<PluginEntity>): Promise<TPagedList<PluginEntity>> {
        logger.log('PluginRepository::getPlugins');
        return this.getPaged(params);
    }

    async getPluginById(id: number): Promise<PluginEntity | undefined> {
        logger.log('PluginRepository::getPluginById id: ' + id);
        return this.getById(id);
    }

    async getPluginBySlug(slug: string): Promise<PluginEntity | undefined> {
        logger.log('PluginRepository::getPluginBySlug slug: ' + slug);
        return this.getBySlug(slug);
    }

    private async handleBasePluginInput(plugin: PluginEntity, input: TPluginEntityInput, action: 'update' | 'create') {
        await handleBaseInput(plugin, input);

        plugin.name = input.name;
        plugin.title = input.title;
        plugin.isInstalled = input.isInstalled;
        plugin.hasAdminBundle = input.hasAdminBundle;
        plugin.settings = input.settings;
        plugin.defaultSettings = input.defaultSettings;
        plugin.moduleInfo = input.moduleInfo;
        if (action === 'create') await plugin.save();
        await checkEntitySlug(plugin, PluginEntity);
    }

    async createPlugin(createPlugin: TPluginEntityInput): Promise<PluginEntity> {
        logger.log('PluginRepository::createPlugin');
        const plugin = new PluginEntity();

        await this.handleBasePluginInput(plugin, createPlugin, 'create');
        await this.save(plugin);
        return plugin;
    }

    async updatePlugin(id: number, updatePlugin: TPluginEntityInput): Promise<PluginEntity> {
        logger.log('PluginRepository::updatePlugin id: ' + id);
        const plugin = await this.getById(id);
        if (!plugin) throw new Error(`Plugin ${id} not found!`);

        await this.handleBasePluginInput(plugin, updatePlugin, 'update');
        await this.save(plugin);
        return plugin;
    }

    async deletePlugin(id: number): Promise<boolean> {
        logger.log('PluginRepository::deletePlugin; id: ' + id);

        const plugin = await this.getPluginById(id);
        if (!plugin) {
            logger.error('PluginRepository::deletePlugin failed to find Plugin by id');
            return false;
        }
        const res = await this.delete(id);
        return true;
    }

    async getPluginSettings<T>(pluginName: string): Promise<T | undefined> {
        const plugin = await this.findOne({
            where: {
                name: pluginName
            }
        })
        if (plugin?.settings) {
            return JSON.parse(plugin?.settings);
        }
    }

}