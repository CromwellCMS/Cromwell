import 'quill/dist/quill.snow.css';

import { getStoreItem, TPost, TPostInput } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { Button, IconButton, MenuItem, Tooltip, Popover } from '@material-ui/core';
import {
    NavigateBefore as NavigateBeforeIcon,
    Settings as SettingsIcon,
    Edit as EditIcon
} from '@material-ui/icons';
import Quill from 'quill';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams, RouteComponentProps } from 'react-router-dom';

import { getFileManager } from '../../components/fileManager/helpers';
import { toast } from '../../components/toast/toast';
import { postListInfo, postPageInfo } from '../../constants/PageInfos';
import styles from './Post.module.scss';
import PostSettings from './PostSettings';

const Post = (props: RouteComponentProps<{ id?: string }>) => {
    const { id: postId } = useParams<{ id: string }>();
    const [postData, setPostData] = useState<Partial<TPost> | undefined>(undefined);
    const client = getGraphQLClient();
    const [isLoading, setIsloading] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const mode = getStoreItem('environment')?.mode;
    const quillEditor = useRef<Quill | null>(null);
    const actionsRef = useRef<HTMLDivElement | null>(null);
    const hasChanges = useRef<boolean>(false);
    const history = useHistory();
    const forceUpdate = useForceUpdate();

    const getPostData = async (): Promise<TPost | undefined> => {
        setIsloading(true);
        let post;
        try {
            post = await client?.getPostById(postId);
            if (post) setPostData(post);
        } catch (e) { console.log(e) }
        setIsloading(false);
        return post;
    }

    const initEditor = (postContent?: any) => {
        const quill = new Quill('#editor', {
            theme: 'snow',
            placeholder: "Let's write an awesome story!",
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'font': [] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'align': [] }],
                    ['link', 'blockquote', 'code-block'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'script': 'sub' }, { 'script': 'super' }],
                    [{ 'indent': '-1' }, { 'indent': '+1' }],
                    [{ 'color': [] }, { 'background': [] }],
                    ['clean'],
                    ['image']
                ],
                history: {
                    maxStack: 500,
                    userOnly: true
                },
            },
        });


        const toolbar = quill.getModule('toolbar');
        toolbar.addHandler('image', async (prop) => {
            const photoPath = await getFileManager()?.getPhoto();
            if (photoPath) {
                const selection = quill.getSelection();
                quill.insertEmbed(selection.index, 'image', photoPath);
            }
        });

        if (postContent) {
            quill.setContents(postContent);
        }

        quill.on('text-change', (delta, oldDelta, source) => {
            if (!hasChanges.current) {
                hasChanges.current = true;
                forceUpdate();
            }
        });

        quillEditor.current = quill;
    }

    const init = async () => {
        let postContent: any = null;

        if (postId && postId !== 'new') {
            const post = await getPostData();
            if (post?.delta) {
                try {
                    postContent = JSON.parse(post?.delta);
                } catch (e) { console.error(e) }
            }
        }

        if (postId === 'new') {
            setPostData({
                title: 'Untitled',
                isPublished: false,
            });
        }
        initEditor(postContent);
    }

    useEffect(() => {
        init();
    }, []);


    const getInput = (): TPostInput => ({
        slug: postData.slug,
        pageTitle: postData.pageTitle,
        title: postData.title,
        mainImage: postData.mainImage,
        isPublished: postData.isPublished,
        isEnabled: postData.isEnabled,
        authorId: postData?.author?.id,
        delta: JSON.stringify(quillEditor.current.getContents()),
    });

    const handleSave = async () => {
        // console.log(quillEditor.current.getContents());
        quillEditor.current.disable();
        const outerHTML = document.querySelector('#editor')?.outerHTML;

        if (outerHTML) {
            const updatePost: TPostInput = getInput();
            updatePost.content = outerHTML;

            if (postId === 'new') {
                try {
                    updatePost.authorId = '1';

                    const newPost = await client?.createPost(updatePost);
                    toast.success('Created post!');
                    hasChanges.current = false;
                    history.push(`${postPageInfo.baseRoute}/${newPost.slug}`)
                    await getPostData();

                    // await getPostData();
                } catch (e) {
                    toast.error('Falied to create post');
                    console.error(e)
                }
                console.log('postId', postId, props?.match?.params?.id)

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

            quillEditor.current.enable();
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
                        <IconButton onClick={handleOpenSettings} style={{ marginRight: '10px' }}>
                            <SettingsIcon />
                        </IconButton>
                    </Tooltip>
                    {isSettingsOpen && (
                        <PostSettings
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
            <div className={styles.editor} id="editor"></div>
            <div></div>
        </div>
    );
}

export default Post;

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => ++value);
}
