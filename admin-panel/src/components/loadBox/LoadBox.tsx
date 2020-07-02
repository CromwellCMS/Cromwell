import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import styles from './LoadBox.module.scss';

interface LoadBoxProps {
    size?: number
}

function LoadBox(props: LoadBoxProps) {
    return (
        <div className={styles.LoadBox} >
            <CircularProgress size={(props.size ? props.size : 150)} />
        </div>
    )
}

export default LoadBox