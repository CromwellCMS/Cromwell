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

    @Post('login')
    @ApiOperation({
        description: 'Authenticates user',
    })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
        status: 200,
        type: UserDto
    })
    async login(@Request() req: TRequestWithUser, @Response() response: FastifyReply, @Body() input: LoginDto) {

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

        const userDto: UserDto = {
            id: user.id + '',
            email: user.email,
            avatar: user.avatar,
            fullName: user.fullName,
            bio: user.bio,
            phone: user.phone,
            address: user.address,
            role: user.role,
        }

        response.code(200).send(userDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('log-out')
    @ApiOperation({
        description: 'Logs user out',
    })
    async logOut(@Request() request: TRequestWithUser, @Response() response: FastifyReply) {

        await this.authService.removeRefreshTokens(request.user);
        this.authService.clearTokenCookies(response, request);

        response.code(200).send(true);
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
            const userDto: UserDto = {
                id: user.id + '',
                email: user.email,
                avatar: user.avatar,
                fullName: user.fullName,
                bio: user.bio,
                phone: user.phone,
                address: user.address,
                role: user.role,
            }
            return userDto;
        }

    }

}