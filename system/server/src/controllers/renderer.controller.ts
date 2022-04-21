import { getLogger, JwtAuthGuard, DefaultPermissions } from '@cromwell/core-backend';
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
    @DefaultPermissions('all')
    @ApiOperation({
        description: `Gather all data for Renderer service required to render a page`,
        parameters: [
            { name: 'pageName', in: 'query', required: true },
            { name: 'themeName', in: 'query', required: true },
            { name: 'slug', in: 'query', required: false },
        ],
    })
    @ApiResponse({
        status: 200,
    })
    async getRendererData(@Query('pageName') pageName: string, @Query('themeName') themeName: string,
        @Query('slug') slug: string) {
        logger.log('RendererController::getRendererData', pageName, themeName);
        if (!pageName) throw new HttpException('Page name is not valid: ' + pageName,
            HttpStatus.NOT_ACCEPTABLE);
        if (!themeName) throw new HttpException('Theme name is not valid: ' + themeName,
            HttpStatus.NOT_ACCEPTABLE);

        return await this.rendererService.getRendererData(pageName, themeName, slug);
    }


    @Get('purge-page-cache')
    @UseGuards(JwtAuthGuard)
    @DefaultPermissions('all')
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
    @DefaultPermissions('all')
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