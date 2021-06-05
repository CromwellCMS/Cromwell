import { TUpdateInfo } from '@cromwell/core';
import { Button, Collapse, Grid } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon, WarningRounded as WarningRoundedIcon } from '@material-ui/icons';
import UpdateIcon from '@material-ui/icons/Update';
import clsx from 'clsx';
import React, { useState } from 'react';

import styles from './NotificationCenter.module.scss';

export default function UpdateInfoCard(props: {
    updateInfo: TUpdateInfo;
    currentVersion?: string;
    onStartUpdate: () => void;
}) {
    const { updateInfo, currentVersion } = props;
    const [changelogCollapsed, setChangelogCollapsed] = useState(true);

    const toggleChangelog = () => {
        setChangelogCollapsed(!changelogCollapsed)
    }

    return (
        <Grid item container xs={12} className={styles.update}>
            <h3 className={styles.updateTitle}>
                <UpdateIcon style={{ marginRight: '7px' }} />
                                Update available</h3>
            <p>{currentVersion ?? ''} {'>'} {updateInfo.version}</p>
            <div className={styles.changelogTitle}>
                <p onClick={toggleChangelog}>See changelog</p>
                <ExpandMoreIcon
                    className={clsx(styles.expand, !changelogCollapsed && styles.expandOpen)}
                    onClick={toggleChangelog}
                />
            </div>
            {updateInfo.onlyManualUpdate && (
                <div className={styles.warning}>
                    <WarningRoundedIcon />
                    <p style={{ margin: '0 0 0 5px' }}>Cannot launch automatic update. Please update using
                    <span className={styles.command}>npm install @cromwell/cms@{updateInfo.packageVersion} --save-exact</span>
                    command and restart CMS</p>
                </div>
            )}
            <Collapse in={!changelogCollapsed} timeout="auto" unmountOnExit>
                <div className={styles.changelogList}
                    dangerouslySetInnerHTML={{ __html: updateInfo.changelog }}></div>
            </Collapse>
            <Button
                disabled={updateInfo.onlyManualUpdate}
                color="primary"
                variant="contained"
                onClick={props.onStartUpdate}
            >Update</Button>
        </Grid>
    )
}
