import { getBlockInstance, TPagedParams, TUser, TUserFilter, TUserRole } from '@cromwell/core';
import { CList, getGraphQLClient, TCList } from '@cromwell/core-frontend';
import { Checkbox, IconButton, TextField, Tooltip } from '@material-ui/core';
import { AddCircle as AddCircleIcon, Delete as DeleteIcon } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useRef, useState } from 'react';
import { connect, PropsType } from 'react-redux-ts';
import { useHistory } from 'react-router-dom';
import { debounce } from 'throttle-debounce';

import { LoadingStatus } from '../../components/loadBox/LoadingStatus';
import ConfirmationModal from '../../components/modal/Confirmation';
import Pagination from '../../components/pagination/Pagination';
import { listPreloader } from '../../components/SkeletonPreloader';
import { toast } from '../../components/toast/toast';
import { userPageInfo } from '../../constants/PageInfos';
import { userRoles } from '../../constants/roles';
import {
    countSelectedItems,
    getSelectedInput,
    resetSelected,
    toggleItemSelection,
    toggleSelectAll,
} from '../../redux/helpers';
import { TAppState } from '../../redux/store';
import commonStyles from '../../styles/common.module.scss';
import styles from './UserList.module.scss';
import UserListItem from './UserListItem';

export type ListItemProps = {
    handleDeleteBtnClick: (user: TUser) => void;
    toggleSelection: (data: TUser) => void;
}

const mapStateToProps = (state: TAppState) => {
    return {
        allSelected: state.allSelected,
    }
}

type TPropsType = PropsType<TAppState, {},
    ReturnType<typeof mapStateToProps>>;


const UserList = (props: TPropsType) => {
    const client = getGraphQLClient();
    const filterInput = useRef<TUserFilter>({});
    const listId = "Admin_UserList";
    const history = useHistory();
    const [itemToDelete, setItemToDelete] = useState<TUser | null>(null);
    const [deleteSelectedOpen, setDeleteSelectedOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const totalElements = useRef<number | null>(null);

    useEffect(() => {
        resetSelected();
        return () => {
            resetSelected();
        }
    }, []);

    const resetList = () => {
        const list: TCList | undefined = getBlockInstance(listId)?.getContentInstance() as any;
        list.clearState();
        list.init();
    }

    const handleGetUsers = async (params?: TPagedParams<TUser>) => {
        const data = await client?.getFilteredUsers({
            pagedParams: params,
            filterParams: filterInput.current,
        });

        if (data.pagedMeta?.totalElements) totalElements.current = data.pagedMeta?.totalElements;
        return data;
    }

    const handleDeleteBtnClick = (user: TUser) => {
        setItemToDelete(user);
    }

    const handleToggleItemSelection = (data: TUser) => {
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
            await client?.deleteManyFilteredUsers(getSelectedInput(), filterInput.current);
            toast.success('Users deleted');
        } catch (e) {
            console.error(e);
            toast.error('Failed to delete users');
        }
        setDeleteSelectedOpen(false);
        setIsLoading(false);
        resetList();
        resetSelected();
    }


    const handleDelete = async () => {
        if (itemToDelete) {
            try {
                await client?.deleteUser(itemToDelete.id)
                toast.success('User deleted');
            } catch (e) {
                console.error(e);
                toast.error('Failed to delete user');
            }
        }
        setItemToDelete(null);
        resetList();
    }

    const handleFilterInput = debounce(1000, () => {
        resetList();
    });

    const handleCreateUser = () => {
        history.push(`${userPageInfo.baseRoute}/new`);
    }


    return (
        <div className={styles.UserList}>
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
                    <TextField
                        className={styles.filterItem}
                        placeholder="Name"
                        onChange={(event) => {
                            filterInput.current.fullName = event.target.value;
                            handleFilterInput();
                        }}
                    />
                    <TextField
                        className={styles.filterItem}
                        placeholder="Email"
                        onChange={(event) => {
                            filterInput.current.email = event.target.value;
                            handleFilterInput();
                        }}
                    />
                    <Autocomplete
                        size="small"
                        className={styles.filterItem}
                        options={userRoles}
                        getOptionLabel={(option) => option}
                        style={{ width: 150 }}
                        onChange={(event, newValue: TUserRole | null) => {
                            filterInput.current.role = newValue;
                            resetList();
                        }}
                        renderInput={(params) =>
                            <TextField {...params}
                                placeholder="Role"
                                size="medium"
                            />}
                    />
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
                    <Tooltip title="Create new user">
                        <IconButton
                            onClick={handleCreateUser}
                            aria-label="create user"
                        >
                            <AddCircleIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            <CList<TUser, ListItemProps>
                className={styles.listWrapper}
                id={listId}
                ListItem={UserListItem}
                useAutoLoading
                usePagination
                listItemProps={{ handleDeleteBtnClick, toggleSelection: handleToggleItemSelection }}
                useQueryPagination
                loader={handleGetUsers}
                cssClasses={{ scrollBox: styles.list }}
                elements={{
                    pagination: Pagination,
                    preloader: listPreloader
                }}
            />
            <ConfirmationModal
                open={Boolean(itemToDelete)}
                onClose={() => setItemToDelete(null)}
                onConfirm={handleDelete}
                title={`Delete user ${itemToDelete?.fullName ?? ''}?`}
                disabled={isLoading}
            />
            <ConfirmationModal
                open={deleteSelectedOpen}
                onClose={() => setDeleteSelectedOpen(false)}
                onConfirm={handleDeleteSelected}
                title={`Delete ${countSelectedItems(totalElements.current)} user(s)?`}
                disabled={isLoading}
            />
            <LoadingStatus isActive={isLoading} />
        </div>
    )
}

export default connect(mapStateToProps)(UserList);
