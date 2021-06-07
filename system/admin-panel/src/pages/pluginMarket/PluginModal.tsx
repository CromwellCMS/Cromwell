import { TCCSModuleInfoDto, TPackageCromwellConfig } from '@cromwell/core';
import { Badge, Button, Typography } from '@material-ui/core';
import React, { useState } from 'react';

import styles from './PluginModal.module.scss';

export default function PluginModal(props: {
    data: TCCSModuleInfoDto
    installedPlugins: TPackageCromwellConfig[];
    install: (info: TCCSModuleInfoDto) => Promise<boolean>;
}) {
    const { data, installedPlugins } = props;
    const [installing, setInstalling] = useState(false);
    const [installed, setInstalled] = useState(!!(data?.name && installedPlugins?.find(plugin => plugin.name === data?.name)));

    const installPlugin = async () => {
        setInstalling(true);
        const success = await props.install(data);
        if (success) setInstalled(true);
        setInstalling(false);
    }

    return (
        <div className={styles.PluginModal}>
            <div className={styles.header}>
                <div>
                    <Badge color="secondary" badgeContent={installed ? 'Installed' : null}>
                        <Typography gutterBottom variant="h5" component="h3" className={styles.title}>
                            {data?.title ?? ''}
                        </Typography>
                    </Badge>
                    <p className={styles.version}>{data?.version ?? ''}</p>
                </div>
                <div>
                    <Button
                        disabled={installed || installing}
                        size="small" color="primary" variant="contained"
                        onClick={installPlugin}
                    >Install</Button>
                </div>
            </div>
            <div className={styles.header}>
                {data?.description && (
                    <div className={styles.description}
                        dangerouslySetInnerHTML={{ __html: data?.description }}></div>
                )}
            </div>
        </div>
    )
}
