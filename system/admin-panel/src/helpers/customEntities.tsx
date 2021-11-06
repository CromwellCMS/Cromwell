import { EDBEntity, getStoreItem, TAdminCustomEntity, TCustomEntity, TCustomEntityFilter } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import React from 'react';

import EntityEdit from '../components/entity/entityEdit/EntityEdit';
import EntityTable from '../components/entity/entityTable/EntityTable';
import { TEntityPageProps } from '../components/entity/types';
import sidebarStyles from '../components/sidebar/Sidebar.module.scss';
import { TPageInfo, TSidebarLink } from '../constants/PageInfos';
import { store } from '../redux/store';

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
    const entityListRoute = (entity.entityListRoute ?? entityBaseRoute + '-list').toLowerCase();

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

        const entityPageProps: TEntityPageProps<TCustomEntity, TCustomEntityFilter> = {
            entityCategory: EDBEntity.CustomEntity,
            entityBaseRoute: entityRoutes.entityBaseRoute,
            entityListRoute: entityRoutes.entityListRoute,
            entityType: entity.entityType,
            columns: entity.columns,
            listLabel: entity.listLabel,
            entityLabel: entity.entityLabel,
            renderFields: () => <></>,
            getInput: () => ({ entityType: entity.entityType }),
            getById: client.getCustomEntityById,
            deleteOne: client.deleteCustomEntity,
            deleteMany: client.deleteManyCustomEntities,
            deleteManyFiltered: client.deleteManyFilteredCustomEntities,
            getManyFiltered: client.getFilteredCustomEntities,
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
            roles: ['administrator', 'guest', 'author'],
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
            roles: ['administrator', 'guest', 'author'],
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
            roles: ['administrator', 'guest', 'author'],
        })
    });
    return links;
}