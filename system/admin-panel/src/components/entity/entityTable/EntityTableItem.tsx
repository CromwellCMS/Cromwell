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

    const tableColumns = props.listItemProps.tableProps.columns;

    return (
        <div className={styles.listItem}>
            <div className={commonStyles.center}>
                <Checkbox
                    checked={selected}
                    onChange={() => props.listItemProps.toggleSelection(data)} />
            </div>
            <div className={styles.columns}>
                {tableColumns.map(prop => (
                    <div className={styles.column}
                        key={prop.name}
                        style={{
                            width: prop.width ? prop.width + 'px' : 100 / tableColumns.length + '%',
                            minWidth: prop.minWidth,
                            maxWidth: prop.maxWidth,
                        }}
                    >
                        <p>{data?.[prop.name] ?? ''}</p>
                    </div>
                ))}
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