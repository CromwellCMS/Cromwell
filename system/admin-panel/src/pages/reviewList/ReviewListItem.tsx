import { TProductReview } from '@cromwell/core';
import { Checkbox, Grid, IconButton, Tooltip } from '@material-ui/core';
import {
    DeleteForever as DeleteForeverIcon,
    Done as DoneIcon,
    HourglassEmpty as HourglassEmptyIcon,
    ThumbUp as ThumbUpIcon,
    Visibility as VisibilityIcon,
} from '@material-ui/icons';
import { Rating } from '@material-ui/lab';
import React from 'react';
import { connect, PropsType } from 'react-redux-ts';

import { useForceUpdate } from '../../helpers/forceUpdate';
import { TAppState } from '../../redux/store';
import commonStyles from '../../styles/common.module.scss';
import { ListItemProps } from './ReviewList';
import styles from './ReviewListItem.module.scss';

type TListItemProps = {
    data?: TProductReview;
    listItemProps: ListItemProps;
    embedded?: boolean;
}

const mapStateToProps = (state: TAppState) => {
    return {
        selectedItems: state.selectedItems,
        allSelected: state.allSelected,
    }
}

type TPropsType = PropsType<PropsType, TListItemProps,
    ReturnType<typeof mapStateToProps>>;


const ReviewListItem = (props: TPropsType) => {
    const { data } = props;
    const forceUpdate = useForceUpdate();

    let selected = false;
    if (props.allSelected && !props.selectedItems[data.id]) selected = true;
    if (!props.allSelected && props.selectedItems[data.id]) selected = true;

    const handleApproveReview = async () => {
        const success = await props.listItemProps.handleApproveReview(props.data);
        if (success) {
            props.data.approved = true;
            forceUpdate();
        }
    }

    return (
        <Grid container className={styles.listItem + (props.embedded ? ' ' + styles.embedded : '')}>
            {props.data && (
                <>
                    <Grid item xs={3} className={styles.itemMain}>
                        {!props.embedded && (
                            <div className={commonStyles.center}>
                                <Checkbox
                                    checked={selected}
                                    onChange={() => props.listItemProps.toggleSelection(data)} />
                            </div>
                        )}
                        <div className={styles.itemMainInfo}>
                            <p className={styles.itemTitle}>{props.data?.userName ?? ''}</p>
                        </div>
                    </Grid>
                    <Grid item xs={props.embedded ? 4 : 3} className={styles.itemSubInfo}>
                        <p className={styles.status}>{props.data?.approved ? <DoneIcon /> : <HourglassEmptyIcon />} {props.data?.approved ? 'Approved' : 'Pending'}</p>
                        <p className={styles.createDate}>{toLocaleDateString(props.data?.createDate)}</p>
                    </Grid>
                    <Grid item xs={props.embedded ? 5 : 4} className={styles.itemSubInfo}>
                        {props.data?.title && (
                            <p className={styles.title}>{props.data?.title ?? ''}</p>
                        )}
                        <Rating name="read-only" value={props.data?.rating ?? 0} precision={0.5} readOnly />
                    </Grid>
                    {!props.embedded && (
                        <Grid item xs={2} className={styles.listItemActions}>
                            {!props.data?.approved && (
                                <Tooltip title="Approve">
                                    <IconButton
                                        aria-label="view"
                                        onClick={handleApproveReview}
                                    >
                                        <ThumbUpIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                            <Tooltip title="Open">
                                <IconButton
                                    aria-label="view"
                                    onClick={() => props.listItemProps.handleOpenReview(props.data)}
                                >
                                    <VisibilityIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <IconButton
                                    aria-label="delete"
                                    onClick={() => props.listItemProps.handleDeleteBtnClick(props.data.id)}
                                >
                                    <DeleteForeverIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    )}
                </>
            )}
        </Grid>
    )

}

export default connect(mapStateToProps)(ReviewListItem);

const toLocaleDateString = (date: Date | string | undefined) => {
    if (!date) return '';
    if (typeof date === 'string') date = new Date(date);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}
