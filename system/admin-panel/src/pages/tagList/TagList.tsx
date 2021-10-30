import { getBlockInstance, TPagedParams, TTag } from '@cromwell/core';
import { CList, getGraphQLClient, TCList } from '@cromwell/core-frontend';
import { Checkbox, IconButton, Tooltip } from '@mui/material';
import { AddCircle as AddCircleIcon, Delete as DeleteIcon } from '@mui/icons-material';
import React, { useEffect, useRef, useState } from 'react';
import { connect, PropsType } from 'react-redux-ts';
import { useHistory } from 'react-router-dom';

import { LoadingStatus } from '../../components/loadBox/LoadingStatus';
import ConfirmationModal from '../../components/modal/Confirmation';
import Pagination from '../../components/pagination/Pagination';
import { listPreloader } from '../../components/skeleton/SkeletonPreloader';
import { toast } from '../../components/toast/toast';
import { tagPageInfo } from '../../constants/PageInfos';
import {
    countSelectedItems,
    getSelectedInput,
    resetSelected,
    toggleItemSelection,
    toggleSelectAll,
} from '../../redux/helpers';
import { TAppState } from '../../redux/store';
import commonStyles from '../../styles/common.module.scss';
import styles from './TagList.module.scss';
import TagListItem from './TagListItem';

export type ListItemProps = {
    handleDeleteBtnClick: (id: number) => void;
    toggleSelection: (data: TTag) => void;
}


const mapStateToProps = (state: TAppState) => {
    return {
        allSelected: state.allSelected,
    }
}

type TPropsType = PropsType<TAppState, unknown,
    ReturnType<typeof mapStateToProps>>;


const TagList = (props: TPropsType) => {
    const client = getGraphQLClient();
    const listId = "Admin_TagList";
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const history = useHistory();
    const totalElements = useRef<number | null>(null);
    const [deleteSelectedOpen, setDeleteSelectedOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        resetSelected();
        return () => {
            resetSelected();
        }
    }, []);

    const updateList = () => {
        const list = getBlockInstance<TCList>(listId)?.getContentInstance();
        list?.updateData();
    }

    const handleGetTags = async (params?: TPagedParams<TTag>) => {
        const data = await client?.getTags(params);

        if (data.pagedMeta?.totalElements) totalElements.current = data.pagedMeta?.totalElements;
        return data;
    }

    const handleDeleteBtnClick = (id: number) => {
        setItemToDelete(id);
    }

    const handleToggleItemSelection = (data: TTag) => {
        toggleItemSelection(data.id);
    }

    const handleToggleSelectAll = () => {
        toggleSelectAll()
    }

    const handleDeleteSelectedBtnClick = () => {
        if (countSelectedItems(totalElements.current) > 0)
            setDeleteSelectedOpen(true);
    }

    const handleDeleteSelected = async () => {
        setIsLoading(true);
        try {
            await client?.deleteManyTags(getSelectedInput());
            toast.success('Tags deleted');
        } catch (e) {
            console.error(e);
            toast.error('Failed to delete tags');
        }
        setDeleteSelectedOpen(false);
        setIsLoading(false);
        updateList();
        resetSelected();
    }


    const handleDelete = async () => {
        if (itemToDelete) {
            try {
                await client?.deleteTag(itemToDelete)
                toast.success('Tag deleted');
            } catch (e) {
                console.error(e);
                toast.error('Failed to delete tag');
            }
        }
        setItemToDelete(null);
        updateList();
    }

    const handleCreate = () => {
        history.push(`${tagPageInfo.baseRoute}/new`);
    }

    return (
        <div className={styles.TagList}>
            <div className={styles.listHeader}>
                <div className={styles.filter}>
                    <div className={commonStyles.center}>
                        <Tooltip title="Select all">
                            <Checkbox
                                style={{ marginRight: '10px' }}
                                checked={props.allSelected ?? false}
                                onChange={handleToggleSelectAll}
                            />
                        </Tooltip>
                    </div>
                </div>
                <div className={styles.pageActions} >
                    <Tooltip title="Delete selected">
                        <IconButton
                            onClick={handleDeleteSelectedBtnClick}
                            aria-label="Delete selected"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Create new tag">
                        <IconButton
                            onClick={handleCreate}
                            aria-label="add"
                        >
                            <AddCircleIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            <CList<TTag, ListItemProps>
                className={styles.listWrapper}
                id={listId}
                ListItem={TagListItem}
                useAutoLoading
                usePagination
                useQueryPagination
                listItemProps={{ handleDeleteBtnClick, toggleSelection: handleToggleItemSelection }}
                loader={handleGetTags}
                cssClasses={{
                    scrollBox: styles.list,
                    contentWrapper: styles.listContent,
                }}
                elements={{
                    pagination: Pagination,
                    preloader: listPreloader
                }}
            />
            <ConfirmationModal
                open={Boolean(itemToDelete)}
                onClose={() => setItemToDelete(null)}
                onConfirm={handleDelete}
                title="Delete tag?"
            />
            <ConfirmationModal
                open={deleteSelectedOpen}
                onClose={() => setDeleteSelectedOpen(false)}
                onConfirm={handleDeleteSelected}
                title={`Delete ${countSelectedItems(totalElements.current)} item(s)?`}
                disabled={isLoading}
            />
            <LoadingStatus isActive={isLoading} />
        </div>
    )
}

export default connect(mapStateToProps)(TagList);
