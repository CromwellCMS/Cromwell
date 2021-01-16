import { Controller, Post, Request, UseGuards, Get } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from '../dto/Login.dto';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TAuthUserInfo } from '../auth/constants';
import { AuthService } from '../services/auth.service';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @ApiOperation({
        description: 'Authenticates user',
    })
    @ApiBody({ type: LoginDto })
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: {
        user: TAuthUserInfo
    }) {
        return this.authService.generateToken(req.user);
    }

}