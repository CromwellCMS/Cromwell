import { gql } from '@apollo/client';
import { getBlockInstance, TPagedParams, TPost, TPostFilter, TUser } from '@cromwell/core';
import { CList, getGraphQLClient, TCList } from '@cromwell/core-frontend';
import { IconButton, TextField, Tooltip } from '@material-ui/core';
import { AddCircle as AddCircleIcon } from '@material-ui/icons';
import { Autocomplete, Pagination } from '@material-ui/lab';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { debounce } from 'throttle-debounce';

import LoadBox from '../../components/loadBox/LoadBox';
import ConfirmationModal from '../../components/modal/Confirmation';
import { toast } from '../../components/toast/toast';
import { postPageInfo } from '../../constants/PageInfos';
import styles from './PostList.module.scss';
import { PostListItem } from './PostListItem';

export type ListItemProps = {
    handleDeletePostBtnClick: (postId: string) => void;
}

const PostList = () => {
    const client = getGraphQLClient();
    const filterInput = useRef<TPostFilter>({});
    const titleSearchId = "post-filter-search";
    const listId = "Admin_PostList";
    const [users, setUsers] = useState<TUser[] | null>(null);
    const [tags, setTags] = useState<string[] | null>(null);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);
    const history = useHistory();

    const getUsers = async () => {
        const data = await client?.getUsers({
            pageSize: 9999
        });
        if (data?.elements) setUsers(data.elements);
    }
    const getPostTags = async () => {
        const data = await client?.getPostTags();
        if (data && Array.isArray(data)) {
            setTags(data.sort());
        }
    }

    useEffect(() => {
        getUsers();
        getPostTags();
    }, [])


    const handleGetPosts = async (params: TPagedParams<TPost>) => {
        return client?.getFilteredPosts({
            customFragment: gql`
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
            `,
            customFragmentName: 'PostListFragment',
            pagedParams: params,
            filterParams: filterInput.current,
        });
    }

    const handleFilterInput = debounce(1000, () => {
        filterInput.current.titleSearch = (document.getElementById(titleSearchId) as HTMLInputElement)?.value ?? undefined;

        const list: TCList | undefined = getBlockInstance(listId)?.getContentInstance() as any;
        list.clearState();
        list.init();
    });

    const handleAuthorSearch = (event, newValue: TUser | null) => {
        filterInput.current.authorId = newValue?.id;
        handleFilterInput();
    }

    const handleDeletePostBtnClick = (postId: string) => {
        setPostToDelete(postId);
    }

    const handleDeletePost = async () => {
        if (postToDelete) {
            try {
                await client?.deletePost(postToDelete)
                toast.success('Post deleted');
            } catch (e) {
                console.error(e);
                toast.success('Failed to delete post');
            }
        }
        setPostToDelete(null);

        const list: TCList | undefined = getBlockInstance(listId)?.getContentInstance() as any;
        list.clearState();
        list.init();
    }

    const handleCreatePost = () => {
        history.push(`${postPageInfo.baseRoute}/new`);
    }

    const handleChangeTags = (event, newValue: string[]) => {
        filterInput.current.tags = newValue;
        handleFilterInput();
    }


    return (
        <div className={styles.PostList}>
            <div className={styles.listHeader}>
                <div className={styles.filter}>
                    <TextField
                        className={styles.filterItem}
                        id={titleSearchId}
                        placeholder="Search by title"
                        onChange={handleFilterInput}
                    />
                    <Autocomplete
                        size="small"
                        className={`${styles.filterItem} ${styles.authorSearch}`}
                        disabled={!users || users.length === 0}
                        id="combo-box-demo"
                        options={users ?? []}
                        getOptionLabel={(option) => option.fullName}
                        style={{ width: 200 }}
                        onChange={handleAuthorSearch}
                        renderInput={(params) =>
                            <TextField {...params}
                                placeholder="Author"
                                // variant="outlined"
                                size="medium"
                            // style={{ padding: '0' }}
                            />}
                    />
                    <Autocomplete
                        multiple
                        freeSolo
                        className={styles.settingItem}
                        options={tags ?? []}
                        defaultValue={tags ?? []}
                        getOptionLabel={(option) => option}
                        style={{ width: 200 }}
                        onChange={handleChangeTags}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                                placeholder="Tags"
                            />
                        )}
                    />
                </div>
                <div className={styles.pageActions} >
                    <Tooltip title="Create new post">
                        <IconButton
                            onClick={handleCreatePost}
                            aria-label="add"
                        >
                            <AddCircleIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            <CList<TPost, ListItemProps>
                className={styles.listWrapper}
                id={listId}
                ListItem={PostListItem}
                useAutoLoading
                usePagination
                useQueryPagination
                listItemProps={{ handleDeletePostBtnClick }}
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
            <ConfirmationModal
                open={Boolean(postToDelete)}
                onClose={() => setPostToDelete(null)}
                onConfirm={handleDeletePost}
                title="Delete post?"
            />
        </div>
    )
}

export default PostList;
