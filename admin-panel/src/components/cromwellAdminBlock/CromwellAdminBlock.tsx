import React from 'react';
import { CromwellBlockDataType, PageInfoType, setStoreItem, TCromwellBlockType } from '@cromwell/core';
import { CromwellBlock, cromwellBlockTypeFromClassname, cromwellBlockTypeToClassname, cromwellIdToHTML, TContentComponentProps } from '@cromwell/core-frontend';
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
        <CromwellBlock id={props.id}
            contentComponent={adminPanelContentView}
            wrappingComponent={CromwellBlockWrapper}
            config={props.type ? { componentId: props.id, type: props.type } : undefined}
        >
            {props.children}
        </CromwellBlock>
    )
}

export const CromwellBlockWrapper = (props: TContentComponentProps) => {
    return (
        <div className={styles.CromwellAdminBlock} id={`${cromwellIdToHTML(props.id)}_admin`}>
            {props.children}
            <div className={styles.dragFrame}></div>
        </div>
    )
}

export const adminPanelContentView = (props: TContentComponentProps) => {
    return (
        <div className={styles.adminPanelContentView}>
            {props.config && (
                <>
                    {props.config.type === 'plugin' && (
                        <><PowerIcon className={styles.adminPanelIcon} />
                            <p>{props.config.pluginName}</p></>
                    )}
                    {props.config.type === 'text' && (
                        <><TextFormatIcon className={styles.adminPanelIcon} />
                            {props.children}</>
                    )}
                    {props.config.type === 'HTML' && (
                        <><CodeIcon className={styles.adminPanelIcon} />
                            {props.children}</>
                    )}
                </>
            )}

        </div>
    )
}