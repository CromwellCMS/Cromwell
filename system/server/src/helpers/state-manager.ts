import { TServiceVersions } from '@cromwell/core';
import { incrementServiceVersion } from '@cromwell/core-backend';
import { HttpException, HttpStatus } from '@nestjs/common';

import { childSendMessage } from './server-manager';

const store: {
  isPendingKill: boolean;
  isPendingRestart: boolean;
  isPendingServiceRestart: boolean;
  isPendingAnyAction: () => boolean;
  pendingTimer?: number;
  isClosing: boolean;
  transactions: Record<string, boolean>;
} = {
  isPendingKill: false,
  isPendingRestart: false,
  isPendingServiceRestart: false,
  isClosing: false,
  transactions: {},
  isPendingAnyAction: () => store.isPendingKill || store.isPendingRestart || store.isPendingServiceRestart,
};

export const getManagerState = () => store;

export const restartService = async (serviceName: keyof TServiceVersions) => {
  // if (serviceName === 'api-server') {
  //     setPendingRestart(2000);
  //     return;
  // }
  if (serviceName === 'server') {
    const isIdle = !Object.values(store.transactions).includes(true);
    if (isIdle) {
      await incrementServiceVersion('server');
      return;
    }
    setPendingServiceRestart(2000);
    return;
  }

  await incrementServiceVersion(serviceName);
};

export const setPendingKill = (time?: number) => {
  store.pendingTimer = time;
  store.isPendingKill = true;
};

export const setPendingRestart = (time?: number) => {
  store.pendingTimer = time;
  store.isPendingRestart = true;
};

export const setPendingServiceRestart = (time?: number) => {
  store.pendingTimer = time;
  store.isPendingServiceRestart = true;
};
/**
 * Save status of any pending job into the store.
 * Transactions used to ensure server won't be restarted or killed by
 * any Theme/Plugin update/installation job until all transactions are completed.
 */
export const startTransaction = (id: string) => {
  if (store.isClosing) {
    throw new HttpException('Could not start transaction: Server is closing', HttpStatus.INTERNAL_SERVER_ERROR);
  }
  store.transactions[id] = true;
};

/**
 * Mark job as finished. If server has no other jobs and it is
 * pending kill, it will initiate kill via Proxy manager
 */
export const endTransaction = (id: string) => {
  store.transactions[id] = false;
  const isIdle = !Object.values(store.transactions).includes(true);

  if (store.isPendingServiceRestart && isIdle) {
    store.isPendingRestart = false;
    store.isPendingKill = false;
    store.isClosing = true;
    setTimeout(() => {
      incrementServiceVersion('server');
    }, store.pendingTimer ?? 1000);
  }

  if (store.isPendingKill && isIdle) {
    store.isPendingRestart = false;
    store.isClosing = true;
    setTimeout(() => {
      childSendMessage('kill-me');
    }, store.pendingTimer ?? 1000);
  }

  if (store.isPendingRestart && isIdle) {
    store.isClosing = true;
    setTimeout(() => {
      childSendMessage('restart-me');
    }, store.pendingTimer ?? 1000);
  }
};
