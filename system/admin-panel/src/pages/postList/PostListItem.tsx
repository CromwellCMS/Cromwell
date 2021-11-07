import { TPost } from '@cromwell/core';
import { DeleteForever as DeleteForeverIcon, Edit as EditIcon } from '@mui/icons-material';
import { Checkbox, Grid, IconButton } from '@mui/material';
import React from 'react';
import { connect, PropsType } from 'react-redux-ts';
import { Link } from 'react-router-dom';

import { postPageInfo } from '../../constants/PageInfos';
import { toLocaleDateString } from '../../helpers/time';
import { TAppState } from '../../redux/store';
import commonStyles from '../../styles/common.module.scss';
import { ListItemProps } from './PostList';
import styles from './PostList.module.scss';

type TPostListItemProps = {
    data?: TPost;
    listItemProps: ListItemProps;
}

const mapStateToProps = (state: TAppState, ownProps: TPostListItemProps) => {
    return {
        selectedItems: state.selectedItems,
        allSelected: state.allSelected,
    }
}

type TPropsType = PropsType<PropsType, TPostListItemProps,
    ReturnType<typeof mapStateToProps>>;

const PostListItem = (props: TPropsType) => {
    // console.log('PostListItem::props', props)
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
                        <div
                            style={{ backgroundImage: `url(${props?.data?.mainImage})` }}
                            className={styles.itemImage}
                        ></div>
                        <div className={styles.itemMainInfo}>
                            <p className={styles.itemTitle}>{props.data?.title}</p>
                            {props.data?.author?.fullName && (
                                <p className={styles.itemAuthor}>by <span style={{ fontWeight: 500 }}>{props.data.author.fullName}</span></p>
                            )}
                        </div>
                    </Grid>
                    <Grid item xs={2} className={styles.itemSubInfo}>
                        <p className={styles.itemPublished}>{props.data?.published ? 'published' : 'draft'}</p>
                        {(props.data?.published && props.data?.publishDate) ? (
                            <p className={styles.itemCreate} >at: {toLocaleDateString(props.data?.publishDate)}</p>
                        ) : (
                                <p className={styles.itemCreate} >created at: {toLocaleDateString(props.data?.createDate)}</p>
                            )}
                    </Grid>
                    <Grid item xs={4} className={styles.listItemActions}>
                        <Link to={`${postPageInfo.baseRoute}/${props.data?.id}`}>
                            <IconButton
                                aria-label="edit"
                            >
                                <EditIcon />
                            </IconButton>
                        </Link>
                        <IconButton
                            aria-label="delete"
                            onClick={() => props.listItemProps.handleDeletePostBtnClick(props.data)}
                        >
                            <DeleteForeverIcon />
                        </IconButton>
                    </Grid>
                </>
            )
            }
        </Grid >
    )
}

export default connect(mapStateToProps)(PostListItem);