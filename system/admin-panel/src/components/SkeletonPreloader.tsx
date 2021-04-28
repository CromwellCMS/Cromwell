import React from 'react';
import { Skeleton } from '@material-ui/lab';

const listSkeleton = [];
for (let i = 0; i < 35; i++) {
    listSkeleton.push(<Skeleton key={i} variant="text" height="20px" style={{ margin: '25px 20px' }} />)
}
export const listPreloader = (
    <div style={{
        overflow: 'hidden',
        position: 'absolute',
        bottom: '0vh',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99,
        backgroundColor: '#fff'
    }}>{listSkeleton}</div>
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