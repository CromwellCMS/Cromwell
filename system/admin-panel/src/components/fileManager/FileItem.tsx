import { IconButton, MenuItem } from '@mui/material';
import {
  Description as DescriptionIcon,
  FolderOpen as FolderOpenIcon,
  ZoomIn as ZoomInIcon,
} from '@mui/icons-material';
import React from 'react';
import LazyLoad from 'react-lazy-load';

import styles from './FileManager.module.scss';
import { TItemType } from './types';

export type ListItemProps = {
  selectedFileName?: string;
  currentPath?: string;
  getItemType: (fileName: string) => TItemType;
  normalize: (fileName: string) => string;
  onItemClick: (itemName: string) => (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  openPreview: (fileName: string) => void;
};

export type TFileItemProps = {
  data: string;
  listItemProps: ListItemProps;
};

export const FileItem = (props: TFileItemProps) => {
  const item = props.data;
  const { currentPath, getItemType, normalize, onItemClick, openPreview, selectedFileName } = props.listItemProps;
  const itemType: TItemType = getItemType(item);
  let ItemIcon;
  const isSelected = selectedFileName === item;

  if (itemType === 'file') {
    ItemIcon = <DescriptionIcon className={styles.itemIcon} />;
  }
  if (itemType === 'image') {
    ItemIcon = (
      <div className={styles.itemImageContainer}>
        <LazyLoad height={60} offsetVertical={60} className={styles.itemImageContainer}>
          <img className={styles.itemImage} src={normalize(`/${currentPath}/${item}`)} />
        </LazyLoad>
      </div>
    );
  }
  if (itemType === 'folder') {
    ItemIcon = <FolderOpenIcon className={styles.itemIcon} />;
  }

  return (
    <MenuItem
      className={`${styles.item} ${isSelected ? styles.selectedItem : ''}`}
      onClick={onItemClick(item)}
      id={'item__' + item}
      key={item}
    >
      {itemType === 'image' && (
        <IconButton
          className={styles.zoomItemBtn}
          onClick={(e) => {
            e.stopPropagation();
            openPreview(item);
          }}
        >
          <ZoomInIcon />
        </IconButton>
      )}
      {ItemIcon}
      <p>{item}</p>
    </MenuItem>
  );
};
