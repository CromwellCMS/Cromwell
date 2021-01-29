import { gql } from '@apollo/client';
import { TPagedParams, TPost } from '@cromwell/core';
import { CList, getGraphQLClient } from '@cromwell/core-frontend';
import { IconButton } from '@material-ui/core';
import { AddCircle as AddCircleIcon } from '@material-ui/icons';
import { Pagination } from '@material-ui/lab';
import React from 'react';

import LoadBox from '../../components/loadBox/LoadBox';
import styles from './PostList.module.scss';
import { PostListItem } from './PostListItem';


const PostList = () => {
    const client = getGraphQLClient();

    const handleGetPosts = async (params: TPagedParams<TPost>) => {
        return client?.getPosts(params, gql`
        fragment PostListFragment on Post {
            id
            slug
            pageTitle
            createDate
            updateDate
            title
            author {
                id
                fullName
                avatar
            }
            mainImage
            isPublished
        }
    `, 'PostListFragment');
    }

    return (
        <div className={styles.PostList}>
            <div className={styles.listHeader}>
                <div style={{ width: '10%' }}>
                    <p>id</p>
                </div>
                <div style={{ width: '100%' }}>
                    <p>title</p>
                </div>
                <div style={{ width: '10%' }}>
                    <IconButton
                        aria-label="add"
                    >
                        <AddCircleIcon />
                    </IconButton>
                </div>
            </div>
            <CList<TPost>
                className={styles.listWrapper}
                id="Admin_PostList"
                ListItem={PostListItem}
                useAutoLoading
                usePagination
                useQueryPagination
                loader={handleGetPosts}
                cssClasses={{ scrollBox: styles.list }}
                elements={{
                    pagination: (props) => {
                        return (
                            <div className={styles.paginationContainer}>
                                <Pagination count={props.count} page={props.page}
                                    onChange={(event: React.ChangeEvent<unknown>, value: number) => {
                                        props.onChange(value)
                                    }}
                                    className={styles.pagination}
                                    showFirstButton showLastButton
                                />
                            </div>
                        )
                    },
                    preloader: <LoadBox />
                }}
            />
        </div>
    )
}

export default PostList;
