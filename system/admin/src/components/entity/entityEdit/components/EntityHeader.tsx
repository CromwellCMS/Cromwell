import { IconButton } from '@components/buttons/IconButton';
import { TextButton } from '@components/buttons/TextButton';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import clsx from 'clsx';
import React, { useContext } from 'react';

import commonStyles from '../../../../styles/common.module.scss';
import styles from '../EntityEdit.module.scss';
import { EntityEditContext } from '../helpers';
import { ElevationScroll } from './ElevationScroll';

export function EntityHeader() {
  const {
    pageProps: { entityLabel, entityType, entityCategory, customElements },
    fieldProps,
  } = useContext(EntityEditContext);

  const { frontendUrl, isSaving, onSave, goBack } = fieldProps;

  const title = entityLabel ?? entityType ?? entityCategory;

  return (
    <ElevationScroll>
      <AppBar position="sticky" color="transparent" elevation={0}>
        <div className={styles.headerLeft}>
          <IconButton onClick={goBack} className="mr-2">
            <ChevronLeftIcon className="h-6 w-6 text-gray-600 hover:text-indigo:-400" />
          </IconButton>
          <p className={styles.pageTitle}>{title}</p>
        </div>
        {customElements?.getEntityHeaderCenter?.(fieldProps)}
        <div className={styles.headerActions}>
          {frontendUrl && (
            <Tooltip title={`Open ${(entityType ?? entityCategory).toLocaleLowerCase()} in the new tab`}>
              <IconButton
                className={clsx(styles.openPageBtn, 'w-9 h-9')}
                aria-label="open"
                onClick={() => {
                  window.open(frontendUrl, '_blank');
                }}
              >
                <OpenInNewIcon style={{ width: '100%', height: '100%' }} />
              </IconButton>
            </Tooltip>
          )}
          <div className={commonStyles.center}>
            <TextButton className={styles.saveBtn} disabled={isSaving} onClick={onSave}>
              Save
            </TextButton>
          </div>
        </div>
      </AppBar>
    </ElevationScroll>
  );
}
