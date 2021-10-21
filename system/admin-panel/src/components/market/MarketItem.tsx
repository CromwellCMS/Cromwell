import { TCCSModuleInfo, TPackageCromwellConfig } from '@cromwell/core';
import { Badge, Button, CardActionArea, Grid, LinearProgress, Typography } from '@mui/material';
import clsx from 'clsx';
import React, { useState } from 'react';

import styles from './MarketItem.module.scss';

export type ListItemProps = {
    installedModules: TPackageCromwellConfig[];
    open: (info: TCCSModuleInfo) => any;
    install: (info: TCCSModuleInfo) => Promise<boolean>;
}

type PropsType = {
    data?: TCCSModuleInfo;
    listItemProps: ListItemProps;
}

export default function MarketItem(props: PropsType) {
    const data = props?.data;
    const [installing, setInstalling] = useState(false);
    const [installed, setInstalled] = useState(!!(props.data?.name
        && props?.listItemProps?.installedModules?.find(inst => inst.name === props.data?.name)));

    const installModule = async () => {
        if (!props.listItemProps?.install || !data) return;

        setInstalling(true);
        const success = await props.listItemProps.install(data);
        if (success) setInstalled(true);
        setInstalling(false);
    }

    return (
        <Grid item xs={6} lg={4} className={styles.listItem}>
            <div className={clsx(styles.listItemContent, installing && styles.installing)}>
                {data?.image && (
                    <CardActionArea
                        onClick={() => props.listItemProps?.open(props.data)}
                        className={styles.cardActionArea}
                    >
                        <img src={data.image} className={styles.image} />
                    </CardActionArea>
                )}
                <div className={styles.caption}>
                    <Badge color="secondary" badgeContent={installed ? 'installed' : null}>
                        <Typography gutterBottom variant="h5" component="h3" className={styles.title}>
                            {data?.title ?? ''}
                        </Typography>
                    </Badge>
                    <p className={styles.version}>{data?.version ?? ''}</p>
                    <p className={styles.excerpt}>{data?.excerpt ?? ''}</p>
                </div>
                <div className={styles.actions}>
                    <Button
                        size="small" color="primary" variant="contained"
                        onClick={() => props.listItemProps?.open(props.data)}
                    >Open</Button>
                    <Button
                        disabled={installed || installing}
                        size="small" color="primary" variant="contained"
                        onClick={installModule}
                    >Install</Button>
                </div>
                {installing && (
                    <LinearProgress className={styles.updateProgress} />
                )}
            </div>
        </Grid>
    )
}
