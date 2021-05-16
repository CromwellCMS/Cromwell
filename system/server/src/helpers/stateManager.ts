import { HttpException, HttpStatus } from '@nestjs/common';

import { childSendMessage } from './serverManager';

const store: {
    isPendingKill: boolean;
    isPendingRestart: boolean;
    pendingTimer?: number;
    isClosing: boolean;
    transactions: Record<string, boolean>;
} = {
    isPendingKill: false,
    isPendingRestart: false,
    isClosing: false,
    transactions: {},
}


export const setPendingKill = (time?: number) => {
    store.pendingTimer = time;
    store.isPendingKill = true;
}

export const setPendingRestart = (time?: number) => {
    store.pendingTimer = time;
    store.isPendingRestart = true;
}

/** Save status of any pending job into the store */
export const startTransaction = (id: string) => {
    if (store.isClosing) {
        throw new HttpException('Could not start transaction: Server is closing', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    store.transactions[id] = true;
}

/** 
 * Mark job as finished. If server has no other jobs and it is
 * pending kill, it will initiate kill via Proxy manager
 */
export const endTransaction = (id: string) => {
    store.transactions[id] = false;
    const isIdle = !Object.values(store.transactions).includes(true);

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
}