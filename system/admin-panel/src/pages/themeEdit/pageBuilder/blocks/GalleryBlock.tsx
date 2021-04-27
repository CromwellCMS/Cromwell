import { TCromwellBlockData } from '@cromwell/core';
import { FormControl, InputLabel, MenuItem, Select, TextField, Tooltip } from '@material-ui/core';
import { Power as PowerIcon } from '@material-ui/icons';
import React from 'react';

import GalleryPicker from '../../../../components/galleryPicker/GalleryPicker';
import { useForceUpdate } from '../../../../helpers/forceUpdate';
import styles from './BaseBlock.module.scss';
import { BaseMenu, TBaseMenuProps } from './BaseMenu';

export function GalleryBlock(props: TBaseMenuProps) {
    const forceUpdate = useForceUpdate();
    const data = props.block?.getData();

    const handleChange = (key: keyof TCromwellBlockData['gallery'], value: any) => {
        const data = props.block?.getData();
        if (!data.gallery) data.gallery = {};
        if (!data.gallery.images) data.gallery.images = [];
        props.modifyData?.(Object.assign({}, data, {
            gallery: { ...data.gallery, [key]: value }
        }));
        forceUpdate();
        props.block?.getContentInstance?.()?.forceUpdate();
    }

    const handleNumberInput = (name: keyof TCromwellBlockData['gallery']) => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        let val = parseInt(e.target.value);
        if (isNaN(val)) val = undefined;
        handleChange(name, val)
    }

    const handleTextInput = (name: keyof TCromwellBlockData['gallery']) => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        let val = e.target.value;
        if (val === '') val = undefined;
        handleChange(name, val)
    }

    return (
        <>
            <BaseMenu
                {...props}
                icon={(
                    <Tooltip title="Plugin block">
                        <PowerIcon />
                    </Tooltip>
                )}
                settingsContent={(
                    <div>
                        <h3 className={styles.settingsTitle}>Gallery settings</h3>
                        <GalleryPicker
                            images={data?.gallery?.images}
                            onChange={(val) => handleChange('images', val)}
                        />
                        <TextField
                            fullWidth
                            onChange={handleNumberInput('slidesPerView')}
                            value={data?.gallery?.slidesPerView ?? 1}
                            className={styles.settingsInput}
                            type="number"
                            label="Slides Per View" />
                        <TextField
                            fullWidth
                            onChange={handleNumberInput('width')}
                            value={data?.gallery?.width ?? null}
                            className={styles.settingsInput}
                            type="number"
                            label="Width (px)" />
                        <TextField
                            onChange={handleNumberInput('height')}
                            fullWidth
                            value={data?.gallery?.height ?? null}
                            className={styles.settingsInput}
                            type="number"
                            label="Height (px)" />
                        <TextField
                            onChange={handleNumberInput('ratio')}
                            fullWidth
                            value={data?.gallery?.ratio ?? null}
                            className={styles.settingsInput}
                            type="number"
                            label="Ratio width:heigth" />
                        <FormControl
                            fullWidth
                            className={styles.settingsInput} >
                            <InputLabel >Object fit</InputLabel>
                            <Select
                                fullWidth
                                onChange={handleTextInput('objectFit')}
                                value={data?.gallery?.objectFit ?? 'cover'}
                            >
                                <MenuItem value={'contain'}>Contain</MenuItem>
                                <MenuItem value={'cover'}>Cover</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                )}
            />
            {props?.block?.getDefaultContent()}
        </>
    );
}

