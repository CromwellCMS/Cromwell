import { getRestAPIClient } from '@cromwell/core-frontend';
import { Button, Collapse, Grid, IconButton, Popover, Tooltip, LinearProgress } from '@material-ui/core';
import {
    ExpandMore as ExpandMoreIcon,
    NotificationImportant as NotificationImportantIcon,
    NotificationsNone as NotificationsNoneIcon,
} from '@material-ui/icons';
import UpdateIcon from '@material-ui/icons/Update';
import { Alert, AlertProps } from '@material-ui/lab';
import clsx from 'clsx';
import React, { useRef, useState } from 'react';
import { connect, PropsType } from 'react-redux-ts';

import { store, TAppState } from '../../redux/store';
import { updateStatus } from '../../redux/helpers';
import styles from './NotificationCenter.module.scss';


const mapStateToProps = (state: TAppState) => {
    return {
        status: state.status
    }
}
type TPropsType = PropsType<PropsType, { color?: string },
    ReturnType<typeof mapStateToProps>>;


function NotificationCenter(props: TPropsType) {
    const [open, setopen] = useState(false);
    const [changelogCollapsed, setChangelogCollapsed] = useState(true);
    const popperAnchorEl = useRef<HTMLDivElement | null>(null);
    const client = getRestAPIClient();

    let NotificationIcon = NotificationsNoneIcon;
    let tipText = '';
    if (props?.status?.updateAvailable) {
        NotificationIcon = NotificationImportantIcon;
        tipText = 'Update available';
    }

    const updateInfo = props.status?.updateInfo;
    const notifications = props.status?.notifications;

    const handleOpen = () => {
        setopen(true)
    }

    const handleStartUpdate = async () => {
        store.setStateProp({
            prop: 'status',
            payload: {
                ...store.getState().status,
                isUpdating: true,
            }
        });

        try {
            await client.launchCmsUpdate();
        } catch (error) {
            console.error(error);
        }

        await updateStatus();
    }

    const toggleChangelog = () => {
        setChangelogCollapsed(!changelogCollapsed)
    }

    return (
        <div ref={popperAnchorEl}>
            <Tooltip title={tipText}>
                <IconButton
                    onClick={handleOpen}
                >
                    <NotificationIcon htmlColor={props.color} />
                </IconButton>
            </Tooltip>
            <Popover open={open} anchorEl={popperAnchorEl.current}
                style={{ zIndex: 9999 }}
                onClose={() => setopen(false)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Grid container className={styles.list}>
                    {props.status?.isUpdating && (
                        <Grid item container xs={12} className={clsx(styles.update, styles.updating)}>
                            <h3 className={styles.updateTitle}>
                                <UpdateIcon style={{ marginRight: '7px' }} />
                                Update in progress...</h3>
                            <LinearProgress className={styles.updateProgress} />
                        </Grid>
                    )}
                    {props.status?.updateAvailable && updateInfo && !props.status?.isUpdating && (
                        <Grid item container xs={12} className={styles.update}>
                            <h3 className={styles.updateTitle}>
                                <UpdateIcon style={{ marginRight: '7px' }} />
                                Update available</h3>
                            <p>{props.status?.currentVersion ?? ''} {'>'} {updateInfo.version}</p>
                            <div className={styles.changelogTitle}>
                                <p onClick={toggleChangelog}>See changelog</p>
                                <ExpandMoreIcon
                                    className={clsx(styles.expand, !changelogCollapsed && styles.expandOpen)}
                                    onClick={toggleChangelog}
                                />
                            </div>
                            <Collapse in={!changelogCollapsed} timeout="auto" unmountOnExit>
                                <div className={styles.changelogList}
                                    dangerouslySetInnerHTML={{ __html: updateInfo.changelog }}></div>
                            </Collapse>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={handleStartUpdate}
                            >Update</Button>
                        </Grid>
                    )}
                    {notifications && (
                        notifications.map((note, index) => {
                            let severity: AlertProps['severity'] = 'info';
                            if (note.type === 'warning') severity = 'warning';
                            if (note.type === 'error') severity = 'error';
                            return (
                                <Grid key={index} item container xs={12} className={styles.item}>
                                    <Alert severity={severity} className={styles.alert}>{note.message}</Alert>
                                </Grid>
                            )
                        })
                    )}
                </Grid>
            </Popover>
        </div>
    )
}

export default connect(mapStateToProps)(NotificationCenter);
