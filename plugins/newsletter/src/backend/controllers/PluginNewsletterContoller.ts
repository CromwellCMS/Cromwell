import { JwtAuthGuard, Roles } from '@cromwell/core-backend';
import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { ApiBody, ApiForbiddenResponse, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { IsNotEmpty } from 'class-validator';
import { getManager } from 'typeorm';

import PluginNewsletter from '../entities/PluginNewsletter';


class Subscription {
    @IsNotEmpty()
    @ApiProperty()
    email: string;
}

@ApiTags('PluginNewsletter')
@Controller('plugin-newsletter')
class PluginNewsletterController {

    @Post('subscribe')
    @UseGuards(ThrottlerGuard)
    @Throttle(4, 20)
    @ApiOperation({ description: 'Post email to subscribe for newsletters' })
    @ApiResponse({
        status: 200,
        type: Boolean,
    })
    @ApiBody({ type: Subscription })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async placeSubscription(@Body() input: Subscription): Promise<boolean | undefined> {
        const email = input?.email;
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

    @Get('stats')
    @ApiOperation({ description: 'Get newsletters count' })
    @ApiResponse({
        status: 200,
        type: String,
    })
    @UseGuards(JwtAuthGuard)
    @Roles('administrator', 'guest')
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async getStats(): Promise<string> {
        return (await getManager().find(PluginNewsletter) ?? []).length + '';
    }

}

export default PluginNewsletterController;