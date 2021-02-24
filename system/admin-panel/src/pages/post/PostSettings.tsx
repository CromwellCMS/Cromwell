import { getFileManager } from '../../components/fileManager/helpers';
import React, { useEffect, useRef, useState } from 'react';
import styles from './PostSettings.module.scss';
import { Button, IconButton, MenuItem, Tooltip, TextField, Popover } from '@material-ui/core';
import { TPost } from '@cromwell/core';
import {
    NavigateBefore as NavigateBeforeIcon,
    Settings as SettingsIcon,
    Edit as EditIcon,
    Wallpaper as WallpaperIcon,
    HighlightOffOutlined
} from '@material-ui/icons';


const PostSettings = (props: {
    postData?: Partial<TPost>;
    isSettingsOpen: boolean;
    anchorEl: Element;
    onClose: (newData: Partial<TPost>) => void;
}) => {
    const { postData } = props;
    const [title, setTitle] = useState<string | undefined>(postData?.title);
    const [mainImage, setMainImage] = useState<string | undefined>(postData?.mainImage);
    const [pageDescription, setPageDescription] = useState<string | undefined>(postData?.pageDescription);
    const [pageTitle, setPageTitle] = useState<string | undefined>(postData?.pageTitle);
    const [slug, setSlug] = useState<string | undefined>(postData?.slug);

    const handleChangeImage = async () => {
        const photoPath = await getFileManager()?.getPhoto();
        if (photoPath) {
            setMainImage(photoPath);
        }
    }

    const handleClose = () => {
        const newData = Object.assign({}, postData);
        newData.title = title;
        newData.mainImage = mainImage;
        newData.pageDescription = pageDescription;
        newData.pageTitle = pageTitle;
        newData.slug = slug;
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
                                />
                            )}
                    </MenuItem>
                    <p style={{ margin: '10px' }}>{mainImage ?? 'no image'}</p>
                    <IconButton onClick={(e) => { e.stopPropagation(); setMainImage(undefined) }}>
                        <HighlightOffOutlined />
                    </IconButton>
                </div>
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