import { sleep, TCreateUser, TRole } from '@cromwell/core';
import {
  bcryptSaltRounds,
  getAuthSettings,
  getBcrypt,
  getCmsSettings,
  getCurrentRoles,
  getEmailTemplate,
  getLogger,
  getUserRole,
  sendEmail,
  TAuthSettings,
  TAuthUserInfo,
  TRequestWithUser,
  TTokenInfo,
  TTokenPayload,
  User,
  UserRepository,
} from '@cromwell/core-backend';
import { HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import cryptoRandomString from 'crypto-random-string';
import { FastifyReply } from 'fastify';
import { Service } from 'typedi';
import { getCustomRepository } from 'typeorm';
import jwt from 'jsonwebtoken';

import { LoginDto } from '../dto/login.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { UserDto } from '../dto/user.dto';
import { TLoginInfo } from '../helpers/constants';

const logger = getLogger();

@Service()
export class AuthService {
  private resetPasswordAttempts: Record<
    string,
    {
      attempts: number;
      firstDate: Date;
    }
  > = {};

  private tokensDelimiter = '$$';
  private authSettings: Promise<TAuthSettings>;

  constructor() {
    this.init();
  }

  private init() {
    this.authSettings = new Promise((res) => {
      getAuthSettings().then((settings) => res(settings));
    });
  }

  async validateUser(email: string, pass: string): Promise<User | null> {
    const userRepository = getCustomRepository(UserRepository);

    try {
      const user = await userRepository.getUserByEmail(email);

      if (user) {
        const isValid = await this.comparePassword(pass, user.password);
        if (isValid) return user;
      }
    } catch (e) {
      logger.log(e);
    }

    return null;
  }

  getUserById = (id: number) => getCustomRepository(UserRepository).getUserById(id);

  async logIn(input: LoginDto): Promise<TLoginInfo> {
    const user = await this.validateUser(input.email, input.password);

    if (!user?.roles?.length) return null;

    const roles = user?.roles?.filter((r) => r && r.isEnabled !== false) as TRole[];
    if (!roles.length) return null;

    const userInfo: TAuthUserInfo = {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };

    let validated: string[] = [];
    if (user.refreshTokens) {
      const tokens = user.refreshTokens.split(this.tokensDelimiter);

      validated = (
        await Promise.all(
          tokens.map(async (token) => {
            const isValid = await this.validateRefreshToken(token);
            if (isValid) return token;
          }),
        )
      ).filter(Boolean) as string[];
    }

    const refreshToken = validated[0] ?? (await this.generateRefreshToken(userInfo)).token;
    const accessToken = (await this.generateAccessToken(userInfo)).token;

    if (!validated.length) {
      await this.saveRefreshToken(userInfo, refreshToken);
    }

    return {
      accessToken,
      refreshToken,
      userInfo,
      userDto: new UserDto().parseUser(user),
    };
  }

  async signUpUser(data: TCreateUser) {
    const settings = await getCmsSettings();
    if (!settings?.signupEnabled)
      throw new HttpException('Sign up is not enabled for this website', HttpStatus.BAD_REQUEST);

    if (!data?.roles?.length) throw new HttpException('You must specify user roles', HttpStatus.BAD_REQUEST);

    if (!data.roles.every((role) => (settings?.signupRoles ?? []).includes(role)))
      throw new HttpException('Specified user roles are not available for sign up', HttpStatus.BAD_REQUEST);

    return this.createUser(data);
  }

  async createUser(data: TCreateUser) {
    if (!data.password) throw new HttpException('You must provide a password for the user', HttpStatus.BAD_REQUEST);
    const userRepo = getCustomRepository(UserRepository);
    return userRepo.createUser(data);
  }

  async forgotUserPassword(email: string) {
    const userRepo = getCustomRepository(UserRepository);
    const user = await userRepo.getUserByEmail(email);
    if (!user?.id) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);

    const secretCode = cryptoRandomString({ length: 6, type: 'numeric' });

    user.resetPasswordCode = secretCode;
    user.resetPasswordDate = new Date(Date.now());
    await user.save();

    const compiledMail = await getEmailTemplate('forgot-password.hbs', {
      resetCode: secretCode,
    });
    if (!compiledMail) {
      logger.error('forgot-password.hbs template was not found');
      throw new HttpException('forgot-password.hbs template was not found', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return await sendEmail([email], 'Forgot password', compiledMail);
  }

  async resetUserPassword(input: ResetPasswordDto) {
    const userRepo = getCustomRepository(UserRepository);
    const user = await userRepo.getUserByEmail(input.email);
    const errMessage = 'User not found or reset code is not valid';
    if (!user?.id || !user.resetPasswordCode || !user.resetPasswordDate || !user.email)
      throw new HttpException(errMessage, HttpStatus.BAD_REQUEST);

    const resetUserCode = async () => {
      if (!user) return;
      user.resetPasswordDate = null;
      user.resetPasswordCode = null;
      await user.save();
    };

    if (!this.resetPasswordAttempts[user.email]) {
      this.resetPasswordAttempts[user.email] = {
        attempts: 1,
        firstDate: new Date(Date.now()),
      };
      this.memoryLeakChecker();
    } else {
      this.resetPasswordAttempts[user.email].attempts++;

      if (this.resetPasswordAttempts[user.email].attempts > (await this.authSettings).resetPasswordAttempts) {
        logger.warn('Exceeded reset password attempts');
        delete this.resetPasswordAttempts[user.email];
        await resetUserCode();
        throw new HttpException('Exceeded reset password attempts', HttpStatus.EXPECTATION_FAILED);
      }
    }

    if (
      user.resetPasswordDate.getTime() + (await this.authSettings).resetPasswordCodeExpirationAccessTime <
      new Date(Date.now()).getTime()
    ) {
      logger.warn('Tried to reset password with expired code');
      await resetUserCode();
      throw new HttpException(errMessage, HttpStatus.BAD_REQUEST);
    }

    if (input.code !== user.resetPasswordCode) {
      logger.warn('Tried to reset password with invalid code');
      throw new HttpException(errMessage, HttpStatus.BAD_REQUEST);
    }

    user.password = await this.hashPassword(input.newPassword);
    await resetUserCode();
    return true;
  }

  async hashPassword(plain: string): Promise<string> {
    return getBcrypt().hash(plain, bcryptSaltRounds);
  }

  async comparePassword(plain: string, hash: string): Promise<boolean> {
    return getBcrypt().compare(plain, hash);
  }

  payloadToUserInfo(payload: TTokenPayload): TAuthUserInfo {
    const roleNames: string[] = payload.roles && JSON.parse(payload.roles);
    if (!payload.username || !payload.sub || !roleNames?.length)
      throw new UnauthorizedException('payloadToUserInfo: Payload is not valid');

    const roles = roleNames.map(getUserRole).filter((r) => r && r.isEnabled !== false) as TRole[];
    if (!roles.length) {
      logger.log('Current roles: ', getCurrentRoles(), 'Payload roles: ', roleNames);
      throw new UnauthorizedException('User has no valid roles for authentication');
    }

    return {
      id: payload.sub,
      email: payload.username,
      roles,
    };
  }

  async generateAccessToken(user: TAuthUserInfo) {
    const payload: TTokenPayload = {
      username: user.email,
      sub: user.id,
      roles: JSON.stringify(user.roles.map((r) => r.name).filter(Boolean) as string[]),
    };

    const token = jwt.sign(payload, (await this.authSettings).accessSecret, {
      expiresIn: (await this.authSettings).expirationAccessTime + 's',
    });

    return {
      token,
      maxAge: (await this.authSettings).expirationAccessTime + '',
      cookie: `${(await this.authSettings).accessTokenCookieName}=${token}; HttpOnly; Path=/; Max-Age=${
        (await this.authSettings).expirationAccessTime
      }`,
    };
  }

  async getAccessTokenInfo(token: string): Promise<TTokenInfo> {
    return {
      token,
      maxAge: (await this.authSettings).expirationAccessTime + '',
      cookie: `${(await this.authSettings).accessTokenCookieName}=${token}; HttpOnly; Path=/; Max-Age=${
        (await this.authSettings).expirationAccessTime
      }`,
    };
  }

  async generateRefreshToken(userInfo: TAuthUserInfo): Promise<TTokenInfo> {
    const payload: TTokenPayload = {
      username: userInfo.email,
      sub: userInfo.id,
      roles: JSON.stringify(userInfo.roles.map((r) => r.name).filter(Boolean) as string[]),
    };
    // Generate new token and save to DB
    const token = jwt.sign(payload, (await this.authSettings).refreshSecret, {
      expiresIn: (await this.authSettings).expirationRefreshTime + 's',
    });

    return {
      token,
      maxAge: (await this.authSettings).expirationRefreshTime + '',
      cookie: `${(await this.authSettings).refreshTokenCookieName}=${token}; HttpOnly; Path=/; Max-Age=${
        (await this.authSettings).expirationRefreshTime
      }`,
    };
  }

  async getRefreshTokenInfo(token: string): Promise<TTokenInfo> {
    return {
      token,
      maxAge: (await this.authSettings).expirationRefreshTime + '',
      cookie: `${(await this.authSettings).refreshTokenCookieName}=${token}; HttpOnly; Path=/; Max-Age=${
        (await this.authSettings).expirationRefreshTime
      }`,
    };
  }

  async saveRefreshToken(userInfo: TAuthUserInfo, newToken: string, user?: User) {
    if (!user) user = await getCustomRepository(UserRepository).getUserById(userInfo.id);
    if (!user) {
      return false;
    }
    let tokens = (user.refreshTokens ?? '').split(this.tokensDelimiter);
    tokens.push(newToken);
    if (tokens.length > 10) {
      tokens = tokens.slice(tokens.length - 10, tokens.length);
    }

    user.refreshTokens = tokens.join(this.tokensDelimiter);
    await getCustomRepository(UserRepository).save(user);
    return true;
  }

  async removeRefreshTokens(userInfo: TAuthUserInfo) {
    const user = await getCustomRepository(UserRepository).getUserById(userInfo.id);
    if (!user) {
      return;
    }
    user.refreshTokens = null;
    await getCustomRepository(UserRepository).save(user);
  }

  async updateRefreshToken(userInfo: TAuthUserInfo, user?: User) {
    const newToken = await this.generateRefreshToken(userInfo);
    const success = await this.saveRefreshToken(userInfo, newToken.token, user);
    if (success) return newToken;
  }

  async validateAccessToken(accessToken: string): Promise<TTokenPayload | undefined> {
    try {
      return (await jwt.verify(accessToken, (await this.authSettings).accessSecret)) as any;
    } catch (e) {
      // logger.error(e);
    }
  }

  async validateRefreshToken(refreshToken: string): Promise<TTokenPayload | undefined> {
    try {
      return (await jwt.verify(refreshToken, (await this.authSettings).refreshSecret)) as any;
    } catch (e) {
      logger.log(e);
    }
  }

  async dbCheckRefreshToken(refreshToken: string, userId: number): Promise<User | undefined> {
    try {
      const user = await getCustomRepository(UserRepository).getUserById(userId);
      if (!user?.refreshTokens) {
        return undefined;
      }

      const tokens = user.refreshTokens.split(this.tokensDelimiter);
      if (tokens.includes(refreshToken)) return user;
    } catch (e) {
      logger.log(e);
    }
    return undefined;
  }

  async getCookiesForLogOut() {
    return [
      `${(await this.authSettings).accessTokenCookieName}=; HttpOnly; Path=/; Max-Age=0`,
      `${(await this.authSettings).refreshTokenCookieName}=; HttpOnly; Path=/; Max-Age=0`,
    ];
  }

  getDomainFromRequest(request: TRequestWithUser) {
    let domain;
    if (request.hostname.includes('localhost')) {
      domain = 'localhost';
    }
    return domain;
  }

  async setAccessTokenCookie(response, request: TRequestWithUser, token: TTokenInfo) {
    try {
      response.setCookie((await this.authSettings).accessTokenCookieName, token.token, {
        path: '/',
        maxAge: token.maxAge,
        httpOnly: true,
      });
    } catch (error) {
      logger.error(error);
    }
  }

  async setRefreshTokenCookie(response, request: TRequestWithUser, token: TTokenInfo) {
    try {
      response.setCookie((await this.authSettings).refreshTokenCookieName, token.token, {
        path: '/',
        maxAge: token.maxAge,
        httpOnly: true,
      });
    } catch (error) {
      logger.error(error);
    }
  }

  async clearTokenCookies(response, request: TRequestWithUser) {
    try {
      response.clearCookie((await this.authSettings).accessTokenCookieName, {
        path: '/',
        httpOnly: true,
        domain: this.getDomainFromRequest(request),
      });
      response.clearCookie((await this.authSettings).refreshTokenCookieName, {
        path: '/',
        httpOnly: true,
        domain: this.getDomainFromRequest(request),
      });
    } catch (error) {
      logger.error(error);
    }
  }

  async processRequest(request: TRequestWithUser, response: FastifyReply): Promise<TAuthUserInfo | null> {
    try {
      const authHeader = String(request?.headers?.['authorization'] ?? '');

      if (authHeader.startsWith('Service ')) {
        // Access by secret token from other services such as Renderer
        const serviceSecret = authHeader.substring(8, authHeader.length);

        if (serviceSecret === (await this.authSettings).serviceSecret) {
          request.user = {
            id: 1,
            email: 'service',
            roles: [{ id: 1, name: 'administrator', permissions: ['all'] }],
          };
          return request.user;
        }
      }

      let accessToken = request?.cookies?.[(await this.authSettings).accessTokenCookieName];
      const refreshToken = request?.cookies?.[(await this.authSettings).refreshTokenCookieName];

      if (!accessToken) {
        if (authHeader.startsWith('Bearer ')) {
          accessToken = authHeader.substring(7, authHeader.length);
        }
      }

      if (!accessToken && !refreshToken) return null;

      // Validate access token
      const accessTokenPayload = accessToken ? await this.validateAccessToken(accessToken) : undefined;
      if (accessTokenPayload) {
        request.user = this.payloadToUserInfo(accessTokenPayload);
        return request.user;
      }

      // If access token is expired, validate refresh token
      if (!refreshToken || refreshToken === 'null') throw new UnauthorizedException('Refresh token is not set');

      const refreshTokenPayload = await this.validateRefreshToken(refreshToken);
      if (!refreshTokenPayload) throw new UnauthorizedException('Refresh token is not valid 1');

      const authUserInfo = this.payloadToUserInfo(refreshTokenPayload);

      // Check that token is in DB and was not blacklisted
      const validUser = await this.dbCheckRefreshToken(refreshToken, authUserInfo?.id);
      if (!validUser) throw new UnauthorizedException('Refresh token is not valid 2');
      if (!validUser?.roles?.length) {
        throw new UnauthorizedException('User has no roles');
      }

      const updatedUserInfo: TAuthUserInfo = {
        id: validUser.id,
        email: validUser.email,
        roles: validUser.roles,
      };

      request.user = updatedUserInfo;

      // Create new access token
      const newAccessToken = await this.generateAccessToken(updatedUserInfo);

      // Update refresh token
      const newRefreshToken = await this.updateRefreshToken(updatedUserInfo, validUser);

      if (!newRefreshToken) throw new UnauthorizedException('Failed to update refresh token');

      await this.setAccessTokenCookie(response, request, newAccessToken);
      await this.setRefreshTokenCookie(response, request, newRefreshToken);

      return authUserInfo;
    } catch (err: any) {
      logger.log('processRequest: ', err.message);
      await this.clearTokenCookies(response, request);
    }
    return null;
  }

  private isCheckerActive = false;

  async memoryLeakChecker() {
    if (this.isCheckerActive) return;
    this.isCheckerActive = true;

    const checkCycle = async () => {
      try {
        if (Object.keys(this.resetPasswordAttempts).filter(Boolean).length === 0) return;

        // remove old/expired resetPasswordAttempts from memory
        for (const email of Object.keys(this.resetPasswordAttempts)) {
          if (
            this.resetPasswordAttempts[email].firstDate.getTime() +
              (await this.authSettings).resetPasswordCodeExpirationAccessTime <
            new Date(Date.now()).getTime()
          ) {
            delete this.resetPasswordAttempts[email];
          }
        }
      } catch (error) {
        logger.error(error);
      }

      await sleep(10);
      checkCycle();
    };

    checkCycle();
    this.isCheckerActive = false;
  }
}
