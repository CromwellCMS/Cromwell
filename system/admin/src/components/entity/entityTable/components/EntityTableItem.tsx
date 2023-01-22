import { TBasePageEntity } from '@cromwell/core';
import { getCStore } from '@cromwell/core-frontend';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Rating, Tooltip } from '@mui/material';
import clsx from 'clsx';
import React, { useRef, useState } from 'react';
import { connect, PropsType } from 'react-redux-ts';
import { Link, useLocation } from 'react-router-dom';

import { toLocaleDateString, toLocaleDateTimeString, toLocaleTimeString } from '../../../../helpers/time';
import { TAppState } from '../../../../redux/store';
import commonStyles from '../../../../styles/common.module.scss';
import { IconButton } from '../../../buttons/IconButton';
import { CheckboxInput } from '../../../inputs/CheckboxInput';
import { TBaseEntityFilter, TListItemProps } from '../../types';
import styles from './EntityTableItem.module.scss';

const mapStateToProps = (state: TAppState) => {
  return {
    selectedItems: state.selectedItems,
    allSelected: state.allSelected,
  };
};

type TEntityTableItemProps<TEntityType extends TBasePageEntity, TFilterType extends TBaseEntityFilter> = PropsType<
  PropsType,
  {
    data?: TEntityType;
    numberOnScreen?: number;
    listItemProps: TListItemProps<TEntityType, TFilterType>;
    // prevItemProps?: {}
  },
  ReturnType<typeof mapStateToProps>
>;

function EntityTableItem<TEntityType extends TBasePageEntity, TFilterType extends TBaseEntityFilter>(
  props: TEntityTableItemProps<TEntityType, TFilterType>,
) {
  // private columnRefs: Record<string, React.RefObject<HTMLDivElement>> = {};
  const columnRefs = useRef<Record<string, React.RefObject<HTMLDivElement>>>({});
  const [forcedData, setForcedData] = useState<TEntityType | undefined | null>();
  const location = useLocation();

  const { listItemProps, numberOnScreen } = props;
  const data: TEntityType = forcedData || props.data;
  const cstore = getCStore();
  let selected = false;
  if (props.allSelected && !props.selectedItems[data.id]) selected = true;
  if (!props.allSelected && props.selectedItems[data.id]) selected = true;
  const tableColumns = props.listItemProps.getColumns();

  return (
    <div className={clsx(styles.listItem)} style={{ backgroundColor: numberOnScreen % 2 ? '#fafafa' : '#eee' }}>
      <div className={commonStyles.center}>
        <CheckboxInput checked={selected} onChange={() => props.listItemProps.toggleSelection(data)} />
      </div>
      <div className={styles.columns}>
        {!!tableColumns?.length &&
          tableColumns.map((col) => {
            if (!col.visible) return null;
            const value = !col.meta ? data?.[col.name] : data?.customMeta?.[col.name];
            let tooltipValue = value ?? '';
            let content;

            if (!columnRefs.current[col.name]) columnRefs.current[col.name] = React.createRef();

            if (col.type === 'Select' || col.type === 'Simple text') {
              content = (
                <p className={styles.ellipsis} ref={columnRefs.current[col.name]}>
                  {value ?? ''}
                </p>
              );
            }
            if (col.type === 'Color') {
              content = (
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: value,
                    borderRadius: '100%',
                  }}
                ></div>
              );
            }
            if (col.type === 'Image') {
              content = (
                <div className={styles.imageItemContainer}>
                  <div className={styles.imageItem} style={{ backgroundImage: value && `url(${value})` }}></div>
                </div>
              );
            }
            if (col.type === 'Datetime') {
              tooltipValue = toLocaleDateTimeString(value);
              content = (
                <p className={styles.ellipsis} ref={columnRefs.current[col.name]}>
                  {toLocaleDateTimeString(value)}
                </p>
              );
            }
            if (col.type === 'Date') {
              tooltipValue = toLocaleDateString(value);
              content = (
                <p className={styles.ellipsis} ref={columnRefs.current[col.name]}>
                  {toLocaleDateString(value)}
                </p>
              );
            }
            if (col.type === 'Time') {
              tooltipValue = toLocaleTimeString(value);
              content = (
                <p className={styles.ellipsis} ref={columnRefs.current[col.name]}>
                  {toLocaleTimeString(value)}
                </p>
              );
            }
            if (col.type === 'Currency') {
              tooltipValue = cstore.getPriceWithCurrency(value);
              content = (
                <p className={styles.ellipsis} ref={columnRefs.current[col.name]}>
                  {cstore.getPriceWithCurrency(value)}
                </p>
              );
            }
            if (col.type === 'Rating') {
              content = <Rating name="read-only" size="small" value={value ?? 0} precision={0.5} readOnly />;
            }
            if (col.type === 'Checkbox') {
              content = <CheckboxInput checked={!!value} disabled />;
            }

            if (col.getValueView) {
              content = (
                <div className={styles.ellipsis} ref={columnRefs.current[col.name]}>
                  {col.getValueView(value)}
                </div>
              );
            }
            if (col.getTooltipValueView) {
              tooltipValue = <div style={{ whiteSpace: 'pre-line' }}>{col.getTooltipValueView(value)}</div>;
            }

            const TooltipContent = (props: { title: string }): any => {
              let title;
              if (
                col.type === 'Color' ||
                col.type === 'Image' ||
                col.type === 'Date' ||
                col.type === 'Datetime' ||
                col.type === 'Time'
              )
                title = props.title;
              const element = columnRefs.current[col.name]?.current;
              // Ellipsis
              if (element && element.offsetWidth < element.scrollWidth) title = props.title;
              if (title) return <div className={styles.tooltip}>{title}</div>;
              return null;
            };

            return (
              <div className={styles.column} key={col.name} style={listItemProps.getColumnStyles(col, tableColumns)}>
                <Tooltip
                  classes={{ popper: styles.cellTooltipPaper }}
                  title={<TooltipContent title={tooltipValue ?? ''} />}
                  enterDelay={0}
                >
                  {content ?? <></>}
                </Tooltip>
              </div>
            );
          })}
        <div
          className={styles.listItemActions}
          style={{
            ...listItemProps.getColumnStyles({ name: 'actions', label: 'Actions' }, tableColumns),
            minWidth: listItemProps.actionsWidth + (listItemProps.tableProps?.customActionsWidth || 0) + 'px',
          }}
        >
          {data && listItemProps.tableProps?.customElements?.getItemCustomActions && (
            <div className={styles.customActions}>
              {listItemProps.tableProps.customElements.getItemCustomActions({
                data,
                changeData: (d: TEntityType) => setForcedData(d),
              })}
            </div>
          )}
          {listItemProps.tableProps?.entityBaseRoute && data?.id && (
            <Link
              to={`${listItemProps.tableProps.entityBaseRoute}/${data?.id}`}
              state={{ prevRoute: location.pathname + location.search }}
            >
              <IconButton>
                <PencilIcon className="h-4 text-gray-300 w-4" />
              </IconButton>
            </Link>
          )}
          {data?.id && (
            <IconButton className="ml-0" onClick={() => listItemProps.handleDeleteBtnClick(data)}>
              <TrashIcon aria-label="delete" className="h-4 text-gray-300 w-4" />
            </IconButton>
          )}
        </div>
      </div>
    </div>
  );
}

export default connect(mapStateToProps)(EntityTableItem);
