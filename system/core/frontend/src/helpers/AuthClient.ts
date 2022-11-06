import { getRandStr, getStoreItem, isServer, onStoreChange, setStoreItem, TCreateUser, TUser } from '@cromwell/core';
import { useEffect } from 'react';

import { getRestApiClient } from '../api/CRestApiClient';
import { useForceUpdate } from './forceUpdate';

/**
 * Common object with info about result of used operation.
 */
export type TAuthClientOperationResult = {
  /**
   * Available codes:
   * 200 - Sing in success;
   * 201 - Sing out success;
   * 202 - Reset password procedure initiation success (forgot pass);
   * 203 - Reset password success. Password changed in DB;
   * 204 - User registration (sign up) success.
   * 400 - Empty email or password (frontend validation);
   * 401 - Incorrect email or password (server validation);
   * 402 - Already processing another request;
   * 403 - Too many requests;
   * 404 - Failed to sing out;
   * 405 - Empty secret code (frontend validation);
   * 406 - Exceeded reset password attempts;
   * 407 - Missing user credentials on user registration operation;
   */
  code: number;
  message: string;
  success: boolean;
  error?: any;
  user?: TUser;
};

/**
 * Wrapper around Cromwell CMS REST API for working with user authentication on frontend.
 * Use it as a hook:
 * ```tsx
 * import { useAuthClient } from '@cromwell/core-frontend';
 *
 * const MyComponent = () => {
 *   const client = useAuthClient();
 *   const user = client.userInfo;
 * }
 * ```
 *
 * If you only need to track account of logged user you can use
 * `useUserInfo` core hook which will your keep component updated:
 * import { useUserInfo } from '@cromwell/core-frontend';
 */
class AuthClient {
  /** @internal */
  constructor() {
    onStoreChange('userInfo', (info) => {
      this?.triggerUpdateListeners();

      if (!isServer() && info?.id) {
        window.localStorage.setItem(this.userEverLoggedStorageKey, 'true');
      }
    });
  }

  /**
   * Account of currently logged user or 'undefined' if user is not logged in.
   */
  public get userInfo() {
    return getStoreItem('userInfo');
  }

  /** @internal */
  private _isLoading = false;

  /**
   * Has any pending API request? Client will not make any other requests until
   * pending one is not resolved.
   */
  public get isPending() {
    return this._isLoading;
  }

  /** @internal */
  private userEverLoggedStorageKey = 'crw_user_was_logged';

  /** @internal */
  private set isLoading(loading) {
    this._isLoading = loading;
    this.triggerUpdateListeners();
  }

  /** @internal */
  private updateListeners: Record<string, () => void> = {};

  /** @internal */
  private triggerUpdateListeners() {
    for (const listener of Object.values(this.updateListeners)) {
      listener();
    }
  }

  /** @internal */
  public addOnUpdateListener(cb: () => any): string {
    const cbId = getRandStr(8);
    this.updateListeners[cbId] = cb;
    return cbId;
  }

  /** @internal */
  public removeOnUpdateListener(cbId: string) {
    delete this.updateListeners[cbId];
  }

  /**
   * Check if a user is logged in and re-store user info in global store.
   */
  public async reviveAuth() {
    if (!(!isServer() && !getStoreItem('userInfo') && window.localStorage.getItem(this.userEverLoggedStorageKey))) {
      return false;
    }
    const user = await getRestApiClient()
      .getUserInfo({ disableLog: true })
      .catch(() => null);
    if (getStoreItem('userInfo')) return true;
    if (!user?.id) {
      window.localStorage.removeItem(this.userEverLoggedStorageKey);
      return false;
    }
    setStoreItem('userInfo', user);
    return true;
  }

  /**
   * Perform sign in request
   * @param email
   * @param password
   */
  public async signIn(email: string, password: string): Promise<TAuthClientOperationResult> {
    if (!email || !password)
      return {
        code: 400,
        message: 'Empty email or password',
        success: false,
      };
    if (this.isLoading)
      return {
        code: 402,
        message: 'Already processing another request',
        success: false,
      };

    const client = getRestApiClient();
    this.isLoading = true;
    let result: TAuthClientOperationResult;

    try {
      const user = await client?.login({
        email,
        password,
      });
      if (user?.id) {
        setStoreItem('userInfo', user);
        result = {
          code: 200,
          message: 'Sign is success',
          success: true,
          user,
        };
      } else {
        throw new Error('!user');
      }
    } catch (error: any /* TRestApiErrorInfo */) {
      console.error(error);

      if (error?.statusCode === 429) {
        result = {
          code: 403,
          message: 'Too many requests',
          error,
          success: false,
        };
      } else {
        result = {
          code: 401,
          message: 'Incorrect email or password',
          error,
          success: false,
        };
      }
    }

    this.isLoading = false;
    return result;
  }

  /**
   * Perform sign out request
   */
  public async signOut(): Promise<TAuthClientOperationResult> {
    if (this.isLoading)
      return {
        code: 402,
        message: 'Already processing another request',
        success: false,
      };

    try {
      await getRestApiClient()?.logOut();

      if (!isServer() && window.localStorage.getItem(this.userEverLoggedStorageKey)) {
        window.localStorage.removeItem(this.userEverLoggedStorageKey);
      }
    } catch (error: any /* TRestApiErrorInfo */) {
      console.error(error);
      return {
        code: 404,
        message: 'Failed to sing out',
        error,
        success: false,
      };
    }
    setStoreItem('userInfo', undefined);
    return {
      code: 201,
      message: 'Sing out success',
      success: true,
    };
  }

  /**
   * Initiate reset password procedure. Will send an email with a secret code to use in
   * `resetPassword` method
   * @param email
   * @returns
   */
  public async forgotPassword(email: string): Promise<TAuthClientOperationResult> {
    if (!email)
      return {
        code: 400,
        message: 'Empty email',
        success: false,
      };
    if (this.isLoading)
      return {
        code: 402,
        message: 'Already processing another request',
        success: false,
      };

    this.isLoading = true;
    const client = getRestApiClient();
    let result: TAuthClientOperationResult;

    try {
      const success = await client?.forgotPassword({ email });
      if (success) {
        result = {
          code: 202,
          message: 'Forgot password success',
          success: true,
        };
      } else {
        throw new Error('!success');
      }
    } catch (error: any /* TRestApiErrorInfo */) {
      console.error(error);

      if (error?.statusCode === 429) {
        result = {
          code: 403,
          message: 'Too many requests',
          error,
          success: false,
        };
      } else {
        result = {
          code: 401,
          message: 'Incorrect email or password',
          error,
          success: false,
        };
      }
    }
    this.isLoading = false;
    return result;
  }

  /**
   * Reset and change user password. Finish reset password procedure.
   * @param email
   * @param newPassword
   * @param code - Secret code sent on user email
   */
  public async resetPassword(email: string, newPassword: string, code: string): Promise<TAuthClientOperationResult> {
    if (!email || !newPassword)
      return {
        code: 400,
        message: 'Empty email or password',
        success: false,
      };
    if (!code)
      return {
        code: 405,
        message: 'Empty secret code',
        success: false,
      };
    if (this.isLoading)
      return {
        code: 402,
        message: 'Already processing another request',
        success: false,
      };

    this.isLoading = true;
    const client = getRestApiClient();
    let result: TAuthClientOperationResult;

    try {
      const success = await client?.resetPassword({
        email,
        code,
        newPassword,
      });
      if (success) {
        result = {
          code: 203,
          message: 'Reset password success',
          success: true,
        };
      } else {
        throw new Error('!success');
      }
    } catch (error: any /* TRestApiErrorInfo */) {
      console.error(error);

      if (error?.statusCode === 429) {
        result = {
          code: 403,
          message: 'Too many requests',
          error,
          success: false,
        };
      } else if (error?.statusCode === 417) {
        result = {
          code: 406,
          message: 'Exceeded reset password attempts',
          error,
          success: false,
        };
      } else {
        result = {
          code: 401,
          message: 'Incorrect email or password',
          error,
          success: false,
        };
      }
    }
    this.isLoading = false;
    return result;
  }

  /**
   * Public user registration method (sign up). User will have `customer` role.
   * To create a user with another role use GraphQL client and pass full
   * user (TCreateUser) input (admin auth required)
   * @param email
   * @param password
   * @param fullName
   */
  public async signUp(user: TCreateUser): Promise<TAuthClientOperationResult> {
    const { password, email, fullName } = user;
    if (!email || !password)
      return {
        code: 400,
        message: 'Empty email or password',
        success: false,
      };
    if (!fullName)
      return {
        code: 400,
        message: 'Empty user name',
        success: false,
      };
    if (this.isLoading)
      return {
        code: 402,
        message: 'Already processing another request',
        success: false,
      };

    this.isLoading = true;
    const client = getRestApiClient();
    let result: TAuthClientOperationResult;

    try {
      const user = await client?.signUp({
        email,
        password,
        fullName,
      });

      if (!user?.id) {
        throw new Error('!user');
      }

      result = {
        code: 204,
        message: 'User registration (sign up) success.',
        success: true,
        user,
      };
    } catch (error: any /* TRestApiErrorInfo */) {
      console.error(error);

      if (error?.statusCode === 429) {
        result = {
          code: 403,
          message: 'Too many requests',
          error,
          success: false,
        };
      } else {
        result = {
          code: 401,
          message: error?.message ?? 'Incorrect e-mail or password or e-mail already has been taken',
          error,
          success: false,
        };
      }
    }

    this.isLoading = false;
    return result;
  }
}

let authClient: AuthClient;

export const getAuthClient = (): AuthClient => {
  if (!authClient) authClient = new AuthClient();
  return authClient;
};

export const useAuthClient = (): AuthClient => {
  const update = useForceUpdate();
  useEffect(() => {
    const cbId = getAuthClient().addOnUpdateListener(() => update());
    return () => {
      getAuthClient().removeOnUpdateListener(cbId);
    };
  });
  return getAuthClient();
};
