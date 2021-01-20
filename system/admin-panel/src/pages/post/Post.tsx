import React, { useEffect, useState } from 'react';
import styles from './Post.module.scss';
import { useParams } from 'react-router-dom';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

import { TPost, getStoreItem } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';

const Post = () => {
    const { id: postId } = useParams<{ id: string }>();
    const [postData, setPostData] = useState<TPost | undefined>(undefined);
    const client = getGraphQLClient();
    const [isLoading, setIsloading] = useState(false);
    const mode = getStoreItem('environment')?.mode;

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

    const initEditor = (postContent?: string | null) => {
        const quill = new Quill('#editor', {
            theme: 'snow',
            placeholder: 'Compose an epic...',
            modules: {
                // toolbar: '#toolbar'
            },
        });

        // if (postContent) {
        //     quill.setContents([
        //         { insert: postContent },
        //         { insert: '\n' }
        //     ]);
        // }
    }

    const init = async () => {
        const post = await getPostData();
        let postContent: any = null;
        if (post?.content) {
            try {
                // postContent = JSON.parse(post?.content);
            } catch (e) { console.error(e) }
        }
        initEditor(post?.content);
    }

    useEffect(() => {
        init();
    }, []);


    const handleSave = () => {

    }

    return (
        <div className={styles.Post}>
            <div className={styles.editor} id="editor"></div>
        </div>
    );
}

export default Post;
