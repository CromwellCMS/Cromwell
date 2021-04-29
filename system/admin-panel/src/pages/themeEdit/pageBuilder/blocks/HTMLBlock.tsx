import { getBlockElementById } from '@cromwell/core-frontend';
import { TextField, Tooltip } from '@material-ui/core';
import { Code as CodeIcon, Public as PublicIcon } from '@material-ui/icons';
import React from 'react';

import { useForceUpdate } from '../../../../helpers/forceUpdate';
import styles from './BaseBlock.module.scss';
import { BaseMenu, TBaseMenuProps } from './BaseMenu';


export function HTMLBlockReplacer(props: TBaseMenuProps) {
    return (
        <>
            <BaseMenu
                {...props}
                icon={(
                    <Tooltip title="HTML block">
                        <CodeIcon />
                    </Tooltip>
                )}
            />
            {props?.block?.getDefaultContent()}
        </>
    );
}

export function HTMLBlockSidebar(props: TBaseMenuProps) {
    const blockValue = props.block?.getData()?.html?.innerHTML as string;
    const forceUpdate = useForceUpdate();
    const data = props.block?.getData();

    const setBlockValue = (value: string) => {
        const data = props.block?.getData();
        if (data) {
            if (!data.html) data.html = {};
            data.html.innerHTML = value;
            props.modifyData?.(data);
        }
        forceUpdate();
    }

    return (
        <div>
            <div className={styles.settingsHeader}>
                <CodeIcon />
                {props.isGlobalElem(getBlockElementById(data?.id)) && (
                    <div className={styles.headerIcon}>
                        <Tooltip title="Global block">
                            <PublicIcon />
                        </Tooltip>
                    </div>
                )}
                <h3 className={styles.settingsTitle}>HTML settings</h3>
            </div>
            <TextField
                label="Content"
                fullWidth
                value={blockValue}
                onChange={(e) => { setBlockValue(e.target.value) }}
                multiline
                className={styles.textField}
            />
        </div>
    );
}
