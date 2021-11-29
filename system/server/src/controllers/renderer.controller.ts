import { getLogger, JwtAuthGuard, Roles } from '@cromwell/core-backend';
import { Controller, Get, HttpException, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RendererService } from '../services/renderer.service';

const logger = getLogger();

@ApiBearerAuth()
@ApiTags('Renderer')
@Controller('v1/renderer')
export class RendererController {

    constructor(
        private readonly rendererService: RendererService,
    ) { }


    @Get('page')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator')
    @ApiOperation({
        description: `Gather all data for Renderer service required to render a page`,
        parameters: [{ name: 'pageRoute', in: 'query', required: true }]
    })
    @ApiResponse({
        status: 200,
    })
    async getRendererData(@Query('pageRoute') pageRoute: string) {
        logger.log('RendererController::getRendererData');
        if (!pageRoute)
            throw new HttpException('Page route is not valid: ' + pageRoute, HttpStatus.NOT_ACCEPTABLE);

        return await this.rendererService.getRendererData(pageRoute);
    }


    @Get('purge-page-cache')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator')
    @ApiOperation({
        description: `Purge Next.js cache for a page`,
        parameters: [{ name: 'pageRoute', in: 'query', required: true }]
    })
    @ApiResponse({
        status: 200,
    })
    async purgePageCache(@Query('pageRoute') pageRoute: string) {
        logger.log('RendererController::purgePageCache');
        if (!pageRoute)
            throw new HttpException('Page route is not valid: ' + pageRoute, HttpStatus.NOT_ACCEPTABLE);

        await this.rendererService.purgePageCache(pageRoute);
        return true;
    }


    @Get('purge-entire-cache')
    @UseGuards(JwtAuthGuard)
    @Roles('administrator')
    @ApiOperation({
        description: `Purge Next.js entire pages cache`,
    })
    @ApiResponse({
        status: 200,
    })
    async purgeEntireCache() {
        logger.log('RendererController::purgeEntireCache');

        await this.rendererService.purgeEntireCache();
        return true;
    }
}