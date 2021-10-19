import { TCromwellBlockData } from '@cromwell/core';
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Tooltip,
    SelectChangeEvent
} from '@mui/material';
import { PhotoLibrary as PhotoLibraryIcon, Public as PublicIcon } from '@mui/icons-material';
import React from 'react';

import GalleryPicker from '../../../../components/galleryPicker/GalleryPicker';
import { useForceUpdate } from '../../../../helpers/forceUpdate';
import { StylesEditor } from '../components/StylesEditor';
import styles from './BaseBlock.module.scss';
import { TBlockMenuProps } from './BlockMenu';

export function GalleryBlockSidebar(props: TBlockMenuProps) {
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
        handleChange(name, val);
    }

    const handleSelectTextInput = (name: keyof TCromwellBlockData['gallery']) => (e: SelectChangeEvent<unknown>) => {
        let val = e.target.value;
        if (val === '') val = undefined;
        handleChange(name, val);
    }

    const handleBoolInput = (name: keyof TCromwellBlockData['gallery']) => (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        handleChange(name, checked ?? false);
    }

    return (
        <div>
            <div className={styles.settingsHeader}>
                <PhotoLibraryIcon />
                {props.isGlobalElem(props.getBlockElementById(data?.id)) && (
                    <div className={styles.headerIcon}>
                        <Tooltip title="Global block">
                            <PublicIcon />
                        </Tooltip>
                    </div>
                )}
                <h3 className={styles.settingsTitle}>Gallery settings</h3>
            </div>
            <GalleryPicker
                images={data?.gallery?.images}
                onChange={(val) => handleChange('images', val)}
                className={styles.settingsInput}
                hideSrc
                editLink
            />
            <TextField
                fullWidth
                onChange={handleNumberInput('visibleSlides')}
                value={data?.gallery?.visibleSlides ?? 1}
                className={styles.settingsInput}
                type="number"
                variant="standard"
                label="Slides Per View" />
            <TextField
                fullWidth
                onChange={handleNumberInput('width')}
                value={data?.gallery?.width ?? ''}
                className={styles.settingsInput}
                type="number"
                variant="standard"
                label="Width (px)" />
            <TextField
                onChange={handleNumberInput('height')}
                fullWidth
                value={data?.gallery?.height ?? ''}
                className={styles.settingsInput}
                type="number"
                variant="standard"
                label="Height (px)" />
            <TextField
                onChange={handleNumberInput('ratio')}
                fullWidth
                value={data?.gallery?.ratio ?? ''}
                className={styles.settingsInput}
                type="number"
                variant="standard"
                label="Ratio width:height" />
            <TextField
                onChange={(event) => {
                    handleNumberInput('interval')(event);
                    handleBoolInput('autoPlay')(event as any, false);
                    setTimeout(() => handleBoolInput('autoPlay')(event as any, true), 10);
                }}
                fullWidth
                value={data?.gallery?.interval ?? ''}
                className={styles.settingsInput}
                type="number"
                variant="standard"
                label="Interval between slides, ms" />
            {/* <TextField
                onChange={handleNumberInput('speed')}
                fullWidth
                value={data?.gallery?.speed ?? null}
                className={styles.settingsInput}
                type="number"
                    variant="standard"
                label="Transition time between slides, ms" /> */}
            <FormControlLabel
                control={
                    <Checkbox
                        checked={!!data?.gallery?.autoPlay}
                        onChange={handleBoolInput('autoPlay')}
                        color="primary"
                    />
                }
                label="Auto play"
            />
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
                        checked={!!data?.gallery?.pagination}
                        onChange={handleBoolInput('pagination')}
                        color="primary"
                    />
                }
                label="Show pagination"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={!!data?.gallery?.thumbs}
                        onChange={handleBoolInput('thumbs')}
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
            <FormControlLabel
                control={
                    <Checkbox
                        checked={!!data?.gallery?.fullscreen}
                        onChange={handleBoolInput('fullscreen')}
                        color="primary"
                    />
                }
                label="Enable lightbox pop-up"
            />
            <TextField
                onChange={handleNumberInput('spaceBetween')}
                fullWidth
                value={data?.gallery?.spaceBetween ?? null}
                className={styles.settingsInput}
                type="number"
                variant="standard"
                label="Space between slides, px" />
            <FormControl
                fullWidth
                className={styles.settingsInput} >
                <InputLabel >Image fit</InputLabel>
                <Select
                    fullWidth
                    onChange={handleSelectTextInput('backgroundSize')}
                    variant="standard"
                    value={data?.gallery?.backgroundSize ?? 'cover'}
                >
                    <MenuItem value={'contain'}>Contain</MenuItem>
                    <MenuItem value={'cover'}>Cover</MenuItem>
                </Select>
            </FormControl>
            {/* <FormControl
                fullWidth
                className={styles.settingsInput} >
                <InputLabel >Effect</InputLabel>
                <Select
                    fullWidth
                    onChange={handleTextInput('effect')}
                                variant="standard"
                    value={data?.gallery?.effect ?? 'slide'}
                >
                    <MenuItem value={'slide'}>slide</MenuItem>
                    <MenuItem value={'fade'}>fade</MenuItem>
                    <MenuItem value={'cube'}>cube</MenuItem>
                    <MenuItem value={'coverflow'}>coverflow</MenuItem>
                    <MenuItem value={'flip'}>flip</MenuItem>
                </Select>
            </FormControl> */}
            <StylesEditor
                forceUpdate={forceUpdate}
                blockProps={props}
            />
        </div>
    );
}

