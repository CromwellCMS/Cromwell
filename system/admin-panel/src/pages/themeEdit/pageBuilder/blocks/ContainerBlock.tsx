import { Tooltip } from '@mui/material';
import { Public as PublicIcon, Widgets as WidgetsIcon } from '@mui/icons-material';
import React from 'react';

import { useForceUpdate } from '../../../../helpers/forceUpdate';
import { StylesEditor } from '../components/StylesEditor';
import styles from './BaseBlock.module.scss';
import { TBlockMenuProps } from './BlockMenu';

export function ContainerBlockSidebar(props: TBlockMenuProps) {
    const data = props.block?.getData();

    const forceUpdate = useForceUpdate();

    return (
        <div className={styles.containerSettings}>
            <div className={styles.settingsHeader}>
                <WidgetsIcon />
                {props.isGlobalElem(props.getBlockElementById(data?.id)) && (
                    <div className={styles.headerIcon}>
                        <Tooltip title="Global block">
                            <PublicIcon />
                        </Tooltip>
                    </div>
                )}
                <h3 className={styles.settingsTitle}>Container settings</h3>
            </div>
            <StylesEditor
                forceUpdate={forceUpdate}
                blockProps={props}
            />
        </div>
    )
}
