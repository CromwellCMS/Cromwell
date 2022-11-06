import clsx from 'clsx';
import React, { useEffect } from 'react';

import { CheckboxInput } from '../../../components/inputs/CheckboxInput';
import { useForceUpdate } from '../../../helpers/forceUpdate';
import styles from './SearchInput.module.scss';

export type ListItemProps<TItemData extends { id: number | string }> = {
  handleItemClick: (data: TItemData) => any;
  getOptionLabel: (data: TItemData) => string;
  getOptionValue?: (data: TItemData) => string;
  pickedItems?: string[];
  multiple?: boolean;
  ItemComponent?: (props: { data: TItemData }) => JSX.Element;
  addMultiSelectListener: (id: string, listener: (pickedItems: string[]) => any) => any;
  removeMultiSelectListener: (id: string) => any;
};

export type TListItem = <TItemData extends { id: number | string }>(props: {
  data?: TItemData;
  listItemProps: ListItemProps<TItemData>;
}) => JSX.Element;

export const ListItem: TListItem = (props) => {
  const {
    pickedItems,
    getOptionValue,
    getOptionLabel,
    handleItemClick,
    multiple,
    ItemComponent,
    addMultiSelectListener,
    removeMultiSelectListener,
  } = props.listItemProps;
  const pickedText = getOptionValue?.(props.data) ?? getOptionLabel(props.data);
  const picked = pickedItems?.includes(pickedText);
  const update = useForceUpdate();

  useEffect(() => {
    if (props.data?.id) {
      addMultiSelectListener(props.data.id + '', (picked) => {
        props.listItemProps.pickedItems = picked;
        update();
      });
    }
    return () => {
      if (props.data?.id) {
        removeMultiSelectListener(props.data.id + '');
      }
    };
  }, []);

  return (
    <div onClick={() => handleItemClick(props.data)} className={styles.itemWrapper}>
      {multiple && <CheckboxInput checked={picked} style={{ marginLeft: '10px' }} />}
      {ItemComponent ? (
        <ItemComponent data={props.data} />
      ) : (
        <p className={clsx(styles.itemText)}>{getOptionLabel(props.data)}</p>
      )}
    </div>
  );
};
