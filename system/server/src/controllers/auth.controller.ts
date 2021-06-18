import { JwtAuthGuard, validateEmail, TRequestWithUser } from '@cromwell/core-backend';
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
    UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { FastifyReply } from 'fastify';

import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { AccessTokensDto, UpdateAccessTokenDto, UpdateAccessTokenResponseDto } from '../dto/access-tokens.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { UserDto } from '../dto/user.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('login')
    @UseGuards(ThrottlerGuard)
    @Throttle(10, 30)
    @ApiOperation({
        description: 'Authenticates a human user via cookies.',
    })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
        status: 200,
        type: UserDto
    })
    async login(@Request() req: TRequestWithUser, @Response() response: FastifyReply, @Body() input: LoginDto) {

        const authInfo = await this.authService.logIn(input);

        if (!authInfo) {
            response.status(403);
            response.send({ message: 'Login failed', statusCode: 403 });
            return;
        }

        req.user = authInfo.userInfo;

        if (authInfo.refreshToken && authInfo.accessToken) {
            this.authService.setAccessTokenCookie(response, req,
                this.authService.getAccessTokenInfo(authInfo.accessToken));

            this.authService.setRefreshTokenCookie(response, req,
                this.authService.getRefreshTokenInfo(authInfo.refreshToken));
        }
        response.code(200).send(authInfo.userDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('log-out')
    @ApiOperation({
        description: 'Logs user out who was logged via cookies',
    })
    async logOut(@Request() request: TRequestWithUser, @Response() response: FastifyReply) {
        if (request.user)
            await this.authService.removeRefreshToken(request.user);

        this.authService.clearTokenCookies(response, request);

        response.code(200).send(true);
    }


    @Post('get-tokens')
    @UseGuards(ThrottlerGuard)
    @Throttle(10, 30)
    @ApiOperation({
        description: 'Get access/refresh tokens for programmatic API access',
    })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
        status: 200,
        type: AccessTokensDto
    })
    async getTokens(@Body() input: LoginDto): Promise<AccessTokensDto> {
        const authInfo = await this.authService.logIn(input);
        if (!authInfo) throw new UnauthorizedException('Login failed');

        return {
            accessToken: authInfo.accessToken,
            refreshToken: authInfo.refreshToken,
            user: authInfo.userDto,
        }
    }

    @Post('update-access-token')
    @UseGuards(ThrottlerGuard)
    @Throttle(10, 30)
    @ApiOperation({
        description: 'Update access token using refresh token',
    })
    @ApiBody({ type: UpdateAccessTokenDto })
    @ApiResponse({
        status: 200,
        type: UpdateAccessTokenResponseDto
    })
    async updateAccessToken(@Body() input: UpdateAccessTokenDto): Promise<UpdateAccessTokenResponseDto> {

        const refreshTokenPayload = await this.authService.validateRefreshToken(input.refreshToken);
        if (!refreshTokenPayload)
            throw new UnauthorizedException('Refresh token is not valid');

        const authUserInfo = this.authService.payloadToUserInfo(refreshTokenPayload);

        // Check if token is in DB and was not blacklisted
        const isValid = await this.authService.dbCheckRefreshToken(input.refreshToken, authUserInfo);
        if (!isValid)
            throw new UnauthorizedException('Refresh token is not valid');

        const newAccessToken = await this.authService.generateAccessToken(authUserInfo);

        return {
            accessToken: newAccessToken.token,
        }
    }


    @Post('sign-up')
    @UseGuards(ThrottlerGuard)
    @Throttle(4, 40)
    @ApiOperation({
        description: 'Register new user',
    })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({
        status: 201,
        type: UserDto
    })
    async signUp(@Request() request: TRequestWithUser, @Response() response: FastifyReply, @Body() input: CreateUserDto) {
        const user = await this.authService.signUpUser(input, request.user);
        response.code(201).send(new UserDto().parseUser(user));
    }


    @Post('forgot-password')
    @UseGuards(ThrottlerGuard)
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
    @UseGuards(ThrottlerGuard)
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


    @UseGuards(JwtAuthGuard)
    @Get('user-info')
    @ApiOperation({
        description: 'Get info about currently logged in user',
    })
    @ApiResponse({
        status: 200,
        type: UserDto
    })
    async getUserInfo(@Request() request: TRequestWithUser): Promise<UserDto | undefined> {
        if (!request.user?.id)
            throw new UnauthorizedException('user.id is not set for the request');

        const user = await this.authService.getUserById(request.user?.id);
        if (user) {
            return new UserDto().parseUser(user);
        }
    }
}
