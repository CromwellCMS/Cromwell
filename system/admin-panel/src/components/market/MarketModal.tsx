import { TCCSModuleInfo, TPackageCromwellConfig } from '@cromwell/core';
import { CGallery } from '@cromwell/core-frontend';
import { Badge, Button, Typography, Tooltip, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { HelpOutline as HelpOutlineIcon } from '@mui/icons-material';

import styles from './MarketModal.module.scss';

export default function MarketModal(props: {
  data: TCCSModuleInfo | TPackageCromwellConfig;
  installedModules?: TPackageCromwellConfig[];
  noInstall?: boolean;
  install?: (info: TCCSModuleInfo | TPackageCromwellConfig) => Promise<boolean>;
}) {
  const { data, installedModules } = props;
  const [installing, setInstalling] = useState(false);
  const [installed, setInstalled] = useState(
    !!(data?.name && installedModules?.find((inst) => inst.name === data?.name)),
  );

  const installModule = async () => {
    if (!props.install) return;
    setInstalling(true);
    const success = await props.install(data);
    if (success) setInstalled(true);
    setInstalling(false);
  };

  return (
    <div className={styles.MarketModal}>
      <div className={styles.header}>
        <div>
          <Badge color="secondary" badgeContent={installed ? 'installed' : null}>
            <Typography gutterBottom variant="h5" component="h3" className={styles.title}>
              {data?.title ?? ''}
            </Typography>
          </Badge>
          <p className={styles.version}>
            {data?.version ?? ''} by {data?.author ?? ''}
          </p>
        </div>
        <div>
          {data?.link && (
            <Tooltip title="Documentation">
              <IconButton onClick={() => window.open(data.link, '_blank')}>
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
          )}
          {!props.noInstall && (
            <Button
              disabled={installed || installing}
              size="small"
              color="primary"
              variant="contained"
              onClick={installModule}
            >
              Install
            </Button>
          )}
        </div>
      </div>
      {data?.images && (
        <div className={styles.images}>
          <CGallery
            id="MarketModal_gallery"
            gallery={{
              images: data.images.map((url) => ({
                src: url,
              })),
              height: 300,
              navigation: true,
              thumbs: {
                backgroundSize: 'contain',
              },
              backgroundSize: 'contain',
              lazy: true,
              visibleSlides: 1,
            }}
          />
        </div>
      )}
      {data?.description && (
        <div className={styles.description} dangerouslySetInnerHTML={{ __html: data?.description }}></div>
      )}
    </div>
  );
}
