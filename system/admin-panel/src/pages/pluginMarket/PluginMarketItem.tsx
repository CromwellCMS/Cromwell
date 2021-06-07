import { TCCSModuleInfoDto } from '@cromwell/core';
import { Badge, Button, Grid, Typography, CardActionArea, LinearProgress } from '@material-ui/core';
import clsx from 'clsx';
import React, { useState } from 'react';

import { ListItemProps } from './PluginMarket';
import styles from './PluginMarketItem.module.scss';

type TListItemProps = {
    data?: TCCSModuleInfoDto;
    listItemProps: ListItemProps;
}

export default function PluginMarketItem(props: TListItemProps) {
    const data = props?.data;
    const [installing, setInstalling] = useState(false);
    const [installed, setInstalled] = useState(!!(props.data?.name && props?.listItemProps?.installedPlugins?.find(plugin => plugin.name === props.data?.name)));

    const installPlugin = async () => {
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
                        className={styles.cardActionArea}
                    >
                        <img src={data.image} className={styles.image} />
                    </CardActionArea>
                )}
                <div className={styles.caption}>
                    <Badge color="secondary" badgeContent={installed ? 'Installed' : null}>
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
                        onClick={installPlugin}
                    >Install</Button>
                </div>
                {installing && (
                    <LinearProgress className={styles.updateProgress} />
                )}
            </div>
        </Grid>
    )
}
