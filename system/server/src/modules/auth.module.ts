import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Global()
@Module({
    controllers: [AuthController],
    imports: [
        JwtModule.register({
            signOptions: {
                algorithm: 'HS256'
            },
        }),
    ],
    providers: [AuthService, JwtAuthGuard],
    exports: [AuthService],
})
export class AuthModule { }
