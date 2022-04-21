import { TCromwellBlockData } from '@cromwell/core';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import React from 'react';

import { Select } from '../../../../components/select/Select';
import styles from '../blocks/BaseBlock.module.scss';
import { TBlockMenuProps } from '../blocks/BlockMenu';
import { StyleField } from './StyleField';
import { StyleOffset } from './StyleOffset';

export function StylesEditor(props: {
    forceUpdate: () => any;
    blockProps: TBlockMenuProps;
}) {
    const { blockProps } = props;

    const data = props.blockProps.block?.getData();
    if (!data.style) data.style = {};
    if (typeof data.style === 'string') data.style = JSON.parse(data.style);

    const handleEditorStyleChange = (name: keyof TCromwellBlockData['editorStyles'], value: any) => {
        const data = props.blockProps.block?.getData();
        if (!data.editorStyles) data.editorStyles = {};
        (data.editorStyles[name] as any) = value;
        props.blockProps.modifyData?.(data);
        props.forceUpdate();
    }

    const handleStyleChange = (name: keyof React.CSSProperties, value: any) => {
        const data = props.blockProps.block?.getData();
        if (!data.style) data.style = {};
        if (typeof data.style === 'string') data.style = JSON.parse(data.style);
        data.style[name] = value;
        props.blockProps.modifyData?.(data);
        props.forceUpdate();
        props.blockProps.block.rerender();
        props.blockProps.updateFramesPosition();
    }

    return (<>
        <div className={styles.stylesHeaderContainer}>
            <FormatPaintIcon />
            <h2 className={styles.stylesHeader}>Styles</h2>
        </div>
        <StyleOffset
            type="margin"
            handleStyleChange={handleStyleChange}
            forceUpdate={props.forceUpdate}
            blockProps={props.blockProps}
            data={data}
        />
        <StyleOffset
            type="padding"
            handleStyleChange={handleStyleChange}
            forceUpdate={props.forceUpdate}
            blockProps={props.blockProps}
            data={data}
        />
        <div className={styles.stylesGroup}>
            <h3>Width (px)</h3>
            <div style={{ display: 'flex' }}>
                <StyleField
                    label="min"
                    data={data}
                    blockProps={blockProps}
                    name={'minWidth'}
                    handleStyleChange={handleStyleChange}
                    dataType="px"
                    className={styles.groupField}
                />
                <StyleField
                    label="desired"
                    data={data}
                    blockProps={blockProps}
                    name={'width'}
                    handleStyleChange={handleStyleChange}
                    dataType="px"
                    className={styles.groupField}
                />
                <StyleField
                    label="max"
                    data={data}
                    blockProps={blockProps}
                    name={'maxWidth'}
                    handleStyleChange={handleStyleChange}
                    dataType="px"
                    className={styles.groupField}
                />
            </div>
        </div>
        <div className={styles.stylesGroup}>
            <h3>Block align</h3>
            <Select
                fullWidth
                variant="standard"
                onChange={(e) => handleEditorStyleChange('align', e.target.value as any)}
                value={data?.editorStyles?.align}
                options={[
                    { value: undefined, label: 'no' },
                    { value: 'left', label: 'Left' },
                    { value: 'right', label: 'Right' },
                    { value: 'center', label: 'Center' },
                ]}
            />
        </div>
        <div className={styles.stylesGroup}>
            <h3>Height (px)</h3>
            <div style={{ display: 'flex' }}>
                <StyleField
                    label="min"
                    data={data}
                    blockProps={blockProps}
                    name={'minHeight'}
                    handleStyleChange={handleStyleChange}
                    dataType="px"
                    className={styles.groupField}
                />
                <StyleField
                    label="desired"
                    data={data}
                    blockProps={blockProps}
                    name={'height'}
                    handleStyleChange={handleStyleChange}
                    dataType="px"
                    className={styles.groupField}
                />
                <StyleField
                    label="max"
                    data={data}
                    blockProps={blockProps}
                    name={'maxHeight'}
                    handleStyleChange={handleStyleChange}
                    dataType="px"
                    className={styles.groupField}
                />
            </div>
        </div>

        <div className={styles.stylesGroup}>
            <h3>Font</h3>
            <div style={{ display: 'flex' }}>
                <StyleField
                    label="size"
                    data={data}
                    blockProps={blockProps}
                    name={'fontSize'}
                    handleStyleChange={handleStyleChange}
                    dataType="px"
                    style={{ maxWidth: '50px' }}
                    className={styles.groupField}
                />
                <StyleField
                    label="color"
                    data={data}
                    blockProps={blockProps}
                    name={'color'}
                    handleStyleChange={handleStyleChange}
                    dataType="color"
                    className={styles.groupField}
                />
                <StyleField
                    label="weight"
                    data={data}
                    blockProps={blockProps}
                    name={'fontWeight'}
                    handleStyleChange={handleStyleChange}
                    dataType="select"
                    className={styles.groupField}
                    style={{ minWidth: '70px' }}
                    options={['lighter', 'normal', 'bolder', 'bold']}
                />
                <StyleField
                    label="align"
                    data={data}
                    blockProps={blockProps}
                    name={'textAlign'}
                    handleStyleChange={handleStyleChange}
                    dataType="select"
                    className={styles.groupField}
                    style={{ minWidth: '70px' }}
                    options={['left', 'center', 'right']}
                />
            </div>
        </div>

        <div className={styles.stylesGroup}>
            <h3>Background</h3>
            <div style={{ display: 'flex' }}>
                <StyleField
                    label="color"
                    data={data}
                    blockProps={blockProps}
                    name={'backgroundColor'}
                    handleStyleChange={handleStyleChange}
                    dataType="color"
                    className={styles.groupField}
                />
            </div>
        </div>

        <div className={styles.stylesGroup}>
            <h3>Border</h3>
            <div style={{ display: 'flex' }}>
                <StyleField
                    label="width"
                    data={data}
                    blockProps={blockProps}
                    name={'borderWidth'}
                    handleStyleChange={handleStyleChange}
                    dataType="px"
                    style={{ maxWidth: '70px' }}
                    className={styles.groupField}
                />
                <StyleField
                    label="radius"
                    data={data}
                    blockProps={blockProps}
                    name={'borderRadius'}
                    handleStyleChange={handleStyleChange}
                    dataType="px"
                    style={{ maxWidth: '70px' }}
                    className={styles.groupField}
                />
                <StyleField
                    label="color"
                    data={data}
                    blockProps={blockProps}
                    name={'borderColor'}
                    handleStyleChange={handleStyleChange}
                    dataType="color"
                    className={styles.groupField}
                />
                <StyleField
                    label="style"
                    data={data}
                    blockProps={blockProps}
                    name={'borderStyle'}
                    handleStyleChange={handleStyleChange}
                    dataType="select"
                    style={{ minWidth: '50px' }}
                    className={styles.groupField}
                    options={['solid', 'dashed', 'dotted', 'double', 'outset', 'ridge']}
                />
            </div>
        </div>
    </>)
}
