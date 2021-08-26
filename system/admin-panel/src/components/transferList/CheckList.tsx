import { Checkbox, Divider, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import React from 'react';

import { intersection, not, union } from './helpers';
import styles from './TransferList.Module.scss';

export const CheckList = (props: {
    title: React.ReactNode;
    items: string[];
    itemComp?: React.ComponentType<{ value: string }>;
    checked: string[];
    setChecked: (items: string[]) => any;
    actions?: React.ReactNode;
    fullWidthToggle?: boolean;
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
        <div>
            <div
                style={{ padding: '16px', display: 'flex', alignItems: 'center' }}
                className={styles.cardHeader}
            >
                <div style={{ marginRight: '16px' }}>
                    <Checkbox
                        color="primary"
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
                        disabled={items.length === 0}
                        inputProps={{ 'aria-label': 'all items selected' }}
                    />

                </div>
                <div>
                    {typeof title !== 'object' ? (
                        <p style={{ fontWeight: 500, fontSize: '1.1em', marginBottom: '6px' }}>{title}</p>
                    ) : title}
                    <p>{`${numberOfChecked(items)}/${items.length} selected`}</p>
                </div>
                {props.actions}
            </div>
            <Divider />
            <List className={styles.list} dense role="list">
                {items.map((value: string, index: number) => {
                    const labelId = `transfer-list-all-item-${value}-label`;

                    return (
                        <ListItem key={index}
                            role="listitem" onClick={() => {
                                if (fullWidthToggle !== false) handleToggle(value)();
                            }}
                            button={fullWidthToggle !== false ? true : undefined}
                        >
                            <ListItemIcon
                                onClick={() => {
                                    if (fullWidthToggle === false) handleToggle(value)();
                                }}>
                                <Checkbox
                                    color="primary"
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            {props.itemComp ? (
                                <props.itemComp value={value} />
                            ) : (
                                <ListItemText id={labelId} primary={value} />
                            )}
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </div >
    )
}