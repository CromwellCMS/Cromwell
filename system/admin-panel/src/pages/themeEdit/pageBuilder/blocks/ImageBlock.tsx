import { TCromwellBlockData } from '@cromwell/core';
import { FormControl, InputLabel, MenuItem, Select, TextField, Tooltip } from '@material-ui/core';
import { Image as ImageIcon, Public as PublicIcon } from '@material-ui/icons';
import React from 'react';

import ImagePicker from '../../../../components/imagePicker/ImagePicker';
import { useForceUpdate } from '../../../../helpers/forceUpdate';
import { StylesEditor } from '../components/StylesEditor';
import styles from './BaseBlock.module.scss';
import { TBlockMenuProps } from './BlockMenu';

export function ImageBlockSidebar(props: TBlockMenuProps) {
    const forceUpdate = useForceUpdate();
    const data = props.block?.getData();

    const handleChange = (key: keyof TCromwellBlockData['image'], value: any) => {
        const data = props.block?.getData();
        if (!data.image) data.image = {};
        (data.image[key] as any) = value;
        props.modifyData?.(data);
        forceUpdate();
    }

    const handleNumberInput = (name: keyof TCromwellBlockData['image']) => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        let val = parseInt(e.target.value);
        if (isNaN(val)) val = undefined;
        handleChange(name, val)
    }

    const handleTextInput = (name: keyof TCromwellBlockData['image']) => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        let val = e.target.value;
        if (val === '') val = undefined;
        handleChange(name, val)
    }

    return (
        <div>
            <div className={styles.settingsHeader}>
                <ImageIcon />
                {props.isGlobalElem(props.getBlockElementById(data?.id)) && (
                    <div className={styles.headerIcon}>
                        <Tooltip title="Global block">
                            <PublicIcon />
                        </Tooltip>
                    </div>
                )}
                <h3 className={styles.settingsTitle}>Image settings</h3>
            </div>
            <ImagePicker
                value={data?.image?.src}
                style={{ borderBottom: '1px solid #999' }}
                placeholder={"Pick an image"}
                onChange={(val) => handleChange('src', val)}
                className={styles.settingsInput}
            />
            <TextField
                fullWidth
                onChange={handleTextInput('link')}
                value={data?.image?.link}
                className={styles.settingsInput}
                label="Link to" />
            <TextField
                fullWidth
                onChange={handleNumberInput('width')}
                value={data?.image?.width}
                className={styles.settingsInput}
                type="number"
                label="Width (px)" />
            <TextField
                onChange={handleNumberInput('height')}
                fullWidth
                value={data?.image?.height}
                className={styles.settingsInput}
                type="number"
                label="Height (px)" />
            <TextField
                onChange={handleTextInput('alt')}
                fullWidth
                value={data?.image?.alt}
                className={styles.settingsInput}
                label="Alt" />
            <FormControl
                fullWidth
                className={styles.settingsInput} >
                <InputLabel >Object fit</InputLabel>
                <Select
                    fullWidth
                    onChange={handleTextInput('objectFit')}
                    value={data?.image?.objectFit ?? 'contain'}
                >
                    <MenuItem value={'contain'}>Contain</MenuItem>
                    <MenuItem value={'cover'}>Cover</MenuItem>
                </Select>
            </FormControl>
            <StylesEditor
                forceUpdate={forceUpdate}
                blockProps={props}
            />
        </div>
    );
}

