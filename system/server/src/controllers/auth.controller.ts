import { Body, Controller, Get, Post, Request, Response, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { TRequestWithUser } from '../auth/constants';
import { JwtAuthGuard } from '../auth/auth.guard';
import { LoginDto } from '../dto/login.dto';
import { UserDto } from '../dto/user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthService } from '../services/auth.service';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('login')
    @UseGuards(ThrottlerGuard)
    @Throttle(10, 20)
    @ApiOperation({
        description: 'Authenticates user',
    })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
        status: 200,
        type: UserDto
    })
    async login(@Request() req: TRequestWithUser, @Response() response: FastifyReply, @Body() input: LoginDto) {
        if (req.user?.id) return;

        const user = await this.authService.validateUser(input.email, input.password);
        if (!user) {
            throw new UnauthorizedException('Login failed');
        }
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role ?? 'customer',
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
        response.code(200).send(new UserDto().parseUser(user));
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


    @Post('sign-up')
    @UseGuards(ThrottlerGuard)
    @Throttle(4, 30)
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