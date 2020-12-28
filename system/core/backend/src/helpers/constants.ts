import { logFor, TLogLevel } from '@cromwell/core';
import colorsdef from 'colors/safe';
const colors: any = colorsdef;

export const rendererMessages = {
    onBuildStartMessage: 'onBuildStart',
    onBuildEndMessage: 'onBuildEnd',
    onBuildErrorMessage: 'onBuildError',
    onStartMessage: 'onStart',
    onStartErrorMessage: 'onStartError',
}

export const adminPanelMessages = {
    onBuildStartMessage: 'onBuildStart',
    onBuildEndMessage: 'onBuildEnd',
    onBuildErrorMessage: 'onBuildError',
    onStartMessage: 'onStart',
    onStartErrorMessage: 'onStartError',
}

export const serverMessages = {
    onBuildStartMessage: 'onBuildStart',
    onBuildEndMessage: 'onBuildEnd',
    onBuildErrorMessage: 'onBuildError',
    onStartMessage: 'onStart',
    onStartErrorMessage: 'onStartError',
}


export const serverLogFor = (level: TLogLevel, msg: string,
    type?: 'Log' | 'Warning' | 'Error', func?: (msg: string) => any) => {

    if (type === 'Warning') {
        msg = colors.brightYellow('Warning: ') + msg;
    }
    if (type === 'Error') {
        msg = colors.brightRed('Error: ') + msg;
    }
    logFor(level, msg, func);
}