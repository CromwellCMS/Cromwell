import { TPost, TTag } from '@cromwell/core';
import { IconButton, MenuItem, Popover, TextField } from '@material-ui/core';
import { Close as CloseIcon, HighlightOffOutlined, Wallpaper as WallpaperIcon } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useRef, useState } from 'react';

import { getFileManager } from '../../components/fileManager/helpers';
import styles from './PostSettings.module.scss';


const PostSettings = (props: {
    postData?: Partial<TPost>;
    isSettingsOpen: boolean;
    anchorEl: Element;
    allTags?: TTag[] | null;
    onClose: (newData: Partial<TPost>) => void;
}) => {
    const { postData } = props;
    const [title, setTitle] = useState<string | undefined>(postData?.title);
    const [mainImage, setMainImage] = useState<string | undefined>(postData?.mainImage);
    const [pageDescription, setPageDescription] = useState<string | undefined>(postData?.pageDescription);
    const [pageTitle, setPageTitle] = useState<string | undefined>(postData?.pageTitle);
    const [slug, setSlug] = useState<string | undefined>(postData?.slug);
    const [tags, setTags] = useState<TTag[] | undefined>(postData?.tags);

    const handleChangeImage = async () => {
        const photoPath = await getFileManager()?.getPhoto();
        if (photoPath) {
            setMainImage(photoPath);
        }
    }

    const handleChangeTags = (event: any, newValue: TTag[]) => {
        setTags(newValue);
    }

    const handleClose = () => {
        const newData = Object.assign({}, postData);
        newData.title = title;
        newData.mainImage = mainImage;
        newData.pageDescription = pageDescription;
        newData.pageTitle = pageTitle;
        newData.slug = slug;
        newData.tags = tags;
        props.onClose(newData);
    }

    return (
        <Popover
            open={props.isSettingsOpen}
            elevation={0}
            anchorEl={props.anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            classes={{ paper: styles.popover }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <div className={styles.PostSettings}>
                <p className={styles.headerText}>Page settings</p>
                <IconButton className={styles.closeBtn}
                    id="post-settings-close-btn"
                    onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
                <TextField
                    label="Title"
                    value={title}
                    fullWidth
                    className={styles.settingItem}
                    onChange={e => setTitle(e.target.value)}
                />
                <TextField
                    label="Page slug"
                    className={styles.settingItem}
                    fullWidth
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                />
                <div className={styles.imageBox}
                    onClick={handleChangeImage}
                >
                    <MenuItem style={{ padding: '0', borderRadius: '7px' }}>
                        {mainImage ? (
                            <div
                                style={{ backgroundImage: `url(${mainImage})` }}
                                className={styles.mainImage}></div>
                        ) : (
                            <WallpaperIcon
                                style={{ opacity: '0.7' }}
                            />
                        )}
                    </MenuItem>
                    <p style={{ margin: '10px' }}>{mainImage ?? <span style={{ opacity: '0.7' }}>No image</span>}</p>
                    {mainImage && (
                        <IconButton onClick={(e) => { e.stopPropagation(); setMainImage(undefined) }}>
                            <HighlightOffOutlined />
                        </IconButton>
                    )}
                </div>
                <Autocomplete
                    multiple
                    className={styles.settingItem}
                    options={props.allTags ?? []}
                    defaultValue={tags?.map(tag => (props.allTags ?? []).find(allTag => allTag.name === tag.name)) ?? []}
                    getOptionLabel={(option) => option.name}
                    onChange={handleChangeTags}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="standard"
                            label="Tags"
                        />
                    )}
                />
                <TextField
                    label="Page meta title (SEO)"
                    className={styles.settingItem}
                    fullWidth
                    value={pageTitle}
                    onChange={e => setPageTitle(e.target.value)}
                />
                <TextField
                    label="Page meta description (SEO)"
                    className={styles.settingItem}
                    fullWidth
                    value={pageDescription}
                    onChange={e => setPageDescription(e.target.value)}
                />
            </div>
        </Popover>
    )
}

export default PostSettings;