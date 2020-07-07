import React from 'react';
import { CromwellBlockDataType, PageInfoType, setStoreItem, TCromwellBlockType } from '@cromwell/core';
import { CromwellBlock, cromwellBlockTypeFromClassname, cromwellBlockTypeToClassname, cromwellIdToHTML } from '@cromwell/core-frontend';
import TextFormatIcon from '@material-ui/icons/TextFormat';
import PowerIcon from '@material-ui/icons/Power';
import CodeIcon from '@material-ui/icons/Code';
import styles from './CromwellAdminBlock.module.scss';

type TCromwellAdminBlockProps = {
    id: string;
    type?: TCromwellBlockType | null;
    children?: React.ReactNode;
}

export const CromwellAdminBlock = (props: TCromwellAdminBlockProps) => {
    return (
        <div className={styles.CromwellAdminBlock} id={`${cromwellIdToHTML(props.id)}_admin`}>
            <CromwellBlock id={props.id} adminPanelContentView={adminPanelContentView}
                config={props.type ? { componentId: props.id, type: props.type } : undefined}
            >
                {props.children}
            </CromwellBlock>
            <div className={styles.dragFrame}></div>
        </div>
    )
}

export const adminPanelContentView = (id: string, config?: CromwellBlockDataType, children?: React.ReactNode) => {
    return (
        <div className={styles.adminPanelContentView}>
            {config && (
                <>
                    {config.type === 'plugin' && (
                        <><PowerIcon className={styles.adminPanelIcon} />
                            <p>{config.pluginName}</p></>
                    )}
                    {config.type === 'text' && (
                        <><TextFormatIcon className={styles.adminPanelIcon} />
                            {children}</>
                    )}
                    {config.type === 'HTML' && (
                        <><CodeIcon className={styles.adminPanelIcon} />
                            {children}</>
                    )}
                </>
            )}

        </div>
    )
}