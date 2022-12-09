import { ViewListIcon } from '@heroicons/react/24/outline';
import { UnfoldLess as UnfoldLessIcon, UnfoldMore as UnfoldMoreIcon } from '@mui/icons-material';
import { Box, Tooltip } from '@mui/material';
import clsx from 'clsx';
import React from 'react';

import { IconButton } from '../../../components/buttons/IconButton';
import { TView } from '../CategoryList';
import styles from '../CategoryList.module.scss';

export function HeaderActions({
  view,
  setView,
  collapseAll,
  expandAll,
}: {
  view: TView;
  setView: (value: TView) => void;
  collapseAll: () => void;
  expandAll: () => void;
}) {
  return (
    <Box className={styles.HeaderActions}>
      {view === 'tree' && (
        <>
          <Tooltip title="Expand all">
            <IconButton aria-label="Expand all" onClick={expandAll}>
              <UnfoldMoreIcon style={{ width: '1.25rem', height: '1.25rem' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Collapse all">
            <IconButton aria-label="Collapse all" onClick={collapseAll}>
              <UnfoldLessIcon style={{ width: '1.25rem', height: '1.25rem' }} />
            </IconButton>
          </Tooltip>
        </>
      )}
      <Tooltip title={`Switch to ${view === 'list' ? 'tree' : 'list'} view`}>
        <IconButton onClick={() => setView(view === 'list' ? 'tree' : 'list')}>
          {view === 'list' ? (
            <div
              className={clsx(styles.switchViewIcon, 'w-5 h-5')}
              style={{ backgroundImage: `url(/admin/static/subfolder.png)` }}
            ></div>
          ) : (
            <ViewListIcon className={clsx('w-5 h-5')} />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
}
