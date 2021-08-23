import React from 'react';
import { Skeleton } from '@material-ui/lab';
import styles from './SkeletonPreloader.module.scss';

const listSkeleton = [];
for (let i = 0; i < 35; i++) {
    listSkeleton.push(<Skeleton key={i} variant="text" height="20px" style={{ margin: '25px 20px' }} />)
}
export const listPreloader = (
    <div className={styles.listPreloader} >{listSkeleton}</div>
);

export const SkeletonPreloader = (props: {
    className?: string;
    style?: React.CSSProperties;
}) => {
    return (
        <div
            className={props.className}
            style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                ...(props.style ?? {}),
            }}>{listSkeleton}</div>
    )
}