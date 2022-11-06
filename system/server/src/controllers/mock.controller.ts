import { getLogger } from '@cromwell/core-backend';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { MockService } from '../services/mock.service';

const logger = getLogger();

@ApiBearerAuth()
@ApiTags('Mock')
@Controller('v1/mock')
export class MockController {
  constructor(private readonly mockService: MockService) {}

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
  @ApiOperation({
    description: `Mock new products`,
    parameters: [{ name: 'amount', in: 'query', required: false }],
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async mockProducts(@Query('amount') amount: number): Promise<boolean> {
    logger.log('MockController::mockProducts');
    amount = parseInt(amount + '');
    return this.mockService.mockProducts(!isNaN(amount) ? amount : undefined);
  }

  @Get('categories')
  @ApiOperation({
    description: `Mock new categories`,
    parameters: [{ name: 'amount', in: 'query', required: false }],
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async mockCategories(@Query('amount') amount: number): Promise<boolean> {
    logger.log('MockController::mockCategories');
    amount = parseInt(amount + '');
    return this.mockService.mockCategories(!isNaN(amount) ? amount : undefined);
  }

  @Get('attributes')
  @ApiOperation({ description: 'Mock new attributes' })
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
  @ApiOperation({
    description: `Mock new product reviews`,
    parameters: [{ name: 'amount', in: 'query', required: false }],
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async mockReviews(@Query('amount') amount: number): Promise<boolean> {
    logger.log('MockController::mockReviews');
    amount = parseInt(amount + '');
    return this.mockService.mockReviews(!isNaN(amount) ? amount : undefined);
  }

  @Get('users')
  @ApiOperation({ description: 'Mock new users' })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async mockUsers(): Promise<boolean> {
    logger.log('MockController::mockUsers');

    return this.mockService.mockUsers();
  }

  @Get('tags')
  @ApiOperation({
    description: `Mock new tags`,
    parameters: [{ name: 'amount', in: 'query', required: false }],
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async mockTags(@Query('amount') amount: number): Promise<boolean> {
    logger.log('MockController::mockTags');
    amount = parseInt(amount + '');
    return this.mockService.mockTags(!isNaN(amount) ? amount : undefined);
  }

  @Get('posts')
  @ApiOperation({
    description: `Mock new posts`,
    parameters: [{ name: 'amount', in: 'query', required: false }],
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async mockPosts(@Query('amount') amount: number): Promise<boolean> {
    logger.log('MockController::mockPosts');
    amount = parseInt(amount + '');
    return this.mockService.mockPosts(!isNaN(amount) ? amount : undefined);
  }

  @Get('orders')
  @ApiOperation({
    description: `Mock new orders`,
    parameters: [{ name: 'amount', in: 'query', required: false }],
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async mockOrders(@Query('amount') amount: number): Promise<boolean> {
    logger.log('MockController::mockOrders');
    amount = parseInt(amount + '');
    return this.mockService.mockOrders(!isNaN(amount) ? amount : undefined);
  }
}
