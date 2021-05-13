import { TPagedList, TPagedParams, TPluginEntityInput } from '@cromwell/core';
import { EntityRepository } from 'typeorm';

import { PluginEntity } from '../entities/Plugin';
import { getLogger } from '../helpers/logger';
import { checkEntitySlug, handleBaseInput } from './BaseQueries';
import { BaseRepository } from './BaseRepository';

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

    async getPluginById(id: string): Promise<PluginEntity | undefined> {
        logger.log('PluginRepository::getPluginById id: ' + id);
        return this.getById(id);
    }

    async getPluginBySlug(slug: string): Promise<PluginEntity | undefined> {
        logger.log('PluginRepository::getPluginBySlug slug: ' + slug);
        return this.getBySlug(slug);
    }

    private async handleBasePluginInput(plugin: PluginEntity, input: TPluginEntityInput) {
        handleBaseInput(plugin, input);

        plugin.name = input.name;
        plugin.title = input.title;
        plugin.isInstalled = input.isInstalled;
        plugin.hasAdminBundle = input.hasAdminBundle;
        plugin.settings = input.settings;
        plugin.defaultSettings = input.defaultSettings;
        plugin.moduleInfo = input.moduleInfo;
    }

    async createPlugin(createPlugin: TPluginEntityInput): Promise<PluginEntity> {
        logger.log('PluginRepository::createPlugin');
        let plugin = new PluginEntity();

        await this.handleBasePluginInput(plugin, createPlugin);

        plugin = await this.save(plugin);
        await checkEntitySlug(plugin, PluginEntity);

        return plugin;
    }

    async updatePlugin(id: string, updatePlugin: TPluginEntityInput): Promise<PluginEntity> {
        logger.log('PluginRepository::updatePlugin id: ' + id);

        let plugin = await this.findOne({
            where: { id }
        });
        if (!plugin) throw new Error(`Plugin ${id} not found!`);

        await this.handleBasePluginInput(plugin, updatePlugin);
        plugin = await this.save(plugin);
        await checkEntitySlug(plugin, PluginEntity);
        return plugin;
    }

    async deletePlugin(id: string): Promise<boolean> {
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