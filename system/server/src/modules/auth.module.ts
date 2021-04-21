import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtAuthGuard } from '../auth/auth.guard';
import { AuthService } from '../services/auth.service';

@Global()
@Module({
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
