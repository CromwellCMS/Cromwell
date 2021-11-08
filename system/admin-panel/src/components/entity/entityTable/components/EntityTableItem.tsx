import { TBasePageEntity } from '@cromwell/core';
import { getCStore } from '@cromwell/core-frontend';
import { DeleteForever as DeleteForeverIcon, Edit as EditIcon } from '@mui/icons-material';
import { Checkbox, IconButton, Rating, Tooltip } from '@mui/material';
import React from 'react';
import { connect, PropsType } from 'react-redux-ts';
import { Link } from 'react-router-dom';

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


class EntityTableItem<TEntityType extends TBasePageEntity, TFilterType extends TBaseEntityFilter>
    extends React.Component<TEntityTableItemProps<TEntityType, TFilterType>> {

    render() {
        const { data, listItemProps } = this.props;
        const cstore = getCStore();
        let selected = false;
        if (this.props.allSelected && !this.props.selectedItems[data.id]) selected = true;
        if (!this.props.allSelected && this.props.selectedItems[data.id]) selected = true;
        const tableColumns = this.props.listItemProps.getColumns();

        return (
            <div className={styles.listItem}>
                <div className={commonStyles.center}>
                    <Checkbox
                        checked={selected}
                        onChange={() => this.props.listItemProps.toggleSelection(data)} />
                </div>
                <div className={styles.columns}>
                    {!!tableColumns?.length && tableColumns.map(col => {
                        if (!col.visible) return null;
                        const value = !col.meta ? data?.[col.name] : data?.customMeta?.[col.name];
                        let content;

                        if (col.type === 'Select' || col.type === 'Simple text') {
                            content = (
                                <Tooltip title={value ?? ''} enterDelay={1500}>
                                    <p className={styles.ellipsis}
                                    >{value ?? ''}</p>
                                </Tooltip>
                            )
                        }
                        if (col.type === 'Color') {
                            content = (
                                <Tooltip title={value ?? ''} enterDelay={1500}>
                                    <div style={{
                                        width: '30px',
                                        height: '30px',
                                        backgroundColor: value,
                                        borderRadius: '100%',
                                    }}></div>
                                </Tooltip>
                            )
                        }
                        if (col.type === 'Image') {
                            content = (
                                <Tooltip title={value ?? ''} enterDelay={1500}>
                                    <div className={styles.imageItem}
                                        style={{ backgroundImage: value && `url(${value})` }}
                                    ></div>
                                </Tooltip>
                            )
                        }
                        if (col.type === 'Datetime') {
                            content = (
                                <Tooltip title={toLocaleDateTimeString(value)} enterDelay={1500}>
                                    <p className={styles.ellipsis}>{toLocaleDateTimeString(value)}</p>
                                </Tooltip>
                            )
                        }
                        if (col.type === 'Date') {
                            content = (
                                <Tooltip title={toLocaleDateString(value)} enterDelay={1500}>
                                    <p className={styles.ellipsis}>{toLocaleDateString(value)}</p>
                                </Tooltip>
                            )
                        }
                        if (col.type === 'Time') {
                            content = (
                                <Tooltip title={toLocaleTimeString(value)} enterDelay={1500}>
                                    <p className={styles.ellipsis}>{toLocaleTimeString(value)}</p>
                                </Tooltip>
                            )
                        }
                        if (col.type === 'Currency') {
                            content = (
                                <Tooltip title={cstore.getPriceWithCurrency(value) ?? ''} enterDelay={1500}>
                                    <p className={styles.ellipsis}>{cstore.getPriceWithCurrency(value)}</p>
                                </Tooltip>
                            )
                        }

                        if (col.type === 'Rating') {
                            content = (
                                <Tooltip title={(value ?? '') + ''} enterDelay={1500}>
                                    <Rating name="read-only"
                                        size="small"
                                        value={value ?? 0}
                                        precision={0.5}
                                        readOnly
                                    />
                                </Tooltip>
                            )
                        }

                        if (col.getValueView) {
                            content = col.getValueView(value);
                        }

                        return (
                            <div className={styles.column}
                                key={col.name}
                                style={listItemProps.getColumnStyles(col, tableColumns)}
                            >{content}</div>
                        )
                    })}
                </div>
                <div className={styles.listItemActions}>
                    {data && listItemProps.tableProps?.customElements?.getListItemActions?.(data, this)}
                    {listItemProps.tableProps?.entityBaseRoute && data?.id && (
                        <Link to={`${listItemProps.tableProps.entityBaseRoute}/${data?.id}`}>
                            <IconButton
                                aria-label="edit"
                            >
                                <EditIcon />
                            </IconButton>
                        </Link>
                    )}
                    {data?.id && (
                        <IconButton
                            aria-label="delete"
                            onClick={() => listItemProps.handleDeleteBtnClick(data)}
                        >
                            <DeleteForeverIcon />
                        </IconButton>
                    )}
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(EntityTableItem);
