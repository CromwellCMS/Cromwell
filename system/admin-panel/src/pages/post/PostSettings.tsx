import 'date-fns';

import { EDBEntity, resolvePageRoute, serviceLocator, TPost, TTag } from '@cromwell/core';
import { Close as CloseIcon } from '@mui/icons-material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { Autocomplete, Button, Checkbox, FormControlLabel, IconButton, Popover, TextField, Tooltip } from '@mui/material';
import React, { useState } from 'react';

import { ImagePicker } from '../../components/imagePicker/ImagePicker';
import { getCustomMetaFor, RenderCustomFields } from '../../helpers/customFields';
import styles from './PostSettings.module.scss';


const PostSettings = (props: {
    postData?: TPost;
    isSettingsOpen: boolean;
    anchorEl: Element;
    allTags?: TTag[] | null;
    onClose: (newData: Partial<TPost>) => void;
    isSaving?: boolean;
    handleUnpublish: () => void;
    refetchMeta: () => Promise<Record<string, string> | undefined>;
}) => {
    const { postData, refetchMeta } = props;
    const [title, setTitle] = useState<string | undefined>(postData?.title ?? null);
    const [mainImage, setMainImage] = useState<string | undefined>(postData?.mainImage ?? null);
    const [pageDescription, setPageDescription] = useState<string | undefined>(postData?.pageDescription ?? null);
    const [pageKeywords, setPageKeywords] = useState<string[] | undefined>(postData?.meta?.keywords ?? null);
    const [pageTitle, setPageTitle] = useState<string | undefined>(postData?.pageTitle ?? null);
    const [slug, setSlug] = useState<string | undefined>(postData?.slug ?? null);
    const [tags, setTags] = useState<TTag[] | undefined>(postData?.tags ?? []);
    const [publishDate, setPublishDate] = useState<Date | undefined | null>(postData?.publishDate ?? null);
    const [featured, setFeatured] = useState<boolean | undefined | null>(postData?.featured ?? null);

    const handleChangeTags = (event: any, newValue: TTag[]) => {
        setTags(newValue);
    }
    const handleChangeKeywords = (event: any, newValue: string[]) => {
        setPageKeywords(newValue);
    }

    const handleClose = async () => {
        const newData = Object.assign({}, postData);
        newData.title = title;
        newData.mainImage = mainImage;
        newData.pageDescription = pageDescription;
        newData.pageTitle = pageTitle;
        newData.slug = slug;
        newData.tags = tags;
        newData.publishDate = publishDate;
        newData.featured = featured;
        if (pageKeywords) {
            if (!newData.meta) newData.meta = {};
            newData.meta.keywords = pageKeywords;
        }
        newData.customMeta = Object.assign({}, postData.customMeta, await getCustomMetaFor(EDBEntity.Post));
        props.onClose(newData);
    }

    let pageFullUrl;
    if (slug) {
        pageFullUrl = serviceLocator.getFrontendUrl() + resolvePageRoute('post', { slug: slug ?? postData.id + '' });
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
                <p className={styles.headerText}>Post meta</p>
                <IconButton className={styles.closeBtn}
                    id="post-settings-close-btn"
                    onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
                <TextField
                    label="Title"
                    value={title ?? ''}
                    fullWidth
                    className={styles.settingItem}
                    variant="standard"
                    onChange={e => setTitle(e.target.value)}
                />
                <TextField
                    label="Page URL"
                    className={styles.settingItem}
                    fullWidth
                    value={slug ?? ''}
                    onChange={e => setSlug(e.target.value)}
                    variant="standard"
                    helperText={pageFullUrl}
                />
                <ImagePicker
                    label="Main image"
                    onChange={(val) => setMainImage(val)}
                    value={mainImage}
                    className={styles.imageBox}
                    backgroundSize='cover'
                    showRemove
                />
                <Autocomplete
                    multiple
                    options={props.allTags ?? []}
                    defaultValue={tags?.map(tag => (props.allTags ?? []).find(allTag => allTag.name === tag.name)) ?? []}
                    getOptionLabel={(option) => option.name}
                    onChange={handleChangeTags}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            className={styles.settingItem}
                            variant="standard"
                            label="Tags"
                        />
                    )}
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Publish date"
                        value={publishDate}
                        onChange={(newValue) => {
                            setPublishDate(newValue);
                        }}
                        renderInput={(params) => <TextField
                            variant="standard"
                            fullWidth
                            {...params} />}
                    // disableToolbar
                    />
                </LocalizationProvider>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={featured}
                            onChange={() => setFeatured(!featured)}
                            color="primary"
                        />
                    }
                    style={{ margin: '10px 0' }}
                    className={styles.settingItem}
                    label="Featured post"
                />
                <TextField
                    label="Meta title"
                    className={styles.settingItem}
                    fullWidth
                    variant="standard"
                    value={pageTitle ?? ''}
                    onChange={e => setPageTitle(e.target.value)}
                />
                <TextField
                    label="Meta description"
                    className={styles.settingItem}
                    fullWidth
                    variant="standard"
                    value={pageDescription ?? ''}
                    onChange={e => setPageDescription(e.target.value)}
                />
                <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    value={(pageKeywords ?? []) as any}
                    getOptionLabel={(option) => option}
                    onChange={handleChangeKeywords}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            className={styles.settingItem}
                            variant="standard"
                            label="Meta keywords"
                        />
                    )}
                />
                {postData?.published && (
                    <Tooltip title="Remove post from publication">
                        <Button variant="contained" color="primary"
                            className={styles.publishBtn}
                            size="small"
                            disabled={props.isSaving}
                            onClick={props.handleUnpublish}
                        >Unpublish</Button>
                    </Tooltip>
                )}
                {postData && (
                    <RenderCustomFields
                        entityType={EDBEntity.Post}
                        entityData={postData}
                        refetchMeta={refetchMeta}
                    />
                )}
            </div>
        </Popover>
    )
}

export default PostSettings;