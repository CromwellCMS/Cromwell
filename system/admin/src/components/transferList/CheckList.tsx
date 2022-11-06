import { Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';

import { CheckboxInput } from '../inputs/CheckboxInput';
import { intersection, not, union } from './helpers';
import styles from './TransferList.Module.scss';

export const CheckList = (props: {
  title: React.ReactNode;
  items: string[];
  itemComp?: React.ComponentType<{ value: string }>;
  itemProps?: any;
  checked: string[];
  setChecked: (items: string[]) => any;
  actions?: React.ReactNode;
  fullWidthToggle?: boolean;
  className?: string;
}) => {
  const { title, items, checked, setChecked, fullWidthToggle } = props;

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: string[]) => intersection(checked, items).length;

  const handleToggleAll = (items: string[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  return (
    <div className={props.className}>
      <div style={{ padding: '16px', display: 'flex', alignItems: 'center' }} className={styles.cardHeader}>
        <div style={{ marginRight: '16px' }}>
          <CheckboxInput
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
            disabled={items.length === 0}
            inputProps={{ 'aria-label': 'all items selected' }}
          />
        </div>
        <div>
          {typeof title !== 'object' ? <p style={{ fontWeight: 500, fontSize: '1rem' }}>{title}</p> : title}
          <p style={{ fontSize: '0.8rem' }}>{`${numberOfChecked(items)}/${items.length} selected`}</p>
        </div>
        {props.actions}
      </div>
      <Divider />
      <List className={styles.list} dense role="list">
        {items.map((value: string, index: number) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem
              key={index}
              disableRipple
              role="listitem"
              onClick={() => {
                if (fullWidthToggle !== false) handleToggle(value)();
              }}
              button={fullWidthToggle !== false ? true : undefined}
            >
              <ListItemIcon
                onClick={() => {
                  if (fullWidthToggle === false) handleToggle(value)();
                }}
              >
                <CheckboxInput
                  color="primary"
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              {props.itemComp ? (
                <props.itemComp value={value} {...(props.itemProps ?? {})} />
              ) : (
                <ListItemText id={labelId} primary={value} />
              )}
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </div>
  );
};
