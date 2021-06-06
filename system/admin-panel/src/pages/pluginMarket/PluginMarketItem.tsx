import { TCCSModuleInfoDto } from '@cromwell/core';
import { Grid } from '@material-ui/core';
import React from 'react';

import styles from './PluginMarketItem.module.scss';

type TListItemProps = {
    data?: TCCSModuleInfoDto;
}

export default function PluginMarketItem(props: TListItemProps) {
    const data = props?.data;
    return (
        <Grid item xs={6} lg={4} className={styles.listItem}>
            <div className={styles.listItemContent}>
                {data?.image && (
                    <img src={data.image} className={styles.image} />
                )}
                <div className={styles.caption}>
                    <p className={styles.title}>{data?.title ?? ''}</p>
                </div>
            </div>
        </Grid>
    )
}
