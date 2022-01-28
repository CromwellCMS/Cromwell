import { TGetStaticProps } from '@cromwell/core';
import { CPlugin } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React from 'react';

import { useModuleState } from '../../helpers/state';
import styles from './CategoryFilter.module.scss';

const filterPluginName = '@cromwell/plugin-product-filter';

export type CategoryFilterProps = {
  classes?: Partial<Record<'root' | 'plugin', string>>;
}

/**
 * Renders product filter on a category page. A wrapper for plugin from 
 * `@cromwell/plugin-product-filter`
 * 
 * - `withGetProps` - required
 */
export function CategoryFilter(props: CategoryFilterProps) {
  const moduleState = useModuleState();
  return (
    <div className={clsx(styles.CategoryFilter, props.classes?.root)}>
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
    </div>
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