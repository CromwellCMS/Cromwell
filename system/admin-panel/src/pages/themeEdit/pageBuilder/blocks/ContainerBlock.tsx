import { TCromwellBlockData } from '@cromwell/core';
import { getBlockElementById } from '@cromwell/core-frontend';
import { FormControl, InputLabel, MenuItem, Select, TextField, Tooltip } from '@material-ui/core';
import { Public as PublicIcon, Widgets as WidgetsIcon } from '@material-ui/icons';
import React from 'react';

import { useForceUpdate } from '../../../../helpers/forceUpdate';
import styles from './BaseBlock.module.scss';
import { TBlockMenuProps } from './BlockMenu';

export function ContainerBlockSidebar(props: TBlockMenuProps) {
    const data = props.block?.getData();
    const forceUpdate = useForceUpdate();

    const handleStyleChange = (name: keyof TCromwellBlockData['editorStyles'], value: any) => {
        const data = props.block?.getData();
        if (!data.editorStyles) data.editorStyles = {};
        (data.editorStyles[name] as any) = value;
        props.modifyData?.(data);
        forceUpdate();
        props.block.rerender();
    }

    const handleNumberInput = (name: keyof TCromwellBlockData['editorStyles']) => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        let val = parseInt(e.target.value);
        if (isNaN(val)) val = undefined;
        handleStyleChange(name, val)
    }

    return (
        <div className={styles.containerSettings}>
            <div className={styles.settingsHeader}>
                <WidgetsIcon />
                {props.isGlobalElem(getBlockElementById(data?.id)) && (
                    <div className={styles.headerIcon}>
                        <Tooltip title="Global block">
                            <PublicIcon />
                        </Tooltip>
                    </div>
                )}
                <h3 className={styles.settingsTitle}>Container settings</h3>
            </div>
            <TextField
                onChange={handleNumberInput('maxWidth')}
                value={data?.editorStyles?.maxWidth}
                className={styles.settingsInput}
                type="number"
                label="Max width (px)" />
            <FormControl className={styles.settingsInput} >
                <InputLabel >Align</InputLabel>
                <Select
                    onChange={(e) => handleStyleChange('align', e.target.value as any)}
                    value={data?.editorStyles?.align}
                >
                    <MenuItem value={undefined}>no</MenuItem>
                    <MenuItem value={'left'}>left</MenuItem>
                    <MenuItem value={'right'}>right</MenuItem>
                    <MenuItem value={'center'}>center</MenuItem>
                </Select>
            </FormControl>
            <TextField
                onChange={handleNumberInput('offsetTop')}
                value={data?.editorStyles?.offsetTop}
                className={styles.settingsInput}
                type="number"
                label="Offset top (px)" />
            <TextField
                onChange={handleNumberInput('offsetBottom')}
                value={data?.editorStyles?.offsetBottom}
                className={styles.settingsInput}
                type="number"
                label="Offset bottom (px)" />
            <TextField
                onChange={handleNumberInput('offsetLeft')}
                value={data?.editorStyles?.offsetLeft}
                className={styles.settingsInput}
                type="number"
                label="Offset left (px)" />
            <TextField
                onChange={handleNumberInput('offsetRight')}
                value={data?.editorStyles?.offsetRight}
                className={styles.settingsInput}
                type="number"
                label="Offset right (px)" />
        </div>
    )
}
