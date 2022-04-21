import { TCromwellBlockData } from '@cromwell/core';
import React from 'react';

import styles from '../blocks/BaseBlock.module.scss';
import { TBlockMenuProps } from '../blocks/BlockMenu';
import { StyleField } from './StyleField';

export function StyleOffset(props: {
    forceUpdate: () => any;
    blockProps: TBlockMenuProps;
    handleStyleChange: (name: keyof React.CSSProperties, value: any) => void;
    type: 'margin' | 'padding';
    data: TCromwellBlockData;
}) {
    const { data, blockProps } = props;

    return (
        <div className={styles.stylesGroup}>
            <h3>{props.type === 'margin' ? 'Margin' : 'Padding'} (px)</h3>
            <div style={{ display: 'flex' }}>
                <StyleField
                    label="top"
                    data={data}
                    blockProps={blockProps}
                    name={props.type === 'margin' ? 'marginTop' : 'paddingTop'}
                    handleStyleChange={props.handleStyleChange}
                    dataType="px"
                    className={styles.groupField}
                />
                <StyleField
                    label="bottom"
                    data={data}
                    blockProps={blockProps}
                    name={props.type === 'margin' ? 'marginBottom' : 'paddingBottom'}
                    handleStyleChange={props.handleStyleChange}
                    dataType="px"
                    className={styles.groupField}
                />
                <StyleField
                    label="left"
                    data={data}
                    blockProps={blockProps}
                    name={props.type === 'margin' ? 'marginLeft' : 'paddingLeft'}
                    handleStyleChange={props.handleStyleChange}
                    dataType="px"
                    className={styles.groupField}
                />
                <StyleField
                    label="right"
                    data={data}
                    blockProps={blockProps}
                    name={props.type === 'margin' ? 'marginRight' : 'paddingRight'}
                    handleStyleChange={props.handleStyleChange}
                    dataType="px"
                    className={styles.groupField}
                    style={{ marginRight: '0' }}
                />
            </div>
        </div>
    )
}
