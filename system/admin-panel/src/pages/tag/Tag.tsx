import { TStoreListItem, TTag, TTagInput } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { Button, IconButton, TextField } from '@material-ui/core';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';

import { toast } from '../../components/toast/toast';
import ColorPicker from '../../components/colorPicker/ColorPicker';
import { tagListPageInfo, tagPageInfo } from '../../constants/PageInfos';
import styles from './Tag.module.scss';

const TagPage = () => {
    const { id: tagId } = useParams<{ id: string }>();
    const client = getGraphQLClient();
    const [data, setData] = useState<TTag | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [tagLoading, setTagLoading] = useState<boolean>(false);
    const history = useHistory();

    const getTagData = async (id: string) => {
        let tagData: TTag;
        setTagLoading(true);
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
        setTagLoading(false);
    }

    const init = async () => {
        if (tagId && tagId !== 'new') {
            getTagData(tagId);
        }

        if (tagId === 'new') {
            setData({ id: tagId } as any);
        }
    }

    useEffect(() => {
        init();
    }, []);

    const handleSave = async () => {
        if (data) {
            const inputData: TTagInput = {
                slug: data.slug,
                pageTitle: data.pageTitle,
                pageDescription: data.pageDescription,
                name: data.name,
                color: data.color,
                image: data.image,
                description: data.description,
                isEnabled: data.isEnabled,
            }

            if (data?.id === 'new') {
                try {
                    const newData = await client?.createTag(inputData);
                    toast.success('Created tag!');
                    history.push(`${tagPageInfo.baseRoute}/${newData.id}`)
                    await getTagData(newData.id);
                } catch (e) {
                    toast.error('Failed to create post');
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
        }
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

    return (
        <div className={styles.TagPage}>
            <div className={styles.header}>
                <div>
                    <Link to={tagListPageInfo.route}>
                        <IconButton
                        >
                            <ArrowBackIcon />
                        </IconButton>
                    </Link>
                </div>
                <div className={styles.headerActions}>
                    <Button variant="contained" color="primary"
                        className={styles.saveBtn}
                        size="small"
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
                    <>
                        <TextField label="Name"
                            value={data?.name || ''}
                            fullWidth
                            className={styles.textField}
                            onChange={(e) => { handleInputChange('name', e.target.value) }}
                        />
                        <ColorPicker
                            className={styles.textField}
                            label="Color"
                            value={data?.color ?? '#fff'}
                            onChange={color => handleInputChange('color', color)}
                        />
                        <TextField
                            label="Page slug"
                            className={styles.textField}
                            fullWidth
                            value={data?.slug || ''}
                            onChange={(e) => { handleInputChange('slug', e.target.value) }}
                        />
                        <TextField
                            label="Page meta title (SEO)"
                            className={styles.textField}
                            fullWidth
                            value={data?.pageTitle || ''}
                            onChange={(e) => { handleInputChange('pageTitle', e.target.value) }}
                        />
                        <TextField
                            label="Page meta description (SEO)"
                            className={styles.textField}
                            fullWidth
                            value={data?.pageDescription || ''}
                            onChange={(e) => { handleInputChange('pageDescription', e.target.value) }}
                        />
                    </>
                )}
            </div>
        </div>
    )
}


export default TagPage;
