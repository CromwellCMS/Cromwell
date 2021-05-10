import { TAuthRole } from '@cromwell/core';
import { Arg, Query, Resolver, Authorized } from 'type-graphql';
import { getManager } from 'typeorm';

import PluginNewsletter from '../entities/PluginNewsletter';


@Resolver(PluginNewsletter)
export default class PluginNewsletterResolver {

    @Authorized<TAuthRole>("administrator")
    @Query(() => [PluginNewsletter])
    async pluginNewsletterExport(): Promise<PluginNewsletter[]> {
        return await getManager().find(PluginNewsletter);
    }

    @Authorized<TAuthRole>("administrator")
    @Query(() => String)
    async pluginNewsletterStats(): Promise<string> {
        return (await getManager().find(PluginNewsletter) ?? []).length + '';
    }

    @Query(() => Boolean)
    async pluginNewsletterSubscribe(@Arg("email") email: string): Promise<boolean> {
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            return false;
        }

        const already = await getManager().findOne(PluginNewsletter, {
            where: {
                email
            }
        });
        if (already) return true;

        const newsletter = new PluginNewsletter();
        newsletter.email = email;
        await getManager().save(newsletter);
        return true;
    }
}