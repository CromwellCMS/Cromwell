import { TAuthRole } from '@cromwell/core';
import { TGraphQLContext } from '@cromwell/core-backend';
import { UnauthorizedException } from '@nestjs/common';
import { Authorized, Ctx, Query, Resolver } from 'type-graphql';
import { getManager } from 'typeorm';

import PluginNewsletter from '../entities/PluginNewsletter';


@Resolver(PluginNewsletter)
export default class PluginNewsletterResolver {

    @Authorized<TAuthRole>("administrator", 'guest')
    @Query(() => [PluginNewsletter])
    async pluginNewsletterExport(): Promise<PluginNewsletter[]> {
        return await getManager().find(PluginNewsletter);
    }

    /** Restrict via decorator: */
    @Authorized<TAuthRole>("administrator", 'guest')
    @Query(() => String)
    async pluginNewsletterStats(@Ctx() ctx: TGraphQLContext): Promise<string> {
        
        // Or via checking manually user info: (both methods will work independently)
        if (ctx.user?.role !== 'administrator')
            throw new UnauthorizedException('Forbidden');

        return (await getManager().find(PluginNewsletter) ?? []).length + '';
    }
}