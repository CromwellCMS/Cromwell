import { JwtAuthGuard } from '@cromwell/core-backend';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from '../services/auth.service';
import { RestApiModule } from './restapi.module';

@Global()
@Module({
    imports: [
        JwtModule.register({
            signOptions: {
                algorithm: 'HS256'
            },
        }),
        RestApiModule,
    ],
    providers: [AuthService, JwtAuthGuard],
    exports: [AuthService],
})
export class AuthModule { }
