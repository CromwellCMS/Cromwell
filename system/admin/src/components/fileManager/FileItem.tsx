import { IconButton } from '@components/buttons/IconButton';
import { DocumentTextIcon, FolderIcon, MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';
import { MenuItem, Tooltip } from '@mui/material';
import React from 'react';
import LazyLoad from 'react-lazy-load';

import styles from './FileManager.module.scss';
import { TItemType } from './types';

export type ListItemProps = {
  selectedFileName?: string | null;
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
    ItemIcon = <DocumentTextIcon className={styles.itemIcon} />;
  }
  if (itemType === 'image') {
    ItemIcon = (
      <div className={styles.itemImageContainer}>
        <LazyLoad height={60} offset={60} className={styles.itemImageContainer}>
          <img className={styles.itemImage} src={normalize(`/${currentPath}/${item}`)} />
        </LazyLoad>
      </div>
    );
  }
  if (itemType === 'folder') {
    ItemIcon = <FolderIcon className={styles.itemIcon} />;
  }

  const currentLink = window.location.origin + normalize(`/${currentPath}/${item}`);

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
          <MagnifyingGlassPlusIcon className="w-4 h-4" />
        </IconButton>
      )}
      {ItemIcon}
      <div className={styles.itemTextContainer}>
        <Tooltip
          title={
            <a href={currentLink} className={styles.itemTextTooltip} target="_blank" rel="noreferrer">
              {currentLink}
            </a>
          }
        >
          <p className={styles.itemText}>{item}</p>
        </Tooltip>
      </div>
    </MenuItem>
  );
};
