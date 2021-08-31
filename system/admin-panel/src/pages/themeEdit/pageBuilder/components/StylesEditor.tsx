import { TCromwellBlockData } from '@cromwell/core';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import React from 'react';

import styles from '../blocks/BaseBlock.module.scss';
import { TBlockMenuProps } from '../blocks/BlockMenu';
import { StyleField } from './StyleField';
import { StyleOffset } from './StyleOffset';
import FormatPaintIcon from '@material-ui/icons/FormatPaint';

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
        props.blockProps.block.rerender();
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
        <div className={styles.stylesGroup}>
            <h3>Margin align</h3>
            <FormControl fullWidth className={styles.settingsInput} >
                <InputLabel>Align</InputLabel>
                <Select
                    fullWidth
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
    </>)
}
