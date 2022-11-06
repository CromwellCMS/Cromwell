import { TrashIcon } from '@heroicons/react/outline';
import { Tooltip } from '@mui/material';
import React from 'react';
import { connect, PropsType } from 'react-redux-ts';

import { countSelectedItems } from '../../../../redux/helpers';
import { TAppState } from '../../../../redux/store';
import { IconButton } from '../../../buttons/IconButton';
import styles from '../EntityTable.module.scss';

const mapStateToProps = (state: TAppState) => {
  return {
    selectedItems: state.selectedItems,
    allSelected: state.allSelected,
  };
};

const DeleteSelectedButton = (
  props: PropsType<
    PropsType,
    {
      onClick: () => void;
      style?: React.CSSProperties;
      totalElements?: number | null;
    },
    ReturnType<typeof mapStateToProps>
  >,
) => {
  const enabled = countSelectedItems(props.totalElements) > 0;
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

export default connect(mapStateToProps)(DeleteSelectedButton);
