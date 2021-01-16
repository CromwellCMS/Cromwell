import { Injectable } from '@nestjs/common';
import { UserRepository } from '@cromwell/core-backend';
import { TUser } from '@cromwell/core';
import { getCustomRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { bcryptSaltRounds, TAuthUserInfo } from '../auth/constants';

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string): Promise<TUser | null> {

        const userRepository = getCustomRepository(UserRepository);
        const user = await userRepository.getUserByEmail(email);

        if (user) {
            const { password: passwordHash, ...result } = user;

            const isValid = await this.comparePassword(pass, passwordHash);
            if (isValid) return result;
        }
        return null;
    }

    async hashPassword(plain: string): Promise<string> {
        return bcrypt.hash(plain, bcryptSaltRounds);
    }

    async comparePassword(plain: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plain, hash);
    }

    generateToken(user: TAuthUserInfo): string {
        const payload = { username: user.email, sub: user.id };

        return this.jwtService.sign(payload);
    }
}