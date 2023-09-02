import { TrashIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@mui/material';
import { countSelectedItems, useSelectedItems } from '@store/selectedItems';
import React from 'react';

import { IconButton } from '../../../buttons/IconButton';
import styles from '../EntityTable.module.scss';

const DeleteSelectedButton = (props: {
  onClick: () => void;
  style?: React.CSSProperties;
  totalElements?: number | null;
}) => {
  const { allSelected } = useSelectedItems();
  const enabled = countSelectedItems(props.totalElements) > 0 || allSelected;
  return (
    <div style={props.style}>
      <Tooltip title="Delete selected">
        <div>
          <IconButton
            className={styles.iconButton}
            disabled={!enabled}
            onClick={props.onClick}
            aria-label="Delete selected"
          >
            <TrashIcon className="w-5 h-5" />
          </IconButton>
        </div>
      </Tooltip>
    </div>
  );
};

export default DeleteSelectedButton;
