import { Body, Controller, Get, Post, Request, Response, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

import { TRequestWithUser } from '../auth/constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LoginDto } from '../dto/login.dto';
import { UserDto } from '../dto/user.dto';
import { AuthService } from '../services/auth.service';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @ApiOperation({
        description: 'Authenticates user',
    })
    @ApiBody({ type: LoginDto })
    @Post('login')
    async login(@Request() req: TRequestWithUser, @Response() response: FastifyReply, @Body() input: LoginDto) {
        if (typeof input === 'string') {
            input = JSON.parse(input);
        }

        const user = await this.authService.validateUser(input.email, input.password);
        if (!user) {
            throw new UnauthorizedException('Login failed');
        }
        req.user = {
            id: user.id,
            email: user.email
        }

        const [accessToken, refreshToken] = await Promise.all([
            this.authService.generateAccessToken(req.user),
            this.authService.generateRefreshToken(req.user),
        ]);

        await this.authService.saveRefreshToken(req.user, refreshToken.token);

        if (refreshToken && accessToken) {
            this.authService.setAccessTokenCookie(response, req, accessToken);
            this.authService.setRefreshTokenCookie(response, req, refreshToken);
        }

        response.code(200).send(true);
    }

    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        description: 'Logs user out',
    })
    @Post('log-out')
    async logOut(@Request() request: TRequestWithUser, @Response() response: FastifyReply) {

        await this.authService.removeRefreshTokens(request.user);
        this.authService.clearTokenCookies(response, request);

        response.code(200).send(true);
    }

    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        description: 'Get info about currently logged in user',
    })
    @ApiResponse({
        status: 200,
        type: UserDto
    })
    @Get('user-info')
    async getUserInfo(@Request() request: TRequestWithUser): Promise<UserDto | undefined> {
        if (!request.user?.id)
            throw new UnauthorizedException('user.id is not set for the request');

        const user = await this.authService.getUserById(request.user?.id);
        if (user) {
            const userDto: UserDto = {
                id: user.id,
                email: user.email,
                avatar: user.avatar,
                fullName: user.fullName,
            }
            return userDto;
        }

    }

}