import { gql } from '@apollo/client';
import { EDBEntity, resolvePageRoute, serviceLocator, TTag, TTagInput } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { ArrowBack as ArrowBackIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { Autocomplete as MuiAutocomplete, Button, Grid, IconButton, Skeleton, TextField, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { ColorPicker } from '../../components/colorPicker/ColorPicker';
import { ImagePicker } from '../../components/imagePicker/ImagePicker';
import { toast } from '../../components/toast/toast';
import { tagPageInfo } from '../../constants/PageInfos';
import { getCustomMetaFor, getCustomMetaKeysFor, RenderCustomFields } from '../../helpers/customFields';
import { getEditorData, getEditorHtml, initTextEditor } from '../../helpers/editor/editor';
import { handleOnSaveError } from '../../helpers/handleErrors';
import commonStyles from '../../styles/common.module.scss';
import styles from './Tag.module.scss';

const TagPage = () => {
    const { id: tagId } = useParams<{ id: string }>();
    const client = getGraphQLClient();
    const [data, setData] = useState<TTag | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [tagLoading, setTagLoading] = useState<boolean>(false);
    const history = useHistory();
    const [canValidate, setCanValidate] = useState(false);
    const editorId = 'tag-description-editor';

    const getTagData = async (id: number) => {
        let tagData: TTag;
        try {
            tagData = await client.getTagById(id,
                gql`
                    fragment AdminPanelTagFragment on Tag {
                        id
                        slug
                        createDate
                        updateDate
                        pageTitle
                        pageDescription
                        meta {
                            keywords
                        }
                        isEnabled
                        name
                        color
                        image
                        description
                        descriptionDelta
                        customMeta (keys: ${JSON.stringify(getCustomMetaKeysFor(EDBEntity.Tag))})
                    }`, 'AdminPanelTagFragment');
            if (tagData) {
                setData(tagData);
            }
        } catch (e) {
            console.error(e)
        }

        if (!tagData) {
            setNotFound(true);
        }
        return tagData;
    }

    const init = async () => {

        let descriptionData = {};
        setTagLoading(true);

        if (tagId && tagId !== 'new') {
            const tag = await getTagData(parseInt(tagId));

            try {
                if (tag?.descriptionDelta)
                    descriptionData = JSON.parse(tag?.descriptionDelta);
            } catch (e) {
                console.error(e);
            }
        }

        if (tagId === 'new') {
            setData({} as any);
        }

        setTagLoading(false);

        await initTextEditor({
            htmlId: editorId,
            data: descriptionData,
            placeholder: 'Tag description...',
        });
    }

    useEffect(() => {
        init();
    }, []);

    const handleSave = async () => {
        setCanValidate(true);
        if (!data?.name) return;

        setIsSaving(true);

        const inputData: TTagInput = {
            slug: data.slug,
            pageTitle: data.pageTitle,
            pageDescription: data.pageDescription,
            meta: data.meta && {
                keywords: data.meta.keywords,
            },
            name: data.name,
            color: data.color,
            image: data.image,
            isEnabled: data.isEnabled,
            description: await getEditorHtml(editorId),
            descriptionDelta: JSON.stringify(await getEditorData(editorId)),
            customMeta: Object.assign({}, data.customMeta, await getCustomMetaFor(EDBEntity.Tag)),
        }

        if (tagId === 'new') {
            try {
                const newData = await client?.createTag(inputData);
                toast.success('Created tag!');
                history.replace(`${tagPageInfo.baseRoute}/${newData.id}`)
                await getTagData(newData.id);
            } catch (e) {
                toast.error('Failed to create tag');
                handleOnSaveError(e);
                console.error(e);
            }
        } else {
            try {
                await client?.updateTag(data.id, inputData);
                await getTagData(data.id);
                toast.success('Saved!');
            } catch (e) {
                toast.error('Failed to save');
                handleOnSaveError(e);
                console.error(e)
            }
        }
        setIsSaving(false);
        setCanValidate(false);
    }

    const handleInputChange = (prop: keyof TTag, val: any) => {
        if (data) {
            setData((prevData) => {
                const newData = Object.assign({}, prevData);
                (newData[prop] as any) = val;
                return newData;
            });
        }
    }

    const refetchMeta = async () => {
        if (!tagId) return;
        const data = await getTagData(parseInt(tagId));
        return data?.customMeta;
    };

    if (notFound) {
        return (
            <div className={styles.TagPage}>
                <div className={styles.notFoundPage}>
                    <p className={styles.notFoundText}>Tag not found</p>
                </div>
            </div>
        )
    }

    let pageFullUrl;
    if (data) {
        pageFullUrl = serviceLocator.getFrontendUrl() + resolvePageRoute('tag', { slug: data.slug ?? data.id + '' });
    }

    return (
        <div className={styles.TagPage}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <IconButton
                        onClick={() => window.history.back()}
                    >
                        <ArrowBackIcon style={{ fontSize: '18px' }} />
                    </IconButton>
                    <p className={commonStyles.pageTitle}>tag</p>
                </div>
                <div className={styles.headerActions}>
                    {pageFullUrl && (
                        <Tooltip title="Open tag in the new tab">
                            <IconButton
                                style={{ marginRight: '10px' }}
                                className={styles.openPageBtn}
                                aria-label="open"
                                onClick={() => { window.open(pageFullUrl, '_blank'); }}
                            >
                                <OpenInNewIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Button variant="contained" color="primary"
                        className={styles.saveBtn}
                        size="small"
                        disabled={isSaving}
                        onClick={handleSave}>Save</Button>
                </div>
            </div>
            <div className={styles.fields}>
                {tagLoading && (
                    Array(8).fill(1).map((it, index) => (
                        <Skeleton style={{ marginBottom: '10px' }} key={index} height={"50px"} />
                    ))
                )}
                {!tagLoading && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Name"
                                value={data?.name || ''}
                                fullWidth
                                variant="standard"
                                className={styles.textField}
                                onChange={(e) => { handleInputChange('name', e.target.value) }}
                                error={canValidate && !data?.name}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ColorPicker
                                className={styles.textField}
                                label="Color"
                                value={data?.color ?? '#fff'}
                                onChange={color => handleInputChange('color', color)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                label="Page URL"
                                className={styles.textField}
                                fullWidth
                                variant="standard"
                                value={data?.slug || ''}
                                helperText={pageFullUrl}
                                onChange={(e) => { handleInputChange('slug', e.target.value) }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <ImagePicker
                                label="Image"
                                className={styles.imageField}
                                onChange={(val) => handleInputChange('image', val)}
                                value={data?.image}
                                backgroundSize='cover'
                                showRemove
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <div className={styles.descriptionEditor}>
                                <div style={{ minHeight: '300px' }} id={editorId}></div>
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Meta title"
                                className={styles.textField}
                                fullWidth
                                variant="standard"
                                value={data?.pageTitle || ''}
                                onChange={(e) => { handleInputChange('pageTitle', e.target.value) }}
                            />
                        </Grid>
                        <Grid item xs={12} >
                            <TextField
                                label="Meta description"
                                className={styles.textField}
                                fullWidth
                                variant="standard"
                                value={data?.pageDescription || ''}
                                onChange={(e) => { handleInputChange('pageDescription', e.target.value) }}
                            />
                        </Grid>
                        <Grid item xs={12} >
                            <MuiAutocomplete
                                multiple
                                freeSolo
                                options={[]}
                                className={styles.textField}
                                value={data?.meta?.keywords ?? []}
                                getOptionLabel={(option) => option as any}
                                onChange={(e, newVal) => {
                                    handleInputChange('meta', {
                                        ...(data.meta ?? {}),
                                        keywords: newVal
                                    })
                                }}
                                renderInput={(params) => (
                                    <Tooltip title="Press ENTER to add">
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            label="Meta keywords"
                                        />
                                    </Tooltip>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} >
                            {data && (
                                <RenderCustomFields
                                    entityType={EDBEntity.Tag}
                                    entityData={data}
                                    refetchMeta={refetchMeta}
                                />
                            )}
                        </Grid>
                    </Grid>
                )}
            </div>
        </div>
    )
}


export default TagPage;
