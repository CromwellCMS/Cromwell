import { getRestApiClient } from '@cromwell/core-frontend';
import { Grid, IconButton, LinearProgress, Popover, Tooltip } from '@material-ui/core';
import {
    NotificationImportant as NotificationImportantIcon,
    NotificationsNone as NotificationsNoneIcon,
    Update as UpdateIcon,
} from '@material-ui/icons';
import { HelpOutline as HelpOutlineIcon } from '@material-ui/icons';
import { Alert, AlertProps } from '@material-ui/lab';
import clsx from 'clsx';
import React, { useRef, useState } from 'react';
import { connect, PropsType } from 'react-redux-ts';

import { updateStatus } from '../../redux/helpers';
import { store, TAppState } from '../../redux/store';
import styles from './NotificationCenter.module.scss';
import UpdateInfoCard from './UpdateInfoCard';


const mapStateToProps = (state: TAppState) => {
    return {
        status: state.status
    }
}
type TPropsType = PropsType<PropsType, { color?: string },
    ReturnType<typeof mapStateToProps>>;


function NotificationCenter(props: TPropsType) {
    const [open, setOpen] = useState(false);
    const popperAnchorEl = useRef<HTMLDivElement | null>(null);
    const client = getRestApiClient();

    let NotificationIcon = NotificationsNoneIcon;
    let tipText = '';
    if (props?.status?.updateAvailable) {
        NotificationIcon = NotificationImportantIcon;
        tipText = 'Update available';
    }

    const updateInfo = props.status?.updateInfo;
    const notifications = props.status?.notifications;

    const handleOpen = () => {
        if (!notifications?.length && !updateInfo) return;
        setOpen(true)
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


    return (
        <div ref={popperAnchorEl}>
            <Tooltip title={tipText}>
                <IconButton
                    onClick={handleOpen}
                    style={{
                        cursor: notifications?.length ? 'pointer' : 'initial',
                        opacity: notifications?.length ? '1' : '0.6',
                    }}
                >
                    <NotificationIcon htmlColor={props.color} />
                </IconButton>
            </Tooltip>
            <Popover open={open} anchorEl={popperAnchorEl.current}
                style={{ zIndex: 9999 }}
                onClose={() => setOpen(false)}
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
                        <UpdateInfoCard
                            updateInfo={updateInfo}
                            currentVersion={props.status?.currentVersion}
                            onStartUpdate={handleStartUpdate}
                        />
                    )}
                    {notifications && (
                        notifications.map((note, index) => {
                            let severity: AlertProps['severity'] = 'info';
                            if (note.type === 'warning') severity = 'warning';
                            if (note.type === 'error') severity = 'error';
                            return (
                                <Grid key={index} item container xs={12} className={styles.item}>
                                    <Alert severity={severity} className={styles.alert}
                                        classes={{ message: styles.message }}>
                                        <p>{note.message}</p>
                                        {note.documentationLink && (
                                            <Tooltip title="Documentation">
                                                <IconButton
                                                    onClick={() => window.open(note.documentationLink, '_blank')}>
                                                    <HelpOutlineIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Alert>
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
