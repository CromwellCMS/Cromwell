import { getRestApiClient } from '@cromwell/core-frontend';
import {
  HelpOutline as HelpOutlineIcon,
  NotificationImportant as NotificationImportantIcon,
  NotificationsNone as NotificationsNoneIcon,
  Update as UpdateIcon,
} from '@mui/icons-material';
import { Alert, AlertProps, Grid, IconButton, LinearProgress, Popover, Tooltip } from '@mui/material';
import { getCmsStatus, setCmsStatus, updateCmsStatus, useCmsStatus } from '@store/cmsStatus';
import clsx from 'clsx';
import React, { useRef, useState } from 'react';

import { askConfirmation } from '../modal/Confirmation';
import { toast } from '../toast/toast';
import styles from './NotificationCenter.module.scss';
import UpdateInfoCard from './UpdateInfoCard';

function NotificationCenter(props: { color?: string }) {
  const [open, setOpen] = useState(false);
  const popperAnchorEl = useRef<HTMLDivElement | null>(null);
  const client = getRestApiClient();
  const status = useCmsStatus();

  let NotificationIcon = NotificationsNoneIcon;
  let tipText = '';
  if (status?.updateAvailable) {
    NotificationIcon = NotificationImportantIcon;
    tipText = 'Update available';
  }

  const updateInfo = status?.updateInfo;
  const notifications = status?.notifications;

  const handleOpen = () => {
    if (!notifications?.length && !updateInfo) return;
    setOpen(true);
  };

  const handleStartUpdate = async () => {
    setCmsStatus({
      ...getCmsStatus()!,
      isUpdating: true,
    });

    let success = false;
    try {
      success = (await client.launchCmsUpdate()) || false;
    } catch (error) {
      console.error(error);
    }
    await updateCmsStatus();

    if (success) {
      toast.success('CMS updated');
      const confirm = await askConfirmation({
        title: `CMS has been updated. Please reload this page to apply changes`,
      });
      if (confirm) {
        window.location.reload();
      }
    } else toast.error('Failed to update CMS');
  };

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
      <Popover
        open={open}
        anchorEl={popperAnchorEl.current}
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
          {status?.isUpdating && (
            <Grid item container xs={12} className={clsx(styles.update, styles.updating)}>
              <h3 className={styles.updateTitle}>
                <UpdateIcon style={{ marginRight: '7px' }} />
                Update in progress...
              </h3>
              <LinearProgress className={styles.updateProgress} />
            </Grid>
          )}
          {status?.updateAvailable && updateInfo && !status?.isUpdating && (
            <UpdateInfoCard
              updateInfo={updateInfo}
              currentVersion={status?.currentVersion}
              onStartUpdate={handleStartUpdate}
            />
          )}
          {notifications &&
            notifications.map((note, index) => {
              let severity: AlertProps['severity'] = 'info';
              if (note.type === 'warning') severity = 'warning';
              if (note.type === 'error') severity = 'error';
              return (
                <Grid key={index} item container xs={12} className={styles.item}>
                  <Alert severity={severity} className={styles.alert} classes={{ message: styles.message }}>
                    <p>{note.message}</p>
                    {note.documentationLink && (
                      <Tooltip title="Documentation">
                        <IconButton onClick={() => window.open(note.documentationLink, '_blank')}>
                          <HelpOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Alert>
                </Grid>
              );
            })}
        </Grid>
      </Popover>
    </div>
  );
}

export default NotificationCenter;
