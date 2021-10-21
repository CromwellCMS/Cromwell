import { TCromwellBlockData } from '@cromwell/core';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';

import styles from '../blocks/BaseBlock.module.scss';
import { TBlockMenuProps } from '../blocks/BlockMenu';
import { StyleField } from './StyleField';
import { StyleOffset } from './StyleOffset';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';

export function StylesEditor(props: {
    forceUpdate: () => any;
    blockProps: TBlockMenuProps;
}) {
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
                    name={'minWidth'}
                    handleStyleChange={handleStyleChange}
                    dataType="px"
                    className={styles.groupField}
                />
                <StyleField
                    label="desired"
                    data={data}
                    name={'width'}
                    handleStyleChange={handleStyleChange}
                    dataType="px"
                    className={styles.groupField}
                />
                <StyleField
                    label="max"
                    data={data}
                    name={'maxWidth'}
                    handleStyleChange={handleStyleChange}
                    dataType="px"
                    className={styles.groupField}
                />
            </div>
        </div>
        <div className={styles.stylesGroup}>
            <h3>Block align</h3>
            <FormControl fullWidth className={styles.settingsInput} >
                <InputLabel>horizontal align</InputLabel>
                <Select
                    fullWidth
                    variant="standard"
                    onChange={(e) => handleEditorStyleChange('align', e.target.value as any)}
                    value={data?.editorStyles?.align}
                >
                    <MenuItem value={undefined}>no</MenuItem>
                    <MenuItem value={'left'}>left</MenuItem>
                    <MenuItem value={'right'}>right</MenuItem>
                    <MenuItem value={'center'}>center</MenuItem>
                </Select>
            </FormControl>
        </div>
        <div className={styles.stylesGroup}>
            <h3>Height (px)</h3>
            <div style={{ display: 'flex' }}>
                <StyleField
                    label="min"
                    data={data}
                    name={'minHeight'}
                    handleStyleChange={handleStyleChange}
                    dataType="px"
                    className={styles.groupField}
                />
                <StyleField
                    label="desired"
                    data={data}
                    name={'height'}
                    handleStyleChange={handleStyleChange}
                    dataType="px"
                    className={styles.groupField}
                />
                <StyleField
                    label="max"
                    data={data}
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
                    name={'fontSize'}
                    handleStyleChange={handleStyleChange}
                    dataType="px"
                    style={{ maxWidth: '50px' }}
                    className={styles.groupField}
                />
                <StyleField
                    label="color"
                    data={data}
                    name={'color'}
                    handleStyleChange={handleStyleChange}
                    dataType="color"
                    className={styles.groupField}
                />
                <StyleField
                    label="weight"
                    data={data}
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
                    name={'borderWidth'}
                    handleStyleChange={handleStyleChange}
                    dataType="px"
                    style={{ maxWidth: '70px' }}
                    className={styles.groupField}
                />
                <StyleField
                    label="radius"
                    data={data}
                    name={'borderRadius'}
                    handleStyleChange={handleStyleChange}
                    dataType="px"
                    style={{ maxWidth: '70px' }}
                    className={styles.groupField}
                />
                <StyleField
                    label="color"
                    data={data}
                    name={'borderColor'}
                    handleStyleChange={handleStyleChange}
                    dataType="color"
                    className={styles.groupField}
                />
                <StyleField
                    label="style"
                    data={data}
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
