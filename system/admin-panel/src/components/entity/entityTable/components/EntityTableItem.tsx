import { TBasePageEntity } from '@cromwell/core';
import { DeleteForever as DeleteForeverIcon, Edit as EditIcon } from '@mui/icons-material';
import { Checkbox, IconButton, Tooltip } from '@mui/material';
import React from 'react';
import { connect, PropsType } from 'react-redux-ts';
import { Link } from 'react-router-dom';
import { getCStore } from '@cromwell/core-frontend';

import { toLocaleDateString, toLocaleDateTimeString, toLocaleTimeString } from '../../../../helpers/time';
import { TAppState } from '../../../../redux/store';
import commonStyles from '../../../../styles/common.module.scss';
import { TBaseEntityFilter } from '../../types';
import { TListItemProps } from '../EntityTable';
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
    const cstore = getCStore();
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
                    if (!col.visible) return null;
                    const value = !col.meta ? data?.[col.name] : data?.customMeta?.[col.name];
                    return (
                        <div className={styles.column}
                            key={col.name}
                            style={props.listItemProps.getColumnStyles(col, tableColumns)}
                        >
                            {col.type === 'Select' || col.type === 'Simple text' && (
                                <Tooltip title={value ?? ''} enterDelay={1500}>
                                    <p className={styles.ellipsis}
                                    >{value ?? ''}</p>
                                </Tooltip>
                            )}
                            {col.type === 'Color' && (
                                <Tooltip title={value ?? ''} enterDelay={1500}>
                                    <div style={{
                                        width: '30px',
                                        height: '30px',
                                        backgroundColor: value,
                                    }}></div>
                                </Tooltip>
                            )}
                            {col.type === 'Image' && (
                                <Tooltip title={value ?? ''} enterDelay={1500}>
                                    <div className={styles.imageItem}
                                        style={{ backgroundImage: value && `url(${value})` }}
                                    ></div>
                                </Tooltip>
                            )}
                            {col.type === 'Datetime' && (
                                <Tooltip title={toLocaleDateTimeString(value)} enterDelay={1500}>
                                    <p className={styles.ellipsis}>{toLocaleDateTimeString(value)}</p>
                                </Tooltip>
                            )}
                            {col.type === 'Date' && (
                                <Tooltip title={toLocaleDateString(value)} enterDelay={1500}>
                                    <p className={styles.ellipsis}>{toLocaleDateString(value)}</p>
                                </Tooltip>
                            )}
                            {col.type === 'Time' && (
                                <Tooltip title={toLocaleTimeString(value)} enterDelay={1500}>
                                    <p className={styles.ellipsis}>{toLocaleTimeString(value)}</p>
                                </Tooltip>
                            )}
                            {col.type === 'Currency' && (
                                <Tooltip title={cstore.getPriceWithCurrency(value) ?? ''} enterDelay={1500}>
                                    <p className={styles.ellipsis}>{cstore.getPriceWithCurrency(value)}</p>
                                </Tooltip>
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
