import { TextField, Tooltip } from '@material-ui/core';
import { Code as CodeIcon, Public as PublicIcon } from '@material-ui/icons';
import React from 'react';

import { useForceUpdate } from '../../../../helpers/forceUpdate';
import { StylesEditor } from '../components/StylesEditor';
import styles from './BaseBlock.module.scss';
import { TBlockMenuProps } from './BlockMenu';


export function HTMLBlockSidebar(props: TBlockMenuProps) {
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
                {props.isGlobalElem(props.getBlockElementById(data?.id)) && (
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
            <StylesEditor
                forceUpdate={forceUpdate}
                blockProps={props}
            />
        </div>
    );
}
