import { logFor, TPagedList, TPagedParams, TPluginEntityInput } from '@cromwell/core';
import { EntityRepository } from 'typeorm';

import { PluginEntity } from '../entities/Plugin';
import { handleBaseInput } from './BaseQueries';
import { BaseRepository } from './BaseRepository';

@EntityRepository(PluginEntity)
export class PluginRepository extends BaseRepository<PluginEntity> {

    constructor() {
        super(PluginEntity)
    }

    async getPlugins(params: TPagedParams<PluginEntity>): Promise<TPagedList<PluginEntity>> {
        logFor('detailed', 'PluginRepository::getPlugins');
        return this.getPaged(params);
    }

    async getPluginById(id: string): Promise<PluginEntity | undefined> {
        logFor('detailed', 'PluginRepository::getPluginById id: ' + id);
        return this.getById(id);
    }

    async getPluginBySlug(slug: string): Promise<PluginEntity | undefined> {
        logFor('detailed', 'PluginRepository::getPluginBySlug slug: ' + slug);
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
        logFor('detailed', 'PluginRepository::createPlugin');
        let plugin = new PluginEntity();

        await this.handleBasePluginInput(plugin, createPlugin);

        plugin = await this.save(plugin);

        if (!plugin.slug) {
            plugin.slug = plugin.id;
            await this.save(plugin);
        }

        return plugin;
    }

    async updatePlugin(id: string, updatePlugin: TPluginEntityInput): Promise<PluginEntity> {
        logFor('detailed', 'PluginRepository::updatePlugin id: ' + id);

        let plugin = await this.findOne({
            where: { id }
        });
        if (!plugin) throw new Error(`Plugin ${id} not found!`);

        await this.handleBasePluginInput(plugin, updatePlugin);

        plugin = await this.save(plugin);
        return plugin;
    }

    async deletePlugin(id: string): Promise<boolean> {
        logFor('detailed', 'PluginRepository::deletePlugin; id: ' + id);

        const plugin = await this.getPluginById(id);
        if (!plugin) {
            console.log('PluginRepository::deletePlugin failed to find Plugin by id');
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