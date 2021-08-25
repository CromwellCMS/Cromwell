import { resolvePageRoute, serviceLocator, TTag, TTagInput } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { Button, Grid, IconButton, TextField, Tooltip } from '@material-ui/core';
import { ArrowBack as ArrowBackIcon, OpenInNew as OpenInNewIcon } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import ColorPicker from '../../components/colorPicker/ColorPicker';
import { toast } from '../../components/toast/toast';
import { tagListPageInfo, tagPageInfo } from '../../constants/PageInfos';
import commonStyles from '../../styles/common.module.scss';
import styles from './Tag.module.scss';
import { getEditorData, getEditorHtml, initTextEditor } from '../../helpers/editor';

const TagPage = () => {
    const { id: tagId } = useParams<{ id: string }>();
    const client = getGraphQLClient();
    const [data, setData] = useState<TTag | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [tagLoading, setTagLoading] = useState<boolean>(false);
    const history = useHistory();
    const editorId = 'tag-description-editor';

    const getTagData = async (id: string) => {
        let tagData: TTag;
        try {
            tagData = await client.getTagById(id);
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
            const tag = await getTagData(tagId);

            try {
                if (tag?.descriptionDelta)
                    descriptionData = JSON.parse(tag?.descriptionDelta);
            } catch (e) {
                console.error(e);
            }
        }

        if (tagId === 'new') {
            setData({ id: tagId } as any);
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
        if (!data) return;
        setIsSaving(true);

        const inputData: TTagInput = {
            slug: data.slug,
            pageTitle: data.pageTitle,
            pageDescription: data.pageDescription,
            name: data.name,
            color: data.color,
            image: data.image,
            isEnabled: data.isEnabled,
            description: await getEditorHtml(editorId),
            descriptionDelta: JSON.stringify(await getEditorData(editorId)),
        }

        if (data?.id === 'new') {
            try {
                const newData = await client?.createTag(inputData);
                toast.success('Created tag!');
                history.push(`${tagPageInfo.baseRoute}/${newData.id}`)
                await getTagData(newData.id);
            } catch (e) {
                toast.error('Failed to create tag');
                console.error(e);
            }
        } else {
            try {
                await client?.updateTag(data.id, inputData);
                await getTagData(data.id);
                toast.success('Saved!');
            } catch (e) {
                toast.error('Failed to save');
                console.error(e)
            }
        }
        setIsSaving(false);
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
        pageFullUrl = serviceLocator.getFrontendUrl() + resolvePageRoute('tag', { slug: data.slug ?? data.id });
    }

    return (
        <div className={styles.TagPage}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link to={tagListPageInfo.route}>
                        <IconButton>
                            <ArrowBackIcon />
                        </IconButton>
                    </Link>
                    <p className={commonStyles.pageTitle}>tag</p>
                </div>
                <div className={styles.headerActions}>
                    {pageFullUrl && (
                        <Tooltip title="Open tag page in new tab">
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
                                className={styles.textField}
                                onChange={(e) => { handleInputChange('name', e.target.value) }}
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
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Page URL"
                                className={styles.textField}
                                fullWidth
                                value={data?.slug || ''}
                                helperText={pageFullUrl}
                                onChange={(e) => { handleInputChange('slug', e.target.value) }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <div className={styles.descriptionEditor}>
                                <div style={{ height: '350px' }} id={editorId}></div>
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Meta title"
                                className={styles.textField}
                                fullWidth
                                value={data?.pageTitle || ''}
                                onChange={(e) => { handleInputChange('pageTitle', e.target.value) }}
                            />
                        </Grid>
                        <Grid item xs={12} >
                            <TextField
                                label="Meta description"
                                className={styles.textField}
                                fullWidth
                                value={data?.pageDescription || ''}
                                onChange={(e) => { handleInputChange('pageDescription', e.target.value) }}
                            />
                        </Grid>
                    </Grid>
                )}
            </div>
        </div>
    )
}


export default TagPage;
