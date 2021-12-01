import { JwtAuthGuard, Roles, TRequestWithUser } from '@cromwell/core-backend';
import { TUserRole } from '@cromwell/core';
import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Request,
    ForbiddenException,
    UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiForbiddenResponse, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { IsNotEmpty } from 'class-validator';
import { getManager } from 'typeorm';

import PluginNewsletter from '../entities/newsletter-form.entity';


class PluginNewsletterSubscription {
    @IsNotEmpty()
    @ApiProperty()
    email: string;
}

@ApiTags('PluginNewsletter')
@Controller('plugin-newsletter')
class PluginNewsletterController {

    @Post('subscribe')
    /** Use ThrottlerGuard to limit number of requests from one IP address. Allow max 4 requests in 20 seconds: */
    @UseGuards(ThrottlerGuard)
    @Throttle(4, 20)
    @ApiOperation({ description: 'Post email to subscribe for newsletters' })
    @ApiResponse({
        status: 200,
        type: Boolean,
    })
    @ApiBody({ type: PluginNewsletterSubscription })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async placeSubscription(@Body() input: PluginNewsletterSubscription): Promise<boolean | undefined> {
        const email = input?.email;
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            throw new HttpException(`Invalid email`, HttpStatus.BAD_REQUEST);
        }

        const hasSubscribed = await getManager().findOne(PluginNewsletter, {
            where: {
                email
            }
        });
        if (hasSubscribed) return true;

        const newsletter = new PluginNewsletter();
        newsletter.email = email;
        await getManager().save(newsletter);
        return true;
    }


    /** 
     * The same method as pluginNewsletterStats in PluginNewsletterResolver. 
     * Added for documentation purposes of custom Controllers.
     * */
    @Get('stats')
    /** You can restrict route by assigning JwtAuthGuard and passing allowed roles as a decorator: */
    @UseGuards(JwtAuthGuard)
    @Roles('administrator', 'guest', 'author')
    @ApiOperation({ description: 'Get newsletters count' })
    @ApiResponse({
        status: 200,
        type: String,
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async getStats(@Request() request: TRequestWithUser): Promise<string> {

        // Or you can retrieve user info and validate permissions in the method:
        const allowedRoles: TUserRole[] = ['administrator', 'guest', 'author'];
        if (!allowedRoles.includes(request.user?.role))
            throw new ForbiddenException('Forbidden');

        return (await getManager().find(PluginNewsletter) ?? []).length + '';
    }

}

export default PluginNewsletterController;