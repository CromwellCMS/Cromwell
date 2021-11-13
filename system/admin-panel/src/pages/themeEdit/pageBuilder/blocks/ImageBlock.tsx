import { TCromwellBlockData } from '@cromwell/core';
import { Image as ImageIcon, Public as PublicIcon } from '@mui/icons-material';
import { SelectChangeEvent, TextField, Tooltip } from '@mui/material';
import React from 'react';

import { ImagePicker } from '../../../../components/imagePicker/ImagePicker';
import { Select } from '../../../../components/select/Select';
import { useForceUpdate } from '../../../../helpers/forceUpdate';
import { StylesEditor } from '../components/StylesEditor';
import styles from './BaseBlock.module.scss';
import { TBlockMenuProps } from './BlockMenu';

export function ImageBlockSidebar(props: TBlockMenuProps) {
    const forceUpdate = useForceUpdate();
    const data = props.block?.getData();
    const imageData = Object.assign({}, props.block.getContentInstance().props, data?.image)

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

    const handleTextInput = (name: keyof TCromwellBlockData['image']) => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | SelectChangeEvent<unknown>) => {
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
                value={imageData?.src}
                style={{ borderBottom: '1px solid #999' }}
                placeholder={"Pick an image"}
                onChange={(val) => handleChange('src', val)}
                className={styles.settingsInput}
            />
            <TextField
                fullWidth
                onChange={handleTextInput('link')}
                value={imageData?.link}
                className={styles.settingsInput}
                variant="standard"
                label="Link to" />
            <TextField
                fullWidth
                onChange={handleNumberInput('width')}
                value={imageData?.width}
                className={styles.settingsInput}
                type="number"
                variant="standard"
                label="Width (px)" />
            <TextField
                onChange={handleNumberInput('height')}
                fullWidth
                value={imageData?.height}
                className={styles.settingsInput}
                type="number"
                variant="standard"
                label="Height (px)" />
            <TextField
                onChange={handleTextInput('alt')}
                fullWidth
                value={imageData?.alt}
                className={styles.settingsInput}
                variant="standard"
                label="Alt" />
            <Select
                label="Image fit"
                className={styles.settingsInput}
                fullWidth
                onChange={handleTextInput('objectFit')}
                variant="standard"
                value={imageData?.objectFit ?? 'contain'}
                options={[{ value: 'contain', label: 'Contain' }, { value: 'cover', label: 'Cover' }]}
            />

            <StylesEditor
                forceUpdate={forceUpdate}
                blockProps={props}
            />
        </div>
    );
}

