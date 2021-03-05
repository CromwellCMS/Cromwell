import { getLogger } from '@cromwell/core-backend';
import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { MockService } from '../services/mock.service';

const logger = getLogger('detailed');

@ApiBearerAuth()
@ApiTags('Mock')
@Controller('mock')
export class MockController {

    constructor(private readonly mockService: MockService) { }

    @Get('all')
    @ApiOperation({ description: 'Use all available mocks' })
    @ApiResponse({
        status: 200,
        type: Boolean,
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async mockAll(): Promise<boolean> {
        logger.log('MockController::mockAll');

        return this.mockService.mockAll();
    }

    @Get('products')
    @ApiOperation({ description: 'Delete all products and mock new' })
    @ApiResponse({
        status: 200,
        type: Boolean,
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async mockProducts(): Promise<boolean> {

        logger.log('MockController::mockProducts');

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

        logger.log('MockController::mockCategories');

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

        logger.log('MockController::mockAttributes');

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
        logger.log('MockController::mockReviews');

        return this.mockService.mockReviews();
    }


    @Get('users')
    @ApiOperation({ description: 'Delete all users and mock new' })
    @ApiResponse({
        status: 200,
        type: Boolean,
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async mockUsers(): Promise<boolean> {
        logger.log('MockController::mockUsers');

        return this.mockService.mockUsers();
    }


    @Get('posts')
    @ApiOperation({ description: 'Delete all posts and mock new' })
    @ApiResponse({
        status: 200,
        type: Boolean,
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async mockPosts(): Promise<boolean> {
        logger.log('MockController::mockPosts');

        return this.mockService.mockPosts();
    }

    
    @Get('orders')
    @ApiOperation({ description: 'Delete all store orders and mock new' })
    @ApiResponse({
        status: 200,
        type: Boolean,
    })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async mockOrders(): Promise<boolean> {
        logger.log('MockController::mockOrders');

        return this.mockService.mockOrders();
    }



}