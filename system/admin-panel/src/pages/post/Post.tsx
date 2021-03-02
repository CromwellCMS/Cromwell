import 'quill/dist/quill.snow.css';

import { getStoreItem, TPost, TPostInput } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { gql } from '@apollo/client';
import { Button, IconButton, MenuItem, Tooltip } from '@material-ui/core';
import { Edit as EditIcon, NavigateBefore as NavigateBeforeIcon, Settings as SettingsIcon } from '@material-ui/icons';
import Quill from 'quill';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Skeleton } from '@material-ui/lab';

import { toast } from '../../components/toast/toast';
import { postListInfo, postPageInfo } from '../../constants/PageInfos';
import { getQuillHTML, initQuillEditor } from '../../helpers/quill';
import styles from './Post.module.scss';
import PostSettings from './PostSettings';

const textPreloader = [];
for (let i = 0; i < 30; i++) {
    textPreloader.push(<Skeleton variant="text" height="10px" style={{ margin: '3px 0' }} key={i} />)
}

const Post = (props) => {
    const { id: postId } = useParams<{ id: string }>();
    const [postData, setPostData] = useState<Partial<TPost> | undefined>(undefined);
    const client = getGraphQLClient();
    const [allTags, setAllTags] = useState<string[] | null>(null);
    const [isLoading, setIsloading] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const mode = getStoreItem('environment')?.mode;
    const quillEditor = useRef<Quill | null>(null);
    const actionsRef = useRef<HTMLDivElement | null>(null);
    const hasChanges = useRef<boolean>(false);
    const history = useHistory();
    const forceUpdate = useForceUpdate();
    const editorId = 'quill-editor';

    const getPostData = async (): Promise<TPost | undefined> => {
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
                    tags
                    content
                    delta
                    isPublished 
                }`, 'AdminPanelPostFragment'
            );
            if (post) setPostData(post);
        } catch (e) { console.log(e) }
        setIsloading(false);
        return post;
    }

    const getPostTags = async () => {
        try {
            const data = await client?.getPostTags();
            if (data && Array.isArray(data)) {
                setAllTags(data.sort());
            }
        } catch (e) {
            console.error(e)
        }
    }

    const _initEditor = (postContent?: any) => {
        const quill = initQuillEditor('#quill-editor', postContent);

        quill.on('text-change', (delta, oldDelta, source) => {
            if (!hasChanges.current) {
                hasChanges.current = true;
                forceUpdate();
            }
        });

        quillEditor.current = quill;
    }

    const init = async () => {

        getPostTags();

        if (postId && postId !== 'new') {
            let postContent: any = null;
            let post;
            try {
                post = await getPostData();
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
                isPublished: false,
            });
            _initEditor();
        }
    }

    useEffect(() => {
        init();
    }, []);


    const getInput = (): TPostInput => ({
        slug: postData.slug,
        pageTitle: postData.pageTitle,
        pageDescription: postData.pageDescription,
        title: postData.title,
        mainImage: postData.mainImage,
        isPublished: postData.isPublished,
        isEnabled: postData.isEnabled,
        tags: postData.tags,
        authorId: postData?.author?.id,
        delta: JSON.stringify(quillEditor.current.getContents()),
    });

    const handleSave = async () => {
        // console.log(quillEditor.current.getContents());
        const outerHTML = getQuillHTML(quillEditor.current, `#${editorId}`);

        if (outerHTML) {
            const updatePost: TPostInput = getInput();
            updatePost.content = outerHTML;

            if (postId === 'new') {
                try {
                    updatePost.authorId = '1';

                    const newPost = await client?.createPost(updatePost);
                    toast.success('Created post!');
                    hasChanges.current = false;
                    history.push(`${postPageInfo.baseRoute}/${newPost.id}`)
                    await getPostData();
                } catch (e) {
                    toast.error('Falied to create post');
                    console.error(e)
                }
            } else if (postData?.id) {
                try {
                    await client?.updatePost(postData.id, updatePost);
                    hasChanges.current = false;
                    await getPostData();
                    toast.success('Saved!');
                } catch (e) {
                    toast.error('Falied to save');
                    console.error(e)
                }
            }
        }
    }

    const handlePublish = async () => {
        quillEditor.current.disable();
        const outerHTML = document.querySelector('#editor')?.outerHTML;

        if (outerHTML && postData?.id) {
            const updatePost: TPostInput = getInput();
            updatePost.content = outerHTML;
            updatePost.isPublished = true;

            try {
                await client?.updatePost(postData.id, updatePost);
                await getPostData();
                toast.success('Published');
                hasChanges.current = false;
            } catch (e) {
                toast.error('Falied to publish');
                console.error(e)
            }
        }
        quillEditor.current.enable();
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

    return (
        <div className={styles.Post}>
            <div className={styles.postHeader}>
                <div className={styles.headerLeft}>
                    <MenuItem className={styles.backIcon}
                        onClick={() => history.push(postListInfo.route)}
                    >
                        <NavigateBeforeIcon style={{ marginLeft: '-8px' }} />
                        <p>Back</p>
                    </MenuItem>
                    <p className={styles.title}>{postData?.title ?? ''}</p>
                    <Tooltip title="Edit title">
                        <IconButton onClick={handleOpenSettings}  >
                            <EditIcon style={{ fontSize: '22px' }} />
                        </IconButton>
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
                    {(!hasChanges.current && postData?.isPublished === false && postData?.id) ? (
                        <Button variant="contained" color="primary"
                            className={styles.saveBtn}
                            size="small"
                            onClick={handlePublish}>
                            Publish</Button>
                    ) : (
                            <Button variant="contained" color="primary"
                                className={styles.saveBtn}
                                size="small"
                                disabled={!hasChanges.current}
                                onClick={handleSave}>
                                Save</Button>
                        )}
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
        </div>
    );
}

export default Post;

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => ++value);
}
