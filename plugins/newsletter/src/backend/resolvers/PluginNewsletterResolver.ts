import { TAuthRole } from '@cromwell/core';
import { Authorized, Query, Resolver } from 'type-graphql';
import { getManager } from 'typeorm';

import PluginNewsletter from '../entities/PluginNewsletter';


@Resolver(PluginNewsletter)
export default class PluginNewsletterResolver {

    @Authorized<TAuthRole>("administrator", 'guest')
    @Query(() => [PluginNewsletter])
    async pluginNewsletterExport(): Promise<PluginNewsletter[]> {
        return await getManager().find(PluginNewsletter);
    }

    @Authorized<TAuthRole>("administrator", 'guest')
    @Query(() => String)
    async pluginNewsletterStats(): Promise<string> {
        return (await getManager().find(PluginNewsletter) ?? []).length + '';
    }
}