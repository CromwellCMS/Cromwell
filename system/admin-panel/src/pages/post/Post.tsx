import { gql } from '@apollo/client';
import {
    EDBEntity,
    getStoreItem,
    onStoreChange,
    resolvePageRoute,
    serviceLocator,
    TPost,
    TPostInput,
    TTag,
    TUser,
} from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { MoreHoriz as MoreHorizIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { Button, IconButton, Skeleton, Tooltip } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import { toast } from '../../components/toast/toast';
import { postListInfo, postPageInfo } from '../../constants/PageInfos';
import { getCustomMetaKeysFor } from '../../helpers/customFields';
import { getEditorData, getEditorHtml, initTextEditor } from '../../helpers/editor/editor';
import { useForceUpdate } from '../../helpers/forceUpdate';
import { handleOnSaveError } from '../../helpers/handleErrors';
import styles from './Post.module.scss';
import PostSettings from './PostSettings';


const ArrowBackIcon = <svg style={{ fontSize: '18px' }} width="1em" height="1em" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>
const textPreloader = [];
for (let i = 0; i < 30; i++) {
    textPreloader.push(<Skeleton variant="text" height="10px" style={{ margin: '3px 0' }} key={i} />)
}

const Post = (props) => {
    const { id: postId } = useParams<{ id: string }>();
    const [postData, setPostData] = useState<TPost | undefined>(undefined);
    const userInfo: TUser | undefined = getStoreItem('userInfo');
    const client = getGraphQLClient();
    const [allTags, setAllTags] = useState<TTag[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const actionsRef = useRef<HTMLDivElement | null>(null);
    const hasChanges = useRef<boolean>(false);
    const history = useHistory();
    const forceUpdate = useForceUpdate();
    const editorId = 'post-text-editor';

    const unregisterBlock = useRef<(() => void) | null>(null);

    const getPostData = async (postId: number): Promise<TPost | undefined> => {
        let post;
        try {
            post = await client?.getPostById(postId, gql`
                fragment AdminPanelPostFragment on Post {
                    id
                    slug
                    pageTitle
                    pageDescription
                    meta {
                        keywords
                    }
                    createDate
                    updateDate
                    isEnabled
                    title
                    author {
                        id
                        fullName
                        email
                        avatar
                    }
                    mainImage
                    publishDate
                    featured
                    tags {
                        id
                        slug
                        name
                        color
                    }
                    content
                    delta
                    published 
                    customMeta (fields: ${JSON.stringify(getCustomMetaKeysFor(EDBEntity.Post))})
                }`, 'AdminPanelPostFragment'
            );
            if (post) setPostData(post);
        } catch (e) { console.error(e) }
        return post;
    }

    const getPostTags = async () => {
        try {
            const data = (await client?.getTags({ pageSize: 99999 }))?.elements;
            if (data && Array.isArray(data)) {
                setAllTags(data.sort((a, b) => a.name < b.name ? -1 : 1));
            }
        } catch (e) {
            console.error(e)
        }
    }

    const _initEditor = async (postContent?: any) => {
        await initTextEditor({
            htmlId: editorId,
            data: postContent,
            autofocus: true,
            onChange: () => {
                if (!hasChanges.current) {
                    hasChanges.current = true;
                    forceUpdate();
                }
            }
        });
    }

    const init = async () => {

        unregisterBlock.current = props.history?.block(() => {
            if (hasChanges.current) return 'Your unsaved changes will be lost. Do you want to discard and leave this page?';
        });

        getPostTags();

        if (postId && postId !== 'new') {
            let postContent: any = null;
            let post;
            setIsLoading(true);
            try {
                post = await getPostData(parseInt(postId));
                if (post?.delta) {
                    postContent = JSON.parse(post?.delta);
                }
            } catch (e) {
                console.error(e);
            }
            setIsLoading(false);

            if (post) {
                await _initEditor(postContent);
            }
            else setNotFound(true);
        }

        if (postId === 'new') {
            setPostData({
                title: 'Untitled',
                published: false,
            } as any);
            await _initEditor();
        }
    }

    useEffect(() => {
        init();

        onStoreChange('userInfo', () => {
            forceUpdate();
        });

        return () => {
            unregisterBlock.current?.();
        }
    }, []);


    const getInput = async (): Promise<TPostInput> => ({
        slug: postData.slug,
        pageTitle: postData.pageTitle,
        pageDescription: postData.pageDescription,
        title: postData.title,
        mainImage: postData.mainImage,
        publishDate: postData.publishDate,
        published: postData.published,
        featured: postData.featured,
        isEnabled: postData.isEnabled,
        meta: {
            keywords: postData.meta?.keywords,
        },
        tagIds: postData.tags?.map(tag => tag.id)?.filter(Boolean),
        authorId: postData?.author?.id ?? userInfo?.id,
        delta: JSON.stringify(await getEditorData(editorId)),
        content: await getEditorHtml(editorId),
        customMeta: postData.customMeta,
    });

    const saveInput = async (input: TPostInput) => {
        if (postId === 'new') {
            try {
                input.authorId = userInfo?.id;
                const newPost = await client?.createPost(input);

                setPostData(newPost);
                toast.success('Created post!');

                hasChanges.current = false;
                history.push(`${postPageInfo.baseRoute}/${newPost.id}`)
                await getPostData(newPost.id);
            } catch (e) {
                toast.error('Failed to create post');
                handleOnSaveError(e);
                console.error(e)
            }
        } else if (postData?.id) {
            try {
                await client?.updatePost(postData.id, input);
                hasChanges.current = false;
                await getPostData(postData.id);
                toast.success('Saved!');
            } catch (e) {
                toast.error('Failed to save');
                handleOnSaveError(e);
                console.error(e)
            }
        }
    }

    const refetchMeta = async () => {
        if (!postId) return;
        const data = await getPostData(parseInt(postId));
        return data?.customMeta;
    };

    const handlePublish = async () => {
        setIsSaving(true);
        const input = await getInput();
        input.published = true;
        if (!input.publishDate) input.publishDate = new Date(Date.now());
        await saveInput(input);
        setIsSaving(false);
    }

    const handleUnpublish = async () => {
        setIsSaving(true);
        const input = await getInput();
        input.published = false;
        await saveInput(input);
        setIsSaving(false);
    }

    const handleSave = async () => {
        setIsSaving(true);
        await saveInput(await getInput());
        setIsSaving(false);
    }

    const handleOpenSettings = () => {
        setIsSettingsOpen(true);
    }

    const handleCloseSettings = (newData: TPost) => {
        setIsSettingsOpen(false);
        hasChanges.current = true;
        setPostData(newData);
    }

    if (notFound) {
        return (
            <div className={styles.Post}>
                <div className={styles.notFoundPage}>
                    <p className={styles.notFoundText}>Post not found</p>
                </div>
            </div>
        )
    }

    let pageFullUrl;
    if (postData) {
        pageFullUrl = serviceLocator.getFrontendUrl() + resolvePageRoute('post', { slug: postData.slug ?? postData.id + '' });
    }

    return (
        <div className={styles.Post}>
            <div className={styles.postHeader}>
                <div className={styles.headerLeft}>
                    <Link to={postListInfo.route}>
                        <IconButton
                        >
                            {ArrowBackIcon}
                        </IconButton>
                    </Link>
                    <Tooltip title="Edit title in meta">
                        <p className={styles.title} onClick={handleOpenSettings}>{postData?.title ?? ''}</p>
                    </Tooltip>
                </div>
                <div ref={actionsRef}>
                    <Tooltip title="Post meta info">
                        <IconButton onClick={handleOpenSettings}
                            style={{ marginRight: '10px' }}
                            id="more-button"
                        >
                            <MoreHorizIcon />
                        </IconButton>
                    </Tooltip>
                    {isSettingsOpen && (
                        <PostSettings
                            allTags={allTags}
                            postData={postData}
                            isSettingsOpen={isSettingsOpen}
                            onClose={handleCloseSettings}
                            anchorEl={actionsRef.current}
                            isSaving={isSaving}
                            handleUnpublish={handleUnpublish}
                            refetchMeta={refetchMeta}
                        />
                    )}
                    {pageFullUrl && postData?.published && (
                        <Tooltip title="Open post in the new tab">
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
                    {!postData?.published && (
                        <Button variant="contained" color="primary"
                            className={styles.publishBtn}
                            size="small"
                            disabled={isSaving}
                            onClick={handlePublish}>
                            Publish</Button>
                    )}
                    <Button variant="contained" color="primary"
                        className={styles.saveBtn}
                        size="small"
                        disabled={!hasChanges.current || isSaving}
                        onClick={handleSave}>
                        Save</Button>
                </div>
            </div>
            {isLoading && (
                <>
                    <Skeleton width="100%" height="100px" style={{
                        margin: '0 0 20px 0'
                    }} />
                    {textPreloader}
                </>
            )}
            <div className={styles.editor} id={editorId}></div>
            <div></div>
        </div >
    );
}

export default Post;