import { TPost } from '@cromwell/core';
import { IconButton, Grid } from '@material-ui/core';
import { DeleteForever as DeleteForeverIcon, Edit as EditIcon } from '@material-ui/icons';
import React from 'react';
import { Link } from 'react-router-dom';

import { productInfo } from '../../constants/PageInfos';
import styles from './PostList.module.scss';
import commonStyles from '../../styles/common.module.scss';

type TPostListItemProps = {
    data?: TPost;
}

export const PostListItem = (props: TPostListItemProps) => {
    // console.log('PostListItem::props', props)
    return (
        <Grid container className={styles.listItem}>
            {props.data && (
                <>
                    <Grid xs={3}>
                        <div
                            style={{ backgroundImage: `url(${props?.data?.mainImage})` }}
                            className={styles.itemImage}
                        ></div>
                    </Grid>
                    <Grid xs={3}>
                        <p>{props.data?.title}</p>
                    </Grid>
                    <Grid xs={3}>
                        <p>{props.data?.author?.fullName}</p>
                    </Grid>
                    <Grid xs={3}>
                        <Link to={`${productInfo.baseRoute}/${props.data?.id}`}>
                            <IconButton
                                aria-label="edit"
                            >
                                <EditIcon />
                            </IconButton>
                        </Link>
                        <IconButton
                            aria-label="delete"
                        >
                            <DeleteForeverIcon />
                        </IconButton>
                    </Grid>
                </>
            )}
        </Grid>
    )
}