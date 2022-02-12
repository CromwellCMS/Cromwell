import { TCromwellNotify } from '@cromwell/core';
import React from 'react';
import { toast as toastify, ToastOptions } from 'react-toastify';

export type NotifierActionOptions = ToastOptions & {
    Wrapper?: React.ComponentType<{
        className?: string;
        severity?: any;
        options?: NotifierActionOptions;
    }>;
}

/** @internal */
const DefaultWrapper = (props) => {
    return <div className={props.className}>{props.children}</div>
};

/** @internal */
export class Notifier implements TCromwellNotify {

    constructor(private defaultOptions?: NotifierActionOptions) { }

    public success(text: string, options?: NotifierActionOptions) {
        options = Object.assign({}, this.defaultOptions, options);
        const Wrapper = options?.Wrapper ?? DefaultWrapper;
        toastify.success(<Wrapper severity="success" options={options}>{text}</Wrapper>, {
            ...(options ?? {}),
        })
    }

    public warning(text: string, options?: NotifierActionOptions) {
        options = Object.assign({}, this.defaultOptions, options);
        const Wrapper = options?.Wrapper ?? DefaultWrapper;
        toastify.warn(<Wrapper severity="warning" options={options}>{text}</Wrapper>, {
            ...(options ?? {}),
        })
    }

    public error(text: string, options?: NotifierActionOptions) {
        options = Object.assign({}, this.defaultOptions, options);
        const Wrapper = options?.Wrapper ?? DefaultWrapper;
        toastify.error(<Wrapper severity="error" options={options}>{text}</Wrapper>, {
            ...(options ?? {}),
        })
    }

    public info(text: string, options?: NotifierActionOptions) {
        options = Object.assign({}, this.defaultOptions, options);
        const Wrapper = options?.Wrapper ?? DefaultWrapper;
        toastify.info(<Wrapper severity="info" options={options}>{text}</Wrapper>, {
            ...(options ?? {}),
        })
    }

    public POSITION = toastify.POSITION;
    public warn = this.warning;
}

/** @internal */
export const notifier = new Notifier();