import { logLevelMoreThan } from '@cromwell/core';
import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { MockService } from '../services/mock.service';


@ApiBearerAuth()
@ApiTags('Mock')
@Controller('mock')
export class MockController {

    constructor(private readonly mockService: MockService) { }

    @Get('products')
    @ApiOperation({ description: 'Delete all products and mock new' })
    @ApiResponse({
        status: 200,
        type: Boolean,
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async mockProducts(): Promise<boolean> {

        if (logLevelMoreThan('detailed')) console.log('MockController::mockProducts');

        return this.mockService.mockProducts();
    }


    @Get('categories')
    @ApiOperation({ description: 'Delete all categories and mock new' })
    @ApiResponse({
        status: 200,
        type: Boolean,
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async mockCategories(): Promise<boolean> {

        if (logLevelMoreThan('detailed')) console.log('MockController::mockCategories');

        return this.mockService.mockCategories();
    }


    @Get('attributes')
    @ApiOperation({ description: 'Delete all attributes and mock new' })
    @ApiResponse({
        status: 200,
        type: Boolean,
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async mockAttributes(): Promise<boolean> {

        if (logLevelMoreThan('detailed')) console.log('MockController::mockAttributes');

        return this.mockService.mockAttributes();
    }


    @Get('reviews')
    @ApiOperation({ description: 'Delete all product reviews and mock new' })
    @ApiResponse({
        status: 200,
        type: Boolean,
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async mockReviews(): Promise<boolean> {

        if (logLevelMoreThan('detailed')) console.log('MockController::mockReviews');

        return this.mockService.mockReviews();
    }
}