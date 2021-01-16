import { logFor } from '@cromwell/core';
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

        logFor('detailed', 'MockController::mockProducts');

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

        logFor('detailed', 'MockController::mockCategories');

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

        logFor('detailed', 'MockController::mockAttributes');

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
        logFor('detailed', 'MockController::mockReviews');

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
        logFor('detailed', 'MockController::mockUsers');

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
        logFor('detailed', 'MockController::mockPosts');

        return this.mockService.mockPosts();
    }
    

}