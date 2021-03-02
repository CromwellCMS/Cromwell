import { apiV1BaseRoute, serviceLocator } from '@cromwell/core';
import { getLogger } from '@cromwell/core-backend';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import axios from 'axios';

const logger = getLogger('detailed');

@ApiBearerAuth()
@ApiTags('Manager')
@Controller('manager')
export class ManagerController {

    @Get('change-theme')
    @ApiOperation({
        parameters: [{ name: 'themeName', in: 'path' }],
        description: 'Requests Manager server to change theme. More info in http://localhost:4016/api/v1/api-docs/#/Services/get_services_change_theme__themeName_'
    })
    @ApiResponse({
        status: 200,
        type: Boolean,
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async changeTheme(@Param('themeName') themeName: string) {
        logger.log('ManagerController::changeTheme');

        const managerUrl = `${serviceLocator.getManagerUrl()}/${apiV1BaseRoute}/services/change-theme/${themeName}`;
        return axios.get(managerUrl);
    }


    @Get('rebuild-theme')
    @ApiOperation({
        description: 'Requests Manager server to rebuild current theme. More info in http://localhost:4016/api/v1/api-docs/#/Services/get_services_rebuild_theme'
    })
    @ApiResponse({
        status: 200,
        type: Boolean,
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async rebuildTheme() {
        logger.log('ManagerController::rebuildTheme');

        const managerUrl = `${serviceLocator.getManagerUrl()}/${apiV1BaseRoute}/services/rebuild-theme`;
        return axios.get(managerUrl);
    }
}