import { matchPermissions } from '@cromwell/core';
import { TGraphQLContext } from '@cromwell/core-backend';
import { ForbiddenException } from '@nestjs/common';
import { Authorized, Ctx, Query, Resolver } from 'type-graphql';
import { getManager } from 'typeorm';

import { newsletterPermissions } from '../auth';
import PluginNewsletter from '../entities/newsletter-form.entity';


@Resolver(PluginNewsletter)
export default class PluginNewsletterResolver {

    @Authorized(newsletterPermissions.export.name)
    @Query(() => [PluginNewsletter])
    async pluginNewsletterExport(): Promise<PluginNewsletter[]> {
        return await getManager().find(PluginNewsletter);
    }

    /** Restrict via decorator: */
    @Authorized(newsletterPermissions.stats.name)
    @Query(() => String)
    async pluginNewsletterStats(@Ctx() ctx: TGraphQLContext): Promise<string> {

        // Or via checking manually user info: (both methods can work independently)
        if (!matchPermissions(ctx.user, [newsletterPermissions.stats as any]))
            throw new ForbiddenException('Forbidden');

        return (await getManager().find(PluginNewsletter) ?? []).length + '';
    }
}