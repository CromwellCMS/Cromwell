import { logFor, TLogLevel, TCmsConfig, logLevelMoreThan } from '@cromwell/core';
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

export const getLogger = (level: TLogLevel, func?: (...args) => any) => {
    return {
        log: (...args) => {
            if (logLevelMoreThan(level)) func ? func(...args) : console.log(...args);
        },
        info: (...args) => {
            if (logLevelMoreThan(level)) func ? func(...args) : console.log(...args);
        },
        warn: (...args) => {
            const msg = colors.brightYellow('Warning: ') + args.join(' ');
            if (logLevelMoreThan(level)) func ? func(msg) : console.warn(msg);
        },
        error: (...args) => {
            const msg = colors.brightRed('Error: ') + args.join(' ');
            if (logLevelMoreThan(level)) func ? func(msg) : console.error(msg);
        }
    }
}

export const defaultCmsConfig: TCmsConfig = {
    mainApiPort: 4016,
    pluginApiPort: 4032,
    adminPanelPort: 4064,
    frontendPort: 4128,
    useWatch: true,
    defaultSettings: {
        installed: false,
        themeName: "@cromwell/theme-store",
        logo: "/themes/@cromwell/theme-store/shopping-cart.png",
        defaultPageSize: 15,
        defaultShippingPrice: 10,
        currencies: [
            {
                "tag": "USD",
                "title": "US Dollar",
                "symbol": "$",
                "ratio": 1
            },
            {
                "tag": "EUR",
                "title": "Euro",
                "symbol": "€",
                "ratio": 0.8
            },
            {
                "tag": "RUB",
                "title": "Russian Ruble",
                "symbol": "₽",
                "ratio": 74
            }
        ]
    }
}
