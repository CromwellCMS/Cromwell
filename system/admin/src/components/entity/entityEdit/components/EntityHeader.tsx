import { IconButton } from '@components/buttons/IconButton';
import { TextButton } from '@components/buttons/TextButton';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { Box, SxProps, Tooltip } from '@mui/material';
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
    <PageStickyHeader
      title={title}
      onSave={onSave}
      goBack={goBack}
      isSaving={isSaving}
      frontendUrl={frontendUrl}
      centerContent={customElements?.getEntityHeaderCenter?.(fieldProps)}
      frontendUrlTooltip={`Open ${(entityType ?? entityCategory).toLocaleLowerCase()} in the new tab`}
    />
  );
}

export function PageStickyHeader({
  title,
  centerContent,
  leftContent,
  frontendUrl,
  goBack,
  onSave,
  isSaving,
  frontendUrlTooltip,
  sx,
  hideSaveButton,
  disableSaveButton,
}: {
  frontendUrl?: string;
  frontendUrlTooltip?: string;
  title?: string;
  centerContent?: React.ReactNode;
  leftContent?: React.ReactNode;
  goBack?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  sx?: SxProps;
  hideSaveButton?: boolean;
  disableSaveButton?: boolean;
}) {
  return (
    <ElevationScroll>
      <Box sx={{ ...sx }}>
        {leftContent ? (
          leftContent
        ) : (
          <div className={styles.headerLeft}>
            <IconButton onClick={goBack} className="mr-2">
              <ChevronLeftIcon className="h-6 w-6 text-gray-600 hover:text-indigo:-400" />
            </IconButton>
            <p className={styles.pageTitle}>{title}</p>
          </div>
        )}

        {centerContent}

        <div className={styles.headerActions}>
          {frontendUrl && (
            <Tooltip title={frontendUrlTooltip}>
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
            {!hideSaveButton && (
              <TextButton className={styles.saveBtn} disabled={isSaving || disableSaveButton} onClick={onSave}>
                Save
              </TextButton>
            )}
          </div>
        </div>
      </Box>
    </ElevationScroll>
  );
}
