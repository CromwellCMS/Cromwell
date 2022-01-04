import { TBaseFilter, TGetStaticProps, TPagedList, TPluginEntity } from '@cromwell/core';
import { CContainer, CPlugin, getGraphQLClient } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React from 'react';

import { moduleState } from '../../helpers/state';
import styles from './CategoryFilter.module.scss';

const filterPluginName = '@cromwell/plugin-product-filter';

export type CategoryFilterProps = {
  classes?: Partial<Record<'root' | 'plugin', string>>;
  style?: React.CSSProperties;
}

export function CategoryFilter(props: CategoryFilterProps) {
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
    const client = getGraphQLClient();

    // We want to register plugin manually run-time, for that we need to
    // imitate plugin info fetching from API server as in the case
    // when plugin registered in config file or DB (when user places it in Theme editor)
    const filteredData: TPagedList<TPluginEntity> | null = (await client
      .getFilteredEntities<TPluginEntity, TBaseFilter>(
        'Plugin', client.PluginFragment, 'PluginFragment', {
        filterParams: {
          filters: [
            {
              key: 'name',
              value: filterPluginName,
              exact: true
            }
          ]
        }
      }).catch(e => console.error(e))) || null;

    const entity = filteredData?.elements?.[0];

    return {
      ...originProps,
      extraPlugins: [
        {
          pluginName: filterPluginName,
          // It's better to pass `version` in `extraPlugins` to allow caching
          version: entity?.version || null,
          globalSettings: entity?.settings && JSON.parse(entity?.settings) || null,
        }
      ]
    }
  }

  return getProps;
}
