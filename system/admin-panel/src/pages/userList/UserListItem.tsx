import { TUser } from '@cromwell/core';
import { Checkbox, Grid, IconButton } from '@mui/material';
import {
    AccountCircleOutlined as AccountCircleIcon,
    DeleteForever as DeleteForeverIcon,
    Edit as EditIcon,
} from '@mui/icons-material';
import React from 'react';
import { connect, PropsType } from 'react-redux-ts';
import { Link } from 'react-router-dom';

import { userPageInfo } from '../../constants/PageInfos';
import { TAppState } from '../../redux/store';
import commonStyles from '../../styles/common.module.scss';
import { ListItemProps } from './UserList';
import styles from './UserListItem.module.scss';

type TListItemProps = {
    data?: TUser;
    listItemProps: ListItemProps;
}

const mapStateToProps = (state: TAppState, ownProps: TListItemProps) => {
    return {
        selectedItems: state.selectedItems,
        allSelected: state.allSelected,
    }
}

type TPropsType = PropsType<PropsType, TListItemProps,
    ReturnType<typeof mapStateToProps>>;


const UserListItem = (props: TPropsType) => {
    const { data } = props;

    let selected = false;
    if (props.allSelected && !props.selectedItems[data.id]) selected = true;
    if (!props.allSelected && props.selectedItems[data.id]) selected = true;

    return (
        <Grid container className={styles.listItem}>
            {props.data && (
                <>
                    <Grid item xs={6} className={styles.itemMain}>
                        <div className={commonStyles.center}>
                            <Checkbox
                                checked={selected}
                                onChange={() => props.listItemProps.toggleSelection(data)} />
                        </div>
                        {props?.data?.avatar ? (
                            <div
                                style={{ backgroundImage: `url(${props?.data?.avatar})` }}
                                className={styles.avatar}
                            ></div>
                        ) : (
                            <AccountCircleIcon className={styles.avatar} />
                        )}
                        <div className={styles.itemBlock}>
                            <p className={styles.name}>{data.fullName}</p>
                            <p className={styles.email}>{data.email}</p>
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <div className={styles.itemBlock}>
                            <p className={styles.role}>{data.role}</p>
                        </div>
                    </Grid>
                    <Grid item xs={3} className={styles.listItemActions}>
                        <Link to={`${userPageInfo.baseRoute}/${props.data?.id}`}>
                            <IconButton
                                aria-label="edit"
                            >
                                <EditIcon />
                            </IconButton>
                        </Link>
                        <IconButton
                            aria-label="delete"
                            onClick={() => props.listItemProps.handleDeleteBtnClick(props.data)}
                        >
                            <DeleteForeverIcon />
                        </IconButton>
                    </Grid>
                </>
            )}
        </Grid>
    )
}

export default connect(mapStateToProps)(UserListItem);
