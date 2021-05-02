import 'quill/dist/quill.snow.css';

import { gql } from '@apollo/client';
import { getStoreItem, onStoreChange, serviceLocator, TPost, TPostInput, TTag, TUser } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { Button, IconButton, Tooltip } from '@material-ui/core';
import { ArrowBack as ArrowBackIcon, OpenInNew as OpenInNewIcon, Settings as SettingsIcon } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import Quill from 'quill';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import { toast } from '../../components/toast/toast';
import { postListInfo, postPageInfo } from '../../constants/PageInfos';
import { useForceUpdate } from '../../helpers/forceUpdate';
import { getQuillHTML, initQuillEditor } from '../../helpers/quill';
import { store } from '../../redux/store';
import styles from './Post.module.scss';
import PostSettings from './PostSettings';

const textPreloader = [];
for (let i = 0; i < 30; i++) {
    textPreloader.push(<Skeleton variant="text" height="10px" style={{ margin: '3px 0' }} key={i} />)
}

const Post = (props) => {
    const { id: postId } = useParams<{ id: string }>();
    const [postData, setPostData] = useState<Partial<TPost> | undefined>(undefined);
    const userInfo: TUser | undefined = getStoreItem('userInfo');
    const client = getGraphQLClient();
    const [allTags, setAllTags] = useState<TTag[] | null>(null);
    const [isLoading, setIsloading] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const quillEditor = useRef<Quill | null>(null);
    const actionsRef = useRef<HTMLDivElement | null>(null);
    const hasChanges = useRef<boolean>(false);
    const history = useHistory();
    const forceUpdate = useForceUpdate();
    const editorId = 'quill-editor';

    const unregisterBlock = useRef<(() => void) | null>(null);

    const getPostData = async (postId: string): Promise<TPost | undefined> => {
        setIsloading(true);
        let post;
        try {
            post = await client?.getPostById(postId, gql`
                fragment AdminPanelPostFragment on Post {
                    id
                    slug
                    pageTitle
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
                    tags {
                        id
                        slug
                        name
                        color
                    }
                    content
                    delta
                    published 
                }`, 'AdminPanelPostFragment'
            );
            if (post) setPostData(post);
        } catch (e) { console.log(e) }
        setIsloading(false);
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

    const _initEditor = (postContent?: any) => {
        const quill = initQuillEditor('#quill-editor', postContent);

        quill.on('text-change', () => {
            if (!hasChanges.current) {
                hasChanges.current = true;
                forceUpdate();
            }
        });

        quillEditor.current = quill;
    }

    const init = async () => {

        unregisterBlock.current = props.history?.block(() => {
            if (hasChanges.current) return 'Your unsaved changes will be lost. Do you want to discard and leave this page?';
        });

        getPostTags();

        if (postId && postId !== 'new') {
            let postContent: any = null;
            let post;
            try {
                post = await getPostData(postId);
                if (post?.delta) {
                    postContent = JSON.parse(post?.delta);
                }
            } catch (e) {
                console.error(e);
            }

            if (post) {
                _initEditor(postContent);
            }
            else setNotFound(true);
        }

        if (postId === 'new') {
            setPostData({
                title: 'Untitled',
                published: false,
            });
            _initEditor();
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


    const getInput = (): TPostInput => ({
        slug: postData.slug,
        pageTitle: postData.pageTitle,
        pageDescription: postData.pageDescription,
        title: postData.title,
        mainImage: postData.mainImage,
        publishDate: postData.publishDate,
        published: postData.published,
        isEnabled: postData.isEnabled,
        tagIds: postData.tags?.map(tag => tag.id),
        authorId: postData?.author?.id ?? userInfo?.id,
        delta: JSON.stringify(quillEditor.current.getContents()),
    });

    const handleSave = async (input: TPostInput) => {
        // console.log(quillEditor.current.getContents());
        const outerHTML = getQuillHTML(quillEditor.current, `#${editorId}`);

        if (outerHTML) {
            input.content = outerHTML;

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
                    console.error(e)
                }
            }
        }
    }

    const handlePublish = async () => {
        const input = getInput();
        input.published = true;
        if (!input.publishDate) input.publishDate = new Date(Date.now());
        handleSave(input);
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

    const themePostPage = store.getState()?.activeTheme?.defaultPages?.post;
    let pageFullUrl;
    if (themePostPage && postData) {
        pageFullUrl = serviceLocator.getFrontendUrl() + '/' + themePostPage.replace('[slug]', postData.slug ?? postData.id ?? '');
    }

    return (
        <div className={styles.Post}>
            <div className={styles.postHeader}>
                <div className={styles.headerLeft}>
                    <Link to={postListInfo.route}>
                        <IconButton
                        >
                            <ArrowBackIcon />
                        </IconButton>
                    </Link>
                    <Tooltip title="Edit title in settings">
                        <p className={styles.title} onClick={handleOpenSettings}>{postData?.title ?? ''}</p>
                    </Tooltip>
                </div>
                <div
                    ref={actionsRef}
                >
                    <Tooltip title="Settings">
                        <IconButton onClick={handleOpenSettings}
                            style={{ marginRight: '10px' }}
                            id="settings-button"
                        >
                            <SettingsIcon />
                        </IconButton>
                    </Tooltip>
                    {isSettingsOpen && (
                        <PostSettings
                            allTags={allTags}
                            postData={postData}
                            isSettingsOpen={isSettingsOpen}
                            onClose={handleCloseSettings}
                            anchorEl={actionsRef.current}
                        />
                    )}
                    {pageFullUrl && (
                        <Tooltip title="Open post page in new tab">
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
                            onClick={handlePublish}>
                            Publish</Button>
                    )}
                    <Button variant="contained" color="primary"
                        className={styles.saveBtn}
                        size="small"
                        disabled={!hasChanges.current}
                        onClick={() => handleSave(getInput())}>
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