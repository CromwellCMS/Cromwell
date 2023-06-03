import { getLogger, TRequestWithUser, validateEmail } from '@cromwell/core-backend';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
  Response,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { FastifyReply } from 'fastify';

import { AccessTokensDto, UpdateAccessTokenDto, UpdateAccessTokenResponseDto } from '../dto/access-tokens.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { UserDto } from '../dto/user.dto';
import { TLoginInfo } from '../helpers/constants';
import { getDIService } from '../helpers/utils';
import { AuthService } from '../services/auth.service';

const logger = getLogger();

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  private authService = getDIService(AuthService);

  @Post('login')
  @Throttle(10, 30)
  @ApiOperation({
    description: 'Authenticates a human user via cookies.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    type: UserDto,
  })
  async login(@Request() req: TRequestWithUser, @Response() response: FastifyReply, @Body() input: LoginDto) {
    let authInfo: TLoginInfo = null;
    try {
      authInfo = await this.authService.logIn(input);
    } catch (error) {
      logger.log(error);
    }

    if (!authInfo) {
      response.status(403);
      response.send({ message: 'Login failed', statusCode: 403 });
      return;
    }

    req.user = authInfo.userInfo;

    if (authInfo.refreshToken && authInfo.accessToken) {
      await this.authService.setAccessTokenCookie(
        response,
        req,
        await this.authService.getAccessTokenInfo(authInfo.accessToken),
      );

      await this.authService.setRefreshTokenCookie(
        response,
        req,
        await this.authService.getRefreshTokenInfo(authInfo.refreshToken),
      );
    }
    response.code(200).send(authInfo.userDto);
  }

  @Post('log-out')
  @ApiOperation({
    description: 'Logs user out who was logged via cookies',
  })
  async logOut(@Request() request: TRequestWithUser, @Response() response: FastifyReply) {
    if (request.user) {
      try {
        await this.authService.removeRefreshTokens(request.user);
      } catch (error) {
        logger.log(error);
      }
    }

    await this.authService.clearTokenCookies(response, request);
    response.code(200).send(true);
  }

  @Post('get-tokens')
  @Throttle(10, 30)
  @ApiOperation({
    description: 'Get access/refresh tokens for programmatic API access',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 201,
    type: AccessTokensDto,
  })
  async getTokens(@Body() input: LoginDto): Promise<AccessTokensDto> {
    const authInfo = await this.authService.logIn(input);
    if (!authInfo) throw new UnauthorizedException('Login failed');

    return {
      accessToken: authInfo.accessToken,
      refreshToken: authInfo.refreshToken,
      user: authInfo.userDto,
    };
  }

  @Post('update-access-token')
  @Throttle(10, 30)
  @ApiOperation({
    description: 'Update access token using refresh token',
  })
  @ApiBody({ type: UpdateAccessTokenDto })
  @ApiResponse({
    status: 200,
    type: UpdateAccessTokenResponseDto,
  })
  async updateAccessToken(@Body() input: UpdateAccessTokenDto): Promise<UpdateAccessTokenResponseDto> {
    const refreshTokenPayload = await this.authService.validateRefreshToken(input.refreshToken);
    if (!refreshTokenPayload) throw new UnauthorizedException('updateAccessToken: Refresh token is not valid');

    const authUserInfo = this.authService.payloadToUserInfo(refreshTokenPayload);

    // Check if token is in DB and was not blacklisted
    const isValid = await this.authService.dbCheckRefreshToken(input.refreshToken, authUserInfo.id);
    if (!isValid) throw new UnauthorizedException('updateAccessToken: Refresh token is not valid');

    const newAccessToken = await this.authService.generateAccessToken(authUserInfo);

    return {
      accessToken: newAccessToken.token,
    };
  }

  @Post('sign-up')
  @Throttle(4, 40)
  @ApiOperation({
    description: 'Register new user',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    type: UserDto,
  })
  async signUp(@Body() input: CreateUserDto) {
    const user = await this.authService.signUpUser(input);
    if (!user) throw new HttpException('Failed to sign up', HttpStatus.INTERNAL_SERVER_ERROR);
    return new UserDto().parseUser(user);
  }

  @Post('forgot-password')
  @Throttle(8, 600)
  @ApiOperation({
    description: 'Send an e-mail with reset code for a user account',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    type: Boolean,
  })
  async forgotPassword(@Body() input: CreateUserDto) {
    if (!input?.email || !validateEmail(input.email))
      throw new HttpException('Email is not valid', HttpStatus.NOT_ACCEPTABLE);

    return this.authService.forgotUserPassword(input.email);
  }

  @Post('reset-password')
  @Throttle(6, 600)
  @ApiOperation({
    description: 'Set a new password for user with provided secret code',
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 201,
    type: Boolean,
  })
  async resetPassword(@Body() input: ResetPasswordDto) {
    if (!input?.email || !validateEmail(input.email))
      throw new HttpException('Email is not valid', HttpStatus.NOT_ACCEPTABLE);

    return this.authService.resetUserPassword(input);
  }

  @Get('user-info')
  @ApiOperation({
    description: 'Get info about currently logged in user',
  })
  @ApiResponse({
    status: 200,
    type: UserDto,
  })
  async getUserInfo(@Request() request: TRequestWithUser): Promise<UserDto | undefined> {
    if (!request.user?.id) throw new UnauthorizedException('user.id is not set for the request');

    const user = await this.authService.getUserById(request.user?.id);

    if (user) {
      return new UserDto().parseUser(user);
    }
  }
}
