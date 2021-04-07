import { Arg, Query, Resolver } from 'type-graphql';
import { getManager } from 'typeorm';

import PluginNewsletter from '../entities/PluginNewsletter';


@Resolver(PluginNewsletter)
export default class PluginNewsletterResolver {

    @Query(() => [String])
    async pluginNewsletterExport(): Promise<string[]> {
        const newsletters = await getManager().find(PluginNewsletter);
        return newsletters?.map(news => news.email) ?? [];
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