import React from 'react';
import { DataComponentProps } from './types';

export function DataComponent<Data>(props: DataComponentProps<Data>) {
    console.log('BaseComponent props', props);

    const Comp = props.component;
    //@TODO: get data from context
    const data = {} as any;
    if (!Comp) {
        const errMsg = `Component ${props.componetName} will not render. No React Component specified!`;
        console.error(errMsg);
        return <div style={{ display: 'none' }}>{errMsg}</div>
    }
    if (!data) {
        const errMsg = `Component ${props.componetName} will not render. No data recieved!`;
        console.error(errMsg);
        return <div style={{ display: 'none' }}>{errMsg}</div>
    }

    return (
        <div className="BaseComponent">
            <Comp data={data} />
        </div>
    )
}

