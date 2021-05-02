import 'date-fns';

import { TPost, TTag, serviceLocator } from '@cromwell/core';
import DateFnsUtils from '@date-io/date-fns';
import { IconButton, MenuItem, Popover, TextField } from '@material-ui/core';
import { Close as CloseIcon, HighlightOffOutlined, Wallpaper as WallpaperIcon } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import React, { useState } from 'react';
import { store } from '../../redux/store';

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
    const [title, setTitle] = useState<string | undefined>(postData?.title ?? null);
    const [mainImage, setMainImage] = useState<string | undefined>(postData?.mainImage ?? null);
    const [pageDescription, setPageDescription] = useState<string | undefined>(postData?.pageDescription ?? null);
    const [pageTitle, setPageTitle] = useState<string | undefined>(postData?.pageTitle ?? null);
    const [slug, setSlug] = useState<string | undefined>(postData?.slug ?? null);
    const [tags, setTags] = useState<TTag[] | undefined>(postData?.tags ?? []);
    const [publishDate, setPublishDate] = useState<Date | undefined | null>(postData?.publishDate ?? null);

    const handleChangeImage = async () => {
        const photoPath = await getFileManager()?.getPhoto({
            initialFileLocation: mainImage
        });
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
        newData.publishDate = publishDate;
        props.onClose(newData);
    }

    const themePostPage = store.getState()?.activeTheme?.defaultPages?.post;
    let pageFullUrl;
    if (themePostPage && slug) {
        pageFullUrl = serviceLocator.getFrontendUrl() + '/' + themePostPage.replace('[slug]', slug ?? postData?.id ?? '');
    }

    return (
        <Popover
            disableEnforceFocus
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
                    label="Page URL"
                    className={styles.settingItem}
                    fullWidth
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                    helperText={pageFullUrl}
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
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        fullWidth
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        label="Publish date"
                        value={publishDate}
                        onChange={setPublishDate}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                </MuiPickersUtilsProvider>
                <TextField
                    label="Meta title"
                    className={styles.settingItem}
                    fullWidth
                    value={pageTitle}
                    onChange={e => setPageTitle(e.target.value)}
                />
                <TextField
                    label="Meta description"
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