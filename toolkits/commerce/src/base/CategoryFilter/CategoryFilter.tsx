import { TGetStaticProps } from '@cromwell/core';
import { CContainer, CPlugin } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React from 'react';

import { useModuleState } from '../../helpers/state';
import styles from './CategoryFilter.module.scss';

const filterPluginName = '@cromwell/plugin-product-filter';

export type CategoryFilterProps = {
  classes?: Partial<Record<'root' | 'plugin', string>>;
  style?: React.CSSProperties;
}

export function CategoryFilter(props: CategoryFilterProps) {
  const moduleState = useModuleState();
  return (
    <CContainer id="ccom_category_filter"
      className={clsx(styles.CategoryFilter, props.classes?.root)}
      style={props.style}
    >
      <CPlugin
        id="ccom_category_filter_plugin"
        className={clsx(props.classes?.plugin)}
        plugin={{
          pluginName: filterPluginName,
          instanceSettings: {
            listId: moduleState.categoryListId,
          }
        }}
      />
    </CContainer>
  )
}

CategoryFilter.withGetProps = (originalGetProps?: TGetStaticProps) => {
  const getProps: TGetStaticProps = async (context) => {
    const originProps: any = (await originalGetProps?.(context)) ?? {};

    return {
      ...originProps,
      extraPlugins: [filterPluginName],
    }
  }

  return getProps;
}