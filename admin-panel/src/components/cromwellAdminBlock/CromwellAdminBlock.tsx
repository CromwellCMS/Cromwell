import React from 'react';
import { TCromwellBlockData, TPageInfo, setStoreItem, TCromwellBlockType, TContentComponentProps } from '@cromwell/core';
import { CromwellBlock, cromwellBlockTypeFromClassname, cromwellBlockTypeToClassname, cromwellIdToHTML } from '@cromwell/core-frontend';
import TextFormatIcon from '@material-ui/icons/TextFormat';
import PowerIcon from '@material-ui/icons/Power';
import CodeIcon from '@material-ui/icons/Code';
import styles from './CromwellAdminBlock.module.scss';

type TCromwellAdminBlockProps = {
    id: string;
    type?: TCromwellBlockType;
    children?: React.ReactNode;
}

// export const CromwellAdminBlock = (props: TCromwellAdminBlockProps) => {
//     return (
//         <CromwellBlock id={props.id}
//             contentComponent={adminPanelContentView}
//             wrappingComponent={CromwellBlockWrapper}
//             type={props.type}
//         >
//             {props.children}
//         </CromwellBlock>
//     )
// }

export const CromwellBlockWrappingComponent = (props: TContentComponentProps) => {
    return (
        <div className={styles.CromwellAdminBlock} id={`${cromwellIdToHTML(props.id)}_admin`}>
            <div className={styles.dragFrame}></div>
            <div className={styles.cromwellBlockContent}>{props.children}</div>

        </div>
    )
}

export const CromwellBlockContentComponent = (props: TContentComponentProps) => {
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
                    {props.config.type === 'container' && (
                        <><CodeIcon className={styles.adminPanelIcon} />
                            {props.children}</>
                    )}
                </>
            )}

        </div>
    )
}