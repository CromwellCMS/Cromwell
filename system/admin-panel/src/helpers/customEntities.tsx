import { EDBEntity, getStoreItem, TAdminCustomEntity, TCustomEntity, TCustomEntityFilter, TCustomEntityColumn } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import React from 'react';

import EntityEdit from '../components/entity/entityEdit/EntityEdit';
import EntityTable from '../components/entity/entityTable/EntityTable';
import { TEntityPageProps } from '../components/entity/types';
import sidebarStyles from '../components/sidebar/Sidebar.module.scss';
import { TPageInfo, TSidebarLink } from '../constants/PageInfos';
import { store } from '../redux/store';
import { formatTimeAgo } from './time';

const customEntities: Record<string, TAdminCustomEntity> = {};

export const registerCustomEntity = (options: TAdminCustomEntity) => {
    const hasBeenRegistered = !!customEntities[options.entityType];
    customEntities[options.entityType] = options;
    if (!hasBeenRegistered) getStoreItem('forceUpdatePage')?.();
}

export const unregisterCustomEntity = (entityType: string) => {
    delete customEntities[entityType];
    store.getState().forceUpdateSidebar?.();
}

export const getCustomEntities = (): TAdminCustomEntity[] => {
    return Object.values(customEntities);
}

const getEntityRoutes = (entity: TAdminCustomEntity) => {
    if (entity.entityBaseRoute && !entity.entityBaseRoute.startsWith('/'))
        entity.entityBaseRoute = '/' + entity.entityBaseRoute;

    if (entity.entityListRoute && !entity.entityListRoute.startsWith('/'))
        entity.entityListRoute = '/' + entity.entityListRoute;

    const entityBaseRoute = (entity.entityBaseRoute ?? '/' + entity.entityType).toLowerCase();
    const entityListRoute = (entity.entityListRoute ?? entityBaseRoute).toLowerCase();

    return {
        entityBaseRoute,
        entityListRoute,
    }
}

// PagesInfo for react-router
export const getCustomEntityPages = (): TPageInfo[] => {
    const pages: TPageInfo[] = [];

    Object.values(customEntities).forEach((entity) => {
        const entityRoutes = getEntityRoutes(entity);
        const client = getGraphQLClient();

        const entityPageProps: TEntityPageProps<TCustomEntity, Partial<TCustomEntityFilter>> = {
            entityCategory: EDBEntity.CustomEntity,
            entityBaseRoute: entityRoutes.entityBaseRoute,
            entityListRoute: entityRoutes.entityListRoute,
            entityType: entity.entityType,
            columns: entity.columns,
            listLabel: entity.listLabel,
            entityLabel: entity.entityLabel,
            renderFields: () => <></>,
            getInput: () => ({ entityType: entity.entityType }),
            getById: (...args) => client.getCustomEntityById(entity.entityType, ...args),
            deleteOne: (...args) => client.deleteCustomEntity(entity.entityType, ...args),
            deleteMany: (input) => client.deleteManyCustomEntities(input, { entityType: entity.entityType }),
            getMany: client.getCustomEntities,
            update: client.updateCustomEntity,
            create: client.createCustomEntity,
        }

        const ListComp = () => {
            return (
                <EntityTable
                    {...entityPageProps}
                />
            )
        }
        pages.push({
            name: entity.entityType,
            route: entityRoutes.entityListRoute,
            component: ListComp,
            permissions: ['read_custom_entities', entity.permissions?.read as any].filter(Boolean),
        });

        const EntityComp = () => {
            return (
                <EntityEdit
                    {...entityPageProps}
                />
            )
        }
        pages.push({
            name: entity.entityType,
            route: entityRoutes.entityBaseRoute + '/:id',
            component: EntityComp,
            permissions: ['read_custom_entities', entity.permissions?.read as any].filter(Boolean),
        });
    });
    return pages;
}

// Links for sidebar
export const getCustomEntitySidebarLinks = (): TSidebarLink[] => {
    const links: TSidebarLink[] = [];

    Object.values(customEntities).forEach((entity) => {
        const entityRoutes = getEntityRoutes(entity);
        links.push({
            id: entity.entityType,
            title: entity.listLabel,
            route: entityRoutes.entityListRoute,
            icon: entity.icon && React.createElement('div', {
                className: sidebarStyles.customIcon,
                style: { backgroundImage: `url(${entity.icon})` }
            }),
            permissions: ['read_custom_entity', entity.permissions?.read as any].filter(Boolean),
        })
    });
    return links;
}

export const baseEntityColumns: TCustomEntityColumn[] = [
    {
        name: 'id',
        label: 'ID',
        type: 'Simple text',
        exactSearch: true,
    },
    {
        name: 'slug',
        label: 'Slug',
        type: 'Simple text',
    },
    {
        name: 'createDate',
        label: 'Created',
        type: 'Datetime',
        getValueView: (value) => formatTimeAgo(value),
    },
    {
        name: 'updateDate',
        label: 'Updated',
        type: 'Datetime',
        getValueView: (value) => formatTimeAgo(value),
    }
];