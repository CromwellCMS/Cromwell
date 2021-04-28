import { TCromwellBlockData } from '@cromwell/core';
import { FormControl, InputLabel, MenuItem, Select, TextField, Tooltip, FormControlLabel, Checkbox } from '@material-ui/core';
import { PhotoLibrary as PhotoLibraryIcon } from '@material-ui/icons';
import React from 'react';

import GalleryPicker from '../../../../components/galleryPicker/GalleryPicker';
import { useForceUpdate } from '../../../../helpers/forceUpdate';
import styles from './BaseBlock.module.scss';
import { BaseMenu, TBaseMenuProps } from './BaseMenu';

export function GalleryBlockReplacer(props: TBaseMenuProps) {
    return (
        <>
            <BaseMenu
                {...props}
                icon={(
                    <Tooltip title="Gallery block">
                        <PhotoLibraryIcon />
                    </Tooltip>
                )}
            />
            {props?.block?.getDefaultContent()}
        </>
    );
}

export function GalleryBlockSidebar(props: TBaseMenuProps) {
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
        let val = parseFloat(e.target.value);
        if (isNaN(val)) val = undefined;
        handleChange(name, val)
    }

    const handleTextInput = (name: keyof TCromwellBlockData['gallery']) => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        let val = e.target.value;
        if (val === '') val = undefined;
        handleChange(name, val)
    }

    const handleBoolInput = (name: keyof TCromwellBlockData['gallery']) => (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        handleChange(name, checked ?? false)
    }


    return (
        <div>
            <div className={styles.settingsHeader}>
                <PhotoLibraryIcon />
                <h3 className={styles.settingsTitle}>Gallery settings</h3>
            </div>
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
                label="Ratio width:height" />
            <TextField
                onChange={handleNumberInput('delay')}
                fullWidth
                value={data?.gallery?.delay ?? null}
                className={styles.settingsInput}
                type="number"
                label="Delay before autoslide to next, ms" />
            <TextField
                onChange={handleNumberInput('speed')}
                fullWidth
                value={data?.gallery?.speed ?? null}
                className={styles.settingsInput}
                type="number"
                label="Transition time between slides, ms" />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={!!data?.gallery?.navigation}
                        onChange={handleBoolInput('navigation')}
                        color="primary"
                    />
                }
                label="Show navigation"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={!!data?.gallery?.showPagination}
                        onChange={handleBoolInput('showPagination')}
                        color="primary"
                    />
                }
                label="Show pagination"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={!!data?.gallery?.showScrollbar}
                        onChange={handleBoolInput('showScrollbar')}
                        color="primary"
                    />
                }
                label="Show scrollbar"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={!!data?.gallery?.showThumbs}
                        onChange={handleBoolInput('showThumbs')}
                        color="primary"
                    />
                }
                label="Show thumbnails"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={!!data?.gallery?.loop}
                        onChange={handleBoolInput('loop')}
                        color="primary"
                    />
                }
                label="Loop slides"
            />
            <TextField
                onChange={handleNumberInput('spaceBetween')}
                fullWidth
                value={data?.gallery?.spaceBetween ?? null}
                className={styles.settingsInput}
                type="number"
                label="Space between slides, px" />
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
            <FormControl
                fullWidth
                className={styles.settingsInput} >
                <InputLabel >Effect</InputLabel>
                <Select
                    fullWidth
                    onChange={handleTextInput('effect')}
                    value={data?.gallery?.effect ?? 'slide'}
                >
                    <MenuItem value={'slide'}>slide</MenuItem>
                    <MenuItem value={'fade'}>fade</MenuItem>
                    <MenuItem value={'cube'}>cube</MenuItem>
                    <MenuItem value={'coverflow'}>coverflow</MenuItem>
                    <MenuItem value={'flip'}>flip</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}

