import { TextField, Tooltip } from '@mui/material';
import { Public as PublicIcon, Subject as SubjectIcon } from '@mui/icons-material';
import React from 'react';

import { useForceUpdate } from '../../../../helpers/forceUpdate';
import { StylesEditor } from '../components/StylesEditor';
import styles from './BaseBlock.module.scss';
import { TBlockMenuProps } from './BlockMenu';


export const TextBlockSidebar = (props: TBlockMenuProps) => {
    const data = props.block?.getData();
    const blockValue = props.block?.getData()?.text?.content ?? props.block?.props?.children as string;

    const forceUpdate = useForceUpdate();

    const setBlockValue = (value: string) => {
        const data = props.block?.getData();
        if (data) {
            if (!data.text) data.text = {};
            data.text.content = value;
            props.modifyData?.(data);
        }
        forceUpdate();
    }

    const handleChangeLink = (value: string) => {
        const data = props.block?.getData();
        if (!data.text) data.text = {};
        if (!value || value === '') value = undefined;
        data.text.href = value;

        props.modifyData?.(data);
        forceUpdate();
        props.block.rerender();
    }

    return (
        <div>
            <div className={styles.settingsHeader}>
                <SubjectIcon />
                {props.isGlobalElem(props.getBlockElementById(data?.id)) && (
                    <div className={styles.headerIcon}>
                        <Tooltip title="Global block">
                            <PublicIcon />
                        </Tooltip>
                    </div>
                )}
                <h3 className={styles.settingsTitle}>Text settings</h3>
            </div>
            <TextField
                label="Content"
                fullWidth
                value={blockValue}
                onChange={(e) => { setBlockValue(e.target.value) }}
                multiline
                variant="standard"
                className={styles.settingsInput}
            />
            <TextField
                fullWidth
                onChange={(e) => handleChangeLink(e.target.value)}
                value={data?.text?.href ?? (props.block.getContentInstance().props as any)?.href ?? ''}
                className={styles.settingsInput}
                variant="standard"
                label="Link"
            />
            <StylesEditor
                forceUpdate={forceUpdate}
                blockProps={props}
            />
        </div>
    );
}