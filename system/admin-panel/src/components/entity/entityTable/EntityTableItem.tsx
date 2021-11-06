import { TBasePageEntity } from '@cromwell/core';
import { DeleteForever as DeleteForeverIcon, Edit as EditIcon } from '@mui/icons-material';
import { Checkbox, IconButton } from '@mui/material';
import React from 'react';
import { connect, PropsType } from 'react-redux-ts';
import { Link } from 'react-router-dom';

import { TAppState } from '../../../redux/store';
import commonStyles from '../../../styles/common.module.scss';
import { TBaseEntityFilter } from '../types';
import { TListItemProps } from './EntityTable';
import styles from './EntityTableItem.module.scss';

const mapStateToProps = (state: TAppState) => {
    return {
        selectedItems: state.selectedItems,
        allSelected: state.allSelected,
    }
}

type TEntityTableItemProps<TEntityType extends TBasePageEntity, TFilterType extends TBaseEntityFilter>
    = PropsType<PropsType, {
        data?: TEntityType;
        listItemProps: TListItemProps<TEntityType, TFilterType>;
    }, ReturnType<typeof mapStateToProps>>;


const EntityTableItem = <TEntityType extends TBasePageEntity, TFilterType extends TBaseEntityFilter>(props: TEntityTableItemProps<TEntityType, TFilterType>) => {
    const { data } = props;
    let selected = false;
    if (props.allSelected && !props.selectedItems[data.id]) selected = true;
    if (!props.allSelected && props.selectedItems[data.id]) selected = true;

    const tableColumns = props.listItemProps.getColumns();

    return (
        <div className={styles.listItem}>
            <div className={commonStyles.center}>
                <Checkbox
                    checked={selected}
                    onChange={() => props.listItemProps.toggleSelection(data)} />
            </div>
            <div className={styles.columns}>
                {!!tableColumns?.length && tableColumns.map(col => {
                    if (col.hidden) return null;
                    const value = !col.meta ? data?.[col.name] : data?.customMeta?.[col.name];
                    return (
                        <div className={styles.column}
                            key={col.name}
                            style={props.listItemProps.getColumnStyles(col, tableColumns)}
                        >
                            {col.type === 'Select' || col.type === 'Simple text' && (
                                <p className={styles.ellipsis}
                                >{value ?? ''}</p>
                            )}
                            {col.type === 'Color' && (
                                <div style={{
                                    width: '30px',
                                    height: '30px',
                                    backgroundColor: value,
                                }}></div>
                            )}
                            {col.type === 'Image' && (
                                <div className={styles.imageItem}
                                    style={{ backgroundImage: `url(${value})` }}
                                ></div>
                            )}
                            {col.type === 'Datetime' && (
                                <p>{toLocaleDateTimeString(value)}</p>
                            )}
                            {col.type === 'Date' && (
                                <p>{toLocaleDateString(value)}</p>
                            )}
                            {col.type === 'Time' && (
                                <p>{toLocaleTimeString(value)}</p>
                            )}
                        </div>
                    )
                })}
            </div>
            <div className={styles.listItemActions}>
                {props.listItemProps.tableProps?.entityBaseRoute && props.data?.id && (
                    <Link to={`${props.listItemProps.tableProps.entityBaseRoute}/${props.data?.id}`}>
                        <IconButton
                            aria-label="edit"
                        >
                            <EditIcon />
                        </IconButton>
                    </Link>
                )}
                {props.data?.id && (
                    <IconButton
                        aria-label="delete"
                        onClick={() => props.listItemProps.handleDeleteBtnClick(props.data)}
                    >
                        <DeleteForeverIcon />
                    </IconButton>
                )}
            </div>
        </div>
    );
}

export default connect(mapStateToProps)(EntityTableItem);

const toLocaleDateTimeString = (date: Date | string | undefined) => {
    if (!date) return '';
    if (typeof date === 'string') date = new Date(date);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

const toLocaleDateString = (date: Date | string | undefined) => {
    if (!date) return '';
    if (typeof date === 'string') date = new Date(date);
    return date.toLocaleDateString();
}

const toLocaleTimeString = (date: Date | string | undefined) => {
    if (!date) return '';
    if (typeof date === 'string') date = new Date(date);
    return date.toLocaleTimeString();
}